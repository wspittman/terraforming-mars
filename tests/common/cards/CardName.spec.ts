import { fail } from 'assert';
import { MultiSet } from 'mnemonist';
import { CardName } from '../../../src/common/cards/CardName';
import { getEnumStringEntries } from '../../../src/common/utils/utils';

describe('CardName', () => {
  it('No duplicate card names', () => {
    const counts = new MultiSet<string>();
    const map: Array<[string, CardName]> = [];
    const errors: Array<string> = [];

    for (const [enumName, cardName] of getEnumStringEntries(CardName)) {
      map.push([enumName, cardName]);
      counts.add(cardName);
    }
    counts.forEachMultiplicity((count, readableName) => {
      if (count > 1) {
        map.forEach(([enumName, cardName]) => {
          if (cardName === readableName) {
            errors.push(`${enumName} => ${readableName}`);
          }
        });
      }
    });
    if (errors.length > 0) {
      fail('Duplicate card names found\n' + errors.join('\n'));
    }
  });
});
