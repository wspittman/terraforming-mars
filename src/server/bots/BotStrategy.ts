import {Payment} from '@/common/inputs/Payment';
import {InputResponse} from '@/common/inputs/InputResponse';
import {CardName} from '@/common/cards/CardName';
import {Random} from '@/common/utils/Random';
import {IPlayer} from '@/server/IPlayer';
import {PlayerInput} from '@/server/PlayerInput';
import {ConvertHeat} from '@/server/cards/base/standardActions/ConvertHeat';
import {ConvertPlants} from '@/server/cards/base/standardActions/ConvertPlants';
import {ICorporationCard} from '@/server/cards/corporation/ICorporationCard';
import {ICard} from '@/server/cards/ICard';
import {SelectCard} from '@/server/inputs/SelectCard';
import {SelectInitialCards} from '@/server/inputs/SelectInitialCards';
import {SelectSpace} from '@/server/inputs/SelectSpace';

export const BOT_STRATEGY_NAMES = ['simple'] as const;
export type BotStrategyName = typeof BOT_STRATEGY_NAMES[number];

export interface BotStrategy {
  readonly name: BotStrategyName;
  selectCorporation(cards: ReadonlyArray<ICorporationCard>): ICorporationCard | undefined;
  selectCard(input: SelectCard<ICard>): Array<CardName>;
  takeAction(player: IPlayer): boolean;
  selectInput(input: PlayerInput, random: Random): InputResponse;
}

export class SimpleBotStrategy implements BotStrategy {
  public readonly name = 'simple';

  public selectCorporation(cards: ReadonlyArray<ICorporationCard>): ICorporationCard | undefined {
    return cards.reduce<ICorporationCard | undefined>((best, card) =>
      best === undefined || card.startingMegaCredits > best.startingMegaCredits ? card : best, undefined);
  }

  public selectCard(input: SelectCard<ICard>): Array<CardName> {
    if (input.config.min === 0) {
      return [];
    }
    const card = input.cards.find((_, index) => input.config.enabled?.[index] !== false);
    return card === undefined ? [] : [card.name];
  }

  public takeAction(player: IPlayer): boolean {
    const convertHeat = new ConvertHeat();
    if (convertHeat.canAct(player)) {
      player.defer(convertHeat.action(player));
      return true;
    }

    const convertPlants = new ConvertPlants();
    if (convertPlants.canAct(player)) {
      player.defer(convertPlants.action(player));
      return true;
    }

    if (player.megaCredits >= 15) {
      const projects = player.game.getStandardProjects().filter((project) => project.canAct(player));
      if (projects.length > 0) {
        const project = projects[player.game.rng.nextInt(projects.length)];
        project.payAndExecute(player, Payment.of({megacredits: project.getAdjustedCost(player)}));
        return true;
      }
    }
    return false;
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
      return {type: 'space', spaceId: input.spaces[random.nextInt(input.spaces.length)].id};
    }
    throw new Error(`Bot strategy ${this.name} cannot resolve ${input.type} input`);
  }
}

const STRATEGIES: Readonly<Record<BotStrategyName, BotStrategy>> = {
  simple: new SimpleBotStrategy(),
};

export function assignBotStrategy(random: Random): BotStrategyName {
  return BOT_STRATEGY_NAMES[random.nextInt(BOT_STRATEGY_NAMES.length)];
}

export function getBotStrategy(name: BotStrategyName | undefined): BotStrategy {
  return STRATEGIES[name ?? 'simple'];
}
