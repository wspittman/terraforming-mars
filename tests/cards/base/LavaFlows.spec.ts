import { expect } from 'chai';
import { BoardName } from '../../../src/common/boards/BoardName';
import { TileType } from '../../../src/common/TileType';
import { cast } from '../../../src/common/utils/utils';
import { LavaFlows } from '../../../src/server/cards/base/LavaFlows';
import { IGame } from '../../../src/server/IGame';
import { SelectSpace } from '../../../src/server/inputs/SelectSpace';
import { testGame } from '../../TestGame';
import { runAllActions } from '../../TestingUtils';
import { TestPlayer } from '../../TestPlayer';

describe('LavaFlows', () => {
  let card: LavaFlows;
  let player: TestPlayer;
  let otherPlayer: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new LavaFlows();
    [game, player, otherPlayer] = testGame(2);
  });

  it('Cannot play if no available spaces', () => {
    const [first, ...rest] = game.board.volcanicSpaceIds.map((id) =>
      game.board.getSpaceOrThrow(id),
    );
    for (const space of rest) {
      game.addTile(player, space, { tileType: TileType.LAVA_FLOWS });
    }

    expect(card.canPlay(player)).is.true;

    first.player = otherPlayer; // land claim
    expect(card.canPlay(player)).is.not.true;
  });

  it('All land spaces are available on Hellas', () => {
    // With two players, there's no solo setup, so all spaces will be available.
    [game, player] = testGame(2, { boardName: BoardName.HELLAS });

    cast(card.play(player), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    expect(action.spaces).deep.eq(game.board.getAvailableSpacesOnLand(player));
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.spaces[0];
    action.cb(space);

    expect(space.tile!.tileType).to.eq(TileType.LAVA_FLOWS);
    expect(space.player).to.eq(player);
    expect(game.getTemperature()).to.eq(-26);
    expect(space.adjacency?.bonus).eq(undefined);
  });
});
