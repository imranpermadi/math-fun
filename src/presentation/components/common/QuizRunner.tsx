import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Difficulty, Grade, Operation } from '../../../domain/enums';
import { Question } from '../../../domain/entities/Question';
import { attemptRepository, questionGenerator } from '../../../core/di/container';
import { useAppStore } from '../../stores/useAppStore';
import { colors, fontSize, radius, spacing } from '../../theme';

interface Props {
  grade: Grade;
  difficulty: Difficulty;
  operation?: Operation;
  totalQuestions?: number;
  /** Total seconds for the whole round. Enables speed mode. */
  timerSeconds?: number;
  /** When set, final score is saved as game score. */
  gameId?: string;
  onFinish?: () => void;
}

export function QuizRunner({ grade, difficulty, operation, totalQuestions = 5, timerSeconds, gameId, onFinish }: Props) {
  const earnStars = useAppStore((s) => s.earnStars);
  const [question, setQuestion] = useState<Question>(() => questionGenerator.generate({ grade, difficulty, operation }));
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerSeconds ?? 0);
  const finished = useRef(false);

  const finish = useCallback(
    async (finalScore: number) => {
      if (finished.current) return;
      finished.current = true;
      setDone(true);
      try {
        if (finalScore > 0) await earnStars(finalScore);
        if (gameId) await attemptRepository.saveGameScore(gameId, finalScore);
      } catch {
        /* DB failure must not crash the UI */
      }
    },
    [earnStars, gameId],
  );

  useEffect(() => {
    if (!timerSeconds || done) return;
    if (timeLeft <= 0) {
      finish(score);
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, timerSeconds, done, score, finish]);

  const restart = () => {
    finished.current = false;
    setDone(false);
    setIndex(0);
    setScore(0);
    setInput('');
    setFeedback(null);
    setTimeLeft(timerSeconds ?? 0);
    setQuestion(questionGenerator.generate({ grade, difficulty, operation }));
  };

  const submit = async () => {
    if (feedback || input.trim() === '') return;
    const ok = questionGenerator.validateAnswer(question, input);
    setFeedback(ok ? 'correct' : 'wrong');
    const newScore = ok ? score + 1 : score;
    if (ok) setScore(newScore);
    attemptRepository
      .save({
        operation: question.operation,
        grade: question.grade,
        difficulty: question.difficulty,
        questionText: question.text,
        correctAnswer: question.answer,
        userAnswer: Number(input),
        isCorrect: ok,
      })
      .catch(() => undefined);

    setTimeout(() => {
      const next = index + 1;
      if (!timerSeconds && next >= totalQuestions) {
        finish(newScore);
        return;
      }
      setIndex(next);
      setInput('');
      setFeedback(null);
      setQuestion(questionGenerator.generate({ grade, difficulty, operation }));
    }, 1100);
  };

  if (done) {
    return (
      <Animated.View entering={FadeIn} style={styles.card}>
        <Text style={styles.big}>{score > 0 ? '🌟' : '🤲'}</Text>
        <Text style={styles.title}>{score > 0 ? 'Masya Allah, hebat!' : 'Ayo coba lagi, semangat!'}</Text>
        <Text style={styles.q}>Skor: {score} ⭐</Text>
        <Pressable style={styles.btn} onPress={restart}><Text style={styles.btnText}>Main Lagi</Text></Pressable>
        {onFinish && (
          <Pressable style={[styles.btn, { backgroundColor: colors.sky }]} onPress={onFinish}>
            <Text style={[styles.btnText, { color: colors.text }]}>Kembali</Text>
          </Pressable>
        )}
      </Animated.View>
    );
  }

  return (
    <Animated.View key={question.id} entering={FadeInDown} style={styles.card}>
      <Text style={styles.meta}>
        {timerSeconds ? `⏱ ${timeLeft} detik` : `Soal ${index + 1}/${totalQuestions}`} · Skor {score} ⭐
      </Text>
      <Text style={styles.q}>{question.text}</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={submit}
        editable={!feedback}
        placeholder="Jawabanmu…"
        placeholderTextColor={colors.textMuted}
      />
      {feedback && (
        <Text style={[styles.feedback, { color: feedback === 'correct' ? colors.primaryDark : colors.accent }]}>
          {feedback === 'correct' ? 'Alhamdulillah, benar! 🎉' : `Belum tepat. Jawaban: ${question.answer} ${question.unit}`}
        </Text>
      )}
      <Pressable style={styles.btn} onPress={submit}><Text style={styles.btnText}>Periksa</Text></Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  meta: { fontSize: 15, fontWeight: '700', color: colors.textMuted },
  title: { fontSize: fontSize.title, fontWeight: '800', color: colors.text, textAlign: 'center' },
  big: { fontSize: 64, textAlign: 'center' },
  q: { fontSize: fontSize.body + 2, color: colors.text, lineHeight: 28 },
  input: {
    borderWidth: 3, borderColor: colors.secondary, borderRadius: radius.md,
    fontSize: 28, fontWeight: '800', textAlign: 'center', paddingVertical: 10, color: colors.text,
  },
  feedback: { fontSize: fontSize.body, fontWeight: '800', textAlign: 'center' },
  btn: { backgroundColor: colors.primary, borderRadius: radius.pill, paddingVertical: 14, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: fontSize.body, fontWeight: '800' },
});

