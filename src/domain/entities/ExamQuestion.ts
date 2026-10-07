import { Difficulty, Grade } from '../enums';

export type ExamQuestionType = 'single' | 'multi' | 'match' | 'decompose';

export interface MultiOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

export interface DecomposeData {
  a: number;
  b: number;
  operation: '+' | '-';
  tensA: number;
  onesA: number;
  tensB: number;
  onesB: number;
  tensResult: number;
  onesResult: number;
  finalAnswer: number;
}

export interface ExamQuestion {
  id: string;
  type: ExamQuestionType;
  grade: Grade;
  difficulty: Difficulty;
  topic: string; // e.g. 'Penjumlahan Dekomposisi', 'Perkalian Berulang', 'Pembagian Pengelompokan'
  prompt: string;
  hint?: string;
  explanation: string;
  unit?: string;

  // Type-specific payloads:
  // For 'single' (Pilihan Ganda Biasa)
  choices?: (string | number)[];
  singleAnswer?: string | number;

  // For 'multi' (Jawaban Lebih dari Satu / Pilihan Ganda Kompleks)
  multiOptions?: MultiOption[];

  // For 'match' (Penjodohan)
  matchPairs?: MatchPair[];

  // For 'decompose' (Uraian Isian Dekomposisi Angka Buku SD)
  decompose?: DecomposeData;
}

