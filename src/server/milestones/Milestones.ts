import { BoardName } from '../../common/boards/BoardName';
import { MilestoneName } from '../../common/ma/MilestoneName';
import { MAManifest } from '../ma/MAManifest';
import { Agronomist } from './Agronomist';
import { Economizer } from './arabiaTerra/Economizer';
import { LandSpecialist } from './arabiaTerra/LandSpecialist';
import { Martian } from './arabiaTerra/Martian';
import { Pioneer } from './arabiaTerra/Pioneer';
import { Architect } from './Architect';
import { Briber } from './Briber';
import { Builder } from './Builder';
import { Builder7 } from './Builder7';
import { Capitalist } from './Capitalist';
import { Diversifier } from './Diversifier';
import { Ecologist } from './Ecologist';
import { Energizer } from './Energizer';
import { Gardener } from './Gardener';
import { Generalist } from './Generalist';
import { Hoverlord } from './Hoverlord';
import { IMilestone } from './IMilestone';
import { Coastguard, Irrigator } from './Irrigator';
import { Legend } from './Legend';
import { Mayor } from './Mayor';
import { Metallurgist } from './Metallurgist';
import { Engineer } from './modular/Engineer';
import { Farmer } from './modular/Farmer';
import { CForester, Forester } from './modular/Forester';
import { Fundraiser } from './modular/Fundraiser';
import { Geologist } from './modular/Geologist';
import { Hydrologist } from './modular/Hydrologist';
import { Landshaper } from './modular/Landshaper';
import { Legend4 } from './modular/Legend4';
import { Lobbyist } from './modular/Lobbyist';
import { Merchant } from './modular/Merchant';
import { Philantropist } from './modular/Philantropist';
import { Planetologist } from './modular/Planetologist';
import { Producer } from './modular/Producer';
import { Researcher } from './modular/Researcher';
import { Sponsor } from './modular/Sponsor';
import { Tactician4 } from './modular/Tactician4';
import { Terraformer29 } from './modular/Terraformer29';
import { Terran5 } from './modular/Terran5';
import { Thawer } from './modular/Thawer';
import { Trader } from './modular/Trader';
import { Tycoon10 } from './modular/Tycoon10';
import { Networker } from './Networker';
import { Planner } from './Planner';
import { PolarExplorer } from './PolarExplorer';
import { Purifier } from './Purifier';
import { RimSettler } from './RimSettler';
import { Smith } from './Smith';
import { Specialist } from './Specialist';
import { Tactician } from './Tactician';
import { Collector } from './terraCimmeria/Collector';
import { Firestarter } from './terraCimmeria/Firestarter';
import { Gambler } from './terraCimmeria/Gambler';
import { Spacefarer } from './terraCimmeria/Spacefarer';
import { Spacefarer4 } from './terraCimmeria/Spacefarer4';
import { TerraPioneer } from './terraCimmeria/TerraPioneer';
import { Terraformer } from './Terraformer';
import { Tradesman } from './Tradesman';
import { Tycoon } from './Tycoon';
import { Risktaker } from './underworld/Risktaker';
import { Tunneler } from './underworld/Tunneler';
import { VElectrician } from './VElectrician';
import { VSpacefarer } from './VSpacefarer';

export const milestoneManifest: MAManifest<MilestoneName, IMilestone> = {
  all: {
    'Agronomist': { Factory: Agronomist },
    'Architect': { Factory: Architect },
    'Briber': { Factory: Briber, random: 'modular' },
    'Builder': { Factory: Builder },
    'Builder7': { Factory: Builder7, random: 'modular' },
    'C. Forester': { Factory: CForester },
    'Capitalist': { Factory: Capitalist },
    'Coastguard': { Factory: Coastguard, random: 'modular' },
    'Diversifier': { Factory: Diversifier, random: 'modular' },
    'Ecologist': { Factory: Ecologist, random: 'both' },
    'Economizer': { Factory: Economizer },
    'Energizer': { Factory: Energizer, random: 'both' },
    'Engineer': { Factory: Engineer, random: 'modular' },
    'Farmer': { Factory: Farmer, random: 'modular' },
    'Firestarter': { Factory: Firestarter },
    'Forester': { Factory: Forester, deprecated: true },
    'Fundraiser': { Factory: Fundraiser, random: 'modular' },
    'Gambler': { Factory: Gambler },
    'Gardener': { Factory: Gardener, random: 'both' },
    'Generalist': { Factory: Generalist, random: 'both' },
    'Geologist': { Factory: Geologist, random: 'modular' },
    'Hoverlord': { Factory: Hoverlord, compatibility: 'venus' },
    'Hydrologist': { Factory: Hydrologist, random: 'modular' },
    'Irrigator': { Factory: Irrigator, deprecated: true },
    'Land Specialist': { Factory: LandSpecialist },
    'Landshaper': { Factory: Landshaper, random: 'modular' },
    'Legend': { Factory: Legend },
    'Legend4': { Factory: Legend4, random: 'modular' },
    'Lobbyist': {
      Factory: Lobbyist,
      compatibility: 'turmoil',
      random: 'modular',
    },
    'Martian': { Factory: Martian, compatibility: 'pathfinders' },
    'Mayor': { Factory: Mayor, random: 'both' },
    'Merchant': { Factory: Merchant, random: 'modular' },
    'Metallurgist': { Factory: Metallurgist, random: 'modular' },
    'Networker': { Factory: Networker, compatibility: 'ares' },
    'Philantropist': { Factory: Philantropist, random: 'modular' },
    'Pioneer': { Factory: Pioneer, compatibility: 'colonies' },
    'Pioneer4': {
      Factory: Pioneer,
      compatibility: 'colonies',
      random: 'modular',
    },
    'Planetologist': {
      Factory: Planetologist,
      compatibility: 'venus',
      random: 'modular',
    },
    'Planner': { Factory: Planner, random: 'both' },
    'Polar Explorer': { Factory: PolarExplorer },
    'Producer': { Factory: Producer, random: 'modular' },
    'Purifier': { Factory: Purifier, compatibility: 'ares' },
    'Researcher': { Factory: Researcher, random: 'modular' },
    'Rim Settler': { Factory: RimSettler, random: 'both' },
    'Risktaker': { Factory: Risktaker, compatibility: 'underworld' },
    'Smith': { Factory: Smith },
    'Spacefarer': { Factory: Spacefarer },
    'Spacefarer4': { Factory: Spacefarer4, random: 'modular' },
    'Specialist': { Factory: Specialist },
    'Sponsor': { Factory: Sponsor, random: 'modular' },
    'T. Collector': { Factory: Collector },
    'Tactician': { Factory: Tactician },
    'Tactician4': { Factory: Tactician4, random: 'modular' },
    'Terra Pioneer': { Factory: TerraPioneer },
    'Terraformer': { Factory: Terraformer },
    'Terraformer29': { Factory: Terraformer29, random: 'modular' },
    'Terran5': { Factory: Terran5, random: 'modular' },
    'Thawer': { Factory: Thawer, random: 'modular' },
    'Trader': { Factory: Trader, random: 'modular' },
    'Tradesman': { Factory: Tradesman },
    'Tunneler': { Factory: Tunneler, compatibility: 'underworld' },
    'Tycoon': { Factory: Tycoon },
    'Tycoon10': { Factory: Tycoon10, random: 'modular' },
    'V. Electrician': { Factory: VElectrician },
    'V. Spacefarer': { Factory: VSpacefarer },
  },
  boards: {
    [BoardName.THARSIS]: [
      'Terraformer',
      'Mayor',
      'Gardener',
      'Builder',
      'Planner',
    ],
    [BoardName.HELLAS]: [
      'Diversifier',
      'Tactician',
      'Polar Explorer',
      'Energizer',
      'Rim Settler',
    ],
    [BoardName.ELYSIUM]: [
      'Generalist',
      'Specialist',
      'Ecologist',
      'Tycoon',
      'Legend',
    ],
    [BoardName.ARABIA_TERRA]: [
      'Economizer',
      'Pioneer',
      'Land Specialist',
      'Martian',
    ],
    [BoardName.VASTITAS_BOREALIS]: [
      'V. Electrician',
      'Smith',
      'Tradesman',
      'Irrigator',
      'Capitalist',
    ],
    [BoardName.UTOPIA_PLANITIA]: [
      'Land Specialist',
      'Pioneer',
      'Tradesman',
      'Smith',
      'Researcher',
    ],
    [BoardName.VASTITAS_BOREALIS_NOVA]: [
      'Agronomist',
      'V. Spacefarer',
      'Geologist',
      'Engineer',
      'Farmer',
    ],
    [BoardName.HOLLANDIA]: [],
  },
  expansions: {
    venus: ['Hoverlord'],
    ares: ['Networker', 'Purifier'],
    underworld: ['Risktaker', 'Tunneler'],
  },
  create: (name: string): IMilestone | undefined => {
    try {
      return milestoneManifest.createOrThrow(name);
    } catch (e) {
      return undefined;
    }
  },
  createOrThrow(name: string): IMilestone {
    try {
      return new milestoneManifest.all[name as MilestoneName].Factory();
    } catch (e) {
      throw new Error(`Milestone ${name} not found.`);
    }
  },
} as const;
