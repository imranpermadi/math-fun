import { Grade, Difficulty } from '../../../domain/enums';
import type { AlchemyFlask, AlchemyRound } from './types';

const HERBS = [
  'Madu Habbatussauda',
  'Minyak Zaitun Murni',
  'Air Mawar Damaskus',
  'Ekstrak Jahe Merah',
  'Sari Buah Delima',
];

export function generateAlchemyRound(grade: Grade = Grade.Two, _diff: Difficulty = Difficulty.Medium): AlchemyRound {
  const herb = HERBS[Math.floor(Math.random() * HERBS.length)];
  let prompt: string;
  let hint: string;
  let explanation: string;
  let answer: number;

  if (grade <= Grade.One) {
    // Simple 1:N or 2:N ratios
    const baseRatio = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
    const spoons = Math.floor(Math.random() * 4) + 2; // 2 to 5
    answer = spoons * baseRatio;
    prompt = `Rasio Madu : Air adalah 1 : ${baseRatio}. Jika ada ${spoons} sendok madu, berapa sendok air?`;
    hint = `Kalikan dengan angka rasio: ${spoons} × ${baseRatio}`;
    explanation = `${spoons} × ${baseRatio} = ${answer} sendok air herbal`;
  } else if (grade <= Grade.Two) {
    // Equivalent ratio A : B = C : ?
    const a = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
    const b = a + (Math.floor(Math.random() * 3) + 1); // e.g. 2:3, 3:5
    const multiplier = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
    const c = a * multiplier;
    answer = b * multiplier;
    prompt = `Perbandingan ${herb} : Sari Bunga = ${a} : ${b}. Jika ${herb} ada ${c} tetes, berapa tetes Sari Bunga?`;
    hint = `Pengali perbandingan adalah ${c} ÷ ${a} = ${multiplier}. Maka kalikan ${b} × ${multiplier}!`;
    explanation = `Rasio senilai: (${a}×${multiplier}) : (${b}×${multiplier}) → ${answer} tetes`;
  } else {
    // Grade 5-6: Percentages % of medicinal mixture
    const pct = [10, 20, 25, 50, 75][Math.floor(Math.random() * 5)];
    const totalVolume = [40, 60, 80, 100, 200][Math.floor(Math.random() * 5)];
    answer = (pct * totalVolume) / 100;
    prompt = `Ramuan ${herb} memiliki kadar konsentrasi ${pct}% dari total volume ${totalVolume} ml. Berapa ml zat murninya?`;
    hint = `Hitung persentase: (${pct} ÷ 100) × ${totalVolume}`;
    explanation = `${pct}% × ${totalVolume} ml = ${answer} ml zat herbal murni`;
  }

  // Generate 2 distractors
  const distractors: number[] = [];
  const candidates = [
    answer + 2,
    Math.max(1, answer - 2),
    answer + 5,
    Math.max(1, answer - 5),
    answer * 2,
    Math.max(1, Math.floor(answer / 2)),
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
  const flaskColors = ['#10B981', '#6366F1', '#EC4899'];

  const flasks: AlchemyFlask[] = allVals.map((val, idx) => ({
    id: `flask-${idx}-${val}`,
    value: val,
    label: `${val}`,
    isCorrect: val === answer,
    color: flaskColors[idx],
  }));

  return {
    id: `alchemy-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    herbName: herb,
    questionPrompt: prompt,
    questionHint: hint,
    ratioExplanation: explanation,
    correctAnswer: answer,
    flasks,
  };
}
