export interface RallyGate {
  id: string;
  lane: number; // -1: left, 0: center, 1: right
  value: number;
  label: string;
  isCorrect: boolean;
}

export interface RallyRound {
  id: string;
  questionPrompt: string;
  questionHint: string;
  formulaContext: string;
  correctAnswer: number;
  gates: RallyGate[];
}
