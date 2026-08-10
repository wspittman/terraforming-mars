import { expect } from 'chai';
import { BoardName } from '../../src/common/boards/BoardName';
import { NewGameConfig } from '../../src/common/game/NewGameConfig';
import { statusCode } from '../../src/common/http/statusCode';
import { RandomMAOptionType } from '../../src/common/ma/RandomMAOptionType';
import { NewGameResponse } from '../../src/common/game/NewGameConfig';
import { ApiCreateGame } from '../../src/server/routes/ApiCreateGame';
import { FakeClock } from '../common/FakeClock';
import { MockRequest, MockResponse } from './HttpMocks';
import { RouteTestScaffolding } from './RouteTestScaffolding';
import { ROBOT_NAMES } from '../../src/server/bots/BotUtils';

describe('ApiCreateGame', () => {
  let scaffolding: RouteTestScaffolding;
  let req: MockRequest;
  let res: MockResponse;
  let apiCreateGame: ApiCreateGame;

  beforeEach(() => {
    req = new MockRequest();
    res = new MockResponse();
    scaffolding = new RouteTestScaffolding(req);
    apiCreateGame = new ApiCreateGame([{ limit: 99999, perMs: 1 }]);
  });


  it('no get', async () => {
    await scaffolding.get(apiCreateGame, res);
    expect(res.statusCode).eq(statusCode.notFound);
    expect(res.content).eq('Not found');
  });

  it('simple create', async () => {
    const post = scaffolding.post(apiCreateGame, res);
    const emit = Promise.resolve().then(() => {
      const newGameConfig: NewGameConfig = {
        player: {
          name: 'Human',
          color: 'blue',
          beginner: false,
          handicap: 0,
        },
        playerCount: 4,
        corporateEra: true,
        board: 'hellas' as BoardName,
        seed: 0,
        randomFirstPlayer: false,
        clonedGamedId: undefined,
        undoOption: false,
        showTimers: false,
        fastModeOption: false,
        showOtherPlayersVP: false,
        modularMA: false,
        draftVariant: false,
        initialDraft: false,
        startingCorporations: 0,
        shuffleMapOption: false,
        randomMA: RandomMAOptionType.NONE,
        includeFanMA: false,
        soloTR: false,
        customCorporations: [],
        bannedCards: [],
        includedCards: [],
        escapeVelocity: undefined,
      };
      req.emitter.emit('data', JSON.stringify(newGameConfig));
      req.emitter.emit('end');
    });
    await Promise.all([emit, post]);
    expect(res.statusCode).eq(statusCode.ok);
    expect(res.headers.get('Content-Type')).eq('application/json');
    const model = JSON.parse(res.content) as NewGameResponse;
    expect(model.id).is.not.undefined;
    expect(model.id.startsWith('g')).is.true;
    const game = await scaffolding.ctx.gameLoader.getGame(model.id);
    expect(game).is.not.undefined;
    expect(model.playerId).eq(game!.players[0].id);
    expect(model).not.to.have.property('players');
    expect(game!.players[0].name).eq('Human');
    const botNames = game!.players.slice(1).map((player) => player.name);
    expect(new Set(botNames).size).eq(3);
    expect(botNames.every((name) => ROBOT_NAMES.includes(name as typeof ROBOT_NAMES[number]))).is.true;
    expect(game!.players.map((player) => player.isBot)).deep.eq([false, true, true, true]);
    expect(game!.gameOptions.corporateEra).is.true;
    expect(game!.gameOptions.boardName).eq(BoardName.THARSIS);
  });

  it('creates an original solo game without bots', async () => {
    const post = scaffolding.post(apiCreateGame, res);
    const emit = Promise.resolve().then(() => {
      const newGameConfig: NewGameConfig = {
        player: {name: 'Solo Human', color: 'red', beginner: false, handicap: 0},
        playerCount: 1,
        corporateEra: true,
        board: BoardName.THARSIS,
        seed: 0,
        randomFirstPlayer: false,
        clonedGamedId: undefined,
        undoOption: false,
        showTimers: false,
        fastModeOption: false,
        showOtherPlayersVP: false,
        modularMA: false,
        draftVariant: true,
        initialDraft: false,
        startingCorporations: 2,
        shuffleMapOption: false,
        randomMA: RandomMAOptionType.NONE,
        includeFanMA: false,
        soloTR: true,
        customCorporations: [],
        bannedCards: [],
        includedCards: [],
        escapeVelocity: undefined,
      };
      req.emitter.emit('data', JSON.stringify(newGameConfig));
      req.emitter.emit('end');
    });

    await Promise.all([emit, post]);

    const model = JSON.parse(res.content) as NewGameResponse;
    const game = await scaffolding.ctx.gameLoader.getGame(model.id);
    expect(res.statusCode).eq(statusCode.ok);
    expect(game?.players).has.length(1);
    expect(game?.players[0].isBot).is.false;
    expect(game?.isSoloMode()).is.true;
    expect(game?.gameOptions.soloTR).is.true;
    expect(game?.gameOptions.draftVariant).is.false;
  });

  it('red rover solo game', async () => {
    const post = scaffolding.post(apiCreateGame, res);
    const emit = Promise.resolve().then(() => {
      scaffolding.req.emitter.emit(
        'data',
        JSON.stringify({ players: [{ name: 'a player', color: 'red' }] }),
      );
      scaffolding.req.emitter.emit('end');
    });
    await Promise.all([emit, post]);

    expect(res.statusCode).eq(statusCode.internalServerError);
  });

  // Issues one create-game POST against `handler`, using fresh request/response objects,
  // reusing `scaffolding.ctx` (and therefore its ip and clock) across calls.
  function postGame(
    handler: ApiCreateGame,
    request: MockRequest,
    response: MockResponse,
  ) {
    const post = handler.post(request, response, scaffolding.ctx);
    const emit = Promise.resolve().then(() => {
      request.emitter.emit(
        'data',
        JSON.stringify({ players: [{ name: 'a player', color: 'red' }] }),
      );
      request.emitter.emit('end');
    });
    return Promise.all([emit, post]);
  }

  it('a quota handler does not block while under its limit', async () => {
    const apiCreateGame = new ApiCreateGame([{ limit: 1, perMs: 120_000 }]);

    const req1 = new MockRequest();
    const res1 = new MockResponse();
    await postGame(apiCreateGame, req1, res1);
    expect(res1.statusCode).not.eq(statusCode.tooManyRequests);
  });

  it('a quota handler blocks once its limit is exceeded', async () => {
    const apiCreateGame = new ApiCreateGame([{ limit: 1, perMs: 120_000 }]);

    const req1 = new MockRequest();
    const res1 = new MockResponse();
    await postGame(apiCreateGame, req1, res1);
    expect(res1.statusCode).not.eq(statusCode.tooManyRequests);

    const req2 = new MockRequest();
    const res2 = new MockResponse();
    await postGame(apiCreateGame, req2, res2);
    expect(res2.statusCode).eq(statusCode.tooManyRequests);
    expect(res2.content).eq('Quota exceeded');
  });

  it('two quota handlers do not block while both are under their limits', async () => {
    const apiCreateGame = new ApiCreateGame([
      { limit: 99999, perMs: 1 },
      { limit: 99999, perMs: 1 },
    ]);

    const req1 = new MockRequest();
    const res1 = new MockResponse();
    await postGame(apiCreateGame, req1, res1);
    expect(res1.statusCode).not.eq(statusCode.tooManyRequests);
  });

  it('two quota handlers block when the first exceeds its limit and the second does not', async () => {
    const apiCreateGame = new ApiCreateGame([
      { limit: 1, perMs: 120_000 },
      { limit: 99999, perMs: 1 },
    ]);

    const req1 = new MockRequest();
    const res1 = new MockResponse();
    await postGame(apiCreateGame, req1, res1);
    expect(res1.statusCode).not.eq(statusCode.tooManyRequests);

    const req2 = new MockRequest();
    const res2 = new MockResponse();
    await postGame(apiCreateGame, req2, res2);
    expect(res2.statusCode).eq(statusCode.tooManyRequests);
    expect(res2.content).eq('Quota exceeded');
  });

  it('two quota handlers block when the first does not exceed its limit but the second does', async () => {
    const apiCreateGame = new ApiCreateGame([
      { limit: 99999, perMs: 1 },
      { limit: 1, perMs: 120_000 },
    ]);

    const req1 = new MockRequest();
    const res1 = new MockResponse();
    await postGame(apiCreateGame, req1, res1);
    expect(res1.statusCode).not.eq(statusCode.tooManyRequests);

    const req2 = new MockRequest();
    const res2 = new MockResponse();
    await postGame(apiCreateGame, req2, res2);
    expect(res2.statusCode).eq(statusCode.tooManyRequests);
    expect(res2.content).eq('Quota exceeded');
  });

  it('elapsed time restores a blocked quota', async () => {
    const apiCreateGame = new ApiCreateGame([{ limit: 1, perMs: 120_000 }]);
    const clock = scaffolding.ctx.clock as FakeClock;

    const req1 = new MockRequest();
    const res1 = new MockResponse();
    await postGame(apiCreateGame, req1, res1);
    expect(res1.statusCode).not.eq(statusCode.tooManyRequests);

    const req2 = new MockRequest();
    const res2 = new MockResponse();
    await postGame(apiCreateGame, req2, res2);
    expect(res2.statusCode).eq(statusCode.tooManyRequests);

    clock.millis += 120_001;

    const req3 = new MockRequest();
    const res3 = new MockResponse();
    await postGame(apiCreateGame, req3, res3);
    expect(res3.statusCode).not.eq(statusCode.tooManyRequests);
  });
});
