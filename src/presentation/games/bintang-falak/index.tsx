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
import { generateCosmicRound } from './logic';
import type { CosmicMeteor, CosmicRound } from './types';

function Round({ grade, difficulty, onCorrect, onWrong }: RoundApi) {
  const [roundData, setRoundData] = useState<CosmicRound>(() => generateCosmicRound(grade, difficulty));
  const [selectedMeteor, setSelectedMeteor] = useState<CosmicMeteor | null>(null);
  const [isBlasting, setIsBlasting] = useState(false);
  const [blastResult, setBlastResult] = useState<'none' | 'hit' | 'miss'>('none');

  // Animation values
  const shipX = useSharedValue(0);
  const flamePulse = useSharedValue(1);
  const laserHeight = useSharedValue(0);
  const laserOpacity = useSharedValue(0);
  const meteorDrop = useSharedValue(0);
  const meteorWobble = useSharedValue(0);

  // Thruster pulse & Meteor float
  useEffect(() => {
    flamePulse.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 150 }),
        withTiming(0.8, { duration: 150 })
      ),
      -1,
      true
    );
    meteorDrop.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1000 }),
        withTiming(5, { duration: 1000 })
      ),
      -1,
      true
    );
  }, [flamePulse, meteorDrop]);

  const animatedShip = useAnimatedStyle(() => ({
    transform: [{ translateX: shipX.value }],
  }));

  const animatedFlame = useAnimatedStyle(() => ({
    transform: [{ scaleY: flamePulse.value }],
  }));

  const animatedMeteors = useAnimatedStyle(() => ({
    transform: [{ translateY: meteorDrop.value }],
  }));

  const animatedLaser = useAnimatedStyle(() => ({
    height: laserHeight.value,
    opacity: laserOpacity.value,
    transform: [{ translateX: shipX.value }],
  }));

  const handleShootMeteor = (meteor: CosmicMeteor) => {
    if (isBlasting || blastResult !== 'none') return;
    setSelectedMeteor(meteor);
    setIsBlasting(true);

    // 1. Move spaceship into the chosen lane (-1: -100, 0: 0, 1: 100)
    const targetLaneX = meteor.xLane * 105;
    shipX.value = withSpring(targetLaneX, { damping: 12 });

    setTimeout(() => {
      // 2. Fire twin laser beam
      SoundService.play('whoosh');
      laserOpacity.value = 1;
      laserHeight.value = withTiming(210, { duration: 200 });

      setTimeout(() => {
        laserOpacity.value = 0;
        laserHeight.value = 0;

        // 3. Outcome
        if (meteor.isCorrect) {
          setBlastResult('hit');
          SoundService.correct();
          setTimeout(onCorrect, 1000);
        } else {
          setBlastResult('miss');
          SoundService.wrong();
          setTimeout(() => {
            setIsBlasting(false);
            setBlastResult('none');
            setSelectedMeteor(null);
            shipX.value = 0;
            onWrong();
          }, 900);
        }
      }, 220);
    }, 180);
  };

  return (
    <View style={styles.container}>
      {/* Mission HUD Header */}
      <View style={styles.hudCard}>
        <View style={styles.hudBadge}>
          <Text style={styles.hudBadgeText}>RADAR KOSMIK BILANGAN BULAT</Text>
        </View>
        <Text style={styles.promptText}>{roundData.questionPrompt}</Text>
        <Text style={styles.promptHint}>{roundData.questionHint}</Text>
      </View>

      {/* Deep Space Cosmic Arena */}
      <View style={styles.spaceArena}>
        {/* Starfield background */}
        <View style={styles.starfield}>
          <Text style={styles.starfieldStars}>✨  ⭐    🪐   ✨  🌟</Text>
        </View>

        {/* Falling Meteors Row */}
        <Animated.View style={[styles.meteorsRow, animatedMeteors]}>
          {roundData.meteors.map((meteor) => {
            const isTargeted = selectedMeteor?.id === meteor.id;
            return (
              <Pressable
                key={meteor.id}
                disabled={isBlasting}
                onPress={() => handleShootMeteor(meteor)}
                style={[
                  styles.meteorCard,
                  isTargeted && blastResult === 'hit' && styles.meteorDestroyed,
                  isTargeted && blastResult === 'miss' && styles.meteorShielded,
                ]}
              >
                <View style={[styles.meteorGlow, { backgroundColor: meteor.color }]}>
                  <Text style={styles.meteorIcon}>☄️</Text>
                  <Text style={styles.meteorValue}>{meteor.label}</Text>
                </View>
                <Text style={styles.lockTargetLabel}>KUNCI 🚀</Text>
              </Pressable>
            );
          })}
        </Animated.View>

        {/* Laser Beams */}
        <Animated.View style={[styles.laserBeam, animatedLaser]} />

        {/* Space Fighter Ship Base */}
        <Animated.View style={[styles.shipWrap, animatedShip]}>
          <Text style={styles.shipIcon}>🚀</Text>
          <Animated.View style={[styles.flameContainer, animatedFlame]}>
            <Text style={styles.flameText}>🔥</Text>
          </Animated.View>
        </Animated.View>

        {/* Result Toast */}
        {blastResult === 'hit' && (
          <Animated.View entering={BounceIn} style={styles.toastWin}>
            <Text style={styles.toastWinTitle}>💥 METEOR HANCUR!</Text>
            <Text style={styles.toastWinSub}>Alhamdulillah! Lintasan pesawat aman!</Text>
          </Animated.View>
        )}

        {blastResult === 'miss' && (
          <Animated.View entering={FadeIn} style={styles.toastLoss}>
            <Text style={styles.toastLossTitle}>🛡️ PERISAI MENAHAN!</Text>
            <Text style={styles.toastLossSub}>Hitung kembali garis bilangan dengan teliti!</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

export function BintangFalak({ onExit }: GameProps) {
  return (
    <GameShell
      gameId="bintang-falak"
      emoji="🚀"
      title="Pesawat Falak Antariksa"
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
    backgroundColor: '#0F172A',
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: '#38BDF8',
    elevation: 4,
  },
  hudBadge: {
    backgroundColor: '#0369A1',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  hudBadgeText: { fontSize: 11, fontWeight: '900', color: '#7DD3FC', letterSpacing: 1 },
  promptText: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', marginVertical: 2, textAlign: 'center' },
  promptHint: { fontSize: 13, fontWeight: '700', color: '#94A3B8' },
  spaceArena: {
    flex: 1,
    minHeight: 380,
    backgroundColor: '#020617',
    borderRadius: radius.xl,
    padding: spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#1E293B',
  },
  starfield: { position: 'absolute', top: 12, width: '100%', alignItems: 'center' },
  starfieldStars: { fontSize: 18, opacity: 0.8 },
  meteorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 18,
    zIndex: 5,
  },
  meteorCard: { alignItems: 'center', gap: 6 },
  meteorGlow: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    elevation: 5,
  },
  meteorIcon: { fontSize: 26, marginBottom: 2 },
  meteorValue: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  lockTargetLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#38BDF8',
    backgroundColor: '#0C4A6E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  meteorDestroyed: { transform: [{ scale: 1.25 }] },
  meteorShielded: { opacity: 0.5 },
  laserBeam: {
    position: 'absolute',
    bottom: 80,
    width: 6,
    backgroundColor: '#38BDF8',
    borderRadius: 3,
    zIndex: 10,
    shadowColor: '#38BDF8',
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  shipWrap: { alignItems: 'center', paddingBottom: 10, zIndex: 6 },
  shipIcon: { fontSize: 50 },
  flameContainer: { marginTop: -8 },
  flameText: { fontSize: 20 },
  toastWin: {
    position: 'absolute',
    top: '42%',
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: 'center',
    zIndex: 20,
    elevation: 8,
  },
  toastWinTitle: { fontSize: 18, fontWeight: '900', color: '#fff' },
  toastWinSub: { fontSize: 12, fontWeight: '700', color: '#D1FAE5', marginTop: 2 },
  toastLoss: {
    position: 'absolute',
    top: '42%',
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: 'center',
    zIndex: 20,
    elevation: 8,
  },
  toastLossTitle: { fontSize: 18, fontWeight: '900', color: '#fff' },
  toastLossSub: { fontSize: 12, fontWeight: '700', color: '#FEE2E2', marginTop: 2 },
});
