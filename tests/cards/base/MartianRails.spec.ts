import { expect } from 'chai';
import { cast } from '../../../src/common/utils/utils';
import { MartianRails } from '../../../src/server/cards/base/MartianRails';
import { testGame } from '../../TestGame';
import { addCity } from '../../TestingUtils';
import { TestPlayer } from '../../TestPlayer';

describe('MartianRails', () => {
  let card: MartianRails;
  let player: TestPlayer;

  beforeEach(() => {
    card = new MartianRails();
    [/* game */, player] = testGame(2);
  });

  it('Can not act without energy', () => {
    cast(card.play(player), undefined);
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', () => {
    player.energy = 1;
    expect(card.canAct(player)).is.true;
    addCity(player);

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(player.megaCredits).to.eq(1);
  });
});
