import { Difficulty } from '../../../domain/enums';
import { pickOne, randInt } from '../../../core/utils/random';

export const WEIGHTS = [1, 2, 5] as const;

export interface ScaleRound {
  item: { emoji: string; name: string };
  target: number; // kg
}

const ITEMS = [
  { emoji: '🍚', name: 'beras zakat fitrah' },
  { emoji: '🌾', name: 'gandum' },
  { emoji: '🥔', name: 'kentang' },
  { emoji: '🍬', name: 'kurma sedekah' },
];

export function makeScaleRound(difficulty: Difficulty): ScaleRound {
  const target = difficulty === Difficulty.Easy ? randInt(2, 7) : difficulty === Difficulty.Medium ? randInt(5, 12) : randInt(9, 18);
  return { item: pickOne(ITEMS), target };
}

/** Beam angle in degrees (positive = right pan heavier, beam tilts down on the right). */
export function beamAngle(leftKg: number, rightKg: number): number {
  const diff = rightKg - leftKg;
  return Math.max(-18, Math.min(18, diff * 4));
}

