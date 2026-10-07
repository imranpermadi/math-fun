import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Operation } from '../../../domain/enums';
import { Question } from '../../../domain/entities/Question';
import { questionGenerator } from '../../../core/di/container';
import { SoundService } from '../../../core/sound/SoundService';
import { GameShell, RoundApi } from '../../components/play/GameShell';
import { Choices } from '../../components/play/Choices';
import { Instruction } from '../../components/play/Instruction';
import { SettingsBar } from '../../components/common/SettingsBar';
import { useAppStore } from '../../stores/useAppStore';
import { colors, fontSize, radius, spacing } from '../../theme';

const TAB_BAR_SPACE = 84;
const SIGN: Record<Operation, string> = {
  [Operation.Addition]: '+', [Operation.Subtraction]: '−', [Operation.Multiplication]: '×', [Operation.Division]: '÷',
};
const ICON: Record<string, string> = {
  kurma: '🟤', koin: '🪙', sandal: '🩴', halaman: '📖', sajadah: '🟩', ayat: '📜',
  jamaah: '🧑', gorengan: '🍤', paket: '📦', 'Al-Quran': '📗', butir: '🟤',
};

function Items({ n, icon, faded = 0 }: { n: number; icon: string; faded?: number }) {
  return (
    <View style={styles.items}>
      {Array.from({ length: Math.min(n, 30) }, (_, i) => (
        <Animated.Text key={i} entering={ZoomIn.delay(i * 25)} style={[styles.icon, i >= n - faded && { opacity: 0.25 }]}>{icon}</Animated.Text>
      ))}
    </View>
  );
}

function Visual({ q }: { q: Question }) {
  const [a, b] = q.operands;
  const icon = ICON[q.unit] ?? '⭐';
  if (q.operation === Operation.Addition && a + b <= 30) {
    return <View style={styles.visual}><Items n={a} icon={icon} /><Text style={styles.plus}>+</Text><Items n={b} icon={icon} /></View>;
  }
  if (q.operation === Operation.Subtraction && a <= 30) {
    return <View style={styles.visual}><Items n={a} icon={icon} faded={b} /><Text style={styles.cap}>yang pudar = dikurangi {b}</Text></View>;
  }
  if (q.operation === Operation.Multiplication && a <= 6 && b <= 6) {
    return (
      <View style={styles.visual}>
        {Array.from({ length: a }, (_, i) => <View key={i} style={styles.group}><Items n={b} icon={icon} /></View>)}
      </View>
    );
  }
  if (q.operation === Operation.Division && a <= 30) {
    return <View style={styles.visual}><Items n={a} icon={icon} /><Text style={styles.cap}>dibagi rata untuk {b}</Text></View>;
  }
  return null;
}

function Round({ grade, difficulty, onCorrect, onWrong }: RoundApi) {
  const [q] = useState(() => questionGenerator.generate({ grade, difficulty }));
  const [choices] = useState(() => questionGenerator.generateChoices(q, 3));
  return (
    <ScrollView contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.md }} showsVerticalScrollIndicator={false}>
      <Instruction text={q.text} />
      <Visual q={q} />
      <Text style={styles.eq}>{q.operands[0]} {SIGN[q.operation]} {q.operands[1]} = ?</Text>
      <Choices choices={choices} correct={q.answer} onCorrect={onCorrect} onWrong={onWrong} />
    </ScrollView>
  );
}

export function BankSoalScreen() {
  const { grade, difficulty } = useAppStore();
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <View style={{ flex: 1, paddingBottom: TAB_BAR_SPACE, backgroundColor: colors.background }}>
        <GameShell key={`${grade}-${difficulty}`} gameId="bank-soal" emoji="📝" title="Bank Soal"
          onExit={() => setPlaying(false)} renderRound={(api) => <Round {...api} />} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <SettingsBar />
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>📝</Text>
        <Text style={styles.heroTitle}>5 Soal Cerita Acak</Text>
        <Text style={styles.heroSub}>Soal dibuat otomatis setiap kali main. Pilih jawabannya, tekan 🔊 untuk didengarkan!</Text>
        <Pressable style={styles.start} onPress={() => { SoundService.tap(); setPlaying(true); }}>
          <Text style={styles.startText}>Mulai ▶</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 120, gap: spacing.md },
  hero: { backgroundColor: colors.secondary, borderRadius: radius.lg, padding: spacing.xl, alignItems: 'center', gap: spacing.sm },
  heroEmoji: { fontSize: 64 },
  heroTitle: { fontSize: fontSize.title, fontWeight: '900', color: colors.text },
  heroSub: { fontSize: 16, fontWeight: '600', color: colors.text, textAlign: 'center' },
  start: { backgroundColor: colors.primary, borderRadius: radius.pill, paddingVertical: 14, paddingHorizontal: 48, marginTop: spacing.sm },
  startText: { color: '#fff', fontSize: 22, fontWeight: '900' },
  visual: { backgroundColor: '#fff', borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' },
  items: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '100%' },
  icon: { fontSize: 26 },
  plus: { fontSize: 32, fontWeight: '900', color: colors.primaryDark },
  cap: { width: '100%', textAlign: 'center', fontWeight: '700', color: colors.textMuted },
  group: { backgroundColor: '#FFF7DC', borderRadius: radius.md, padding: 6, margin: 3 },
  eq: { textAlign: 'center', fontSize: 38, fontWeight: '900', color: colors.primaryDark },
});
