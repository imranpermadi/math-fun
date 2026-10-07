import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { GameShell, RoundApi } from '../../components/play/GameShell';
import { Draggable, useDropZone } from '../../components/play/Draggable';
import { Instruction, Row } from '../../components/play/Instruction';
import { SoundService } from '../../../core/sound/SoundService';
import { colors, radius, spacing } from '../../theme';
import type { GameProps } from '../types';
import { isFairShare, makeShareRound } from './logic';

const KIDS = ['👦', '👧', '🧒', '👶'];

function Round({ difficulty, onCorrect, onWrong }: RoundApi) {
  const [q] = useState(() => makeShareRound(difficulty));
  const [pile, setPile] = useState(() => Array.from({ length: q.total }, (_, i) => i));
  const [plates, setPlates] = useState<number[]>(() => Array(q.kids).fill(0));
  const [note, setNote] = useState('');
  const platesRef = useRef<number[]>(Array(q.kids).fill(0));
  const zones = [useDropZone(10), useDropZone(10), useDropZone(10), useDropZone(10)];
  const solved = useRef(false);

  const drop = (id: number) => async (x: number, y: number) => {
    for (let i = 0; i < q.kids; i++) {
      if (await zones[i].contains(x, y)) {
        SoundService.pop();
        platesRef.current = platesRef.current.map((c, k) => (k === i ? c + 1 : c));
        setPlates(platesRef.current);
        setPile((p) => {
          const next = p.filter((n) => n !== id);
          if (next.length === 0) setTimeout(() => check(next.length), 150);
          return next;
        });
        return true;
      }
    }
    return false;
  };

  const check = (left: number) => {
    if (solved.current) return;
    if (isFairShare(platesRef.current, left)) {
      solved.current = true;
      setNote(`${q.total} ÷ ${q.kids} = ${q.per}`);
      onCorrect();
    } else {
      setNote('Belum adil! Setiap anak harus dapat sama banyak. Tekan Ulangi.');
      onWrong();
    }
  };

  const reset = () => {
    SoundService.tap();
    platesRef.current = Array(q.kids).fill(0);
    setPlates(platesRef.current);
    setPile(Array.from({ length: q.total }, (_, i) => i));
    setNote('');
  };

  return (
    <>
      <Instruction text={`Ada ${q.total} kurma untuk ${q.kids} anak yatim. Geser kurma ke piring masing-masing agar adil, sama banyak!`} />

      <View style={styles.plates}>
        {Array.from({ length: q.kids }, (_, i) => (
          <View key={i} ref={zones[i].ref} style={styles.plate}>
            <Text style={styles.kid}>{KIDS[i]}</Text>
            <Row gap={0}>
              {Array.from({ length: plates[i] }, (_, k) => (
                <Animated.Text key={k} entering={ZoomIn} style={styles.small}>🟤</Animated.Text>
              ))}
            </Row>
            <Text style={styles.num}>{plates[i]}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.pile, { zIndex: 10 }]}>
        <Text style={styles.label}>🧺 Kurma ({pile.length})</Text>
        <Row gap={2}>
          {pile.map((id) => (
            <Draggable key={id} onDrop={drop(id)}>
              <Text style={styles.kurma}>🟤</Text>
            </Draggable>
          ))}
        </Row>
      </View>

      {!!note && <Text style={styles.note}>{note}</Text>}
      <Pressable style={styles.reset} onPress={reset}><Text style={styles.resetText}>🔄 Ulangi</Text></Pressable>
    </>
  );
}

export function BagiRataAnakYatim({ onExit }: GameProps) {
  return (
    <GameShell gameId="bagi-rata-anak-yatim" emoji="🤝" title="Bagi Rata Anak Yatim" onExit={onExit}
      renderRound={(api) => <Round {...api} />} />
  );
}

const styles = StyleSheet.create({
  plates: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
  plate: { flex: 1, minHeight: 150, backgroundColor: '#FFF1F5', borderRadius: radius.lg, borderWidth: 3, borderStyle: 'dashed', borderColor: colors.pink, alignItems: 'center', padding: 6, gap: 2 },
  kid: { fontSize: 36 },
  small: { fontSize: 20 },
  num: { fontSize: 22, fontWeight: '900', color: colors.accent, marginTop: 'auto' },
  pile: { backgroundColor: '#fff', borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm, minHeight: 100 },
  label: { fontSize: 16, fontWeight: '800', color: colors.text },
  kurma: { fontSize: 34 },
  note: { fontSize: 17, fontWeight: '800', color: colors.primaryDark, textAlign: 'center' },
  reset: { alignSelf: 'center', backgroundColor: colors.sky, borderRadius: radius.pill, paddingVertical: 10, paddingHorizontal: 24 },
  resetText: { fontWeight: '900', color: colors.text, fontSize: 16 },
});
