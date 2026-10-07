export const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const pickOne = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const NAMES = ['Ahmad', 'Umar', 'Ali', 'Yusuf', 'Fatimah', 'Aisyah', 'Khadijah', 'Maryam', 'Zainab', 'Bilal'];

/** Distinct numeric distractors around `answer` (always > 0, never equal to answer). */
export function numberChoices(answer: number, count = 3, spread = 3): number[] {
  const set = new Set<number>([answer]);
  let guard = 0;
  while (set.size < count && guard++ < 50) {
    const d = randInt(1, spread) * (Math.random() < 0.5 ? -1 : 1);
    const v = answer + d;
    if (v > 0) set.add(v);
  }
  let bump = spread + 1;
  while (set.size < count) set.add(answer + bump++);
  return shuffle([...set]);
}

