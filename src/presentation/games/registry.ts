import type React from 'react';
import type { GameProps } from './types';
import { HitungKurmaSedekah } from './hitung-kurma-sedekah';
import { LompatSajadah } from './lompat-sajadah';
import { BagiRataAnakYatim } from './bagi-rata-anak-yatim';
import { TimbanganZakat } from './timbangan-zakat';
import { PuzzleWaktuShalat } from './puzzle-waktu-shalat';
import { TebakBangunDatarMasjid } from './tebak-bangun-datar-masjid';
import { KumpulkanBintangPahala } from './kumpulkan-bintang-pahala';
import { KeretaUntaBerhitung } from './kereta-unta-berhitung';
import { PasangkanSandal } from './pasangkan-sandal';
import { HartaKarunKebaikan } from './harta-karun-kebaikan';
import { TarikTambangBulanHijriah } from './tarik-tambang-bulan-hijriah';
import { HafalanPerkalian } from './hafalan-perkalian';
import { colors } from '../theme';

export interface GameDefinition {
  id: string;
  title: string;
  emoji: string;
  concept: string;
  color: string;
  playable: boolean;
  Component: React.ComponentType<GameProps>;
}

export const GAMES: GameDefinition[] = [
  { id: 'hitung-kurma-sedekah', title: 'Hitung Kurma Sedekah', emoji: '🟤', concept: 'Tambah & kurang', color: colors.secondary, playable: true, Component: HitungKurmaSedekah },
  { id: 'lompat-sajadah', title: 'Lompat Sajadah', emoji: '🕌', concept: 'Pola bilangan', color: colors.sky, playable: true, Component: LompatSajadah },
  { id: 'bagi-rata-anak-yatim', title: 'Bagi Rata Anak Yatim', emoji: '🤝', concept: 'Pembagian (Kelas 3)', color: colors.pink, playable: true, Component: BagiRataAnakYatim },
  { id: 'timbangan-zakat', title: 'Timbangan Zakat', emoji: '⚖️', concept: 'Berat & ukuran', color: colors.purple, playable: true, Component: TimbanganZakat },
  { id: 'puzzle-waktu-shalat', title: 'Puzzle Waktu Shalat', emoji: '🕰️', concept: 'Membaca jam', color: colors.sky, playable: true, Component: PuzzleWaktuShalat },
  { id: 'tebak-bangun-datar-masjid', title: 'Tebak Bangun Datar Masjid', emoji: '🔷', concept: 'Geometri', color: colors.secondary, playable: true, Component: TebakBangunDatarMasjid },
  { id: 'kumpulkan-bintang-pahala', title: 'Kumpulkan Bintang Pahala', emoji: '⭐', concept: 'Perkalian', color: colors.accent, playable: true, Component: KumpulkanBintangPahala },
  { id: 'kereta-unta-berhitung', title: 'Kereta Unta Berhitung', emoji: '🐪', concept: 'Urutan bilangan', color: colors.pink, playable: true, Component: KeretaUntaBerhitung },
  { id: 'pasangkan-sandal', title: 'Pasangkan Sandal', emoji: '🩴', concept: 'Ganjil & genap', color: colors.purple, playable: true, Component: PasangkanSandal },
  { id: 'harta-karun-kebaikan', title: 'Harta Karun Kebaikan', emoji: '💎', concept: 'Pecahan (Kelas 3)', color: colors.sky, playable: true, Component: HartaKarunKebaikan },
  { id: 'tarik-tambang-bulan-hijriah', title: 'Tarik Tambang Bulan Hijriah', emoji: '🌙', concept: 'Hitung cepat 60 detik', color: colors.accent, playable: true, Component: TarikTambangBulanHijriah },
  { id: 'hafalan-perkalian', title: 'Tantangan Hafalan Kali-Kali', emoji: '✖️', concept: 'Hafal & Uji Perkalian 1-10', color: '#4361EE', playable: true, Component: HafalanPerkalian },
];

