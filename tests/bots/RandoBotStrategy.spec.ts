import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import {Game} from '@/server/Game';
import {Player} from '@/server/Player';
import {resolveBotInputs} from '@/server/bots/BotInput';
import {cardsFromJSON} from '@/server/createCard';
import {SelectCard} from '@/server/inputs/SelectCard';
import {Phase} from '@/common/Phase';
import * as constants from '@/common/constants';
import {maxOutOceans, runAllActions, setOxygenLevel, setTemperature} from '../TestingUtils';
import {RandoBotStrategy} from '@/server/bots/RandoBotStrategy';
import {CrediCor} from '@/server/cards/corporation/CrediCor';
import {EcoLine} from '@/server/cards/corporation/EcoLine';
import {SelectSpace} from '@/server/inputs/SelectSpace';
import {ConstRandom} from '@/common/utils/Random';
import {selectRobotNames} from '@/server/bots/BotUtils';
import {Thermalist} from '@/server/awards/Thermalist';
import {Terraformer} from '@/server/milestones/Terraformer';

describe('RandoBotStrategy', () => {
  it('selects distinct robot names', () => {
    expect(selectRobotNames(3, new ConstRandom(0))).deep.eq(['Bolt', 'Gizmo', 'Pixel']);
  });

  it('selects a strategy and buys no initial project cards', () => {
    const bot = new Player('bot', 'red', false, 0, 'p-bot', true);
    const human = new Player('human', 'blue', false, 0, 'p-human');

    Game.newInstance('game', [human, bot], human, 'spectator');

    for (let round = 1; round < 10; round++) {
      const input = human.getWaitingFor();
      if (!(input instanceof SelectCard)) {
        throw new Error('Human is not drafting');
      }
      human.clearWaitingFor();
      input.process({type: 'card', cards: [input.cards[0].name]});
    }

    expect(['rando', 'parameter-maximizer', 'landlord']).to.include(bot.botStrategy);
    expect(bot.cardsInHand).is.empty;
    expect(bot.getWaitingFor()).is.undefined;
  });

  it('uses heat before plants', () => {
    const bot = new Player('bot', 'red', false, 0, 'p-bot', true);
    const human = new Player('human', 'blue', false, 0, 'p-human');
    const game = Game.newInstance('game', [human, bot], human, 'spectator');
    bot.clearWaitingFor();
    bot.heat = constants.HEAT_FOR_TEMPERATURE;
    bot.plants = bot.plantsNeededForGreenery;
    const temperature = game.getTemperature();

    expect(new RandoBotStrategy().takeAction(bot)).is.true;

    expect(game.getTemperature()).eq(temperature + 2);
    expect(bot.heat).eq(0);
    expect(bot.plants).eq(bot.plantsNeededForGreenery);
  });

  it('claims a milestone before funding an award', () => {
    const bot = new Player('bot', 'red', false, 0, 'p-bot', true);
    const human = new Player('human', 'blue', false, 0, 'p-human');
    const game = Game.newInstance('game', [human, bot], human, 'spectator');
    game.milestones = [new Terraformer()];
    game.awards = [new Thermalist()];
    bot.setTerraformRating(35);
    bot.megaCredits = bot.milestoneCost() + game.getAwardFundingCost();
    bot.heat = 12;

    expect(new RandoBotStrategy().takeAction(bot)).is.true;

    expect(game.claimedMilestones[0]).deep.include({player: bot});
    expect(game.claimedMilestones[0].milestone.name).eq('Terraformer');
    expect(game.fundedAwards).is.empty;
    expect(bot.megaCredits).eq(game.getAwardFundingCost());
  });

  it('funds an award with a sufficient score and 20% lead', () => {
    const bot = new Player('bot', 'red', false, 0, 'p-bot', true);
    const human = new Player('human', 'blue', false, 0, 'p-human');
    const game = Game.newInstance('game', [human, bot], human, 'spectator');
    game.awards = [new Thermalist()];
    bot.megaCredits = game.getAwardFundingCost();
    bot.heat = 12;
    human.heat = 10;

    expect(new RandoBotStrategy().takeAction(bot)).is.true;

    expect(game.fundedAwards[0].player).eq(bot);
    expect(bot.megaCredits).eq(0);
  });

  it('does not fund an award without a 20% lead', () => {
    const bot = new Player('bot', 'red', false, 0, 'p-bot', true);
    const human = new Player('human', 'blue', false, 0, 'p-human');
    const game = Game.newInstance('game', [human, bot], human, 'spectator');
    game.awards = [new Thermalist()];
    bot.megaCredits = game.getAwardFundingCost();
    bot.heat = 11;
    human.heat = 10;

    expect(new RandoBotStrategy().takeAction(bot)).is.true;

    expect(game.fundedAwards).is.empty;
    expect(bot.heat).eq(3);
  });

  it('does not fund an award when its score is only half the cost', () => {
    const bot = new Player('bot', 'red', false, 0, 'p-bot', true);
    const human = new Player('human', 'blue', false, 0, 'p-human');
    const game = Game.newInstance('game', [human, bot], human, 'spectator');
    game.awards = [new Thermalist()];
    bot.megaCredits = game.getAwardFundingCost();
    bot.heat = game.getAwardFundingCost() / 2;

    expect(new RandoBotStrategy().takeAction(bot)).is.false;

    expect(game.fundedAwards).is.empty;
  });

  it('places a tile in a random valid location', () => {
    const bot = new Player('bot', 'red', false, 0, 'p-bot', true);
    const human = new Player('human', 'blue', false, 0, 'p-human');
    const game = Game.newInstance('game', [human, bot], human, 'spectator');
    const spaces = game.board.getAvailableSpacesForGreenery(bot).slice(0, 2);
    const input = new SelectSpace('Choose a space', spaces);

    const response = new RandoBotStrategy().selectInput(input, new ConstRandom(0.75));

    expect(response).deep.eq({type: 'space', spaceId: spaces[1].id});
  });

  it('selects a random corporation', () => {
    const strategy = new RandoBotStrategy();

    expect(strategy.selectCorporation([new EcoLine(), new CrediCor()], new ConstRandom(0.75))?.name).eq(CardName.CREDICOR);
    expect(strategy.selectCorporation([new CrediCor(), new EcoLine()], new ConstRandom(0.75))?.name).eq(CardName.ECOLINE);
  });

  it('selects a random available draft card', () => {
    const bot = new Player('bot', 'red', false, 0, 'p-bot', true);
    const human = new Player('human', 'blue', false, 0, 'p-human');
    Game.newInstance('game', [human, bot], human, 'spectator');
    human.clearWaitingFor();
    bot.clearWaitingFor();
    const cards = cardsFromJSON([CardName.ACQUIRED_COMPANY, CardName.ALGAE]);
    let selected: ReadonlyArray<CardName> = [];
    bot.setWaitingFor(new SelectCard('Draft', 'Select', cards, {
      min: 1,
      max: 1,
      enabled: [false, true],
    }).andThen((selectedCards) => {
      selected = selectedCards.map((card) => card.name);
      return undefined;
    }));

    resolveBotInputs([human, bot]);

    expect(selected).deep.eq([CardName.ALGAE]);
    expect(bot.getWaitingFor()).is.undefined;
  });

  it('buys no cards when selection is optional', () => {
    const bot = new Player('bot', 'red', false, 0, 'p-bot', true);
    const human = new Player('human', 'blue', false, 0, 'p-human');
    Game.newInstance('game', [human, bot], human, 'spectator');
    human.clearWaitingFor();
    bot.clearWaitingFor();
    const cards = cardsFromJSON([CardName.ACQUIRED_COMPANY, CardName.ALGAE]);
    let selected = cards;
    bot.setWaitingFor(new SelectCard('Buy cards', 'Buy', cards, {
      min: 0,
      max: cards.length,
    }).andThen((selectedCards) => {
      selected = [...selectedCards];
      return undefined;
    }));

    resolveBotInputs([bot]);

    expect(selected).is.empty;
  });

  it('uses a standard project with 14 M€ and preserves its strategy when serialized', () => {
    const bot = new Player('bot', 'red', false, 0, 'p-bot', true);
    const human = new Player('human', 'blue', false, 0, 'p-human');
    const game = Game.newInstance('game', [human, bot], human, 'spectator');
    human.clearWaitingFor();
    bot.clearWaitingFor();

    bot.botStrategy = 'rando';
    bot.megaCredits = 14;
    bot.takeAction();

    expect(game.hasPassedThisActionPhase(bot)).is.true;
    expect(bot.standardProjectsThisGeneration).not.is.empty;
    const restored = Player.deserialize(bot.serialize());
    expect(restored.isBot).is.true;
    expect(restored.botStrategy).eq('rando');
  });

  it('lets a human-plus-bots game reach the end', () => {
    const human = new Player('human', 'blue', false, 0, 'p-human');
    const bots = [
      new Player('Bolt', 'red', false, 0, 'p-bot-1', true),
      new Player('Gizmo', 'green', false, 0, 'p-bot-2', true),
      new Player('Pixel', 'yellow', false, 0, 'p-bot-3', true),
    ];
    const game = Game.newInstance('game', [human, ...bots], human, 'spectator');
    for (const player of game.players) {
      player.clearWaitingFor();
      player.plants = 0;
    }
    setTemperature(game, constants.MAX_TEMPERATURE);
    setOxygenLevel(game, constants.MAX_OXYGEN_LEVEL);
    maxOutOceans(human);
    runAllActions(game);
    for (const player of game.players) {
      player.clearWaitingFor();
      player.plants = 0;
    }

    human.pass();
    game.playerIsFinishedTakingActions();
    runAllActions(game);

    expect(game.phase).eq(Phase.END);
    expect(bots.every((bot) => bot.actionsTakenThisGame > 0)).is.true;
  });
});
