import { expect } from 'chai';
import { Tag } from '../../../src/common/cards/Tag';
import { Biologist } from '../../../src/server/awards/terraCimmeria/Biologist';
import { testGame } from '../../TestGame';
import { fakeCard } from '../../TestingUtils';
import { TestPlayer } from '../../TestPlayer';

describe('Biologist', () => {
  let award: Biologist;
  let player: TestPlayer;

  beforeEach(() => {
    award = new Biologist();
    [, /* game */ player] = testGame(2);
  });

  it('score', () => {
    expect(award.getScore(player)).eq(0);
    player.playedCards.push(fakeCard({ tags: [Tag.MICROBE] }));
    expect(award.getScore(player)).eq(1);
    player.playedCards.push(fakeCard({ tags: [Tag.ANIMAL] }));
    expect(award.getScore(player)).eq(2);
    player.playedCards.push(fakeCard({ tags: [Tag.PLANT] }));
    expect(award.getScore(player)).eq(3);
    player.playedCards.push(fakeCard({ tags: [Tag.BUILDING] }));
    expect(award.getScore(player)).eq(3);
    player.playedCards.push(fakeCard({ tags: [Tag.WILD] }));
    expect(award.getScore(player)).eq(3);
  });
});
