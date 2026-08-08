export const awardNames = [
  // Tharsis
  'Landlord',
  'Scientist',
  'Banker',
  'Thermalist',
  'Miner',

  // Elysium
  'Celebrity',
  'Industrialist',
  'Desert Settler',
  'Estate Dealer',
  'Benefactor',

  // Hellas
  'Contractor',
  'Cultivator',
  'Excentric',
  'Magnate',
  'Space Baron',

  // Venus
  'Venuphile',

  // Ares
  'Entrepreneur',

  // The Moon

  // Arabia Terra
  'Cosmic Settler',
  'Botanist',
  'Promoter',
  'A. Manufacturer',
  'Zoologist',

  // Terra Cimmeria
  'Biologist',
  'T. Politician',
  'Urbanist',
  'Warmonger',
  // NB: the fifth award for Terra Cimmeria is Incorporator, a modular award.

  // Vastitas Borealis
  'Forecaster',
  'Edgedancer',
  'Visionary',
  'Naturalist',
  'Voyager',

  // Vastitas Borealis Nova
  'Traveller', // And modular
  'Highlander',
  'Manufacturer',
  'Blacksmith',

  // Underworld
  'Kingpin',
  'Excavator',

  // Ares Extreme
  'Rugged',

  // Modular
  'Administrator',
  'Collector',
  'Constructor',
  'Electrician',
  'Founder',
  'Incorporator',
  'Investor',
  'Metropolist',
  'Mogul',
  'Politician',
  'Suburbian', // Matches Edgedancer.
  // 'Zoologist', // Most animal and microbe resources. Currently Zoologist2
] as const;

export type AwardName = (typeof awardNames)[number];

export const AWARD_RENAMES = new Map<string, AwardName>([
  // When renaming an award add the old name here (like the example below), and add a TODO (like the example below)
  // And remember to add a test in spec.ts.
  // TODO(yournamehere): remove after 2026-04-05
  // ['EdgeLord', 'Excavator'],
]);

export function maybeRenamedAward(name: string): AwardName {
  const renamed = AWARD_RENAMES.get(name);
  return renamed ?? (name as AwardName);
}
