import React from 'react';
import { GameFrame } from '../../components/common/GameFrame';
import { QuizRunner } from '../../components/common/QuizRunner';
import { Grade, Operation } from '../../../domain/enums';
import { useAppStore } from '../../stores/useAppStore';
import type { GameProps } from '../types';

// Unused imports kept minimal for placeholder games.
void QuizRunner; void Grade; void Operation;

export function BagiRataAnakYatim({ onExit }: GameProps) {
  const { grade, difficulty } = useAppStore();
  void grade; void difficulty;
  return (
    <GameFrame emoji="🤝" title="Bagi Rata Anak Yatim" concept="Pembagian dasar (Kelas 3)" onExit={onExit}>
      <QuizRunner grade={Grade.Three} difficulty={difficulty} operation={Operation.Division} gameId="bagi-rata-anak-yatim" onFinish={onExit} />
    </GameFrame>
  );
}
