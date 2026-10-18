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
import { generateDefenseRound } from './logic';
import type { DefenseRound, TowerCatapult } from './types';

function Round({ grade, difficulty, onCorrect, onWrong }: RoundApi) {
  const [roundData, setRoundData] = useState<DefenseRound>(() => generateDefenseRound(grade, difficulty));
  const [selectedCatapult, setSelectedCatapult] = useState<TowerCatapult | null>(null);
  const [isFiring, setIsFiring] = useState(false);
  const [defenseResult, setDefenseResult] = useState<'none' | 'cleared' | 'breached'>('none');

  // Animation values
  const enemyWobble = useSharedValue(0);
  const enemyKnockback = useSharedValue(0);
  const projectileY = useSharedValue(0);
  const projectileX = useSharedValue(0);
  const explosionScale = useSharedValue(0);

  useEffect(() => {
    enemyWobble.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 800 }),
        withTiming(6, { duration: 800 })
      ),
      -1,
      true
    );
  }, [enemyWobble]);

  const animatedEnemy = useAnimatedStyle(() => ({
    transform: [
      { translateX: enemyWobble.value },
      { translateY: enemyKnockback.value },
    ],
  }));

  const animatedProjectile = useAnimatedStyle(() => ({
    transform: [
      { translateX: projectileX.value },
      { translateY: projectileY.value },
    ],
    opacity: projectileY.value < 0 ? 1 : 0,
  }));

  const animatedExplosion = useAnimatedStyle(() => ({
    transform: [{ scale: explosionScale.value }],
    opacity: explosionScale.value > 0 ? 1 : 0,
  }));

  const handleFireCatapult = (catapult: TowerCatapult, laneIdx: number) => {
    if (isFiring || defenseResult !== 'none') return;
    setSelectedCatapult(catapult);
    setIsFiring(true);

    // 1. Launch catapult projectile
    SoundService.play('whoosh');
    const targetOffset = (1 - laneIdx) * 60; // Offset trajectory towards enemy center
    projectileX.value = withTiming(targetOffset, { duration: 280 });
    projectileY.value = withTiming(-170, { duration: 280 });

    setTimeout(() => {
      // 2. Explosion & Knockback
      explosionScale.value = withSequence(
        withTiming(1.7, { duration: 240 }),
        withTiming(0, { duration: 20 })
      );
      projectileY.value = 0;
      projectileX.value = 0;

      if (catapult.isCorrect) {
        enemyKnockback.value = withSequence(
          withTiming(-20, { duration: 100 }),
          withSpring(0, { damping: 9 })
        );
        setDefenseResult('cleared');
        SoundService.correct();
        setTimeout(onCorrect, 1000);
      } else {
        setDefenseResult('breached');
        SoundService.wrong();
        setTimeout(() => {
          setIsFiring(false);
          setDefenseResult('none');
          setSelectedCatapult(null);
          onWrong();
        }, 900);
      }
    }, 290);
  };

  return (
    <View style={styles.container}>
      {/* Tactical Battle Plan Card */}
      <View style={styles.tacticalCard}>
        <View style={styles.badgeRow}>
          <Text style={styles.badgeText}>🛡️ KABATAKU PERTAHANAN BENTENG</Text>
        </View>
        <Text style={styles.promptText}>{roundData.questionPrompt}</Text>
        <Text style={styles.promptHint}>{roundData.questionHint}</Text>
      </View>

      {/* Battlefield Castle Arena */}
      <View style={styles.battleArena}>
        {/* Sky / Moonlit Fortress Horizon */}
        <View style={styles.battleSky}>
          <Text style={styles.skyDecor}>🌙  🏰 BENTENG KOTA HIJRAH 🏰</Text>
        </View>

        {/* Approaching Enemy Wave */}
        <Animated.View style={[styles.enemyWaveBox, animatedEnemy]}>
          {/* Enemy HP Bar */}
          <View style={styles.hpBarContainer}>
            <View
              style={[
                styles.hpBarFill,
                { width: defenseResult === 'cleared' ? '0%' : '100%' },
              ]}
            />
          </View>
          <Text style={styles.enemyEmoji}>{roundData.enemyEmoji}</Text>
          <Text style={styles.enemyNameTag}>{roundData.enemyName}</Text>
        </Animated.View>

        {/* Flying Catapult Projectile */}
        <Animated.View style={[styles.projectileWrap, animatedProjectile]}>
          <Text style={styles.projectileIcon}>☄️</Text>
        </Animated.View>

        {/* Explosion Burst */}
        <Animated.View style={[styles.explosionWrap, animatedExplosion]}>
          <Text style={styles.explosionIcon}>💥 🔥 💥</Text>
        </Animated.View>

        {/* Castle Wall & 3 Catapult Towers */}
        <View style={styles.castleWallBox}>
          <View style={styles.wallBattlements}>
            <Text style={styles.battlementBrick}>🧱🧱🧱🧱🧱🧱🧱🧱🧱</Text>
          </View>
          <View style={styles.catapultRow}>
            {roundData.catapults.map((cat, idx) => {
              const isSelected = selectedCatapult?.id === cat.id;
              const typeIcon = cat.towerType === 'fire' ? '🔥' : cat.towerType === 'ice' ? '❄️' : '🪨';
              return (
                <Pressable
                  key={cat.id}
                  disabled={isFiring}
                  onPress={() => handleFireCatapult(cat, idx)}
                  style={[
                    styles.catapultBtn,
                    isSelected && defenseResult === 'cleared' && styles.catapultWin,
                    isSelected && defenseResult === 'breached' && styles.catapultLoss,
                  ]}
                >
                  <Text style={styles.catapultTypeIcon}>{typeIcon}</Text>
                  <Text style={styles.catapultVal}>{cat.label}</Text>
                  <Text style={styles.launchActionTag}>LONTAR 🏹</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Result Toast */}
        {defenseResult === 'cleared' && (
          <Animated.View entering={BounceIn} style={styles.toastWin}>
            <Text style={styles.toastWinTitle}>💥 MUSUH DIKALAHKAN!</Text>
            <Text style={styles.toastWinSub}>{roundData.pemdasExplanation}</Text>
          </Animated.View>
        )}

        {defenseResult === 'breached' && (
          <Animated.View entering={FadeIn} style={styles.toastLoss}>
            <Text style={styles.toastLossTitle}>⚠️ URUTAN HITUNG KELIRU!</Text>
            <Text style={styles.toastLossSub}>Ingat urutan KABATAKU: Kurung, Kali, Bagi, Tambah, Kurang!</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

export function BentengPertahananHijrah({ onExit }: GameProps) {
  return (
    <GameShell
      gameId="benteng-pertahanan-hijrah"
      emoji="🏰"
      title="Benteng Pertahanan Angka"
      totalRounds={5}
      keyed={true}
      onExit={onExit}
      renderRound={(api) => <Round {...api} />}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.md },
  tacticalCard: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: '#FCA5A5',
    elevation: 3,
  },
  badgeRow: { flexDirection: 'row' },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#B91C1C',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
    letterSpacing: 1,
  },
  promptText: { fontSize: 24, fontWeight: '900', color: colors.text, marginVertical: 2, textAlign: 'center' },
  promptHint: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  battleArena: {
    flex: 1,
    minHeight: 390,
    backgroundColor: '#450A0A',
    borderRadius: radius.xl,
    padding: spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 3,
    borderColor: '#7F1D1D',
  },
  battleSky: { width: '100%', alignItems: 'center', paddingTop: 2 },
  skyDecor: { fontSize: 13, fontWeight: '800', color: '#FCA5A5', opacity: 0.9 },
  enemyWaveBox: { alignItems: 'center', gap: 4, paddingTop: 10, zIndex: 4 },
  hpBarContainer: {
    width: 90,
    height: 8,
    backgroundColor: '#78350F',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  hpBarFill: { height: '100%', backgroundColor: '#EF4444' },
  enemyEmoji: { fontSize: 50 },
  enemyNameTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FEE2E2',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  projectileWrap: { position: 'absolute', bottom: 100, zIndex: 7 },
  projectileIcon: { fontSize: 32 },
  explosionWrap: { position: 'absolute', top: 50, zIndex: 8 },
  explosionIcon: { fontSize: 32 },
  castleWallBox: { width: '100%', gap: 4, zIndex: 5 },
  wallBattlements: { alignItems: 'center', opacity: 0.8 },
  battlementBrick: { fontSize: 13, letterSpacing: 2 },
  catapultRow: { flexDirection: 'row', justifyContent: 'space-around', gap: 6 },
  catapultBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: '#F87171',
    elevation: 4,
  },
  catapultTypeIcon: { fontSize: 20 },
  catapultVal: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  launchActionTag: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  catapultWin: { backgroundColor: '#D1FAE5', borderColor: '#10B981' },
  catapultLoss: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
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
