import {BoardName} from '../../common/boards/BoardName';
import {MilestoneName} from '../../common/ma/MilestoneName';
import {MAManifest} from '../ma/MAManifest';
import {Builder} from './Builder';
import {Gardener} from './Gardener';
import {IMilestone} from './IMilestone';
import {Mayor} from './Mayor';
import {Planner} from './Planner';
import {Terraformer} from './Terraformer';

export const milestoneManifest: MAManifest<MilestoneName, IMilestone> = {
  all: {
    'Terraformer': {Factory: Terraformer},
    'Mayor': {Factory: Mayor},
    'Gardener': {Factory: Gardener},
    'Builder': {Factory: Builder},
    'Planner': {Factory: Planner},
  },
  boards: {
    [BoardName.THARSIS]: [
      'Terraformer',
      'Mayor',
      'Gardener',
      'Builder',
      'Planner',
    ],
  },
  create: (name: string): IMilestone | undefined => {
    const spec = milestoneManifest.all[name as MilestoneName];
    return spec === undefined ? undefined : new spec.Factory();
  },
  createOrThrow(name: string): IMilestone {
    const milestone = milestoneManifest.create(name);
    if (milestone === undefined) {
      throw new Error(`Milestone ${name} not found.`);
    }
    return milestone;
  },
};
