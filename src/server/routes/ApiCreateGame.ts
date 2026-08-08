import * as responses from '../server/responses';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Database} from '../database/Database';
import {BoardName} from '../../common/boards/BoardName';
import {RandomBoardOption} from '../../common/boards/RandomBoardOption';
import {Cloner} from '../database/Cloner';
import {Game} from '../Game';
import {GameOptions} from '../game/GameOptions';
import {Player} from '../Player';
import {Server} from '../models/ServerModel';
import {NewGameConfig} from '../../common/game/NewGameConfig';
import {safeCast, isGameId, isSpectatorId, isPlayerId} from '../../common/Types';
import {generateRandomId} from '../utils/server-ids';
import {IGame} from '../IGame';
import {Request} from '../Request';
import {Response} from '../Response';
import {QuotaConfig, QuotaHandler} from '../server/QuotaHandler';
import {durationToMilliseconds} from '../utils/durations';
import {DEFAULT_EXPANSIONS} from '../../common/cards/GameModule';

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

  public static boardOptions(board: RandomBoardOption | BoardName): Array<BoardName> {
    const allBoards = Object.values(BoardName);

    if (board === RandomBoardOption.ALL) {
      return allBoards;
    }
    if (board === RandomBoardOption.OFFICIAL) {
      return allBoards.filter((name) => {
        return name === BoardName.THARSIS ||
          name === BoardName.HELLAS ||
          name === BoardName.ELYSIUM;
      });
    }
    return [board];
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
          const players = gameReq.players.map((p) => {
            return new Player(
              p.name,
              p.color,
              p.beginner,
              Number(p.handicap), // For some reason handicap is coming up a string.
              safeCast(generateRandomId('p'), isPlayerId),
            );
          });
          let firstPlayerIdx = 0;
          for (let i = 0; i < gameReq.players.length; i++) {
            if (gameReq.players[i].first === true) {
              firstPlayerIdx = i;
              break;
            }
          }

          const boards = ApiCreateGame.boardOptions(gameReq.board);
          gameReq.board = boards[Math.floor(Math.random() * boards.length)];

          const expansions = {
            ...DEFAULT_EXPANSIONS,
            corpera: gameReq.corporateEra,
          };

          const gameOptions: GameOptions = {
            altVenusBoard: false,
            aresExtension: expansions.ares,
            aresHazards: true, // Not a runtime option.
            aresExtremeVariant: false,
            bannedCards: gameReq.bannedCards,
            boardName: gameReq.board,
            ceoExtension: expansions.ceo,
            clonedGamedId: gameReq.clonedGamedId,
            coloniesExtension: expansions.colonies,
            communityCardsOption: expansions.community,
            expansions,
            ceosDraftVariant: false,
            corporateEra: expansions.corpera,
            customCeos: [],
            customCorporationsList: gameReq.customCorporationsList,
            customPreludes: [],
            draftVariant: gameReq.draftVariant,
            escapeVelocity: gameReq.escapeVelocity,
            fastModeOption: gameReq.fastModeOption,
            includedCards: gameReq.includedCards,
            includeFanMA: gameReq.includeFanMA,
            initialDraftVariant: gameReq.initialDraft,
            modularMA: gameReq.modularMA,
            moonExpansion: expansions.moon,
            moonStandardProjectVariant: false,
            moonStandardProjectVariant1: false,
            pathfindersExpansion: expansions.pathfinders,
            prelude2Expansion: expansions.prelude2,
            preludeDraftVariant: false,
            preludeExtension: expansions.prelude,
            promoCardsOption: expansions.promo,
            randomMA: gameReq.randomMA,
            removeNegativeGlobalEventsOption: false,
            requiresMoonTrackCompletion: false,
            requiresVenusTrackCompletion: false,
            showOtherPlayersVP: gameReq.showOtherPlayersVP,
            showTimers: gameReq.showTimers,
            shuffleMapOption: gameReq.shuffleMapOption,
            solarPhaseOption: gameReq.solarPhaseOption,
            soloTR: gameReq.soloTR,
            startingCeos: 0,
            startingCorporations: gameReq.startingCorporations,
            startingPreludes: 0,
            starWarsExpansion: expansions.starwars,
            turmoilExtension: expansions.turmoil,
            twoCorpsVariant: false,
            underworldExpansion: expansions.underworld,
            deltaProjectExpansion: expansions.deltaProject,
            undoOption: gameReq.undoOption,
            venusNextExtension: expansions.venus,
          };

          let game: IGame;
          if (gameOptions.clonedGamedId !== undefined && !gameOptions.clonedGamedId.startsWith('#')) {
            const serialized = await Database.getInstance().getGameVersion(gameOptions.clonedGamedId, 0);
            game = Cloner.clone(gameId, players, firstPlayerIdx, serialized);
          } else {
            const seed = Math.random();
            game = Game.newInstance(gameId, players, players[firstPlayerIdx], spectatorId, gameOptions, seed);
          }
          ctx.gameLoader.add(game);
          responses.writeJson(res, ctx, Server.getSimpleGameModel(game));
        } catch (error) {
          responses.internalServerError(req, res, error);
        }
        resolve();
      });
    });
  }
}
