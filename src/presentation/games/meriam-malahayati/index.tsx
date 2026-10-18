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
import { generateCannonRound } from './logic';
import type { CannonRound, PirateShip } from './types';

function Round({ grade, difficulty, onCorrect, onWrong }: RoundApi) {
  const [roundData, setRoundData] = useState<CannonRound>(() => generateCannonRound(grade, difficulty));
  const [selectedShip, setSelectedShip] = useState<PirateShip | null>(null);
  const [isFiring, setIsFiring] = useState(false);
  const [battleResult, setBattleResult] = useState<'none' | 'hit' | 'miss'>('none');

  // Animation values
  const seaWave = useSharedValue(0);
  const cannonAngle = useSharedValue(0);
  const cannonRecoil = useSharedValue(0);
  const ballX = useSharedValue(0);
  const ballY = useSharedValue(0);
  const ballOpacity = useSharedValue(0);
  const smokeScale = useSharedValue(0);

  useEffect(() => {
    seaWave.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1200 }),
        withTiming(6, { duration: 1200 })
      ),
      -1,
      true
    );
  }, [seaWave]);

  const animatedShips = useAnimatedStyle(() => ({
    transform: [{ translateY: seaWave.value }],
  }));

  const animatedCannon = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${cannonAngle.value}deg` },
      { translateY: cannonRecoil.value },
    ],
  }));

  const animatedBall = useAnimatedStyle(() => ({
    transform: [
      { translateX: ballX.value },
      { translateY: ballY.value },
    ],
    opacity: ballOpacity.value,
  }));

  const animatedSmoke = useAnimatedStyle(() => ({
    transform: [{ scale: smokeScale.value }],
    opacity: 1 - smokeScale.value,
  }));

  const handleFireAtShip = (ship: PirateShip) => {
    if (isFiring || battleResult !== 'none') return;
    setSelectedShip(ship);
    setIsFiring(true);

    // 1. Aim cannon toward ship position (-1: -22deg, 0: 0deg, 1: 22deg)
    const angleTarget = ship.xPos * 22;
    cannonAngle.value = withTiming(angleTarget, { duration: 200 });

    setTimeout(() => {
      // 2. Fire: Recoil + Smoke + Sound
      SoundService.play('whoosh');
      cannonRecoil.value = withSequence(
        withTiming(14, { duration: 80 }),
        withSpring(0, { damping: 10 })
      );
      smokeScale.value = withSequence(
        withTiming(1.6, { duration: 240 }),
        withTiming(0, { duration: 10 })
      );

      // 3. Cannonball trajectory
      const targetX = ship.xPos * 110;
      ballOpacity.value = 1;
      ballX.value = withTiming(targetX, { duration: 320 });
      ballY.value = withTiming(-200, { duration: 320 });

      // 4. Hit evaluation
      setTimeout(() => {
        ballOpacity.value = 0;
        ballX.value = 0;
        ballY.value = 0;

        if (ship.isCorrect) {
          setBattleResult('hit');
          SoundService.correct();
          setTimeout(onCorrect, 1000);
        } else {
          setBattleResult('miss');
          SoundService.wrong();
          setTimeout(() => {
            setIsFiring(false);
            setBattleResult('none');
            setSelectedShip(null);
            cannonAngle.value = 0;
            onWrong();
          }, 900);
        }
      }, 340);
    }, 220);
  };

  return (
    <View style={styles.container}>
      {/* Question Card */}
      <View style={styles.promptCard}>
        <View style={styles.badgeRow}>
          <Text style={styles.missionTag}>ARMADA SELAT MALAKA</Text>
        </View>
        <Text style={styles.promptText}>{roundData.questionPrompt}</Text>
        <Text style={styles.promptHint}>{roundData.questionHint}</Text>
      </View>

      {/* Naval Battle Sea Area */}
      <View style={styles.seaArena}>
        {/* Sky with Crescent Moon */}
        <View style={styles.skyHeader}>
          <Text style={styles.skyDecor}>🌙 ✨ ☁️</Text>
        </View>

        {/* Ships floating on waves */}
        <Animated.View style={[styles.shipsRow, animatedShips]}>
          {roundData.ships.map((ship) => {
            const isTargeted = selectedShip?.id === ship.id;
            return (
              <Pressable
                key={ship.id}
                disabled={isFiring}
                onPress={() => handleFireAtShip(ship)}
                style={[
                  styles.shipCard,
                  isTargeted && battleResult === 'hit' && styles.shipSunk,
                  isTargeted && battleResult === 'miss' && styles.shipMissed,
                ]}
              >
                <Text style={styles.shipEmoji}>⛵</Text>
                <View style={styles.shipFlag}>
                  <Text style={styles.shipValue}>{ship.label}</Text>
                </View>
                <Text style={styles.fireOrderPill}>TEMBAK! 💣</Text>
              </Pressable>
            );
          })}
        </Animated.View>

        {/* Ocean waves illustration */}
        <View style={styles.wavesBanner}>
          <Text style={styles.wavesText}>〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️</Text>
        </View>

        {/* Flying Cannonball */}
        <Animated.View style={[styles.cannonball, animatedBall]}>
          <View style={styles.ballCore} />
        </Animated.View>

        {/* Cannon Smoke Puff */}
        <Animated.View style={[styles.smokePuff, animatedSmoke]}>
          <Text style={styles.smokeIcon}>💨</Text>
        </Animated.View>

        {/* Cannon & Flagship Fortress */}
        <View style={styles.cannonStation}>
          <Animated.View style={[styles.cannonBarrelWrap, animatedCannon]}>
            <View style={styles.cannonMuzzle} />
            <View style={styles.cannonBody} />
            <View style={styles.cannonWheel} />
          </Animated.View>
          <Text style={styles.fortressLabel}>🛡️ Kapal Laksamana Malahayati</Text>
        </View>

        {/* Battle Result Announcement */}
        {battleResult === 'hit' && (
          <Animated.View entering={BounceIn} style={styles.resultToastSuccess}>
            <Text style={styles.resultToastTitle}>💥 BLAAAR! SASARAN HANCUR!</Text>
            <Text style={styles.resultToastSub}>Alhamdulillah, kapal musuh berhasil dilumpuhkan!</Text>
          </Animated.View>
        )}

        {battleResult === 'miss' && (
          <Animated.View entering={FadeIn} style={styles.resultToastWrong}>
            <Text style={styles.resultToastTitleMiss}>💦 PLUNG! TEMBAKAN MELESET!</Text>
            <Text style={styles.resultToastSubMiss}>Ayo hitung lagi dengan cermat, bismillah!</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

export function MeriamMalahayati({ onExit }: GameProps) {
  return (
    <GameShell
      gameId="meriam-malahayati"
      emoji="⛵"
      title="Meriam Laksamana Malahayati"
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
    borderColor: '#93C5FD',
    elevation: 3,
  },
  badgeRow: { flexDirection: 'row' },
  missionTag: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1D4ED8',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
    letterSpacing: 1,
  },
  promptText: { fontSize: 26, fontWeight: '900', color: colors.text, marginVertical: 2, textAlign: 'center' },
  promptHint: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  seaArena: {
    flex: 1,
    minHeight: 380,
    backgroundColor: '#0284C7',
    borderRadius: radius.xl,
    padding: spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#0369A1',
  },
  skyHeader: { width: '100%', alignItems: 'center', paddingTop: 4 },
  skyDecor: { fontSize: 18, opacity: 0.8 },
  shipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 16,
    zIndex: 5,
  },
  shipCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.lg,
    gap: 4,
    borderWidth: 2,
    borderColor: '#BAE6FD',
    elevation: 4,
  },
  shipEmoji: { fontSize: 34 },
  shipFlag: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  shipValue: { fontSize: 18, fontWeight: '900', color: '#FCD34D' },
  fireOrderPill: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  shipSunk: { backgroundColor: '#FEE2E2', transform: [{ scale: 0.85 }, { translateY: 15 }] },
  shipMissed: { opacity: 0.6 },
  wavesBanner: { position: 'absolute', top: 180, width: '100%', alignItems: 'center' },
  wavesText: { fontSize: 24, color: '#38BDF8', letterSpacing: 4, opacity: 0.7 },
  cannonball: { position: 'absolute', bottom: 75, zIndex: 10 },
  ballCore: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#0F172A', borderWidth: 2, borderColor: '#475569' },
  smokePuff: { position: 'absolute', bottom: 75, zIndex: 9 },
  smokeIcon: { fontSize: 28 },
  cannonStation: { alignItems: 'center', paddingBottom: 10, zIndex: 6 },
  cannonBarrelWrap: { alignItems: 'center', marginBottom: 4 },
  cannonMuzzle: { width: 14, height: 8, backgroundColor: '#334155', borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  cannonBody: { width: 22, height: 36, backgroundColor: '#1E293B', borderRadius: 4 },
  cannonWheel: { width: 34, height: 16, backgroundColor: '#78350F', borderRadius: 8, marginTop: -4 },
  fortressLabel: { fontSize: 13, fontWeight: '800', color: '#F0F9FF', marginTop: 4 },
  resultToastSuccess: {
    position: 'absolute',
    top: '42%',
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: 'center',
    zIndex: 20,
    elevation: 8,
  },
  resultToastTitle: { fontSize: 17, fontWeight: '900', color: '#fff' },
  resultToastSub: { fontSize: 12, fontWeight: '700', color: '#D1FAE5', marginTop: 2 },
  resultToastWrong: {
    position: 'absolute',
    top: '42%',
    backgroundColor: '#DC2626',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: 'center',
    zIndex: 20,
    elevation: 8,
  },
  resultToastTitleMiss: { fontSize: 17, fontWeight: '900', color: '#fff' },
  resultToastSubMiss: { fontSize: 12, fontWeight: '700', color: '#FEE2E2', marginTop: 2 },
});
