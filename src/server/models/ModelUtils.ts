import {CardModel} from '../../common/models/CardModel';
import {ICard} from '../cards/ICard';
import {isIProjectCard} from '../cards/IProjectCard';
import {IPlayer} from '../IPlayer';
import {PlayCardMetadata} from '../inputs/SelectCardToPlay';
import {CardName} from '../../common/cards/CardName';
import {asArray} from '../../common/utils/utils';
import {isIStandardProjectCard} from '../cards/IStandardProjectCard';

export function cardsToModel(
  player: IPlayer,
  cards: ReadonlyArray<ICard>,
  options: {
    showResources?: boolean,
    showCalculatedCost?: boolean,
    extras?: Map<CardName, PlayCardMetadata>,
    enabled?: ReadonlyArray<boolean>, // If provided, then the cards with false in `enabled` are not selectable and grayed out
  } = {},
): ReadonlyArray<CardModel> {
  return cards.map((card, index) => {
    const discount = card.cardDiscount === undefined ? undefined : asArray(card.cardDiscount);


    let calculatedCost = card.cost;
    if (options.showCalculatedCost) {
      if (isIStandardProjectCard(card)) {
        calculatedCost = options.extras?.get(card.name)?.overriddenCost ?? card.getAdjustedCost(player);
      } else if (isIProjectCard(card) && card.cost !== undefined) {
        calculatedCost = player.getCardCost(card);
      }
    }

    const model: CardModel = {
      resources: options.showResources ? card.resourceCount : undefined,
      name: card.name,
      calculatedCost,
      bonusResource: isIProjectCard(card) ? card.bonusResource : undefined,
      discount: discount,
    };
    if (isIStandardProjectCard(card)) {
      model.standardProjectCanPayWith = card.canPayWith(player);
    }
    if (card.isDisabled) {
      model.isDisabled = true;
    } else if (options.enabled?.[index] === false) {
      model.isDisabled = true;
    }
    const playCardMetadata = options?.extras?.get(card.name);

    if (isIProjectCard(card) && card.additionalProjectCosts) {
      model.additionalProjectCosts = card.additionalProjectCosts;
    }

    const reserveUnits = playCardMetadata?.reserveUnits;
    if (reserveUnits !== undefined) {
      model.reserveUnits = reserveUnits;
    }
    const isSelfReplicatingRobotsCard = isIProjectCard(card) && player.getSelfReplicatingRobotsTargetCards().includes(card);
    if (isSelfReplicatingRobotsCard) {
      model.resources = card.resourceCount;
      model.isSelfReplicatingRobotsCard = true;
    }
    if (card.warnings.size > 0) {
      model.warnings = Array.from(card.warnings);
    }
    return model;
  });
}

/**
 * No need for both isActive and showTitleOnly.
 */
