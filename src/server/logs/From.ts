import {CardName} from '../../common/cards/CardName';
import {ICard} from '../cards/ICard';
import {IPlayer} from '../IPlayer';

/**
 * The source of something gained or taken. Used when logging.
 */
export type From =
  | {player: IPlayer}
  | {card: ICard}
  | {card: CardName}

export function isFromPlayer(from: From | undefined): from is {player: IPlayer} {
  return from !== undefined && 'player' in from;
}
