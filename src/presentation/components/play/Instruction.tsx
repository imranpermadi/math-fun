import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SoundService } from '../../../core/sound/SoundService';
import { colors, fontSize, radius, spacing } from '../../theme';

/** Instruction card. Tap 🔊 to hear it read aloud (helps kids who can't read well yet). */
export function Instruction({ text }: { text: string }) {
  return (
    <Animated.View entering={FadeInDown} style={styles.card}>
      <Text style={styles.text}>{text}</Text>
      <Pressable style={styles.speaker} onPress={() => SoundService.speak(text)} hitSlop={10}>
        <Text style={styles.speakerIcon}>🔊</Text>
      </Pressable>
    </Animated.View>
  );
}

export function Row({ children, gap = spacing.sm }: { children: React.ReactNode; gap?: number }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap, justifyContent: 'center' }}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  text: { flex: 1, fontSize: fontSize.body, color: colors.text, fontWeight: '600', lineHeight: 26 },
  speaker: { backgroundColor: colors.sky, borderRadius: radius.pill, width: 46, height: 46, alignItems: 'center', justifyContent: 'center' },
  speakerIcon: { fontSize: 24 },
});

