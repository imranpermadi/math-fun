import { Grade, Difficulty } from '../../../domain/enums';
import type { RallyGate, RallyRound } from './types';

export function generateRallyRound(grade: Grade = Grade.Two, _diff: Difficulty = Difficulty.Medium): RallyRound {
  let prompt: string;
  let hint: string;
  let formula: string;
  let answer: number;

  if (grade <= Grade.One) {
    // Basic multiplication distance = speed x time
    const v = (Math.floor(Math.random() * 5) + 2) * 10; // 20, 30, 40, 50, 60 km/jam
    const t = Math.floor(Math.random() * 4) + 2; // 2 to 5 jam
    answer = v * t;
    prompt = `Kecepatan ${v} km/jam selama ${t} jam. Berapa jaraknya?`;
    hint = `Rumus Jarak: s = v × t (${v} × ${t})`;
    formula = `Jarak = ${v} × ${t} = ${answer} km`;
  } else if (grade <= Grade.Two) {
    const isFindingTime = Math.random() > 0.5;
    if (isFindingTime) {
      const v = (Math.floor(Math.random() * 4) + 3) * 10; // 30, 40, 50, 60
      const t = Math.floor(Math.random() * 4) + 2; // 2 to 5 jam
      const s = v * t;
      answer = t;
      prompt = `Jarak ${s} km ditempuh dengan kecepatan ${v} km/jam. Berapa jam waktu tempuhnya?`;
      hint = `Rumus Waktu: t = s ÷ v (${s} ÷ ${v})`;
      formula = `Waktu = ${s} ÷ ${v} = ${answer} jam`;
    } else {
      const t = Math.floor(Math.random() * 3) + 2; // 2 to 4 jam
      const v = (Math.floor(Math.random() * 4) + 4) * 10; // 40 to 70 km/jam
      const s = v * t;
      answer = v;
      prompt = `Jarak ${s} km ditempuh dalam ${t} jam. Berapa kecepatannya?`;
      hint = `Rumus Kecepatan: v = s ÷ t (${s} ÷ ${t})`;
      formula = `Kecepatan = ${s} ÷ ${t} = ${answer} km/jam`;
    }
  } else {
    // Grade 5-6: Unit conversion or mixed speeds (m/detik to km/jam or minutes)
    const mode = Math.random() > 0.5;
    if (mode) {
      // 1 km = 1000 m
      const km = Math.floor(Math.random() * 6) + 2; // 2 to 7 km
      answer = km * 1000;
      prompt = `Mobil reli melaju sejauh ${km} km. Berapa meter jarak tersebut?`;
      hint = `1 kilometer = 1.000 meter`;
      formula = `${km} km = ${km} × 1.000 = ${answer} meter`;
    } else {
      // 2 jam = 120 menit
      const hours = Math.floor(Math.random() * 4) + 2;
      answer = hours * 60;
      prompt = `Perjalanan kafilah berlangsung selama ${hours} jam. Berapa menit itu?`;
      hint = `1 jam = 60 menit`;
      formula = `${hours} jam = ${hours} × 60 = ${answer} menit`;
    }
  }

  // Generate 2 distractors
  const distractors: number[] = [];
  const candidates = [
    answer + 10,
    Math.max(1, answer - 10),
    answer * 2,
    Math.max(1, Math.floor(answer / 2)),
    answer + 100,
    answer + 2,
    Math.max(1, answer - 2),
  ];

  for (const c of candidates) {
    if (c !== answer && !distractors.includes(c)) {
      distractors.push(c);
      if (distractors.length >= 2) break;
    }
  }

  while (distractors.length < 2) {
    distractors.push(answer + distractors.length + 5);
  }

  const allVals = [answer, ...distractors].sort(() => Math.random() - 0.5);
  const lanes = [-1, 0, 1];

  const gates: RallyGate[] = allVals.map((val, idx) => ({
    id: `gate-${idx}-${val}`,
    lane: lanes[idx],
    value: val,
    label: String(val),
    isCorrect: val === answer,
  }));

  return {
    id: `rally-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    questionPrompt: prompt,
    questionHint: hint,
    formulaContext: formula,
    correctAnswer: answer,
    gates,
  };
}
