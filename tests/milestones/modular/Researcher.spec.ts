import { expect } from 'chai';
import { Researcher } from '../../../src/server/milestones/modular/Researcher';
import { testGame } from '../../TestGame';
import { TestPlayer } from '../../TestPlayer';

describe('Researcher', () => {
  let milestone: Researcher;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Researcher();
    [, /* game */ player] = testGame(2);
  });

  it('Standard test', () => {
    expect(milestone.canClaim(player)).is.not.true;

    player.tagsForTest = { science: 3 };
    expect(milestone.canClaim(player)).is.not.true;

    player.tagsForTest = { science: 4 };
    expect(milestone.canClaim(player)).is.true;

    // Wild tag counts.
    player.tagsForTest = { science: 3, wild: 1 };
    expect(milestone.canClaim(player)).is.true;
  });
});
