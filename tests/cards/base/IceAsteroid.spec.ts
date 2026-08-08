import { cast } from '../../../src/common/utils/utils';
import { IceAsteroid } from '../../../src/server/cards/base/IceAsteroid';
import { testGame } from '../../TestGame';

describe('IceAsteroid', () => {
  it('Should play', () => {
    const card = new IceAsteroid();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);
  });
});
