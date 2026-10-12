import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  BounceIn,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MultiQuizQuestion, MULTI_COLORS } from './logic';
import { Choices } from '../../components/play/Choices';
import { BubbleNumpad } from '../../components/play/BubbleNumpad';
import { SoundService } from '../../../core/sound/SoundService';
import { colors, radius, spacing } from '../../theme';

interface Props {
  questions: MultiQuizQuestion[];
  targetN: number | 'mix';
  onFinish: (score: number, total: number) => void;
  onExit: () => void;
}

export function QuizChallengeView({ questions, targetN, onFinish, onExit }: Props) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [inputMode, setInputMode] = useState<'choices' | 'numpad'>('choices');
  const [numpadVal, setNumpadVal] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'right' | 'wrong'>('idle');

  const currentQ = questions[index];
  const qColor = typeof targetN === 'number' ? MULTI_COLORS[targetN] || colors.primary : '#4361EE';

  // Flame combo pulse animation
  const flameScale = useSharedValue(1);

  const handleCorrect = () => {
    if (feedback !== 'idle') return;

    setFeedback('right');
    const newStreak = streak + 1;
    setStreak(newStreak);
    if (newStreak > maxStreak) setMaxStreak(newStreak);

    flameScale.value = withSequence(withSpring(1.3), withSpring(1));
    SoundService.correct();

    const newScore = score + 1;
    setScore(newScore);

    setTimeout(() => {
      advanceNext(newScore);
    }, 1100);
  };

  const handleWrong = () => {
    if (feedback !== 'idle') return;

    setFeedback('wrong');
    setStreak(0);
    SoundService.wrong();

    setTimeout(() => {
      advanceNext(score);
    }, 1300);
  };

  const advanceNext = (currentScore: number) => {
    setFeedback('idle');
    setNumpadVal('');
    const nextIdx = index + 1;
    if (nextIdx >= questions.length) {
      onFinish(currentScore, questions.length);
    } else {
      setIndex(nextIdx);
    }
  };

  const handleNumpadSubmit = () => {
    if (!numpadVal || feedback !== 'idle') return;
    if (Number(numpadVal) === currentQ.answer) {
      handleCorrect();
    } else {
      handleWrong();
    }
  };

  const flameAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
  }));

  const speakQuestion = () => {
    SoundService.tap();
    SoundService.speak(`${currentQ.a} kali ${currentQ.b} sama dengan berapa?`);
  };

  return (
    <View style={styles.container}>
      {/* Header bar: Progress, Combo flame, and exit */}
      <View style={styles.headerBar}>
        <View style={styles.progressBox}>
          <Text style={styles.progressText}>
            Soal {index + 1} / {questions.length}
          </Text>
          <Text style={styles.scoreText}>Skor: {score} ⭐</Text>
        </View>

        {streak >= 2 && (
          <Animated.View style={[styles.comboBadge, flameAnimStyle]}>
            <Text style={styles.comboEmoji}>🔥</Text>
            <Text style={styles.comboText}>COMBO x{streak}!</Text>
          </Animated.View>
        )}

        <Pressable onPress={onExit} style={styles.exitBtn}>
          <Text style={styles.exitBtnText}>✕ Keluar</Text>
        </Pressable>
      </View>

      {/* Mode toggle */}
      <View style={styles.toggleRow}>
        <Pressable
          onPress={() => {
            SoundService.tap();
            setInputMode('choices');
          }}
          style={[styles.toggleBtn, inputMode === 'choices' && styles.toggleBtnActive]}
        >
          <Text style={[styles.toggleBtnText, inputMode === 'choices' && styles.toggleBtnTextActive]}>
            🔘 Pilihan Ganda
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            SoundService.tap();
            setInputMode('numpad');
          }}
          style={[styles.toggleBtn, inputMode === 'numpad' && styles.toggleBtnActive]}
        >
          <Text style={[styles.toggleBtnText, inputMode === 'numpad' && styles.toggleBtnTextActive]}>
            🔢 Bubble Pad
          </Text>
        </Pressable>
      </View>

      {/* Main Question Card with Modern 3D styling */}
      <Animated.View key={currentQ.id} entering={FadeInDown} style={styles.questionCard}>
        <View style={styles.cardTopRow}>
          <View style={[styles.topicPill, { backgroundColor: qColor }]}>
            <Text style={styles.topicPillText}>
              {typeof targetN === 'number' ? `Uji Perkalian ${targetN}` : 'Uji Campuran 1–10'}
            </Text>
          </View>
          <Pressable onPress={speakQuestion} style={styles.speechPill}>
            <Text style={styles.speechPillText}>🔊 Dengar Soal</Text>
          </Pressable>
        </View>

        {/* Big Equation */}
        <Animated.Text entering={BounceIn} style={styles.equationText}>
          {currentQ.prompt}
        </Animated.Text>

        <Text style={styles.hintText}>💡 {currentQ.hint}</Text>

        {feedback === 'right' && (
          <Animated.View entering={BounceIn} style={styles.correctBanner}>
            <Text style={styles.correctBannerText}>Masya Allah, Tepat Sekali! 🌟</Text>
          </Animated.View>
        )}

        {feedback === 'wrong' && (
          <Animated.View entering={BounceIn} style={styles.wrongBanner}>
            <Text style={styles.wrongBannerText}>
              Jawaban yang benar: {currentQ.answer} ({currentQ.a} × {currentQ.b})
            </Text>
          </Animated.View>
        )}
      </Animated.View>

      {/* Answer Input */}
      {inputMode === 'choices' ? (
        <Choices
          key={currentQ.id}
          choices={currentQ.choices}
          correct={currentQ.answer}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
        />
      ) : (
        <BubbleNumpad
          value={numpadVal}
          onChange={setNumpadVal}
          onSubmit={handleNumpadSubmit}
          state={feedback}
          disabled={feedback !== 'idle'}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    width: '100%',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  progressBox: {
    gap: 2,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textMuted,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  comboBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0ED',
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#FB5607',
    gap: 4,
  },
  comboEmoji: {
    fontSize: 16,
  },
  comboText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FB5607',
  },
  exitBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  exitBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMuted,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#EBE5D8',
    borderRadius: radius.pill,
    padding: 3,
    gap: 6,
    alignSelf: 'center',
  },
  toggleBtn: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  toggleBtnTextActive: {
    color: '#fff',
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#E5E7EB',
    borderBottomWidth: 6,
    borderBottomColor: '#D1D5DB',
    gap: 10,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  topicPill: {
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  topicPillText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  speechPill: {
    backgroundColor: '#FFF7DC',
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: colors.secondary,
  },
  speechPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8B5E34',
  },
  equationText: {
    fontSize: 52,
    fontWeight: '900',
    color: colors.text,
    marginVertical: 4,
  },
  hintText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
    textAlign: 'center',
  },
  correctBanner: {
    backgroundColor: '#D8F3DC',
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: colors.primaryDark,
  },
  correctBannerText: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  wrongBanner: {
    backgroundColor: '#FFE3E3',
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E63946',
  },
  wrongBannerText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#E63946',
  },
});
