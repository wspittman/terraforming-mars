import { expect } from 'chai';
import { SpaceType } from '../../../src/common/boards/SpaceType';
import { TileType } from '../../../src/common/TileType';
import { Constructor } from '../../../src/server/awards/modular/Constructor';
import { Board } from '../../../src/server/boards/Board';
import { IGame } from '../../../src/server/IGame';
import { testGame } from '../../TestGame';
import { TestPlayer } from '../../TestPlayer';

describe('Constructor', () => {
  let award : Constructor;
  let player: TestPlayer;
  let game: IGame;
  let board: Board;

  beforeEach(() => {
    award = new Constructor();
    [game, player] = testGame(2);
    board = game.board;
  });
  it('counts cities on and off Mars', () => {
    const colonySpaces = board.getSpaces(SpaceType.COLONY);
    const landSpaces = board.getAvailableSpacesOnLand(player);

    game.simpleAddTile(player, landSpaces[0], {tileType: TileType.GREENERY});
    game.simpleAddTile(player, colonySpaces[0], {tileType: TileType.CITY});
    expect(award.getScore(player)).eq(1);

    game.simpleAddTile(player, landSpaces[1], {tileType: TileType.CITY});
    expect(award.getScore(player)).eq(2);

    game.simpleAddTile(player, landSpaces[3], {tileType: TileType.CAPITAL});
    expect(award.getScore(player)).eq(3);
  });
});
