import { cast } from '@/common/utils/utils';
import { expect } from 'chai';
import { Birds } from '../../../src/server/cards/base/Birds';
import { Cartel } from '../../../src/server/cards/base/Cartel';
import { Teractor } from '../../../src/server/cards/corporation/Teractor';
import { testGame } from '../../TestGame';
import { TestPlayer } from '../../TestPlayer';

describe('Teractor', () => {
  let card: Teractor;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Teractor();
    [, /* game */ player] = testGame(2);

    cast(card.play(player), undefined);
  });

  it('Should play', () => {
    expect(card.getCardDiscount(player, new Cartel())).to.eq(3);
    expect(card.getCardDiscount(player, new Birds())).to.eq(0);
  });
});
