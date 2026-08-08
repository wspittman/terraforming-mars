import { expect } from 'chai';
import { cast } from '../../../src/common/utils/utils';
import { RegolithEaters } from '../../../src/server/cards/base/RegolithEaters';
import { OrOptions } from '../../../src/server/inputs/OrOptions';
import { testGame } from '../../TestGame';
import { churn, runAllActions } from '../../TestingUtils';

describe('RegolithEaters', () => {
  it('Should act', () => {
    const card = new RegolithEaters();
    const [game, player] = testGame(2);

    player.playedCards.push(card);
    expect(churn(card.action(player), player)).is.undefined;
    expect(card.resourceCount).to.eq(1);

    expect(churn(card.action(player), player)).is.undefined;
    expect(card.resourceCount).to.eq(2);

    const orOptions = cast(churn(card.action(player), player), OrOptions);

    orOptions.options[1].cb();
    runAllActions(game);
    expect(card.resourceCount).to.eq(3);

    orOptions.options[0].cb();
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
