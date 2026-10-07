import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Difficulty, Grade, Operation } from '../../../domain/enums';
import { Question } from '../../../domain/entities/Question';
import { attemptRepository, questionGenerator } from '../../../core/di/container';
import { SoundService } from '../../../core/sound/SoundService';
import { BubbleNumpad } from '../play/BubbleNumpad';
import { Choices } from '../play/Choices';
import { Instruction } from '../play/Instruction';
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

export function QuizRunner({
  grade,
  difficulty,
  operation,
  totalQuestions = 5,
  timerSeconds,
  gameId,
  onFinish,
}: Props) {
  const earnStars = useAppStore((s) => s.earnStars);
  const [question, setQuestion] = useState<Question>(() =>
    questionGenerator.generate({ grade, difficulty, operation })
  );
  const [choices, setChoices] = useState<number[]>(() =>
    questionGenerator.generateChoices(question, 3)
  );
  const [inputMode, setInputMode] = useState<'numpad' | 'choices'>('numpad');
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
      SoundService.win();
      try {
        if (finalScore > 0) await earnStars(finalScore);
        if (gameId) await attemptRepository.saveGameScore(gameId, finalScore);
      } catch {
        /* DB failure must not crash the UI */
      }
    },
    [earnStars, gameId]
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
    const nextQ = questionGenerator.generate({ grade, difficulty, operation });
    setQuestion(nextQ);
    setChoices(questionGenerator.generateChoices(nextQ, 3));
  };

  const handleChoiceCorrect = () => {
    handleAnswerSubmit(String(question.answer));
  };

  const handleChoiceWrong = () => {
    setFeedback('wrong');
    setTimeout(() => setFeedback(null), 1000);
  };

  const handleAnswerSubmit = async (val?: string) => {
    const rawAnswer = val ?? input;
    if (feedback || rawAnswer.trim() === '') return;

    const ok = questionGenerator.validateAnswer(question, rawAnswer);
    setFeedback(ok ? 'correct' : 'wrong');
    if (ok) {
      SoundService.correct();
    } else {
      SoundService.wrong();
    }

    const newScore = ok ? score + 1 : score;
    if (ok) setScore(newScore);

    attemptRepository
      .save({
        operation: question.operation,
        grade: question.grade,
        difficulty: question.difficulty,
        questionText: question.text,
        correctAnswer: question.answer,
        userAnswer: Number(rawAnswer),
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
      const nextQ = questionGenerator.generate({ grade, difficulty, operation });
      setQuestion(nextQ);
      setChoices(questionGenerator.generateChoices(nextQ, 3));
    }, 1200);
  };

  if (done) {
    return (
      <Animated.View entering={FadeIn} style={styles.card}>
        <Text style={styles.big}>{score > 0 ? '🌟' : '🤲'}</Text>
        <Text style={styles.title}>
          {score > 0 ? 'Masya Allah, Hebat!' : 'Ayo Coba Lagi, Semangat!'}
        </Text>
        <Text style={styles.scoreText}>Skor: {score} ⭐</Text>
        <Pressable style={styles.actionBtn} onPress={restart}>
          <Text style={styles.actionBtnText}>Main Lagi ▶</Text>
        </Pressable>
        {onFinish && (
          <Pressable style={[styles.actionBtn, { backgroundColor: colors.sky }]} onPress={onFinish}>
            <Text style={[styles.actionBtnText, { color: colors.text }]}>Kembali</Text>
          </Pressable>
        )}
      </Animated.View>
    );
  }

  const mascotMood = feedback === 'correct' ? '🌟' : feedback === 'wrong' ? '🤲' : '🧒';

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Animated.View key={question.id} entering={FadeInDown} style={styles.card}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <Text style={styles.meta}>
            {timerSeconds ? `⏱ ${timeLeft}s` : `Soal ${index + 1}/${totalQuestions}`} · Skor {score} ⭐
          </Text>
          <View style={styles.modeToggle}>
            <Pressable
              onPress={() => {
                SoundService.tap();
                setInputMode('numpad');
              }}
              style={[styles.toggleBtn, inputMode === 'numpad' && styles.toggleBtnActive]}
            >
              <Text style={styles.toggleText}>🔢 Numpad</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                SoundService.tap();
                setInputMode('choices');
              }}
              style={[styles.toggleBtn, inputMode === 'choices' && styles.toggleBtnActive]}
            >
              <Text style={styles.toggleText}>🔘 Pilihan</Text>
            </Pressable>
          </View>
        </View>

        {/* Mascot & Audio-Enabled Instruction */}
        <View style={styles.mascotRow}>
          <Animated.Text key={mascotMood} entering={ZoomIn} style={styles.mascotEmoji}>
            {mascotMood}
          </Animated.Text>
          <View style={{ flex: 1 }}>
            <Instruction text={question.text} />
          </View>
        </View>

        {/* Interactive Answer Input: ZERO System Keyboard */}
        {inputMode === 'numpad' ? (
          <BubbleNumpad
            value={input}
            onChange={setInput}
            onSubmit={() => handleAnswerSubmit()}
            unit={question.unit}
            state={feedback === 'correct' ? 'right' : feedback === 'wrong' ? 'wrong' : 'idle'}
            disabled={feedback !== null}
          />
        ) : (
          <Choices
            choices={choices}
            correct={question.answer}
            onCorrect={handleChoiceCorrect}
            onWrong={handleChoiceWrong}
          />
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 3,
    borderColor: '#F0E6D2',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#F3E8D0',
    paddingBottom: spacing.sm,
  },
  meta: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textMuted,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: radius.pill,
    padding: 3,
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  mascotEmoji: {
    fontSize: 44,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },
  big: {
    fontSize: 64,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primaryDark,
    textAlign: 'center',
  },
  actionBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: fontSize.body,
    fontWeight: '900',
  },
});
