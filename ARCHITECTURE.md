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
1. hitung-kurma-sedekah
2. lompat-sajadah
3. bagi-rata-anak-yatim
4. timbangan-zakat
5. puzzle-waktu-shalat
6. tebak-bangun-datar-masjid
7. kumpulkan-bintang-pahala
8. kereta-unta-berhitung
9. pasangkan-sandal
10. harta-karun-kebaikan
11. tarik-tambang-bulan-hijriah

## Rules
- No hardcoded question arrays: all questions come from `QuestionGeneratorService`.
- All text, names, and word problems use Islamic context and adab.
- Zustand stores live only in presentation. Stores call use cases, never SQLite directly.

