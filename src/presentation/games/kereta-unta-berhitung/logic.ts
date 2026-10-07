import { Difficulty, Grade } from '../../../domain/enums';
import { randInt, shuffle } from '../../../core/utils/random';

export interface TrainRound {
  numbers: number[]; // shuffled
  order: 'asc' | 'desc';
  sorted: number[]; // expected tap order
}

function range(grade: Grade): [number, number] {
  return grade === Grade.One ? [1, 20] : grade === Grade.Two ? [10, 99] : [100, 999];
}

export function makeTrainRound(grade: Grade, difficulty: Difficulty): TrainRound {
  const [min, max] = range(grade);
  const count = difficulty === Difficulty.Easy ? 4 : 5;
  const set = new Set<number>();
  while (set.size < count) set.add(randInt(min, max));
  const nums = [...set];
  const order = difficulty === Difficulty.Easy || Math.random() < 0.5 ? 'asc' : 'desc';
  const sorted = [...nums].sort((a, b) => (order === 'asc' ? a - b : b - a));
  return { numbers: shuffle(nums), order, sorted };
}

