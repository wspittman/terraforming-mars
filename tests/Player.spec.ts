import { cast } from '@/common/utils/utils';
import { expect } from 'chai';
import { Color } from '../src/common/Color';
import { GlobalParameter } from '../src/common/GlobalParameter';
import { Phase } from '../src/common/Phase';
import { Resource } from '../src/common/Resource';
import { SerializedTimer } from '../src/common/SerializedTimer';
import { Timer } from '../src/common/Timer';
import { CardName } from '../src/common/cards/CardName';
import { InputResponse } from '../src/common/inputs/InputResponse';
import { PartyName } from '../src/common/turmoil/PartyName';
import { Game } from '../src/server/Game';
import { Player } from '../src/server/Player';
import { SerializedPlayer } from '../src/server/SerializedPlayer';
import { EnergyTapping } from '../src/server/cards/base/EnergyTapping';
import { Insulation } from '../src/server/cards/base/Insulation';
import { IoMiningIndustries } from '../src/server/cards/base/IoMiningIndustries';
import { LunarBeam } from '../src/server/cards/base/LunarBeam';
import { Pets } from '../src/server/cards/base/Pets';
import { PowerSupplyConsortium } from '../src/server/cards/base/PowerSupplyConsortium';
import { SaturnSystems } from '../src/server/cards/corporation/SaturnSystems';
import { OrOptions } from '../src/server/inputs/OrOptions';
import { SelectAmount } from '../src/server/inputs/SelectAmount';
import { SelectCard } from '../src/server/inputs/SelectCard';
import { SelectOption } from '../src/server/inputs/SelectOption';
import { SelectPlayer } from '../src/server/inputs/SelectPlayer';
import { testGame } from './TestGame';
import { TestPlayer } from './TestPlayer';
import { runAllActions, setRulingParty } from './TestingUtils';
import { FakeClock } from './common/FakeClock';

function playerWithRunningTimer(): [Player, FakeClock] {
  const player = new Player('blue', 'blue', false, 0, 'p-blue');
  Game.newInstance('gameid', [player], player, 'spectatorid');
  player.clearWaitingFor();
  const clock = new FakeClock();
  (Timer as any).lastStoppedAt = 0;
  player.timer = Timer.newInstance(clock);

  const firstInput = new SelectOption('First input');
  player.setWaitingFor(firstInput);
  clock.millis = 1_000;
  player.process({ type: 'option' });

  const secondInput = new SelectOption('Second input');
  player.setWaitingFor(secondInput);
  clock.millis = 2_000;
  player.process({ type: 'option' });

  expect(player.timer.getElapsed()).eq(1_000);
  return [player, clock];
}

describe('Player', () => {
  it('should initialize with right defaults', () => {
    const player = new Player('name', 'blue', false, 0, 'p-blue');
    expect(player.playedCards.corporations()).is.empty;
    expect(player.playedCards.length).eq(0);
  });

  it('Should throw error if nothing to process', () => {
    const player = new Player('blue', 'blue', false, 0, 'p-blue');
    Game.newInstance('gameid', [player], player, 'spectatorid');
    player.clearWaitingFor();

    expect(() => player.process({ type: 'option' })).to.throw(
      'Not waiting for anything',
    );
  });

  it('does not stop the timer when processing optional input', () => {
    const [player, clock] = playerWithRunningTimer();
    const elapsed = player.timer.getElapsed();

    const optionalInput = new SelectOption('Optional input');
    optionalInput.optional = true;
    player.setWaitingFor(optionalInput);
    clock.millis += 10_000;
    player.process({ type: 'option' });

    expect(player.timer.getElapsed()).eq(elapsed);
  });

  it('does not stop the timer when clearing optional input', () => {
    const [player, clock] = playerWithRunningTimer();
    const elapsed = player.timer.getElapsed();

    const optionalInput = new SelectOption('Optional input');
    optionalInput.optional = true;
    player.setWaitingFor(optionalInput);
    clock.millis += 10_000;
    player.clearWaitingFor();

    expect(player.timer.getElapsed()).eq(elapsed);
  });

  it('Should run select player for PowerSupplyConsortium', () => {
    const card = new PowerSupplyConsortium();
    const player = new Player('blue', 'blue', false, 0, 'p-blue');
    const player2 = new Player('red', 'red', false, 0, 'p-red');
    const player3 = new Player('yellow', 'yellow', false, 0, 'p-yellow');
    Game.newInstance(
      'gameid',
      [player, player2, player3],
      player,
      'spectatorid',
    );
    player2.production.add(Resource.ENERGY, 2);
    player3.production.add(Resource.ENERGY, 2);
    player.playedCards.push(new LunarBeam());
    player.playedCards.push(new EnergyTapping());
    card.play(player);
    runAllActions(player.game);
    player.process({ type: 'player', player: player2.color });
    expect(player.production.energy).to.eq(1);
  });

  it('Should error with input for run select player for PowerSupplyConsortium', () => {
    const card = new PowerSupplyConsortium();
    const player = new Player('blue', 'blue', false, 0, 'p-blue');
    const player2 = new Player('red', 'red', false, 0, 'p-red');
    Game.newInstance('gameid', [player, player2], player, 'spectatorid');
    player.clearWaitingFor();

    player.playedCards.push(new LunarBeam());
    player.playedCards.push(new EnergyTapping());
    player.production.add(Resource.ENERGY, 1);
    player2.production.add(Resource.ENERGY, 1);

    cast(card.play(player), undefined);
    runAllActions(player.game);
    cast(player.getWaitingFor(), SelectPlayer);

    expect(() => player.process({} as InputResponse)).to.throw(
      /Not a valid SelectPlayerResponse/,
    );
    expect(() => player.process({ type: 'option' })).to.throw(
      /Not a valid SelectPlayerResponse/,
    );
    expect(() => player.process({ type: 'player', player: 'yellow' })).to.throw(
      /Player not available/,
    );
  });

  it('Should run select amount for Insulation', () => {
    const card = new Insulation();
    const player = new Player('blue', 'blue', false, 0, 'p-blue');
    const redPlayer = new Player('red', 'red', false, 0, 'p-red');

    player.production.add(Resource.HEAT, 2);
    Game.newInstance('gameid', [player, redPlayer], player, 'spectatorid');
    player.defer(card.play(player));
    runAllActions(player.game);
    cast(player.getWaitingFor(), SelectAmount);

    expect(() => player.process({} as InputResponse)).to.throw(
      /Not a valid SelectAmountResponse/,
    );
    expect(() =>
      player.process({ type: 'amount', amount: 'foobar' as unknown as number }),
    ).to.throw(/Amount is not a number/);
    player.process({ type: 'amount', amount: 1 });
    expect(player.production.heat).to.eq(1);
    expect(player.production.megacredits).to.eq(1);
    cast(player.getWaitingFor(), undefined);
  });
  it('Runs SaturnSystems when other player plays card', () => {
    const player1 = new Player('blue', 'blue', false, 0, 'p-blue');
    const player2 = new Player('red', 'red', false, 0, 'p-red');
    Game.newInstance('gto', [player1, player2], player1, 'spectatorid');
    const card = new IoMiningIndustries();
    const corporationCard = new SaturnSystems();
    expect(player1.production.megacredits).to.eq(0);
    player1.playedCards.push(corporationCard);
    player2.playCard(card, undefined);
    expect(player1.production.megacredits).to.eq(1);
  });
  it('Chains onend functions from player inputs', function(done) {
    const player = new Player('blue', 'blue', false, 0, 'p-blue');
    Game.newInstance('gameid', [player], player, 'spectatorid');
    const mockOption3 = new SelectOption('Mock select option 3').andThen(() => {
      return undefined;
    });
    const mockOption2 = new SelectOption('Mock select option 2').andThen(() => {
      return mockOption3;
    });
    const mockOption = new SelectOption('Mock select option').andThen(() => {
      return mockOption2;
    });
    player.setWaitingFor(mockOption, done);
    player.process({ type: 'option' });
    expect(player.getWaitingFor()).not.to.be.undefined;
    player.process({ type: 'option' });
    expect(player.getWaitingFor()).not.to.be.undefined;
    player.process({ type: 'option' });
    expect(player.getWaitingFor()).to.be.undefined;
  });
  it('Omits buffer gas for non solo games', () => {
    const player = new Player('blue', 'blue', false, 0, 'p-blue');
    const player2 = new Player('red', 'red', false, 0, 'p-red');
    Game.newInstance('gameid', [player, player2], player, 'spectatorid');
    const option = player.getStandardProjectOption();
    const bufferGas = option.cards.find(
      (card) => card.name === CardName.BUFFER_GAS_STANDARD_PROJECT,
    );
    expect(bufferGas).to.be.undefined;
  });
  it('Omit buffer gas for solo games without 63 TR', () => {
    const player = new Player('blue', 'blue', false, 0, 'p-blue');
    Game.newInstance('gameid', [player], player, 'spectatorid');
    const option = player.getStandardProjectOption();
    const bufferGas = option.cards.find(
      (card) => card.name === CardName.BUFFER_GAS_STANDARD_PROJECT,
    );
    expect(bufferGas).to.be.undefined;
  });

  it('serialization test for pickedCorporationCard', () => {
    const player = new Player('blue', 'blue', false, 0, 'p-blue');
    player.pickedCorporationCard = new SaturnSystems();
    const json = player.serialize();
    expect(json.pickedCorporationCard).eq('Saturn Systems');
  });
  it('serialization test', () => {
    const json: SerializedPlayer = {
      id: 'p-blue',
      autoPass: false,
      pickedCorporationCard: CardName.THARSIS_REPUBLIC,
      terraformRating: 20,
      hasIncreasedTerraformRatingThisGeneration: false,
      megaCredits: 1,
      megaCreditProduction: 2,
      steel: 3,
      steelProduction: 4,
      titanium: 5,
      titaniumProduction: 6,
      plants: 7,
      plantProduction: 8,
      energy: 9,
      energyProduction: 10,
      heat: 11,
      heatProduction: 12,
      titaniumValue: 13,
      steelValue: 14,
      canUseHeatAsMegaCredits: false,
      canUseTitaniumAsMegacredits: false,
      canUsePlantsAsMegaCredits: false,
      actionsTakenThisRound: 15,
      actionsTakenThisGame: 30,
      actionsThisGeneration: [
        CardName.FACTORUM,
        CardName.GHG_PRODUCING_BACTERIA,
      ],
      pendingInitialActions: [],
      dealtCorporationCards: [CardName.THARSIS_REPUBLIC],
      dealtCeoCards: [CardName.KAREN],
      dealtProjectCards: [CardName.FLOATER_LEASING, CardName.BUTTERFLY_EFFECT],
      dealtPreludeCards: [
        CardName.MOHOLE_EXCAVATION,
        CardName.LAVA_TUBE_SETTLEMENT,
      ],
      cardsInHand: [CardName.EARTH_ELEVATOR, CardName.DUST_SEALS],
      preludeCardsInHand: [
        CardName.METAL_RICH_ASTEROID,
        CardName.PSYCHROPHILES,
      ],
      ceoCardsInHand: [],
      playedCards: [], // TODO(kberg): these are SerializedCard.
      draftedCards: [CardName.FISH, CardName.EXTREME_COLD_FUNGUS],
      needsToDraft: false,
      cardCost: 3,
      cardDiscount: 7,
      fleetSize: 99,
      tradesThisGeneration: 100,
      colonyTradeOffset: 101,
      colonyTradeDiscount: 102,
      colonyVictoryPoints: 104,
      turmoilPolicyActionUsed: false,
      politicalAgendasActionUsedCount: 0,
      hasTurmoilScienceTagBonus: false,
      preservationProgram: false,
      oceanBonus: 86,
      scienceTagCount: 97,
      plantsNeededForGreenery: 5,
      removingPlayers: [],
      warmongerCards: 0,
      removedFromPlayCards: [],
      name: 'p-blue',
      color: 'purple' as Color,
      beginner: true,
      handicap: 4,
      plantTagCount: 0,
      timer: {
        sumElapsed: 0,
        startedAt: 0,
        running: false,
        afterFirstAction: false,
        lastStoppedAt: 0,
      } as SerializedTimer,
      totalDelegatesPlaced: 0,
      victoryPointsByGeneration: [],
      underworldData: { corruption: 0, activeBonus: undefined, tokens: [] },
      alliedParty: {
        agenda: { bonusId: 'gb01', policyId: 'gp01' },
        partyName: PartyName.GREENS,
      },
      draftHand: [],
      globalParameterSteps: {
        [GlobalParameter.OCEANS]: 0,
        [GlobalParameter.OXYGEN]: 0,
        [GlobalParameter.TEMPERATURE]: 0,
        [GlobalParameter.VENUS]: 0,
        [GlobalParameter.MOON_HABITAT_RATE]: 0,
        [GlobalParameter.MOON_MINING_RATE]: 0,
        [GlobalParameter.MOON_LOGISTIC_RATE]: 0,
      },
      standardProjectsThisGeneration: [],
      jovianTagCount: 0,
      withinDeflectionZone: false,
    };

    const newPlayer = Player.deserialize(json);

    expect(newPlayer.color).eq('purple');
    expect(newPlayer.colonies.usedTradeFleets).eq(100);
  });

  it('addResourceTo', () => {
    const player = new Player('blue', 'blue', false, 0, 'p-blue');
    const game = Game.newInstance('gameid', [player], player, 'spectatorid');

    const log = game.gameLog;

    log.length = 0; // Empty it out.

    const card = new Pets();
    expect(card.resourceCount).eq(0);
    expect(log).is.empty;

    player.addResourceTo(card);
    expect(card.resourceCount).eq(1);
    expect(log).is.empty;

    player.addResourceTo(card, 1);
    expect(card.resourceCount).eq(2);
    expect(log).is.empty;

    player.addResourceTo(card, 3);
    expect(card.resourceCount).eq(5);
    expect(log).is.empty;

    player.addResourceTo(card, { qty: 3, log: true });
    expect(log).has.length(1);
    const logEntry = log[0];
    expect(logEntry.data[1].value).eq('3');
    expect(logEntry.data[3].value).eq('Pets');
  });

  it('addResourceTo with Mons Insurance hook does not remove when no credits', () => {
    const player1 = new Player('blue', 'blue', false, 0, 'p-blue');
    const player2 = new Player('red', 'red', false, 0, 'p-red');
    const game = Game.newInstance(
      'gameid',
      [player1, player2],
      player1,
      'spectatorid',
    );
    player1.megaCredits = 0;
    player1.production.add(Resource.MEGACREDITS, -5);
    player2.megaCredits = 3;
    game.monsInsuranceOwner = player2;
    player1.stock.add(Resource.MEGACREDITS, -3, {
      from: { player: player2 },
      log: false,
    });
    expect(player2.megaCredits).eq(3);
    player1.production.add(Resource.MEGACREDITS, -3, {
      from: { player: player2 },
      log: false,
    });
    expect(player2.megaCredits).eq(3);
  });

  it('addResourceTo, logZero', () => {
    const player = new Player('blue', 'blue', false, 0, 'p-blue');
    const game = Game.newInstance('gameid', [player], player, 'spectatorid');

    const log = game.gameLog;

    log.length = 0; // Empty it out.

    const card = new Pets();
    expect(card.resourceCount).eq(0);
    expect(log).is.empty;

    player.addResourceTo(card, { qty: 0, log: true, logZero: false });
    expect(card.resourceCount).eq(0);
    expect(log).is.empty;

    player.addResourceTo(card, { qty: 0, log: true, logZero: true });
    expect(card.resourceCount).eq(0);
    expect(log).has.length(1);
    const logEntry = log[0];
    expect(logEntry.data[1].value).eq('0');
    expect(logEntry.data[3].value).eq('Pets');
  });

  it('removeResourcesFrom', () => {
    const player = new Player('blue', 'blue', false, 0, 'p-blue');
    const game = Game.newInstance('gameid', [player], player, 'spectatorid');

    const log = game.gameLog;
    log.length = 0; // Empty it out.

    const card = new Pets();
    expect(card.resourceCount).eq(0);
    expect(log).is.empty;

    log.length = 0;
    card.resourceCount = 6;
    player.removeResourceFrom(card);
    expect(card.resourceCount).eq(5);
    expect(log).has.length(1);
    expect(log[0].data[1].value).eq('1');
    expect(log[0].data[3].value).eq('Pets');

    log.length = 0;
    player.removeResourceFrom(card, 1);
    expect(card.resourceCount).eq(4);
    expect(log).has.length(1);
    expect(log[0].data[1].value).eq('1');

    log.length = 0;
    player.removeResourceFrom(card, 3);
    expect(log).has.length(1);
    expect(log[0].data[1].value).eq('3');

    log.length = 0;
    card.resourceCount = 4;
    player.removeResourceFrom(card, 5);
    expect(card.resourceCount).eq(0);
    expect(log).has.length(1);
    expect(log[0].data[1].value).eq('4');
  });

  it('autopass is disabled', () => {
    const [game, player, _player2] = testGame(2);

    game.phase = Phase.ACTION;

    player.autopass = true;
    player.takeAction();
    // expect(game.activePlayer.id).eq(player2.id);
    expect(game.activePlayer.id).eq(player.id);
  });

  // it('everybody autopasses', () => {
  //   const [game, player, player2] = testGame(2);

  //   game.phase = Phase.ACTION;

  //   player.autopass = true;
  //   player2.autopass = true;
  //   player.takeAction();

  //   expect(game.phase).eq(Phase.RESEARCH);
  //   expect(player.autopass).is.false;
  //   expect(player2.autopass).is.false;
  // });

  it('Increasing temperature sets globalParameterSteps', () => {
    const [game, player, player2] = testGame(2, { solarPhaseOption: true });

    game.phase = Phase.ACTION;
    game.increaseTemperature(player, 1);
    expect(player.globalParameterSteps[GlobalParameter.TEMPERATURE]).eq(1);

    game.increaseTemperature(player, 2);
    expect(player.globalParameterSteps[GlobalParameter.TEMPERATURE]).eq(3);

    game.increaseTemperature(player, -1);
    expect(player.globalParameterSteps[GlobalParameter.TEMPERATURE]).eq(3);
    expect(player2.globalParameterSteps[GlobalParameter.TEMPERATURE]).eq(0);

    game.phase = Phase.SOLAR;

    game.increaseTemperature(player2, 2);
    expect(player2.globalParameterSteps[GlobalParameter.TEMPERATURE]).eq(0);

    game.phase = Phase.ACTION;

    game.increaseTemperature(player2, 2);
    expect(player2.globalParameterSteps[GlobalParameter.TEMPERATURE]).eq(2);
  });

  it('Increasing oxygen sets globalParameterSteps', () => {
    const [game, player, player2] = testGame(2, { solarPhaseOption: true });

    game.phase = Phase.ACTION;
    game.increaseOxygenLevel(player, 1);
    expect(player.globalParameterSteps[GlobalParameter.OXYGEN]).eq(1);

    game.increaseOxygenLevel(player, 2);
    expect(player.globalParameterSteps[GlobalParameter.OXYGEN]).eq(3);

    game.increaseOxygenLevel(player, -1);
    expect(player.globalParameterSteps[GlobalParameter.OXYGEN]).eq(3);
    expect(player2.globalParameterSteps[GlobalParameter.OXYGEN]).eq(0);

    game.phase = Phase.SOLAR;

    game.increaseOxygenLevel(player2, 2);
    expect(player2.globalParameterSteps[GlobalParameter.OXYGEN]).eq(0);

    game.phase = Phase.ACTION;

    game.increaseOxygenLevel(player2, 2);
    expect(player2.globalParameterSteps[GlobalParameter.OXYGEN]).eq(2);
  });

  it('Increasing venus sets globalParameterSteps', () => {
    const [game, player, player2] = testGame(2, {
      venusNextExtension: true,
      solarPhaseOption: true,
    });

    game.phase = Phase.ACTION;
    game.increaseVenusScaleLevel(player, 1);
    expect(player.globalParameterSteps[GlobalParameter.VENUS]).eq(1);

    game.increaseVenusScaleLevel(player, 2);
    expect(player.globalParameterSteps[GlobalParameter.VENUS]).eq(3);

    game.increaseVenusScaleLevel(player, -1);
    expect(player.globalParameterSteps[GlobalParameter.VENUS]).eq(3);
    expect(player2.globalParameterSteps[GlobalParameter.VENUS]).eq(0);

    game.phase = Phase.SOLAR;

    game.increaseVenusScaleLevel(player2, 2);
    expect(player2.globalParameterSteps[GlobalParameter.VENUS]).eq(0);

    game.phase = Phase.ACTION;

    game.increaseVenusScaleLevel(player2, 2);
    expect(player2.globalParameterSteps[GlobalParameter.VENUS]).eq(2);
  });

  describe('Convert Heat / Kelvinists kp03 swap', () => {
    function findOption(
      player: TestPlayer,
      title: string,
    ): SelectOption | undefined {
      const actions = cast(player.getActions(), OrOptions);
      const option = actions.options.find((o) => o.title === title);
      return option === undefined ? undefined : cast(option, SelectOption);
    }

    it('kp03 ruling: 6-heat option replaces 8-heat option', () => {
      const [game, player] = testGame(1, { turmoilExtension: true });
      setRulingParty(game, PartyName.KELVINISTS, 'kp03');
      player.stock.add(Resource.HEAT, 10);

      expect(findOption(player, 'Convert 8 heat into temperature')).is
        .undefined;
      expect(
        findOption(
          player,
          'Convert 6 heat into temperature (Turmoil Kelvinists)',
        ),
      ).is.not.undefined;
    });

    it('kp01 ruling: 8-heat option remains, 6-heat is not offered', () => {
      const [game, player] = testGame(1, { turmoilExtension: true });
      setRulingParty(game, PartyName.KELVINISTS, 'kp01');
      player.stock.add(Resource.HEAT, 10);

      expect(findOption(player, 'Convert 8 heat into temperature')).is.not
        .undefined;
      expect(
        findOption(
          player,
          'Convert 6 heat into temperature (Turmoil Kelvinists)',
        ),
      ).is.undefined;
    });
  });

  it('run research phase', () => {
    const [game, player] = testGame(1, { skipInitialCardSelection: true });
    game.generation = 2;
    player.megaCredits = 20;

    game.gotoResearchPhase();

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    const cards = selectCard.cards;
    selectCard.cb([cards[0], cards[2]]);
    runAllActions(game);

    expect(player.cardsInHand).to.have.members([cards[0], cards[2]]);
    expect(player.megaCredits).eq(14);
  });
});
