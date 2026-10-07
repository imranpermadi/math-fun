import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  SlideInRight, useAnimatedStyle, useSharedValue, withSequence, withTiming,
} from 'react-native-reanimated';
import { GameShell, RoundApi } from '../../components/play/GameShell';
import { Instruction } from '../../components/play/Instruction';
import { SoundService } from '../../../core/sound/SoundService';
import { colors, radius, spacing } from '../../theme';
import type { GameProps } from '../types';
import { makeTrainRound } from './logic';

function Camel({ n, shakeKey, onPress }: { n: number; shakeKey: number; onPress: () => void }) {
  const sx = useSharedValue(0);
  useEffect(() => {
    if (shakeKey > 0) sx.value = withSequence(withTiming(-10, { duration: 50 }), withTiming(10, { duration: 80 }), withTiming(0, { duration: 60 }));
  }, [shakeKey, sx]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: sx.value }] }));
  return (
    <Animated.View style={style}>
      <Pressable onPress={onPress} style={styles.camel}>
        <Text style={styles.camelIcon}>🐪</Text>
        <View style={styles.badge}><Text style={styles.badgeText}>{n}</Text></View>
      </Pressable>
    </Animated.View>
  );
}

function Round({ grade, difficulty, onCorrect, onWrong }: RoundApi) {
  const [q] = useState(() => makeTrainRound(grade, difficulty));
  const [placed, setPlaced] = useState<number[]>([]);
  const [shake, setShake] = useState<Record<number, number>>({});
  const doneRef = useRef(false);

  const tap = (n: number) => {
    if (doneRef.current) return;
    const expected = q.sorted[placed.length];
    if (n === expected) {
      SoundService.pop();
      const next = [...placed, n];
      setPlaced(next);
      if (next.length === q.sorted.length) { doneRef.current = true; SoundService.play('whoosh'); setTimeout(onCorrect, 400); }
    } else {
      setShake((s) => ({ ...s, [n]: (s[n] ?? 0) + 1 }));
      onWrong();
    }
  };

  const remaining = q.numbers.filter((n) => !placed.includes(n));

  return (
    <>
      <Instruction text={q.order === 'asc' ? 'Susun kereta unta dari angka TERKECIL ke TERBESAR. Ketuk unta dengan urutan yang benar!' : 'Susun kereta unta dari angka TERBESAR ke TERKECIL. Ketuk unta dengan urutan yang benar!'} />

      <View style={styles.track}>
        <Text style={styles.engine}>🚂</Text>
        {q.sorted.map((_, i) => (
          <View key={i} style={styles.slot}>
            {placed[i] !== undefined && (
              <Animated.View entering={SlideInRight} style={styles.placed}>
                <Text style={styles.placedIcon}>🐪</Text>
                <Text style={styles.placedNum}>{placed[i]}</Text>
              </Animated.View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.herd}>
        {remaining.map((n) => <Camel key={n} n={n} shakeKey={shake[n] ?? 0} onPress={() => tap(n)} />)}
      </View>
    </>
  );
}

export function KeretaUntaBerhitung({ onExit }: GameProps) {
  return (
    <GameShell gameId="kereta-unta-berhitung" emoji="🐪" title="Kereta Unta" onExit={onExit}
      renderRound={(api) => <Round {...api} />} />
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', borderRadius: radius.lg, padding: spacing.sm, borderBottomWidth: 6, borderBottomColor: '#B08968' },
  engine: { fontSize: 34 },
  slot: { flex: 1, aspectRatio: 0.75, borderRadius: radius.sm, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.sky, alignItems: 'center', justifyContent: 'center' },
  placed: { alignItems: 'center' },
  placedIcon: { fontSize: 24 },
  placedNum: { fontSize: 16, fontWeight: '900', color: colors.primaryDark },
  herd: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'center', marginTop: spacing.md },
  camel: { width: 92, height: 92, borderRadius: radius.lg, backgroundColor: '#FFE8B0', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 5, borderBottomColor: '#E0B25A' },
  camelIcon: { fontSize: 44 },
  badge: { position: 'absolute', bottom: -8, backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 2 },
  badgeText: { color: '#fff', fontSize: 20, fontWeight: '900' },
});
