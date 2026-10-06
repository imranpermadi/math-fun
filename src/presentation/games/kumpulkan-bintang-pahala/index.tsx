import React from 'react';
import { GameFrame } from '../../components/common/GameFrame';
import { QuizRunner } from '../../components/common/QuizRunner';
import { Grade, Operation } from '../../../domain/enums';
import { useAppStore } from '../../stores/useAppStore';
import type { GameProps } from '../types';

// Unused imports kept minimal for placeholder games.
void QuizRunner; void Grade; void Operation;

export function KumpulkanBintangPahala({ onExit }: GameProps) {
  const { grade, difficulty } = useAppStore();
  void grade; void difficulty;
  return (
    <GameFrame emoji="⭐" title="Kumpulkan Bintang Pahala" concept="Perkalian" onExit={onExit}>
      <QuizRunner grade={grade < Grade.Two ? Grade.Two : grade} difficulty={difficulty} operation={Operation.Multiplication} gameId="kumpulkan-bintang-pahala" onFinish={onExit} />
    </GameFrame>
  );
}
