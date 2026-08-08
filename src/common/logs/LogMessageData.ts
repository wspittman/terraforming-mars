import {Color} from '../Color';
import {TileType} from '../TileType';
import {SpaceId} from '../Types';
import {SpaceBonus} from '../boards/SpaceBonus';
import {CardName} from '../cards/CardName';
import {AwardName} from '../ma/AwardName';
import {MilestoneName} from '../ma/MilestoneName';
import {LogMessageDataType} from './LogMessageDataType';

export type LogMessageDataAttrs = {
  /** When true for a card, also show the card's tags */
  tags?: boolean,
  /** When true for a card, also show the card's cost */
  cost?: boolean,
  /** When true, don't show the whole list of cards. Show a clickable toolip. */
  ellipsis?: boolean,
}

type Types = {
  type: LogMessageDataType.STRING | LogMessageDataType.RAW_STRING,
  value: string,
} | {
  type: LogMessageDataType.PLAYER,
  value: Color,
} | {
  type: LogMessageDataType.CARD,
  value: CardName,
} | {
  type: LogMessageDataType.AWARD,
  value: AwardName,
} | {
  type: LogMessageDataType.MILESTONE,
  value: MilestoneName,
} | {
  type: LogMessageDataType.TILE_TYPE,
  value: TileType,
} | {
  type: LogMessageDataType.SPACE_BONUS,
  value: SpaceBonus,
} | {
  type: LogMessageDataType.SPACE;
  value: SpaceId,
} | {
  type: LogMessageDataType.CARDS;
  value: ReadonlyArray<CardName>;
};

export type LogMessageData = Types & {
  attrs?: LogMessageDataAttrs;
}
