import {BoardName} from '../../common/boards/BoardName';
import {AwardName} from '../../common/ma/AwardName';
import {MAManifest} from '../ma/MAManifest';
import {Banker} from './Banker';
import {IAward} from './IAward';
import {Landlord} from './Landlord';
import {Miner} from './Miner';
import {Scientist} from './Scientist';
import {Thermalist} from './Thermalist';

export const awardManifest: MAManifest<AwardName, IAward> = {
  all: {
    Banker: {Factory: Banker},
    Landlord: {Factory: Landlord},
    Miner: {Factory: Miner},
    Scientist: {Factory: Scientist},
    Thermalist: {Factory: Thermalist},
  },
  boards: {
    [BoardName.THARSIS]: ['Landlord', 'Scientist', 'Banker', 'Thermalist', 'Miner'],
  },
  create(name: string): IAward | undefined {
    try {
      return awardManifest.createOrThrow(name);
    } catch (e) {
      return undefined;
    }
  },
  createOrThrow(name: string): IAward {
    const spec = awardManifest.all[name as AwardName];
    if (spec === undefined) {
      throw new Error(`Award ${name} not found.`);
    }
    return new spec.Factory();
  },
};
