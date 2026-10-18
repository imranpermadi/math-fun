export interface AlchemyFlask {
  id: string;
  value: number;
  label: string;
  isCorrect: boolean;
  color: string;
}

export interface AlchemyRound {
  id: string;
  herbName: string;
  questionPrompt: string;
  questionHint: string;
  ratioExplanation: string;
  correctAnswer: number;
  flasks: AlchemyFlask[];
}
