import { Grade, Difficulty } from '../../../domain/enums';
import type { TowerFoundation, TowerRound } from './types';

export function generateTowerRound(grade: Grade = Grade.Two, _diff: Difficulty = Difficulty.Medium): TowerRound {
  let shape: string;
  let prompt: string;
  let hint: string;
  let formula: string;
  let answer: number;

  if (grade <= Grade.One) {
    // Basic Perimeter / Area of square
    const isPerimeter = Math.random() > 0.5;
    const s = Math.floor(Math.random() * 6) + 3; // 3 to 8
    if (isPerimeter) {
      shape = 'Persegi';
      answer = 4 * s;
      prompt = `Persegi dengan sisi ${s} cm. Berapa KELILINGNYA?`;
      hint = `Keliling persegi = 4 × sisi (4 × ${s})`;
      formula = `K = 4 × ${s} = ${answer} cm`;
    } else {
      shape = 'Persegi';
      answer = s * s;
      prompt = `Persegi dengan sisi ${s} cm. Berapa LUASNYA?`;
      hint = `Luas persegi = sisi × sisi (${s} × ${s})`;
      formula = `L = ${s} × ${s} = ${answer} cm²`;
    }
  } else if (grade <= Grade.Two) {
    // Rectangle area & perimeter
    const isArea = Math.random() > 0.4;
    const p = Math.floor(Math.random() * 6) + 4; // 4 to 9
    const l = Math.floor(Math.random() * 4) + 2; // 2 to 5
    shape = 'Persegi Panjang';
    if (isArea) {
      answer = p * l;
      prompt = `Persegi Panjang panjang ${p} m & lebar ${l} m. Berapa LUASNYA?`;
      hint = `Luas = panjang × lebar (${p} × ${l})`;
      formula = `L = ${p} × ${l} = ${answer} m²`;
    } else {
      answer = 2 * (p + l);
      prompt = `Persegi Panjang panjang ${p} m & lebar ${l} m. Berapa KELILINGNYA?`;
      hint = `Keliling = 2 × (panjang + lebar)`;
      formula = `K = 2 × (${p} + ${l}) = ${answer} m`;
    }
  } else {
    // Grade 5-6: Triangle area or mixed shapes
    const isTriangle = Math.random() > 0.5;
    if (isTriangle) {
      shape = 'Segitiga';
      const a = (Math.floor(Math.random() * 4) + 2) * 2; // Even base: 4, 6, 8, 10
      const t = Math.floor(Math.random() * 6) + 3; // Height: 3 to 8
      answer = (a * t) / 2;
      prompt = `Segitiga dengan alas ${a} cm dan tinggi ${t} cm. Berapa LUASNYA?`;
      hint = `Luas segitiga = (alas × tinggi) ÷ 2`;
      formula = `L = (${a} × ${t}) ÷ 2 = ${answer} cm²`;
    } else {
      shape = 'Persegi Panjang Khusus';
      const p = Math.floor(Math.random() * 8) + 6;
      const l = Math.floor(Math.random() * 6) + 4;
      answer = p * l;
      prompt = `Lantai masjid panjang ${p} m dan lebar ${l} m. Berapa meter persegi karpet yang dibutuhkan?`;
      hint = `Luas = ${p} × ${l}`;
      formula = `L = ${p} × ${l} = ${answer} m²`;
    }
  }

  // Generate 2 distractors
  const distractors: number[] = [];
  const candidates = [
    answer + 4,
    Math.max(1, answer - 4),
    answer + 2,
    Math.max(1, answer - 2),
    answer * 2,
    Math.max(1, Math.floor(answer / 2)),
    answer + 10,
  ];

  for (const c of candidates) {
    if (c !== answer && !distractors.includes(c)) {
      distractors.push(c);
      if (distractors.length >= 2) break;
    }
  }

  while (distractors.length < 2) {
    distractors.push(answer + distractors.length + 3);
  }

  const allVals = [answer, ...distractors].sort(() => Math.random() - 0.5);

  const foundations: TowerFoundation[] = allVals.map((val, idx) => ({
    id: `found-${idx}-${val}`,
    value: val,
    label: String(val),
    isCorrect: val === answer,
  }));

  return {
    id: `tower-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    shapeName: shape,
    questionPrompt: prompt,
    questionHint: hint,
    formulaExplanation: formula,
    correctAnswer: answer,
    foundations,
  };
}
