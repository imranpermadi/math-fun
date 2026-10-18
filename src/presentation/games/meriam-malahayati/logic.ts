import { Grade, Difficulty } from '../../../domain/enums';
import type { CannonRound, PirateShip } from './types';

// Helper GCD (FPB)
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// Helper LCM (KPK)
function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

export function generateCannonRound(grade: Grade = Grade.Two, _diff: Difficulty = Difficulty.Medium): CannonRound {
  let prompt: string;
  let hint: string;
  let answer: number;
  let missionType: CannonRound['missionType'];
  let distractors: number[] = [];

  if (grade <= Grade.One) {
    // Kelipatan dasar (Misal kelipatan 3, 4, 5)
    missionType = 'kelipatan';
    const base = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const k = Math.floor(Math.random() * 6) + 3;
    answer = base * k;
    prompt = `Tembak Kapal KELIPATAN ${base}!`;
    hint = `Cari bilangan yang habis dibagi ${base}`;

    // Distractors not divisible by base
    while (distractors.length < 2) {
      const candidate = answer + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
      if (candidate > 0 && candidate % base !== 0 && !distractors.includes(candidate)) {
        distractors.push(candidate);
      }
    }
  } else if (grade <= Grade.Two) {
    const pick = Math.random() > 0.5 ? 'fpb' : 'kpk';
    if (pick === 'fpb') {
      missionType = 'fpb';
      const pairs = [
        [12, 18], [15, 20], [8, 12], [14, 21], [16, 24], [18, 27], [20, 30]
      ];
      const [numA, numB] = pairs[Math.floor(Math.random() * pairs.length)];
      answer = gcd(numA, numB);
      prompt = `Cari FPB dari ${numA} dan ${numB}!`;
      hint = `Faktor persekutuan terbesar yang membagi habis keduanya`;
      distractors = [answer + 1, Math.max(1, answer - 1), answer + 2].filter(d => d !== answer);
    } else {
      missionType = 'kpk';
      const pairs = [
        [3, 4], [4, 6], [2, 5], [6, 8], [3, 5], [4, 5], [6, 9]
      ];
      const [numA, numB] = pairs[Math.floor(Math.random() * pairs.length)];
      answer = lcm(numA, numB);
      prompt = `Cari KPK dari ${numA} dan ${numB}!`;
      hint = `Kelipatan persekutuan terkecil yang bisa dibagi keduanya`;
      distractors = [answer + numA, Math.max(1, answer - numB), answer + 2].filter(d => d !== answer);
    }
  } else {
    // Grade 5-6
    missionType = Math.random() > 0.5 ? 'fpb' : 'kpk';
    if (missionType === 'fpb') {
      const pairs = [[24, 36], [30, 45], [36, 48], [40, 60], [28, 42]];
      const [numA, numB] = pairs[Math.floor(Math.random() * pairs.length)];
      answer = gcd(numA, numB);
      prompt = `FPB dari ${numA} dan ${numB} = ?`;
      hint = `Faktor pembagi terbesar untuk armada kapal`;
      distractors = [answer + 2, answer - 2, answer + 4].filter(d => d > 0 && d !== answer);
    } else {
      const pairs = [[8, 12], [6, 15], [9, 12], [10, 15]];
      const [numA, numB] = pairs[Math.floor(Math.random() * pairs.length)];
      answer = lcm(numA, numB);
      prompt = `KPK dari ${numA} dan ${numB} = ?`;
      hint = `Kelipatan persekutuan terkecil untuk bertemu di laut`;
      distractors = [answer + 6, answer - 6, answer + 12].filter(d => d > 0 && d !== answer);
    }
  }

  // Ensure 2 unique distractors
  const uniqueDistractors = Array.from(new Set(distractors)).slice(0, 2);
  while (uniqueDistractors.length < 2) {
    uniqueDistractors.push(answer + uniqueDistractors.length + 3);
  }

  const allValues = [answer, ...uniqueDistractors].sort(() => Math.random() - 0.5);
  const xPositions = [-1, 0, 1]; // Left, center, right

  const ships: PirateShip[] = allValues.map((val, idx) => ({
    id: `ship-${idx}-${val}`,
    value: val,
    label: String(val),
    isCorrect: val === answer,
    xPos: xPositions[idx],
  }));

  return {
    id: `cannon-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    missionType,
    questionPrompt: prompt,
    questionHint: hint,
    correctAnswer: answer,
    ships,
  };
}
