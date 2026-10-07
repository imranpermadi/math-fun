import React, { useRef, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SoundService } from '../../../core/sound/SoundService';

/** Measure a view in window coords at call time (robust against layout/scroll changes). */
export function useDropZone(slop = 16) {
  const ref = useRef<View>(null);
  const contains = (x: number, y: number) =>
    new Promise<boolean>((resolve) => {
      if (!ref.current) return resolve(false);
      ref.current.measureInWindow((zx, zy, w, h) => {
        resolve(x >= zx - slop && x <= zx + w + slop && y >= zy - slop && y <= zy + h + slop);
      });
    });
  return { ref, contains };
}

interface Props {
  children: React.ReactNode;
  /** Return true if the drop was accepted (parent should then hide/move the item). */
  onDrop: (absX: number, absY: number) => Promise<boolean> | boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Draggable item that springs back when dropped outside a valid target. */
export function Draggable({ children, onDrop, disabled, style }: Props) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const scale = useSharedValue(1);
  const [lifted, setLifted] = useState(false);

  const gesture = Gesture.Pan()
    .runOnJS(true)
    .enabled(!disabled)
    .onBegin(() => {
      scale.value = withSpring(1.2);
      setLifted(true);
      SoundService.tap();
    })
    .onUpdate((e) => {
      tx.value = e.translationX;
      ty.value = e.translationY;
    })
    .onEnd(async (e) => {
      const ok = await onDrop(e.absoluteX, e.absoluteY);
      if (!ok) {
        tx.value = withSpring(0, { damping: 12 });
        ty.value = withSpring(0, { damping: 12 });
      }
    })
    .onFinalize(() => {
      scale.value = withSpring(1);
      setLifted(false);
    });

  const anim = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[style, anim, lifted && { zIndex: 999, elevation: 20 }]}>{children}</Animated.View>
    </GestureDetector>
  );
}

