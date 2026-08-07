import { GameModule } from '../../common/cards/GameModule';
import { ColonyName } from '../../common/colonies/ColonyName';
import { Callisto } from './Callisto';
import { Ceres } from './Ceres';
import { Colony } from './Colony';
import { Deimos } from './Deimos';
import { Enceladus } from './Enceladus';
import { Europa } from './Europa';
import { Ganymede } from './Ganymede';
import { Io } from './Io';
import { Luna } from './Luna';
import { Miranda } from './Miranda';
import { Pluto } from './Pluto';
import { Titan } from './Titan';
import { Triton } from './Triton';

export interface IColonyFactory<T> {
  colonyName: ColonyName;
  Factory: new () => T;
}

export const BASE_COLONIES_TILES: Array<IColonyFactory<Colony>> = [
  { colonyName: ColonyName.CERES, Factory: Ceres },
  { colonyName: ColonyName.ENCELADUS, Factory: Enceladus },
  { colonyName: ColonyName.EUROPA, Factory: Europa },
  { colonyName: ColonyName.GANYMEDE, Factory: Ganymede },
  { colonyName: ColonyName.IO, Factory: Io },
  { colonyName: ColonyName.LUNA, Factory: Luna },
  { colonyName: ColonyName.MIRANDA, Factory: Miranda },
  { colonyName: ColonyName.TITAN, Factory: Titan },
  { colonyName: ColonyName.CALLISTO, Factory: Callisto },
  { colonyName: ColonyName.PLUTO, Factory: Pluto },
  { colonyName: ColonyName.TRITON, Factory: Triton },
];

export const COMMUNITY_COLONIES_TILES: Array<IColonyFactory<Colony>> = [
  { colonyName: ColonyName.DEIMOS, Factory: Deimos },
];

export const PATHFINDERS_COLONIES_TILES: Array<IColonyFactory<Colony>> = [];

export const ALL_COLONIES_TILES = [
  ...BASE_COLONIES_TILES,
  ...COMMUNITY_COLONIES_TILES,
  ...PATHFINDERS_COLONIES_TILES,
];

export function getColonyModule(name: ColonyName): GameModule {
  if (COMMUNITY_COLONIES_TILES.some((f) => f.colonyName === name)) {
    return 'community';
  }
  if (PATHFINDERS_COLONIES_TILES.some((f) => f.colonyName === name)) {
    return 'pathfinders';
  }
  return 'colonies';
}
