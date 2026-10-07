import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { GameShell, RoundApi } from '../../components/play/GameShell';
import { Draggable, useDropZone } from '../../components/play/Draggable';
import { Instruction } from '../../components/play/Instruction';
import { SoundService } from '../../../core/sound/SoundService';
import { shuffle } from '../../../core/utils/random';
import { colors, radius, spacing } from '../../theme';
import type { GameProps } from '../types';
import { SHAPES, ShapeKind, ShapeView } from './ShapeView';

function Round({ onCorrect, onWrong }: RoundApi) {
  const [picked] = useState(() => shuffle(SHAPES).slice(0, 3));
  const [holes] = useState(() => shuffle(picked));
  const [tray] = useState(() => shuffle(picked));
  const [placed, setPlaced] = useState<ShapeKind[]>([]);
  const placedRef = useRef<ShapeKind[]>([]);
  const zones = [useDropZone(14), useDropZone(14), useDropZone(14)];

  const drop = (kind: ShapeKind) => async (x: number, y: number) => {
    for (let i = 0; i < holes.length; i++) {
      if (await zones[i].contains(x, y)) {
        if (holes[i].kind === kind) {
          SoundService.pop();
          placedRef.current = [...placedRef.current, kind];
          setPlaced(placedRef.current);
          if (placedRef.current.length === holes.length) setTimeout(onCorrect, 300);
          return true;
        }
        onWrong();
        return false;
      }
    }
    return false;
  };

  return (
    <>
      <Instruction text="Pasangkan bangun datar dengan bagian masjid yang bentuknya sama. Geser bentuk ke tempatnya!" />

      <View style={styles.holes}>
        {holes.map((h, i) => {
          const done = placed.includes(h.kind);
          return (
            <View key={h.kind} ref={zones[i].ref} style={styles.hole}>
              <Text style={styles.part}>{h.part}</Text>
              <View style={styles.shapeBox}>
                {done ? (
                  <Animated.View entering={ZoomIn}><ShapeView kind={h.kind} color={h.color} size={58} /></Animated.View>
                ) : (
                  <ShapeView kind={h.kind} color="#D1D5DB" size={58} />
                )}
              </View>
              <Text style={[styles.name, !done && { opacity: 0 }]}>{h.name}</Text>
            </View>
          );
        })}
      </View>

      <View style={[styles.tray, { zIndex: 10 }]}>
        {tray.map((s) =>
          placed.includes(s.kind) ? (
            <View key={s.kind} style={styles.slot} />
          ) : (
            <Draggable key={s.kind} onDrop={drop(s.kind)} style={styles.slot}>
              <ShapeView kind={s.kind} color={s.color} size={58} />
              <Text style={styles.name}>{s.name}</Text>
            </Draggable>
          ),
        )}
      </View>
    </>
  );
}

export function TebakBangunDatarMasjid({ onExit }: GameProps) {
  return (
    <GameShell gameId="tebak-bangun-datar-masjid" emoji="🔷" title="Bangun Datar Masjid" onExit={onExit}
      renderRound={(api) => <Round {...api} />} />
  );
}

const styles = StyleSheet.create({
  holes: { flexDirection: 'row', gap: spacing.sm },
  hole: { flex: 1, backgroundColor: '#fff', borderRadius: radius.lg, borderWidth: 3, borderStyle: 'dashed', borderColor: colors.sky, alignItems: 'center', paddingVertical: spacing.md, gap: 4 },
  part: { fontSize: 14, fontWeight: '900', color: colors.text, textAlign: 'center' },
  shapeBox: { height: 92, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 13, fontWeight: '800', color: colors.primaryDark, textAlign: 'center' },
  tray: { flexDirection: 'row', gap: spacing.sm, backgroundColor: '#FFF7DC', borderRadius: radius.lg, padding: spacing.sm },
  slot: { flex: 1, height: 120, alignItems: 'center', justifyContent: 'center', gap: 4 },
});
