import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { GameShell, RoundApi } from '../../components/play/GameShell';
import { Choices } from '../../components/play/Choices';
import { questionGenerator } from '../../../core/di/container';
import { Operation } from '../../../domain/enums';
import { colors, radius, spacing } from '../../theme';
import type { GameProps } from '../types';
import { MAX_PULL, TOTAL_SECONDS, ropePosition } from './logic';

const SIGN: Record<Operation, string> = {
  [Operation.Addition]: '+',
  [Operation.Subtraction]: '−',
  [Operation.Multiplication]: '×',
  [Operation.Division]: '÷',
};

function Round({ round, score, misses, timeLeft, grade, difficulty, onCorrect, onWrong, finish }: RoundApi) {
  const q = useMemo(() => questionGenerator.generate({ grade, difficulty }), [round, grade, difficulty]); // eslint-disable-line react-hooks/exhaustive-deps
  const choices = useMemo(() => questionGenerator.generateChoices(q, 3), [q]);
  const pos = ropePosition(score, misses, timeLeft);
  const [trackW, setTrackW] = useState(300);
  const x = useSharedValue(0);

  useEffect(() => {
    x.value = withSpring((pos / MAX_PULL) * (trackW / 2 - 28), { damping: 9, stiffness: 120 });
    if (Math.abs(pos) >= MAX_PULL) finish();
  }, [pos, trackW, x, finish]);

  const flag = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <>
      <View style={styles.arena} onLayout={(e) => setTrackW(e.nativeEvent.layout.width)}>
        <Text style={styles.team}>🧒🧕{'\n'}Tim Kita</Text>
        <View style={styles.ropeWrap}>
          <View style={styles.rope} />
          <View style={styles.mid} />
          <Animated.Text style={[styles.flag, flag]}>🌙</Animated.Text>
        </View>
        <Text style={styles.team}>🤖👾{'\n'}Lawan</Text>
      </View>
      <Text style={styles.hint}>{pos > 1 ? 'Kita menang tarikan! 💪' : pos < -1 ? 'Lawan menarik! Cepat jawab! 😱' : 'Seimbang, ayo cepat!'}</Text>

      <View style={styles.q}>
        <Text style={styles.qText}>
          {q.operands[0]} {SIGN[q.operation]} {q.operands[1]} = ?
        </Text>
      </View>
      <Choices key={q.id} choices={choices} correct={q.answer} onCorrect={onCorrect} onWrong={onWrong} />
    </>
  );
}

export function TarikTambangBulanHijriah({ onExit }: GameProps) {
  return (
    <GameShell gameId="tarik-tambang-bulan-hijriah" emoji="🌙" title="Tarik Tambang Hijriah" timerSeconds={TOTAL_SECONDS}
      keyed={false} onExit={onExit} renderRound={(api) => <Round {...api} />} />
  );
}

const styles = StyleSheet.create({
  arena: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.lg, padding: spacing.sm },
  team: { fontSize: 18, fontWeight: '900', textAlign: 'center', width: 64, color: colors.text },
  ropeWrap: { flex: 1, height: 70, justifyContent: 'center', alignItems: 'center' },
  rope: { position: 'absolute', width: '100%', height: 8, backgroundColor: '#B08968', borderRadius: 4 },
  mid: { position: 'absolute', width: 4, height: 40, backgroundColor: colors.primary },
  flag: { fontSize: 40 },
  hint: { textAlign: 'center', fontSize: 17, fontWeight: '800', color: colors.accent },
  q: { backgroundColor: '#fff', borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center' },
  qText: { fontSize: 44, fontWeight: '900', color: colors.text },
});
