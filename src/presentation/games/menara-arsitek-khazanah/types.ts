export interface TowerFoundation {
  id: string;
  value: number;
  label: string;
  isCorrect: boolean;
}

export interface TowerRound {
  id: string;
  shapeName: string;
  questionPrompt: string;
  questionHint: string;
  formulaExplanation: string;
  correctAnswer: number;
  foundations: TowerFoundation[];
}
