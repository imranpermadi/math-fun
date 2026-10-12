import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  BounceIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { MultiItem, MULTI_COLORS } from './logic';
import { SoundService } from '../../../core/sound/SoundService';
import { colors, radius, spacing } from '../../theme';

interface RowProps {
  item: MultiItem;
  color: string;
  isAutoActive: boolean;
  onPress: () => void;
}

function TableRowItem({ item, color, isAutoActive, onPress }: RowProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.rowWrap, animStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[
          styles.rowCard,
          isAutoActive && styles.rowCardActive,
          isAutoActive && { borderColor: color },
        ]}
      >
        <View style={[styles.multiplierBadge, { backgroundColor: color }]}>
          <Text style={styles.multiplierText}>{item.multiplier}</Text>
        </View>

        <Text style={styles.equationText}>
          × {item.multiplicand} =
        </Text>

        <Text style={[styles.productText, { color }]}>
          {item.product}
        </Text>

        <Pressable onPress={onPress} style={styles.soundMiniBtn}>
          <Text style={styles.soundMiniIcon}>🔊</Text>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

interface Props {
  items: MultiItem[];
  targetN: number;
}

export function TableListView({ items, targetN }: Props) {
  const [activeSpeechIdx, setActiveSpeechIdx] = useState<number | null>(null);
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const autoPlayRef = useRef(false);

  const cardColor = MULTI_COLORS[targetN] || colors.primary;

  const playLine = (index: number) => {
    SoundService.pop();
    setActiveSpeechIdx(index);
    SoundService.speak(items[index].speechText);
  };

  const stopAutoPlay = () => {
    autoPlayRef.current = false;
    setIsPlayingAuto(false);
    setActiveSpeechIdx(null);
    SoundService.stopSpeaking();
  };

  const startAutoPlay = () => {
    if (isPlayingAuto) {
      stopAutoPlay();
      return;
    }

    autoPlayRef.current = true;
    setIsPlayingAuto(true);

    let idx = 0;
    const runStep = () => {
      if (!autoPlayRef.current || idx >= items.length) {
        stopAutoPlay();
        return;
      }

      setActiveSpeechIdx(idx);
      SoundService.speak(items[idx].speechText);
      idx += 1;

      setTimeout(() => {
        if (autoPlayRef.current) {
          runStep();
        }
      }, 2600);
    };

    runStep();
  };

  useEffect(() => {
    return () => {
      autoPlayRef.current = false;
      SoundService.stopSpeaking();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Header with Auto-play button */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Tabel Lengkap Perkalian {targetN}</Text>
          <Text style={styles.subtitle}>Ketuk baris mana saja untuk mendengarkan lafalnya</Text>
        </View>

        <Pressable
          onPress={startAutoPlay}
          style={[styles.autoPlayBtn, isPlayingAuto && styles.autoPlayBtnActive]}
        >
          <Text style={[styles.autoPlayBtnText, isPlayingAuto && { color: '#fff' }]}>
            {isPlayingAuto ? '⏹ Berhenti' : '▶ Putar Semua'}
          </Text>
        </Pressable>
      </View>

      {/* Rows List */}
      <View style={styles.list}>
        {items.map((item, idx) => (
          <TableRowItem
            key={item.multiplier}
            item={item}
            color={cardColor}
            isAutoActive={activeSpeechIdx === idx}
            onPress={() => playLine(idx)}
          />
        ))}
      </View>

      {/* Pattern Reminder at Bottom */}
      <View style={styles.patternBox}>
        <Text style={styles.patternTitle}>💡 Pola Hafalan Cepat:</Text>
        <Text style={styles.patternDesc}>
          Setiap langkah selalu bertambah <Text style={{ fontWeight: '900', color: cardColor }}>+{targetN}</Text>.
          Hitung loncat: {items.map((i) => i.product).join(', ')}.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  autoPlayBtn: {
    backgroundColor: '#FFF7DC',
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  autoPlayBtnActive: {
    backgroundColor: '#E63946',
    borderColor: '#B00020',
  },
  autoPlayBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#8B5E34',
  },
  list: {
    gap: 8,
    width: '100%',
  },
  rowWrap: {
    width: '100%',
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderBottomWidth: 4,
    borderBottomColor: '#D1D5DB',
    gap: 12,
  },
  rowCardActive: {
    backgroundColor: '#F0FFF4',
    borderWidth: 2.5,
    borderBottomWidth: 5,
  },
  multiplierBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  multiplierText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  equationText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  productText: {
    fontSize: 24,
    fontWeight: '900',
    flex: 1,
  },
  soundMiniBtn: {
    padding: 6,
  },
  soundMiniIcon: {
    fontSize: 18,
  },
  patternBox: {
    backgroundColor: '#FDFBF7',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: '#E6D5B8',
    gap: 4,
  },
  patternTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#8B5E34',
  },
  patternDesc: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 20,
  },
});
