import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { getTableItems, generateQuizQuestions, MULTI_COLORS } from './logic';
import { FlashcardView } from './FlashcardView';
import { TableListView } from './TableListView';
import { QuizChallengeView } from './QuizChallengeView';
import { ExampleProblemsView } from './ExampleProblemsView';
import { TricksView } from './TricksView';
import { SoundService } from '../../../core/sound/SoundService';
import { attemptRepository } from '../../../core/di/container';
import { useAppStore } from '../../stores/useAppStore';
import { colors, radius, spacing } from '../../theme';
import type { GameProps } from '../types';

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export function HafalanPerkalian({ onExit }: GameProps) {
  const { earnStars } = useAppStore();

  const [selectedN, setSelectedN] = useState<number>(2); // Default perkalian 2
  const [activeTab, setActiveTab] = useState<'flashcard' | 'table' | 'examples' | 'tricks' | 'quiz'>('flashcard');

  // Quiz Mode Config & State
  const [inQuiz, setInQuiz] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(10);
  const [quizTarget, setQuizTarget] = useState<number | 'mix'>(2);
  const [selectedCount, setSelectedCount] = useState<number>(10);

  const tableItems = useMemo(() => getTableItems(selectedN), [selectedN]);
  const quizQuestions = useMemo(
    () => generateQuizQuestions(quizTarget, quizTotal),
    [quizTarget, quizTotal, inQuiz]
  );

  const themeColor = MULTI_COLORS[selectedN] || colors.primary;

  const startQuiz = (target: number | 'mix', count: number = selectedCount) => {
    SoundService.tap();
    setQuizTarget(target);
    setQuizScore(0);
    setQuizTotal(count);
    setQuizFinished(false);
    setInQuiz(true);
  };

  const handleQuizFinish = async (score: number, total: number) => {
    setQuizScore(score);
    setQuizTotal(total);
    setQuizFinished(true);
    SoundService.win();

    // Save score to database & award stars
    try {
      const earned = score * 2;
      if (earned > 0) await earnStars(earned);
      await attemptRepository.saveGameScore('hafalan-perkalian', score);
    } catch {
      /* ignore */
    }
  };

  // If in active Quiz
  if (inQuiz) {
    if (quizFinished) {
      const pct = Math.round((quizScore / quizTotal) * 100);
      const starsEarned = quizScore * 2;
      const isMaster = pct >= 80;

      return (
        <ScrollView style={styles.root} contentContainerStyle={styles.content}>
          <Animated.View entering={FadeIn} style={styles.resultCard}>
            <Text style={styles.resultEmoji}>{isMaster ? '🏆' : '🤲'}</Text>
            <Text style={styles.resultTitle}>
              {isMaster ? 'Masya Allah, Hafalanmu Mantap!' : 'Ayo Semangat, Sedikit Lagi Hafal!'}
            </Text>
            <Text style={styles.resultSub}>Rapor Uji Hafalan Perkalian</Text>

            <View style={styles.scoreBadge}>
              <Text style={styles.scoreNumber}>{quizScore}</Text>
              <Text style={styles.scoreOutOf}>/ {quizTotal} Soal Benar</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Nilai</Text>
                <Text style={[styles.statValue, { color: colors.primaryDark }]}>{pct}%</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Bintang Pahala</Text>
                <Text style={[styles.statValue, { color: colors.secondary }]}>+{starsEarned} ⭐</Text>
              </View>
            </View>

            <Pressable style={styles.primaryActionBtn} onPress={() => startQuiz(quizTarget, quizTotal)}>
              <Text style={styles.primaryActionBtnText}>Ulangi Uji Hafalan ▶</Text>
            </Pressable>

            <Pressable
              style={[styles.primaryActionBtn, { backgroundColor: colors.sky }]}
              onPress={() => setInQuiz(false)}
            >
              <Text style={[styles.primaryActionBtnText, { color: colors.text }]}>
                Kembali ke Tabel Hafalan
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      );
    }

    return (
      <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <QuizChallengeView
          questions={quizQuestions}
          targetN={quizTarget}
          onFinish={handleQuizFinish}
          onExit={() => setInQuiz(false)}
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header bar with exit */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Hafalan Kali-Kali Ceria ✨</Text>
          <Text style={styles.subtitle}>Kuasai perkalian 1 sampai 10 dengan cara seru!</Text>
        </View>
        <Pressable onPress={onExit} style={styles.exitBtn}>
          <Text style={styles.exitBtnText}>✕ Tutup</Text>
        </Pressable>
      </View>

      {/* Number Selector Carousel (1 sampai 10) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.numberSelectorRow}
      >
        {NUMBERS.map((n) => {
          const isSelected = selectedN === n;
          const numColor = MULTI_COLORS[n];
          return (
            <Pressable
              key={n}
              onPress={() => {
                SoundService.pop();
                setSelectedN(n);
              }}
              style={[
                styles.numberChip,
                isSelected && { backgroundColor: numColor, borderColor: numColor },
              ]}
            >
              <Text style={[styles.numberChipText, isSelected && { color: '#fff' }]}>
                ×{n}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Tab Selector: Flashcard vs Tabel vs Contoh Soal vs Trik vs Uji Kuis */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBarScroll}
      >
        <Pressable
          onPress={() => {
            SoundService.tap();
            setActiveTab('flashcard');
          }}
          style={[styles.tabBtn, activeTab === 'flashcard' && styles.tabBtnActive]}
        >
          <Text style={[styles.tabBtnText, activeTab === 'flashcard' && styles.tabBtnTextActive]}>
            🃏 Flashcard 3D
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            SoundService.tap();
            setActiveTab('table');
          }}
          style={[styles.tabBtn, activeTab === 'table' && styles.tabBtnActive]}
        >
          <Text style={[styles.tabBtnText, activeTab === 'table' && styles.tabBtnTextActive]}>
            📋 Tabel Lengkap
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            SoundService.tap();
            setActiveTab('examples');
          }}
          style={[styles.tabBtn, activeTab === 'examples' && styles.tabBtnActive]}
        >
          <Text style={[styles.tabBtnText, activeTab === 'examples' && styles.tabBtnTextActive]}>
            📚 Contoh Soal
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            SoundService.tap();
            setActiveTab('tricks');
          }}
          style={[styles.tabBtn, activeTab === 'tricks' && styles.tabBtnActive]}
        >
          <Text style={[styles.tabBtnText, activeTab === 'tricks' && styles.tabBtnTextActive]}>
            💡 Trik Cepat
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            SoundService.tap();
            setActiveTab('quiz');
          }}
          style={[styles.tabBtn, activeTab === 'quiz' && styles.tabBtnActive]}
        >
          <Text style={[styles.tabBtnText, activeTab === 'quiz' && styles.tabBtnTextActive]}>
            ⚔️ Uji Kuis
          </Text>
        </Pressable>
      </ScrollView>

      {/* Tab Contents */}
      {activeTab === 'flashcard' && (
        <Animated.View entering={FadeIn} style={styles.tabContent}>
          <FlashcardView items={tableItems} targetN={selectedN} />
        </Animated.View>
      )}

      {activeTab === 'table' && (
        <Animated.View entering={FadeIn} style={styles.tabContent}>
          <TableListView items={tableItems} targetN={selectedN} />
        </Animated.View>
      )}

      {activeTab === 'examples' && (
        <Animated.View entering={FadeIn} style={styles.tabContent}>
          <ExampleProblemsView targetN={selectedN} />
        </Animated.View>
      )}

      {activeTab === 'tricks' && (
        <Animated.View entering={FadeIn} style={styles.tabContent}>
          <TricksView targetN={selectedN} />
        </Animated.View>
      )}

      {activeTab === 'quiz' && (
        <Animated.View entering={FadeIn} style={styles.quizLobbyCard}>
          <Text style={styles.quizLobbyEmoji}>🎯</Text>
          <Text style={styles.quizLobbyTitle}>Pilih Tantangan Uji Hafalan</Text>
          <Text style={styles.quizLobbyDesc}>
            Uji seberapa cepat dan lancar kamu mengingat hasil perkalian!
          </Text>

          {/* Section: Pilih Jumlah Soal */}
          <View style={styles.countSection}>
            <Text style={styles.countSectionTitle}>Pilih Jumlah Soal:</Text>
            <View style={styles.countSelectorRow}>
              {([10, 20, 30] as const).map((cnt) => {
                const isActive = selectedCount === cnt;
                return (
                  <Pressable
                    key={cnt}
                    onPress={() => {
                      SoundService.pop();
                      setSelectedCount(cnt);
                    }}
                    style={[
                      styles.countChip,
                      isActive && styles.countChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.countChipText,
                        isActive && styles.countChipTextActive,
                      ]}
                    >
                      {cnt === 10 ? '⚡ 10' : cnt === 20 ? '🌟 20' : '🔥 30'} Soal
                    </Text>
                    <Text
                      style={[
                        styles.countChipSub,
                        isActive && styles.countChipSubActive,
                      ]}
                    >
                      {cnt === 10 ? 'Kilat' : cnt === 20 ? 'Mantap' : 'Maraton'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.quizOptionsGroup}>
            <Pressable
              style={[styles.quizOptionBtn, { backgroundColor: themeColor }]}
              onPress={() => startQuiz(selectedN, selectedCount)}
            >
              <Text style={styles.quizOptionBtnTitle}>
                Uji Khusus Perkalian ×{selectedN} 🚀
              </Text>
              <Text style={styles.quizOptionBtnSub}>
                {selectedCount} soal khusus menguji perkalian {selectedN}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.quizOptionBtn, { backgroundColor: '#7209B7' }]}
              onPress={() => startQuiz('mix', selectedCount)}
            >
              <Text style={styles.quizOptionBtnTitle}>
                🔥 Tantangan Campuran Semua Perkalian (1–10)
              </Text>
              <Text style={styles.quizOptionBtnSub}>
                {selectedCount} soal acak mencakup perkalian 1 sampai 10
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: 120, gap: spacing.md },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 2,
  },
  exitBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  exitBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMuted,
  },
  numberSelectorRow: {
    gap: 8,
    paddingVertical: 4,
  },
  numberChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 54,
  },
  numberChipText: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
  },
  tabBarScroll: {
    flexDirection: 'row',
    backgroundColor: '#EBE5D8',
    borderRadius: radius.pill,
    padding: 4,
    gap: 6,
  },
  tabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: colors.primary,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  tabBtnTextActive: {
    color: '#fff',
  },
  tabContent: {
    width: '100%',
  },
  quizLobbyCard: {
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EFE6D5',
    gap: 12,
  },
  quizLobbyEmoji: {
    fontSize: 54,
  },
  quizLobbyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },
  quizLobbyDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  countSection: {
    width: '100%',
    gap: 8,
    marginTop: 6,
  },
  countSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  countSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  countChip: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  countChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4361EE',
  },
  countChipText: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.textMuted,
  },
  countChipTextActive: {
    color: '#4361EE',
  },
  countChipSub: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    marginTop: 2,
  },
  countChipSubActive: {
    color: '#4361EE',
  },
  quizOptionsGroup: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  quizOptionBtn: {
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(0,0,0,0.25)',
  },
  quizOptionBtnTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  quizOptionBtnSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EFE6D5',
    gap: spacing.md,
  },
  resultEmoji: {
    fontSize: 64,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },
  resultSub: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textMuted,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#FFF7DC',
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderWidth: 3,
    borderColor: colors.secondary,
    gap: 6,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  scoreOutOf: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: radius.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
    marginTop: 4,
  },
  primaryActionBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  primaryActionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
});
