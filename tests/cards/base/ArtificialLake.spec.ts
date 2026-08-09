import { expect } from 'chai';
import { SpaceType } from '../../../src/common/boards/SpaceType';
import * as constants from '../../../src/common/constants';
import { TileType } from '../../../src/common/TileType';
import { cast } from '../../../src/common/utils/utils';
import { ArtificialLake } from '../../../src/server/cards/base/ArtificialLake';
import { IGame } from '../../../src/server/IGame';
import { SelectSpace } from '../../../src/server/inputs/SelectSpace';
import { assertPlaceOcean } from '../../assertions';
import { testGame } from '../../TestGame';
import { maxOutOceans, runAllActions, setTemperature } from '../../TestingUtils';
import { TestPlayer } from '../../TestPlayer';

describe('ArtificialLake', () => {
  let card: ArtificialLake;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ArtificialLake();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    selectSpace.spaces.forEach((space) => {
      expect(space.spaceType).to.eq(SpaceType.LAND);
    });

    assertPlaceOcean(player, selectSpace);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });

  it('Cannot place ocean if all oceans are already placed', () => {
    // Set temperature level to fit requirements
    setTemperature(game, -6);

    // Set oceans count to the max value
    for (const space of game.board.getSpaces(SpaceType.OCEAN)) {
      if (game.board.getOceanSpaces().length < constants.MAX_OCEAN_TILES) {
        game.addOcean(player, space);
      }
    }

    // Card is still playable to get VPs...
    expect(card.canPlay(player)).is.true;

    // ...but an action to place ocean is not unavailable
    cast(card.play(player), undefined);
  });

  it('Cannot place ocean if all land spaces are occupied', () => {
    // Set temperature level to fit requirements
    setTemperature(game, -6);

    // Take all but one space.
    const spaces = game.board.getAvailableSpacesOnLand(player);
    spaces.forEach((space, idx) => {
      if (idx !== 0) {
        game.simpleAddTile(player, space, {tileType: TileType.GREENERY});
      }
    });

    expect(game.board.getAvailableSpacesOnLand(player)).has.length(1);

    // Card is still playable.
    expect(card.canPlay(player)).is.true;

    // No spaces left?
    game.simpleAddTile(player, spaces[0], {tileType: TileType.GREENERY});
    expect(game.board.getAvailableSpacesOnLand(player)).has.length(0);

    // Cannot play.
    expect(card.canPlay(player)).is.false;
  });

  it('Can still play if oceans are maxed but no land spaces are available', () => {
    setTemperature(game, -6);
    maxOutOceans(player);

    // Take all land spaces
    const spaces = game.board.getAvailableSpacesOnLand(player);
    spaces.forEach((space) => {
      game.simpleAddTile(player, space, {tileType: TileType.GREENERY});
    });

    expect(card.canPlay(player)).is.true;
  });
});
