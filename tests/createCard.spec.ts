import { expect } from 'chai';
import { CardName } from '../src/common/cards/CardName';
import { newProjectCard } from '../src/server/createCard';

describe('createCard', () => {
  it('newProjectCard: success', () => {
    expect(newProjectCard(CardName.AI_CENTRAL)?.name).eq(CardName.AI_CENTRAL);
  });
  it('newProjectCard: failure', () => {
    expect(newProjectCard(CardName.ECOLINE)).is.undefined;
  });
});
