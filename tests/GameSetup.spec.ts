import { expect } from 'chai';
import { BoardName } from '../src/common/boards/BoardName';
import { normalizeBoardName } from '../src/server/GameSetup';

describe('GameSetup', () => {
  // Don't remove this test. It's a placeholder for board renames.
  it('finds renamed boards', () => {
    expect(normalizeBoardName('vastitas borealis novus')).to.equal(
      BoardName.VASTITAS_BOREALIS_NOVA,
    );
  });
});
