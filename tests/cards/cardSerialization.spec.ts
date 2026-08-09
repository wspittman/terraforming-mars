import { expect } from 'chai';
import { CardName } from '../../src/common/cards/CardName';
import { serializeProjectCard } from '../../src/server/cards/cardSerialization';
import { SerializedCard } from '../../src/server/SerializedCard';
import { fakeCard } from '../TestingUtils';

describe('CardSerialization', () => {
  it('custom .serialized works', () => {
    let serializedCalled = false;
    let deserializedCalled = false;
    const card = fakeCard({ name: CardName.MICRO_MILLS });
    card.serialize = (serialized: SerializedCard) => {
      serializedCalled = true;
      serialized.data = 'hello';
    };
    card.deserialize = (serialized: SerializedCard) => {
      deserializedCalled = true;
      expect(serialized.data).eq('hello');
    };

    const serialized = serializeProjectCard(card);
    expect(serialized.data).eq('hello');
    expect(serializedCalled).is.true;
    expect(deserializedCalled).is.false;

    // It's not possible to call deserialize on a new fake
    // and no project cards use Deserialize yet.
    //
    // const newCard = deserializeProjectCard(serialized);
    // expect(deserializedCalled).is.true;
    // expect(newCard.data).eq('hello');
  });
});
