# 🧮 Math Fun ✨
> **Aplikasi Belajar Matematika SD Interaktif, Ceria, & Bernuansa Islami (Kurikulum Khazanah)**  
> Dibangun dengan React Native, Expo SDK 57, TypeScript, Zustand, dan Clean Architecture (Domain-Driven Design).

---

## 🌟 Tentang Aplikasi
**Math Fun** adalah aplikasi edukasi matematika interaktif untuk anak-anak tingkat Sekolah Dasar (Kelas 1–3). Aplikasi ini dirancang agar belajar berhitung menjadi pengalaman yang menyenangkan, taktil, dan mendidik melalui kombinasi:
- **Metode Pembelajaran Buku SD**: Penjelasan visual langkah-demi-langkah (dekomposisi nilai tempat puluhan & satuan, penjumlahan berulang untuk perkalian, dan pengurangan berulang untuk pembagian).
- **11 Mini Games Tematik Edukatif**: Gamifikasi berhitung dengan narasi adab dan nilai kebaikan Islami (sedekah kurma, waktu shalat, timbangan zakat, dll.).
- **Bank Soal & Ujian Interaktif**: Beragam format soal interaktif (Pilihan Ganda 3D, Isian BubbleNumpad, dan Pasangkan Kartu).
- **Offline First**: Seluruh profil anak, progres bintang, riwayat pengerjaan, dan skor game tersimpan aman di database SQLite lokal.

---

## 🚀 Fitur Unggulan

### 1. 📖 Materi Berhitung Interaktif
- **Penjumlahan & Pengurangan**: Menggunakan metode dekomposisi nilai tempat (memecah puluhan dan satuan).
- **Perkalian**: Visualisasi konsep piring & kue (metode penjumlahan berulang).
- **Pembagian**: Simulasi pengurangan berulang bertahap hingga bersisa nol.
- **Latihan Ceria**: Latihan langsung setelah membaca materi dengan tombol bantuan kunci jawaban.

### 2. 📝 Bank Soal & Evaluasi Pemahaman
- **BubbleNumpad**: Papan angka gelembung interaktif untuk input jawaban tanpa keyboard biasa.
- **Matching Card**: Permainan mencocokkan pasangan soal matematika dengan jawaban yang tepat.
- **Riwayat & Statistik Pengerjaan**: Melacak jumlah soal yang dikerjakan, akurasi, dan riwayat jawaban di SQLite.

### 3. 🎮 11 Mini Games Tematik
| No | Judul Mini Game | Konsep Matematika |
|:---:|:---|:---|
| 1 | 🟤 **Hitung Kurma Sedekah** | Penjumlahan & Pengurangan Cepat |
| 2 | 🕌 **Lompat Sajadah** | Pola & Deret Bilangan |
| 3 | 🤝 **Bagi Rata Anak Yatim** | Konsep Pembagian (Kelas 3) |
| 4 | ⚖️ **Timbangan Zakat** | Perbandingan Berat & Ukuran |
| 5 | 🕰️ **Puzzle Waktu Shalat** | Membaca Jam Analog & Waktu |
| 6 | 🔷 **Tebak Bangun Datar Masjid** | Geometri & Pengenalan Bentuk |
| 7 | ⭐ **Kumpulkan Bintang Pahala** | Tabel Perkalian Ceria |
| 8 | 🐪 **Kereta Unta Berhitung** | Urutan Bilangan Naik & Turun |
| 9 | 🩴 **Pasangkan Sandal** | Pengenalan Bilangan Ganjil & Genap |
| 10 | 💎 **Harta Karun Kebaikan** | Pengenalan Pecahan Sederhana |
| 11 | 🌙 **Tarik Tambang Bulan Hijriah** | Tantangan Hitung Cepat 60 Detik |

### 4. 👤 Profil Anak & Gamifikasi
- Personalisasi profil: Nama, Usia, dan Avatar anak (🧒, 👧, 🦁, 🐼, dll.).
- Akumulasi Bintang Pahala dari hasil belajar dan bermain.
- Dukungan Text-to-Speech (TTS Bahasa Indonesia), Sound Effects, dan Haptic Feedback.

---

## 🏗️ Arsitektur & Teknologi

Proyek ini menerapkan **Clean Architecture (Domain-Driven Design)** dengan aturan ketergantungan:
```text
Presentation Layer  ───▶  Domain Layer  ◀───  Data Layer
                              ▲
                              │
                         Core Layer
```

### Struktur Folder
```text
src/
├── core/                  # Inisialisasi global, sound service, DI container, & i18n
│   ├── di/                # Dependency Injection (container.ts)
│   ├── sound/             # Audio FX, TTS Bahasa Indonesia, & Haptics (SoundService.ts)
│   └── utils/             # Helper fungsi acak (random.ts)
├── domain/                # Inti logika bisnis (murni TypeScript, bebas dependensi UI)
│   ├── entities/          # Question.ts, ExamQuestion.ts
│   ├── enums/             # Grade, Operation, Difficulty
│   ├── repositories/      # AttemptRepository.ts (interface kontrak)
│   └── services/          # QuestionGeneratorService, ExamQuestionService
├── data/                  # Implementasi penyimpanan data
│   ├── database/          # expo-sqlite dengan PRAGMA WAL mode & skema migrasi versi
│   └── repositories/      # SqliteAttemptRepository.ts
└── presentation/          # Layer UI, navigasi, dan state management
    ├── components/        # BubbleNumpad, MatchingCard, Choices, Celebration, GameFrame
    ├── games/             # 11 modul mini games mandiri (index.tsx + logic.ts)
    ├── navigation/        # BottomTabs.tsx (Materi 📖, Bank Soal 📝, Games 🎮, Profil 👤)
    ├── screens/           # MateriScreen, BankSoalScreen, GamesScreen, ProfileScreen
    ├── stores/            # Zustand state management (useAppStore.ts)
    └── theme/             # Palet warna anak, ukuran font, radius, dan spacing
```

---

## 🛠️ Tech Stack & Dependencies

- **Platform**: [Expo](https://expo.dev) SDK 57 / [React Native](https://reactnative.dev) 0.86
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database**: [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- **Audio & Haptics**: `expo-audio`, `expo-speech` (TTS id-ID), `expo-haptics`
- **Animasi**: `react-native-reanimated`, `lottie-react-native`
- **Navigasi**: `@react-navigation/native` & `@react-navigation/bottom-tabs`
- **Pengujian**: [Jest](https://jestjs.io/) & `jest-expo`

---

## 💻 Panduan Menjalankan Proyek

### 1. Prasyarat
- [Node.js](https://nodejs.org/) (versi 18 atau lebih baru)
- NPM atau Yarn
- Aplikasi **Expo Go** di HP Android/iOS (atau Android Emulator)

### 2. Instalasi
Clone repository dan pasang dependencies:
```bash
git clone https://github.com/imranpermadi/math-fun.git
cd math-fun
npm install
```

### 3. Menjalankan Aplikasi
Mulai server development Expo:
```bash
npx expo start
```
- Tekan **`a`** untuk membuka di Android Emulator.
- Atau scan QR code menggunakan aplikasi **Expo Go** pada perangkat fisik Anda.

### 4. Perintah Tambahan
```bash
# Menjalankan typecheck TypeScript
npm run typecheck

# Menjalankan unit tests dengan Jest
npm test
```

---

## 📄 Lisensi
Proyek ini dikembangkan untuk tujuan edukasi anak-anak Indonesia. Hak Cipta © 2026 Imran Permadi.
