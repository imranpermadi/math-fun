import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Difficulty, Grade } from '../../../domain/enums';
import { useAppStore } from '../../stores/useAppStore';
import { colors, radius, spacing } from '../../theme';

const GRADES = [Grade.One, Grade.Two, Grade.Three];
const DIFFS: { v: Difficulty; label: string }[] = [
  { v: Difficulty.Easy, label: 'Mudah' },
  { v: Difficulty.Medium, label: 'Sedang' },
  { v: Difficulty.Hard, label: 'Sulit' },
];

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

export function SettingsBar() {
  const { grade, difficulty, setGrade, setDifficulty, stars } = useAppStore();
  return (
    <View style={styles.wrap}>
      <Text style={styles.stars}>⭐ {stars} Bintang Pahala</Text>
      <View style={styles.row}>
        {GRADES.map((g) => <Chip key={g} label={`Kelas ${g}`} active={g === grade} onPress={() => setGrade(g)} />)}
      </View>
      <View style={styles.row}>
        {DIFFS.map((d) => <Chip key={d.v} label={d.label} active={d.v === difficulty} onPress={() => setDifficulty(d.v)} />)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  stars: { fontSize: 18, fontWeight: '800', color: colors.accent },
  row: { flexDirection: 'row', gap: spacing.sm },
  chip: { flex: 1, backgroundColor: colors.card, borderRadius: radius.pill, paddingVertical: 10, alignItems: 'center', borderWidth: 2, borderColor: colors.primary },
  chipActive: { backgroundColor: colors.primary },
  chipText: { fontWeight: '800', color: colors.primaryDark },
});

