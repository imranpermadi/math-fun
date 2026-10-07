import { Difficulty } from '../../../domain/enums';
import { pickOne, randInt, shuffle } from '../../../core/utils/random';

export interface FractionRound {
  mode: 'fill' | 'name';
  parts: number; // denominator
  num: number; // numerator
  choices: string[];
}

export const frac = (n: number, d: number) => `${n}/${d}`;

export function makeFractionRound(difficulty: Difficulty): FractionRound {
  const denoms = difficulty === Difficulty.Easy ? [2, 4] : difficulty === Difficulty.Medium ? [2, 3, 4] : [3, 4, 6, 8];
  const parts = pickOne(denoms);
  const num = randInt(1, parts - 1);
  const mode = Math.random() < 0.55 ? 'fill' : 'name';
  const correct = frac(num, parts);
  const wrong = new Set<string>();
  while (wrong.size < 2) {
    const n = randInt(1, parts - 1);
    const d = Math.random() < 0.5 ? parts : parts + pickOne([-1, 1, 2]);
    if (d >= 2 && n < d && n * parts !== num * d) wrong.add(frac(n, d));
  }
  return { mode, parts, num, choices: shuffle([correct, ...wrong]) };
}
