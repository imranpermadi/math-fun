import React from 'react';
import { GameFrame } from '../../components/common/GameFrame';
import { QuizRunner } from '../../components/common/QuizRunner';
import { Grade, Operation } from '../../../domain/enums';
import { useAppStore } from '../../stores/useAppStore';
import type { GameProps } from '../types';

// Unused imports kept minimal for placeholder games.
void QuizRunner; void Grade; void Operation;

export function HitungKurmaSedekah({ onExit }: GameProps) {
  const { grade, difficulty } = useAppStore();
  void grade; void difficulty;
  return (
    <GameFrame emoji="🟤" title="Hitung Kurma Sedekah" concept="Penjumlahan dan pengurangan" onExit={onExit}>
      <QuizRunner grade={grade} difficulty={difficulty} operation={Operation.Addition} gameId="hitung-kurma-sedekah" onFinish={onExit} />
    </GameFrame>
  );
}
