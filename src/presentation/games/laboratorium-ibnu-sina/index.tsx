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
import { generateAlchemyRound } from './logic';
import type { AlchemyFlask, AlchemyRound } from './types';

function Round({ grade, difficulty, onCorrect, onWrong }: RoundApi) {
  const [roundData, setRoundData] = useState<AlchemyRound>(() => generateAlchemyRound(grade, difficulty));
  const [selectedFlask, setSelectedFlask] = useState<AlchemyFlask | null>(null);
  const [isPouring, setIsPouring] = useState(false);
  const [mixResult, setMixResult] = useState<'none' | 'success' | 'fail'>('none');

  // Animation values
  const bubbleY = useSharedValue(0);
  const flaskTilt = useSharedValue(0);
  const streamHeight = useSharedValue(0);
  const auraScale = useSharedValue(1);

  useEffect(() => {
    bubbleY.value = withRepeat(
      withSequence(
        withTiming(-16, { duration: 700 }),
        withTiming(0, { duration: 700 })
      ),
      -1,
      true
    );
  }, [bubbleY]);

  const animatedBubbles = useAnimatedStyle(() => ({
    transform: [{ translateY: bubbleY.value }],
  }));

  const animatedFlask = useAnimatedStyle(() => ({
    transform: [{ rotate: `${flaskTilt.value}deg` }],
  }));

  const animatedStream = useAnimatedStyle(() => ({
    height: streamHeight.value,
    opacity: streamHeight.value > 0 ? 1 : 0,
  }));

  const animatedAura = useAnimatedStyle(() => ({
    transform: [{ scale: auraScale.value }],
  }));

  const handlePourFlask = (flask: AlchemyFlask) => {
    if (isPouring || mixResult !== 'none') return;
    setSelectedFlask(flask);
    setIsPouring(true);

    // 1. Tilt flask
    SoundService.pop();
    flaskTilt.value = withTiming(-40, { duration: 180 });

    setTimeout(() => {
      // 2. Liquid stream pours down
      streamHeight.value = withTiming(90, { duration: 200 });

      setTimeout(() => {
        streamHeight.value = 0;
        flaskTilt.value = 0;

        // 3. Evaluation
        if (flask.isCorrect) {
          setMixResult('success');
          SoundService.correct();
          auraScale.value = withSequence(withSpring(1.3), withSpring(1));
          setTimeout(onCorrect, 1000);
        } else {
          setMixResult('fail');
          SoundService.wrong();
          setTimeout(() => {
            setIsPouring(false);
            setMixResult('none');
            setSelectedFlask(null);
            onWrong();
          }, 900);
        }
      }, 240);
    }, 200);
  };

  return (
    <View style={styles.container}>
      {/* Recipe Prescription Card */}
      <View style={styles.recipeCard}>
        <View style={styles.recipeBadge}>
          <Text style={styles.recipeBadgeText}>📜 RESEP OBAT IBNU SINA</Text>
        </View>
        <Text style={styles.promptText}>{roundData.questionPrompt}</Text>
        <Text style={styles.promptHint}>{roundData.questionHint}</Text>
      </View>

      {/* Alchemy Lab Arena */}
      <View style={styles.labArena}>
        {/* Lab Shelf & Glassware background */}
        <View style={styles.shelfDecor}>
          <Text style={styles.shelfIcons}>🧪 🌿 🏺 🌿 ⚗️</Text>
        </View>

        {/* Selected Tilting Flask Area */}
        <View style={styles.flaskPourArea}>
          <Animated.View style={[styles.flaskPreviewWrap, animatedFlask]}>
            <Text style={styles.flaskEmoji}>🧪</Text>
          </Animated.View>
          <Animated.View style={[styles.liquidStream, animatedStream]} />
        </View>

        {/* Cauldron / Beaker with bubbling potion */}
        <Animated.View style={[styles.cauldronWrap, animatedAura]}>
          <Animated.View style={[styles.bubblesRow, animatedBubbles]}>
            <Text style={styles.bubbleText}>🫧 🟢 🫧 🟡 🫧</Text>
          </Animated.View>
          <View style={[styles.cauldronPot, mixResult === 'success' && styles.cauldronGold]}>
            <Text style={styles.cauldronIcon}>⚗️</Text>
            <Text style={styles.cauldronHerbName}>{roundData.herbName}</Text>
          </View>
        </Animated.View>

        {/* Flasks Measurement Selection */}
        <View style={styles.flasksRow}>
          {roundData.flasks.map((flask) => {
            const isSelected = selectedFlask?.id === flask.id;
            return (
              <Pressable
                key={flask.id}
                disabled={isPouring}
                onPress={() => handlePourFlask(flask)}
                style={[
                  styles.flaskCard,
                  isSelected && mixResult === 'success' && styles.flaskSuccess,
                  isSelected && mixResult === 'fail' && styles.flaskFail,
                ]}
              >
                <View style={[styles.flaskLiquidBadge, { backgroundColor: flask.color }]}>
                  <Text style={styles.flaskLiquidVal}>{flask.label}</Text>
                </View>
                <Text style={styles.pourActionLabel}>TUANG 💧</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Result Toast */}
        {mixResult === 'success' && (
          <Animated.View entering={BounceIn} style={styles.toastWin}>
            <Text style={styles.toastWinTitle}>✨ RAMUAN MANJUR TERACIK!</Text>
            <Text style={styles.toastWinSub}>{roundData.ratioExplanation}</Text>
          </Animated.View>
        )}

        {mixResult === 'fail' && (
          <Animated.View entering={FadeIn} style={styles.toastLoss}>
            <Text style={styles.toastLossTitle}>⚠️ TAKARAN RASIO KURANG PAS!</Text>
            <Text style={styles.toastLossSub}>Hitung kembali perbandingan senilai bahan!</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

export function LaboratoriumIbnuSina({ onExit }: GameProps) {
  return (
    <GameShell
      gameId="laboratorium-ibnu-sina"
      emoji="🧪"
      title="Laboratorium Ibnu Sina"
      totalRounds={5}
      keyed={true}
      onExit={onExit}
      renderRound={(api) => <Round {...api} />}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.md },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: '#A7F3D0',
    elevation: 3,
  },
  recipeBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  recipeBadgeText: { fontSize: 11, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  promptText: { fontSize: 19, fontWeight: '900', color: colors.text, marginVertical: 2, textAlign: 'center' },
  promptHint: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  labArena: {
    flex: 1,
    minHeight: 390,
    backgroundColor: '#064E3B',
    borderRadius: radius.xl,
    padding: spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 3,
    borderColor: '#047857',
  },
  shelfDecor: { width: '100%', alignItems: 'center', paddingTop: 4 },
  shelfIcons: { fontSize: 18, opacity: 0.8 },
  flaskPourArea: { alignItems: 'center', height: 80, justifyContent: 'center' },
  flaskPreviewWrap: { zIndex: 6 },
  flaskEmoji: { fontSize: 40 },
  liquidStream: {
    position: 'absolute',
    top: 45,
    width: 6,
    backgroundColor: '#34D399',
    borderRadius: 3,
    zIndex: 5,
  },
  cauldronWrap: { alignItems: 'center', zIndex: 4 },
  bubblesRow: { marginBottom: -10, zIndex: 5 },
  bubbleText: { fontSize: 18 },
  cauldronPot: {
    backgroundColor: '#022C22',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radius.xl,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#10B981',
    elevation: 6,
  },
  cauldronGold: { borderColor: '#FBBF24', backgroundColor: '#78350F' },
  cauldronIcon: { fontSize: 32 },
  cauldronHerbName: { fontSize: 12, fontWeight: '800', color: '#A7F3D0', marginTop: 2 },
  flasksRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', gap: 6, zIndex: 6 },
  flaskCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: '#6EE7B7',
    elevation: 4,
  },
  flaskLiquidBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.md,
    minWidth: 48,
    alignItems: 'center',
  },
  flaskLiquidVal: { fontSize: 18, fontWeight: '900', color: '#FFFFFF' },
  pourActionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#065F46',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  flaskSuccess: { backgroundColor: '#D1FAE5', borderColor: '#10B981' },
  flaskFail: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
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
