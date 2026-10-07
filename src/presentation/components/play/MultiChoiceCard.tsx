import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  BounceIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MultiOption } from '../../../domain/entities/ExamQuestion';
import { SoundService } from '../../../core/sound/SoundService';
import { colors, fontSize, radius, spacing } from '../../theme';

interface Props {
  options: MultiOption[];
  onCorrect: () => void;
  onWrong: () => void;
}

export function MultiChoiceCard({ options, onCorrect, onWrong }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [state, setState] = useState<'idle' | 'right' | 'wrong'>('idle');

  const shake = useSharedValue(0);
  const successScale = useSharedValue(1);

  const toggle = (id: string) => {
    if (state === 'right') return;
    SoundService.pop();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const check = () => {
    if (state === 'right' || selectedIds.size === 0) return;

    // Must select ALL correct options and NO wrong options
    const correctIds = new Set(options.filter((o) => o.isCorrect).map((o) => o.id));
    const isAllCorrect =
      selectedIds.size === correctIds.size &&
      Array.from(selectedIds).every((id) => correctIds.has(id));

    if (isAllCorrect) {
      setState('right');
      successScale.value = withSequence(withSpring(1.08), withSpring(1));
      SoundService.correct();
      setTimeout(onCorrect, 1000);
    } else {
      setState('wrong');
      shake.value = withSequence(
        withTiming(-12, { duration: 50 }),
        withTiming(12, { duration: 70 }),
        withTiming(-8, { duration: 70 }),
        withTiming(0, { duration: 50 })
      );
      SoundService.wrong();
      onWrong();
      setTimeout(() => setState('idle'), 1200);
    }
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }, { scale: successScale.value }],
  }));

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <Text style={styles.badgeHint}>Pilihlah semua jawaban yang menurutmu benar:</Text>

      <View style={styles.list}>
        {options.map((opt) => {
          const isSelected = selectedIds.has(opt.id);
          const showAnswerStyle =
            state === 'right' && opt.isCorrect
              ? styles.correctItem
              : state === 'wrong' && isSelected && !opt.isCorrect
              ? styles.wrongItem
              : isSelected
              ? styles.selectedItem
              : null;

          return (
            <Pressable
              key={opt.id}
              disabled={state === 'right'}
              onPress={() => toggle(opt.id)}
              style={[styles.itemCard, showAnswerStyle]}
            >
              <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                <Text style={styles.checkIcon}>{isSelected ? '✓' : ''}</Text>
              </View>
              <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {state === 'right' && (
        <Animated.Text entering={BounceIn} style={styles.statusSuccess}>
          Masya Allah, Tepat Sekali! 🎉
        </Animated.Text>
      )}

      {state === 'wrong' && (
        <Animated.Text entering={BounceIn} style={styles.statusError}>
          Belum tepat, coba periksa kembali pilihanmu! 🤲
        </Animated.Text>
      )}

      <Pressable
        disabled={selectedIds.size === 0 || state === 'right'}
        onPress={() => {
          SoundService.tap();
          check();
        }}
        style={[
          styles.submitBtn,
          selectedIds.size === 0 && { backgroundColor: '#CBD5E1', borderBottomColor: '#94A3B8' },
        ]}
      >
        <Text style={styles.submitBtnText}>Periksa Jawaban ✅</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    width: '100%',
  },
  badgeHint: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textMuted,
    textAlign: 'center',
  },
  list: {
    gap: 10,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 2.5,
    borderColor: '#E5E7EB',
    borderBottomWidth: 5,
    borderBottomColor: '#D1D5DB',
    gap: 12,
  },
  selectedItem: {
    borderColor: colors.sky,
    borderBottomColor: '#0096C7',
    backgroundColor: '#F0F9FF',
  },
  correctItem: {
    borderColor: colors.primary,
    borderBottomColor: colors.primaryDark,
    backgroundColor: '#D8F3DC',
  },
  wrongItem: {
    borderColor: '#E63946',
    borderBottomColor: '#B00020',
    backgroundColor: '#FFE3E3',
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  checkIcon: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
  },
  itemText: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    flex: 1,
  },
  itemTextSelected: {
    color: colors.primaryDark,
  },
  statusSuccess: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primaryDark,
    textAlign: 'center',
  },
  statusError: {
    fontSize: 16,
    fontWeight: '900',
    color: '#E63946',
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
});

