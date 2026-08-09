import { expect } from 'chai';
import { Tag } from '../../src/common/cards/Tag';
import { TileType } from '../../src/common/TileType';
import { Units } from '../../src/common/Units';
import { Counter } from '../../src/server/behavior/Counter';
import { IceAsteroid } from '../../src/server/cards/base/IceAsteroid';
import { ImportedHydrogen } from '../../src/server/cards/base/ImportedHydrogen';
import { Virus } from '../../src/server/cards/base/Virus';
import { IGame } from '../../src/server/IGame';
import { testGame } from '../TestGame';
import { addCity, addGreenery, fakeCard, maxOutOceans } from '../TestingUtils';
import { TestPlayer } from '../TestPlayer';


describe('Counter', () => {
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;

  beforeEach(() => {
    [game, player, player2, player3] = testGame(3, {
    });
  });

  it('numbers', () => {
    const counter = new Counter(player, fakeCard());
    expect(counter.count(3)).eq(3);
    expect(counter.count(8)).eq(8);
  });

  it('tags, simple', () => {
    player.tagsForTest = { building: 2, space: 3, moon: 7 };
    const counter = new Counter(player, fakeCard());
    expect(counter.count({ tag: Tag.BUILDING })).eq(2);
    expect(counter.count({ tag: Tag.SPACE })).eq(3);

    expect(counter.count({ tag: Tag.BUILDING, each: 3 })).eq(6);
    expect(counter.count({ tag: Tag.MOON, per: 3 })).eq(2);
  });

  it('tags, multiple', () => {
    player.tagsForTest = { building: 2, space: 3, moon: 7 };
    const counter = new Counter(player, fakeCard());
    expect(counter.count({ tag: [Tag.BUILDING, Tag.MOON] })).eq(9);

    // Wild only counts once. It's really a test for tags.count, but it's useful to see here.
    player.tagsForTest = { building: 2, space: 3, moon: 7, wild: 1 };
    expect(counter.count({ tag: [Tag.BUILDING, Tag.MOON] })).eq(10);
  });

  it('tags, all and others', () => {
    player.tagsForTest = { building: 2, space: 3, moon: 7 };
    player2.tagsForTest = { space: 4 };
    player3.tagsForTest = { microbe: 8, wild: 2 }; // Wild tags will be ignored.

    const counter = new Counter(player, fakeCard());
    expect(counter.count({ tag: Tag.BUILDING, all: true })).eq(2);
    expect(counter.count({ tag: Tag.SPACE, all: true })).eq(7);
    expect(counter.count({ tag: Tag.MICROBE, all: true })).eq(8);
    expect(counter.count({ tag: Tag.SPACE, others: true })).eq(4);
  });

  it('tags, including this', () => {
    const fake = fakeCard({ tags: [Tag.CITY] });
    let counter = new Counter(player, fake);

    expect(counter.count({ tag: Tag.CITY })).eq(1);
    player.playedCards.push(fakeCard({ tags: [Tag.CITY] }));
    expect(counter.count({ tag: Tag.CITY })).eq(2);

    player.playedCards.set(fakeCard({ tags: [Tag.CITY, Tag.CITY] }));
    expect(counter.count({ tag: Tag.CITY })).eq(3);

    // Adding it to the player's tableau doesn't double-count it.
    player.playedCards.push(fake);
    // New game state needs a new Counter.
    counter = new Counter(player, fake);
    expect(counter.count({ tag: Tag.CITY })).eq(3);
  });

  it('tags, multiple, including this', () => {
    const fake = fakeCard({ tags: [Tag.MICROBE, Tag.PLANT] });
    let counter = new Counter(player, fake);

    expect(counter.count({ tag: [Tag.VENUS, Tag.PLANT] })).eq(1);
    player.tagsForTest = { plant: 1 };
    expect(counter.count({ tag: [Tag.VENUS, Tag.PLANT] })).eq(2);

    // Adding it to the player's tableau doesn't double-count it.
    player.tagsForTest = undefined;
    player.playedCards.push(fake);
    // New game state needs a new Counter.
    counter = new Counter(player, fake);
    expect(counter.count({ tag: [Tag.VENUS, Tag.PLANT] })).eq(1);
  });


  it('count greeneries', () => {
    const counter = new Counter(player, fakeCard());
    expect(counter.count({ greeneries: {} })).eq(0);

    addGreenery(player);

    expect(counter.count({ greeneries: {} })).eq(1);

    addGreenery(player);

    expect(counter.count({ greeneries: {} })).eq(2);

    // Even if played by another player
    addGreenery(player2);

    expect(counter.count({ greeneries: {} })).eq(3);
  });

  it('count greeneries that you ownown', () => {
    const count = (player: TestPlayer) =>
      new Counter(player, fakeCard()).count({ greeneries: {}, all: false });

    addGreenery(player);

    expect(count(player)).eq(1);
    expect(count(player2)).eq(0);

    addGreenery(player);

    expect(count(player)).eq(2);
    expect(count(player2)).eq(0);

    addGreenery(player2);

    expect(count(player)).eq(2);
    expect(count(player2)).eq(1);
  });

  it('count oceans', () => {
    const counter = new Counter(player, fakeCard());
    expect(counter.count({ oceans: {} })).eq(0);

    maxOutOceans(player, 1);

    expect(counter.count({ oceans: {} })).eq(1);

    maxOutOceans(player, 2);

    expect(counter.count({ oceans: {} })).eq(2);

    maxOutOceans(player, 6);

    expect(counter.count({ oceans: {} })).eq(6);
  });

  it('nextToThis: oceans', () => {
    // Place the card's tile at a known space.
    const cardSpace = game.board.getSpaceOrThrow('05');
    const card = fakeCard();
    cardSpace.tile = { tileType: TileType.CITY, card: card.name };
    cardSpace.player = player;

    const counter = new Counter(player, card);
    expect(counter.count({ oceans: {}, nextToThis: {} })).eq(0);

    // Adjacent ocean — should count.
    const adjacent = game.board.getAdjacentSpaces(cardSpace);
    adjacent[0].tile = { tileType: TileType.OCEAN };
    expect(counter.count({ oceans: {}, nextToThis: {} })).eq(1);

    adjacent[1].tile = { tileType: TileType.OCEAN };
    expect(counter.count({ oceans: {}, nextToThis: {} })).eq(2);

    // A non-adjacent ocean — should not count.
    const nonAdjacent = game.board.spaces.find(
      (s) => !adjacent.includes(s) && s !== cardSpace,
    );
    nonAdjacent!.tile = { tileType: TileType.OCEAN };
    expect(counter.count({ oceans: {}, nextToThis: {} })).eq(2);
    // But plain {oceans: {}} counts all of them.
    expect(counter.count({ oceans: {} })).eq(3);
  });

  it('nextToThis: cities', () => {
    const cardSpace = game.board.getSpaceOrThrow('05');
    const card = fakeCard();
    cardSpace.tile = {
      tileType: TileType.COMMERCIAL_DISTRICT,
      card: card.name,
    };
    cardSpace.player = player;

    const counter = new Counter(player, card);
    expect(counter.count({ cities: {}, nextToThis: {} })).eq(0);

    const adjacent = game.board.getAdjacentSpaces(cardSpace);
    adjacent[0].tile = { tileType: TileType.CITY };
    adjacent[0].player = player;
    expect(counter.count({ cities: {}, nextToThis: {} })).eq(1);

    adjacent[1].tile = { tileType: TileType.CITY };
    adjacent[1].player = player2;
    expect(counter.count({ cities: {}, nextToThis: {} })).eq(2);

    // A non-adjacent city — should not count.
    addCity(player);
    expect(counter.count({ cities: {}, nextToThis: {} })).eq(2);
  });

  it('count units', () => {
    player.tagsForTest = { building: 2, space: 3 };
    const counter = new Counter(player, fakeCard());
    const units: Units = counter.countUnits({
      megacredits: { tag: Tag.SPACE },
      energy: -1,
      heat: { tag: Tag.BUILDING, each: 2 },
    });

    expect(units).deep.eq(Units.of({ megacredits: 3, energy: -1, heat: 4 }));
  });

  it('eventsPlayed', () => {
    const counter = new Counter(player, fakeCard());
    expect(counter.count({ eventsPlayed: true })).eq(0);

    player.playedCards.push(new Virus());
    player2.playedCards.push(new IceAsteroid(), new ImportedHydrogen());

    expect(counter.count({ eventsPlayed: true })).eq(1);
    expect(counter.count({ eventsPlayed: true, all: true })).eq(3);
    expect(counter.count({ eventsPlayed: true, each: 2 })).eq(2);
  });
});
