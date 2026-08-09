import { cast } from '@/common/utils/utils';
import { expect } from 'chai';
import { Birds } from '../../../src/server/cards/base/Birds';
import { EarthOffice } from '../../../src/server/cards/base/EarthOffice';
import { testGame } from '../../TestGame';
import { TestPlayer } from '../../TestPlayer';

describe('EarthOffice', () => {
  let card: EarthOffice;
  let player: TestPlayer;

  beforeEach(() => {
    card = new EarthOffice();
    [, /* game */ player] = testGame(2);

    cast(card.play(player), undefined);
  });

  it('Should play', () => {
    expect(card.getCardDiscount(player, card)).to.eq(3);
    expect(card.getCardDiscount(player, new Birds())).to.eq(0);
  });
});
