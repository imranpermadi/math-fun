import { create } from 'zustand';
import { Difficulty, Grade } from '../../domain/enums';
import { attemptRepository } from '../../core/di/container';
import { SoundService } from '../../core/sound/SoundService';

interface AppState {
  grade: Grade;
  difficulty: Difficulty;
  stars: number;
  soundOn: boolean;
  setGrade: (g: Grade) => void;
  setDifficulty: (d: Difficulty) => void;
  toggleSound: () => void;
  loadStars: () => Promise<void>;
  earnStars: (n: number) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  grade: Grade.One,
  difficulty: Difficulty.Easy,
  stars: 0,
  soundOn: true,
  setGrade: (grade) => set({ grade }),
  setDifficulty: (difficulty) => set({ difficulty }),
  toggleSound: () => {
    const soundOn = !get().soundOn;
    SoundService.setEnabled(soundOn);
    set({ soundOn });
  },
  loadStars: async () => set({ stars: await attemptRepository.getStars() }),
  earnStars: async (n) => set({ stars: await attemptRepository.addStars(n) }),
}));
