export const TR_SOURCES = [
  'oxygen',
  'temperature',
  'oceans',
  'tr',
] as const;

// TRSource represents the ways an action will gain TR.
export type TRSource = Partial<{
  oxygen: number,
  temperature: number,
  oceans: number,
  tr: number,
}>
