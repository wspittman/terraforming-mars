import { expect } from 'chai';
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
});
