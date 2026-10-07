import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { BounceIn, FadeIn, ZoomIn } from 'react-native-reanimated';
import { Operation } from '../../../domain/enums';
import { Question } from '../../../domain/entities/Question';
import { Difficulty } from '../../../domain/enums';
import { questionGenerator } from '../../../core/di/container';
import { useAppStore } from '../../stores/useAppStore';
import { SoundService } from '../../../core/sound/SoundService';
import { Choices } from '../../components/play/Choices';
import { Instruction } from '../../components/play/Instruction';
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
          <Animated.Text
            entering={ZoomIn.delay(i * 40)}
            style={[styles.date, dim && { opacity: 0.35 }, i < counted && styles.counted]}
          >
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
    <View style={{ gap: spacing.sm, alignItems: 'center' }}>
      <Dates n={a} />
      <Text style={styles.sign}>
        {OPS.find((o) => o.op === q.operation)?.sign} {b}
      </Text>
      {q.operation === Operation.Addition && <Dates n={b} />}
      <Text style={styles.answerHint}>= ?</Text>
    </View>
  );
}

export function MateriScreen() {
  const grade = useAppStore((s) => s.grade);
  const [op, setOp] = useState<Operation | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [choices, setChoices] = useState<number[]>([]);
  const [reveal, setReveal] = useState(false);

  const available = OPS.filter((o) => {
    try {
      questionGenerator.generate({ grade, difficulty: Difficulty.Easy, operation: o.op });
      return true;
    } catch {
      return false;
    }
  });

  const pick = (o: Operation) => {
    setOp(o);
    setReveal(false);
    const q = questionGenerator.generate({ grade, difficulty: Difficulty.Easy, operation: o });
    setQuestion(q);
    setChoices(questionGenerator.generateChoices(q, 3));
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.hint}>Bismillah, ayo belajar! Pilih materi (Kelas {grade}):</Text>
      <View style={styles.grid}>
        {available.map((o) => (
          <Pressable
            key={o.op}
            onPress={() => {
              SoundService.tap();
              pick(o.op);
            }}
            style={[styles.opCard, op === o.op && styles.opActive]}
          >
            <Text style={styles.opEmoji}>{o.emoji}</Text>
            <Text style={styles.opLabel}>{o.label}</Text>
          </Pressable>
        ))}
      </View>
      {question && (
        <Animated.View key={question.id} entering={FadeIn} style={styles.card}>
          <Instruction text={question.text} />
          <Visual q={question} />

          <Text style={styles.sectionHeader}>Ayo Tebak Jawabannya! 🎯</Text>
          <Choices
            choices={choices}
            correct={question.answer}
            onCorrect={() => setReveal(true)}
            onWrong={() => {}}
          />

          {reveal && (
            <Animated.View entering={BounceIn} style={styles.answerBox}>
              <Text style={styles.answer}>
                Alhamdulillah! Jawabannya: {question.answer} {question.unit} ✅
              </Text>
            </Animated.View>
          )}

          <View style={styles.actionRow}>
            {!reveal && (
              <Pressable
                style={styles.hintBtn}
                onPress={() => {
                  SoundService.tap();
                  setReveal(true);
                }}
              >
                <Text style={styles.hintBtnText}>Buka Kunci 💡</Text>
              </Pressable>
            )}
            <Pressable
              style={styles.nextBtn}
              onPress={() => {
                SoundService.tap();
                if (op) pick(op);
              }}
            >
              <Text style={styles.nextBtnText}>Contoh Lain 🔄</Text>
            </Pressable>
          </View>
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
  opCard: {
    width: '47%',
    backgroundColor: colors.sky,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.15)',
  },
  opActive: { borderWidth: 4, borderColor: colors.primary },
  opEmoji: { fontSize: 40 },
  opLabel: { fontSize: fontSize.body, fontWeight: '800', color: colors.text, marginTop: 4 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'center',
    marginTop: 4,
  },
  dates: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, justifyContent: 'center' },
  date: { fontSize: 26 },
  counted: { transform: [{ scale: 1.25 }] },
  more: { fontSize: 18, fontWeight: '800', alignSelf: 'center' },
  sign: { fontSize: 28, fontWeight: '800', color: colors.primaryDark },
  answerHint: { fontSize: 28, fontWeight: '800', color: colors.accent },
  answerBox: {
    backgroundColor: '#D8F3DC',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.primaryDark,
    alignItems: 'center',
  },
  answer: {
    fontSize: fontSize.body + 2,
    fontWeight: '900',
    color: colors.primaryDark,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  hintBtn: {
    backgroundColor: '#FFE8B0',
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  hintBtnText: {
    color: '#8B5E34',
    fontWeight: '800',
    fontSize: 15,
  },
  nextBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  nextBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
});
