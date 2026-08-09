import * as responses from '../server/responses';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Database} from '../database/Database';
import {BoardName} from '../../common/boards/BoardName';
import {Cloner} from '../database/Cloner';
import {Game} from '../Game';
import {GameOptions} from '../game/GameOptions';
import {Player} from '../Player';
import {NewGameConfig} from '../../common/game/NewGameConfig';
import {safeCast, isGameId, isSpectatorId, isPlayerId} from '../../common/Types';
import {generateRandomId} from '../utils/server-ids';
import {IGame} from '../IGame';
import {Request} from '../Request';
import {Response} from '../Response';
import {QuotaConfig, QuotaHandler} from '../server/QuotaHandler';
import {durationToMilliseconds} from '../utils/durations';
import {PLAYER_COLORS} from '../../common/Color';

function parseQuotaConfig(struct: any): QuotaConfig {
  let {limit} = struct;
  const {per} = struct;
  if (limit === undefined) {
    throw new Error('limit is absent');
  }
  limit = Number.parseInt(limit);
  if (isNaN(limit)) {
    throw new Error('limit is invalid');
  }
  if (per === undefined) {
    throw new Error('per is absent');
  }
  const perMs = durationToMilliseconds(per);
  if (isNaN(perMs)) {
    throw new Error('per is invalid');
  }
  return {limit, perMs};
}

// GAME_QUOTA accepts either a single {limit, per} object, or a JSON array of
// them for multiple independent tiers (e.g. a burst limit and a daily limit).
// A request must satisfy every configured tier to succeed.
function getQuotaConfigs(): Array<QuotaConfig> {
  const defaultQuota = {limit: 1, perMs: 1}; // Effectively, no limit.
  const val = process.env.GAME_QUOTA;
  if (val) {
    try {
      const parsed = JSON.parse(val);
      const structs = Array.isArray(parsed) ? parsed : [parsed];
      if (structs.length === 0) {
        throw new Error('GAME_QUOTA array is empty');
      }
      return structs.map(parseQuotaConfig);
    } catch (e) {
      console.warn('While initialzing quota:', (e instanceof Error ? e.message : e));
    }
  }
  return [defaultQuota];
}

export class ApiCreateGame extends Handler {
  public static readonly INSTANCE = new ApiCreateGame();
  private quotaHandlers: Array<QuotaHandler>;

  public constructor(quotaConfigs: Array<QuotaConfig> = getQuotaConfigs()) {
    super();
    this.quotaHandlers = quotaConfigs.map((config) => new QuotaHandler(config));
  }

  // TODO(kberg): much of this code can be moved outside of handler, and that
  // would be better.
  public override post(req: Request, res: Response, ctx: Context): Promise<void> {
    return new Promise((resolve) => {
      const withinQuota = this.quotaHandlers.map((handler) => handler.measure(ctx)).every((ok) => ok);
      if (!withinQuota) {
        responses.quotaExceeded(req, res);
        resolve();
        return;
      }

      let body = '';
      req.on('data', function(data) {
        body += data.toString();
      });
      req.once('end', async () => {
        try {
          const gameReq = JSON.parse(body) as NewGameConfig;
          const gameId = safeCast(generateRandomId('g'), isGameId);
          const spectatorId = safeCast(generateRandomId('s'), isSpectatorId);
          if (!Number.isInteger(gameReq.playerCount) || gameReq.playerCount < 2 || gameReq.playerCount > 6) {
            throw new Error('playerCount must be an integer between 2 and 6');
          }
          if (gameReq.player === undefined || !PLAYER_COLORS.some((color) => color === gameReq.player.color)) {
            throw new Error('player must have a valid color');
          }
          const human = new Player(
            gameReq.player.name,
            gameReq.player.color,
            gameReq.player.beginner,
            Number(gameReq.player.handicap),
            safeCast(generateRandomId('p'), isPlayerId),
          );
          const botColors = PLAYER_COLORS.filter((color) => color !== human.color);
          const bots = botColors.slice(0, gameReq.playerCount - 1).map((color, index) => new Player(
            `Bot ${index + 1}`,
            color,
            false,
            0,
            safeCast(generateRandomId('p'), isPlayerId),
            true,
          ));
          const players = [human, ...bots];
          const seed = gameReq.seed >= 0 && gameReq.seed < 1 ? gameReq.seed : Math.random();
          const firstPlayerIdx = gameReq.randomFirstPlayer ? Math.floor(seed * players.length) : 0;

          const gameOptions: GameOptions = {
            bannedCards: gameReq.bannedCards,
            boardName: BoardName.THARSIS,
            clonedGamedId: gameReq.clonedGamedId,
            corporateEra: gameReq.corporateEra,
            customCorporationsList: gameReq.customCorporations,
            draftVariant: gameReq.draftVariant,
            escapeVelocity: gameReq.escapeVelocity,
            fastModeOption: gameReq.fastModeOption,
            includedCards: gameReq.includedCards,
            includeFanMA: gameReq.includeFanMA,
            initialDraftVariant: gameReq.initialDraft,
            modularMA: gameReq.modularMA,
            randomMA: gameReq.randomMA,
            showOtherPlayersVP: gameReq.showOtherPlayersVP,
            showTimers: gameReq.showTimers,
            shuffleMapOption: gameReq.shuffleMapOption,
            soloTR: gameReq.soloTR,
            startingCorporations: gameReq.startingCorporations,
            twoCorpsVariant: false,
            undoOption: gameReq.undoOption,
          };

          let game: IGame;
          if (gameOptions.clonedGamedId !== undefined && !gameOptions.clonedGamedId.startsWith('#')) {
            const serialized = await Database.getInstance().getGameVersion(gameOptions.clonedGamedId, 0);
            game = Cloner.clone(gameId, players, firstPlayerIdx, serialized);
          } else {
            game = Game.newInstance(gameId, players, players[firstPlayerIdx], spectatorId, gameOptions, seed);
          }
          ctx.gameLoader.add(game);
          responses.writeJson(res, ctx, {id: game.id, playerId: human.id});
        } catch (error) {
          responses.internalServerError(req, res, error);
        }
        resolve();
      });
    });
  }
}
