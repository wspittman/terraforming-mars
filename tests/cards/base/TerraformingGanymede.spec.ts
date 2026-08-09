import { expect } from 'chai';
import { cast } from '../../../src/common/utils/utils';
import { TerraformingGanymede } from '../../../src/server/cards/base/TerraformingGanymede';
import { testGame } from '../../TestingUtils';
import { TestPlayer } from '../../TestPlayer';

describe('TerraformingGanymede', () => {
  let card: TerraformingGanymede;
  let player: TestPlayer;

  beforeEach(() => {
    card = new TerraformingGanymede();
    [, player] = testGame(2);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
    expect(card.getVictoryPoints(player)).to.eq(2);
    player.playedCards.push(card);
    expect(player.terraformRating).to.eq(21);
  });
});
