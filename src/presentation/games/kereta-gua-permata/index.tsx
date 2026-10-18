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
import { generateMinecartRound } from './logic';
import type { MineGem, MinecartRound } from './types';

function Round({ grade, difficulty, onCorrect, onWrong }: RoundApi) {
  const [roundData, setRoundData] = useState<MinecartRound>(() => generateMinecartRound(grade, difficulty));
  const [selectedGem, setSelectedGem] = useState<MineGem | null>(null);
  const [isRushing, setIsRushing] = useState(false);
  const [mineResult, setMineResult] = useState<'none' | 'gem' | 'trap'>('none');

  // Animation values
  const cartX = useSharedValue(0);
  const cartY = useSharedValue(0);
  const cartRumble = useSharedValue(0);
  const lanternSwing = useSharedValue(0);
  const sparkScale = useSharedValue(0);

  useEffect(() => {
    cartRumble.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 90 }),
        withTiming(2, { duration: 90 })
      ),
      -1,
      true
    );
    lanternSwing.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 900 }),
        withTiming(10, { duration: 900 })
      ),
      -1,
      true
    );
  }, [cartRumble, lanternSwing]);

  const animatedCart = useAnimatedStyle(() => ({
    transform: [
      { translateX: cartX.value },
      { translateY: cartY.value + cartRumble.value },
    ],
  }));

  const animatedLantern = useAnimatedStyle(() => ({
    transform: [{ rotate: `${lanternSwing.value}deg` }],
  }));

  const animatedSparks = useAnimatedStyle(() => ({
    transform: [{ scale: sparkScale.value }],
    opacity: sparkScale.value > 0 ? 1 : 0,
  }));

  const handleSwitchTrack = (gem: MineGem, laneIdx: number) => {
    if (isRushing || mineResult !== 'none') return;
    setSelectedGem(gem);
    setIsRushing(true);

    // 1. Shift lane: laneIdx 0: -90, 1: 0, 2: 90
    const targetX = (laneIdx - 1) * 95;
    cartX.value = withSpring(targetX, { damping: 11 });
    SoundService.play('whoosh');

    // 2. Dash forward along track
    setTimeout(() => {
      sparkScale.value = withSequence(
        withTiming(1.5, { duration: 220 }),
        withTiming(0, { duration: 20 })
      );
      cartY.value = withTiming(-140, { duration: 280 });

      // 3. Evaluation
      setTimeout(() => {
        if (gem.isCorrect) {
          setMineResult('gem');
          SoundService.correct();
          setTimeout(onCorrect, 1000);
        } else {
          setMineResult('trap');
          SoundService.wrong();
          setTimeout(() => {
            cartX.value = 0;
            cartY.value = 0;
            setIsRushing(false);
            setMineResult('none');
            setSelectedGem(null);
            onWrong();
          }, 900);
        }
      }, 300);
    }, 180);
  };

  return (
    <View style={styles.container}>
      {/* Mine Expedition Card */}
      <View style={styles.expeditionCard}>
        <View style={styles.badgeRow}>
          <Text style={styles.badgeText}>⛏️ EKSPLORASI GUA PERMATA PRIMA</Text>
        </View>
        <Text style={styles.promptText}>{roundData.questionPrompt}</Text>
        <Text style={styles.promptHint}>{roundData.questionHint}</Text>
      </View>

      {/* Underground Cave Arena */}
      <View style={styles.caveArena}>
        {/* Cave Roof with Stalactites & Swinging Lantern */}
        <View style={styles.roofRow}>
          <Text style={styles.stalactite}>⛰️ ⛰️ ⛰️</Text>
          <Animated.Text style={[styles.lantern, animatedLantern]}>🏮</Animated.Text>
          <Text style={styles.stalactite}>⛰️ ⛰️ ⛰️</Text>
        </View>

        {/* 3 Crystal Gem Gates */}
        <View style={styles.gemsRow}>
          {roundData.gems.map((gem, idx) => {
            const isTargeted = selectedGem?.id === gem.id;
            return (
              <Pressable
                key={gem.id}
                disabled={isRushing}
                onPress={() => handleSwitchTrack(gem, idx)}
                style={[
                  styles.gemCard,
                  isTargeted && mineResult === 'gem' && styles.gemCollected,
                  isTargeted && mineResult === 'trap' && styles.gemTrapped,
                ]}
              >
                <View style={[styles.crystalGlow, { backgroundColor: gem.color }]}>
                  <Text style={styles.crystalIcon}>💎</Text>
                  <Text style={styles.crystalVal}>{gem.label}</Text>
                </View>
                <Text style={styles.switchLeverBtn}>REL JALUR 🔀</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Underground Rail Tracks */}
        <View style={styles.trackLines}>
          <View style={styles.railBeam} />
          <View style={styles.railBeam} />
          <View style={styles.railBeam} />
        </View>

        {/* Track Sparks */}
        <Animated.View style={[styles.sparksContainer, animatedSparks]}>
          <Text style={styles.sparkText}>✨ ⚡ ✨</Text>
        </Animated.View>

        {/* Minecart Player */}
        <Animated.View style={[styles.minecartWrap, animatedCart]}>
          <Text style={styles.cartEmoji}>🛒</Text>
          <Text style={styles.minerEmoji}>⛏️ Penjelajah</Text>
        </Animated.View>

        {/* Result Announcement */}
        {mineResult === 'gem' && (
          <Animated.View entering={BounceIn} style={styles.toastWin}>
            <Text style={styles.toastWinTitle}>💎 PERMATA PRIMA DIPEROLEH!</Text>
            <Text style={styles.toastWinSub}>{roundData.explanation}</Text>
          </Animated.View>
        )}

        {mineResult === 'trap' && (
          <Animated.View entering={FadeIn} style={styles.toastLoss}>
            <Text style={styles.toastLossTitle}>⚠️ REL BUKAN PRIMA!</Text>
            <Text style={styles.toastLossSub}>Bilangan tersebut memiliki faktor selain 1!</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

export function KeretaGuaPermata({ onExit }: GameProps) {
  return (
    <GameShell
      gameId="kereta-gua-permata"
      emoji="⛏️"
      title="Kereta Tambang Permata Prima"
      totalRounds={5}
      keyed={true}
      onExit={onExit}
      renderRound={(api) => <Round {...api} />}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.md },
  expeditionCard: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: '#C084FC',
    elevation: 3,
  },
  badgeRow: { flexDirection: 'row' },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#7E22CE',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
    letterSpacing: 1,
  },
  promptText: { fontSize: 20, fontWeight: '900', color: colors.text, marginVertical: 2, textAlign: 'center' },
  promptHint: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  caveArena: {
    flex: 1,
    minHeight: 390,
    backgroundColor: '#1E1B4B',
    borderRadius: radius.xl,
    padding: spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 3,
    borderColor: '#312E81',
  },
  roofRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 4 },
  stalactite: { fontSize: 16, opacity: 0.6 },
  lantern: { fontSize: 26 },
  gemsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 14,
    zIndex: 5,
  },
  gemCard: { alignItems: 'center', gap: 6 },
  crystalGlow: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    elevation: 5,
  },
  crystalIcon: { fontSize: 24, marginBottom: 2 },
  crystalVal: { fontSize: 18, fontWeight: '900', color: '#FFFFFF' },
  switchLeverBtn: {
    fontSize: 10,
    fontWeight: '900',
    color: '#F5D0FE',
    backgroundColor: '#581C87',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  gemCollected: { transform: [{ scale: 1.15 }] },
  gemTrapped: { opacity: 0.5 },
  trackLines: {
    position: 'absolute',
    top: 90,
    bottom: 80,
    left: '20%',
    right: '20%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 1,
  },
  railBeam: { width: 3, backgroundColor: '#6366F1', opacity: 0.4 },
  sparksContainer: { position: 'absolute', bottom: 90, zIndex: 8 },
  sparkText: { fontSize: 24 },
  minecartWrap: { alignItems: 'center', paddingBottom: 10, zIndex: 6 },
  cartEmoji: { fontSize: 48 },
  minerEmoji: { fontSize: 12, fontWeight: '800', color: '#E0E7FF', marginTop: 2 },
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
