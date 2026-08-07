import { BoardName } from '@/common/boards/BoardName';

export type Key = {
  position: [number, number];
  text: [string, string];
  line?: { from: [number, number]; to: [number, number] };
  secondRowX?: number;
};

export const LEGENDS = {
  [BoardName.THARSIS]: [],
  [BoardName.HELLAS]: [],
  [BoardName.ELYSIUM]: [],
  [BoardName.ARABIA_TERRA]: [],
  [BoardName.UTOPIA_PLANITIA]: [],
  [BoardName.VASTITAS_BOREALIS_NOVA]: [],
  [BoardName.VASTITAS_BOREALIS]: [],
  [BoardName.HOLLANDIA]: [],
} satisfies Record<BoardName, Array<Key>>;
