import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { BounceIn, ZoomIn } from 'react-native-reanimated';
import { GameShell, RoundApi } from '../../components/play/GameShell';
import { Choices } from '../../components/play/Choices';
import { Instruction } from '../../components/play/Instruction';
import { SoundService } from '../../../core/sound/SoundService';
import { numberChoices } from '../../../core/utils/random';
import { colors, radius, spacing } from '../../theme';
import type { GameProps } from '../types';
import { makeStarRound } from './logic';

function Round({ difficulty, onCorrect, onWrong }: RoundApi) {
  const [q] = useState(() => makeStarRound(difficulty));
  const [choices] = useState(() => numberChoices(q.total, 3, Math.max(2, q.perJar)));
  const [filled, setFilled] = useState<boolean[]>(() => Array(q.jars).fill(false));
  const count = filled.filter(Boolean).length;
  const allDone = count === q.jars;

  const fill = (i: number) => {
    if (filled[i]) return;
    SoundService.pop();
    setFilled((f) => f.map((v, k) => (k === i ? true : v)));
  };

  return (
    <>
      <Instruction
        text={allDone ? `${q.jars} × ${q.perJar} = ? Berapa semua bintang pahala yang terkumpul?` : `Ada ${q.jars} toples. Setiap toples diisi ${q.perJar} bintang pahala. Ketuk setiap toples untuk mengisinya!`}
      />

      <View style={styles.shelf}>
        {filled.map((on, i) => (
          <Pressable key={i} onPress={() => fill(i)} style={[styles.jar, on && styles.jarFull]}>
            <Text style={styles.jarIcon}>{on ? '🏺' : '🫙'}</Text>
            <View style={styles.stars}>
              {on && Array.from({ length: q.perJar }, (_, k) => (
                <Animated.Text key={k} entering={BounceIn.delay(k * 90)} style={styles.star}>⭐</Animated.Text>
              ))}
            </View>
            <Text style={styles.jarLabel}>{on ? `${q.perJar}` : 'Ketuk!'}</Text>
          </Pressable>
        ))}
      </View>

      <Animated.Text key={count} entering={ZoomIn} style={styles.equation}>
        {count === 0 ? ' ' : Array.from({ length: count }, () => q.perJar).join(' + ')}
        {count > 0 && count < q.jars ? '  …' : ''}
      </Animated.Text>

      {allDone && <Choices choices={choices} correct={q.total} onCorrect={onCorrect} onWrong={onWrong} />}
    </>
  );
}

export function KumpulkanBintangPahala({ onExit }: GameProps) {
  return (
    <GameShell gameId="kumpulkan-bintang-pahala" emoji="⭐" title="Bintang Pahala" onExit={onExit}
      renderRound={(api) => <Round {...api} />} />
  );
}

const styles = StyleSheet.create({
  shelf: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  jar: { width: '30%', minHeight: 130, backgroundColor: '#fff', borderRadius: radius.lg, borderWidth: 3, borderStyle: 'dashed', borderColor: colors.secondary, alignItems: 'center', padding: 6 },
  jarFull: { borderStyle: 'solid', backgroundColor: '#FFFBEA' },
  jarIcon: { fontSize: 38 },
  stars: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', minHeight: 40 },
  star: { fontSize: 17 },
  jarLabel: { marginTop: 'auto', fontSize: 18, fontWeight: '900', color: colors.accent },
  equation: { textAlign: 'center', fontSize: 22, fontWeight: '900', color: colors.primaryDark },
});
