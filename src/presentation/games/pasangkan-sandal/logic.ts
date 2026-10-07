import { Grade } from '../../../domain/enums';
import { randInt } from '../../../core/utils/random';

export const isEven = (n: number) => n % 2 === 0;

/** 6 distinct numbers with a mix of odd and even (at least 2 of each). */
export function makeSandalNumbers(grade: Grade): number[] {
  const [min, max] = grade === Grade.One ? [1, 20] : grade === Grade.Two ? [10, 99] : [100, 999];
  for (;;) {
    const set = new Set<number>();
    while (set.size < 6) set.add(randInt(min, max));
    const nums = [...set];
    const evens = nums.filter(isEven).length;
    if (evens >= 2 && evens <= 4) return nums;
  }
}

