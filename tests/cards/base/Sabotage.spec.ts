import { cast } from '@/common/utils/utils';
import { expect } from 'chai';
import { Sabotage } from '../../../src/server/cards/base/Sabotage';
import { OrOptions } from '../../../src/server/inputs/OrOptions';
import { testGame } from '../../TestGame';

describe('Sabotage', () => {
  it('Should play', () => {
    const card = new Sabotage();
    const [, /* game */ player, player2] = testGame(2);
    player2.titanium = 3;
    player2.steel = 4;
    player2.megaCredits = 7;

    const action = cast(card.play(player), OrOptions);

    expect(action.options).has.lengthOf(4);

    action.options[0].cb();
    expect(player2.titanium).to.eq(0);

    action.options[1].cb();
    expect(player2.steel).to.eq(0);

    action.options[2].cb();
    expect(player2.megaCredits).to.eq(0);
  });

  it('Solo', () => {
    const card = new Sabotage();
    const [, /* game */ player] = testGame(1);
    cast(card.play(player), undefined);
  });
});
