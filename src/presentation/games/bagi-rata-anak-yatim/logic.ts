import { Difficulty } from '../../../domain/enums';
import { randInt } from '../../../core/utils/random';

export interface ShareRound {
  kids: number;
  per: number;
  total: number;
}

export function makeShareRound(difficulty: Difficulty): ShareRound {
  const [kMin, kMax, pMin, pMax] =
    difficulty === Difficulty.Easy ? [2, 3, 1, 3] : difficulty === Difficulty.Medium ? [2, 4, 2, 4] : [3, 4, 3, 5];
  const kids = randInt(kMin, kMax);
  const per = randInt(pMin, pMax);
  return { kids, per, total: kids * per };
}

/** True when every plate has the same count and nothing is left in the pile. */
export function isFairShare(plates: number[], pileLeft: number): boolean {
  return pileLeft === 0 && plates.every((c) => c === plates[0]);
}

