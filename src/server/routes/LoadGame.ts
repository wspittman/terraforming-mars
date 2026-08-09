import * as responses from '../server/responses';
import {Database} from '../database/Database';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {LoadGameFormModel} from '../../common/models/LoadGameFormModel';
import {Request} from '../Request';
import {Response} from '../Response';
import {GameId, isGameId, isPlayerId} from '../../common/Types';

export class LoadGame extends Handler {
  public static readonly INSTANCE = new LoadGame();
  private constructor() {
    super();
  }

  private async getGameId(id: string): Promise<GameId | undefined> {
    if (isGameId(id)) {
      return id;
    }
    if (isPlayerId(id)) {
      console.log(`Finding game for player ${id}`);
      return await Database.getInstance().getGameId(id);
    }
    return undefined;
  }

  public override put(req: Request, res: Response, ctx: Context): Promise<void> {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', function(data) {
        body += data.toString();
      });
      req.once('end', async () => {
        try {
          const gameReq: LoadGameFormModel = JSON.parse(body);

          const gameId = await this.getGameId(gameReq.gameId);
          if (gameId === undefined) {
            throw new Error('Invalid game id');
          }
          // This should probably be behind some kind of verification that prevents just
          // anyone from rolling back a large number of steps.
          const rollbackCount = gameReq.rollbackCount;
          if (rollbackCount > 0) {
            Database.getInstance().deleteGameNbrSaves(gameId, rollbackCount);
          }
          const game = await ctx.gameLoader.getGame(gameId, /* bypassCache */ true);
          if (game === undefined) {
            console.warn(`unable to find ${gameId} in database`);
            responses.notFound(req, res, 'game_id not found');
          } else {
            const humanPlayers = game.players.filter((player) => !player.isBot);
            if (humanPlayers.length !== 1) {
              throw new Error(`game ${game.id} must contain exactly one human player`);
            }
            responses.writeJson(res, ctx, {id: game.id, playerId: humanPlayers[0].id});
          }
        } catch (error) {
          responses.internalServerError(req, res, error);
        }
        resolve();
      });
    });
  }
}
