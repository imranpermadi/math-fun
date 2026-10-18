import { Grade, Difficulty } from '../../../domain/enums';
import type { DefenseRound, TowerCatapult } from './types';

const ENEMIES = [
  { name: 'Golem Batu Raksasa', emoji: '🧌' },
  { name: 'Naga Pasir Merah', emoji: '🐲' },
  { name: 'Robot Pengacau Angka', emoji: '🤖' },
  { name: 'Monster Bayangan', emoji: '👾' },
];

export function generateDefenseRound(grade: Grade = Grade.Two, _diff: Difficulty = Difficulty.Medium): DefenseRound {
  const enemy = ENEMIES[Math.floor(Math.random() * ENEMIES.length)];
  let prompt: string;
  let hint: string;
  let explanation: string;
  let answer: number;

  if (grade <= Grade.One) {
    // Basic mixed operation: a + (b x c) or (a + b) - c
    const mode = Math.random() > 0.5;
    if (mode) {
      const a = Math.floor(Math.random() * 10) + 5;
      const b = Math.floor(Math.random() * 4) + 2;
      const c = Math.floor(Math.random() * 5) + 2;
      answer = a + b * c;
      prompt = `${a} + ${b} × ${c} = ?`;
      hint = `KABATAKU: Dahulukan perkalian (${b} × ${c}) baru dijumlahkan dengan ${a}!`;
      explanation = `Hitung perkalian dulu: ${b} × ${c} = ${b * c}, lalu ${a} + ${b * c} = ${answer}!`;
    } else {
      const b = Math.floor(Math.random() * 5) + 2;
      const c = Math.floor(Math.random() * 4) + 2;
      const a = (Math.floor(Math.random() * 10) + 1) + (b * c);
      answer = a - b * c;
      prompt = `${a} − ${b} × ${c} = ?`;
      hint = `Dahulukan perkalian sebelum pengurangan!`;
      explanation = `${b} × ${c} = ${b * c}, lalu ${a} − ${b * c} = ${answer}!`;
    }
  } else if (grade <= Grade.Two) {
    // Parentheses (Kurung) priority: (a + b) x c or (a - b) / c
    const mode = Math.random() > 0.5;
    if (mode) {
      const a = Math.floor(Math.random() * 6) + 2;
      const b = Math.floor(Math.random() * 6) + 2;
      const c = Math.floor(Math.random() * 4) + 2;
      answer = (a + b) * c;
      prompt = `(${a} + ${b}) × ${c} = ?`;
      hint = `Tanda kurung nomor satu! Kerjakan di dalam kurung lebih dulu!`;
      explanation = `Dalam kurung: ${a} + ${b} = ${a + b}. Lalu ${a + b} × ${c} = ${answer}!`;
    } else {
      const c = Math.floor(Math.random() * 4) + 2;
      const quotient = Math.floor(Math.random() * 6) + 3;
      const total = quotient * c;
      const b = Math.floor(Math.random() * 10) + 5;
      const a = total + b;
      answer = quotient;
      prompt = `(${a} − ${b}) ÷ ${c} = ?`;
      hint = `Selesaikan hitungan di dalam tanda kurung lebih dulu!`;
      explanation = `Dalam kurung: ${a} − ${b} = ${total}. Lalu ${total} ÷ ${c} = ${answer}!`;
    }
  } else {
    // Grade 5-6: Advanced PEMDAS/KABATAKU: a x b + c / d or a + b x c - d
    const a = Math.floor(Math.random() * 6) + 3;
    const b = Math.floor(Math.random() * 5) + 2;
    const d = Math.floor(Math.random() * 4) + 2;
    const quotient = Math.floor(Math.random() * 5) + 2;
    const c = quotient * d;
    answer = a * b + quotient;
    prompt = `${a} × ${b} + ${c} ÷ ${d} = ?`;
    hint = `Kerjakan perkalian dan pembagian lebih dulu, baru dijumlahkan!`;
    explanation = `(${a} × ${b}) = ${a * b} dan (${c} ÷ ${d}) = ${quotient}. Maka ${a * b} + ${quotient} = ${answer}!`;
  }

  // Generate 2 distractors
  const distractors: number[] = [];
  const candidates = [
    answer + 5,
    Math.max(1, answer - 5),
    answer + 10,
    Math.max(1, answer - 2),
    answer + 2,
    answer * 2,
  ];

  for (const cd of candidates) {
    if (cd !== answer && !distractors.includes(cd)) {
      distractors.push(cd);
      if (distractors.length >= 2) break;
    }
  }

  while (distractors.length < 2) {
    distractors.push(answer + distractors.length + 3);
  }

  const allVals = [answer, ...distractors].sort(() => Math.random() - 0.5);
  const types: TowerCatapult['towerType'][] = ['fire', 'ice', 'stone'];

  const catapults: TowerCatapult[] = allVals.map((val, idx) => ({
    id: `tower-${idx}-${val}`,
    value: val,
    label: `${val}`,
    isCorrect: val === answer,
    towerType: types[idx],
  }));

  return {
    id: `defense-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    waveNumber: Math.floor(Math.random() * 5) + 1,
    enemyName: enemy.name,
    enemyEmoji: enemy.emoji,
    questionPrompt: prompt,
    questionHint: hint,
    pemdasExplanation: explanation,
    correctAnswer: answer,
    catapults,
  };
}
