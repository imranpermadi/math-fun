import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming,
} from 'react-native-reanimated';
import { SoundService } from '../../../core/sound/SoundService';
import { colors, fontSize, radius, spacing } from '../../theme';

const PALETTE = [colors.pink, colors.sky, colors.secondary, colors.purple];

interface ChoiceProps {
  label: string;
  color: string;
  state: 'idle' | 'right' | 'wrong';
  disabled?: boolean;
  onPress: () => void;
}

function ChoiceButton({ label, color, state, disabled, onPress }: ChoiceProps) {
  const scale = useSharedValue(1);
  const shake = useSharedValue(0);

  React.useEffect(() => {
    if (state === 'right') scale.value = withSequence(withSpring(1.25), withSpring(1.08));
    if (state === 'wrong') shake.value = withSequence(withTiming(-10, { duration: 50 }), withTiming(10, { duration: 80 }), withTiming(-8, { duration: 80 }), withTiming(0, { duration: 50 }));
  }, [state, scale, shake]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: shake.value }],
  }));

  const bg = state === 'right' ? colors.primary : state === 'wrong' ? '#E5484D' : color;
  return (
    <Animated.View style={[styles.btnWrap, style]}>
      <Pressable
        disabled={disabled}
        onPressIn={() => { scale.value = withSpring(0.92); }}
        onPressOut={() => { if (state === 'idle') scale.value = withSpring(1); }}
        onPress={() => { SoundService.tap(); onPress(); }}
        style={[styles.btn, { backgroundColor: bg }]}
      >
        <Text style={styles.btnText}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

interface Props {
  choices: (string | number)[];
  correct: string | number;
  onCorrect: () => void;
  onWrong: () => void;
}

/** Big colorful answer buttons. Wrong tap shakes (can retry), right tap bounces. */
export function Choices({ choices, correct, onCorrect, onWrong }: Props) {
  const [wrongSet, setWrongSet] = useState<Set<string | number>>(new Set());
  const [solved, setSolved] = useState(false);

  const press = (c: string | number) => {
    if (solved) return;
    if (c === correct) {
      setSolved(true);
      onCorrect();
    } else {
      setWrongSet((s) => new Set(s).add(c));
      onWrong();
    }
  };

  return (
    <View style={styles.row}>
      {choices.map((c, i) => (
        <ChoiceButton
          key={String(c)}
          label={String(c)}
          color={PALETTE[i % PALETTE.length]}
          state={solved && c === correct ? 'right' : wrongSet.has(c) ? 'wrong' : 'idle'}
          disabled={solved || wrongSet.has(c)}
          onPress={() => press(c)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'center' },
  btnWrap: { minWidth: '28%' },
  btn: { borderRadius: radius.lg, paddingVertical: 18, paddingHorizontal: 20, alignItems: 'center', borderBottomWidth: 6, borderBottomColor: 'rgba(0,0,0,0.2)' },
  btnText: { fontSize: fontSize.title + 4, fontWeight: '900', color: '#fff' },
});

