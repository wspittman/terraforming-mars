import { AndOptions } from '../inputs/AndOptions';
import { CanAffordOptions, IPlayer } from '../IPlayer';

export class Colonies {
  /** The number of consumed trade fleets. When this == `fleetSize` the player has no trade fleets. */
  public usedTradeFleets: number = 0;
  // When trading you may increase the Colony track this many steps.
  public tradeOffset: number = 0;

  // When trading you many use this many fewer resources of the trading type.
  public tradeDiscount: number = 0;

  public victoryPoints: number = 0; // Titania Colony VP
  public cardDiscount: number = 0; // Iapetus Colony

  constructor(_player: IPlayer) {}

  /**
   * Returns `true` if this player can execute a trade.
   */
  public canTrade() {
    return false;
  }

  public coloniesTradeAction(): AndOptions | undefined {
    return undefined;
  }
  public getPlayableColonies(
    _allowDuplicate: boolean = false,
    _canAffordOptions: number | CanAffordOptions = 0,
  ) {
    return [];
  }

  public getVictoryPoints(): number {
    return 0;
  }

  public getFleetSize(): number {
    return 0;
  }

  public increaseFleetSize(): void {}

  public decreaseFleetSize(): void {}

  public setFleetSize(_fleetSize: number) {}

  public returnTradeFleets(): void {}
}
