import { HazardSeverity } from '../../common/AresTileType';
import { TileType } from '../../common/TileType';
import { AresData } from '../../common/ares/AresData';
import { SpaceBonus } from '../../common/boards/SpaceBonus';
import { IGame } from '../IGame';
import { IPlayer } from '../IPlayer';
import { Board } from '../boards/Board';
import { Space } from '../boards/Space';
import { AdjacencyCost } from './AdjacencyCost';

export class AresHandler {
  private constructor() {}

  public static ifAres(_game: IGame, _cb: (aresData: AresData) => void) {}

  public static earnAdjacencyBonuses(
    _player: IPlayer,
    _space: Space,
    _options?: { giveAresTileOwnerBonus?: boolean },
  ) {}

  public static maybeIncrementMilestones(
    _aresData: AresData,
    _player: IPlayer,
    _space: Space,
    _hazardSeverity: HazardSeverity,
  ) {}

  public static incrementPurifier(_aresData: AresData, _player: IPlayer) {}

  public static hasHazardTile(_space: Space): boolean {
    return false;
  }

  public static assertCanPay(
    _player: IPlayer,
    _space: Space,
    _subjectToHazardAdjacency: boolean,
  ): AdjacencyCost {
    return { megacredits: 0, production: 0, tr: 0 };
  }

  public static payAdjacencyAndHazardCosts(
    _player: IPlayer,
    _space: Space,
    _subjectToHazardAdjacency: boolean,
  ) {}

  public static onTemperatureChange(_game: IGame, _aresData: AresData) {}

  public static onOceanPlaced(_aresData: AresData, _player: IPlayer) {}

  public static onOxygenChange(_game: IGame, _aresData: AresData) {}

  public static grantBonusForRemovingHazard(
    _player: IPlayer,
    _initialTileType: TileType,
  ) {}

  public static anyAdjacentSpaceGivesBonus(
    _board: Board,
    _space: Space,
    _bonus: SpaceBonus,
  ): boolean {
    return false;
  }
}
