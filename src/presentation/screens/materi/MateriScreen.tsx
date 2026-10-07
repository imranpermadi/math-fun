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

interface OpItem {
  op: Operation;
  label: string;
  sign: string;
  emoji: string;
  methodName: string;
  methodDesc: string;
}

const OPS: OpItem[] = [
  {
    op: Operation.Addition,
    label: 'Penjumlahan',
    sign: '+',
    emoji: '➕',
    methodName: 'Metode Dekomposisi (Pecah Nilai Tempat)',
    methodDesc: 'Memecah setiap bilangan menjadi nilai puluhan dan satuan agar mudah dijumlahkan.',
  },
  {
    op: Operation.Subtraction,
    label: 'Pengurangan',
    sign: '−',
    emoji: '➖',
    methodName: 'Metode Dekomposisi (Pecah Nilai Tempat)',
    methodDesc: 'Memecah bilangan menjadi puluhan dan satuan, lalu kurangkan masing-masing kelompok.',
  },
  {
    op: Operation.Multiplication,
    label: 'Perkalian',
    sign: '×',
    emoji: '✖️',
    methodName: 'Metode Penjumlahan Berulang',
    methodDesc: 'A × B adalah penjumlahan bilangan B sebanyak A kali.',
  },
  {
    op: Operation.Division,
    label: 'Pembagian',
    sign: '÷',
    emoji: '➗',
    methodName: 'Metode Pengurangan Berulang',
    methodDesc: 'A ÷ B adalah pengurangan bilangan A dengan B secara berulang sampai tersisa 0.',
  },
];

export function MateriScreen() {
  const grade = useAppStore((s) => s.grade);
  const [selectedOp, setSelectedOp] = useState<Operation>(Operation.Addition);
  const [subTab, setSubTab] = useState<'buku' | 'latihan'>('buku');
  const [step, setStep] = useState(1);

  // Question generator for practice
  const [question, setQuestion] = useState<Question>(() =>
    questionGenerator.generate({ grade, difficulty: Difficulty.Easy, operation: Operation.Addition })
  );
  const [choices, setChoices] = useState<number[]>(() =>
    questionGenerator.generateChoices(question, 3)
  );
  const [reveal, setReveal] = useState(false);

  const activeOp = OPS.find((o) => o.op === selectedOp) ?? OPS[0];

  const pickOp = (op: Operation) => {
    setSelectedOp(op);
    setStep(1);
    setReveal(false);
    try {
      const q = questionGenerator.generate({ grade, difficulty: Difficulty.Easy, operation: op });
      setQuestion(q);
      setChoices(questionGenerator.generateChoices(q, 3));
    } catch {
      /* fallback */
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Grade Banner */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buku Pelajaran Matematika SD</Text>
        <Text style={styles.headerSub}>Kelas {grade} · Kurikulum Khazanah Edukasi</Text>
      </View>

      {/* Operation Selection Bar */}
      <View style={styles.opGrid}>
        {OPS.map((o) => {
          const isSelected = selectedOp === o.op;
          return (
            <Pressable
              key={o.op}
              onPress={() => {
                SoundService.tap();
                pickOp(o.op);
              }}
              style={[styles.opCard, isSelected && styles.opCardActive]}
            >
              <Text style={styles.opEmoji}>{o.emoji}</Text>
              <Text style={[styles.opLabel, isSelected && styles.opLabelActive]}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Mode Sub-tabs: Metode Buku SD vs Latihan Soal */}
      <View style={styles.tabSwitch}>
        <Pressable
          onPress={() => {
            SoundService.tap();
            setSubTab('buku');
          }}
          style={[styles.switchBtn, subTab === 'buku' && styles.switchBtnActive]}
        >
          <Text style={[styles.switchText, subTab === 'buku' && styles.switchTextActive]}>
            📖 Metode Buku SD
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            SoundService.tap();
            setSubTab('latihan');
          }}
          style={[styles.switchBtn, subTab === 'latihan' && styles.switchBtnActive]}
        >
          <Text style={[styles.switchText, subTab === 'latihan' && styles.switchTextActive]}>
            🎯 Latihan Ceria
          </Text>
        </Pressable>
      </View>

      {/* View 1: Metode Buku Pelajaran SD */}
      {subTab === 'buku' && (
        <Animated.View entering={FadeIn} style={styles.methodCard}>
          <View style={styles.methodBadge}>
            <Text style={styles.methodBadgeText}>{activeOp.methodName}</Text>
          </View>
          <Text style={styles.methodDesc}>{activeOp.methodDesc}</Text>

          {/* Addition / Subtraction: Interactive Decomposition */}
          {(selectedOp === Operation.Addition || selectedOp === Operation.Subtraction) && (
            <View style={styles.decomSample}>
              <Text style={styles.sampleTitle}>
                {selectedOp === Operation.Addition ? 'Contoh: 34 + 23 = ?' : 'Contoh: 58 − 23 = ?'}
              </Text>

              {/* Step 1 */}
              <View style={[styles.stepItem, step >= 1 && styles.stepItemActive]}>
                <Text style={styles.stepNum}>1</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepHeader}>Pecah Nilai Puluhan dan Satuan</Text>
                  {selectedOp === Operation.Addition ? (
                    <Text style={styles.mathStep}>
                      34 = <Text style={styles.boldBlue}>30</Text> + <Text style={styles.boldGreen}>4</Text>
                      {'\n'}
                      23 = <Text style={styles.boldBlue}>20</Text> + <Text style={styles.boldGreen}>3</Text>
                    </Text>
                  ) : (
                    <Text style={styles.mathStep}>
                      58 = <Text style={styles.boldBlue}>50</Text> + <Text style={styles.boldGreen}>8</Text>
                      {'\n'}
                      23 = <Text style={styles.boldBlue}>20</Text> + <Text style={styles.boldGreen}>3</Text>
                    </Text>
                  )}
                </View>
              </View>

              {/* Step 2 */}
              <View style={[styles.stepItem, step >= 2 && styles.stepItemActive]}>
                <Text style={styles.stepNum}>2</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepHeader}>Hitung Puluhan dengan Puluhan, Satuan dengan Satuan</Text>
                  {selectedOp === Operation.Addition ? (
                    <Text style={styles.mathStep}>
                      Puluhan: 30 + 20 = <Text style={styles.boldBlue}>50</Text>
                      {'\n'}
                      Satuan : 4 + 3   = <Text style={styles.boldGreen}>7</Text>
                    </Text>
                  ) : (
                    <Text style={styles.mathStep}>
                      Puluhan: 50 − 20 = <Text style={styles.boldBlue}>30</Text>
                      {'\n'}
                      Satuan : 8 − 3   = <Text style={styles.boldGreen}>5</Text>
                    </Text>
                  )}
                </View>
              </View>

              {/* Step 3 */}
              <View style={[styles.stepItem, step >= 3 && styles.stepItemActive]}>
                <Text style={styles.stepNum}>3</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepHeader}>Gabungkan Hasil Akhirnya</Text>
                  {selectedOp === Operation.Addition ? (
                    <Text style={[styles.mathStep, styles.finalStep]}>50 + 7 = 57 🎉</Text>
                  ) : (
                    <Text style={[styles.mathStep, styles.finalStep]}>30 + 5 = 35 🎉</Text>
                  )}
                </View>
              </View>

              {/* Step Navigator */}
              <View style={styles.stepNav}>
                <Pressable
                  disabled={step <= 1}
                  onPress={() => {
                    SoundService.pop();
                    setStep((s) => s - 1);
                  }}
                  style={[styles.stepNavBtn, step <= 1 && styles.stepNavBtnDisabled]}
                >
                  <Text style={styles.stepNavText}>◀ Langkah Sebelumnya</Text>
                </Pressable>
                <Pressable
                  disabled={step >= 3}
                  onPress={() => {
                    SoundService.pop();
                    setStep((s) => s + 1);
                  }}
                  style={[styles.stepNavBtn, step >= 3 && styles.stepNavBtnDisabled]}
                >
                  <Text style={styles.stepNavText}>Langkah Berikutnya ▶</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Multiplication: Repeated Addition */}
          {selectedOp === Operation.Multiplication && (
            <View style={styles.decomSample}>
              <Text style={styles.sampleTitle}>Contoh: 3 × 4 = ?</Text>
              <Text style={styles.sampleSub}>
                Artinya ada <Text style={styles.boldBlue}>3 piring</Text>, masing-masing berisi <Text style={styles.boldGreen}>4 kue</Text>.
              </Text>

              <View style={styles.plateRow}>
                {[1, 2, 3].map((p) => (
                  <View key={p} style={styles.plate}>
                    <Text style={styles.plateEmoji}>🧁🧁{'\n'}🧁🧁</Text>
                    <Text style={styles.plateLabel}>Piring {p}: 4</Text>
                  </View>
                ))}
              </View>

              <View style={styles.repeatedBox}>
                <Text style={styles.repeatedTitle}>Bentuk Penjumlahan Berulang:</Text>
                <Text style={styles.repeatedFormula}>4 + 4 + 4 = 12</Text>
                <Text style={styles.repeatedNote}>Angka 4 dijumlahkan sebanyak 3 kali.</Text>
              </View>
            </View>
          )}

          {/* Division: Repeated Subtraction */}
          {selectedOp === Operation.Division && (
            <View style={styles.decomSample}>
              <Text style={styles.sampleTitle}>Contoh: 12 ÷ 3 = ?</Text>
              <Text style={styles.sampleSub}>
                Pengurangan berulang: Kurangkan 12 dengan 3 terus-menerus sampai habis (0).
              </Text>

              <View style={styles.subtractionSteps}>
                <Text style={styles.subStepItem}>12 − 3 = 9  (Pengurangan ke-1)</Text>
                <Text style={styles.subStepItem}> 9 − 3 = 6  (Pengurangan ke-2)</Text>
                <Text style={styles.subStepItem}> 6 − 3 = 3  (Pengurangan ke-3)</Text>
                <Text style={styles.subStepItem}> 3 − 3 = 0  (Pengurangan ke-4) ✅</Text>
              </View>

              <View style={styles.repeatedBox}>
                <Text style={styles.repeatedTitle}>Kesimpulan Buku SD:</Text>
                <Text style={styles.repeatedFormula}>12 ÷ 3 = 4</Text>
                <Text style={styles.repeatedNote}>Karena pengurangan dilakukan sebanyak 4 kali.</Text>
              </View>
            </View>
          )}
        </Animated.View>
      )}

      {/* View 2: Latihan Ceria */}
      {subTab === 'latihan' && question && (
        <Animated.View key={question.id} entering={FadeIn} style={styles.practiceCard}>
          <Instruction text={question.text} />

          <Text style={styles.sectionHeader}>Ayo Coba Jawab! 🎯</Text>
          <Choices
            choices={choices}
            correct={question.answer}
            onCorrect={() => setReveal(true)}
            onWrong={() => {}}
          />

          {reveal && (
            <Animated.View entering={BounceIn} style={styles.answerBox}>
              <Text style={styles.answer}>
                Alhamdulillah, Benar! Jawaban: {question.answer} {question.unit} ✅
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
                <Text style={styles.hintBtnText}>Lihat Kunci 💡</Text>
              </Pressable>
            )}
            <Pressable
              style={styles.nextBtn}
              onPress={() => {
                SoundService.tap();
                pickOp(selectedOp);
              }}
            >
              <Text style={styles.nextBtnText}>Soal Lain 🔄</Text>
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
  header: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EFE6D5',
  },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.text },
  headerSub: { fontSize: 14, fontWeight: '700', color: colors.primaryDark, marginTop: 2 },
  opGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  opCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderBottomWidth: 4,
    borderBottomColor: '#D1D5DB',
  },
  opCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#F0FFF4',
    borderBottomColor: colors.primaryDark,
  },
  opEmoji: { fontSize: 32 },
  opLabel: { fontSize: 15, fontWeight: '800', color: colors.text, marginTop: 4 },
  opLabelActive: { color: colors.primaryDark },
  tabSwitch: {
    flexDirection: 'row',
    backgroundColor: '#EBE5D8',
    borderRadius: radius.pill,
    padding: 4,
    gap: 6,
  },
  switchBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  switchBtnActive: { backgroundColor: colors.primary },
  switchText: { fontSize: 14, fontWeight: '800', color: colors.text },
  switchTextActive: { color: '#fff' },
  methodCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 2,
    borderColor: '#EFE6D5',
  },
  methodBadge: {
    alignSelf: 'center',
    backgroundColor: '#FFF7DC',
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.secondary,
  },
  methodBadgeText: { fontSize: 13, fontWeight: '900', color: '#B45309' },
  methodDesc: { fontSize: 14, fontWeight: '600', color: colors.text, textAlign: 'center', lineHeight: 20 },
  decomSample: {
    backgroundColor: '#FDFBF7',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: '#E5E0D8',
    gap: spacing.sm,
  },
  sampleTitle: { fontSize: 18, fontWeight: '900', color: colors.primaryDark, textAlign: 'center' },
  sampleSub: { fontSize: 13, fontWeight: '700', color: colors.textMuted, textAlign: 'center' },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    opacity: 0.5,
  },
  stepItemActive: { opacity: 1, borderColor: colors.primary },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 26,
    fontSize: 15,
    fontWeight: '900',
  },
  stepHeader: { fontSize: 13, fontWeight: '800', color: colors.textMuted },
  mathStep: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 4, lineHeight: 24 },
  boldBlue: { color: '#0077B6', fontWeight: '900' },
  boldGreen: { color: colors.primaryDark, fontWeight: '900' },
  finalStep: { fontSize: 20, color: colors.primaryDark, fontWeight: '900' },
  stepNav: { flexDirection: 'row', gap: 10, marginTop: 8 },
  stepNavBtn: {
    flex: 1,
    backgroundColor: colors.sky,
    borderRadius: radius.pill,
    paddingVertical: 10,
    alignItems: 'center',
  },
  stepNavBtnDisabled: { opacity: 0.35 },
  stepNavText: { fontSize: 12, fontWeight: '900', color: colors.text },
  plateRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginVertical: 8 },
  plate: {
    backgroundColor: '#FFF7DC',
    borderRadius: radius.md,
    padding: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  plateEmoji: { fontSize: 22, textAlign: 'center' },
  plateLabel: { fontSize: 12, fontWeight: '800', color: '#8B5E34', marginTop: 4 },
  repeatedBox: {
    backgroundColor: '#D8F3DC',
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  repeatedTitle: { fontSize: 13, fontWeight: '800', color: colors.primaryDark },
  repeatedFormula: { fontSize: 24, fontWeight: '900', color: colors.primaryDark },
  repeatedNote: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  subtractionSteps: {
    backgroundColor: '#fff',
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  subStepItem: { fontSize: 16, fontWeight: '800', color: colors.text },
  practiceCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 2,
    borderColor: '#EFE6D5',
  },
  sectionHeader: { fontSize: 16, fontWeight: '800', color: colors.primaryDark, textAlign: 'center' },
  answerBox: {
    backgroundColor: '#D8F3DC',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.primaryDark,
    alignItems: 'center',
  },
  answer: { fontSize: 18, fontWeight: '900', color: colors.primaryDark, textAlign: 'center' },
  actionRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md },
  hintBtn: {
    backgroundColor: '#FFE8B0',
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  hintBtnText: { color: '#8B5E34', fontWeight: '800', fontSize: 15 },
  nextBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  nextBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
