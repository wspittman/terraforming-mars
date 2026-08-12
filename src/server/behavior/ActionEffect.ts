import {MAX_OXYGEN_LEVEL, MAX_TEMPERATURE} from '@/common/constants';
import {IPlayer} from '@/server/IPlayer';
import {Behavior} from './Behavior';

const NON_EFFECT_KEYS = new Set(['spend', 'log', 'or', 'global', 'ocean', 'title']);

export function hasAvailableActionEffect(behavior: Behavior, player: IPlayer): boolean {
  if (behavior.or?.behaviors.some((choice) => hasAvailableActionEffect(choice, player))) {
    return true;
  }

  if (Object.keys(behavior).some((key) => !NON_EFFECT_KEYS.has(key))) {
    return true;
  }

  let hasGlobalParameterEffect = behavior.ocean !== undefined;
  if (behavior.ocean !== undefined && player.game.canAddOcean()) {
    return true;
  }

  const global = behavior.global;
  if (global !== undefined) {
    hasGlobalParameterEffect = true;
    if (global.temperature !== undefined && (global.temperature < 0 || player.game.getTemperature() < MAX_TEMPERATURE)) {
      return true;
    }
    if (global.oxygen !== undefined && (global.oxygen < 0 || player.game.getOxygenLevel() < MAX_OXYGEN_LEVEL)) {
      return true;
    }
  }

  return !hasGlobalParameterEffect;
}
