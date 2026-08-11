export const milestoneNames = [
  'Terraformer',
  'Mayor',
  'Gardener',
  'Planner',
  'Builder',
] as const;

export type MilestoneName = (typeof milestoneNames)[number];
