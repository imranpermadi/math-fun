import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { ExamQuestion, ExamQuestionType } from '../../../domain/entities/ExamQuestion';
import { examQuestionService } from '../../../domain/services/ExamQuestionService';
import { attemptRepository } from '../../../core/di/container';
import { SoundService } from '../../../core/sound/SoundService';
import { useAppStore } from '../../stores/useAppStore';
import { SettingsBar } from '../../components/common/SettingsBar';
import { Instruction } from '../../components/play/Instruction';
import { Choices } from '../../components/play/Choices';
import { MultiChoiceCard } from '../../components/play/MultiChoiceCard';
import { MatchingCard } from '../../components/play/MatchingCard';
import { DecompositionCard } from '../../components/play/DecompositionCard';
import { colors, fontSize, radius, spacing } from '../../theme';

const QUESTION_COUNTS = [5, 10, 15, 20];

const EXAM_MODES: { id: 'all' | ExamQuestionType; label: string; icon: string; desc: string }[] = [
  { id: 'all', label: 'Ujian Lengkap SD', icon: '🎓', desc: 'Campuran semua tipe soal seperti ujian sekolah' },
  { id: 'single', label: 'Pilihan Ganda', icon: '🔘', desc: 'Satu jawaban paling tepat' },
  { id: 'multi', label: 'Jawaban > 1', icon: '☑️', desc: 'Pilihan ganda kompleks (centang semua yang benar)' },
  { id: 'match', label: 'Penjodohan', icon: '🔄', desc: 'Hubungkan soal dan jawaban yang cocok' },
  { id: 'decompose', label: 'Dekomposisi', icon: '🧮', desc: 'Uraian langkah memecah nilai puluhan & satuan' },
];

export function BankSoalScreen() {
  const { grade, difficulty, earnStars } = useAppStore();

  // Configuration state
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [selectedMode, setSelectedMode] = useState<'all' | ExamQuestionType>('all');

  // Exam session state
  const [inExam, setInExam] = useState(false);
  const [examList, setExamList] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const startExam = () => {
    SoundService.tap();
    const list: ExamQuestion[] = [];
    for (let i = 0; i < questionCount; i++) {
      const type = selectedMode === 'all' ? undefined : selectedMode;
      list.push(examQuestionService.generateQuestion(grade, difficulty, type));
    }
    setExamList(list);
    setCurrentIndex(0);
    setScore(0);
    setDone(false);
    setInExam(true);
  };

  const currentQ = examList[currentIndex];

  const handleCorrect = async () => {
    const newScore = score + 1;
    setScore(newScore);

    // Save attempt to repository
    attemptRepository
      .save({
        operation: (currentQ.topic as any) || 'Ujian',
        grade: currentQ.grade,
        difficulty: currentQ.difficulty,
        questionText: currentQ.prompt,
        correctAnswer: Number(currentQ.singleAnswer ?? currentQ.decompose?.finalAnswer ?? 1),
        userAnswer: Number(currentQ.singleAnswer ?? currentQ.decompose?.finalAnswer ?? 1),
        isCorrect: true,
      })
      .catch(() => undefined);

    nextQuestion(newScore);
  };

  const handleWrong = async () => {
    attemptRepository
      .save({
        operation: (currentQ.topic as any) || 'Ujian',
        grade: currentQ.grade,
        difficulty: currentQ.difficulty,
        questionText: currentQ.prompt,
        correctAnswer: Number(currentQ.singleAnswer ?? currentQ.decompose?.finalAnswer ?? 1),
        userAnswer: null,
        isCorrect: false,
      })
      .catch(() => undefined);

    // After brief delay, proceed
    setTimeout(() => {
      nextQuestion(score);
    }, 1200);
  };

  const nextQuestion = async (finalScore: number) => {
    const next = currentIndex + 1;
    if (next >= examList.length) {
      setDone(true);
      SoundService.win();
      if (finalScore > 0) {
        await earnStars(finalScore * 2);
      }
    } else {
      setCurrentIndex(next);
    }
  };

  // Exam Result Card
  if (inExam && done) {
    const total = examList.length;
    const finalGrade = Math.round((score / total) * 100);
    const starEarned = score * 2;

    return (
      <ScrollView style={styles.root} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeIn} style={styles.resultCard}>
          <Text style={styles.resultEmoji}>{finalGrade >= 70 ? '🏆' : '🤲'}</Text>
          <Text style={styles.resultTitle}>
            {finalGrade >= 70 ? 'Alhamdulillah, Hasil Luar Biasa!' : 'Ayo Semangat Belajar Lagi!'}
          </Text>
          <Text style={styles.resultSubtitle}>Rapor Ujian Matematika SD</Text>

          <View style={styles.gradeBox}>
            <Text style={styles.gradeNumber}>{finalGrade}</Text>
            <Text style={styles.gradeTotal}>/ 100 Poin</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Benar</Text>
              <Text style={[styles.statValue, { color: colors.primaryDark }]}>{score} Soal</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Soal</Text>
              <Text style={styles.statValue}>{total} Soal</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Bintang Pahala</Text>
              <Text style={[styles.statValue, { color: colors.secondary }]}>+{starEarned} ⭐</Text>
            </View>
          </View>

          <Pressable style={styles.btnAction} onPress={startExam}>
            <Text style={styles.btnActionText}>Mulai Ujian Baru ▶</Text>
          </Pressable>

          <Pressable
            style={[styles.btnAction, { backgroundColor: colors.sky }]}
            onPress={() => setInExam(false)}
          >
            <Text style={[styles.btnActionText, { color: colors.text }]}>Kembali ke Menu</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    );
  }

  // Active Exam Runner
  if (inExam && currentQ) {
    return (
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.examRunnerContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.runnerHeader}>
          <Text style={styles.qProgress}>
            Soal {currentIndex + 1} dari {examList.length}
          </Text>
          <Text style={styles.currentScore}>Skor: {score} ⭐</Text>
          <Pressable
            onPress={() => {
              SoundService.tap();
              setInExam(false);
            }}
            style={styles.exitBtn}
          >
            <Text style={styles.exitBtnText}>✕ Keluar</Text>
          </Pressable>
        </View>

        {/* Question Type Banner */}
        <Animated.View key={currentQ.id} entering={FadeInDown} style={styles.qCard}>
          <View style={styles.topicBadge}>
            <Text style={styles.topicBadgeText}>{currentQ.topic}</Text>
          </View>

          <Instruction text={currentQ.prompt} />

          {/* Render interactive component according to type */}
          {currentQ.type === 'single' && (
            <Choices
              choices={currentQ.choices ?? []}
              correct={currentQ.singleAnswer ?? 0}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
            />
          )}

          {currentQ.type === 'multi' && currentQ.multiOptions && (
            <MultiChoiceCard
              options={currentQ.multiOptions}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
            />
          )}

          {currentQ.type === 'match' && currentQ.matchPairs && (
            <MatchingCard
              pairs={currentQ.matchPairs}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
            />
          )}

          {currentQ.type === 'decompose' && currentQ.decompose && (
            <DecompositionCard
              data={currentQ.decompose}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
            />
          )}
        </Animated.View>
      </ScrollView>
    );
  }

  // Configurator / Lobby Screen
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <SettingsBar />

      {/* Hero Welcome */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>📝</Text>
        <Text style={styles.heroTitle}>Bank Soal Ujian Sekolah</Text>
        <Text style={styles.heroSub}>
          Beragam variasi soal matematika: Pilihan Ganda, Jawaban Lebih dari Satu, Penjodohan, dan Metode Dekomposisi Buku SD!
        </Text>
      </View>

      {/* Selector: Jumlah Soal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pilih Jumlah Soal:</Text>
        <View style={styles.countRow}>
          {QUESTION_COUNTS.map((cnt) => (
            <Pressable
              key={cnt}
              onPress={() => {
                SoundService.tap();
                setQuestionCount(cnt);
              }}
              style={[styles.countChip, questionCount === cnt && styles.countChipActive]}
            >
              <Text
                style={[styles.countChipText, questionCount === cnt && styles.countChipTextActive]}
              >
                {cnt} Soal
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Selector: Format / Tipe Soal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pilih Format Soal Ujian:</Text>
        <View style={styles.modesList}>
          {EXAM_MODES.map((m) => {
            const isSel = selectedMode === m.id;
            return (
              <Pressable
                key={m.id}
                onPress={() => {
                  SoundService.tap();
                  setSelectedMode(m.id);
                }}
                style={[styles.modeCard, isSel && styles.modeCardActive]}
              >
                <Text style={styles.modeIcon}>{m.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modeLabel, isSel && { color: colors.primaryDark }]}>
                    {m.label}
                  </Text>
                  <Text style={styles.modeDesc}>{m.desc}</Text>
                </View>
                {isSel && <Text style={styles.activeCheck}>✓</Text>}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Start Button */}
      <Pressable style={styles.startBtn} onPress={startExam}>
        <Text style={styles.startBtnText}>Bismillah, Mulai Ujian ▶</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 120, gap: spacing.lg },
  examRunnerContent: { padding: spacing.md, paddingBottom: 120, gap: spacing.md },
  hero: {
    backgroundColor: colors.secondary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  heroEmoji: { fontSize: 56 },
  heroTitle: { fontSize: fontSize.title, fontWeight: '900', color: colors.text, textAlign: 'center' },
  heroSub: { fontSize: 15, fontWeight: '600', color: colors.text, textAlign: 'center', lineHeight: 22 },
  section: { gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  countRow: { flexDirection: 'row', gap: 10 },
  countChip: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  countChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  countChipText: { fontSize: 15, fontWeight: '800', color: colors.text },
  countChipTextActive: { color: '#fff' },
  modesList: { gap: 8 },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  modeCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#F0FFF4',
  },
  modeIcon: { fontSize: 28 },
  modeLabel: { fontSize: 16, fontWeight: '800', color: colors.text },
  modeDesc: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  activeCheck: { fontSize: 20, fontWeight: '900', color: colors.primaryDark },
  startBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(0,0,0,0.25)',
  },
  startBtnText: { color: '#fff', fontSize: 20, fontWeight: '900' },
  runnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  qProgress: { fontSize: 15, fontWeight: '800', color: colors.textMuted },
  currentScore: { fontSize: 16, fontWeight: '900', color: colors.primaryDark },
  exitBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  exitBtnText: { fontSize: 13, fontWeight: '800', color: colors.textMuted },
  qCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    elevation: 3,
  },
  topicBadge: {
    alignSelf: 'center',
    backgroundColor: '#E8F6FF',
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  topicBadgeText: { fontSize: 13, fontWeight: '800', color: '#0077B6' },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    elevation: 4,
  },
  resultEmoji: { fontSize: 64 },
  resultTitle: { fontSize: 22, fontWeight: '900', color: colors.text, textAlign: 'center' },
  resultSubtitle: { fontSize: 15, fontWeight: '700', color: colors.textMuted },
  gradeBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    backgroundColor: '#FFF7DC',
    borderRadius: radius.lg,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 3,
    borderColor: colors.secondary,
  },
  gradeNumber: { fontSize: 56, fontWeight: '900', color: colors.primaryDark },
  gradeTotal: { fontSize: 18, fontWeight: '800', color: colors.textMuted },
  statsRow: { flexDirection: 'row', gap: 10, width: '100%' },
  statBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: radius.md,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '700' },
  statValue: { fontSize: 16, fontWeight: '900', color: colors.text, marginTop: 4 },
  btnAction: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  btnActionText: { color: '#fff', fontSize: 17, fontWeight: '900' },
});
