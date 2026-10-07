import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GAMES } from '../../games/registry';
import { SoundService } from '../../../core/sound/SoundService';
import { colors, fontSize, radius, spacing } from '../../theme';

const TAB_BAR_SPACE = 84;

export function GamesScreen() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = GAMES.find((g) => g.id === activeId);

  if (active) {
    const Game = active.Component;
    return (
      <View style={{ flex: 1, paddingBottom: TAB_BAR_SPACE, backgroundColor: colors.background }}>
        <Game key={active.id} onExit={() => setActiveId(null)} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.hint}>Pilih permainan, bismillah! 🎮</Text>
      <View style={styles.grid}>
        {GAMES.map((g, i) => (
          <Animated.View key={g.id} entering={FadeInDown.delay(i * 50)} style={styles.cell}>
            <Pressable onPress={() => { SoundService.tap(); setActiveId(g.id); }} style={[styles.card, { backgroundColor: g.color }]}>
              <Text style={styles.emoji}>{g.emoji}</Text>
              <Text style={styles.title}>{g.title}</Text>
              <Text style={styles.concept}>{g.concept}</Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 120 },
  hint: { fontSize: fontSize.body, fontWeight: '800', color: colors.text, margin: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '50%', padding: spacing.sm },
  card: { borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', minHeight: 160, justifyContent: 'center' },
  emoji: { fontSize: 44 },
  title: { fontSize: 16, fontWeight: '800', color: colors.text, textAlign: 'center', marginTop: 6 },
  concept: { fontSize: 13, color: colors.text, textAlign: 'center', opacity: 0.8 },
});
