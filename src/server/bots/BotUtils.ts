import {Payment} from '@/common/inputs/Payment';
import {Random} from '@/common/utils/Random';
import {IPlayer} from '@/server/IPlayer';
import {ConvertHeat} from '@/server/cards/base/standardActions/ConvertHeat';
import {ConvertPlants} from '@/server/cards/base/standardActions/ConvertPlants';
import {ICorporationCard} from '@/server/cards/corporation/ICorporationCard';

export const ROBOT_NAMES = ['Bolt', 'Gizmo', 'Pixel', 'Rivet', 'Servo'] as const;

export function selectRobotNames(count: number, random: Random): Array<string> {
  const available = [...ROBOT_NAMES];
  const selected: Array<string> = [];
  while (selected.length < count && available.length > 0) {
    selected.push(available.splice(random.nextInt(available.length), 1)[0]);
  }
  return selected;
}

export function selectWealthiestCorporation(cards: ReadonlyArray<ICorporationCard>): ICorporationCard | undefined {
  return cards.reduce<ICorporationCard | undefined>((wealthiest, card) =>
    wealthiest === undefined || card.startingMegaCredits > wealthiest.startingMegaCredits ? card : wealthiest, undefined);
}

export function selectRandomElement<T>(items: ReadonlyArray<T>, random: Random): T | undefined {
  return items.length === 0 ? undefined : items[random.nextInt(items.length)];
}

export function tryConvertHeat(player: IPlayer): boolean {
  const convertHeat = new ConvertHeat();
  if (!convertHeat.canAct(player)) {
    return false;
  }
  player.defer(convertHeat.action(player));
  return true;
}

export function tryConvertPlants(player: IPlayer): boolean {
  const convertPlants = new ConvertPlants();
  if (!convertPlants.canAct(player)) {
    return false;
  }
  player.defer(convertPlants.action(player));
  return true;
}

export function tryStandardProject(player: IPlayer, minimumMegaCredits: number): boolean {
  if (player.megaCredits < minimumMegaCredits) {
    return false;
  }
  const project = selectRandomElement(
    player.game.getStandardProjects().filter((project) => project.canAct(player)),
    player.game.rng,
  );
  if (project === undefined) {
    return false;
  }
  project.payAndExecute(player, Payment.of({megacredits: project.getAdjustedCost(player)}));
  return true;
}
