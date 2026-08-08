import { expect } from 'chai';
import { TileType } from '../../../src/common/TileType';
import { cast } from '../../../src/common/utils/utils';
import { NuclearZone } from '../../../src/server/cards/base/NuclearZone';
import { SelectSpace } from '../../../src/server/inputs/SelectSpace';
import { testGame } from '../../TestGame';
import { runAllActions } from '../../TestingUtils';

describe('NuclearZone', () => {
  it('Should play', () => {
    const card = new NuclearZone();
    const [game, player] = testGame(2);
    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.spaces[0];
    action.cb(space);
    expect(space.tile?.tileType).to.eq(TileType.NUCLEAR_ZONE);
    expect(card.getVictoryPoints(player)).to.eq(-2);
    expect(game.getTemperature()).to.eq(-26);
  });
});
