import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  BounceIn,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { GameShell, RoundApi } from '../../components/play/GameShell';
import { SoundService } from '../../../core/sound/SoundService';
import { colors, radius, spacing } from '../../theme';
import type { GameProps } from '../types';
import { generateRhythmRound } from './logic';
import type { RhythmDrum, RhythmRound } from './types';

function Round({ grade, difficulty, onCorrect, onWrong }: RoundApi) {
  const [roundData, setRoundData] = useState<RhythmRound>(() => generateRhythmRound(grade, difficulty));
  const [selectedDrum, setSelectedDrum] = useState<RhythmDrum | null>(null);
  const [isStriking, setIsStriking] = useState(false);
  const [rhythmResult, setRhythmResult] = useState<'none' | 'perfect' | 'miss'>('none');

  // Animation values
  const noteDropY = useSharedValue(0);
  const drumScale0 = useSharedValue(1);
  const drumScale1 = useSharedValue(1);
  const drumScale2 = useSharedValue(1);
  const ringScale = useSharedValue(0);
  const stagePulse = useSharedValue(1);

  useEffect(() => {
    noteDropY.value = withRepeat(
      withTiming(150, { duration: 1400 }),
      -1,
      false
    );
    stagePulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 400 }),
        withTiming(0.95, { duration: 400 })
      ),
      -1,
      true
    );
  }, [noteDropY, stagePulse]);

  const animatedNote = useAnimatedStyle(() => ({
    transform: [{ translateY: noteDropY.value }],
  }));

  const animatedStage = useAnimatedStyle(() => ({
    transform: [{ scale: stagePulse.value }],
  }));

  const animatedRing = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringScale.value > 0 ? 1 - ringScale.value * 0.5 : 0,
  }));

  const animatedDrum0 = useAnimatedStyle(() => ({ transform: [{ scale: drumScale0.value }] }));
  const animatedDrum1 = useAnimatedStyle(() => ({ transform: [{ scale: drumScale1.value }] }));
  const animatedDrum2 = useAnimatedStyle(() => ({ transform: [{ scale: drumScale2.value }] }));

  const drumAnimValues = [drumScale0, drumScale1, drumScale2];

  const handleStrikeDrum = (drum: RhythmDrum, laneIdx: number) => {
    if (isStriking || rhythmResult !== 'none') return;
    setSelectedDrum(drum);
    setIsStriking(true);

    // 1. Drum bounce spring
    SoundService.pop();
    const anim = drumAnimValues[laneIdx];
    if (anim) {
      anim.value = withSequence(
        withTiming(0.8, { duration: 60 }),
        withSpring(1, { damping: 6, stiffness: 200 })
      );
    }

    // 2. Beat ring explosion
    ringScale.value = withSequence(
      withTiming(1.8, { duration: 250 }),
      withTiming(0, { duration: 20 })
    );

    // 3. Evaluation
    setTimeout(() => {
      if (drum.isCorrect) {
        setRhythmResult('perfect');
        SoundService.correct();
        setTimeout(onCorrect, 1000);
      } else {
        setRhythmResult('miss');
        SoundService.wrong();
        setTimeout(() => {
          setIsStriking(false);
          setRhythmResult('none');
          setSelectedDrum(null);
          onWrong();
        }, 900);
      }
    }, 280);
  };

  return (
    <View style={styles.container}>
      {/* Musical Notation Header */}
      <View style={styles.musicHeaderCard}>
        <View style={styles.musicBadge}>
          <Text style={styles.musicBadgeText}>🥁 FESTIVAL TABUH BEDUG IDUL FITRI</Text>
        </View>
        <Text style={styles.promptText}>{roundData.questionPrompt}</Text>
        <Text style={styles.promptHint}>{roundData.questionHint}</Text>
      </View>

      {/* Rhythm Concert Stage */}
      <View style={styles.concertStage}>
        {/* Spotlights and Stage Banner */}
        <Animated.View style={[styles.stageHeader, animatedStage]}>
          <Text style={styles.spotlightText}>✨  🌟  GEMA NADA KHAZANAH  🌟  ✨</Text>
        </Animated.View>

        {/* Falling Rhythm Beat Note */}
        <Animated.View style={[styles.fallingNoteWrap, animatedNote]}>
          <Text style={styles.noteEmoji}>🎵</Text>
        </Animated.View>

        {/* Beat Strike Line / Target Ring */}
        <View style={styles.hitLine}>
          <Text style={styles.hitLineLabel}>GARIS KETUKAN NADA</Text>
        </View>

        {/* Ring Shockwave Burst */}
        <Animated.View style={[styles.shockwaveRing, animatedRing]}>
          <Text style={styles.shockwaveIcon}>💥 🎶 💥</Text>
        </Animated.View>

        {/* 3 Traditional Bedug Drums */}
        <View style={styles.drumsRow}>
          {roundData.drums.map((drum, idx) => {
            const isSelected = selectedDrum?.id === drum.id;
            const animStyle = idx === 0 ? animatedDrum0 : idx === 1 ? animatedDrum1 : animatedDrum2;

            return (
              <Animated.View key={drum.id} style={animStyle}>
                <Pressable
                  disabled={isStriking}
                  onPress={() => handleStrikeDrum(drum, idx)}
                  style={[
                    styles.drumCard,
                    isSelected && rhythmResult === 'perfect' && styles.drumWin,
                    isSelected && rhythmResult === 'miss' && styles.drumLoss,
                  ]}
                >
                  <Text style={styles.drumEmoji}>🪘</Text>
                  <View style={styles.drumValueBox}>
                    <Text style={styles.drumValueText}>{drum.label}</Text>
                  </View>
                  <Text style={styles.tapBeatAction}>TABUH! 🎵</Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {/* Result Toast */}
        {rhythmResult === 'perfect' && (
          <Animated.View entering={BounceIn} style={styles.toastWin}>
            <Text style={styles.toastWinTitle}>🔥 PERFECT BEAT! RITME TEPAT!</Text>
            <Text style={styles.toastWinSub}>Gema takbir bergema merdu masya Allah!</Text>
          </Animated.View>
        )}

        {rhythmResult === 'miss' && (
          <Animated.View entering={FadeIn} style={styles.toastLoss}>
            <Text style={styles.toastLossTitle}>⚠️ KETUKAN BELUM PAS!</Text>
            <Text style={styles.toastLossSub}>Dengarkan irama dan hitung kembali angkanya!</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

export function RitmeBedugBerkah({ onExit }: GameProps) {
  return (
    <GameShell
      gameId="ritme-bedug-berkah"
      emoji="🥁"
      title="Ritme Bedug Festival"
      totalRounds={5}
      keyed={true}
      onExit={onExit}
      renderRound={(api) => <Round {...api} />}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.md },
  musicHeaderCard: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: '#F472B6',
    elevation: 3,
  },
  musicBadge: {
    backgroundColor: '#DB2777',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  musicBadgeText: { fontSize: 11, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  promptText: { fontSize: 22, fontWeight: '900', color: colors.text, marginVertical: 2, textAlign: 'center' },
  promptHint: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  concertStage: {
    flex: 1,
    minHeight: 390,
    backgroundColor: '#831843',
    borderRadius: radius.xl,
    padding: spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 3,
    borderColor: '#BE185D',
  },
  stageHeader: { width: '100%', alignItems: 'center', paddingTop: 2 },
  spotlightText: { fontSize: 12, fontWeight: '900', color: '#FCE7F3', letterSpacing: 1 },
  fallingNoteWrap: { position: 'absolute', top: 30, zIndex: 4 },
  noteEmoji: { fontSize: 32 },
  hitLine: {
    position: 'absolute',
    top: 170,
    width: '90%',
    height: 4,
    backgroundColor: '#F472B6',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#F472B6',
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  hitLineLabel: { fontSize: 9, fontWeight: '900', color: '#FDF2F8', marginTop: -20 },
  shockwaveRing: { position: 'absolute', top: 155, zIndex: 6 },
  shockwaveIcon: { fontSize: 28 },
  drumsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', gap: 6, zIndex: 5 },
  drumCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: '#FBCFE8',
    elevation: 4,
    minWidth: 92,
  },
  drumEmoji: { fontSize: 32 },
  drumValueBox: {
    backgroundColor: '#831843',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
    minWidth: 50,
    alignItems: 'center',
  },
  drumValueText: { fontSize: 18, fontWeight: '900', color: '#FDF2F8' },
  tapBeatAction: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    backgroundColor: '#DB2777',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  drumWin: { backgroundColor: '#D1FAE5', borderColor: '#10B981' },
  drumLoss: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
  toastWin: {
    position: 'absolute',
    top: '38%',
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: 'center',
    zIndex: 20,
    elevation: 8,
  },
  toastWinTitle: { fontSize: 17, fontWeight: '900', color: '#fff' },
  toastWinSub: { fontSize: 12, fontWeight: '700', color: '#D1FAE5', marginTop: 2, textAlign: 'center' },
  toastLoss: {
    position: 'absolute',
    top: '38%',
    backgroundColor: '#DC2626',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: 'center',
    zIndex: 20,
    elevation: 8,
  },
  toastLossTitle: { fontSize: 17, fontWeight: '900', color: '#fff' },
  toastLossSub: { fontSize: 12, fontWeight: '700', color: '#FEE2E2', marginTop: 2, textAlign: 'center' },
});
