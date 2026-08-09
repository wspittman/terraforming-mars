import { expect } from 'chai';
import { isIActionCard } from '../../src/server/cards/ICard';
import { MicroMills } from '../../src/server/cards/base/MicroMills';
import { Tardigrades } from '../../src/server/cards/base/Tardigrades';
import { EcoLine } from '../../src/server/cards/corporation/EcoLine';

describe('ICard', () => {
  const runs = [
    { description: 'automated card', card: new MicroMills(), expected: false },
    {
      description: 'blue card with active effect',
      card: new Tardigrades(),
      expected: true,
    },
    {
      description: 'corporation with passive effect',
      card: new EcoLine(),
      expected: false,
    },
  ] as const;
  for (const run of runs) {
    it('isIActionCard - ' + run.description, () => {
      expect(isIActionCard(run.card)).eq(run.expected);
    });
  }
});
