import { expect } from 'chai';
import { CardType } from '../../../src/common/cards/CardType';
import { Tag } from '../../../src/common/cards/Tag';
import { Traveller } from '../../../src/server/awards/modular/Traveller';
import { testGame } from '../../TestGame';
import { fakeCard } from '../../TestingUtils';
import { TestPlayer } from '../../TestPlayer';

describe('Traveller', () => {
  let award: Traveller;
  let player: TestPlayer;

  beforeEach(() => {
    award = new Traveller();
    [, /* game */ player] = testGame(2);
  });

  it('Counts tags', () => {
    expect(award.getScore(player)).to.eq(0);

    player.playedCards.push(fakeCard({ tags: [Tag.JOVIAN] }));
    expect(award.getScore(player)).to.eq(1);

    player.playedCards.push(fakeCard({ tags: [Tag.EARTH] }));
    expect(award.getScore(player)).to.eq(2);

    player.playedCards.push(
      fakeCard({ tags: [Tag.EARTH, Tag.EARTH, Tag.JOVIAN] }),
    );
    expect(award.getScore(player)).to.eq(5);
  });

  it('Does NOT count wild tags', () => {
    expect(award.getScore(player)).to.eq(0);

    player.playedCards.push(fakeCard({ tags: [Tag.JOVIAN, Tag.BUILDING] }));
    expect(award.getScore(player)).to.eq(1);

    player.playedCards.push(fakeCard({ tags: [Tag.WILD] }));
    expect(award.getScore(player)).to.eq(1);
  });

  it('Does not count events', () => {
    expect(award.getScore(player)).to.eq(0);

    player.playedCards.push(fakeCard({ tags: [Tag.EARTH, Tag.BUILDING] }));
    expect(award.getScore(player)).to.eq(1);

    player.playedCards.push(
      fakeCard({ tags: [Tag.JOVIAN, Tag.BUILDING], type: CardType.EVENT }),
    );
    expect(award.getScore(player)).to.eq(1);
  });
});
