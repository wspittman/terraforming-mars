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
import type {BotStrategy} from './BotStrategy';
import {
  selectRandomElement,
  selectWealthiestCorporation,
  tryConvertHeat,
  tryConvertPlants,
  tryStandardProject,
} from './BotUtils';

export class RandoBotStrategy implements BotStrategy {
  public readonly name = 'rando';

  public selectCorporation(cards: ReadonlyArray<ICorporationCard>): ICorporationCard | undefined {
    return selectWealthiestCorporation(cards);
  }

  public selectCard(input: SelectCard<ICard>): Array<CardName> {
    if (input.config.min === 0) {
      return [];
    }
    const card = input.cards.find((_, index) => input.config.enabled?.[index] !== false);
    return card === undefined ? [] : [card.name];
  }

  public takeAction(player: IPlayer): boolean {
    return tryConvertHeat(player) ||
      tryConvertPlants(player) ||
      tryStandardProject(player, 15);
  }

  public selectInput(input: PlayerInput, random: Random): InputResponse {
    if (input instanceof SelectInitialCards) {
      const corporation = this.selectCorporation(input.player.dealtCorporationCards);
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
      return {type: 'card', cards: this.selectCard(input)};
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
