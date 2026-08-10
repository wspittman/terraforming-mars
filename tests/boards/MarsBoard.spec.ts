import { expect } from 'chai';
import { TileType } from '../../src/common/TileType';
import { SeededRandom } from '../../src/common/utils/Random';
import { toID } from '../../src/common/utils/utils';
import { MarsBoard } from '../../src/server/boards/MarsBoard';
import { TharsisBoard } from '../../src/server/boards/TharsisBoard';
import {
  DEFAULT_GAME_OPTIONS,
  GameOptions,
} from '../../src/server/game/GameOptions';
import { TestPlayer } from '../TestPlayer';

describe('MarsBoard', () => {
  let board: MarsBoard;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(() => {
    board = TharsisBoard.newInstance(DEFAULT_GAME_OPTIONS, new SeededRandom(0));
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();

    // Rather than create a whole game around this test, I'm mocking data to make the tests pass.
    const gameOptions: Partial<GameOptions> = {};
    (player as any).game = { gameOptions };
    (player2 as any).game = { gameOptions };
  });

  it('Can have greenery placed on any available land when player has no tile placed', () => {
    const availableSpaces = board.getAvailableSpacesForGreenery(player);
    expect(availableSpaces).has.lengthOf(
      board.getAvailableSpacesOnLand(player).length,
    );
  });

  it('Can have greenery placed on any available land when player has a tile placed that is land locked', () => {
    board.spaces[2].player = player;
    board.spaces[2].tile = { tileType: TileType.GREENERY };
    board.spaces[7].player = player2;
    board.spaces[7].tile = { tileType: TileType.GREENERY };
    board.spaces[8].player = player2;
    board.spaces[8].tile = { tileType: TileType.GREENERY };
    const availableSpaces = board.getAvailableSpacesForGreenery(player);
    expect(availableSpaces).has.lengthOf(
      board.getAvailableSpacesOnLand(player).length,
    );
  });

  it('Can only place greenery adjacent to a tile a player owns', () => {
    board.spaces[2].player = player;
    board.spaces[2].tile = { tileType: TileType.GREENERY };
    board.spaces[7].player = player2;
    board.spaces[7].tile = { tileType: TileType.GREENERY };
    const availableSpaces = board.getAvailableSpacesForGreenery(player);
    expect(availableSpaces).has.lengthOf(1);
  });

  // function expectSpace(space: Space, id: string, x: number, y: number) {
  //   if (id !== space.id || x !== space.x || y !== space.y) {
  //     expect.fail(`space ${space.id} at (${space.x}, ${space.y}) does not match [${id}, ${x}, ${y}]`);
  //   }
  // }

  it('edges', () => {
    expect(board.getEdges().map(toID)).to.have.members([
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '13',
      '14',
      '20',
      '21',
      '28',
      '29',
      '37',
      '38',
      '45',
      '46',
      '52',
      '53',
      '58',
      '59',
      '60',
      '61',
      '62',
      '63',
    ]);
  });
});
