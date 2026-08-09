import {LogMessageDataType} from '../../common/logs/LogMessageDataType';
import {IPlayer} from '../IPlayer';
import {CardName} from '../../common/cards/CardName';
import {ICard} from '../cards/ICard';
import {IAward} from '../awards/IAward';
import {IMilestone} from '../milestones/IMilestone';
import {TileType} from '../../common/TileType';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {Message} from '../../common/logs/Message';
import {Color} from '../../common/Color';
import {LogMessageData, LogMessageDataAttrs} from '../../common/logs/LogMessageData';
import {Space} from '../boards/Space';
import {SpaceId} from '../../common/Types';
import {toName} from '../../common/utils/utils';

export class MessageBuilder {
  protected message: Message;

  constructor(message: string) {
    this.message = {
      data: [],
      message: message,
    };
  }

  public string(value: string): this {
    this.message.data.push({type: LogMessageDataType.STRING, value});
    return this;
  }

  public rawString(value: string): this {
    this.message.data.push({type: LogMessageDataType.RAW_STRING, value});
    return this;
  }

  public number(value: number): this {
    this.message.data.push({type: LogMessageDataType.RAW_STRING, value: value.toString()});
    return this;
  }

  public player(value: IPlayer): this {
    return this.playerColor(value.color);
  }

  public playerColor(value: Color): this {
    this.message.data.push({type: LogMessageDataType.PLAYER, value});
    return this;
  }

  public card(value: ICard, attrs?: LogMessageDataAttrs): this {
    return this.cardName(value.name, attrs);
  }

  public cards(value: ReadonlyArray<ICard>, attrs?: LogMessageDataAttrs): this {
    return this.cardNames(value.map(toName), attrs);
  }

  public cardNames(value: ReadonlyArray<CardName>, attrs?: LogMessageDataAttrs): this {
    const data: LogMessageData = {type: LogMessageDataType.CARDS, value};
    if (attrs !== undefined) {
      data.attrs = attrs;
    }
    this.message.data.push(data);
    return this;
  }

  public cardName(value: CardName, attrs?: LogMessageDataAttrs): this {
    const data: LogMessageData = {type: LogMessageDataType.CARD, value};
    if (attrs !== undefined) {
      data.attrs = attrs;
    }
    this.message.data.push(data);
    return this;
  }

  public award(value: IAward): this {
    this.message.data.push({type: LogMessageDataType.AWARD, value: value.name});
    return this;
  }

  public milestone(value: IMilestone): this {
    this.message.data.push({type: LogMessageDataType.MILESTONE, value: value.name});
    return this;
  }


  public tileType(value: TileType): this {
    this.message.data.push({type: LogMessageDataType.TILE_TYPE, value: value});
    return this;
  }

  public spaceBonus(value: SpaceBonus): this {
    this.message.data.push({type: LogMessageDataType.SPACE_BONUS, value: value});
    return this;
  }


  public space(value: Space): this {
    this.message.data.push({type: LogMessageDataType.SPACE, value: value.id});
    return this;
  }

  public spaceId(value: SpaceId): this {
    this.message.data.push({type: LogMessageDataType.SPACE, value: value});
    return this;
  }

  public getMessage(): Message {
    return this.message;
  }
}

export function message(message: string, f?: (builder: MessageBuilder) => void): Message {
  const builder = new MessageBuilder(message);
  f?.(builder);
  return builder.getMessage();
}
