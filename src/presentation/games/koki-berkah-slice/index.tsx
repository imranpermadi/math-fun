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
import { generateChefRound } from './logic';
import type { ChefSliceRound, FruitOption } from './types';

function Round({ grade, difficulty, onCorrect, onWrong }: RoundApi) {
  const [roundData, setRoundData] = useState<ChefSliceRound>(() => generateChefRound(grade, difficulty));
  const [selectedOption, setSelectedOption] = useState<FruitOption | null>(null);
  const [isSlicing, setIsSlicing] = useState(false);
  const [sliceResult, setSliceResult] = useState<'none' | 'perfect' | 'wrong'>('none');

  // Animation values
  const fruitFloat = useSharedValue(0);
  const leftHalfX = useSharedValue(0);
  const rightHalfX = useSharedValue(0);
  const bladeSlash = useSharedValue(-150);
  const bladeOpacity = useSharedValue(0);
  const juiceScale = useSharedValue(0);

  useEffect(() => {
    fruitFloat.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 900 }),
        withTiming(8, { duration: 900 })
      ),
      -1,
      true
    );
  }, [fruitFloat]);

  const animatedFruitLeft = useAnimatedStyle(() => ({
    transform: [
      { translateY: fruitFloat.value },
      { translateX: leftHalfX.value },
    ],
  }));

  const animatedFruitRight = useAnimatedStyle(() => ({
    transform: [
      { translateY: fruitFloat.value },
      { translateX: rightHalfX.value },
    ],
  }));

  const animatedBlade = useAnimatedStyle(() => ({
    transform: [
      { translateX: bladeSlash.value },
      { rotate: '-35deg' },
    ],
    opacity: bladeOpacity.value,
  }));

  const animatedJuice = useAnimatedStyle(() => ({
    transform: [{ scale: juiceScale.value }],
    opacity: 1 - juiceScale.value * 0.5,
  }));

  const handleSlice = (option: FruitOption) => {
    if (isSlicing || sliceResult !== 'none') return;
    setSelectedOption(option);
    setIsSlicing(true);

    // 1. Blade slash sweep
    SoundService.play('whoosh');
    bladeOpacity.value = 1;
    bladeSlash.value = withTiming(160, { duration: 220 });

    setTimeout(() => {
      bladeOpacity.value = 0;
      bladeSlash.value = -150;

      // 2. Fruit splits
      leftHalfX.value = withSpring(-40, { damping: 9 });
      rightHalfX.value = withSpring(40, { damping: 9 });
      juiceScale.value = withSequence(
        withTiming(1.5, { duration: 250 }),
        withTiming(0, { duration: 10 })
      );

      // 3. Outcome
      if (option.isCorrect) {
        setSliceResult('perfect');
        SoundService.correct();
        setTimeout(onCorrect, 1000);
      } else {
        setSliceResult('wrong');
        SoundService.wrong();
        setTimeout(() => {
          // Reset split
          leftHalfX.value = withSpring(0);
          rightHalfX.value = withSpring(0);
          setIsSlicing(false);
          setSliceResult('none');
          setSelectedOption(null);
          onWrong();
        }, 900);
      }
    }, 240);
  };

  return (
    <View style={styles.container}>
      {/* Chef Order Card */}
      <View style={styles.orderCard}>
        <View style={styles.chefBadge}>
          <Text style={styles.chefBadgeText}>👨‍🍳 PESANAN DAPUR BERKAH</Text>
        </View>
        <Text style={styles.promptText}>{roundData.orderPrompt}</Text>
        <Text style={styles.promptHint}>{roundData.orderHint}</Text>
      </View>

      {/* Cutting Board Kitchen Arena */}
      <View style={styles.kitchenBoard}>
        {/* Talenan texture / grid */}
        <View style={styles.boardSurface}>
          <Text style={styles.boardWoodMark}>🪵 TALENAN KAYU JATI BERSIH 🪵</Text>
        </View>

        {/* Fruit Floating on Board */}
        <View style={styles.fruitCenterArea}>
          {/* Juice splash effect on slice */}
          <Animated.View style={[styles.juiceSplash, animatedJuice]}>
            <Text style={styles.juiceText}>✨ 💦 🌟</Text>
          </Animated.View>

          {/* Left piece */}
          <Animated.View style={animatedFruitLeft}>
            <Text style={styles.fruitLeft}>{roundData.fruitEmoji}</Text>
          </Animated.View>

          {/* Right piece */}
          <Animated.View style={animatedFruitRight}>
            <Text style={styles.fruitRight}>{roundData.fruitEmoji}</Text>
          </Animated.View>

          {/* Blade slash trail */}
          <Animated.View style={[styles.bladeTrail, animatedBlade]}>
            <View style={styles.bladeGleam} />
          </Animated.View>
        </View>

        {/* Knives / Fraction options selection */}
        <View style={styles.knivesContainer}>
          <Text style={styles.knivesTitle}>Pilih Ukuran Bilah Pisau Pecahan:</Text>
          <View style={styles.knivesRow}>
            {roundData.options.map((opt) => {
              const isSelected = selectedOption?.id === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  disabled={isSlicing}
                  onPress={() => handleSlice(opt)}
                  style={[
                    styles.knifeBtn,
                    isSelected && sliceResult === 'perfect' && styles.knifeRight,
                    isSelected && sliceResult === 'wrong' && styles.knifeWrong,
                  ]}
                >
                  <Text style={styles.knifeIcon}>🗡️</Text>
                  <Text style={styles.fractionText}>{opt.fractionLabel}</Text>
                  <Text style={styles.sliceActionTag}>TEBAS! ✂️</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Result Toast */}
        {sliceResult === 'perfect' && (
          <Animated.View entering={BounceIn} style={styles.toastSuccess}>
            <Text style={styles.toastSuccessTitle}>🍉 POTONGAN SEMPURNA!</Text>
            <Text style={styles.toastSuccessSub}>Masya Allah, porsi pecahan pas sekali!</Text>
          </Animated.View>
        )}

        {sliceResult === 'wrong' && (
          <Animated.View entering={FadeIn} style={styles.toastWrong}>
            <Text style={styles.toastWrongTitle}>⚠️ UKURAN BELUM PAS!</Text>
            <Text style={styles.toastWrongSub}>Tamu menginginkan ukuran pecahan yang berbeda!</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

export function KokiBerkahSlice({ onExit }: GameProps) {
  return (
    <GameShell
      gameId="koki-berkah-slice"
      emoji="🍉"
      title="Koki Berkah Iris Buah"
      totalRounds={5}
      keyed={true}
      onExit={onExit}
      renderRound={(api) => <Round {...api} />}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.md },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: '#FED7AA',
    elevation: 3,
  },
  chefBadge: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  chefBadgeText: { fontSize: 11, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  promptText: { fontSize: 22, fontWeight: '900', color: colors.text, marginVertical: 2, textAlign: 'center' },
  promptHint: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  kitchenBoard: {
    flex: 1,
    minHeight: 380,
    backgroundColor: '#D97706',
    borderRadius: radius.xl,
    padding: spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 4,
    borderColor: '#92400E',
  },
  boardSurface: { width: '100%', alignItems: 'center', paddingTop: 6 },
  boardWoodMark: { fontSize: 11, fontWeight: '900', color: '#78350F', opacity: 0.8 },
  fruitCenterArea: {
    height: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  juiceSplash: { position: 'absolute', zIndex: 4 },
  juiceText: { fontSize: 32 },
  fruitLeft: { fontSize: 68, marginRight: -20, zIndex: 5 },
  fruitRight: { fontSize: 68, marginLeft: -20, zIndex: 5 },
  bladeTrail: {
    position: 'absolute',
    width: 140,
    height: 6,
    backgroundColor: '#E0F2FE',
    borderRadius: 3,
    zIndex: 10,
    shadowColor: '#38BDF8',
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  bladeGleam: { width: '100%', height: '100%', backgroundColor: '#FFFFFF', borderRadius: 3 },
  knivesContainer: { width: '100%', gap: 8, zIndex: 6 },
  knivesTitle: { fontSize: 13, fontWeight: '800', color: '#FEF3C7', textAlign: 'center' },
  knivesRow: { flexDirection: 'row', justifyContent: 'space-around', gap: 6 },
  knifeBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: '#FDBA74',
    elevation: 4,
  },
  knifeIcon: { fontSize: 24 },
  fractionText: { fontSize: 14, fontWeight: '900', color: '#1E293B', textAlign: 'center' },
  sliceActionTag: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    backgroundColor: '#EA580C',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  knifeRight: { backgroundColor: '#D1FAE5', borderColor: '#10B981' },
  knifeWrong: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
  toastSuccess: {
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
  toastSuccessTitle: { fontSize: 18, fontWeight: '900', color: '#fff' },
  toastSuccessSub: { fontSize: 12, fontWeight: '700', color: '#D1FAE5', marginTop: 2 },
  toastWrong: {
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
  toastWrongTitle: { fontSize: 18, fontWeight: '900', color: '#fff' },
  toastWrongSub: { fontSize: 12, fontWeight: '700', color: '#FEE2E2', marginTop: 2 },
});
