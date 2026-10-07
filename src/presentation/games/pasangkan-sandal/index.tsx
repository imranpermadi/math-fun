import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { GameShell, RoundApi } from '../../components/play/GameShell';
import { Draggable, useDropZone } from '../../components/play/Draggable';
import { Instruction, Row } from '../../components/play/Instruction';
import { SoundService } from '../../../core/sound/SoundService';
import { colors, radius, spacing } from '../../theme';
import type { GameProps } from '../types';
import { isEven, makeSandalNumbers } from './logic';

function Round({ grade, onCorrect, onWrong }: RoundApi) {
  const [numbers] = useState(() => makeSandalNumbers(grade));
  const [odd, setOdd] = useState<number[]>([]);
  const [even, setEven] = useState<number[]>([]);
  const left = numbers.filter((n) => !odd.includes(n) && !even.includes(n));
  const placedCount = useRef(0);
  const oddZone = useDropZone(20);
  const evenZone = useDropZone(20);

  const drop = (n: number) => async (x: number, y: number) => {
    const inOdd = await oddZone.contains(x, y);
    const inEven = !inOdd && (await evenZone.contains(x, y));
    if (!inOdd && !inEven) return false;
    const correct = inEven === isEven(n);
    if (!correct) { onWrong(); return false; }
    SoundService.pop();
    (inEven ? setEven : setOdd)((l) => [...l, n]);
    placedCount.current += 1;
    if (placedCount.current === numbers.length) setTimeout(onCorrect, 350);
    return true;
  };

  return (
    <>
      <Instruction text="Bantu merapikan sandal di depan masjid! Geser sandal bernomor GANJIL ke rak kiri, dan GENAP ke rak kanan." />

      <View style={styles.racks}>
        <View ref={oddZone.ref} style={[styles.rack, { borderColor: colors.pink }]}>
          <Text style={styles.rackTitle}>Rak Ganjil</Text>
          <Row gap={4}>{odd.map((n) => <Animated.View key={n} entering={ZoomIn} style={styles.mini}><Text style={styles.miniText}>🩴{n}</Text></Animated.View>)}</Row>
        </View>
        <View ref={evenZone.ref} style={[styles.rack, { borderColor: colors.sky }]}>
          <Text style={styles.rackTitle}>Rak Genap</Text>
          <Row gap={4}>{even.map((n) => <Animated.View key={n} entering={ZoomIn} style={styles.mini}><Text style={styles.miniText}>🩴{n}</Text></Animated.View>)}</Row>
        </View>
      </View>

      <View style={[styles.pile, { zIndex: 10 }]}>
        {left.map((n) => (
          <Draggable key={n} onDrop={drop(n)}>
            <View style={styles.sandal}>
              <Text style={styles.sandalIcon}>🩴</Text>
              <Text style={styles.sandalNum}>{n}</Text>
            </View>
          </Draggable>
        ))}
      </View>
    </>
  );
}

export function PasangkanSandal({ onExit }: GameProps) {
  return (
    <GameShell gameId="pasangkan-sandal" emoji="🩴" title="Pasangkan Sandal" onExit={onExit}
      renderRound={(api) => <Round {...api} />} />
  );
}

const styles = StyleSheet.create({
  racks: { flexDirection: 'row', gap: spacing.md },
  rack: { flex: 1, minHeight: 190, backgroundColor: '#fff', borderRadius: radius.lg, borderWidth: 4, borderStyle: 'dashed', padding: spacing.sm, gap: spacing.sm },
  rackTitle: { fontSize: 18, fontWeight: '900', color: colors.text, textAlign: 'center' },
  mini: { backgroundColor: '#F3F4F6', borderRadius: radius.sm, paddingHorizontal: 6, paddingVertical: 2 },
  miniText: { fontSize: 16, fontWeight: '800', color: colors.text },
  pile: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center', backgroundColor: '#FFF7DC', borderRadius: radius.lg, padding: spacing.md, minHeight: 130 },
  sandal: { width: 78, height: 78, backgroundColor: '#fff', borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 4, borderBottomColor: '#E0B25A' },
  sandalIcon: { fontSize: 30 },
  sandalNum: { fontSize: 20, fontWeight: '900', color: colors.primaryDark },
});
