import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Operation } from '../../../domain/enums';
import { Question } from '../../../domain/entities/Question';
import { Difficulty } from '../../../domain/enums';
import { questionGenerator } from '../../../core/di/container';
import { useAppStore } from '../../stores/useAppStore';
import { SoundService } from '../../../core/sound/SoundService';
import { colors, fontSize, radius, spacing } from '../../theme';

const OPS: { op: Operation; label: string; sign: string; emoji: string }[] = [
  { op: Operation.Addition, label: 'Tambah', sign: '+', emoji: '➕' },
  { op: Operation.Subtraction, label: 'Kurang', sign: '−', emoji: '➖' },
  { op: Operation.Multiplication, label: 'Kali', sign: '×', emoji: '✖️' },
  { op: Operation.Division, label: 'Bagi', sign: '÷', emoji: '➗' },
];

const MAX_ICONS = 20;

function Dates({ n, dim }: { n: number; dim?: boolean }) {
  const [counted, setCounted] = useState(0);
  const tap = () => {
    const next = counted >= n ? 1 : counted + 1;
    setCounted(next);
    SoundService.pop();
    SoundService.speak(String(next));
  };
  return (
    <View style={styles.dates}>
      {Array.from({ length: Math.min(n, MAX_ICONS) }, (_, i) => (
        <Pressable key={i} onPress={tap} hitSlop={4}>
          <Animated.Text entering={ZoomIn.delay(i * 40)} style={[styles.date, dim && { opacity: 0.35 }, i < counted && styles.counted]}>
            {i < counted ? '🟠' : '🟤'}
          </Animated.Text>
        </Pressable>
      ))}
      {n > MAX_ICONS && <Text style={styles.more}>+{n - MAX_ICONS}</Text>}
      {counted > 0 && <Text style={styles.more}>= {counted}</Text>}
    </View>
  );
}

function Visual({ q }: { q: Question }) {
  const [a, b] = q.operands;
  return (
    <View style={{ gap: spacing.sm }}>
      <Dates n={a} />
      <Text style={styles.sign}>{OPS.find((o) => o.op === q.operation)?.sign} {b}</Text>
      {q.operation === Operation.Addition && <Dates n={b} />}
      <Text style={styles.answerHint}>= ?</Text>
    </View>
  );
}

export function MateriScreen() {
  const grade = useAppStore((s) => s.grade);
  const [op, setOp] = useState<Operation | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [reveal, setReveal] = useState(false);

  const available = OPS.filter((o) => {
    try { questionGenerator.generate({ grade, difficulty: Difficulty.Easy, operation: o.op }); return true; } catch { return false; }
  });

  const pick = (o: Operation) => {
    setOp(o);
    setReveal(false);
    setQuestion(questionGenerator.generate({ grade, difficulty: Difficulty.Easy, operation: o }));
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.hint}>Bismillah, ayo belajar! Pilih materi (Kelas {grade}):</Text>
      <View style={styles.grid}>
        {available.map((o) => (
          <Pressable key={o.op} onPress={() => pick(o.op)} style={[styles.opCard, op === o.op && styles.opActive]}>
            <Text style={styles.opEmoji}>{o.emoji}</Text>
            <Text style={styles.opLabel}>{o.label}</Text>
          </Pressable>
        ))}
      </View>
      {question && (
        <Animated.View key={question.id} entering={FadeIn} style={styles.card}>
          <Text style={styles.q}>{question.text}</Text>
          <Visual q={question} />
          <Pressable style={styles.btn} onPress={() => setReveal(true)}>
            <Text style={styles.btnText}>Lihat Jawaban</Text>
          </Pressable>
          {reveal && <Text style={styles.answer}>Jawaban: {question.answer} {question.unit} ✅</Text>}
          <Pressable style={[styles.btn, { backgroundColor: colors.secondary }]} onPress={() => op && pick(op)}>
            <Text style={[styles.btnText, { color: colors.text }]}>Contoh Lain</Text>
          </Pressable>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 120, gap: spacing.md },
  hint: { fontSize: fontSize.body, fontWeight: '700', color: colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  opCard: { width: '47%', backgroundColor: colors.sky, borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center' },
  opActive: { borderWidth: 4, borderColor: colors.primary },
  opEmoji: { fontSize: 40 },
  opLabel: { fontSize: fontSize.body, fontWeight: '800', color: colors.text },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  q: { fontSize: fontSize.body, color: colors.text, lineHeight: 26 },
  dates: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  date: { fontSize: 26 },
  counted: { transform: [{ scale: 1.25 }] },
  more: { fontSize: 18, fontWeight: '800', alignSelf: 'center' },
  sign: { fontSize: 28, fontWeight: '800', color: colors.primaryDark },
  answerHint: { fontSize: 28, fontWeight: '800', color: colors.accent },
  btn: { backgroundColor: colors.primary, borderRadius: radius.pill, paddingVertical: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '800', fontSize: fontSize.body },
  answer: { fontSize: fontSize.body + 2, fontWeight: '800', color: colors.primaryDark, textAlign: 'center' },
});
