import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { MULTIPLICATION_TRICKS, MultiplicationTrick } from './examples';
import { MULTI_COLORS } from './logic';
import { SoundService } from '../../../core/sound/SoundService';
import { colors, radius, spacing } from '../../theme';

interface Props {
  targetN: number;
}

export function TricksView({ targetN }: Props) {
  const trick: MultiplicationTrick | undefined = MULTIPLICATION_TRICKS.find((t) => t.tableNumber === targetN);
  const themeColor = MULTI_COLORS[targetN] || colors.primary;

  // Interactive 9-finger state
  const [foldedFinger, setFoldedFinger] = useState<number>(4);

  // Interactive Doubler state for 2, 4, 8
  const [doublerNumber, setDoublerNumber] = useState<number>(7);

  if (!trick) {
    return (
      <View style={styles.card}>
        <Text style={styles.emptyText}>Trik cepat untuk perkalian ini sedang disusun.</Text>
      </View>
    );
  }

  // Finger calculation for 9s
  const leftFingersCount = foldedFinger - 1;
  const rightFingersCount = 10 - foldedFinger;
  const nineResult = leftFingersCount * 10 + rightFingersCount;

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn} key={trick.tableNumber} style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>{trick.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{trick.title}</Text>
            <Text style={styles.subtitle}>{trick.subtitle}</Text>
          </View>
        </View>

        {/* Formula Banner */}
        <View style={[styles.formulaBanner, { backgroundColor: themeColor }]}>
          <Text style={styles.formulaBannerLabel}>RUMUS RAHASIA:</Text>
          <Text style={styles.formulaBannerText}>{trick.formula}</Text>
        </View>

        {/* Secret Story / Insight */}
        <View style={styles.secretBox}>
          <Text style={styles.secretHeading}>💡 Cara Kerja Trik Ini:</Text>
          <Text style={styles.secretText}>{trick.secret}</Text>
        </View>

        {/* Special Interactive Feature for Table 9: Magic 10 Fingers */}
        {targetN === 9 && (
          <View style={styles.interactiveBox}>
            <View style={styles.interactiveTitleRow}>
              <Text style={styles.interactiveTitle}>🖐️ Simulasi Jari Ajaib Perkalian 9</Text>
              <Text style={styles.interactiveHint}>Ketuk jari yang ingin dilipat!</Text>
            </View>

            {/* Visual 10 Fingers Bar */}
            <View style={styles.handsContainer}>
              <View style={styles.handGroup}>
                <Text style={styles.handLabel}>Tangan Kiri</Text>
                <View style={styles.fingersRow}>
                  {[1, 2, 3, 4, 5].map((f) => {
                    const isFolded = foldedFinger === f;
                    const isLeft = f < foldedFinger;
                    return (
                      <Pressable
                        key={f}
                        onPress={() => {
                          SoundService.pop();
                          setFoldedFinger(f);
                        }}
                        style={[
                          styles.fingerBtn,
                          isFolded && styles.fingerFolded,
                          isLeft && styles.fingerLeftGroup,
                        ]}
                      >
                        <Text style={styles.fingerEmoji}>{isFolded ? '✊' : '☝️'}</Text>
                        <Text style={[styles.fingerNum, isFolded && styles.fingerNumFolded]}>{f}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.handGroup}>
                <Text style={styles.handLabel}>Tangan Kanan</Text>
                <View style={styles.fingersRow}>
                  {[6, 7, 8, 9, 10].map((f) => {
                    const isFolded = foldedFinger === f;
                    const isRight = f > foldedFinger;
                    return (
                      <Pressable
                        key={f}
                        onPress={() => {
                          SoundService.pop();
                          setFoldedFinger(f);
                        }}
                        style={[
                          styles.fingerBtn,
                          isFolded && styles.fingerFolded,
                          isRight && styles.fingerRightGroup,
                        ]}
                      >
                        <Text style={styles.fingerEmoji}>{isFolded ? '✊' : '☝️'}</Text>
                        <Text style={[styles.fingerNum, isFolded && styles.fingerNumFolded]}>{f}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Calculation readout */}
            <Animated.View entering={ZoomIn} key={foldedFinger} style={styles.fingerResultBox}>
              <View style={styles.fingerEquationRow}>
                <Text style={styles.fingerEquationMain}>
                  9 × <Text style={{ color: '#2563EB' }}>{foldedFinger}</Text> ={' '}
                  <Text style={{ color: colors.primaryDark }}>{nineResult}</Text>
                </Text>
              </View>
              <View style={styles.fingerBreakdownRow}>
                <View style={[styles.digitBadge, { backgroundColor: '#DBEAFE' }]}>
                  <Text style={styles.digitBadgeLabel}>Kiri (Puluhan):</Text>
                  <Text style={[styles.digitBadgeVal, { color: '#1D4ED8' }]}>{leftFingersCount} jari = {leftFingersCount * 10}</Text>
                </View>
                <Text style={styles.plusSign}>+</Text>
                <View style={[styles.digitBadge, { backgroundColor: '#FED7AA' }]}>
                  <Text style={styles.digitBadgeLabel}>Kanan (Satuan):</Text>
                  <Text style={[styles.digitBadgeVal, { color: '#C2410C' }]}>{rightFingersCount} jari = {rightFingersCount}</Text>
                </View>
              </View>
            </Animated.View>
          </View>
        )}

        {/* Special Interactive Feature for Table 4 & 8: Doubling Tree */}
        {(targetN === 4 || targetN === 8) && (
          <View style={styles.interactiveBox}>
            <View style={styles.interactiveTitleRow}>
              <Text style={styles.interactiveTitle}>⚡ Mesin Lipat Gandakan Angka</Text>
              <Text style={styles.interactiveHint}>Pilih angka untuk dilipatgandakan:</Text>
            </View>

            <View style={styles.chipRow}>
              {[2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <Pressable
                  key={n}
                  onPress={() => {
                    SoundService.pop();
                    setDoublerNumber(n);
                  }}
                  style={[
                    styles.doublerChip,
                    doublerNumber === n && { backgroundColor: themeColor, borderColor: themeColor },
                  ]}
                >
                  <Text style={[styles.doublerChipText, doublerNumber === n && { color: '#fff' }]}>
                    {n}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Animated.View entering={ZoomIn} key={doublerNumber} style={styles.treeBox}>
              <View style={styles.treeStep}>
                <Text style={styles.treeStepLabel}>Mulai dari Angka:</Text>
                <Text style={styles.treeStepVal}>{doublerNumber}</Text>
              </View>
              <Text style={styles.treeArrow}>↓ Lipat 1x (×2)</Text>
              <View style={styles.treeStep}>
                <Text style={styles.treeStepLabel}>Hasil ×2:</Text>
                <Text style={styles.treeStepVal}>{doublerNumber * 2}</Text>
              </View>
              <Text style={styles.treeArrow}>↓ Lipat 2x (×4)</Text>
              <View style={[styles.treeStep, targetN === 4 && { backgroundColor: '#DCFCE7', borderColor: '#16A34A' }]}>
                <Text style={[styles.treeStepLabel, targetN === 4 && { color: '#15803D' }]}>
                  Hasil {doublerNumber} × 4:
                </Text>
                <Text style={[styles.treeStepVal, targetN === 4 && { color: '#15803D', fontSize: 20 }]}>
                  {doublerNumber * 4}
                </Text>
              </View>

              {targetN === 8 && (
                <>
                  <Text style={styles.treeArrow}>↓ Lipat 3x (×8)</Text>
                  <View style={[styles.treeStep, { backgroundColor: '#DCFCE7', borderColor: '#16A34A' }]}>
                    <Text style={[styles.treeStepLabel, { color: '#15803D' }]}>
                      Hasil {doublerNumber} × 8:
                    </Text>
                    <Text style={[styles.treeStepVal, { color: '#15803D', fontSize: 20 }]}>
                      {doublerNumber * 8}
                    </Text>
                  </View>
                </>
              )}
            </Animated.View>
          </View>
        )}

        {/* Visual Guide List */}
        <View style={styles.visualGuideBox}>
          <Text style={styles.guideTitle}>Panduan & Contoh Perhitungan:</Text>
          {trick.visualGuide.map((g, idx) => (
            <View key={idx} style={styles.guideItem}>
              <Text style={styles.guideBullet}>✓</Text>
              <Text style={styles.guideText}>{g}</Text>
            </View>
          ))}
        </View>

        {/* Quick Example */}
        <View style={styles.exampleFooter}>
          <Text style={styles.exampleFooterLabel}>Contoh Cepat:</Text>
          <Text style={styles.exampleFooterText}>{trick.exampleCalculation}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  card: {
    backgroundColor: '#fff',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerEmoji: { fontSize: 36 },
  title: { fontSize: 18, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  formulaBanner: {
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  formulaBannerLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  formulaBannerText: { color: '#fff', fontSize: 18, fontWeight: '900', textAlign: 'center' },
  secretBox: {
    backgroundColor: '#FEF9C3',
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#CA8A04',
    gap: 6,
  },
  secretHeading: { fontSize: 14, fontWeight: '800', color: '#854D0E' },
  secretText: { fontSize: 14, color: '#713F12', lineHeight: 21 },
  interactiveBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  interactiveTitleRow: { gap: 2 },
  interactiveTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  interactiveHint: { fontSize: 12, color: colors.textMuted },
  handsContainer: { flexDirection: 'row', gap: 12, justifyContent: 'space-between', marginTop: 6 },
  handGroup: { flex: 1, alignItems: 'center', gap: 4 },
  handLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  fingersRow: { flexDirection: 'row', gap: 4 },
  fingerBtn: {
    width: 28,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  fingerFolded: { backgroundColor: '#64748B', transform: [{ scale: 0.9 }, { translateY: 4 }] },
  fingerLeftGroup: { backgroundColor: '#BFDBFE', borderColor: '#60A5FA' },
  fingerRightGroup: { backgroundColor: '#FED7AA', borderColor: '#FB923C' },
  fingerEmoji: { fontSize: 16 },
  fingerNum: { fontSize: 10, fontWeight: '900', color: colors.text },
  fingerNumFolded: { color: '#fff' },
  fingerResultBox: {
    backgroundColor: '#fff',
    borderRadius: radius.sm,
    padding: 10,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fingerEquationRow: { alignItems: 'center' },
  fingerEquationMain: { fontSize: 22, fontWeight: '900', color: colors.text },
  fingerBreakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  digitBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, alignItems: 'center' },
  digitBadgeLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted },
  digitBadgeVal: { fontSize: 12, fontWeight: '900' },
  plusSign: { fontSize: 16, fontWeight: '900', color: colors.textMuted },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 4 },
  doublerChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doublerChipText: { fontSize: 14, fontWeight: '800', color: colors.text },
  treeBox: { backgroundColor: '#fff', borderRadius: radius.sm, padding: 12, alignItems: 'center', gap: 4 },
  treeStep: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  treeStepLabel: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  treeStepVal: { fontSize: 16, fontWeight: '900', color: colors.text },
  treeArrow: { fontSize: 12, fontWeight: '800', color: colors.primaryDark },
  visualGuideBox: { backgroundColor: '#F0FDF4', borderRadius: radius.md, padding: spacing.md, gap: 8 },
  guideTitle: { fontSize: 14, fontWeight: '800', color: '#166534' },
  guideItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  guideBullet: { color: '#15803D', fontWeight: '900', fontSize: 14 },
  guideText: { fontSize: 13, color: '#14532D', flex: 1, lineHeight: 18 },
  exampleFooter: {
    backgroundColor: '#EFF6FF',
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    gap: 4,
  },
  exampleFooterLabel: { fontSize: 12, fontWeight: '800', color: '#1D4ED8' },
  exampleFooterText: { fontSize: 14, fontWeight: '700', color: colors.text },
  emptyText: { textAlign: 'center', color: colors.textMuted, fontSize: 14 },
});
