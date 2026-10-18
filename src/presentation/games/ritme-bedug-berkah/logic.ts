import { Grade, Difficulty } from '../../../domain/enums';
import type { RhythmDrum, RhythmRound } from './types';

export function generateRhythmRound(grade: Grade = Grade.Two, _diff: Difficulty = Difficulty.Medium): RhythmRound {
  let prompt: string;
  let hint: string;
  let answer: number;

  if (grade <= Grade.One) {
    // Skip-counting patterns by 2, 5, 10
    const step = [2, 5, 10][Math.floor(Math.random() * 3)];
    const start = step * (Math.floor(Math.random() * 4) + 1);
    answer = start + step;
    prompt = `Irama ketukan loncat ${step}: ${start - step > 0 ? `${start - step}, ` : ''}${start}, ?`;
    hint = `Ketuk bedug dengan angka ketukan selanjutnya (+${step})`;
  } else if (grade <= Grade.Two) {
    // Quick multiplication beat: 6, 7, 8, 9
    const base = [3, 4, 6, 7, 8, 9][Math.floor(Math.random() * 6)];
    const mult = Math.floor(Math.random() * 8) + 2;
    answer = base * mult;
    prompt = `Tabuh nada perkalian: ${base} × ${mult} = ?`;
    hint = `Irama kelipatan ${base}`;
  } else {
    // Grade 5-6: Rapid square numbers or multi-step rhythm beats
    const isSquare = Math.random() > 0.5;
    if (isSquare) {
      const n = Math.floor(Math.random() * 8) + 4; // 4 to 11
      answer = n * n;
      prompt = `Ketukan kuadrat bilangan: ${n}² = ?`;
      hint = `Pangkat dua: ${n} × ${n}`;
    } else {
      const a = (Math.floor(Math.random() * 6) + 3) * 10;
      const b = (Math.floor(Math.random() * 4) + 2) * 5;
      answer = a + b;
      prompt = `Tempo cepat hitung mental: ${a} + ${b} = ?`;
      hint = `Jumlahkan puluhan dengan tepat`;
    }
  }

  // Generate 2 distractors
  const distractors: number[] = [];
  const candidates = [
    answer + 2,
    Math.max(1, answer - 2),
    answer + 5,
    Math.max(1, answer - 5),
    answer + 10,
    Math.max(1, answer - 10),
  ];

  for (const c of candidates) {
    if (c !== answer && !distractors.includes(c)) {
      distractors.push(c);
      if (distractors.length >= 2) break;
    }
  }

  while (distractors.length < 2) {
    distractors.push(answer + distractors.length + 4);
  }

  const allVals = [answer, ...distractors].sort(() => Math.random() - 0.5);

  const drums: RhythmDrum[] = allVals.map((val, idx) => ({
    id: `drum-${idx}-${val}`,
    lane: idx,
    value: val,
    label: `${val}`,
    isCorrect: val === answer,
  }));

  return {
    id: `rhythm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    rhythmTitle: 'Gema Takbiran & Tabuh Bedug',
    questionPrompt: prompt,
    questionHint: hint,
    correctAnswer: answer,
    drums,
  };
}
