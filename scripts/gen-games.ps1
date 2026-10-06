$games = @(
 @{slug='hitung-kurma-sedekah'; comp='HitungKurmaSedekah'; emoji='🟤'; title='Hitung Kurma Sedekah'; concept='Penjumlahan dan pengurangan'; play='<QuizRunner grade={grade} difficulty={difficulty} operation={Operation.Addition} gameId="hitung-kurma-sedekah" onFinish={onExit} />'},
 @{slug='lompat-sajadah'; comp='LompatSajadah'; emoji='🕌'; title='Lompat Sajadah'; concept='Pola bilangan dan loncat hitung'; play=''},
 @{slug='bagi-rata-anak-yatim'; comp='BagiRataAnakYatim'; emoji='🤝'; title='Bagi Rata Anak Yatim'; concept='Pembagian dasar (Kelas 3)'; play='<QuizRunner grade={Grade.Three} difficulty={difficulty} operation={Operation.Division} gameId="bagi-rata-anak-yatim" onFinish={onExit} />'},
 @{slug='timbangan-zakat'; comp='TimbanganZakat'; emoji='⚖️'; title='Timbangan Zakat'; concept='Berat dan pengukuran'; play=''},
 @{slug='puzzle-waktu-shalat'; comp='PuzzleWaktuShalat'; emoji='🕰️'; title='Puzzle Waktu Shalat'; concept='Membaca jam'; play=''},
 @{slug='tebak-bangun-datar-masjid'; comp='TebakBangunDatarMasjid'; emoji='🔷'; title='Tebak Bangun Datar Masjid'; concept='Geometri bangun datar'; play=''},
 @{slug='kumpulkan-bintang-pahala'; comp='KumpulkanBintangPahala'; emoji='⭐'; title='Kumpulkan Bintang Pahala'; concept='Perkalian'; play='<QuizRunner grade={grade < Grade.Two ? Grade.Two : grade} difficulty={difficulty} operation={Operation.Multiplication} gameId="kumpulkan-bintang-pahala" onFinish={onExit} />'},
 @{slug='kereta-unta-berhitung'; comp='KeretaUntaBerhitung'; emoji='🐪'; title='Kereta Unta Berhitung'; concept='Mengurutkan bilangan'; play=''},
 @{slug='pasangkan-sandal'; comp='PasangkanSandal'; emoji='🩴'; title='Pasangkan Sandal'; concept='Bilangan ganjil dan genap'; play=''},
 @{slug='harta-karun-kebaikan'; comp='HartaKarunKebaikan'; emoji='💎'; title='Harta Karun Kebaikan'; concept='Pecahan dasar (Kelas 3)'; play=''},
 @{slug='tarik-tambang-bulan-hijriah'; comp='TarikTambangBulanHijriah'; emoji='🌙'; title='Tarik Tambang Bulan Hijriah'; concept='Hitung cepat dengan timer 60 detik'; play='<QuizRunner grade={grade} difficulty={difficulty} timerSeconds={60} gameId="tarik-tambang-bulan-hijriah" onFinish={onExit} />'}
)
foreach ($g in $games) {
  $dir = "src/presentation/games/$($g.slug)"
  Remove-Item "$dir/.gitkeep" -ErrorAction SilentlyContinue
  $body = if ($g.play) { "<GameFrame emoji=`"$($g.emoji)`" title=`"$($g.title)`" concept=`"$($g.concept)`" onExit={onExit}>`n      $($g.play)`n    </GameFrame>" } else { "<GameFrame emoji=`"$($g.emoji)`" title=`"$($g.title)`" concept=`"$($g.concept)`" onExit={onExit} />" }
  $code = @"
import React from 'react';
import { GameFrame } from '../../components/common/GameFrame';
import { QuizRunner } from '../../components/common/QuizRunner';
import { Grade, Operation } from '../../../domain/enums';
import { useAppStore } from '../../stores/useAppStore';
import type { GameProps } from '../types';

// Unused imports kept minimal for placeholder games.
void QuizRunner; void Grade; void Operation;

export function $($g.comp)({ onExit }: GameProps) {
  const { grade, difficulty } = useAppStore();
  void grade; void difficulty;
  return (
    $body
  );
}
"@
  Set-Content -Path "$dir/index.tsx" -Value $code -Encoding utf8
}
'done'

