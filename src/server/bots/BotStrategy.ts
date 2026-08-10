import {CardName} from '@/common/cards/CardName';
import {InputResponse} from '@/common/inputs/InputResponse';
import {Random} from '@/common/utils/Random';
import {IPlayer} from '@/server/IPlayer';
import {PlayerInput} from '@/server/PlayerInput';
import {ICard} from '@/server/cards/ICard';
import {ICorporationCard} from '@/server/cards/corporation/ICorporationCard';
import {SelectCard} from '@/server/inputs/SelectCard';
import {RandoBotStrategy} from './RandoBotStrategy';

export const BOT_STRATEGY_NAMES = ['rando'] as const;
export type BotStrategyName = typeof BOT_STRATEGY_NAMES[number];

export interface BotStrategy {
  readonly name: BotStrategyName;
  selectCorporation(cards: ReadonlyArray<ICorporationCard>): ICorporationCard | undefined;
  selectCard(input: SelectCard<ICard>): Array<CardName>;
  takeAction(player: IPlayer): boolean;
  selectInput(input: PlayerInput, random: Random): InputResponse;
}

const STRATEGIES: Readonly<Record<BotStrategyName, BotStrategy>> = {
  rando: new RandoBotStrategy(),
};

export function assignBotStrategy(random: Random): BotStrategyName {
  return BOT_STRATEGY_NAMES[random.nextInt(BOT_STRATEGY_NAMES.length)];
}

export function getBotStrategy(name: BotStrategyName | undefined): BotStrategy {
  return STRATEGIES[name ?? 'rando'];
}
