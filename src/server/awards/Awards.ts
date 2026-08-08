import { BoardName } from '../../common/boards/BoardName';
import { AwardName } from '../../common/ma/AwardName';
import { MAManifest } from '../ma/MAManifest';
import { Botanist } from './arabiaTerra/Botanist';
import { CosmicSettler } from './arabiaTerra/CosmicSettler';
import { AManufacturer } from './arabiaTerra/Manufacturer';
import { Promoter } from './arabiaTerra/Promoter';
import { Zoologist } from './arabiaTerra/Zoologist';
import { Banker } from './Banker';
import { Benefactor } from './Benefactor';
import { Blacksmith } from './Blacksmith';
import { Celebrity } from './Celebrity';
import { Contractor } from './Contractor';
import { Cultivator } from './Cultivator';
import { DesertSettler } from './DesertSettler';
import { Edgedancer } from './Edgedancer';
import { EstateDealer } from './EstateDealer';
import { Excentric } from './Excentric';
import { Forecaster } from './Forecaster';
import { IAward } from './IAward';
import { Industrialist } from './Industrialist';
import { Landlord } from './Landlord';
import { Magnate } from './Magnate';
import { Miner } from './Miner';
import { Administrator } from './modular/Administrator';
import { Collector } from './modular/Collector';
import { Constructor } from './modular/Constructor';
import { Electrician } from './modular/Electrician';
import { Founder } from './modular/Founder';
import { Highlander } from './modular/Highlander';
import { Incorporator } from './modular/Incorporator';
import { Investor } from './modular/Investor';
import { Manufacturer } from './modular/Manufacturer';
import { Metropolist } from './modular/Metropolist';
import { Mogul } from './modular/Mogul';
import { Suburbian } from './modular/Suburbian';
import { Traveller } from './modular/Traveller';
import { Naturalist } from './Naturalist';
import { Scientist } from './Scientist';
import { SpaceBaron } from './SpaceBaron';
import { Biologist } from './terraCimmeria/Biologist';
import { Urbanist } from './terraCimmeria/Urbanist';
import { Warmonger } from './terraCimmeria/Warmonger';
import { Thermalist } from './Thermalist';
import { Visionary } from './Visionary';
import { Voyager } from './Voyager';

export const awardManifest: MAManifest<AwardName, IAward> = {
  all: {
    'A. Manufacturer': { Factory: AManufacturer },
    'Administrator': { Factory: Administrator, random: 'modular' },
    'Banker': { Factory: Banker, random: 'both' },
    'Benefactor': { Factory: Benefactor, random: 'both' },
    'Biologist': { Factory: Biologist, random: 'both' },
    'Blacksmith': { Factory: Blacksmith },
    'Botanist': { Factory: Botanist, random: 'both' },
    'Celebrity': { Factory: Celebrity, random: 'both' },
    'Collector': { Factory: Collector, random: 'modular' },
    'Constructor': {
      Factory: Constructor,
      compatibility: 'colonies',
      random: 'modular',
    },
    'Contractor': { Factory: Contractor, random: 'both' },
    'Cosmic Settler': { Factory: CosmicSettler },
    'Cultivator': { Factory: Cultivator, random: 'both' },
    'Desert Settler': { Factory: DesertSettler },
    'Edgedancer': { Factory: Edgedancer },
    'Electrician': { Factory: Electrician, random: 'modular' },
    'Estate Dealer': { Factory: EstateDealer, random: 'both' },
    'Excentric': { Factory: Excentric, random: 'both' },
    'Forecaster': { Factory: Forecaster, random: 'both' },
    'Founder': { Factory: Founder, random: 'modular' },
    'Highlander': { Factory: Highlander, random: 'modular' },
    'Incorporator': { Factory: Incorporator, random: 'both' },
    'Industrialist': { Factory: Industrialist, random: 'both' },
    'Investor': { Factory: Investor, random: 'modular' },
    'Landlord': { Factory: Landlord, random: 'both' },
    'Magnate': { Factory: Magnate, random: 'both' },
    'Manufacturer': { Factory: Manufacturer, random: 'modular' },
    'Metropolist': { Factory: Metropolist, random: 'modular' },
    'Miner': { Factory: Miner, random: 'both' },
    'Mogul': { Factory: Mogul, random: 'modular' },
    'Naturalist': { Factory: Naturalist },
    'Promoter': { Factory: Promoter, random: 'both' },
    'Scientist': { Factory: Scientist, random: 'both' },
    'Space Baron': { Factory: SpaceBaron, random: 'both' },
    'Suburbian': { Factory: Suburbian, random: 'modular' },
    'Thermalist': { Factory: Thermalist, random: 'both' },
    'Traveller': { Factory: Traveller, random: 'modular' },
    'Urbanist': { Factory: Urbanist },
    'Visionary': { Factory: Visionary, random: 'both' },
    'Voyager': { Factory: Voyager },
    'Warmonger': { Factory: Warmonger },
    'Zoologist': { Factory: Zoologist },
  },
  boards: {
    [BoardName.THARSIS]: [
      'Landlord',
      'Scientist',
      'Banker',
      'Thermalist',
      'Miner',
    ],
    [BoardName.HELLAS]: [
      'Cultivator',
      'Magnate',
      'Space Baron',
      'Excentric',
      'Contractor',
    ],
    [BoardName.ELYSIUM]: [
      'Celebrity',
      'Industrialist',
      'Desert Settler',
      'Estate Dealer',
      'Benefactor',
    ],
    [BoardName.ARABIA_TERRA]: [
      'Cosmic Settler',
      'Botanist',
      'Promoter',
      'Zoologist',
      'A. Manufacturer',
    ],
    [BoardName.VASTITAS_BOREALIS]: [
      'Forecaster',
      'Edgedancer',
      'Visionary',
      'Naturalist',
      'Voyager',
    ],
    [BoardName.UTOPIA_PLANITIA]: [
      'Edgedancer',
      'Investor',
      'Botanist',
      'Incorporator',
      'Metropolist',
    ],
    [BoardName.VASTITAS_BOREALIS_NOVA]: [
      'Traveller',
      'Highlander',
      'Promoter',
      'Blacksmith',
    ],
    [BoardName.HOLLANDIA]: [],
  },
  create: (name: string): IAward | undefined => {
    try {
      return awardManifest.createOrThrow(name);
    } catch (e) {
      return undefined;
    }
  },
  createOrThrow(name: string): IAward {
    try {
      return new awardManifest.all[name as AwardName].Factory();
    } catch (e) {
      throw new Error(`Award ${name} not found.`);
    }
  },
} as const;
