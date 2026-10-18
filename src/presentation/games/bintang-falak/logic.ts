import { Grade, Difficulty } from '../../../domain/enums';
import type { CosmicMeteor, CosmicRound } from './types';

export function generateCosmicRound(grade: Grade = Grade.Two, _diff: Difficulty = Difficulty.Medium): CosmicRound {
  let prompt: string;
  let hint: string;
  let answer: number;

  if (grade <= Grade.One) {
    // Basic positive & negative (temperatures, elevations)
    const isTemp = Math.random() > 0.5;
    if (isTemp) {
      const start = Math.floor(Math.random() * 8) - 4; // -4 to +3
      const change = Math.floor(Math.random() * 7) + 2; // +2 to +8
      answer = start + change;
      prompt = `Suhu mula-mula ${start}°C naik ${change}°C`;
      hint = `Garis bilangan: ${start} + ${change} = ?`;
    } else {
      const a = Math.floor(Math.random() * 15) + 5;
      const b = Math.floor(Math.random() * 10) + 1;
      answer = a - b;
      prompt = `${a} + (${-b}) = ?`;
      hint = `Menambah bilangan negatif sama dengan mengurangkan`;
    }
  } else {
    // Grade 4-6: Full integers (-a + b, -a - b, a - b where result is negative)
    const mode = Math.floor(Math.random() * 4);
    if (mode === 0) {
      // Negative + Positive
      const a = -(Math.floor(Math.random() * 12) + 3);
      const b = Math.floor(Math.random() * 18) + 4;
      answer = a + b;
      prompt = `(${a}) + ${b} = ?`;
      hint = `Maju ke kanan sejauh ${b} dari titik ${a}`;
    } else if (mode === 1) {
      // Negative - Positive
      const a = -(Math.floor(Math.random() * 8) + 2);
      const b = Math.floor(Math.random() * 8) + 2;
      answer = a - b;
      prompt = `(${a}) − ${b} = ?`;
      hint = `Makin ke kiri pada garis bilangan`;
    } else if (mode === 2) {
      // Positive - Larger Positive (produces negative)
      const a = Math.floor(Math.random() * 8) + 2;
      const b = a + Math.floor(Math.random() * 9) + 2;
      answer = a - b;
      prompt = `${a} − ${b} = ?`;
      hint = `Hasilnya bernilai negatif`;
    } else {
      // Negative minus Negative
      const a = -(Math.floor(Math.random() * 9) + 4);
      const b = -(Math.floor(Math.random() * 5) + 1);
      answer = a - b; // -a - (-b) = -a + b
      prompt = `(${a}) − (${b}) = ?`;
      hint = `Kurang ketemu negatif berubah menjadi tambah!`;
    }
  }

  // Generate 2 distractors
  const distractors: number[] = [];
  const candidates = [
    -answer,
    answer + 2,
    answer - 2,
    answer + 1,
    answer - 1,
    answer + 5,
    answer - 5,
  ];

  for (const c of candidates) {
    if (c !== answer && !distractors.includes(c)) {
      distractors.push(c);
      if (distractors.length >= 2) break;
    }
  }

  const allValues = [answer, ...distractors].sort(() => Math.random() - 0.5);
  const lanes = [-1, 0, 1];
  const colorsList = ['#EF4444', '#3B82F6', '#8B5CF6'];

  const meteors: CosmicMeteor[] = allValues.map((val, idx) => ({
    id: `meteor-${idx}-${val}`,
    value: val,
    label: val >= 0 ? `+${val}` : `${val}`,
    isCorrect: val === answer,
    color: colorsList[idx],
    xLane: lanes[idx],
  }));

  return {
    id: `cosmic-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    questionPrompt: prompt,
    questionHint: hint,
    correctAnswer: answer,
    meteors,
  };
}
