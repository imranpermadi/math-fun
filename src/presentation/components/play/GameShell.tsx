import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn, ZoomIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Difficulty, Grade } from '../../../domain/enums';
import { attemptRepository } from '../../../core/di/container';
import { SoundService } from '../../../core/sound/SoundService';
import { useAppStore } from '../../stores/useAppStore';
import { colors, fontSize, radius, spacing } from '../../theme';
import { Celebration } from './Celebration';

export interface RoundApi {
  round: number;
  score: number;
  misses: number;
  streak: number;
  timeLeft: number;
  grade: Grade;
  difficulty: Difficulty;
  onCorrect: () => void;
  onWrong: () => void;
  /** End the game immediately (used by speed mode when the rope is fully pulled). */
  finish: () => void;
}

interface Props {
  gameId: string;
  emoji: string;
  title: string;
  totalRounds?: number;
  /** When set, game is timed (speed mode) and rounds are unlimited. */
  timerSeconds?: number;
  /** Remount content every round (default true). Set false to keep state across rounds. */
  keyed?: boolean;
  onExit: () => void;
  renderRound: (api: RoundApi) => React.ReactNode;
}

const CHEERS = [
  'Alhamdulillah, benar!', 'Masya Allah, hebat!', 'Barakallah, pintar sekali!',
  'Subhanallah, keren!', 'Allahu Akbar, tepat sekali!',
];
const OOPS = ['Coba lagi ya, kamu pasti bisa!', 'Belum tepat, semangat!', 'Bismillah, ayo coba lagi!'];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

function Mascot({ mood }: { mood: 'idle' | 'happy' | 'sad' }) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withRepeat(withSequence(withTiming(-6, { duration: 600 }), withTiming(0, { duration: 600 })), -1);
  }, [y]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }, { scale: mood === 'happy' ? 1.25 : 1 }] }));
  return <Animated.Text style={[styles.mascot, style]}>{mood === 'happy' ? '🤩' : mood === 'sad' ? '🥺' : '🧒'}</Animated.Text>;
}

export function GameShell({ gameId, emoji, title, totalRounds = 5, timerSeconds, keyed = true, onExit, renderRound }: Props) {
  const { grade, difficulty, soundOn, toggleSound, earnStars } = useAppStore();
  const timed = !!timerSeconds;

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);
  const [mood, setMood] = useState<'idle' | 'happy' | 'sad'>('idle');
  const [message, setMessage] = useState('Bismillah, ayo mulai!');
  const [celebrate, setCelebrate] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerSeconds ?? 0);
  const lock = useRef(false);
  const saved = useRef(false);
  const scoreRef = useRef(0);

  const finish = useCallback(async () => {
    if (saved.current) return;
    saved.current = true;
    setDone(true);
    SoundService.win();
    const s = scoreRef.current;
    try {
      if (s > 0) await earnStars(s);
      await attemptRepository.saveGameScore(gameId, s);
    } catch { /* DB failure must not crash UI */ }
  }, [earnStars, gameId]);

  // countdown (speed mode)
  useEffect(() => {
    if (!timed || done) return;
    if (timeLeft <= 0) { finish(); return; }
    const t = setTimeout(() => { setTimeLeft((v) => v - 1); if (timeLeft <= 6) SoundService.play('tick'); }, 1000);
    return () => clearTimeout(t);
  }, [timed, timeLeft, done, finish]);

  const onCorrect = useCallback(() => {
    if (lock.current) return;
    lock.current = true;
    scoreRef.current += 1;
    setScore(scoreRef.current);
    setStreak((s) => s + 1);
    setMood('happy');
    const cheer = pick(CHEERS);
    setMessage(cheer);
    SoundService.correct();
    if (!timed) { setCelebrate(true); setTimeout(() => SoundService.speak(cheer), 350); }
    setTimeout(() => {
      setCelebrate(false);
      setMood('idle');
      lock.current = false;
      setMessage('Ayo lanjut!');
      setRound((r) => {
        const next = r + 1;
        if (!timed && next >= totalRounds) { finish(); return r; }
        return next;
      });
    }, timed ? 450 : 1700);
  }, [timed, totalRounds, finish]);

  const onWrong = useCallback(() => {
    setMisses((m) => m + 1);
    setStreak(0);
    setMood('sad');
    setMessage(pick(OOPS));
    SoundService.wrong();
    setTimeout(() => setMood((m) => (m === 'sad' ? 'idle' : m)), 1200);
  }, []);

  const restart = () => {
    saved.current = false; lock.current = false; scoreRef.current = 0;
    setDone(false); setRound(0); setScore(0); setMisses(0); setStreak(0);
    setMood('idle'); setMessage('Bismillah, ayo mulai!'); setTimeLeft(timerSeconds ?? 0);
  };

  if (done) {
    const ratio = timed ? Math.min(1, score / 12) : score / totalRounds;
    const starCount = score === 0 ? 0 : ratio >= 0.8 ? 3 : ratio >= 0.5 ? 2 : 1;
    return (
      <SafeAreaView style={styles.root} edges={['bottom']}>
        <Celebration />
        <Animated.View entering={ZoomIn} style={styles.result}>
          <Text style={styles.resultEmoji}>{starCount >= 2 ? '🏆' : starCount === 1 ? '👍' : '🤲'}</Text>
          <Text style={styles.resultTitle}>{starCount >= 2 ? 'Masya Allah, hebat!' : starCount === 1 ? 'Bagus, terus belajar!' : 'Ayo coba lagi, semangat!'}</Text>
          <Text style={styles.resultStars}>{'⭐'.repeat(starCount)}{'☆'.repeat(3 - starCount)}</Text>
          <Text style={styles.resultScore}>Benar: {score}{timed ? '' : ` dari ${totalRounds}`}</Text>
          <Pressable style={styles.btn} onPress={() => { SoundService.tap(); restart(); }}><Text style={styles.btnText}>Main Lagi 🔄</Text></Pressable>
          <Pressable style={[styles.btn, { backgroundColor: colors.sky }]} onPress={onExit}>
            <Text style={[styles.btnText, { color: colors.text }]}>Kembali</Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    );
  }

  const api: RoundApi = { round, score, misses, streak, timeLeft, grade, difficulty, onCorrect, onWrong, finish };

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <View style={styles.header}>
        <Pressable onPress={onExit} style={styles.chip}><Text style={styles.chipText}>←</Text></Pressable>
        <Text style={styles.title} numberOfLines={1}>{emoji} {title}</Text>
        <Pressable onPress={toggleSound} style={styles.chip}><Text style={styles.chipText}>{soundOn ? '🔊' : '🔇'}</Text></Pressable>
      </View>

      <View style={styles.statusRow}>
        {timed ? (
          <Text style={[styles.status, timeLeft <= 10 && { color: '#E5484D' }]}>⏱ {timeLeft}s</Text>
        ) : (
          <View style={styles.dots}>
            {Array.from({ length: totalRounds }, (_, i) => (
              <View key={i} style={[styles.dot, i < round && { backgroundColor: colors.primary }, i === round && { backgroundColor: colors.secondary }]} />
            ))}
          </View>
        )}
        <Text style={styles.status}>⭐ {score}</Text>
        {streak >= 2 && <Animated.Text entering={ZoomIn} style={styles.status}>🔥 {streak}</Animated.Text>}
      </View>

      <View style={styles.mascotRow}>
        <Mascot mood={mood} />
        <Animated.View key={message} entering={FadeIn} style={styles.bubble}><Text style={styles.bubbleText}>{message}</Text></Animated.View>
      </View>

      <View style={styles.content} key={keyed ? `round-${round}` : 'static'}>{renderRound(api)}</View>

      {celebrate && <Celebration />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  chip: { backgroundColor: colors.card, borderRadius: radius.pill, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  chipText: { fontSize: 22, fontWeight: '900', color: colors.primaryDark },
  title: { flex: 1, textAlign: 'center', fontSize: 19, fontWeight: '900', color: colors.text },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  status: { fontSize: 20, fontWeight: '900', color: colors.accent },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#E5E7EB' },
  mascotRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md },
  mascot: { fontSize: 44 },
  bubble: { flex: 1, backgroundColor: '#fff', borderRadius: radius.md, padding: spacing.sm },
  bubbleText: { fontSize: 16, fontWeight: '700', color: colors.text },
  content: { flex: 1, padding: spacing.md, gap: spacing.md },
  result: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.lg },
  resultEmoji: { fontSize: 90 },
  resultTitle: { fontSize: fontSize.title, fontWeight: '900', color: colors.text, textAlign: 'center' },
  resultStars: { fontSize: 44 },
  resultScore: { fontSize: fontSize.body + 2, fontWeight: '700', color: colors.textMuted },
  btn: { backgroundColor: colors.primary, borderRadius: radius.pill, paddingVertical: 14, paddingHorizontal: 40 },
  btnText: { color: '#fff', fontSize: fontSize.body, fontWeight: '900' },
});
