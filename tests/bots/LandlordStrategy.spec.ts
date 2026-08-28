import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import {TileType} from '@/common/TileType';
import {ConstRandom} from '@/common/utils/Random';
import {Game} from '@/server/Game';
import {Player} from '@/server/Player';
import {Space} from '@/server/boards/Space';
import {LandlordStrategy} from '@/server/bots/LandlordStrategy';
import {assignBotStrategy} from '@/server/bots/BotStrategy';
import {CrediCor} from '@/server/cards/corporation/CrediCor';
import {EcoLine} from '@/server/cards/corporation/EcoLine';
import {Teractor} from '@/server/cards/corporation/Teractor';
import {TharsisRepublic} from '@/server/cards/corporation/TharsisRepublic';
import {SelectSpace} from '@/server/inputs/SelectSpace';

describe('LandlordStrategy', () => {
  it('is available for random assignment', () => {
    expect(assignBotStrategy(new ConstRandom(0.9))).eq('landlord');
  });

  it('prefers CrediCor, then Tharsis Republic, then starting money', () => {
    const strategy = new LandlordStrategy();
    const random = new ConstRandom(0);

    expect(strategy.selectCorporation([new TharsisRepublic(), new CrediCor()], random)?.name).eq(CardName.CREDICOR);
    expect(strategy.selectCorporation([new EcoLine(), new TharsisRepublic()], random)?.name).eq(CardName.THARSIS_REPUBLIC);
    expect(strategy.selectCorporation([new EcoLine(), new Teractor()], random)?.name).eq(CardName.TERACTOR);
  });

  it('places a city next to the most greenery', () => {
    const [game, bot] = newGame();
    const spaces = findSeparatedSpaces(game.board.getAvailableSpacesForCity(bot), game);
    const greenery = game.board.getAdjacentSpaces(spaces[0]).filter((space) => game.board.canPlaceTile(space)).slice(0, 2);
    greenery.forEach((space) => game.simpleAddTile(bot, space, {tileType: TileType.GREENERY}));

    const response = new LandlordStrategy().selectInput(
      new SelectSpace('Select space for city tile', spaces), new ConstRandom(0.9), bot);

    expect(response).deep.eq({type: 'space', spaceId: spaces[0].id});
  });

  it('places greenery next to its own city', () => {
    const [game, bot, human] = newGame();
    const cities = findSeparatedSpaces(game.board.getAvailableSpacesForCity(bot), game);
    game.simpleAddTile(bot, cities[0], {tileType: TileType.CITY});
    game.simpleAddTile(human, cities[1], {tileType: TileType.CITY});
    const ownAdjacent = game.board.getAdjacentSpaces(cities[0]).find((space) => game.board.canPlaceTile(space));
    const otherAdjacent = game.board.getAdjacentSpaces(cities[1]).find((space) => game.board.canPlaceTile(space));
    if (ownAdjacent === undefined || otherAdjacent === undefined) {
      throw new Error('Test board does not have the expected open spaces');
    }

    const response = new LandlordStrategy().selectInput(
      new SelectSpace('Select space for greenery tile', [otherAdjacent, ownAdjacent]), new ConstRandom(0), bot);

    expect(response).deep.eq({type: 'space', spaceId: ownAdjacent.id});
  });

  it('avoids an opponent city when placing greenery by one of its own cities', () => {
    const [game, bot, human] = newGame();
    game.simpleAddTile(bot, game.board.getSpaceOrThrow('17'), {tileType: TileType.CITY});
    game.simpleAddTile(human, game.board.getSpaceOrThrow('18'), {tileType: TileType.CITY});
    const spaces = [game.board.getSpaceOrThrow('24'), game.board.getSpaceOrThrow('25')];

    const response = new LandlordStrategy().selectInput(
      new SelectSpace('Select space for greenery tile', spaces), new ConstRandom(0), bot);

    expect(response).deep.eq({type: 'space', spaceId: '24'});
  });

  it('uses ocean adjacency before placement bonuses to break placement ties', () => {
    const [game, bot, human] = newGame();
    game.simpleAddTile(human, game.board.getSpaceOrThrow('04'), {tileType: TileType.OCEAN});
    const spaces = ['05', '25'].map((id) => game.board.getSpaceOrThrow(id));

    const response = new LandlordStrategy().selectInput(
      new SelectSpace('Select space for greenery tile', spaces), new ConstRandom(0), bot);

    expect(response).deep.eq({type: 'space', spaceId: '05'});
  });

  it('uses placement bonuses when ocean adjacency ties', () => {
    const [game, bot, human] = newGame();
    game.simpleAddTile(human, game.board.getSpaceOrThrow('04'), {tileType: TileType.OCEAN});
    const spaces = ['05', '09', '10'].map((id) => game.board.getSpaceOrThrow(id));

    const response = new LandlordStrategy().selectInput(
      new SelectSpace('Select space for greenery tile', spaces), new ConstRandom(0), bot);

    expect(response).deep.eq({type: 'space', spaceId: '09'});
  });

  it('buys greenery before a city when it can build beside its city', () => {
    const [game, bot] = newGame();
    const city = game.board.getAvailableSpacesForCity(bot)[0];
    game.simpleAddTile(bot, city, {tileType: TileType.CITY});
    bot.megaCredits = 25;

    expect(new LandlordStrategy().takeAction(bot)).is.true;

    expect([...bot.standardProjectsThisGeneration]).deep.eq([CardName.GREENERY_STANDARD_PROJECT]);
    expect(bot.megaCredits).eq(2);
  });

  it('buys a city when no owned city has an open greenery spot', () => {
    const [, bot] = newGame();
    bot.megaCredits = 25;

    expect(new LandlordStrategy().takeAction(bot)).is.true;

    expect([...bot.standardProjectsThisGeneration]).deep.eq([CardName.CITY_STANDARD_PROJECT]);
    expect(bot.megaCredits).eq(0);
  });
});

function newGame(): [Game, Player, Player] {
  const bot = new Player('bot', 'red', false, 0, 'p-bot', true);
  const human = new Player('human', 'blue', false, 0, 'p-human');
  const game = Game.newInstance('game', [human, bot], human, 'spectator');
  human.clearWaitingFor();
  bot.clearWaitingFor();
  bot.botStrategy = 'landlord';
  return [game, bot, human];
}

function findSeparatedSpaces(spaces: ReadonlyArray<Space>, game: Game): [Space, Space] {
  for (const first of spaces) {
    const second = spaces.find((candidate) =>
      candidate !== first && !game.board.getAdjacentSpaces(first).includes(candidate));
    if (second !== undefined) {
      return [first, second];
    }
  }
  throw new Error('Test board does not have two separated spaces');
}
