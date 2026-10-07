import React, { useState } from 'react';
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

const MATCH_COLORS = ['#3A86FF', '#FB5607', '#06D6A0', '#8338EC'];

interface Props {
  pairs: MatchPair[];
  onCorrect: () => void;
  onWrong: () => void;
}

export function MatchingCard({ pairs, onCorrect, onWrong }: Props) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [shuffledRight] = useState(() =>
    [...pairs].sort(() => Math.random() - 0.5)
  );

  const shake = useSharedValue(0);

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
          ? 'Alhamdulillah, semua pasangan sudah cocok! 🎉'
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

        {/* Right Column (Answers) */}
        <View style={styles.column}>
          <Text style={styles.colTitle}>Jawaban</Text>
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
                  !selectedLeft && !isMatched && { opacity: 0.75 },
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
          <Text style={styles.successBannerText}>Semua Penjodohan Benar! ⭐</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    width: '100%',
  },
  hint: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'center',
    backgroundColor: '#E8F6FF',
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  column: {
    flex: 1,
    gap: 10,
  },
  colTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textMuted,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  card: {
    minHeight: 64,
    backgroundColor: '#fff',
    borderRadius: radius.md,
    borderWidth: 2.5,
    borderColor: '#E5E7EB',
    borderBottomWidth: 5,
    borderBottomColor: '#D1D5DB',
    padding: spacing.sm,
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
    fontSize: 16,
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
    fontSize: 18,
  },
  successBanner: {
    backgroundColor: '#D8F3DC',
    borderRadius: radius.pill,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primaryDark,
  },
  successBannerText: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.primaryDark,
  },
});

