# Math Fun - Architecture (Kurikulum Khazanah)

Dependency rule: `presentation -> domain <- data`. Domain imports nothing from other layers or from React/Expo.

| Layer | Path | Contents |
|---|---|---|
| Domain | `src/domain` | entities, enums (Grade, Difficulty, Operation), repository interfaces, `QuestionGeneratorService`, use cases |
| Data | `src/data` | `DatabaseService` (expo-sqlite), repository implementations, datasources, mappers |
| Presentation | `src/presentation` | navigation, theme, Zustand stores, screens (materi, bank-soal, games), 11 game modules, common/animation components |
| Core | `src/core` | DI container, utils, constants, Islamic text templates (`i18n`) |

## Games (`src/presentation/games/<slug>`)
Each game is a self-contained module: `index.tsx` (UI), `logic.ts` (pure logic), `types.ts`.
1. hitung-kurma-sedekah (Tambah & kurang)
2. lompat-sajadah (Pola bilangan)
3. bagi-rata-anak-yatim (Pembagian Kelas 3)
4. timbangan-zakat (Berat & ukuran)
5. puzzle-waktu-shalat (Membaca jam)
6. tebak-bangun-datar-masjid (Geometri)
7. kumpulkan-bintang-pahala (Perkalian)
8. kereta-unta-berhitung (Urutan bilangan)
9. pasangkan-sandal (Ganjil & genap)
10. harta-karun-kebaikan (Pecahan Kelas 3)
11. tarik-tambang-bulan-hijriah (Hitung cepat 60 detik)
12. hafalan-perkalian (Tantangan Hafalan Kali-Kali, Flashcard 3D, Contoh Soal Cerita, Trik Cepat, Uji Kuis 1-10)
13. pemanah-thariq (Pemanah Pasukan Thariq - Panahan & Hitung Cepat)
14. meriam-malahayati (Meriam Laksamana Malahayati - FPB & KPK Meriam Kapal)
15. bintang-falak (Pesawat Falak Antariksa - Bilangan Bulat Positif & Negatif)
16. koki-berkah-slice (Koki Berkah Iris Buah - Pecahan & Tebas Buah Segar)
17. safari-rally-gurun (Safari Rally Gurun Pasir - Kecepatan, Jarak & Waktu s=v×t)
18. menara-arsitek-khazanah (Menara Arsitek Khazanah - Luas & Keliling Bangun Datar)
19. laboratorium-ibnu-sina (Laboratorium Ibnu Sina - Rasio, Perbandingan & Persen %)
20. kereta-gua-permata (Kereta Tambang Permata Prima - Bilangan & Faktor Prima)
21. benteng-pertahanan-hijrah (Benteng Pertahanan Angka - Operasi Campuran KABATAKU)
22. ritme-bedug-berkah (Ritme Bedug Festival - Irama Kelipatan & Beat Ritmis)

## Rules
- No hardcoded question arrays: all questions come from `QuestionGeneratorService` or game logic generators.
- All text, names, and word problems use Islamic context and adab.
- Zustand stores live only in presentation. Stores call use cases, never SQLite directly.

