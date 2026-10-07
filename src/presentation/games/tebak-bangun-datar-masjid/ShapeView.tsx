import React from 'react';
import { View } from 'react-native';

export type ShapeKind = 'persegi' | 'persegiPanjang' | 'segitiga' | 'lingkaran';

export const SHAPES: { kind: ShapeKind; name: string; part: string; color: string }[] = [
  { kind: 'lingkaran', name: 'Lingkaran', part: '🕌 Kubah', color: '#2E9E6B' },
  { kind: 'persegiPanjang', name: 'Persegi Panjang', part: '🚪 Pintu', color: '#FB8500' },
  { kind: 'persegi', name: 'Persegi', part: '🪟 Jendela', color: '#9B5DE5' },
  { kind: 'segitiga', name: 'Segitiga', part: '🗼 Atap Menara', color: '#FF8FAB' },
];

export function ShapeView({ kind, size = 64, color }: { kind: ShapeKind; size?: number; color: string }) {
  switch (kind) {
    case 'lingkaran':
      return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />;
    case 'persegi':
      return <View style={{ width: size, height: size, borderRadius: 6, backgroundColor: color }} />;
    case 'persegiPanjang':
      return <View style={{ width: size * 1.5, height: size * 0.8, borderRadius: 6, backgroundColor: color }} />;
    case 'segitiga':
      return (
        <View
          style={{
            width: 0, height: 0, borderLeftWidth: size / 2, borderRightWidth: size / 2, borderBottomWidth: size,
            borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color,
          }}
        />
      );
  }
}

