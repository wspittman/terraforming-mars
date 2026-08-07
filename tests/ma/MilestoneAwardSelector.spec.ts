import { expect } from 'chai';
import { BoardName } from '../../src/common/boards/BoardName';
import { AwardName } from '../../src/common/ma/AwardName';
import { MilestoneName } from '../../src/common/ma/MilestoneName';
import { RandomMAOptionType } from '../../src/common/ma/RandomMAOptionType';
import { intersection } from '../../src/common/utils/utils';
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
    // Gardener / Landlord have synergy 6.
    {
      mas: [
        ...milestoneManifest.boards[BoardName.THARSIS],
        ...awardManifest.boards[BoardName.THARSIS],
      ],
      expected: 6,
    },
    // DesertSettler / Estate Dealer has synergy 5.
    {
      mas: [
        ...milestoneManifest.boards[BoardName.ELYSIUM],
        ...awardManifest.boards[BoardName.ELYSIUM],
      ],
      expected: 5,
    },
    // Both pairs Polar Explorer / Cultivator and Rim Settler / Space Baron
    // have synergy 3.
    {
      mas: [
        ...milestoneManifest.boards[BoardName.HELLAS],
        ...awardManifest.boards[BoardName.HELLAS],
      ],
      expected: 3,
    },
    // Hoverlord / Venuphine have synergy 5.
    {
      mas: [
        ...milestoneManifest.expansions['venus'],
        ...awardManifest.expansions['venus'],
      ],
      expected: 5,
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
    // Tharsis milestones and awards has total synergy of 21 and break the rules.
    {
      milestones: milestoneManifest.boards[BoardName.THARSIS],
      awards: awardManifest.boards[BoardName.THARSIS],
      expected: false,
    },
    // Elysium milestones and awards has total synergy of 13 and two high pairs of 4 and 5.
    // This set does not break the rules.
    {
      milestones: milestoneManifest.boards[BoardName.ELYSIUM],
      awards: awardManifest.boards[BoardName.ELYSIUM],
      expected: true,
    },
    // Hellas milestones and awards has total synergy of 11 and no high pair. It does not break the rules.
    {
      milestones: milestoneManifest.boards[BoardName.HELLAS],
      awards: awardManifest.boards[BoardName.HELLAS],
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

  it('Hellas milestones and awards break stringent limited synergy rules', () => {
    // Hellas milestones and awards break rules if allowed no synergy whatsoever.
    expect(
      verifySynergyRules(
        milestoneManifest.boards[BoardName.HELLAS],
        awardManifest.boards[BoardName.HELLAS],
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

  // it('No modular milestones and awards by default', () => {
  //   const [milestones, awards] = getCandidates({...DEFAULT_GAME_OPTIONS,
  //     randomMA: RandomMAOptionType.UNLIMITED,
  //     venusNextExtension: true,
  //     aresExtension: true,
  //     moonExpansion: true,
  //     coloniesExtension: true,
  //     turmoilExtension: true,
  //     includeFanMA: true,
  //   });

  //   // expect(intersection(milestones, milestoneManifest.modular)).deep.eq([]);
  //   // expect(intersection(awards, awardManifest.modular)).deep.eq([]);

  //   // Landlord is listed as modular, but should be included here.
  //   expect(awards).to.contain('Landlord');
  // });

  it('Do not select deprecated milestones or awards', () => {
    const [milestones, awards] = getCandidates({
      ...DEFAULT_GAME_OPTIONS,
      randomMA: RandomMAOptionType.UNLIMITED,
      includeFanMA: true,
    });

    const deprecatedMilestones = Object.keys(milestoneManifest.all).filter(
      (name) => milestoneManifest.all[name as MilestoneName].deprecated,
    );
    const deprecatedAwards = Object.keys(awardManifest.all).filter(
      (name) => awardManifest.all[name as AwardName].deprecated,
    );

    expect(intersection(milestones as Array<string>, deprecatedMilestones)).is
      .empty;
    expect(intersection(awards as Array<string>, deprecatedAwards)).is.empty;
  });

  function choose(options: Partial<GameOptions>) {
    return chooseMilestonesAndAwards({ ...DEFAULT_GAME_OPTIONS, ...options });
  }
});
