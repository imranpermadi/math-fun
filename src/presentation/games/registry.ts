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

// 10 Games Kelas Dunia Baru dengan Animasi Berbobot & Interaktif
import { PemanahThariq } from './pemanah-thariq';
import { MeriamMalahayati } from './meriam-malahayati';
import { BintangFalak } from './bintang-falak';
import { KokiBerkahSlice } from './koki-berkah-slice';
import { SafariRallyGurun } from './safari-rally-gurun';
import { MenaraArsitekKhazanah } from './menara-arsitek-khazanah';
import { LaboratoriumIbnuSina } from './laboratorium-ibnu-sina';
import { KeretaGuaPermata } from './kereta-gua-permata';
import { BentengPertahananHijrah } from './benteng-pertahanan-hijrah';
import { RitmeBedugBerkah } from './ritme-bedug-berkah';

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
  { id: 'hafalan-perkalian', title: 'Tantangan Hafalan Kali-Kali', emoji: '✖️', concept: 'Hafal, Trik & Contoh Soal 1-10', color: '#4361EE', playable: true, Component: HafalanPerkalian },
  { id: 'pemanah-thariq', title: 'Pemanah Pasukan Thariq', emoji: '🎯', concept: 'Panahan & Taksiran Cepat', color: '#EA580C', playable: true, Component: PemanahThariq },
  { id: 'meriam-malahayati', title: 'Meriam Laksamana Malahayati', emoji: '⛵', concept: 'FPB & KPK Meriam Kapal', color: '#0284C7', playable: true, Component: MeriamMalahayati },
  { id: 'bintang-falak', title: 'Pesawat Falak Antariksa', emoji: '🚀', concept: 'Bilangan Bulat Positif & Negatif', color: '#7C3AED', playable: true, Component: BintangFalak },
  { id: 'koki-berkah-slice', title: 'Koki Berkah Iris Buah', emoji: '🍉', concept: 'Pecahan & Tebas Buah Segar', color: '#D97706', playable: true, Component: KokiBerkahSlice },
  { id: 'safari-rally-gurun', title: 'Safari Rally Gurun Pasir', emoji: '🏎️', concept: 'Kecepatan, Jarak & Waktu (s=v×t)', color: '#F59E0B', playable: true, Component: SafariRallyGurun },
  { id: 'menara-arsitek-khazanah', title: 'Menara Arsitek Khazanah', emoji: '🏗️', concept: 'Luas & Keliling Bangun Datar', color: '#0D9488', playable: true, Component: MenaraArsitekKhazanah },
  { id: 'laboratorium-ibnu-sina', title: 'Laboratorium Ibnu Sina', emoji: '🧪', concept: 'Rasio, Perbandingan & Persen %', color: '#059669', playable: true, Component: LaboratoriumIbnuSina },
  { id: 'kereta-gua-permata', title: 'Kereta Tambang Permata Prima', emoji: '⛏️', concept: 'Bilangan & Faktor Prima', color: '#9333EA', playable: true, Component: KeretaGuaPermata },
  { id: 'benteng-pertahanan-hijrah', title: 'Benteng Pertahanan Angka', emoji: '🏰', concept: 'Operasi Campuran KABATAKU', color: '#DC2626', playable: true, Component: BentengPertahananHijrah },
  { id: 'ritme-bedug-berkah', title: 'Ritme Bedug Festival', emoji: '🥁', concept: 'Irama Kelipatan & Beat Ritmis', color: '#DB2777', playable: true, Component: RitmeBedugBerkah },
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
];
