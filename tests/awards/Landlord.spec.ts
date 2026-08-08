import {expect} from 'chai';
import {Landlord} from '../../src/server/awards/Landlord';
import {SpaceName} from '../../src/common/boards/SpaceName';
import {EmptyBoard} from '../testing/EmptyBoard';
import {AresHazards} from '../../src/server/ares/AresHazards';
import {TileType} from '../../src/common/TileType';
import {LandClaim} from '../../src/server/cards/base/LandClaim';
import {addCity, addGreenery, testGame} from '../TestingUtils';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';
import {cast} from '../../src/common/utils/utils';

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


  it('Exclude Landclaimed Ares hazard tile from land-based award', () => {
    const [game, player/* , player2 */] = testGame(2, {aresExtension: true});

    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    AresHazards.putHazardAt(game, firstSpace, TileType.DUST_STORM_MILD);

    expect(award.getScore(player)).to.eq(0);

    const card = new LandClaim();
    const action = cast(card.play(player), SelectSpace);
    action.cb(firstSpace);

    expect(firstSpace.player).to.eq(player);
    expect(firstSpace.tile?.tileType).is.eq(TileType.DUST_STORM_MILD);
    expect(award.getScore(player)).to.eq(0);
  });
});
