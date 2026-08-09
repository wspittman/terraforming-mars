import { BoardName } from '@/common/boards/BoardName';

export type Key = {
  position: [number, number];
  text: [string, string];
  line?: { from: [number, number]; to: [number, number] };
  secondRowX?: number;
};

export const LEGENDS: Record<BoardName, Array<Key>> = {
  [BoardName.THARSIS]: [],
};
