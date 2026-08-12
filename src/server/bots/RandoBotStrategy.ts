import {CardName} from '@/common/cards/CardName';
import {InputResponse} from '@/common/inputs/InputResponse';
import {Random} from '@/common/utils/Random';
import {IPlayer} from '@/server/IPlayer';
import {PlayerInput} from '@/server/PlayerInput';
import {ICard} from '@/server/cards/ICard';
import {ICorporationCard} from '@/server/cards/corporation/ICorporationCard';
import {SelectCard} from '@/server/inputs/SelectCard';
import {SelectInitialCards} from '@/server/inputs/SelectInitialCards';
import {SelectSpace} from '@/server/inputs/SelectSpace';
import type {BotStrategy, BotStrategyName} from './BotStrategy';
import {
  selectRandomElement,
  tryClaimMilestone,
  tryFundAward,
  tryConvertHeat,
  tryConvertPlants,
  tryStandardProject,
} from './BotUtils';

export class RandoBotStrategy implements BotStrategy {
  public readonly name: BotStrategyName = 'rando';

  public selectCorporation(cards: ReadonlyArray<ICorporationCard>, random: Random): ICorporationCard | undefined {
    return selectRandomElement(cards, random);
  }

  public selectCard(input: SelectCard<ICard>, random: Random): Array<CardName> {
    if (input.config.min === 0) {
      return [];
    }
    const card = selectRandomElement(input.cards.filter((_, index) => input.config.enabled?.[index] !== false), random);
    return card === undefined ? [] : [card.name];
  }

  public takeAction(player: IPlayer): boolean {
    return tryClaimMilestone(player) ||
      tryFundAward(player) ||
      tryConvertHeat(player) ||
      tryConvertPlants(player) ||
      tryStandardProject(player, 14);
  }

  public selectInput(input: PlayerInput, random: Random, _player?: IPlayer): InputResponse {
    if (input instanceof SelectInitialCards) {
      const corporation = this.selectCorporation(input.player.dealtCorporationCards, random);
      if (corporation === undefined) {
        throw new Error(`Bot ${input.player.id} has no corporation to select`);
      }
      return {
        type: 'initialCards',
        responses: [
          {type: 'card', cards: [corporation.name]},
          {type: 'card', cards: []},
        ],
      };
    }
    if (input instanceof SelectCard) {
      return {type: 'card', cards: this.selectCard(input, random)};
    }
    if (input instanceof SelectSpace) {
      const space = selectRandomElement(input.spaces, random);
      if (space === undefined) {
        throw new Error(`Bot strategy ${this.name} has no space to select`);
      }
      return {type: 'space', spaceId: space.id};
    }
    throw new Error(`Bot strategy ${this.name} cannot resolve ${input.type} input`);
  }
}
