import React from 'react';
import { GameFrame } from '../../components/common/GameFrame';
import { QuizRunner } from '../../components/common/QuizRunner';
import { Grade, Operation } from '../../../domain/enums';
import { useAppStore } from '../../stores/useAppStore';
import type { GameProps } from '../types';

// Unused imports kept minimal for placeholder games.
void QuizRunner; void Grade; void Operation;

export function TarikTambangBulanHijriah({ onExit }: GameProps) {
  const { grade, difficulty } = useAppStore();
  void grade; void difficulty;
  return (
    <GameFrame emoji="🌙" title="Tarik Tambang Bulan Hijriah" concept="Hitung cepat dengan timer 60 detik" onExit={onExit}>
      <QuizRunner grade={grade} difficulty={difficulty} timerSeconds={60} gameId="tarik-tambang-bulan-hijriah" onFinish={onExit} />
    </GameFrame>
  );
}
