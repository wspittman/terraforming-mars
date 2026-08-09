export const EXPANSIONS = [
  'corpera',
] as const;

export const GAME_MODULES = [
  'base',
  ...EXPANSIONS,
] as const;
export type GameModule = typeof GAME_MODULES[number];

export type Expansion = Exclude<GameModule, 'base'>;

export const MODULE_NAMES = {
  base: 'Base',
  corpera: 'Corporate Era',
} satisfies Record<GameModule, string>;

export const DEFAULT_EXPANSIONS = {
  corpera: true,
} satisfies Record<Expansion, boolean>;
