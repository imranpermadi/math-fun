import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../../theme';

interface Props {
  emoji: string;
  title: string;
  subtitle: string;
  tint: string;
}

export function PlaceholderScreen({ emoji, title, subtitle, tint }: Props) {
  return (
    <View style={styles.root}>
      <View style={[styles.card, { backgroundColor: tint }]}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, justifyContent: 'center' },
  card: { borderRadius: radius.lg, padding: spacing.xl, alignItems: 'center' },
  emoji: { fontSize: 72, marginBottom: spacing.md },
  title: { fontSize: fontSize.title, fontWeight: '800', color: colors.text, textAlign: 'center' },
  sub: { fontSize: fontSize.body, color: colors.text, marginTop: spacing.sm, textAlign: 'center' },
});

