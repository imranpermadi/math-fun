import { create } from 'zustand';
import { Difficulty, Grade } from '../../domain/enums';
import { attemptRepository } from '../../core/di/container';

interface AppState {
  grade: Grade;
  difficulty: Difficulty;
  stars: number;
  setGrade: (g: Grade) => void;
  setDifficulty: (d: Difficulty) => void;
  loadStars: () => Promise<void>;
  earnStars: (n: number) => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  grade: Grade.One,
  difficulty: Difficulty.Easy,
  stars: 0,
  setGrade: (grade) => set({ grade }),
  setDifficulty: (difficulty) => set({ difficulty }),
  loadStars: async () => set({ stars: await attemptRepository.getStars() }),
  earnStars: async (n) => set({ stars: await attemptRepository.addStars(n) }),
}));

