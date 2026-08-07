import { expect } from 'chai';
import { SpaceType } from '../../../src/common/boards/SpaceType';
import { cast } from '../../../src/common/utils/utils';
import { Urbanist } from '../../../src/server/awards/terraCimmeria/Urbanist';
import { Capital } from '../../../src/server/cards/base/Capital';
import { SelectSpace } from '../../../src/server/inputs/SelectSpace';
import { testGame } from '../../TestGame';
import { addCity, addGreenery, churn, maxOutOceans } from '../../TestingUtils';

describe('Urbanist', () => {
  const award = new Urbanist();

  it('score', () => {
    const [game, player] = testGame(2);
    const [citySpace] = game.board.getAvailableSpacesForCity(player);
    addCity(player, citySpace.id);

    expect(award.getScore(player)).eq(0);

    const greeneries = game.board.getAdjacentSpaces(citySpace);
    addGreenery(player, greeneries[0].id);

    expect(award.getScore(player)).eq(1);

    addGreenery(player, greeneries[1].id);

    expect(award.getScore(player)).eq(2);

    citySpace.tile = undefined;

    expect(award.getScore(player)).eq(0);
  });

  it('Score with Capital', () => {
    const [game, player] = testGame(2);
    const oceanSpaces = maxOutOceans(player);
    const capital = new Capital();
    const selectSpace = cast(churn(capital.play(player), player), SelectSpace);
    player.playedCards.push(capital);
    const citySpace = game.board.getAdjacentSpaces(oceanSpaces[0])[1];
    expect(citySpace.spaceType).to.eq(SpaceType.LAND);

    expect(award.getScore(player)).eq(0);

    selectSpace.cb(citySpace);

    expect(capital.getVictoryPoints(player)).to.eq(1);
    expect(award.getScore(player)).eq(1);

    const greeneries = game.board
      .getAdjacentSpaces(citySpace)
      .filter((space) => space.tile === undefined);
    addGreenery(player, greeneries[0].id);
    expect(award.getScore(player)).eq(2);
  });
});
