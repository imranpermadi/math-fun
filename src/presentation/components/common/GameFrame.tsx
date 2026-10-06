import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../../theme';

interface Props {
  emoji: string;
  title: string;
  concept: string;
  onExit: () => void;
  children?: React.ReactNode;
}

export function GameFrame({ emoji, title, concept, onExit, children }: Props) {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Pressable onPress={onExit} style={styles.back}><Text style={styles.backText}>← Kembali</Text></Pressable>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.concept}>{concept}</Text>
      {children ?? (
        <View style={styles.soon}>
          <Text style={styles.soonText}>🚧 Segera hadir, insya Allah!</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 120, gap: spacing.md },
  back: { alignSelf: 'flex-start', backgroundColor: colors.card, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 8 },
  backText: { fontWeight: '800', color: colors.primaryDark, fontSize: 16 },
  emoji: { fontSize: 64, textAlign: 'center' },
  title: { fontSize: fontSize.title, fontWeight: '800', color: colors.text, textAlign: 'center' },
  concept: { fontSize: 16, color: colors.textMuted, textAlign: 'center' },
  soon: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.xl, alignItems: 'center' },
  soonText: { fontSize: fontSize.body, fontWeight: '700', color: colors.text },
});

