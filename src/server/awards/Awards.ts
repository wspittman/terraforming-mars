import {AwardName} from '../../common/ma/AwardName';
import {Banker} from './Banker';
import {IAward} from './IAward';
import {Landlord} from './Landlord';
import {Miner} from './Miner';
import {Scientist} from './Scientist';
import {Thermalist} from './Thermalist';

const awardFactories: Record<AwardName, new () => IAward> = {
  Banker: Banker,
  Landlord: Landlord,
  Miner: Miner,
  Scientist: Scientist,
  Thermalist: Thermalist,
};

export const awards: ReadonlyArray<AwardName> = ['Landlord', 'Scientist', 'Banker', 'Thermalist', 'Miner'];

export function createAward(name: string): IAward | undefined {
  const Factory = awardFactories[name as AwardName];
  return Factory === undefined ? undefined : new Factory();
}

export function createAwardOrThrow(name: string): IAward {
  const award = createAward(name);
  if (award === undefined) {
    throw new Error(`Award ${name} not found.`);
  }
  return award;
}
