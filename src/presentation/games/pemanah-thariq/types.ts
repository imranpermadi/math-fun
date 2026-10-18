export interface ArcheryTarget {
  id: string;
  value: number;
  label: string;
  isCorrect: boolean;
  xOffset: number; // percentage or offset in target ring
}

export interface ArcheryRound {
  id: string;
  questionPrompt: string;
  questionHint: string;
  correctAnswer: number;
  targets: ArcheryTarget[];
}
