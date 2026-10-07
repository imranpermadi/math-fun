import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  BounceIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { DecomposeData } from '../../../domain/entities/ExamQuestion';
import { SoundService } from '../../../core/sound/SoundService';
import { BubbleNumpad } from './BubbleNumpad';
import { colors, radius, spacing } from '../../theme';

interface Props {
  data: DecomposeData;
  onCorrect: () => void;
  onWrong: () => void;
}

export function DecompositionCard({ data, onCorrect, onWrong }: Props) {
  // Step 1: Fill tensA, onesA
  // Step 2: Fill tensB, onesB
  // Step 3: Fill tensResult, onesResult
  // Step 4: Fill finalAnswer
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'right' | 'wrong'>('idle');

  const shake = useSharedValue(0);

  const expectedValues: Record<number, number> = {
    1: data.tensA,
    2: data.tensB,
    3: data.tensResult,
    4: data.finalAnswer,
  };

  const stepPrompts: Record<number, string> = {
    1: `Berapakah nilai PULUHAN dari bilangan ${data.a}?`,
    2: `Berapakah nilai PULUHAN dari bilangan ${data.b}?`,
    3: `Hitunglah hasil operasi PULUHAN (${data.tensA} ${data.operation} ${data.tensB}):`,
    4: `Hitunglah HASIL AKHIR (${data.tensResult} + ${data.onesResult}):`,
  };

  const handleSubmit = () => {
    if (!inputVal || feedback !== 'idle') return;

    const expected = expectedValues[currentStep];
    const userNum = Number(inputVal);

    if (userNum === expected) {
      setFeedback('right');
      SoundService.correct();

      setTimeout(() => {
        setFeedback('idle');
        setInputVal('');
        if (currentStep < 4) {
          setCurrentStep((s) => (s + 1) as any);
        } else {
          onCorrect();
        }
      }, 900);
    } else {
      setFeedback('wrong');
      SoundService.wrong();
      shake.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 70 }),
        withTiming(0, { duration: 50 })
      );
      onWrong();
      setTimeout(() => {
        setFeedback('idle');
      }, 1000);
    }
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  return (
    <Animated.View style={[styles.container, animStyle]}>
      {/* Board visualisai lembar kerja dekomposisi */}
      <View style={styles.board}>
        <Text style={styles.boardTitle}>Lembar Dekomposisi Nilai Tempat</Text>

        {/* Step 1 & 2: Decomposition lines */}
        <View style={styles.decomRow}>
          <Text style={styles.numTarget}>{data.a}</Text>
          <Text style={styles.eqSign}>=</Text>
          <View style={[styles.slot, currentStep === 1 && styles.slotActive]}>
            <Text style={styles.slotText}>
              {currentStep > 1 ? data.tensA : currentStep === 1 ? (inputVal || '?') : '?'}
            </Text>
          </View>
          <Text style={styles.plusSign}>+</Text>
          <View style={styles.slotFilled}>
            <Text style={styles.slotText}>{data.onesA}</Text>
          </View>
        </View>

        <View style={styles.decomRow}>
          <Text style={styles.numTarget}>{data.b}</Text>
          <Text style={styles.eqSign}>=</Text>
          <View style={[styles.slot, currentStep === 2 && styles.slotActive]}>
            <Text style={styles.slotText}>
              {currentStep > 2 ? data.tensB : currentStep === 2 ? (inputVal || '?') : '?'}
            </Text>
          </View>
          <Text style={styles.plusSign}>+</Text>
          <View style={styles.slotFilled}>
            <Text style={styles.slotText}>{data.onesB}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Step 3: Operation on groups */}
        <View style={styles.decomRow}>
          <Text style={styles.groupLabel}>Puluhan ({data.operation}) :</Text>
          <View style={[styles.slot, currentStep === 3 && styles.slotActive]}>
            <Text style={styles.slotText}>
              {currentStep > 3 ? data.tensResult : currentStep === 3 ? (inputVal || '?') : '?'}
            </Text>
          </View>
        </View>

        <View style={styles.decomRow}>
          <Text style={styles.groupLabel}>Satuan ({data.operation})  :</Text>
          <View style={styles.slotFilled}>
            <Text style={styles.slotText}>{data.onesResult}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Step 4: Final Answer */}
        <View style={styles.finalRow}>
          <Text style={styles.finalLabel}>Hasil Akhir =</Text>
          <View style={[styles.slotLarge, currentStep === 4 && styles.slotActive]}>
            <Text style={styles.slotTextLarge}>
              {currentStep === 4 ? (inputVal || '?') : currentStep > 4 ? data.finalAnswer : '?'}
            </Text>
          </View>
        </View>
      </View>

      {/* Step prompt */}
      <View style={styles.promptBox}>
        <Text style={styles.stepBadge}>Langkah {currentStep} dari 4</Text>
        <Text style={styles.promptText}>{stepPrompts[currentStep]}</Text>
      </View>

      {/* Bubble Numpad to fill current slot */}
      <BubbleNumpad
        value={inputVal}
        onChange={setInputVal}
        onSubmit={handleSubmit}
        state={feedback}
        disabled={feedback !== 'idle'}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    width: '100%',
  },
  board: {
    backgroundColor: '#FFFDF0',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 2.5,
    borderColor: '#E6D5B8',
    gap: 8,
  },
  boardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#8B5E34',
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  decomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  numTarget: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    width: 44,
    textAlign: 'right',
  },
  eqSign: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textMuted,
  },
  plusSign: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  slot: {
    minWidth: 54,
    height: 42,
    backgroundColor: '#fff',
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  slotActive: {
    borderColor: colors.primary,
    backgroundColor: '#D8F3DC',
    transform: [{ scale: 1.05 }],
  },
  slotFilled: {
    minWidth: 54,
    height: 42,
    backgroundColor: '#F3F4F6',
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  slotText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
  },
  divider: {
    height: 2,
    backgroundColor: '#E6D5B8',
    marginVertical: 4,
  },
  groupLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textMuted,
    width: 140,
    textAlign: 'right',
  },
  finalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  finalLabel: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  slotLarge: {
    minWidth: 70,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: radius.md,
    borderWidth: 2.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  slotTextLarge: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  promptBox: {
    backgroundColor: '#E8F6FF',
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    gap: 4,
  },
  stepBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0077B6',
    textTransform: 'uppercase',
  },
  promptText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
});

