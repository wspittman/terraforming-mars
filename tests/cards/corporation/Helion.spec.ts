import { cast } from '@/common/utils/utils';
import { expect } from 'chai';
import { Helion } from '../../../src/server/cards/corporation/Helion';
import { testGame } from '../../TestGame';
import { TestPlayer } from '../../TestPlayer';

describe('Helion', () => {
  let card: Helion;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Helion();
    [, /* game */ player] = testGame(1);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
    expect(player.production.heat).to.eq(3);

    player.megaCredits = 3;
    expect(player.canAfford(5)).to.be.false;

    player.heat = 2;
    expect(player.canAfford(5)).to.be.true;
  });
});
