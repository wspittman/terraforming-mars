export const awardNames = [
  'Landlord',
  'Scientist',
  'Banker',
  'Thermalist',
  'Miner',
] as const;

export type AwardName = (typeof awardNames)[number];

export function maybeRenamedAward(name: string): AwardName {
  return name as AwardName;
}
