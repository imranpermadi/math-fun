import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  BounceIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SoundService } from '../../../core/sound/SoundService';
import { colors, fontSize, radius, spacing } from '../../theme';

const PALETTE = [
  '#4361EE', // Royal Azure
  '#F72585', // Bubblegum Pink
  '#FFB703', // Marigold Amber
  '#7209B7', // Deep Violet
  '#2EC4B6', // Fresh Teal
  '#E71D36', // Bright Crimson
];

interface StarParticleProps {
  x: number;
  y: number;
  delay: number;
}

function StarParticle({ x, y, delay }: StarParticleProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  const posX = useSharedValue(0);
  const posY = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1.2));
    posX.value = withDelay(delay, withTiming(x, { duration: 400 }));
    posY.value = withDelay(delay, withTiming(y, { duration: 400 }));
    opacity.value = withDelay(delay + 200, withTiming(0, { duration: 250 }));
  }, [delay, x, y, scale, opacity, posX, posY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: posX.value }, { translateY: posY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.Text style={[styles.starParticle, style]}>
      ⭐
    </Animated.Text>
  );
}

interface ChoiceProps {
  label: string;
  color: string;
  state: 'idle' | 'right' | 'wrong';
  disabled?: boolean;
  onPress: () => void;
}

function ChoiceButton({ label, color, state, disabled, onPress }: ChoiceProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const shake = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    if (state === 'right') {
      // Celebratory bounce jump
      scale.value = withSequence(withSpring(1.22, { damping: 8, stiffness: 220 }), withSpring(1.08));
      translateY.value = withSequence(withTiming(-12, { duration: 150 }), withSpring(0, { damping: 9 }));
    } else if (state === 'wrong') {
      // Elastic wobble shake
      shake.value = withSequence(
        withTiming(-12, { duration: 50 }),
        withTiming(12, { duration: 70 }),
        withTiming(-8, { duration: 70 }),
        withTiming(8, { duration: 60 }),
        withTiming(0, { duration: 50 })
      );
      rotate.value = withSequence(
        withTiming(-4, { duration: 60 }),
        withTiming(4, { duration: 80 }),
        withTiming(0, { duration: 60 })
      );
    }
  }, [state, scale, translateY, shake, rotate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
      { translateX: shake.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.92, { damping: 10, stiffness: 250 });
    translateY.value = withSpring(4, { damping: 10, stiffness: 250 });
  };

  const handlePressOut = () => {
    if (state === 'idle') {
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
      translateY.value = withSpring(0, { damping: 12, stiffness: 200 });
    }
  };

  const bg = state === 'right' ? '#2E9E6B' : state === 'wrong' ? '#E63946' : color;

  return (
    <Animated.View style={[styles.btnWrap, animatedStyle]}>
      {/* Bursting Stars on Correct */}
      {state === 'right' && (
        <View style={styles.particlesContainer} pointerEvents="none">
          <StarParticle x={-28} y={-36} delay={0} />
          <StarParticle x={28} y={-36} delay={40} />
          <StarParticle x={-36} y={10} delay={80} />
          <StarParticle x={36} y={10} delay={60} />
          <StarParticle x={0} y={-44} delay={20} />
        </View>
      )}

      {/* Floating Success Badge */}
      {state === 'right' && (
        <Animated.View entering={FadeInUp.springify()} style={styles.rightBadge}>
          <Text style={styles.rightBadgeText}>Benar! 🌟</Text>
        </Animated.View>
      )}

      <Pressable
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[
          styles.btn,
          { backgroundColor: bg },
          state === 'wrong' && { opacity: 0.5 },
        ]}
      >
        {/* Gloss highlight effect for 3D toy tactile look */}
        <View style={styles.glossHighlight} />
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

/**
 * Big, colorful tactile 3D answer cards for kids.
 * Features realistic squish & bounce physics, star burst particles on correct,
 * and cartoon elastic wobble on wrong attempts.
 */
export function Choices({ choices, correct, onCorrect, onWrong }: Props) {
  const [wrongSet, setWrongSet] = useState<Set<string | number>>(new Set());
  const [solved, setSolved] = useState(false);

  const press = (c: string | number) => {
    if (solved) return;
    if (String(c) === String(correct)) {
      setSolved(true);
      SoundService.correct();
      onCorrect();
    } else {
      SoundService.wrong();
      setWrongSet((s) => new Set(s).add(c));
      onWrong();
    }
  };

  return (
    <View style={styles.row}>
      {choices.map((c, i) => {
        const isRight = solved && String(c) === String(correct);
        const isWrong = wrongSet.has(c);
        return (
          <ChoiceButton
            key={String(c)}
            label={String(c)}
            color={PALETTE[i % PALETTE.length]}
            state={isRight ? 'right' : isWrong ? 'wrong' : 'idle'}
            disabled={solved || isWrong}
            onPress={() => press(c)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  btnWrap: {
    minWidth: '28%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    minWidth: 84,
    borderRadius: radius.lg,
    paddingVertical: 18,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 6,
    borderBottomColor: 'rgba(0,0,0,0.25)',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
  },
  btnText: {
    fontSize: fontSize.title + 6,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },
  glossHighlight: {
    position: 'absolute',
    top: 4,
    left: '12%',
    right: '12%',
    height: '26%',
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 8,
  },
  particlesContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  starParticle: {
    position: 'absolute',
    fontSize: 22,
  },
  rightBadge: {
    position: 'absolute',
    top: -24,
    backgroundColor: '#FFE600',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 2,
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  rightBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#2B2B2B',
  },
});
