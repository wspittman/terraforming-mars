import { ColonyName } from '../../common/colonies/ColonyName';
import { ICard } from '../cards/ICard';
import { IGame } from '../IGame';
import { IPlayer } from '../IPlayer';
import { IColony } from './IColony';

export class ColoniesHandler {
  public static getColony(
    game: IGame,
    colonyName: ColonyName,
    includeDiscardedColonies: boolean = false,
  ): IColony {
    let colony: IColony | undefined = game.colonies.find(
      (c) => c.name === colonyName,
    );
    if (colony !== undefined) {
      return colony;
    }
    if (includeDiscardedColonies === true) {
      colony = game.discardedColonies.find((c) => c.name === colonyName);
      if (colony !== undefined) {
        return colony;
      }
    }
    throw new Error(`Unknown colony '${colonyName}'`);
  }

  public static tradeableColonies(_game: IGame) {
    return [];
  }

  public static maybeActivateColonies(_game: IGame, _card: ICard) {}

  /*
   * Return true if the colony is active, or will be activated by this card.
   *
   * Returns `true` if the colony is already active, or becomes active from this
   * call.
   */
  public static cardActivatesColony(_colony: IColony, _card: ICard): boolean {
    return false;
  }

  /**
   * Add a discarded colony tile back into the game, e.g. with Aridor.
   */
  public static addColonyTile(
    _player: IPlayer,
    _options?: {
      title?: string;
      colonies?: Array<IColony>;
      activateableOnly?: boolean;
      cb?: (colony: IColony) => void;
    },
  ): void {}
}
