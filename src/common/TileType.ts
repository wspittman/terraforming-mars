// There might be a temptation to rename or reorder these, but TileType is stored in the database
// as its number. Would have been better if this was stored as a string, but that ship has sailed,

import {CardName} from './cards/CardName';

// for now.
export enum TileType {
    GREENERY, // 0
    OCEAN, // 1
    CITY, // 2
    CAPITAL, // 3
    COMMERCIAL_DISTRICT, // 4
    ECOLOGICAL_ZONE, // 5
    INDUSTRIAL_CENTER, // 6
    LAVA_FLOWS, // 7
    MINING_AREA, // 8
    MINING_RIGHTS, // 9
    MOHOLE_AREA, // 10
    NATURAL_PRESERVE, // 11
    NUCLEAR_ZONE, // 12
    RESTRICTED_AREA, // 13

    DEIMOS_DOWN, // 14
    GREAT_DAM, // 15
    MAGNETIC_FIELD_GENERATORS, // 16

  }

export const tileTypeToString: Record<TileType, string> = {
  [TileType.GREENERY]: 'greenery',
  [TileType.OCEAN]: 'ocean',
  [TileType.CITY]: 'city',

  [TileType.CAPITAL]: CardName.CAPITAL,
  [TileType.COMMERCIAL_DISTRICT]: CardName.COMMERCIAL_DISTRICT,
  [TileType.ECOLOGICAL_ZONE]: CardName.ECOLOGICAL_ZONE,
  [TileType.INDUSTRIAL_CENTER]: 'Industrial Center',
  [TileType.LAVA_FLOWS]: CardName.LAVA_FLOWS,
  [TileType.MINING_AREA]: CardName.MINING_AREA,
  [TileType.MINING_RIGHTS]: CardName.MINING_RIGHTS,
  [TileType.MOHOLE_AREA]: CardName.MOHOLE_AREA,
  [TileType.NATURAL_PRESERVE]: CardName.NATURAL_PRESERVE,
  [TileType.NUCLEAR_ZONE]: CardName.NUCLEAR_ZONE,
  [TileType.RESTRICTED_AREA]: CardName.RESTRICTED_AREA,
  [TileType.DEIMOS_DOWN]: CardName.DEIMOS_DOWN,
  [TileType.GREAT_DAM]: CardName.GREAT_DAM,
  [TileType.MAGNETIC_FIELD_GENERATORS]: CardName.MAGNETIC_FIELD_GENERATORS,
} as const;

export const CITY_TILES = new Set([TileType.CITY, TileType.CAPITAL]);
export const OCEAN_TILES = new Set([TileType.OCEAN]);
export const GREENERY_TILES = new Set([TileType.GREENERY]);
