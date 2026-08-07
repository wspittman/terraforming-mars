import { ModuleManifest } from '../ModuleManifest';

export const PATHFINDERS_CARD_MANIFEST = new ModuleManifest({
  module: 'pathfinders',
  projectCards: {},
  corporationCards: {},
  preludeCards: {},

  globalEvents: {},

  // Perhaps these community cards should just move to this manifest, but only if it becomes
  // generally easier to just add all the preludes that match what game someone's playing.
  cardsToRemove: [],
});
