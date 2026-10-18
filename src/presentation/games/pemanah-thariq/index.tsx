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
import { generateArcheryRound } from './logic';
import type { ArcheryRound, ArcheryTarget } from './types';

function Round({ grade, difficulty, onCorrect, onWrong }: RoundApi) {
  const [roundData, setRoundData] = useState<ArcheryRound>(() => generateArcheryRound(grade, difficulty));
  const [selectedTarget, setSelectedTarget] = useState<ArcheryTarget | null>(null);
  const [shooting, setShooting] = useState(false);
  const [hitResult, setHitResult] = useState<'none' | 'bullseye' | 'miss'>('none');

  // Bow & Arrow animation shared values
  const bowPull = useSharedValue(0);
  const arrowY = useSharedValue(0);
  const arrowX = useSharedValue(0);
  const arrowOpacity = useSharedValue(1);
  const targetWobble = useSharedValue(0);
  const targetFloat = useSharedValue(0);

  // Floating gentle breeze effect for targets
  useEffect(() => {
    targetFloat.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1400 }),
        withTiming(8, { duration: 1400 })
      ),
      -1,
      true
    );
  }, [targetFloat]);

  const animatedTargets = useAnimatedStyle(() => ({
    transform: [{ translateY: targetFloat.value }],
  }));

  const animatedArrow = useAnimatedStyle(() => ({
    transform: [
      { translateX: arrowX.value },
      { translateY: arrowY.value },
    ],
    opacity: arrowOpacity.value,
  }));

  const animatedTargetBoard = useAnimatedStyle(() => ({
    transform: [{ rotate: `${targetWobble.value}deg` }],
  }));

  const handleShoot = (target: ArcheryTarget) => {
    if (shooting || hitResult !== 'none') return;
    setSelectedTarget(target);
    setShooting(true);

    // 1. Tension pull
    bowPull.value = withSequence(withTiming(-15, { duration: 180 }), withTiming(0, { duration: 60 }));
    SoundService.play('whoosh');

    // 2. Flight of the arrow towards target offset
    const targetOffsetX = target.xOffset * 3.5;
    arrowX.value = withTiming(targetOffsetX, { duration: 280 });
    arrowY.value = withTiming(-220, { duration: 280 }, (finished) => {
      if (finished) {
        // Impact vibration
        targetWobble.value = withSequence(
          withTiming(-8, { duration: 50 }),
          withTiming(8, { duration: 60 }),
          withTiming(-4, { duration: 50 }),
          withTiming(4, { duration: 50 }),
          withTiming(0, { duration: 40 })
        );
      }
    });

    // 3. Evaluation after arrow hits
    setTimeout(() => {
      if (target.isCorrect) {
        setHitResult('bullseye');
        SoundService.correct();
        setTimeout(onCorrect, 1000);
      } else {
        setHitResult('miss');
        SoundService.wrong();
        setTimeout(() => {
          // Reset arrow position for another shot
          arrowX.value = 0;
          arrowY.value = 0;
          setShooting(false);
          setHitResult('none');
          setSelectedTarget(null);
          onWrong();
        }, 900);
      }
    }, 320);
  };

  return (
    <View style={styles.container}>
      {/* Question Banner */}
      <View style={styles.promptCard}>
        <Text style={styles.promptHeader}>🎯 SASARAN BIDIKAN PASUKAN THARIQ</Text>
        <Text style={styles.promptText}>{roundData.questionPrompt}</Text>
        <Text style={styles.promptHint}>{roundData.questionHint}</Text>
      </View>

      {/* Archery Range Stage */}
      <View style={styles.stage}>
        {/* Sky / Desert Backdrop decoration */}
        <View style={styles.backdropClouds}>
          <Text style={styles.cloudText}>☁️      🏜️      ☁️</Text>
        </View>

        {/* Moving / Floating Targets Line */}
        <Animated.View style={[styles.targetsRow, animatedTargets, animatedTargetBoard]}>
          {roundData.targets.map((tgt) => {
            const isTargeted = selectedTarget?.id === tgt.id;
            return (
              <Pressable
                key={tgt.id}
                disabled={shooting}
                onPress={() => handleShoot(tgt)}
                style={[
                  styles.targetWrapper,
                  isTargeted && hitResult === 'bullseye' && styles.targetHitCorrect,
                  isTargeted && hitResult === 'miss' && styles.targetHitWrong,
                ]}
              >
                {/* Visual Target Rings */}
                <View style={styles.ringOuter}>
                  <View style={styles.ringMid}>
                    <View style={styles.ringBullseye}>
                      <Text style={styles.targetNum}>{tgt.label}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.tapToShootLabel}>BIDIK 🏹</Text>
              </Pressable>
            );
          })}
        </Animated.View>

        {/* Flying Arrow */}
        <Animated.View style={[styles.arrowContainer, animatedArrow]}>
          <Text style={styles.arrowIcon}>🔺</Text>
          <View style={styles.arrowShaft} />
          <Text style={styles.arrowFeather}>羽</Text>
        </Animated.View>

        {/* Bow and Archer Base */}
        <View style={styles.archerBase}>
          <View style={styles.bowString} />
          <Text style={styles.bowIcon}>🏹</Text>
          <Text style={styles.archerAvatar}>🧕 Pasukan Pemanah</Text>
        </View>

        {/* Bullseye Celebration / Feedback Splash */}
        {hitResult === 'bullseye' && (
          <Animated.View entering={BounceIn} style={styles.splashBannerSuccess}>
            <Text style={styles.splashBannerTitle}>💥 TEPAT SASARAN! BULLSEYE!</Text>
            <Text style={styles.splashBannerSub}>Masya Allah, bidikan sempurna!</Text>
          </Animated.View>
        )}

        {hitResult === 'miss' && (
          <Animated.View entering={FadeIn} style={styles.splashBannerMiss}>
            <Text style={styles.splashBannerTitleMiss}>⚠️ BELUM TEPAT!</Text>
            <Text style={styles.splashBannerSubMiss}>Atur sudut dan bidik lagi, bismillah!</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

export function PemanahThariq({ onExit }: GameProps) {
  return (
    <GameShell
      gameId="pemanah-thariq"
      emoji="🎯"
      title="Pemanah Pasukan Thariq"
      totalRounds={5}
      keyed={true}
      onExit={onExit}
      renderRound={(api) => <Round {...api} />}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.md },
  promptCard: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: '#FDE68A',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  promptHeader: { fontSize: 12, fontWeight: '900', color: '#D97706', letterSpacing: 1 },
  promptText: { fontSize: 36, fontWeight: '900', color: colors.text, marginVertical: 2 },
  promptHint: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  stage: {
    flex: 1,
    minHeight: 360,
    backgroundColor: '#FEF3C7',
    borderRadius: radius.xl,
    padding: spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#FCD34D',
  },
  backdropClouds: { position: 'absolute', top: 12, width: '100%', alignItems: 'center' },
  cloudText: { fontSize: 20, opacity: 0.6 },
  targetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 36,
  },
  targetWrapper: { alignItems: 'center', gap: 6 },
  ringOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#B91C1C',
    elevation: 4,
  },
  ringMid: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringBullseye: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetNum: { fontSize: 18, fontWeight: '900', color: '#FFFFFF' },
  tapToShootLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
    backgroundColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  targetHitCorrect: { transform: [{ scale: 1.15 }] },
  targetHitWrong: { opacity: 0.5 },
  arrowContainer: { position: 'absolute', bottom: 70, alignItems: 'center', zIndex: 10 },
  arrowIcon: { fontSize: 16, marginBottom: -4, color: '#B45309' },
  arrowShaft: { width: 5, height: 46, backgroundColor: '#78350F', borderRadius: 2 },
  arrowFeather: { fontSize: 12, marginTop: -4, color: '#D97706' },
  archerBase: { alignItems: 'center', paddingBottom: 10 },
  bowString: { position: 'absolute', width: 60, height: 2, backgroundColor: '#92400E', top: 20 },
  bowIcon: { fontSize: 48 },
  archerAvatar: { fontSize: 13, fontWeight: '800', color: '#78350F', marginTop: 4 },
  splashBannerSuccess: {
    position: 'absolute',
    top: '40%',
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: 'center',
    zIndex: 20,
    elevation: 8,
  },
  splashBannerTitle: { fontSize: 18, fontWeight: '900', color: '#fff' },
  splashBannerSub: { fontSize: 13, fontWeight: '700', color: '#E0E7FF' },
  splashBannerMiss: {
    position: 'absolute',
    top: '40%',
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: 'center',
    zIndex: 20,
    elevation: 8,
  },
  splashBannerTitleMiss: { fontSize: 18, fontWeight: '900', color: '#fff' },
  splashBannerSubMiss: { fontSize: 13, fontWeight: '700', color: '#FEE2E2' },
});
