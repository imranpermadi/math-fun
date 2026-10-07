import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming,
} from 'react-native-reanimated';

const EMOJIS = ['⭐', '🌙', '✨', '🎉', '🌟', '💛', '🕌'];
const COUNT = 22;
const { width, height } = Dimensions.get('window');

function Particle({ index }: { index: number }) {
  const y = useSharedValue(-60);
  const rot = useSharedValue(0);
  const x0 = (index / COUNT) * width;
  const drift = (index % 2 ? 1 : -1) * (20 + (index % 5) * 12);

  useEffect(() => {
    const delay = (index % 8) * 70;
    y.value = withDelay(delay, withTiming(height * 0.9, { duration: 1500 + (index % 4) * 250, easing: Easing.in(Easing.quad) }));
    rot.value = withDelay(delay, withTiming(360 * (index % 2 ? 1 : -1), { duration: 1700 }));
  }, [index, rot, y]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { translateX: drift * (y.value / height) }, { rotate: `${rot.value}deg` }],
  }));

  return (
    <Animated.Text style={[styles.p, { left: x0 }, style]}>{EMOJIS[index % EMOJIS.length]}</Animated.Text>
  );
}

/** Falling emoji confetti. Mount it to fire; unmount to clear. */
export function Celebration() {
  return (
    <Animated.View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: COUNT }, (_, i) => <Particle key={i} index={i} />)}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  p: { position: 'absolute', top: 0, fontSize: 28 },
});

