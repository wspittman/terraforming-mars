import {expect} from 'chai';
import {deserializeClaimedMilestones, serializeClaimedMilestones} from '../../src/server/milestones/ClaimedMilestone';
import {ClaimedMilestone} from '../../src/server/milestones/ClaimedMilestone';
import {Builder} from '../../src/server/milestones/Builder';
import {Gardener} from '../../src/server/milestones/Gardener';
import {TestPlayer} from '../TestPlayer';

describe('ClaimedMilestones', () => {
  it('test serialization', () => {
    const bluePlayer = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const claimedMilestones: Array<ClaimedMilestone> = [
      {
        milestone: new Builder(),
        player: bluePlayer,
      }, {
        milestone: new Gardener(),
        player: redPlayer,
      },
    ];
    const serialized = serializeClaimedMilestones(claimedMilestones);
    expect(serialized).to.deep.eq(
      [
        {'name': 'Builder', 'playerId': 'p-blue-id'},
        {'name': 'Gardener', 'playerId': 'p-red-id'},
      ],
    );

    const builder = new Builder();
    const gardener = new Gardener();
    const deserialized = deserializeClaimedMilestones(
      serialized,
      [redPlayer, bluePlayer],
      [builder, gardener]);
    expect(deserialized[0].milestone === builder);
    expect(deserialized[0].player === bluePlayer);
    expect(deserialized[1].milestone === gardener);
    expect(deserialized[1].player === redPlayer);
  });
});
