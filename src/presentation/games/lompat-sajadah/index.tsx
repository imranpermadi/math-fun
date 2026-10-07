import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  BounceIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { GameShell, RoundApi } from '../../components/play/GameShell';
import { Choices } from '../../components/play/Choices';
import { Instruction } from '../../components/play/Instruction';
import { SoundService } from '../../../core/sound/SoundService';
import { numberChoices } from '../../../core/utils/random';
import { colors, radius, spacing } from '../../theme';
import type { GameProps } from '../types';
import { makeSkipRound } from './logic';

const TILE_COLORS = [colors.primary, colors.sky, colors.pink, colors.secondary, colors.purple, colors.accent];

function Round({ grade, onCorrect, onWrong }: RoundApi) {
  const { width } = useWindowDimensions();
  const [q] = useState(() => makeSkipRound(grade));
  const [choices] = useState(() => numberChoices(q.answer, 3, q.step));
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const tileW = (width - spacing.md * 2 - 6 * 6) / 6;
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  useEffect(() => {
    x.value = withSpring(pos * (tileW + 6), { damping: 14 });
    if (pos > 0) y.value = withSequence(withTiming(-38, { duration: 160 }), withTiming(0, { duration: 160 }));
  }, [pos, tileW, x, y]);

  const kid = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }, { translateY: y.value }] }));

  const hop = () => {
    setRevealed(true);
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setPos(i);
      SoundService.play('whoosh');
      if (i >= 5) {
        clearInterval(t);
        setTimeout(onCorrect, 400);
      }
    }, 380);
  };

  return (
    <>
      <Instruction text={`Ayo lompat sajadah! Setiap lompatan naik ${q.step}. Berapa angka di sajadah yang kosong?`} />
      <View style={styles.stage}>
        <Animated.Text style={[styles.kid, { width: tileW }, kid]}>🧒</Animated.Text>
        <View style={styles.row}>
          {q.seq.map((n, i) => (
            <View
              key={i}
              style={[
                styles.tile,
                {
                  width: tileW,
                  backgroundColor: i === 5 && revealed ? '#2E9E6B' : TILE_COLORS[i % TILE_COLORS.length],
                },
                i === 5 && revealed && styles.revealedTile,
              ]}
            >
              {i === 5 && revealed ? (
                <Animated.Text entering={BounceIn.springify()} style={[styles.tileText, { color: '#FFE600' }]}>
                  {n}
                </Animated.Text>
              ) : (
                <Text style={styles.tileText}>{i === 5 && !revealed ? '?' : n}</Text>
              )}
            </View>
          ))}
        </View>
        <Text style={styles.hint}>+{q.step}  +{q.step}  +{q.step}  +{q.step}  +{q.step}</Text>
      </View>
      <Choices choices={choices} correct={q.answer} onCorrect={hop} onWrong={onWrong} />
    </>
  );
}

export function LompatSajadah({ onExit }: GameProps) {
  return (
    <GameShell gameId="lompat-sajadah" emoji="🕌" title="Lompat Sajadah" onExit={onExit}
      renderRound={(api) => <Round {...api} />} />
  );
}

const styles = StyleSheet.create({
  stage: { backgroundColor: '#fff', borderRadius: radius.lg, padding: spacing.md, paddingTop: 56, gap: 6 },
  kid: { position: 'absolute', top: 10, left: spacing.md, fontSize: 34, textAlign: 'center' },
  row: { flexDirection: 'row', gap: 6 },
  tile: { aspectRatio: 0.8, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 5, borderBottomColor: 'rgba(0,0,0,0.2)' },
  tileText: { fontSize: 22, fontWeight: '900', color: '#fff' },
  revealedTile: {
    borderWidth: 3,
    borderColor: '#FFE600',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  hint: { textAlign: 'center', color: colors.textMuted, fontWeight: '700', fontSize: 13 },
});
