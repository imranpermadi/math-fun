import React from 'react';
import { GameFrame } from '../../components/common/GameFrame';
import { QuizRunner } from '../../components/common/QuizRunner';
import { Grade, Operation } from '../../../domain/enums';
import { useAppStore } from '../../stores/useAppStore';
import type { GameProps } from '../types';

// Unused imports kept minimal for placeholder games.
void QuizRunner; void Grade; void Operation;

export function TimbanganZakat({ onExit }: GameProps) {
  const { grade, difficulty } = useAppStore();
  void grade; void difficulty;
  return (
    <GameFrame emoji="⚖️" title="Timbangan Zakat" concept="Berat dan pengukuran" onExit={onExit} />
  );
}
