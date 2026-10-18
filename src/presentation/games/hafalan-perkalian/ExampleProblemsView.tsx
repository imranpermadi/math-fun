import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { MULTIPLICATION_EXAMPLES, MultiplicationExample } from './examples';
import { MULTI_COLORS } from './logic';
import { SoundService } from '../../../core/sound/SoundService';
import { colors, radius, spacing } from '../../theme';

interface Props {
  targetN: number;
}

export function ExampleProblemsView({ targetN }: Props) {
  const examples: MultiplicationExample[] = MULTIPLICATION_EXAMPLES[targetN] || [];
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentEx = examples[activeIdx] || examples[0];
  const themeColor = MULTI_COLORS[targetN] || colors.primary;

  const handleSelectExample = (idx: number) => {
    SoundService.pop();
    setActiveIdx(idx);
    setSelectedQuizAnswer(null);
    setShowExplanation(false);
  };

  const handleSpeech = () => {
    if (!currentEx) return;
    SoundService.speak(`${currentEx.story}. ${currentEx.question}`);
  };

  const handleAnswerQuiz = (choice: number) => {
    if (!currentEx) return;
    setSelectedQuizAnswer(choice);
    setShowExplanation(true);
    if (choice === currentEx.practiceQuiz.answer) {
      SoundService.correct();
    } else {
      SoundService.wrong();
    }
  };

  if (!currentEx) {
    return (
      <View style={styles.card}>
        <Text style={styles.emptyText}>Contoh soal untuk perkalian ini sedang disiapkan.</Text>
      </View>
    );
  }

  const isQuizCorrect = selectedQuizAnswer === currentEx.practiceQuiz.answer;

  return (
    <View style={styles.container}>
      {/* Selector between Example 1 and Example 2 */}
      {examples.length > 1 && (
        <View style={styles.selectorRow}>
          {examples.map((ex, idx) => {
            const isSelected = activeIdx === idx;
            return (
              <Pressable
                key={ex.id}
                onPress={() => handleSelectExample(idx)}
                style={[
                  styles.selectorChip,
                  isSelected && { backgroundColor: themeColor, borderColor: themeColor },
                ]}
              >
                <Text style={[styles.selectorChipText, isSelected && { color: '#fff' }]}>
                  {ex.emoji} Contoh {idx + 1}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Main Example Card */}
      <Animated.View entering={FadeIn} key={currentEx.id} style={styles.card}>
        {/* Header with Title and Read Aloud Button */}
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <View style={styles.badgeRow}>
              <View style={[styles.tableTag, { backgroundColor: themeColor }]}>
                <Text style={styles.tableTagText}>Tabel ×{targetN}</Text>
              </View>
              <Text style={styles.exampleTitle}>{currentEx.title}</Text>
            </View>
          </View>
          <Pressable onPress={handleSpeech} style={styles.audioBtn}>
            <Text style={styles.audioBtnText}>🔊 Suara</Text>
          </Pressable>
        </View>

        {/* Story Box */}
        <View style={styles.storyBox}>
          <Text style={styles.storyText}>{currentEx.story}</Text>
          <View style={styles.questionCallout}>
            <Text style={styles.questionEmoji}>❓</Text>
            <Text style={styles.questionText}>{currentEx.question}</Text>
          </View>
        </View>

        {/* Visual Array / Representation Grid */}
        <View style={styles.visualSection}>
          <View style={styles.visualTitleRow}>
            <Text style={styles.sectionSubtitle}>Bentuk Visual (Array Baris & Kolom):</Text>
            <Text style={styles.mathBadge}>
              {currentEx.multiplier} Baris × {currentEx.multiplicand} Kolom
            </Text>
          </View>
          <View style={styles.visualGridBox}>
            {currentEx.visualRows.map((row, rIdx) => (
              <Animated.View
                entering={FadeInRight.delay(rIdx * 70)}
                key={rIdx}
                style={styles.visualRow}
              >
                <Text style={styles.visualRowLabel}>B{rIdx + 1}:</Text>
                <Text style={styles.visualRowIcons}>{row}</Text>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Math Models: Addition vs Multiplication */}
        <View style={styles.formulaRow}>
          <View style={[styles.formulaCard, { borderColor: '#E2E8F0' }]}>
            <Text style={styles.formulaLabel}>Penjumlahan Berulang:</Text>
            <Text style={styles.formulaValue}>{currentEx.repeatedAddition}</Text>
          </View>
          <View style={[styles.formulaCard, { borderColor: themeColor, backgroundColor: '#F8FAFC' }]}>
            <Text style={[styles.formulaLabel, { color: themeColor }]}>Bentuk Perkalian:</Text>
            <Text style={[styles.formulaBigValue, { color: themeColor }]}>
              {currentEx.multiplier} × {currentEx.multiplicand} = {currentEx.product}
            </Text>
          </View>
        </View>

        {/* Step-by-Step Breakdown */}
        <View style={styles.stepsBox}>
          <Text style={styles.sectionSubtitle}>Langkah Pemecahan Masalah:</Text>
          {currentEx.explanationSteps.map((step, sIdx) => (
            <View key={sIdx} style={styles.stepItem}>
              <View style={[styles.stepBullet, { backgroundColor: themeColor }]}>
                <Text style={styles.stepBulletText}>{sIdx + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Interactive Practice Quiz */}
        <View style={styles.quizBox}>
          <View style={styles.quizHeader}>
            <Text style={styles.quizHeaderEmoji}>🎯</Text>
            <Text style={styles.quizHeaderTitle}>Uji Pemahaman Cerita:</Text>
          </View>
          <Text style={styles.quizPrompt}>{currentEx.practiceQuiz.prompt}</Text>

          <View style={styles.choicesGrid}>
            {currentEx.practiceQuiz.choices.map((ch) => {
              const isSelected = selectedQuizAnswer === ch;
              const isRight = ch === currentEx.practiceQuiz.answer;
              let btnStyle: any = styles.choiceBtn;
              let txtStyle: any = styles.choiceBtnText;

              if (showExplanation) {
                if (isRight) {
                  btnStyle = [styles.choiceBtn, styles.choiceBtnRight];
                  txtStyle = [styles.choiceBtnText, styles.choiceBtnTextActive];
                } else if (isSelected) {
                  btnStyle = [styles.choiceBtn, styles.choiceBtnWrong];
                  txtStyle = [styles.choiceBtnText, styles.choiceBtnTextActive];
                }
              } else if (isSelected) {
                btnStyle = [styles.choiceBtn, { backgroundColor: themeColor }];
                txtStyle = [styles.choiceBtnText, styles.choiceBtnTextActive];
              }

              return (
                <Pressable
                  key={ch}
                  onPress={() => handleAnswerQuiz(ch)}
                  style={btnStyle}
                >
                  <Text style={txtStyle}>{ch}</Text>
                </Pressable>
              );
            })}
          </View>

          {showExplanation && (
            <Animated.View entering={ZoomIn} style={[styles.feedbackBox, isQuizCorrect ? styles.feedbackRight : styles.feedbackWrong]}>
              <Text style={styles.feedbackEmoji}>{isQuizCorrect ? '🎉 Masya Allah, Tepat Sekali!' : '💡 Semangat, Perhatikan Pembahasannya:'}</Text>
              <Text style={styles.feedbackText}>{currentEx.practiceQuiz.explanation}</Text>
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  selectorRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xs },
  selectorChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  selectorChipText: { fontSize: 14, fontWeight: '700', color: colors.text },
  card: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  tableTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  tableTagText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  exampleTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  audioBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  audioBtnText: { fontSize: 13, fontWeight: '700', color: colors.text },
  storyBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    gap: 8,
  },
  storyText: { fontSize: 15, lineHeight: 22, color: colors.text },
  questionCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: radius.sm,
  },
  questionEmoji: { fontSize: 20 },
  questionText: { fontSize: 15, fontWeight: '800', color: '#92400E', flex: 1 },
  visualSection: { backgroundColor: '#F0FDFA', borderRadius: radius.md, padding: spacing.md, gap: 8 },
  visualTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
  sectionSubtitle: { fontSize: 14, fontWeight: '800', color: colors.text },
  mathBadge: { fontSize: 12, fontWeight: '700', color: '#0D9488', backgroundColor: '#CCFBF1', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
  visualGridBox: { backgroundColor: '#fff', borderRadius: radius.sm, padding: 10, gap: 6 },
  visualRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  visualRowLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted, width: 26 },
  visualRowIcons: { fontSize: 18, letterSpacing: 3 },
  formulaRow: { flexDirection: 'row', gap: spacing.sm },
  formulaCard: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formulaLabel: { fontSize: 12, fontWeight: '700', color: colors.textMuted, marginBottom: 4 },
  formulaValue: { fontSize: 14, fontWeight: '800', color: colors.text, textAlign: 'center' },
  formulaBigValue: { fontSize: 17, fontWeight: '900', textAlign: 'center' },
  stepsBox: { backgroundColor: '#F8FAFC', borderRadius: radius.md, padding: spacing.md, gap: 10 },
  stepItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  stepBullet: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  stepBulletText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  stepText: { fontSize: 14, color: colors.text, flex: 1, lineHeight: 20 },
  quizBox: { backgroundColor: '#EFF6FF', borderRadius: radius.md, padding: spacing.md, gap: 10 },
  quizHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  quizHeaderEmoji: { fontSize: 18 },
  quizHeaderTitle: { fontSize: 15, fontWeight: '800', color: '#1E40AF' },
  quizPrompt: { fontSize: 14, fontWeight: '700', color: colors.text, lineHeight: 20 },
  choicesGrid: { flexDirection: 'row', gap: 8 },
  choiceBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    borderRadius: radius.md,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceBtnRight: { backgroundColor: '#10B981', borderColor: '#10B981' },
  choiceBtnWrong: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  choiceBtnText: { fontSize: 16, fontWeight: '900', color: colors.text },
  choiceBtnTextActive: { color: '#fff' },
  feedbackBox: { borderRadius: radius.sm, padding: 10, gap: 4 },
  feedbackRight: { backgroundColor: '#D1FAE5' },
  feedbackWrong: { backgroundColor: '#FEE2E2' },
  feedbackEmoji: { fontSize: 13, fontWeight: '800', color: colors.text },
  feedbackText: { fontSize: 13, color: colors.text, lineHeight: 18 },
  emptyText: { textAlign: 'center', color: colors.textMuted, fontSize: 14 },
});
