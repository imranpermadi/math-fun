import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  BounceIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SoundService } from '../../../core/sound/SoundService';
import { colors, fontSize, radius, spacing } from '../../theme';

interface BubbleKeyProps {
  value: string;
  color: string;
  onPress: (val: string) => void;
  disabled?: boolean;
}

const KEY_PALETTE: Record<string, string> = {
  '1': '#38B000', // Apple green
  '2': '#0096C7', // Sky ocean
  '3': '#7209B7', // Purple
  '4': '#F72585', // Bubblegum pink
  '5': '#FB8500', // Marigold orange
  '6': '#0077B6', // Royal blue
  '7': '#E63946', // Coral red
  '8': '#8338EC', // Violet
  '9': '#06D6A0', // Fresh mint
  '0': '#48CAE4', // Soft azure
};

function BubbleKey({ value, color, onPress, disabled }: BubbleKeyProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.92, { damping: 10, stiffness: 200 });
    translateY.value = withSpring(4, { damping: 10, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 180 });
    translateY.value = withSpring(0, { damping: 12, stiffness: 180 });
  };

  const handlePress = () => {
    if (disabled) return;
    SoundService.pop();
    onPress(value);
  };

  return (
    <Animated.View style={[styles.keyWrap, animStyle]}>
      <Pressable
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={[styles.bubbleKey, { backgroundColor: color }]}
      >
        <View style={styles.glossHighlight} />
        <Text style={styles.keyText}>{value}</Text>
      </Pressable>
    </Animated.View>
  );
}

interface ActionKeyProps {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
  flex?: number;
}

function ActionKey({ icon, label, color, onPress, disabled, flex = 1 }: ActionKeyProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.94);
    translateY.value = withSpring(4);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    translateY.value = withSpring(0);
  };

  return (
    <Animated.View style={[{ flex }, animStyle]}>
      <Pressable
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          if (disabled) return;
          SoundService.tap();
          onPress();
        }}
        style={[
          styles.actionKey,
          { backgroundColor: disabled ? '#E5E7EB' : color },
        ]}
      >
        <View style={styles.glossHighlight} />
        <Text style={[styles.actionIcon, disabled && { opacity: 0.4 }]}>{icon}</Text>
        {!!label && <Text style={[styles.actionLabel, disabled && { color: '#9CA3AF' }]}>{label}</Text>}
      </Pressable>
    </Animated.View>
  );
}

interface Props {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  maxDigits?: number;
  unit?: string;
  state?: 'idle' | 'right' | 'wrong';
  disabled?: boolean;
}

/**
 * Animated tactile number pad designed specifically for children.
 * Replaces standard boring system keyboards with colorful bouncy 3D bubble keys.
 */
export function BubbleNumpad({
  value,
  onChange,
  onSubmit,
  maxDigits = 4,
  unit,
  state = 'idle',
  disabled = false,
}: Props) {
  const submitScale = useSharedValue(1);
  const displayShake = useSharedValue(0);
  const displayScale = useSharedValue(1);

  // Pulse submit button when digits are entered
  useEffect(() => {
    if (value.length > 0 && state === 'idle') {
      submitScale.value = withRepeat(
        withSequence(withTiming(1.04, { duration: 400 }), withTiming(1.0, { duration: 400 })),
        -1,
        true
      );
    } else {
      submitScale.value = withSpring(1);
    }
  }, [value, state, submitScale]);

  // Answer validation animation
  useEffect(() => {
    if (state === 'wrong') {
      displayShake.value = withSequence(
        withTiming(-12, { duration: 50 }),
        withTiming(12, { duration: 80 }),
        withTiming(-8, { duration: 80 }),
        withTiming(0, { duration: 50 })
      );
    } else if (state === 'right') {
      displayScale.value = withSequence(withSpring(1.2), withSpring(1.05));
    } else {
      displayScale.value = withSpring(1);
    }
  }, [state, displayShake, displayScale]);

  const displayStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: displayShake.value }, { scale: displayScale.value }],
  }));

  const submitAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: submitScale.value }],
  }));

  const appendDigit = (d: string) => {
    if (value.length >= maxDigits) return;
    onChange(value + d);
  };

  const backspace = () => {
    if (value.length === 0) return;
    onChange(value.slice(0, -1));
  };

  const clear = () => {
    if (value.length === 0) return;
    onChange('');
  };

  const displayBg =
    state === 'right' ? '#D8F3DC' : state === 'wrong' ? '#FFE3E3' : '#FFFBEA';
  const displayBorder =
    state === 'right' ? colors.primaryDark : state === 'wrong' ? '#E63946' : colors.secondary;

  return (
    <View style={styles.container}>
      {/* Animated Answer Display Slot */}
      <Animated.View style={[styles.displaySlot, { backgroundColor: displayBg, borderColor: displayBorder }, displayStyle]}>
        <Text style={styles.slotLabel}>Jawabanmu:</Text>
        <View style={styles.bubbleRow}>
          {value.length === 0 ? (
            <Animated.View entering={BounceIn} style={styles.placeholderBubble}>
              <Text style={styles.placeholderText}>?</Text>
            </Animated.View>
          ) : (
            value.split('').map((char, idx) => (
              <Animated.View key={`${idx}-${char}`} entering={BounceIn.duration(260)} style={styles.digitBubble}>
                <View style={styles.glossHighlight} />
                <Text style={styles.digitText}>{char}</Text>
              </Animated.View>
            ))
          )}
          {!!unit && <Text style={styles.unitText}>{unit}</Text>}
        </View>
        {state === 'right' && (
          <Animated.Text entering={BounceIn} style={styles.statusPill}>
            Masya Allah, Benar! 🌟
          </Animated.Text>
        )}
        {state === 'wrong' && (
          <Animated.Text entering={BounceIn} style={[styles.statusPill, { color: '#E63946' }]}>
            Ayo coba lagi! 🤲
          </Animated.Text>
        )}
      </Animated.View>

      {/* Chunky Keypad Grid */}
      <View style={styles.padGrid}>
        <View style={styles.row}>
          <BubbleKey value="1" color={KEY_PALETTE['1']} onPress={appendDigit} disabled={disabled} />
          <BubbleKey value="2" color={KEY_PALETTE['2']} onPress={appendDigit} disabled={disabled} />
          <BubbleKey value="3" color={KEY_PALETTE['3']} onPress={appendDigit} disabled={disabled} />
        </View>
        <View style={styles.row}>
          <BubbleKey value="4" color={KEY_PALETTE['4']} onPress={appendDigit} disabled={disabled} />
          <BubbleKey value="5" color={KEY_PALETTE['5']} onPress={appendDigit} disabled={disabled} />
          <BubbleKey value="6" color={KEY_PALETTE['6']} onPress={appendDigit} disabled={disabled} />
        </View>
        <View style={styles.row}>
          <BubbleKey value="7" color={KEY_PALETTE['7']} onPress={appendDigit} disabled={disabled} />
          <BubbleKey value="8" color={KEY_PALETTE['8']} onPress={appendDigit} disabled={disabled} />
          <BubbleKey value="9" color={KEY_PALETTE['9']} onPress={appendDigit} disabled={disabled} />
        </View>
        <View style={styles.row}>
          <ActionKey icon="🗑️" label="" color="#E29578" flex={1} onPress={clear} disabled={disabled || value.length === 0} />
          <BubbleKey value="0" color={KEY_PALETTE['0']} onPress={appendDigit} disabled={disabled} />
          <ActionKey icon="⌫" label="" color="#FFB703" flex={1} onPress={backspace} disabled={disabled || value.length === 0} />
        </View>
      </View>

      {/* Prominent Bouncy Submit Button */}
      <Animated.View style={[styles.submitWrap, submitAnimStyle]}>
        <Pressable
          disabled={disabled || value.length === 0}
          onPress={() => {
            SoundService.tap();
            onSubmit();
          }}
          style={[
            styles.submitBtn,
            { backgroundColor: disabled || value.length === 0 ? '#CBD5E1' : colors.primary },
          ]}
        >
          <View style={styles.glossHighlight} />
          <Text style={styles.submitText}>Bismillah, Jawab! 🚀</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    alignItems: 'center',
    width: '100%',
  },
  displaySlot: {
    width: '100%',
    minHeight: 88,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  slotLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeholderBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.textMuted,
  },
  placeholderText: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textMuted,
  },
  digitBubble: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.25)',
  },
  digitText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
  },
  unitText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginLeft: 6,
  },
  statusPill: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  padGrid: {
    width: '100%',
    maxWidth: 320,
    gap: 10,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    justifyContent: 'center',
  },
  keyWrap: {
    flex: 1,
    aspectRatio: 1.15,
  },
  bubbleKey: {
    flex: 1,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(0,0,0,0.25)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  keyText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
  },
  actionKey: {
    flex: 1,
    aspectRatio: 1.15,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(0,0,0,0.25)',
    elevation: 4,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },
  glossHighlight: {
    position: 'absolute',
    top: 4,
    left: '15%',
    right: '15%',
    height: '24%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
  },
  submitWrap: {
    width: '100%',
    maxWidth: 320,
  },
  submitBtn: {
    width: '100%',
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 6,
    borderBottomColor: 'rgba(0,0,0,0.25)',
    elevation: 5,
  },
  submitText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },
});

