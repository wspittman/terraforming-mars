import { expect } from 'chai';
import { TileType } from '../../../src/common/TileType';
import { cast } from '../../../src/common/utils/utils';
import { ProtectedValley } from '../../../src/server/cards/base/ProtectedValley';
import { testGame } from '../../TestGame';
import { runAllActions } from '../../TestingUtils';
import { assertPlaceTile } from '../../assertions';

describe('ProtectedValley', () => {
  it('Should play', () => {
    const card = new ProtectedValley();
    const [game, player] = testGame(2);
    cast(card.play(player), undefined);
    runAllActions(game);

    assertPlaceTile(player, player.popWaitingFor(), TileType.GREENERY);

    expect(player.production.megacredits).to.eq(2);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
