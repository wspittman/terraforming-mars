import {SpaceType} from '../../common/boards/SpaceType';
import {CanAffordOptions, IPlayer} from '../IPlayer';
import {Board} from './Board';
import {Space} from './Space';
import {PlacementType} from './PlacementType';
import {SpaceId} from '../../common/Types';
import {Tile} from '../Tile';
import {SpaceBonus} from '../../common/boards/SpaceBonus';

export class MarsBoard extends Board {
  private readonly edges: ReadonlyArray<Space>;

  public constructor(
    spaces: ReadonlyArray<Space>,
    noctisCitySpaceId?: SpaceId | undefined) {
    super(spaces, noctisCitySpaceId);
    this.edges = this.computeEdges();
  }

  public getCitiesOffMars(player?: IPlayer): Array<Space> {
    return this.getCities(player).filter((space) => space.spaceType === SpaceType.COLONY);
  }

  public getCitiesOnMars(player?: IPlayer): Array<Space> {
    return this.getCities(player).filter((space) => space.spaceType !== SpaceType.COLONY);
  }

  public getCities(player?: IPlayer): Array<Space> {
    let cities = this.spaces.filter(Board.isCitySpace);
    if (player !== undefined) {
      cities = cities.filter(Board.ownedBy(player));
    }
    return cities;
  }

  public getGreeneries(player?: IPlayer): Array<Space> {
    let greeneries = this.spaces.filter((space) => Board.isGreenerySpace(space));
    if (player !== undefined) {
      greeneries = greeneries.filter(Board.ownedBy(player));
    }
    return greeneries;
  }

  public getAvailableSpacesForType(player: IPlayer, type: PlacementType, canAffordOptions?: CanAffordOptions | undefined): ReadonlyArray<Space> {
    switch (type) {
    case 'land': return this.getAvailableSpacesOnLand(player, canAffordOptions);
    case 'ocean': return this.getAvailableSpacesForOcean(player);
    case 'greenery': return this.getAvailableSpacesForGreenery(player, canAffordOptions);
    case 'city': return this.getAvailableSpacesForCity(player, canAffordOptions);
    case 'away-from-cities': return this.getSpacesAwayFromCities(player, canAffordOptions);
    case 'isolated': return this.getAvailableIsolatedSpaces(player, canAffordOptions);
    case 'volcanic': return this.getAvailableVolcanicSpaces(player, canAffordOptions);
    case 'upgradeable-ocean': return this.getOceanSpaces({upgradedOceans: false});
    case 'upgradeable-ocean-new-holland': {
      const oceanSpaces = this.getOceanSpaces({upgradedOceans: false});
      const filtered = this.getAvailableSpacesForCity(player, undefined, oceanSpaces);
      return filtered;
    }
    default: throw new Error('unknown type ' + type);
    }
  }

  /*
   * Returns spaces on the board with ocean tiles.
   *
   * The default condition is to return those oceans used to count toward the global parameter, so
   * upgraded oceans are included, but Wetlands is not. That's why the boolean values have different defaults.
   */
  public getOceanSpaces(_include?: {upgradedOceans?: boolean, wetlands?: boolean}): ReadonlyArray<Space> {
    return this.spaces.filter(Board.isOceanSpace);
  }

  public getAvailableSpacesForCity(player: IPlayer, canAffordOptions?: CanAffordOptions, spaces?: ReadonlyArray<Space>): ReadonlyArray<Space> {
    const spacesOnLand = spaces ?? this.getAvailableSpacesOnLand(player, canAffordOptions);
    // A city cannot be adjacent to another city
    return spacesOnLand.filter(
      (space) => this.getAdjacentSpaces(space).some((adjacentSpace) => Board.isCitySpace(adjacentSpace)) === false,
    );
  }

  public hasAvailableCitySpaceWithBonus(player: IPlayer, bonus: SpaceBonus): boolean {
    return this.getAvailableSpacesForCity(player).some((s) => s.bonus.includes(bonus));
  }

  /**
   * Returns true when the player can cover -1 energy production cost via
   * an available city space that carries an ENERGY_PRODUCTION bonus.
   */
  public static hasEnergyCoverage(player: IPlayer, spaces: ReadonlyArray<Space>): boolean {
    return player.production.energy >= 1 ||
      spaces.some((s) => s.bonus.includes(SpaceBonus.ENERGY_PRODUCTION));
  }

  /**
   * When a player has 0 energy production (relying on a placement bonus to cover
   * the -1 cost), constrain city placement to only energy-production spaces.
   * Otherwise returns the full set unchanged.
   */
  public static filterForEnergy(player: IPlayer, spaces: ReadonlyArray<Space>): ReadonlyArray<Space> {
    if (player.production.energy > 0) {
      return spaces;
    }
    return spaces.filter((s) => s.bonus.includes(SpaceBonus.ENERGY_PRODUCTION));
  }

  public getSpacesAwayFromCities(player: IPlayer, canAffordOptions?: CanAffordOptions): ReadonlyArray<Space> {
    const spacesOnLand = this.getAvailableSpacesOnLand(player, canAffordOptions);

    return spacesOnLand.filter(
      (space) => this.getAdjacentSpaces(space).some((adjacentSpace) => Board.isCitySpace(adjacentSpace)) === false,
    );
  }

  public filterSpacesAroundRedCity(spaces: ReadonlyArray<Space>): ReadonlyArray<Space> {
    return spaces;
  }

  public getAvailableSpacesForGreenery(player: IPlayer, canAffordOptions?: CanAffordOptions): ReadonlyArray<Space> {
    const availableLandSpaces = this.getAvailableSpacesOnLand(player, canAffordOptions);

    // player can place a greenery in an available land space that is next
    // to a tile the player already owns.
    const spacesForGreenery = availableLandSpaces.filter((space) => {
      return this.getAdjacentSpaces(space).some((adj) => {
        return MarsBoard.hasRealTile(adj) && adj.player === player;
      });
    });

    // Spaces next to tiles you own
    if (spacesForGreenery.length > 0) {
      return spacesForGreenery;
    }
    // Place anywhere if no space owned
    return availableLandSpaces;
  }

  public getAvailableSpacesForOcean(player: IPlayer): ReadonlyArray<Space> {
    return this.getSpaces(SpaceType.OCEAN)
      .filter((space) => space.tile === undefined && (space.player === undefined || space.player === player));
  }

  private computeEdges(): ReadonlyArray<Space> {
    return this.spaces.filter((space) => {
      if (space.y === 0 || space.y === 8 || space.x === 8) {
        return true;
      }
      // left side is tricky.
      // top-left is easy with math. Look at the map.
      if (space.y + space.x === 4) {
        return true;
      }
      // bottom-left is also easy with math. Look at the map.
      if (space.y - space.x === 4) {
        return true;
      }
      return false;
    });
  }

  public getEdges(): ReadonlyArray<Space> {
    return this.edges;
  }

  public getAvailableIsolatedSpaces(player: IPlayer, canAffordOptions?: CanAffordOptions): ReadonlyArray<Space> {
    return this.getAvailableSpacesOnLand(player, canAffordOptions)
      .filter((space: Space) => this.getAdjacentSpaces(space).every((space) => space.tile === undefined));
  }

  public getAvailableVolcanicSpaces(player: IPlayer, canAffordOptions?: CanAffordOptions): ReadonlyArray<Space> {
    const spaces = this.getAvailableSpacesOnLand(player, canAffordOptions);
    if (this.volcanicSpaceIds.length > 0) {
      return spaces.filter((space) => space.volcanic === true);
    }
    return spaces;
  }

  /**
   * Almost the same as getAvailableSpacesOnLand, but doesn't apply to any player.
   */
  public getNonReservedLandSpaces(): ReadonlyArray<Space> {
    return this.spaces.filter((space) => {
      if (space.id === this.noctisCitySpaceId) {
        return false;
      }
      return space.spaceType === SpaceType.LAND &&
        space.tile === undefined &&
        space.player === undefined;
    });
  }

  // Returns true if |newTile| can cover go on |space|, particularly if |space| already has a tile.
  public static canCover(space: Space, _newTile: Tile): boolean {
    if (space.tile === undefined) {
      return true;
    }

    return false;
  }
}
