import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  BounceIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { MatchPair } from '../../../domain/entities/ExamQuestion';
import { SoundService } from '../../../core/sound/SoundService';
import { colors, radius, spacing } from '../../theme';

const MATCH_COLORS = ['#3A86FF', '#FB5607', '#06D6A0', '#8338EC', '#FF006E'];

/**
 * Fisher-Yates shuffle with guaranteed derangement:
 * Ensures NO item in the right column sits at the exact same row/index as the left column!
 */
function shufflePairs(items: MatchPair[]): MatchPair[] {
  if (items.length <= 1) return [...items];

  const shuffled = [...items];

  for (let attempt = 0; attempt < 20; attempt++) {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Verify none of the items are at the same row as the original
    const hasSamePosition = shuffled.some((item, idx) => item.id === items[idx].id);
    if (!hasSamePosition) {
      return shuffled;
    }
  }

  // Fallback guaranteed derangement (cyclic shift by 1 or 2)
  return [...items.slice(1), items[0]];
}

interface Props {
  pairs: MatchPair[];
  onCorrect: () => void;
  onWrong: () => void;
}

export function MatchingCard({ pairs, onCorrect, onWrong }: Props) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [shuffledRight, setShuffledRight] = useState<MatchPair[]>(() => shufflePairs(pairs));

  const shake = useSharedValue(0);

  // Re-shuffle and reset state whenever question pairs change
  useEffect(() => {
    setShuffledRight(shufflePairs(pairs));
    setSelectedLeft(null);
    setMatchedIds(new Set());
  }, [pairs]);

  const handleSelectLeft = (id: string) => {
    if (matchedIds.has(id)) return;
    SoundService.pop();
    setSelectedLeft(id);
  };

  const handleSelectRight = (pair: MatchPair) => {
    if (!selectedLeft || matchedIds.has(pair.id)) return;

    if (selectedLeft === pair.id) {
      // Correct match!
      SoundService.pop();
      const nextMatched = new Set(matchedIds).add(pair.id);
      setMatchedIds(nextMatched);
      setSelectedLeft(null);

      if (nextMatched.size === pairs.length) {
        SoundService.correct();
        setTimeout(onCorrect, 1000);
      }
    } else {
      // Wrong match
      SoundService.wrong();
      shake.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 70 }),
        withTiming(0, { duration: 50 })
      );
      onWrong();
      setSelectedLeft(null);
    }
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const isAllMatched = matchedIds.size === pairs.length;

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <Text style={styles.hint}>
        {isAllMatched
          ? 'Alhamdulillah, semua 4 pasangan sudah cocok! 🎉'
          : selectedLeft
          ? 'Sekarang pilih jawaban pasangannya di kolom kanan 👉'
          : 'Ketuk soal di sebelah kiri terlebih dahulu 👈'}
      </Text>

      <View style={styles.grid}>
        {/* Left Column (Questions) */}
        <View style={styles.column}>
          <Text style={styles.colTitle}>Soal</Text>
          {pairs.map((p, idx) => {
            const isMatched = matchedIds.has(p.id);
            const isSelected = selectedLeft === p.id;
            const matchColor = MATCH_COLORS[idx % MATCH_COLORS.length];

            return (
              <Pressable
                key={p.id}
                disabled={isMatched}
                onPress={() => handleSelectLeft(p.id)}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                  isMatched && { backgroundColor: matchColor, borderColor: matchColor },
                ]}
              >
                <Text
                  style={[
                    styles.cardText,
                    isMatched && styles.cardTextMatched,
                    isSelected && { color: colors.primaryDark },
                  ]}
                >
                  {p.left}
                </Text>
                {isMatched && <Text style={styles.checkIcon}>✓</Text>}
              </Pressable>
            );
          })}
        </View>

        {/* Right Column (Shuffled Answers) */}
        <View style={styles.column}>
          <Text style={styles.colTitle}>Jawaban Acak</Text>
          {shuffledRight.map((p) => {
            const isMatched = matchedIds.has(p.id);
            const originalIndex = pairs.findIndex((orig) => orig.id === p.id);
            const matchColor = MATCH_COLORS[originalIndex % MATCH_COLORS.length];

            return (
              <Pressable
                key={`r-${p.id}`}
                disabled={isMatched || !selectedLeft}
                onPress={() => handleSelectRight(p)}
                style={[
                  styles.card,
                  isMatched && { backgroundColor: matchColor, borderColor: matchColor },
                  !selectedLeft && !isMatched && { opacity: 0.8 },
                ]}
              >
                <Text style={[styles.cardText, isMatched && styles.cardTextMatched]}>
                  {p.right}
                </Text>
                {isMatched && <Text style={styles.checkIcon}>✓</Text>}
              </Pressable>
            );
          })}
        </View>
      </View>

      {isAllMatched && (
        <Animated.View entering={BounceIn} style={styles.successBanner}>
          <Text style={styles.successBannerText}>Semua 4 Pasangan Cocok! ⭐</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    width: '100%',
  },
  hint: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'center',
    backgroundColor: '#E8F6FF',
    borderRadius: radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
  },
  column: {
    flex: 1,
    gap: 8,
  },
  colTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMuted,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  card: {
    minHeight: 52,
    backgroundColor: '#fff',
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderBottomWidth: 4,
    borderBottomColor: '#D1D5DB',
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#D8F3DC',
    borderBottomColor: colors.primaryDark,
    transform: [{ scale: 1.03 }],
  },
  cardText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  cardTextMatched: {
    color: '#fff',
    fontWeight: '900',
  },
  checkIcon: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
  successBanner: {
    backgroundColor: '#D8F3DC',
    borderRadius: radius.pill,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primaryDark,
    marginTop: 4,
  },
  successBannerText: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primaryDark,
  },
});
