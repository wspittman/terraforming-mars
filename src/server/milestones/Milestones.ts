import {MilestoneName} from '../../common/ma/MilestoneName';
import {Builder} from './Builder';
import {Gardener} from './Gardener';
import {IMilestone} from './IMilestone';
import {Mayor} from './Mayor';
import {Planner} from './Planner';
import {Terraformer} from './Terraformer';

const milestoneFactories: Record<MilestoneName, new () => IMilestone> = {
  'Terraformer': Terraformer,
  'Mayor': Mayor,
  'Gardener': Gardener,
  'Builder': Builder,
  'Planner': Planner,
};

export const milestones: ReadonlyArray<MilestoneName> = ['Terraformer', 'Mayor', 'Gardener', 'Builder', 'Planner'];

export function createMilestone(name: string): IMilestone {
  const Factory = milestoneFactories[name as MilestoneName];
  if (Factory === undefined) {
    throw new Error(`Milestone ${name} not found.`);
  }
  return new Factory();
}
