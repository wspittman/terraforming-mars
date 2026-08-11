import { expect } from 'chai';
import { BoardName } from '../../src/common/boards/BoardName';
import { AwardName } from '../../src/common/ma/AwardName';
import { MilestoneName } from '../../src/common/ma/MilestoneName';
import { RandomMAOptionType } from '../../src/common/ma/RandomMAOptionType';
import { awardManifest } from '../../src/server/awards/Awards';
import {
  DEFAULT_GAME_OPTIONS,
  GameOptions,
} from '../../src/server/game/GameOptions';
import {
  chooseMilestonesAndAwards,
  getCandidates,
  LIMITED_SYNERGY,
  maximumSynergy,
  verifySynergyRules,
} from '../../src/server/ma/MilestoneAwardSelector';
import { milestoneManifest } from '../../src/server/milestones/Milestones';

describe('MilestoneAwardSelector', () => {
  const maximumSynergyRuns = [
    {
      mas: [
        ...milestoneManifest.boards[BoardName.THARSIS],
        ...awardManifest.boards[BoardName.THARSIS],
      ],
      expected: 6,
    },
  ] as const;
  // These aren't particularly excellent tests as much as they help demonstrate
  // what the original maps, if selected in full, would have as a synergy.
  maximumSynergyRuns.forEach((run, idx) => {
    it('Compute maximum synergy ' + idx, () => {
      const mas: ReadonlyArray<MilestoneName | AwardName> = run.mas;
      expect(maximumSynergy(mas)).to.eq(run.expected);
    });
  });

  const verifySynergyRuns = [
    {
      milestones: milestoneManifest.boards[BoardName.THARSIS],
      awards: awardManifest.boards[BoardName.THARSIS],
      expected: true,
    },
  ] as const;
  // These aren't particularly excellent tests as much as they help demonstrate
  // what the original maps, if selected in full, would have as a synergy.
  verifySynergyRuns.forEach((run, idx) => {
    it('Verify limited synergy ' + idx, () => {
      expect(
        verifySynergyRules(run.milestones, run.awards, LIMITED_SYNERGY),
      ).to.eq(run.expected);
    });
  });

  it('Tharsis milestones and awards break stringent limited synergy rules', () => {
    // Tharsis milestones and awards break rules if allowed no synergy whatsoever.
    expect(
      verifySynergyRules(
        milestoneManifest.boards[BoardName.THARSIS],
        awardManifest.boards[BoardName.THARSIS],
        {
          highThreshold: 10,
          maxSynergyAllowed: 0,
          numberOfHighAllowed: 0,
          totalSynergyAllowed: 0,
        },
      ),
    ).eq(false);
  });

  const sanityTestRuns = [
    { options: { randomMA: RandomMAOptionType.NONE } },
    { options: { randomMA: RandomMAOptionType.LIMITED } },
    { options: { randomMA: RandomMAOptionType.UNLIMITED } },
  ] as const;
  sanityTestRuns.forEach((run, idx) => {
    it('sanity test run ' + idx, () => {
      // These tests don't test results, they just make sure these calls don't fail.
      choose(run.options);
    });
  });


  it('only selects base game milestones', () => {
    const [milestones] = getCandidates({
      ...DEFAULT_GAME_OPTIONS,
      randomMA: RandomMAOptionType.UNLIMITED,
      includeFanMA: true,
      modularMA: true,
    });

    expect(milestones).to.have.members([
      'Terraformer',
      'Mayor',
      'Gardener',
      'Builder',
      'Planner',
    ]);
  });

  function choose(options: Partial<GameOptions>) {
    return chooseMilestonesAndAwards({ ...DEFAULT_GAME_OPTIONS, ...options });
  }
});
