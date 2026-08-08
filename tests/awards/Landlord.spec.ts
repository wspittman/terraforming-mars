import {expect} from 'chai';
import {Landlord} from '../../src/server/awards/Landlord';
import {SpaceName} from '../../src/common/boards/SpaceName';
import {EmptyBoard} from '../testing/EmptyBoard';
import {addCity, addGreenery, testGame} from '../TestingUtils';

describe('Landlord', () => {
  const award = new Landlord();

  it('Simple test', () => {
    const [game, player/* , player2 */] = testGame(2, {aresExtension: true});
    game.board = EmptyBoard.newInstance();

    expect(award.getScore(player)).to.eq(0);

    addCity(player, SpaceName.NOCTIS_CITY);
    expect(award.getScore(player)).to.eq(1);

    addGreenery(player, '35');
    expect(award.getScore(player)).to.eq(2);
  });
});
