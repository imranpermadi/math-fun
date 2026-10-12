import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  BounceIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MultiItem, MULTI_COLORS } from './logic';
import { SoundService } from '../../../core/sound/SoundService';
import { colors, radius, spacing } from '../../theme';

interface Props {
  items: MultiItem[];
  targetN: number;
}

export function FlashcardView({ items, targetN }: Props) {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState<Set<number>>(new Set());

  const currentItem = items[index];
  const flipRotation = useSharedValue(0);

  const flipCard = () => {
    SoundService.pop();
    if (isFlipped) {
      flipRotation.value = withSpring(0, { damping: 14, stiffness: 120 });
      setIsFlipped(false);
    } else {
      flipRotation.value = withSpring(180, { damping: 14, stiffness: 120 });
      setIsFlipped(true);
      SoundService.speak(currentItem.speechText);
    }
  };

  const nextCard = () => {
    if (index < items.length - 1) {
      SoundService.tap();
      flipRotation.value = 0;
      setIsFlipped(false);
      setIndex(index + 1);
    }
  };

  const prevCard = () => {
    if (index > 0) {
      SoundService.tap();
      flipRotation.value = 0;
      setIsFlipped(false);
      setIndex(index - 1);
    }
  };

  const toggleMastery = () => {
    SoundService.pop();
    setMastered((prev) => {
      const next = new Set(prev);
      if (next.has(currentItem.multiplier)) {
        next.delete(currentItem.multiplier);
      } else {
        next.add(currentItem.multiplier);
        SoundService.correct();
      }
      return next;
    });
  };

  const speakCurrent = () => {
    SoundService.tap();
    SoundService.speak(currentItem.speechText);
  };

  // 3D Card Animation Styles
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(flipRotation.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${rotate}deg` }],
      opacity: flipRotation.value >= 90 ? 0 : 1,
      zIndex: flipRotation.value >= 90 ? 0 : 1,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(flipRotation.value, [0, 180], [180, 360]);
    return {
      transform: [{ rotateY: `${rotate}deg` }],
      opacity: flipRotation.value >= 90 ? 1 : 0,
      zIndex: flipRotation.value >= 90 ? 1 : 0,
    };
  });

  const cardColor = MULTI_COLORS[targetN] || colors.primary;
  const isCurrentMastered = mastered.has(currentItem.multiplier);

  return (
    <View style={styles.container}>
      {/* Top Indicator & TTS Speak Button */}
      <View style={styles.topBar}>
        <Text style={styles.cardCounter}>
          Kartu {index + 1} dari {items.length}
        </Text>
        <Pressable style={styles.soundButton} onPress={speakCurrent}>
          <Text style={styles.soundButtonText}>🔊 Baca Suara</Text>
        </Pressable>
      </View>

      {/* 3D Flip Card Container */}
      <Pressable onPress={flipCard} style={styles.cardContainer}>
        {/* Front of Card */}
        <Animated.View style={[styles.cardSide, styles.cardFront, { borderColor: cardColor }, frontAnimatedStyle]}>
          <View style={[styles.cardHeaderStrip, { backgroundColor: cardColor }]}>
            <Text style={styles.cardHeaderStripText}>Perkalian {targetN}</Text>
          </View>
          <Text style={styles.cardPromptText}>
            {currentItem.multiplier} × {currentItem.multiplicand}
          </Text>
          <Text style={styles.equalSign}>= ?</Text>
          <View style={styles.tapToFlipHint}>
            <Text style={styles.tapToFlipText}>👆 Ketuk kartu untuk lihat jawaban!</Text>
          </View>
        </Animated.View>

        {/* Back of Card */}
        <Animated.View style={[styles.cardSide, styles.cardBack, { borderColor: cardColor }, backAnimatedStyle]}>
          <View style={[styles.cardHeaderStrip, { backgroundColor: '#2E9E6B' }]}>
            <Text style={styles.cardHeaderStripText}>Jawaban ✨</Text>
          </View>
          <Text style={styles.cardSmallEq}>
            {currentItem.multiplier} × {currentItem.multiplicand} =
          </Text>
          <Animated.Text entering={BounceIn} style={[styles.cardAnswerNumber, { color: cardColor }]}>
            {currentItem.product}
          </Animated.Text>
          <Text style={styles.cardRepeatedHint}>
            {Array(currentItem.multiplier).fill(currentItem.multiplicand).join(' + ')}
          </Text>
          <View style={styles.tapToFlipHint}>
            <Text style={styles.tapToFlipText}>👆 Ketuk lagi untuk membalik</Text>
          </View>
        </Animated.View>
      </Pressable>

      {/* Mastery Toggle */}
      <Pressable
        onPress={toggleMastery}
        style={[styles.masteryButton, isCurrentMastered && styles.masteryButtonActive]}
      >
        <Text style={styles.masteryButtonText}>
          {isCurrentMastered ? '⭐ Sudah Dihafal! (Hebat)' : '☆ Tandai Sudah Hafal'}
        </Text>
      </Pressable>

      {/* Navigation Buttons */}
      <View style={styles.navRow}>
        <Pressable
          disabled={index === 0}
          onPress={prevCard}
          style={[styles.navBtn, index === 0 && styles.navBtnDisabled]}
        >
          <Text style={styles.navBtnText}>◀ Mundur</Text>
        </Pressable>

        <Pressable
          disabled={index === items.length - 1}
          onPress={nextCard}
          style={[styles.navBtn, { backgroundColor: cardColor }, index === items.length - 1 && styles.navBtnDisabled]}
        >
          <Text style={[styles.navBtnText, { color: '#fff' }]}>Lanjut ▶</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    alignItems: 'center',
    width: '100%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 4,
  },
  cardCounter: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textMuted,
  },
  soundButton: {
    backgroundColor: '#FFF7DC',
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: colors.secondary,
  },
  soundButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#8B5E34',
  },
  cardContainer: {
    width: '100%',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSide: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    borderWidth: 3,
    borderBottomWidth: 7,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cardFront: {
    backgroundColor: '#FFFFFF',
  },
  cardBack: {
    backgroundColor: '#F0FFF4',
  },
  cardHeaderStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: radius.xl - 3,
    borderTopRightRadius: radius.xl - 3,
    paddingVertical: 6,
    alignItems: 'center',
  },
  cardHeaderStripText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardPromptText: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.text,
    marginTop: 18,
  },
  equalSign: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  cardSmallEq: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textMuted,
    marginTop: 18,
  },
  cardAnswerNumber: {
    fontSize: 64,
    fontWeight: '900',
    marginVertical: 2,
  },
  cardRepeatedHint: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  tapToFlipHint: {
    position: 'absolute',
    bottom: 12,
  },
  tapToFlipText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textMuted,
  },
  masteryButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  masteryButtonActive: {
    backgroundColor: '#FFF7DC',
    borderColor: colors.secondary,
  },
  masteryButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#8B5E34',
  },
  navRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  navBtn: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.15)',
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  navBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
  },
});
