import { expect } from 'chai';
import { BoardName } from '../../../src/common/boards/BoardName';
import { SpaceName } from '../../../src/common/boards/SpaceName';
import * as constants from '../../../src/common/constants';
import { cast } from '../../../src/common/utils/utils';
import { LandClaim } from '../../../src/server/cards/base/LandClaim';
import { SelectSpace } from '../../../src/server/inputs/SelectSpace';
import { testGame } from '../../TestGame';

describe('LandClaim', () => {
  it('Should play', () => {
    const card = new LandClaim();
    const [, /* game */ player] = testGame(2);
    const action = cast(card.play(player), SelectSpace);
    const landSpace = player.game.board.getAvailableSpacesOnLand(player)[0];
    action.cb(landSpace);
    expect(landSpace.player).to.eq(player);
    expect(landSpace.tile).is.undefined;
  });

  it('can claim south pole on hellas board', () => {
    const card = new LandClaim();
    const [, /* game */ player] = testGame(2, { boardName: BoardName.HELLAS });
    const action = cast(card.play(player), SelectSpace);
    expect(player.canAfford(constants.HELLAS_BONUS_OCEAN_COST)).to.be.false;
    expect(
      action.spaces.some((space) => space.id === SpaceName.HELLAS_OCEAN_TILE),
    ).to.be.true;
  });
});
