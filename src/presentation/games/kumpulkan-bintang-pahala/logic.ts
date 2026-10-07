import { Difficulty } from '../../../domain/enums';
import { randInt } from '../../../core/utils/random';

export interface StarRound {
  jars: number;
  perJar: number;
  total: number;
}

export function makeStarRound(difficulty: Difficulty): StarRound {
  const [jMin, jMax, pMin, pMax] =
    difficulty === Difficulty.Easy ? [2, 3, 2, 3] : difficulty === Difficulty.Medium ? [3, 4, 2, 5] : [3, 5, 4, 8];
  const jars = randInt(jMin, jMax);
  const perJar = randInt(pMin, pMax);
  return { jars, perJar, total: jars * perJar };
}

