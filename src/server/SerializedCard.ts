import {Tag} from '../common/cards/Tag';
import {CardName} from '../common/cards/CardName';
import {Resource} from '../common/Resource';
import {OneOrArray} from '../common/utils/types';
import {JSONValue} from '../common/Types';

export type SerializedCard = {
  allTags?: Array<Tag>; // For Aridor
  bonusResource?: OneOrArray<Resource>; // For Robotic Workforce / Mining Area / Mining Rights / Specialized Settlement
  data?: JSONValue;
  generationUsed?: number; // For CEO and Underworld Cards.
  isDisabled?: boolean; // For Pharmacy Union and CEO Cards.
  name: CardName;
  resourceCount?: number;
  targetCards?: Array<SerializedRobotCard>;
}

export type SerializedRobotCard = {
  card: SerializedCard;
  resourceCount: number;
}
