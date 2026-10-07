import { create } from 'zustand';
import { Difficulty, Grade } from '../../domain/enums';
import { UserProfile } from '../../domain/repositories/AttemptRepository';
import { attemptRepository } from '../../core/di/container';
import { SoundService } from '../../core/sound/SoundService';

interface AppState {
  name: string;
  age: number;
  avatar: string;
  grade: Grade;
  difficulty: Difficulty;
  stars: number;
  soundOn: boolean;
  setGrade: (g: Grade) => void;
  setDifficulty: (d: Difficulty) => void;
  toggleSound: () => void;
  loadProfile: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  loadStars: () => Promise<void>;
  earnStars: (n: number) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  name: 'Sahabat Kecil',
  age: 7,
  avatar: '🧒',
  grade: Grade.One,
  difficulty: Difficulty.Easy,
  stars: 0,
  soundOn: true,
  setGrade: (grade) => {
    set({ grade });
    attemptRepository.updateProfile({ grade }).catch(() => undefined);
  },
  setDifficulty: (difficulty) => set({ difficulty }),
  toggleSound: () => {
    const soundOn = !get().soundOn;
    SoundService.setEnabled(soundOn);
    set({ soundOn });
  },
  loadProfile: async () => {
    try {
      const p = await attemptRepository.getProfile();
      set({
        name: p.name,
        age: p.age,
        avatar: p.avatar,
        grade: p.grade,
        stars: p.stars,
      });
    } catch {
      /* ignore */
    }
  },
  updateProfile: async (partial) => {
    try {
      await attemptRepository.updateProfile(partial);
      const p = await attemptRepository.getProfile();
      set({
        name: p.name,
        age: p.age,
        avatar: p.avatar,
        grade: p.grade,
        stars: p.stars,
      });
    } catch {
      /* ignore */
    }
  },
  loadStars: async () => {
    try {
      const p = await attemptRepository.getProfile();
      set({
        name: p.name,
        age: p.age,
        avatar: p.avatar,
        grade: p.grade,
        stars: p.stars,
      });
    } catch {
      const stars = await attemptRepository.getStars();
      set({ stars });
    }
  },
  earnStars: async (n) => {
    const stars = await attemptRepository.addStars(n);
    set({ stars });
  },
}));
