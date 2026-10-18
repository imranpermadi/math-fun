import { Grade, Difficulty } from '../../../domain/enums';
import type { MineGem, MinecartRound } from './types';

function isPrimeNumber(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

const PRIMES_UNDER_30 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
const PRIMES_UNDER_60 = [31, 37, 41, 43, 47, 53, 59];

export function generateMinecartRound(grade: Grade = Grade.Two, _diff: Difficulty = Difficulty.Medium): MinecartRound {
  let prompt: string;
  let hint: string;
  let explanation: string;
  let primeAnswer: number;
  let compositeDistractors: number[] = [];

  if (grade <= Grade.One) {
    // Basic primes under 20: 2, 3, 5, 7, 11, 13, 17, 19
    const primes = [2, 3, 5, 7, 11, 13, 17, 19];
    primeAnswer = primes[Math.floor(Math.random() * primes.length)];
    prompt = `Arahkan kereta ke rel BILANGAN PRIMA!`;
    hint = `Bilangan prima hanya bisa dibagi 1 dan dirinya sendiri`;
    explanation = `${primeAnswer} adalah bilangan prima karena hanya punya 2 faktor: 1 dan ${primeAnswer}.`;

    const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18];
    while (compositeDistractors.length < 2) {
      const c = composites[Math.floor(Math.random() * composites.length)];
      if (!compositeDistractors.includes(c)) compositeDistractors.push(c);
    }
  } else if (grade <= Grade.Two) {
    // Primes under 35
    primeAnswer = PRIMES_UNDER_30[Math.floor(Math.random() * PRIMES_UNDER_30.length)];
    prompt = `Cari gerbang kristal bertuliskan BILANGAN PRIMA!`;
    hint = `Hindari angka yang bisa dibagi angka lain selain 1 dan dirinya sendiri`;
    explanation = `${primeAnswer} adalah bilangan prima sejati!`;

    const composites = [9, 15, 21, 25, 27, 28, 33, 35, 49];
    while (compositeDistractors.length < 2) {
      const c = composites[Math.floor(Math.random() * composites.length)];
      if (!compositeDistractors.includes(c)) compositeDistractors.push(c);
    }
  } else {
    // Grade 5-6: Primes up to 60 or prime factor identification
    const isFactorMode = Math.random() > 0.5;
    if (isFactorMode) {
      const base = [12, 18, 20, 24, 30, 42][Math.floor(Math.random() * 6)];
      // Get prime factors of base
      const validPrimes = [2, 3, 5, 7].filter(p => base % p === 0);
      primeAnswer = validPrimes[Math.floor(Math.random() * validPrimes.length)];
      prompt = `Cari FAKTOR PRIMA dari ${base}!`;
      hint = `Bilangan prima yang membagi habis ${base}`;
      explanation = `${primeAnswer} adalah faktor prima dari ${base} karena ${base} habis dibagi ${primeAnswer}!`;

      // Non-prime factors or non-factors
      const notPrimes = [4, 6, 8, 9, 10, 11].filter(x => x !== primeAnswer);
      while (compositeDistractors.length < 2) {
        const c = notPrimes[Math.floor(Math.random() * notPrimes.length)];
        if (!compositeDistractors.includes(c)) compositeDistractors.push(c);
      }
    } else {
      const pool = [...PRIMES_UNDER_30, ...PRIMES_UNDER_60];
      primeAnswer = pool[Math.floor(Math.random() * pool.length)];
      prompt = `Arahkan kereta ke kristal BILANGAN PRIMA!`;
      hint = `Batu kristal ajaib hanya menerima bilangan prima`;
      explanation = `${primeAnswer} tidak bisa dibagi angka apapun selain 1 dan ${primeAnswer}.`;

      const composites = [27, 33, 35, 39, 49, 51, 55, 57];
      while (compositeDistractors.length < 2) {
        const c = composites[Math.floor(Math.random() * composites.length)];
        if (!compositeDistractors.includes(c)) compositeDistractors.push(c);
      }
    }
  }

  const allVals = [primeAnswer, ...compositeDistractors].sort(() => Math.random() - 0.5);
  const gemColors = ['#8B5CF6', '#EC4899', '#06B6D4'];

  const gems: MineGem[] = allVals.map((val, idx) => ({
    id: `gem-${idx}-${val}`,
    value: val,
    label: `${val}`,
    isPrime: isPrimeNumber(val),
    isCorrect: val === primeAnswer,
    color: gemColors[idx],
  }));

  return {
    id: `mine-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    questionPrompt: prompt,
    questionHint: hint,
    explanation,
    correctAnswer: primeAnswer,
    gems,
  };
}
