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
import { generateTowerRound } from './logic';
import type { TowerFoundation, TowerRound } from './types';

function Round({ grade, difficulty, onCorrect, onWrong }: RoundApi) {
  const [roundData, setRoundData] = useState<TowerRound>(() => generateTowerRound(grade, difficulty));
  const [selectedFoundation, setSelectedFoundation] = useState<TowerFoundation | null>(null);
  const [isDropping, setIsDropping] = useState(false);
  const [stackResult, setStackResult] = useState<'none' | 'perfect' | 'collapse'>('none');

  // Animation values
  const craneSwing = useSharedValue(0);
  const blockDropY = useSharedValue(0);
  const towerCushion = useSharedValue(0);
  const dustScale = useSharedValue(0);

  useEffect(() => {
    craneSwing.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 1100 }),
        withTiming(12, { duration: 1100 })
      ),
      -1,
      true
    );
  }, [craneSwing]);

  const animatedCrane = useAnimatedStyle(() => ({
    transform: [{ rotate: `${craneSwing.value}deg` }],
  }));

  const animatedBlock = useAnimatedStyle(() => ({
    transform: [{ translateY: blockDropY.value }],
  }));

  const animatedTower = useAnimatedStyle(() => ({
    transform: [{ translateY: towerCushion.value }],
  }));

  const animatedDust = useAnimatedStyle(() => ({
    transform: [{ scale: dustScale.value }],
    opacity: 1 - dustScale.value * 0.5,
  }));

  const handleDropBlock = (found: TowerFoundation) => {
    if (isDropping || stackResult !== 'none') return;
    setSelectedFoundation(found);
    setIsDropping(true);

    SoundService.play('whoosh');
    // Drop block rapidly from sky
    blockDropY.value = withTiming(140, { duration: 280 });

    setTimeout(() => {
      // Impact cushion on tower
      towerCushion.value = withSequence(
        withTiming(8, { duration: 60 }),
        withSpring(0, { damping: 8 })
      );
      dustScale.value = withSequence(
        withTiming(1.6, { duration: 220 }),
        withTiming(0, { duration: 10 })
      );

      // Outcome
      if (found.isCorrect) {
        setStackResult('perfect');
        SoundService.correct();
        setTimeout(onCorrect, 1000);
      } else {
        setStackResult('collapse');
        SoundService.wrong();
        setTimeout(() => {
          blockDropY.value = 0;
          setIsDropping(false);
          setStackResult('none');
          setSelectedFoundation(null);
          onWrong();
        }, 900);
      }
    }, 290);
  };

  return (
    <View style={styles.container}>
      {/* Blueprint Architecture Card */}
      <View style={styles.blueprintCard}>
        <View style={styles.badgeRow}>
          <Text style={styles.blueprintTag}>📐 CETAK BIRU ARSITEK MENARA</Text>
        </View>
        <Text style={styles.promptText}>{roundData.questionPrompt}</Text>
        <Text style={styles.promptHint}>{roundData.questionHint}</Text>
      </View>

      {/* Sky Construction Site */}
      <View style={styles.skyConstruction}>
        {/* Clouds Header */}
        <View style={styles.cloudsBar}>
          <Text style={styles.cloudsDecor}>☁️      🕌      ☁️</Text>
        </View>

        {/* Crane & Suspended Stone Block */}
        <Animated.View style={[styles.craneRig, animatedCrane]}>
          <View style={styles.craneArm} />
          <View style={styles.cableLine} />
          <Animated.View style={[styles.suspendedBlock, animatedBlock]}>
            <Text style={styles.blockEmoji}>🏛️</Text>
            <Text style={styles.blockShapeLabel}>{roundData.shapeName}</Text>
          </Animated.View>
        </Animated.View>

        {/* Impact Dust Puff */}
        <Animated.View style={[styles.dustCloud, animatedDust]}>
          <Text style={styles.dustEmoji}>💨 💥 💨</Text>
        </Animated.View>

        {/* Tower Body Cushion */}
        <Animated.View style={[styles.towerBase, animatedTower]}>
          <View style={styles.pillarRow}>
            <View style={styles.pillar} />
            <View style={styles.pillar} />
            <View style={styles.pillar} />
          </View>
          <Text style={styles.towerLabel}>Menara Tingkat Keagungan</Text>
        </Animated.View>

        {/* Foundations Selection Grid */}
        <View style={styles.foundationsWrap}>
          <Text style={styles.foundationsHeader}>Pilih Fondasi Nilai yang Pas:</Text>
          <View style={styles.foundationsRow}>
            {roundData.foundations.map((found) => {
              const isSelected = selectedFoundation?.id === found.id;
              return (
                <Pressable
                  key={found.id}
                  disabled={isDropping}
                  onPress={() => handleDropBlock(found)}
                  style={[
                    styles.foundBtn,
                    isSelected && stackResult === 'perfect' && styles.foundSuccess,
                    isSelected && stackResult === 'collapse' && styles.foundFailed,
                  ]}
                >
                  <Text style={styles.foundVal}>{found.label}</Text>
                  <Text style={styles.dropActionLabel}>PASANG 🏗️</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Result Toast */}
        {stackResult === 'perfect' && (
          <Animated.View entering={BounceIn} style={styles.toastWin}>
            <Text style={styles.toastWinTitle}>✨ KOKOH SEMPURNA!</Text>
            <Text style={styles.toastWinSub}>{roundData.formulaExplanation}</Text>
          </Animated.View>
        )}

        {stackResult === 'collapse' && (
          <Animated.View entering={FadeIn} style={styles.toastLoss}>
            <Text style={styles.toastLossTitle}>⚠️ FONDASI BELUM PAS!</Text>
            <Text style={styles.toastLossSub}>Hitung kembali luas atau keliling bangun datar!</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

export function MenaraArsitekKhazanah({ onExit }: GameProps) {
  return (
    <GameShell
      gameId="menara-arsitek-khazanah"
      emoji="🏗️"
      title="Menara Arsitek Khazanah"
      totalRounds={5}
      keyed={true}
      onExit={onExit}
      renderRound={(api) => <Round {...api} />}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.md },
  blueprintCard: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: '#93C5FD',
    elevation: 3,
  },
  badgeRow: { flexDirection: 'row' },
  blueprintTag: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1E40AF',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
    letterSpacing: 1,
  },
  promptText: { fontSize: 20, fontWeight: '900', color: colors.text, marginVertical: 2, textAlign: 'center' },
  promptHint: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  skyConstruction: {
    flex: 1,
    minHeight: 390,
    backgroundColor: '#BAE6FD',
    borderRadius: radius.xl,
    padding: spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 3,
    borderColor: '#0284C7',
  },
  cloudsBar: { width: '100%', alignItems: 'center', paddingTop: 2 },
  cloudsDecor: { fontSize: 18, opacity: 0.7 },
  craneRig: { alignItems: 'center', zIndex: 6 },
  craneArm: { width: 120, height: 6, backgroundColor: '#EA580C', borderRadius: 3 },
  cableLine: { width: 2, height: 26, backgroundColor: '#475569' },
  suspendedBlock: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#94A3B8',
    elevation: 4,
  },
  blockEmoji: { fontSize: 28 },
  blockShapeLabel: { fontSize: 11, fontWeight: '800', color: '#1E293B' },
  dustCloud: { position: 'absolute', bottom: 130, zIndex: 5 },
  dustEmoji: { fontSize: 24 },
  towerBase: {
    width: '80%',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.lg,
    padding: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#64748B',
    zIndex: 4,
  },
  pillarRow: { flexDirection: 'row', gap: 24, marginVertical: 4 },
  pillar: { width: 12, height: 36, backgroundColor: '#CBD5E1', borderRadius: 2 },
  towerLabel: { fontSize: 12, fontWeight: '800', color: '#475569' },
  foundationsWrap: { width: '100%', gap: 6, zIndex: 6 },
  foundationsHeader: { fontSize: 12, fontWeight: '800', color: '#0369A1', textAlign: 'center' },
  foundationsRow: { flexDirection: 'row', justifyContent: 'space-around', gap: 6 },
  foundBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: '#38BDF8',
    elevation: 3,
  },
  foundVal: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  dropActionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  foundSuccess: { backgroundColor: '#D1FAE5', borderColor: '#10B981' },
  foundFailed: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
  toastWin: {
    position: 'absolute',
    top: '40%',
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
    top: '40%',
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
