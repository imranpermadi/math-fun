export interface FruitOption {
  id: string;
  fractionLabel: string;
  fractionValue: number;
  decimalEquivalent?: number;
  isCorrect: boolean;
  cutPiecesCount: number; // e.g. 2 pieces, 4 pieces
}

export interface ChefSliceRound {
  id: string;
  fruitEmoji: string;
  fruitName: string;
  orderPrompt: string;
  orderHint: string;
  targetFraction: string;
  options: FruitOption[];
}
