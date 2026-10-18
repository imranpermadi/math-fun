import { Grade, Difficulty } from '../../../domain/enums';
import type { ChefSliceRound, FruitOption } from './types';

const FRUITS = [
  { name: 'Semangka Manis', emoji: '🍉' },
  { name: 'Melon Segar', emoji: '🍈' },
  { name: 'Kue Kurma', emoji: '🥧' },
  { name: 'Jeruk Madu', emoji: '🍊' },
  { name: 'Pizza Roti Maryam', emoji: '🍕' },
  { name: 'Apel Hijau', emoji: '🍏' },
];

export function generateChefRound(grade: Grade = Grade.Two, _diff: Difficulty = Difficulty.Medium): ChefSliceRound {
  const fruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];
  let prompt: string;
  let hint: string;
  let correctFraction: string;
  let correctVal: number;
  let cutPieces: number;
  let rawCandidates: Array<{ label: string; val: number; pieces: number }> = [];

  if (grade <= Grade.One) {
    // Basic halves and quarters: 1/2, 1/4
    const isHalf = Math.random() > 0.5;
    if (isHalf) {
      correctFraction = '1/2';
      correctVal = 0.5;
      cutPieces = 2;
      prompt = `Potong ${fruit.name} menjadi SETENGAH (1/2 bagian)!`;
      hint = `1 buah dibagi sama rata menjadi 2 potongan`;
    } else {
      correctFraction = '1/4';
      correctVal = 0.25;
      cutPieces = 4;
      prompt = `Potong ${fruit.name} menjadi SEPEREMPAT (1/4 bagian)!`;
      hint = `1 buah dibagi sama rata menjadi 4 potongan`;
    }
    rawCandidates = [
      { label: '1/2 (Setengah)', val: 0.5, pieces: 2 },
      { label: '1/4 (Seperempat)', val: 0.25, pieces: 4 },
      { label: '1/3 (Sepertiga)', val: 0.33, pieces: 3 },
    ];
  } else if (grade <= Grade.Two) {
    // 1/2, 1/4, 3/4, 2/3, 1/3
    const picks = [
      { fraction: '1/2', val: 0.5, pieces: 2, desc: '1/2 bagian' },
      { fraction: '1/4', val: 0.25, pieces: 4, desc: '1/4 bagian' },
      { fraction: '3/4', val: 0.75, pieces: 4, desc: '3/4 bagian' },
      { fraction: '2/4', val: 0.5, pieces: 4, desc: '2/4 bagian (senilai 1/2)' },
      { fraction: '1/3', val: 0.33, pieces: 3, desc: '1/3 bagian' },
      { fraction: '2/3', val: 0.67, pieces: 3, desc: '2/3 bagian' },
    ];
    const chosen = picks[Math.floor(Math.random() * picks.length)];
    correctFraction = chosen.fraction;
    correctVal = chosen.val;
    cutPieces = chosen.pieces;
    prompt = `Tamu memesan ${chosen.desc} dari ${fruit.name}!`;
    hint = `Pilih bilah pisau dengan takaran pecahan yang tepat`;

    rawCandidates = [
      { label: `${chosen.fraction}`, val: chosen.val, pieces: chosen.pieces },
      ...picks.filter(p => p.fraction !== chosen.fraction).map(p => ({ label: p.fraction, val: p.val, pieces: p.pieces }))
    ].slice(0, 3);
  } else {
    // Grade 5-6: Decimal & percent equivalent to fractions
    const decPicks = [
      { fraction: '1/2 = 0.5', val: 0.5, pieces: 2, promptPart: '0.5 bagian' },
      { fraction: '1/4 = 0.25', val: 0.25, pieces: 4, promptPart: '0.25 bagian' },
      { fraction: '3/4 = 0.75', val: 0.75, pieces: 4, promptPart: '0.75 bagian' },
      { fraction: '1/5 = 0.2', val: 0.2, pieces: 5, promptPart: '0.2 bagian' },
      { fraction: '2/5 = 0.4', val: 0.4, pieces: 5, promptPart: '0.4 bagian' },
    ];
    const chosen = decPicks[Math.floor(Math.random() * decPicks.length)];
    correctFraction = chosen.fraction;
    correctVal = chosen.val;
    cutPieces = chosen.pieces;
    prompt = `Takjil dipesan sebesar ${chosen.promptPart} dari ${fruit.name}!`;
    hint = `Konversikan desimal ke bentuk pecahan biasa`;

    rawCandidates = [
      { label: chosen.fraction, val: chosen.val, pieces: chosen.pieces },
      ...decPicks.filter(p => p.val !== chosen.val).map(p => ({ label: p.fraction, val: p.val, pieces: p.pieces }))
    ].slice(0, 3);
  }

  // Shuffle options
  rawCandidates.sort(() => Math.random() - 0.5);

  const options: FruitOption[] = rawCandidates.map((c, idx) => ({
    id: `opt-${idx}-${c.label}`,
    fractionLabel: c.label,
    fractionValue: c.val,
    isCorrect: Math.abs(c.val - correctVal) < 0.01,
    cutPiecesCount: c.pieces,
  }));

  return {
    id: `slice-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    fruitEmoji: fruit.emoji,
    fruitName: fruit.name,
    orderPrompt: prompt,
    orderHint: hint,
    targetFraction: correctFraction,
    options,
  };
}
