import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { GameShell, RoundApi } from '../../components/play/GameShell';
import { Draggable, useDropZone } from '../../components/play/Draggable';
import { Instruction, Row } from '../../components/play/Instruction';
import { SoundService } from '../../../core/sound/SoundService';
import { colors, radius, spacing } from '../../theme';
import type { GameProps } from '../types';
import { WEIGHTS, beamAngle, makeScaleRound } from './logic';

const WEIGHT_COLORS: Record<number, string> = { 1: colors.sky, 2: colors.pink, 5: colors.accent };

function Round({ difficulty, onCorrect }: RoundApi) {
  const [q] = useState(() => makeScaleRound(difficulty));
  const [added, setAdded] = useState<{ id: number; kg: number }[]>([]);
  const nextId = useRef(0);
  const zone = useDropZone(30);
  const angle = useSharedValue(0);
  const total = added.reduce((s, w) => s + w.kg, 0);
  const balanced = total === q.target;

  useEffect(() => {
    angle.value = withSpring(beamAngle(q.target, total), { damping: 6, stiffness: 90 });
    if (balanced) setTimeout(onCorrect, 500);
  }, [total, balanced, q.target, angle, onCorrect]);

  const beam = useAnimatedStyle(() => ({ transform: [{ rotate: `${angle.value}deg` }] }));
  const panFix = useAnimatedStyle(() => ({ transform: [{ rotate: `${-angle.value}deg` }] }));

  const addWeight = (kg: number) => async (x: number, y: number) => {
    if (balanced) return false;
    if (await zone.contains(x, y)) {
      SoundService.pop();
      setAdded((a) => [...a, { id: nextId.current++, kg }]);
    }
    return false; // always spring back: weight blocks are an endless supply
  };

  const remove = (id: number) => {
    if (balanced) return;
    SoundService.tap();
    setAdded((a) => a.filter((w) => w.id !== id));
  };

  const hint = balanced ? 'Seimbang! 🎉' : total > q.target ? `Terlalu berat! Kurangi ${total - q.target} kg (tekan beban untuk melepas)` : `Masih kurang ${q.target - total} kg`;

  return (
    <>
      <Instruction text={`Timbang ${q.item.name} ${q.target} kilogram. Geser beban ke piringan kanan sampai timbangan seimbang!`} />

      <View style={styles.scale}>
        <View style={styles.pole} />
        <Animated.View style={[styles.beam, beam]}>
          <Animated.View style={[styles.panLeft, panFix]}>
            <Text style={styles.bag}>{q.item.emoji}</Text>
            <Text style={styles.kg}>{q.target} kg</Text>
          </Animated.View>
          <Animated.View style={[styles.panRight, panFix]}>
            <Row gap={2}>
              {added.map((w) => (
                <Pressable key={w.id} onPress={() => remove(w.id)} style={[styles.block, { backgroundColor: WEIGHT_COLORS[w.kg] }]}>
                  <Text style={styles.blockText}>{w.kg}</Text>
                </Pressable>
              ))}
            </Row>
            <Text style={styles.kg}>{total} kg</Text>
          </Animated.View>
        </Animated.View>
        {/* Static drop target covering the right half of the scale */}
        <View ref={zone.ref} style={styles.dropArea} pointerEvents="none" />
        <Text style={styles.base}>⚖️</Text>
      </View>

      <Text style={[styles.hint, balanced && { color: colors.primaryDark }]}>{hint}</Text>

      <View style={[styles.tray, { zIndex: 10 }]}>
        {WEIGHTS.map((kg) => (
          <Draggable key={kg} onDrop={addWeight(kg)} disabled={balanced}>
            <View style={[styles.weight, { backgroundColor: WEIGHT_COLORS[kg] }]}>
              <Text style={styles.weightText}>{kg}</Text>
              <Text style={styles.weightUnit}>kg</Text>
            </View>
          </Draggable>
        ))}
      </View>
    </>
  );
}

export function TimbanganZakat({ onExit }: GameProps) {
  return (
    <GameShell gameId="timbangan-zakat" emoji="⚖️" title="Timbangan Zakat" onExit={onExit}
      renderRound={(api) => <Round {...api} />} />
  );
}

const styles = StyleSheet.create({
  scale: { height: 270, backgroundColor: '#fff', borderRadius: radius.lg, alignItems: 'center', paddingTop: 70 },
  pole: { position: 'absolute', bottom: 20, width: 10, height: 150, backgroundColor: '#B08968', borderRadius: 5 },
  beam: { width: '88%', height: 10, backgroundColor: '#6B4F2A', borderRadius: 5 },
  panLeft: { position: 'absolute', left: -6, top: 6, width: 110, minHeight: 90, backgroundColor: '#FFF4D6', borderRadius: radius.md, alignItems: 'center', padding: 6 },
  panRight: { position: 'absolute', right: -6, top: 6, width: 130, minHeight: 90, backgroundColor: '#E8F6FF', borderRadius: radius.md, alignItems: 'center', padding: 6 },
  dropArea: { position: 'absolute', right: 0, top: 40, width: '55%', height: 200 },
  bag: { fontSize: 38 },
  kg: { fontWeight: '900', fontSize: 18, color: colors.text },
  block: { width: 30, height: 30, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  blockText: { color: '#fff', fontWeight: '900' },
  base: { position: 'absolute', bottom: 2, fontSize: 22 },
  hint: { textAlign: 'center', fontSize: 18, fontWeight: '800', color: colors.accent },
  tray: { flexDirection: 'row', justifyContent: 'center', gap: spacing.lg },
  weight: { width: 78, height: 78, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 5, borderBottomColor: 'rgba(0,0,0,0.2)' },
  weightText: { fontSize: 30, fontWeight: '900', color: '#fff' },
  weightUnit: { fontSize: 13, fontWeight: '800', color: '#fff', marginTop: -4 },
});
