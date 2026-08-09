import {CardName} from '../cards/CardName';

/**
 * Standard resources that can be spent as M€
 */
export const SPENDABLE_STANDARD_RESOURCES = [
  // Standard currency for paying for stuff
  'megacredits',
  // Helion corporation can spend heat as M€.
  'heat',
  // Used for cards with building tags
  'steel',
  // Used for cards with space tags, and as the Luna Trade Federation
  'titanium',
  // Martian Lumber Corp lets players pay for building tags with plants.
  'plants',
] as const;

/**
 * Card resources that can be converted to M€
 */
export const SPENDABLE_CARD_RESOURCES = [
  // Psychrophiles corporation can spend its floaters for cards with plant tags.
  'microbes',
  // Dirigibles corporation can spend its floaters for cards with Venus tags.
  'floaters',
] as const;

export const SPENDABLE_RESOURCES = [...SPENDABLE_STANDARD_RESOURCES, ...SPENDABLE_CARD_RESOURCES] as const;

export type SpendableStandardResource = typeof SPENDABLE_STANDARD_RESOURCES[number];
/** Types of resources on cards that can be spent to pay for things. */
export type SpendableCardResource = typeof SPENDABLE_CARD_RESOURCES[number];

/** Types of resources spent to pay for things. */
export type SpendableResource = SpendableStandardResource | SpendableCardResource;

export const CARD_FOR_SPENDABLE_RESOURCE = {
  microbes: CardName.PSYCHROPHILES,
  floaters: CardName.DIRIGIBLES,
} satisfies Record<SpendableCardResource, CardName>;
