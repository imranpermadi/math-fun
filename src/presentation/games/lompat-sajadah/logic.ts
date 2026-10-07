import { Grade } from '../../../domain/enums';
import { pickOne, randInt } from '../../../core/utils/random';

export interface SkipRound {
  start: number;
  step: number;
  seq: number[]; // 6 numbers; last one is the hidden answer
  answer: number;
}

export function makeSkipRound(grade: Grade): SkipRound {
  const steps = grade === Grade.One ? [2, 5, 10] : grade === Grade.Two ? [2, 3, 4, 5, 10] : [3, 4, 6, 7, 8, 9];
  const step = pickOne(steps);
  const start = grade === Grade.One ? step * randInt(0, 2) : step * randInt(0, 5) + (grade === Grade.Three ? randInt(0, 5) : 0);
  const seq = Array.from({ length: 6 }, (_, i) => start + step * i);
  return { start, step, seq, answer: seq[5] };
}

