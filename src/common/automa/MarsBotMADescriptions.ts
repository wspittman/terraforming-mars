import {MilestoneName} from '../ma/MilestoneName';
import {AwardName} from '../ma/AwardName';

/** MarsBot-specific descriptions for how milestones are evaluated. */
export const MARSBOT_MILESTONE_DESCRIPTIONS: Partial<Record<MilestoneName, string>> = {
  // Tharsis
  'Terraformer': 'TR \u2265 35',
  'Mayor': '3+ city tiles on board',
  'Gardener': '3+ greenery tiles on board',
  'Builder': 'Building track \u2265 8',
  'Planner': 'All tracks \u2265 4 (except Venus)',
  // Hellas
  'Diversifier': 'All tracks \u2265 3',
  'Tactician': '35+ MC',
  'Energizer': 'Energy track \u2265 6',
  'Rim Settler': 'Space + Science track \u2265 6',
  // Elysium
  'Generalist': 'All tracks \u2265 2 (except Venus)',
  'Specialist': 'Any track \u2265 10',
  'Ecologist': 'Bio track \u2265 4',
  'Tycoon': '15 green/blue cards in played pile',
  'Legend': '5 red cards in played pile',
  // Terra Cimmeria Nova
  'Architect': 'Science track \u2265 6',
  'Coastguard': '4+ tiles adjacent to ocean',
  'C. Forester': 'Bio track \u2265 10',
  // Vastitas Borealis Nova
  'Agronomist': 'Bio + Science track \u2265 4',
  'Engineer': 'Energy + Science track \u2265 10',
  'V. Spacefarer': 'Space track \u2265 5',
  'Farmer': 'Science + Event \u2265 6 OR Bio + Science \u2265 6',
  // Modular
  'Briber': '20+ MC (loses 12 MC on claim)',
  'Builder7': 'Building track \u2265 7',
  'Forester': 'Bio track \u2265 6',
  'Fundraiser': 'Energy track \u2265 8',
  'Hydrologist': '4 oceans placed',
  'Landshaper': '1+ city, 1+ greenery, Building track \u2265 5',
  'Legend4': '4 red cards in played pile',
  'Merchant': 'All tracks \u2265 2 (except Venus)',
  'Metallurgist': 'Building + Space tracks \u2265 9',
  'Philantropist': '5 cards with non-negative VP',
  'Producer': 'Any 3 tracks (except Venus) \u2265 16',
  'Researcher': 'Science track \u2265 4',
  'Spacefarer4': 'Space track \u2265 4',
  'Tactician4': '30+ MC',
  'Terran5': 'Earth track \u2265 5',
  'Thawer': 'Raised temperature 5+ times',
  'Tycoon10': '10 blue/green cards in played pile',
};

/** MarsBot-specific descriptions for how awards are scored. */
export const MARSBOT_AWARD_DESCRIPTIONS: Partial<Record<AwardName, string>> = {
  Landlord: 'Total tiles on board',
  Banker: 'Building + Event track',
  Scientist: 'Science track',
  Thermalist: 'Energy track + 5',
  Miner: 'Space track + 5',
};
