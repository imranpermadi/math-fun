import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { GameShell, RoundApi } from '../../components/play/GameShell';
import { Choices } from '../../components/play/Choices';
import { Instruction } from '../../components/play/Instruction';
import { SoundService } from '../../../core/sound/SoundService';
import { colors, radius, spacing } from '../../theme';
import type { GameProps } from '../types';
import { frac, makeFractionRound } from './logic';

function Fraction({ n, d, size = 44 }: { n: number; d: number; size?: number }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={[styles.fn, { fontSize: size }]}>{n}</Text>
      <View style={[styles.fbar, { width: size * 0.9 }]} />
      <Text style={[styles.fn, { fontSize: size }]}>{d}</Text>
    </View>
  );
}

function Chest({ parts, selected, onToggle }: { parts: number; selected: boolean[]; onToggle?: (i: number) => void }) {
  return (
    <View style={styles.chest}>
      <Text style={styles.chestLid}>🧰 Peti Harta Kebaikan</Text>
      <View style={styles.bar}>
        {selected.map((on, i) => (
          <Pressable key={i} disabled={!onToggle} onPress={() => onToggle?.(i)} style={[styles.part, on && styles.partOn]}>
            {on && <Animated.Text entering={ZoomIn} style={styles.gem}>💎</Animated.Text>}
          </Pressable>
        ))}
      </View>
      <Text style={styles.sub}>Dibagi menjadi {parts} bagian sama besar</Text>
    </View>
  );
}

function Round({ difficulty, onCorrect, onWrong }: RoundApi) {
  const [q] = useState(() => makeFractionRound(difficulty));
  const [sel, setSel] = useState<boolean[]>(() => Array.from({ length: q.parts }, (_, i) => q.mode === 'name' && i < q.num));
  const count = sel.filter(Boolean).length;

  if (q.mode === 'name') {
    return (
      <>
        <Instruction text="Lihat peti harta ini. Berapa bagian harta yang sudah terisi permata? Pilih pecahan yang benar!" />
        <Chest parts={q.parts} selected={sel} />
        <Choices choices={q.choices} correct={frac(q.num, q.parts)} onCorrect={onCorrect} onWrong={onWrong} />
      </>
    );
  }

  const toggle = (i: number) => { SoundService.pop(); setSel((s) => s.map((v, k) => (k === i ? !v : v))); };

  return (
    <>
      <Instruction text={`Ambil ${q.num} bagian dari ${q.parts} bagian harta karun untuk dibagikan. Ketuk bagian peti untuk mengisinya dengan permata!`} />
      <View style={styles.target}><Fraction n={q.num} d={q.parts} /></View>
      <Chest parts={q.parts} selected={sel} onToggle={toggle} />
      <Text style={styles.status}>Terisi: {count} dari {q.parts}</Text>
      <Pressable style={styles.check} onPress={() => (count === q.num ? onCorrect() : onWrong())}>
        <Text style={styles.checkText}>Periksa ✅</Text>
      </Pressable>
    </>
  );
}

export function HartaKarunKebaikan({ onExit }: GameProps) {
  return (
    <GameShell gameId="harta-karun-kebaikan" emoji="💎" title="Harta Karun Kebaikan" onExit={onExit}
      renderRound={(api) => <Round {...api} />} />
  );
}

const styles = StyleSheet.create({
  fn: { fontWeight: '900', color: colors.primaryDark },
  fbar: { height: 4, backgroundColor: colors.primaryDark, borderRadius: 2, marginVertical: 2 },
  target: { alignItems: 'center' },
  chest: { backgroundColor: '#fff', borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm },
  chestLid: { fontSize: 18, fontWeight: '900', color: colors.text, textAlign: 'center' },
  bar: { flexDirection: 'row', height: 74, borderRadius: radius.md, overflow: 'hidden', borderWidth: 4, borderColor: '#8B5E34' },
  part: { flex: 1, backgroundColor: '#FDF1D8', borderRightWidth: 3, borderRightColor: '#8B5E34', alignItems: 'center', justifyContent: 'center' },
  partOn: { backgroundColor: '#FFD166' },
  gem: { fontSize: 28 },
  sub: { textAlign: 'center', color: colors.textMuted, fontWeight: '700' },
  status: { textAlign: 'center', fontSize: 18, fontWeight: '800', color: colors.accent },
  check: { alignSelf: 'center', backgroundColor: colors.primary, borderRadius: radius.pill, paddingVertical: 12, paddingHorizontal: 36 },
  checkText: { color: '#fff', fontSize: 20, fontWeight: '900' },
});
