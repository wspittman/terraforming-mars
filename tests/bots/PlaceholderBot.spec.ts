import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import {Game} from '@/server/Game';
import {Player} from '@/server/Player';
import {resolvePlaceholderBotInputs} from '@/server/bots/PlaceholderBotInput';
import {cardsFromJSON} from '@/server/createCard';
import {SelectCard} from '@/server/inputs/SelectCard';
import {Phase} from '@/common/Phase';
import * as constants from '@/common/constants';
import {maxOutOceans, runAllActions, setOxygenLevel, setTemperature} from '../TestingUtils';
import {SimpleBotStrategy} from '@/server/bots/BotStrategy';
import {CrediCor} from '@/server/cards/corporation/CrediCor';
import {EcoLine} from '@/server/cards/corporation/EcoLine';
import {SelectSpace} from '@/server/inputs/SelectSpace';
import {ConstRandom} from '@/common/utils/Random';

describe('PlaceholderBot', () => {
  it('selects the corporation with the most starting money and no project cards', () => {
    const bot = new Player('bot', 'red', false, 0, 'p-bot', true);
    const human = new Player('human', 'blue', false, 0, 'p-human');

    Game.newInstance('game', [human, bot], human, 'spectator');

    expect(bot.botStrategy).eq('simple');
    const highestStartingMoney = Math.max(...bot.dealtCorporationCards.map((card) => card.startingMegaCredits));
    expect(bot.pickedCorporationCard?.startingMegaCredits).eq(highestStartingMoney);
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

    expect(new SimpleBotStrategy().takeAction(bot)).is.true;

    expect(game.getTemperature()).eq(temperature + 2);
    expect(bot.heat).eq(0);
    expect(bot.plants).eq(bot.plantsNeededForGreenery);
  });

  it('places a tile in a random valid location', () => {
    const bot = new Player('bot', 'red', false, 0, 'p-bot', true);
    const human = new Player('human', 'blue', false, 0, 'p-human');
    const game = Game.newInstance('game', [human, bot], human, 'spectator');
    const spaces = game.board.getAvailableSpacesForGreenery(bot).slice(0, 2);
    const input = new SelectSpace('Choose a space', spaces);

    const response = new SimpleBotStrategy().selectInput(input, new ConstRandom(0.75));

    expect(response).deep.eq({type: 'space', spaceId: spaces[1].id});
  });

  it('selects the richest corporation independently of deal order', () => {
    const strategy = new SimpleBotStrategy();

    expect(strategy.selectCorporation([new EcoLine(), new CrediCor()])?.name).eq(CardName.CREDICOR);
    expect(strategy.selectCorporation([new CrediCor(), new EcoLine()])?.name).eq(CardName.CREDICOR);
  });

  it('selects the first available draft card', () => {
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

    resolvePlaceholderBotInputs([human, bot]);

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

    resolvePlaceholderBotInputs([bot]);

    expect(selected).is.empty;
  });

  it('uses a standard project with 15 M€ and preserves its strategy when serialized', () => {
    const bot = new Player('bot', 'red', false, 0, 'p-bot', true);
    const human = new Player('human', 'blue', false, 0, 'p-human');
    const game = Game.newInstance('game', [human, bot], human, 'spectator');
    human.clearWaitingFor();
    bot.clearWaitingFor();

    bot.megaCredits = 15;
    bot.takeAction();

    expect(game.hasPassedThisActionPhase(bot)).is.true;
    expect(bot.standardProjectsThisGeneration).not.is.empty;
    const restored = Player.deserialize(bot.serialize());
    expect(restored.isBot).is.true;
    expect(restored.botStrategy).eq('simple');
  });

  it('lets a human-plus-bots game reach the end', () => {
    const human = new Player('human', 'blue', false, 0, 'p-human');
    const bots = [
      new Player('Bot 1', 'red', false, 0, 'p-bot-1', true),
      new Player('Bot 2', 'green', false, 0, 'p-bot-2', true),
      new Player('Bot 3', 'yellow', false, 0, 'p-bot-3', true),
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
