import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { GameShell, RoundApi } from '../../components/play/GameShell';
import { Draggable, useDropZone } from '../../components/play/Draggable';
import { Choices } from '../../components/play/Choices';
import { Instruction, Row } from '../../components/play/Instruction';
import { SoundService } from '../../../core/sound/SoundService';
import { numberChoices } from '../../../core/utils/random';
import { colors, radius, spacing } from '../../theme';
import type { GameProps } from '../types';
import { makeKurmaRound } from './logic';

function Round({ grade, onCorrect, onWrong }: RoundApi) {
  const [q] = useState(() => makeKurmaRound(grade));
  const [choices] = useState(() => numberChoices(q.answer, 3, 2));
  const [ids, setIds] = useState(() => Array.from({ length: q.sourceCount }, (_, i) => i));
  const [moved, setMoved] = useState(0);
  const movedRef = useRef(0);
  const target = useDropZone(24);
  const ready = moved >= q.need;

  const drop = (id: number) => async (x: number, y: number) => {
    if (movedRef.current >= q.need) return false;
    if (!(await target.contains(x, y))) return false;
    movedRef.current += 1;
    SoundService.pop();
    setMoved(movedRef.current);
    setIds((l) => l.filter((i) => i !== id));
    return true;
  };

  const inTarget = q.mode === 'add' ? q.a + moved : moved;

  return (
    <>
      <Instruction text={ready ? q.question : q.instruction} />

      <View style={[styles.panel, { zIndex: 10 }]}>
        <Text style={styles.label}>{q.mode === 'sub' ? '🧺 Keranjang kurma' : '🌴 Pohon kurma'}</Text>
        <Row gap={4}>
          {ids.map((id) => (
            <Draggable key={id} onDrop={drop(id)} disabled={ready}>
              <Text style={styles.kurma}>🟤</Text>
            </Draggable>
          ))}
          {ids.length === 0 && <Text style={styles.empty}>{q.mode === 'sub' ? 'Keranjang kosong dari sedekah' : 'Semua sudah dipindah'}</Text>}
        </Row>
      </View>

      <View ref={target.ref} style={[styles.panel, styles.target, ready && { borderColor: colors.primary }]}>
        <Text style={styles.label}>{q.mode === 'sub' ? '🎁 Kotak sedekah' : `🧺 Keranjang ${q.name}`}</Text>
        <Row gap={2}>
          {Array.from({ length: inTarget }, (_, i) => (
            <Animated.Text key={i} entering={ZoomIn} style={styles.kurmaSmall}>🟤</Animated.Text>
          ))}
        </Row>
        <Text style={styles.count}>{inTarget}</Text>
      </View>

      {ready && <Choices choices={choices} correct={q.answer} onCorrect={onCorrect} onWrong={onWrong} />}
    </>
  );
}

export function HitungKurmaSedekah({ onExit }: GameProps) {
  return (
    <GameShell gameId="hitung-kurma-sedekah" emoji="🟤" title="Hitung Kurma Sedekah" onExit={onExit}
      renderRound={(api) => <Round {...api} />} />
  );
}

const styles = StyleSheet.create({
  panel: { backgroundColor: '#fff', borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm, minHeight: 110 },
  target: { borderWidth: 3, borderStyle: 'dashed', borderColor: colors.secondary, backgroundColor: '#FFFBEA' },
  label: { fontSize: 17, fontWeight: '800', color: colors.text },
  kurma: { fontSize: 40 },
  kurmaSmall: { fontSize: 26 },
  count: { fontSize: 30, fontWeight: '900', color: colors.accent, textAlign: 'center' },
  empty: { color: colors.textMuted, fontWeight: '600' },
});
