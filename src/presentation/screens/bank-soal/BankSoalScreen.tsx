import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SettingsBar } from '../../components/common/SettingsBar';
import { QuizRunner } from '../../components/common/QuizRunner';
import { useAppStore } from '../../stores/useAppStore';
import { colors, spacing } from '../../theme';

export function BankSoalScreen() {
  const { grade, difficulty } = useAppStore();
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <SettingsBar />
      <View>
        {/* key resets the round when settings change */}
        <QuizRunner key={`${grade}-${difficulty}`} grade={grade} difficulty={difficulty} totalQuestions={5} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 120, gap: spacing.md },
});
