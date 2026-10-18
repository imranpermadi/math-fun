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
import { generateRallyRound } from './logic';
import type { RallyGate, RallyRound } from './types';

function Round({ grade, difficulty, onCorrect, onWrong }: RoundApi) {
  const [roundData, setRoundData] = useState<RallyRound>(() => generateRallyRound(grade, difficulty));
  const [selectedGate, setSelectedGate] = useState<RallyGate | null>(null);
  const [isDashing, setIsDashing] = useState(false);
  const [raceResult, setRaceResult] = useState<'none' | 'turbo' | 'crash'>('none');

  // Animation values
  const carX = useSharedValue(0);
  const carY = useSharedValue(0);
  const nitroScale = useSharedValue(0);
  const roadScroll = useSharedValue(0);
  const rpmNeedle = useSharedValue(0);

  useEffect(() => {
    roadScroll.value = withRepeat(
      withTiming(40, { duration: 400 }),
      -1,
      false
    );
    rpmNeedle.value = withRepeat(
      withSequence(
        withTiming(15, { duration: 600 }),
        withTiming(-15, { duration: 600 })
      ),
      -1,
      true
    );
  }, [roadScroll, rpmNeedle]);

  const animatedCar = useAnimatedStyle(() => ({
    transform: [
      { translateX: carX.value },
      { translateY: carY.value },
    ],
  }));

  const animatedNitro = useAnimatedStyle(() => ({
    transform: [{ scale: nitroScale.value }],
    opacity: nitroScale.value,
  }));

  const animatedRoad = useAnimatedStyle(() => ({
    transform: [{ translateY: roadScroll.value }],
  }));

  const animatedNeedle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rpmNeedle.value}deg` }],
  }));

  const handleDriveToGate = (gate: RallyGate) => {
    if (isDashing || raceResult !== 'none') return;
    setSelectedGate(gate);
    setIsDashing(true);

    // 1. Shift lane: -1 (left -100), 0 (center 0), 1 (right 100)
    const targetLaneX = gate.lane * 100;
    carX.value = withSpring(targetLaneX, { damping: 12 });
    SoundService.play('whoosh');

    // 2. Dash forward towards the gate
    setTimeout(() => {
      nitroScale.value = withSequence(
        withTiming(1.6, { duration: 250 }),
        withTiming(0, { duration: 50 })
      );
      carY.value = withTiming(-140, { duration: 280 });

      // 3. Outcome
      setTimeout(() => {
        if (gate.isCorrect) {
          setRaceResult('turbo');
          SoundService.correct();
          setTimeout(onCorrect, 1000);
        } else {
          setRaceResult('crash');
          SoundService.wrong();
          setTimeout(() => {
            carX.value = 0;
            carY.value = 0;
            setIsDashing(false);
            setRaceResult('none');
            setSelectedGate(null);
            onWrong();
          }, 900);
        }
      }, 300);
    }, 180);
  };

  return (
    <View style={styles.container}>
      {/* Race Navigation HUD */}
      <View style={styles.hudCard}>
        <View style={styles.hudBadge}>
          <Text style={styles.hudBadgeText}>🏎️ SAFARI RALLY OASIS MADINAH</Text>
        </View>
        <Text style={styles.promptText}>{roundData.questionPrompt}</Text>
        <Text style={styles.promptHint}>{roundData.questionHint}</Text>
      </View>

      {/* 3-Lane Desert Track Arena */}
      <View style={styles.trackArena}>
        {/* Animated Speedometer in Corner */}
        <View style={styles.speedoBox}>
          <Text style={styles.speedoLabel}>TURBO RPM</Text>
          <Animated.Text style={[styles.speedoNeedle, animatedNeedle]}>🧭</Animated.Text>
        </View>

        {/* 3 Turbo Checkpoint Gates */}
        <View style={styles.gatesRow}>
          {roundData.gates.map((gate) => {
            const isTargeted = selectedGate?.id === gate.id;
            return (
              <Pressable
                key={gate.id}
                disabled={isDashing}
                onPress={() => handleDriveToGate(gate)}
                style={[
                  styles.gateCard,
                  isTargeted && raceResult === 'turbo' && styles.gateTurboActivated,
                  isTargeted && raceResult === 'crash' && styles.gateBlocked,
                ]}
              >
                <View style={styles.gateArch}>
                  <Text style={styles.gateTag}>GERBANG {gate.lane === -1 ? 'L' : gate.lane === 0 ? 'M' : 'R'}</Text>
                  <Text style={styles.gateValue}>{gate.label}</Text>
                </View>
                <Text style={styles.enterLaneBtn}>MASUK 🏁</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Desert Road Lanes with scrolling dashed stripes */}
        <Animated.View style={[styles.roadStripes, animatedRoad]}>
          <View style={styles.stripeColumn}>
            <Text style={styles.stripeChar}>|</Text>
            <Text style={styles.stripeChar}>|</Text>
            <Text style={styles.stripeChar}>|</Text>
            <Text style={styles.stripeChar}>|</Text>
          </View>
          <View style={styles.stripeColumn}>
            <Text style={styles.stripeChar}>|</Text>
            <Text style={styles.stripeChar}>|</Text>
            <Text style={styles.stripeChar}>|</Text>
            <Text style={styles.stripeChar}>|</Text>
          </View>
        </Animated.View>

        {/* Rally Buggy Car */}
        <Animated.View style={[styles.carContainer, animatedCar]}>
          <Animated.View style={[styles.nitroFire, animatedNitro]}>
            <Text style={styles.nitroText}>🔥 💨</Text>
          </Animated.View>
          <Text style={styles.carEmoji}>🏎️</Text>
          <Text style={styles.carShadow}>⬛</Text>
        </Animated.View>

        {/* Result Toast */}
        {raceResult === 'turbo' && (
          <Animated.View entering={BounceIn} style={styles.toastTurbo}>
            <Text style={styles.toastTurboTitle}>⚡ TURBO BOOST! MENGEBUT MAJU!</Text>
            <Text style={styles.toastTurboSub}>{roundData.formulaContext}</Text>
          </Animated.View>
        )}

        {raceResult === 'crash' && (
          <Animated.View entering={FadeIn} style={styles.toastCrash}>
            <Text style={styles.toastCrashTitle}>⚠️ GERBANG TERTUTUP!</Text>
            <Text style={styles.toastCrashSub}>Periksa kembali rumus kecepatan & jarak!</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

export function SafariRallyGurun({ onExit }: GameProps) {
  return (
    <GameShell
      gameId="safari-rally-gurun"
      emoji="🏎️"
      title="Safari Rally Gurun Pasir"
      totalRounds={5}
      keyed={true}
      onExit={onExit}
      renderRound={(api) => <Round {...api} />}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.md },
  hudCard: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: '#F59E0B',
    elevation: 3,
  },
  hudBadge: {
    backgroundColor: '#D97706',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  hudBadgeText: { fontSize: 11, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  promptText: { fontSize: 20, fontWeight: '900', color: colors.text, marginVertical: 2, textAlign: 'center' },
  promptHint: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  trackArena: {
    flex: 1,
    minHeight: 380,
    backgroundColor: '#FDE68A',
    borderRadius: radius.xl,
    padding: spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 3,
    borderColor: '#D97706',
  },
  speedoBox: {
    position: 'absolute',
    top: 10,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    zIndex: 10,
  },
  speedoLabel: { fontSize: 9, fontWeight: '900', color: '#B45309' },
  speedoNeedle: { fontSize: 16 },
  gatesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 16,
    zIndex: 5,
  },
  gateCard: { alignItems: 'center', gap: 6 },
  gateArch: {
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FCD34D',
    minWidth: 80,
    elevation: 4,
  },
  gateTag: { fontSize: 10, fontWeight: '800', color: '#94A3B8' },
  gateValue: { fontSize: 18, fontWeight: '900', color: '#FCD34D' },
  enterLaneBtn: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    backgroundColor: '#D97706',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  gateTurboActivated: { transform: [{ scale: 1.15 }] },
  gateBlocked: { opacity: 0.5 },
  roadStripes: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '30%',
    right: '30%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  stripeColumn: { alignItems: 'center', gap: 16 },
  stripeChar: { fontSize: 28, color: '#D97706', opacity: 0.4, fontWeight: '900' },
  carContainer: { alignItems: 'center', paddingBottom: 10, zIndex: 6 },
  nitroFire: { position: 'absolute', bottom: -14, zIndex: 5 },
  nitroText: { fontSize: 20 },
  carEmoji: { fontSize: 54 },
  carShadow: { fontSize: 14, opacity: 0.2, marginTop: -14 },
  toastTurbo: {
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
  toastTurboTitle: { fontSize: 17, fontWeight: '900', color: '#fff' },
  toastTurboSub: { fontSize: 13, fontWeight: '700', color: '#D1FAE5', marginTop: 2, textAlign: 'center' },
  toastCrash: {
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
  toastCrashTitle: { fontSize: 17, fontWeight: '900', color: '#fff' },
  toastCrashSub: { fontSize: 12, fontWeight: '700', color: '#FEE2E2', marginTop: 2, textAlign: 'center' },
});
