import {MilestoneName} from '../ma/MilestoneName';
import {AwardName} from '../ma/AwardName';

/** MarsBot-specific descriptions for how milestones are evaluated. */
export const MARSBOT_MILESTONE_DESCRIPTIONS: Partial<Record<MilestoneName, string>> = {
  'Terraformer': 'TR \u2265 35',
  'Mayor': '3+ city tiles on board',
  'Gardener': '3+ greenery tiles on board',
  'Builder': 'Building track \u2265 8',
  'Planner': 'All tracks \u2265 4 (except Venus)',
};

/** MarsBot-specific descriptions for how awards are scored. */
export const MARSBOT_AWARD_DESCRIPTIONS: Partial<Record<AwardName, string>> = {
  Landlord: 'Total tiles on board',
  Banker: 'Building + Event track',
  Scientist: 'Science track',
  Thermalist: 'Energy track + 5',
  Miner: 'Space track + 5',
};
