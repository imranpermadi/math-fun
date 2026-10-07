import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GameShell, RoundApi } from '../../components/play/GameShell';
import { Choices } from '../../components/play/Choices';
import { Instruction } from '../../components/play/Instruction';
import { SoundService } from '../../../core/sound/SoundService';
import { colors, radius, spacing } from '../../theme';
import type { GameProps } from '../types';
import { AnalogClock } from './AnalogClock';
import { fmt, makeTimeRound, minutesFor } from './logic';

function Stepper({ label, value, onMinus, onPlus }: { label: string; value: string; onMinus: () => void; onPlus: () => void }) {
  return (
    <View style={styles.stepper}>
      <Text style={styles.stepLabel}>{label}</Text>
      <View style={styles.stepRow}>
        <Pressable style={styles.stepBtn} onPress={() => { SoundService.tap(); onMinus(); }}><Text style={styles.stepText}>−</Text></Pressable>
        <Text style={styles.stepValue}>{value}</Text>
        <Pressable style={styles.stepBtn} onPress={() => { SoundService.tap(); onPlus(); }}><Text style={styles.stepText}>+</Text></Pressable>
      </View>
    </View>
  );
}

function Round({ difficulty, onCorrect, onWrong }: RoundApi) {
  const [q] = useState(() => makeTimeRound(difficulty));
  const mins = minutesFor(difficulty);
  const [h, setH] = useState(12);
  const [mi, setMi] = useState(0); // index into mins
  const m = mins[mi];
  const target = fmt(q.hour, q.minute);

  if (q.mode === 'read') {
    return (
      <>
        <Instruction text={`Lihat jam ini. Jam berapa waktu shalat ${q.prayer}?`} />
        <View style={styles.clockWrap}><AnalogClock hour={q.hour} minute={q.minute} /></View>
        <Choices choices={q.choices} correct={target} onCorrect={onCorrect} onWrong={onWrong} />
      </>
    );
  }

  const check = () => {
    if (h === q.hour && m === q.minute) onCorrect();
    else onWrong();
  };

  return (
    <>
      <Instruction text={`Waktu shalat ${q.prayer} jam ${target}. Putar jarum jam dengan tombol agar menunjukkan jam ${target}!`} />
      <View style={styles.clockWrap}><AnalogClock hour={h} minute={m} /></View>
      <Text style={styles.digital}>{fmt(h, m)}</Text>
      <View style={styles.controls}>
        <Stepper label="Jam" value={String(h)} onMinus={() => setH((v) => (v === 1 ? 12 : v - 1))} onPlus={() => setH((v) => (v === 12 ? 1 : v + 1))} />
        {mins.length > 1 && (
          <Stepper label="Menit" value={String(m).padStart(2, '0')}
            onMinus={() => setMi((v) => (v - 1 + mins.length) % mins.length)} onPlus={() => setMi((v) => (v + 1) % mins.length)} />
        )}
      </View>
      <Pressable style={styles.check} onPress={check}><Text style={styles.checkText}>Periksa ✅</Text></Pressable>
    </>
  );
}

export function PuzzleWaktuShalat({ onExit }: GameProps) {
  return (
    <GameShell gameId="puzzle-waktu-shalat" emoji="🕰️" title="Puzzle Waktu Shalat" onExit={onExit}
      renderRound={(api) => <Round {...api} />} />
  );
}

const styles = StyleSheet.create({
  clockWrap: { alignItems: 'center' },
  digital: { textAlign: 'center', fontSize: 34, fontWeight: '900', color: colors.text },
  controls: { flexDirection: 'row', justifyContent: 'center', gap: spacing.lg },
  stepper: { alignItems: 'center', gap: 4 },
  stepLabel: { fontWeight: '800', color: colors.textMuted, fontSize: 15 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.sky, alignItems: 'center', justifyContent: 'center' },
  stepText: { fontSize: 28, fontWeight: '900', color: colors.text },
  stepValue: { minWidth: 40, textAlign: 'center', fontSize: 26, fontWeight: '900', color: colors.text },
  check: { alignSelf: 'center', backgroundColor: colors.primary, borderRadius: radius.pill, paddingVertical: 12, paddingHorizontal: 36 },
  checkText: { color: '#fff', fontSize: 20, fontWeight: '900' },
});
