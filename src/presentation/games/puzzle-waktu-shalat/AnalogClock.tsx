import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors } from '../../theme';
import { hourAngle, minuteAngle } from './logic';

function Hand({ size, length, width, color, angle }: { size: number; length: number; width: number; color: string; angle: number }) {
  const a = useSharedValue(angle);
  useEffect(() => {
    // Take the shortest way round so the hand doesn't spin backwards
    const cur = a.value % 360;
    let diff = ((angle - cur + 540) % 360) - 180;
    a.value = withSpring(a.value + diff, { damping: 12, stiffness: 80 });
  }, [angle, a]);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${a.value}deg` }] }));
  return (
    <Animated.View style={[{ position: 'absolute', width: size, height: size, alignItems: 'center' }, style]}>
      <View style={{ position: 'absolute', top: size / 2 - length, width, height: length, backgroundColor: color, borderRadius: width }} />
    </Animated.View>
  );
}

export function AnalogClock({ hour, minute, size = 220 }: { hour: number; minute: number; size?: number }) {
  const r = size / 2 - 22;
  return (
    <View style={[styles.face, { width: size, height: size, borderRadius: size / 2 }]}>
      {Array.from({ length: 12 }, (_, i) => {
        const n = i === 0 ? 12 : i;
        const ang = (i * 30 * Math.PI) / 180;
        return (
          <Text key={i} style={[styles.num, { left: size / 2 + r * Math.sin(ang) - 12, top: size / 2 - r * Math.cos(ang) - 13 }]}>{n}</Text>
        );
      })}
      <Hand size={size} length={size * 0.27} width={7} color={colors.text} angle={hourAngle(hour, minute)} />
      <Hand size={size} length={size * 0.39} width={4} color={colors.accent} angle={minuteAngle(minute)} />
      <View style={styles.center} />
    </View>
  );
}

const styles = StyleSheet.create({
  face: { backgroundColor: '#fff', borderWidth: 8, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  num: { position: 'absolute', width: 24, textAlign: 'center', fontSize: 18, fontWeight: '900', color: colors.text },
  center: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.text },
});

