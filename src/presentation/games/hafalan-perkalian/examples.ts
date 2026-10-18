export interface MultiplicationExample {
  id: string;
  tableNumber: number; // 1 to 10
  title: string;
  emoji: string;
  story: string;
  question: string;
  multiplier: number; // kelompok (baris)
  multiplicand: number; // isi per kelompok (kolom)
  product: number;
  repeatedAddition: string;
  visualIcon: string;
  visualRows: string[];
  explanationSteps: string[];
  practiceQuiz: {
    prompt: string;
    choices: number[];
    answer: number;
    explanation: string;
  };
}

export interface MultiplicationTrick {
  tableNumber: number;
  title: string;
  emoji: string;
  subtitle: string;
  secret: string;
  formula: string;
  visualGuide: string[];
  exampleCalculation: string;
}

export const MULTIPLICATION_EXAMPLES: Record<number, MultiplicationExample[]> = {
  1: [
    {
      id: 'ex-1-1',
      tableNumber: 1,
      title: 'Kelereng Kebaikan Umar',
      emoji: '🟢',
      story: 'Umar menyiapkan 5 kantong kain kecil untuk dibagikan kepada teman-temannya. Di setiap kantong, ia memasukkan tepat 1 kelereng bercahaya.',
      question: 'Berapakah jumlah kelereng yang dibagikan Umar seluruhnya?',
      multiplier: 5,
      multiplicand: 1,
      product: 5,
      repeatedAddition: '1 + 1 + 1 + 1 + 1 = 5',
      visualIcon: '🟢',
      visualRows: ['🟢', '🟢', '🟢', '🟢', '🟢'],
      explanationSteps: [
        'Ada 5 kelompok (kantong).',
        'Setiap kelompok berisi 1 kelereng.',
        'Operasi: 5 kelompok × 1 kelereng = 5 kelereng.',
        'Aturan Khusus: Bilangan berapapun jika dikalikan 1, hasilnya adalah bilangan itu sendiri (Sifat Identitas)!'
      ],
      practiceQuiz: {
        prompt: 'Pak Ahmad membeli 8 bibit pohon kurma, masing-masing ditanam dalam 1 pot. Berapa pot yang dibutuhkan?',
        choices: [1, 7, 8, 9],
        answer: 8,
        explanation: '8 bibit × 1 pot = 8 pot.'
      }
    },
    {
      id: 'ex-1-2',
      tableNumber: 1,
      title: 'Mushaf Al-Qur\'an di Meja',
      emoji: '📖',
      story: 'Di ruang kelas ada 9 meja belajar. Di setiap meja, diletakkan 1 mushaf Al-Qur\'an bersampul hijau.',
      question: 'Berapa total mushaf di seluruh meja belajar?',
      multiplier: 9,
      multiplicand: 1,
      product: 9,
      repeatedAddition: '1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 = 9',
      visualIcon: '📖',
      visualRows: ['📖', '📖', '📖', '📖', '📖', '📖', '📖', '📖', '📖'],
      explanationSteps: [
        '9 meja masing-masing memuat 1 mushaf.',
        '9 × 1 = 9 mushaf Al-Qur\'an.',
        'Nilai tidak berubah karena pengalinya adalah angka 1.'
      ],
      practiceQuiz: {
        prompt: '10 anak masing-masing memegang 1 bendera merah putih. Berapa total bendera?',
        choices: [1, 10, 11, 20],
        answer: 10,
        explanation: '10 anak × 1 bendera = 10 bendera.'
      }
    }
  ],
  2: [
    {
      id: 'ex-2-1',
      tableNumber: 2,
      title: 'Sepasang Sandal ke Masjid',
      emoji: '🩴',
      story: 'Sebanyak 6 anak santri meletakkan sandal mereka di rak sebelum masuk masjid. Setiap anak memiliki sepasang sandal (2 sandal).',
      question: 'Berapa jumlah seluruh sandal santri yang ada di rak?',
      multiplier: 6,
      multiplicand: 2,
      product: 12,
      repeatedAddition: '2 + 2 + 2 + 2 + 2 + 2 = 12',
      visualIcon: '🩴',
      visualRows: ['🩴 🩴', '🩴 🩴', '🩴 🩴', '🩴 🩴', '🩴 🩴', '🩴 🩴'],
      explanationSteps: [
        'Terdapat 6 anak santri.',
        'Masing-masing memiliki sepasang (2 sandal).',
        'Penjumlahan berulang: 2 + 2 + 2 + 2 + 2 + 2 = 12.',
        'Bentuk perkalian: 6 × 2 = 12 sandal.'
      ],
      practiceQuiz: {
        prompt: 'Ada 7 sepeda di halaman madrasah. Setiap sepeda memiliki 2 roda. Berapa jumlah seluruh roda sepeda?',
        choices: [12, 14, 16, 9],
        answer: 14,
        explanation: '7 sepeda × 2 roda = 14 roda.'
      }
    },
    {
      id: 'ex-2-2',
      tableNumber: 2,
      title: 'Dua Butir Telur Sarapan',
      emoji: '🥚',
      story: 'Ibu menyiapkan sarapan berkah untuk 4 anak yatim. Setiap anak mendapatkan 2 butir telur rebus.',
      question: 'Berapa butir telur yang disiapkan Ibu?',
      multiplier: 4,
      multiplicand: 2,
      product: 8,
      repeatedAddition: '2 + 2 + 2 + 2 = 8',
      visualIcon: '🥚',
      visualRows: ['🥚 🥚', '🥚 🥚', '🥚 🥚', '🥚 🥚'],
      explanationSteps: [
        'Ada 4 piring sarapan anak yatim.',
        'Setiap piring berisi 2 butir telur.',
        'Perkalian: 4 × 2 = 8 butir telur.'
      ],
      practiceQuiz: {
        prompt: 'Jika ada 9 burung merpati dan masing-masing memiliki 2 sayap, berapa total sayapnya?',
        choices: [16, 18, 20, 14],
        answer: 18,
        explanation: '9 burung × 2 sayap = 18 sayap.'
      }
    }
  ],
  3: [
    {
      id: 'ex-3-1',
      tableNumber: 3,
      title: 'Piring Kurma Berbuka Puasa',
      emoji: '🟤',
      story: 'Saat ifthar Ramadhan di masjid, disajikan 5 piring kurma ajwa. Tiap piring diisi sunnah 3 butir kurma.',
      question: 'Berapa butir kurma ajwa semuanya?',
      multiplier: 5,
      multiplicand: 3,
      product: 15,
      repeatedAddition: '3 + 3 + 3 + 3 + 3 = 15',
      visualIcon: '🟤',
      visualRows: ['🟤 🟤 🟤', '🟤 🟤 🟤', '🟤 🟤 🟤', '🟤 🟤 🟤', '🟤 🟤 🟤'],
      explanationSteps: [
        'Ada 5 kelompok (piring).',
        'Tiap kelompok berisi 3 kurma.',
        'Penjumlahan: 3 + 3 + 3 + 3 + 3 = 15.',
        'Perkalian: 5 × 3 = 15 butir kurma.'
      ],
      practiceQuiz: {
        prompt: 'Sebuah segitiga memiliki 3 sisi sama panjang. Jika ada 7 segitiga, berapa jumlah seluruh sisinya?',
        choices: [18, 21, 24, 15],
        answer: 21,
        explanation: '7 segitiga × 3 sisi = 21 sisi.'
      }
    },
    {
      id: 'ex-3-2',
      tableNumber: 3,
      title: 'Lampu Menara Masjid Tiga Tingkat',
      emoji: '🏮',
      story: 'Sebuah menara masjid memiliki 8 jendela hias. Di setiap jendela digantung 3 lentera bercahaya indah.',
      question: 'Berapakah lentera hias di menara masjid?',
      multiplier: 8,
      multiplicand: 3,
      product: 24,
      repeatedAddition: '3 + 3 + 3 + 3 + 3 + 3 + 3 + 3 = 24',
      visualIcon: '🏮',
      visualRows: [
        '🏮 🏮 🏮', '🏮 🏮 🏮', '🏮 🏮 🏮', '🏮 🏮 🏮',
        '🏮 🏮 🏮', '🏮 🏮 🏮', '🏮 🏮 🏮', '🏮 🏮 🏮'
      ],
      explanationSteps: [
        '8 jendela × 3 lentera.',
        'Hitung bertahap: (8 × 2) + 8 = 16 + 8 = 24.',
        'Hasilnya 24 lentera bercahaya!'
      ],
      practiceQuiz: {
        prompt: '4 pohon kurma masing-masing memiliki 3 tandan buah besar. Berapa tandan kurma seluruhnya?',
        choices: [9, 12, 15, 10],
        answer: 12,
        explanation: '4 pohon × 3 tandan = 12 tandan.'
      }
    }
  ],
  4: [
    {
      id: 'ex-4-1',
      tableNumber: 4,
      title: 'Mobil Ambulans Rumah Sakit Khazanah',
      emoji: '🚙',
      story: 'Klinik kesehatan memiliki 6 mobil layanan gratis untuk dhuafa. Setiap mobil memiliki 4 roda.',
      question: 'Berapa banyak roda seluruh mobil layanan tersebut?',
      multiplier: 6,
      multiplicand: 4,
      product: 24,
      repeatedAddition: '4 + 4 + 4 + 4 + 4 + 4 = 24',
      visualIcon: '🛞',
      visualRows: [
        '🛞 🛞 🛞 🛞', '🛞 🛞 🛞 🛞', '🛞 🛞 🛞 🛞',
        '🛞 🛞 🛞 🛞', '🛞 🛞 🛞 🛞', '🛞 🛞 🛞 🛞'
      ],
      explanationSteps: [
        'Ada 6 mobil ambulans.',
        'Tiap mobil memuat 4 roda.',
        'Trik Perkalian 4: Gandakan dua kali! 6 × 2 = 12, lalu 12 × 2 = 24!',
        'Hasilnya: 6 × 4 = 24 roda.'
      ],
      practiceQuiz: {
        prompt: 'Sebuah meja makan memiliki 4 kaki. Jika ada 7 meja di kantin sekolah, berapa total kaki meja?',
        choices: [24, 28, 32, 26],
        answer: 28,
        explanation: '7 meja × 4 kaki = 28 kaki.'
      }
    },
    {
      id: 'ex-4-2',
      tableNumber: 4,
      title: 'Kardus Berisi 4 Jus Jeruk Segar',
      emoji: '🧃',
      story: 'Pak Ridwan membeli 9 kardus jus buah untuk dibagikan saat pengajian. Setiap kardus berisi 4 botol jus jeruk.',
      question: 'Berapa botol jus yang dibeli Pak Ridwan?',
      multiplier: 9,
      multiplicand: 4,
      product: 36,
      repeatedAddition: '4 + 4 + ... (9 kali) = 36',
      visualIcon: '🧃',
      visualRows: [
        '🧃 🧃 🧃 🧃', '🧃 🧃 🧃 🧃', '🧃 🧃 🧃 🧃', '🧃 🧃 🧃 🧃',
        '🧃 🧃 🧃 🧃', '🧃 🧃 🧃 🧃', '🧃 🧃 🧃 🧃', '🧃 🧃 🧃 🧃',
        '🧃 🧃 🧃 🧃'
      ],
      explanationSteps: [
        '9 kardus × 4 botol jus.',
        'Trik: 9 × 2 = 18, lalu gandakan 18 + 18 = 36.',
        'Total 36 botol jus segar!'
      ],
      practiceQuiz: {
        prompt: '5 kucing lucu masing-masing memiliki 4 kaki. Berapa total kaki mereka?',
        choices: [16, 20, 24, 18],
        answer: 20,
        explanation: '5 kucing × 4 kaki = 20 kaki.'
      }
    }
  ],
  5: [
    {
      id: 'ex-5-1',
      tableNumber: 5,
      title: 'Rukun Islam dan Jari Tangan',
      emoji: '🖐️',
      story: 'Satu tangan kita memiliki 5 jari yang mengingatkan pada 5 Rukun Islam. Ada 7 santri yang mengangkat tangan kanan mereka bersamaan.',
      question: 'Berapa jumlah seluruh jari tangan santri yang terangkat?',
      multiplier: 7,
      multiplicand: 5,
      product: 35,
      repeatedAddition: '5 + 5 + 5 + 5 + 5 + 5 + 5 = 35',
      visualIcon: '⭐',
      visualRows: [
        '⭐ ⭐ ⭐ ⭐ ⭐', '⭐ ⭐ ⭐ ⭐ ⭐', '⭐ ⭐ ⭐ ⭐ ⭐',
        '⭐ ⭐ ⭐ ⭐ ⭐', '⭐ ⭐ ⭐ ⭐ ⭐', '⭐ ⭐ ⭐ ⭐ ⭐',
        '⭐ ⭐ ⭐ ⭐ ⭐'
      ],
      explanationSteps: [
        'Ada 7 tangan terangkat.',
        'Setiap tangan ada 5 jari.',
        'Trik Perkalian 5: Digit terakhir selalu berakhir pada angka 0 atau 5!',
        '7 adalah bilangan ganjil, maka hasilnya berakhiran 5: 7 × 5 = 35.'
      ],
      practiceQuiz: {
        prompt: 'Ustadz membagikan 5 pensil warna kepada 6 santri penghafal juz 30. Berapa pensil yang dibagikan?',
        choices: [25, 30, 35, 40],
        answer: 30,
        explanation: '6 santri × 5 pensil = 30 pensil (berakhiran 0 karena 6 genap).'
      }
    },
    {
      id: 'ex-5-2',
      tableNumber: 5,
      title: 'Waktu Shalat Fardhu',
      emoji: '🕌',
      story: 'Seorang muslim shalat fardhu 5 waktu setiap hari (Subuh, Dzuhur, Ashar, Maghrib, Isya). Dalam 8 hari, berapa kali total shalat fardhu dikerjakan?',
      question: 'Berapa kali shalat fardhu dalam 8 hari?',
      multiplier: 8,
      multiplicand: 5,
      product: 40,
      repeatedAddition: '5 + 5 + ... (8 kali) = 40',
      visualIcon: '🕌',
      visualRows: [
        '🕌 🕌 🕌 🕌 🕌', '🕌 🕌 🕌 🕌 🕌', '🕌 🕌 🕌 🕌 🕌', '🕌 🕌 🕌 🕌 🕌',
        '🕌 🕌 🕌 🕌 🕌', '🕌 🕌 🕌 🕌 🕌', '🕌 🕌 🕌 🕌 🕌', '🕌 🕌 🕌 🕌 🕌'
      ],
      explanationSteps: [
        '8 hari × 5 waktu shalat.',
        'Trik cepat: 8 dibagi 2 = 4, tambah angka 0 di belakangnya jadi 40!',
        '8 × 5 = 40 waktu shalat.'
      ],
      practiceQuiz: {
        prompt: '9 kantong masing-masing berisi 5 kue donat. Berapa jumlah donat semuanya?',
        choices: [40, 45, 50, 35],
        answer: 45,
        explanation: '9 × 5 = 45 donat (9 ganjil, ujungnya 5).'
      }
    }
  ],
  6: [
    {
      id: 'ex-6-1',
      tableNumber: 6,
      title: 'Enam Rukun Iman Terpatri di Hati',
      emoji: '💠',
      story: 'Di sebuah pesantren terdapat 4 asrama santri. Di tiap asrama terpasang 6 kaligrafi Rukun Iman yang indah.',
      question: 'Berapa jumlah kaligrafi Rukun Iman di seluruh asrama?',
      multiplier: 4,
      multiplicand: 6,
      product: 24,
      repeatedAddition: '6 + 6 + 6 + 6 = 24',
      visualIcon: '💠',
      visualRows: [
        '💠 💠 💠 💠 💠 💠', '💠 💠 💠 💠 💠 💠',
        '💠 💠 💠 💠 💠 💠', '💠 💠 💠 💠 💠 💠'
      ],
      explanationSteps: [
        'Ada 4 asrama, masing-masing 6 kaligrafi.',
        'Trik Perkalian 6: Kalikan dulu dengan 5, lalu tambahkan angka itu sekali lagi!',
        '(4 × 5) + 4 = 20 + 4 = 24.',
        'Maka 4 × 6 = 24 kaligrafi.'
      ],
      practiceQuiz: {
        prompt: 'Sebuah serangga memiliki 6 kaki. Jika ada 7 ekor semut pekerja, berapa total kaki mereka?',
        choices: [36, 42, 48, 40],
        answer: 42,
        explanation: '7 × 6 = (7 × 5) + 7 = 35 + 7 = 42 kaki.'
      }
    },
    {
      id: 'ex-6-2',
      tableNumber: 6,
      title: 'Paket Sembako Ramadhan Berkah',
      emoji: '📦',
      story: 'Panitia zakat menyiapkan 8 kardus sembako. Masing-masing kardus berisi 6 bungkus kurma madu.',
      question: 'Berapa total bungkus kurma madu yang dikemas?',
      multiplier: 8,
      multiplicand: 6,
      product: 48,
      repeatedAddition: '6 + 6 + ... (8 kali) = 48',
      visualIcon: '📦',
      visualRows: [
        '📦 📦 📦 📦 📦 📦', '📦 📦 📦 📦 📦 📦', '📦 📦 📦 📦 📦 📦', '📦 📦 📦 📦 📦 📦',
        '📦 📦 📦 📦 📦 📦', '📦 📦 📦 📦 📦 📦', '📦 📦 📦 📦 📦 📦', '📦 📦 📦 📦 📦 📦'
      ],
      explanationSteps: [
        '8 kardus × 6 bungkus kurma.',
        'Trik rima: 6 dikali 8 berujung 8! (8 × 6 = 48).',
        'Hasilnya adalah 48 bungkus kurma madu.'
      ],
      practiceQuiz: {
        prompt: '9 meja belajar masing-masing diisi oleh 6 buku ensiklopedia. Berapa total bukunya?',
        choices: [48, 54, 60, 56],
        answer: 54,
        explanation: '9 × 6 = 54 buku.'
      }
    }
  ],
  7: [
    {
      id: 'ex-7-1',
      tableNumber: 7,
      title: 'Shaf Shalat Berjamaah di Masjidil Haram',
      emoji: '👥',
      story: 'Di saf pertama musala, berjejer 5 baris jamaah. Setiap baris diisi rapi oleh 7 orang muslim yang shalat khusyuk.',
      question: 'Berapakah jumlah seluruh jamaah yang shalat di saf tersebut?',
      multiplier: 5,
      multiplicand: 7,
      product: 35,
      repeatedAddition: '7 + 7 + 7 + 7 + 7 = 35',
      visualIcon: '👤',
      visualRows: [
        '👤 👤 👤 👤 👤 👤 👤', '👤 👤 👤 👤 👤 👤 👤',
        '👤 👤 👤 👤 👤 👤 👤', '👤 👤 👤 👤 👤 👤 👤',
        '👤 👤 👤 👤 👤 👤 👤'
      ],
      explanationSteps: [
        'Terdapat 5 baris jamaah.',
        'Masing-masing baris 7 orang.',
        'Sifat Komutatif: 5 × 7 sama dengan 7 × 5 = 35.',
        'Total ada 35 jamaah shalat berjamaah.'
      ],
      practiceQuiz: {
        prompt: 'Dalam 1 minggu ada 7 hari. Berapa jumlah hari dalam 6 minggu liburan?',
        choices: [36, 42, 49, 40],
        answer: 42,
        explanation: '6 minggu × 7 hari = 42 hari.'
      }
    },
    {
      id: 'ex-7-2',
      tableNumber: 7,
      title: 'Tujuh Putaran Thawaf Ka\'bah',
      emoji: '🕋',
      story: 'Satu kali ibadah thawaf mengelilingi Ka\'bah terdiri dari 7 putaran. Jika seorang peziarah telah thawaf sebanyak 8 kali selama di Mekkah, berapa total putaran yang ditempuh?',
      question: 'Berapa putaran thawaf yang ditempuh?',
      multiplier: 8,
      multiplicand: 7,
      product: 56,
      repeatedAddition: '7 + 7 + ... (8 kali) = 56',
      visualIcon: '🕋',
      visualRows: [
        '🕋 🕋 🕋 🕋 🕋 🕋 🕋', '🕋 🕋 🕋 🕋 🕋 🕋 🕋', '🕋 🕋 🕋 🕋 🕋 🕋 🕋', '🕋 🕋 🕋 🕋 🕋 🕋 🕋',
        '🕋 🕋 🕋 🕋 🕋 🕋 🕋', '🕋 🕋 🕋 🕋 🕋 🕋 🕋', '🕋 🕋 🕋 🕋 🕋 🕋 🕋', '🕋 🕋 🕋 🕋 🕋 🕋 🕋'
      ],
      explanationSteps: [
        '8 kali thawaf × 7 putaran.',
        'Trik urutan unik angka: 5, 6, 7, 8! Ya! 56 = 7 × 8!',
        'Hasilnya adalah 56 putaran mengelilingi Ka\'bah.'
      ],
      practiceQuiz: {
        prompt: 'Sebuah pohon kurma berbuah 7 butir di 9 tangkai utamanya. Berapa butir kurma seluruhnya?',
        choices: [56, 63, 70, 54],
        answer: 63,
        explanation: '9 tangkai × 7 butir = 63 butir kurma.'
      }
    }
  ],
  8: [
    {
      id: 'ex-8-1',
      tableNumber: 8,
      title: 'Koin Dinar Emas di Pundi Baitul Mal',
      emoji: '🪙',
      story: 'Baitul Mal menyimpan 6 kantong beludru koin dinar untuk sedekah fakir miskin. Di tiap kantong ada 8 koin emas murni.',
      question: 'Berapa banyak koin dinar emas seluruhnya?',
      multiplier: 6,
      multiplicand: 8,
      product: 48,
      repeatedAddition: '8 + 8 + 8 + 8 + 8 + 8 = 48',
      visualIcon: '🪙',
      visualRows: [
        '🪙 🪙 🪙 🪙 🪙 🪙 🪙 🪙', '🪙 🪙 🪙 🪙 🪙 🪙 🪙 🪙',
        '🪙 🪙 🪙 🪙 🪙 🪙 🪙 🪙', '🪙 🪙 🪙 🪙 🪙 🪙 🪙 🪙',
        '🪙 🪙 🪙 🪙 🪙 🪙 🪙 🪙', '🪙 🪙 🪙 🪙 🪙 🪙 🪙 🪙'
      ],
      explanationSteps: [
        '6 kantong × 8 koin.',
        'Trik Perkalian 8: Gandakan 3 kali! Mulai dari 6: gandakan 1x (12), gandakan 2x (24), gandakan 3x (48)!',
        'Maka 6 × 8 = 48 koin emas murni.'
      ],
      practiceQuiz: {
        prompt: 'Sebuah laba-laba memiliki 8 kaki. Jika ada 5 laba-laba di sarang, berapa total kaki mereka?',
        choices: [32, 40, 48, 36],
        answer: 40,
        explanation: '5 laba-laba × 8 kaki = 40 kaki.'
      }
    },
    {
      id: 'ex-8-2',
      tableNumber: 8,
      title: 'Kubah Menara Istana Andalusia',
      emoji: '🕌',
      story: 'Arsitek muslim merancang istana dengan 9 paviliun megah. Masing-masing paviliun ditopang oleh 8 pilar marmer putih kokoh.',
      question: 'Berapa jumlah pilar marmer yang dipasang?',
      multiplier: 9,
      multiplicand: 8,
      product: 72,
      repeatedAddition: '8 + 8 + ... (9 kali) = 72',
      visualIcon: '🏛️',
      visualRows: [
        '🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️', '🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️',
        '🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️', '🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️',
        '🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️', '🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️',
        '🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️', '🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️',
        '🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️ 🏛️'
      ],
      explanationSteps: [
        '9 paviliun × 8 pilar.',
        'Trik cepat: (10 × 8) - 8 = 80 - 8 = 72 pilar.',
        'Hasilnya adalah 72 pilar megah.'
      ],
      practiceQuiz: {
        prompt: 'Ada 7 kotak krayon dan tiap kotak memuat 8 batang warna. Berapa batang krayon seluruhnya?',
        choices: [48, 54, 56, 64],
        answer: 56,
        explanation: '7 kotak × 8 krayon = 56 krayon.'
      }
    }
  ],
  9: [
    {
      id: 'ex-9-1',
      tableNumber: 9,
      title: 'Bintang Bercahaya di Langit Falak',
      emoji: '✨',
      story: 'Para ilmuwan astronomi muslim mengamati 4 rasi bintang di langit malam. Di setiap rasi, mereka mencatat 9 bintang terang.',
      question: 'Berapakah total bintang terang yang diamati?',
      multiplier: 4,
      multiplicand: 9,
      product: 36,
      repeatedAddition: '9 + 9 + 9 + 9 = 36',
      visualIcon: '✨',
      visualRows: [
        '✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨', '✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨',
        '✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨', '✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨'
      ],
      explanationSteps: [
        'Ada 4 rasi bintang × 9 bintang.',
        'Rahasia 9 Ajaib: Angka puluhan selalu (pengali - 1): 4 - 1 = 3.',
        'Jumlah angka puluhan + satuan selalu 9: 3 + ? = 9 → 6!',
        'Gabungkan: 3 dan 6 menjadi 36! (4 × 9 = 36).'
      ],
      practiceQuiz: {
        prompt: 'Jika ada 6 rak buku di perpustakaan dan masing-masing rak berisi 9 kitab hadits, berapa total kitabnya?',
        choices: [45, 54, 63, 56],
        answer: 54,
        explanation: '6 × 9 = 54 (puluhan: 6-1=5, satuan: 9-5=4 → 54).'
      }
    },
    {
      id: 'ex-9-2',
      tableNumber: 9,
      title: 'Pohon Zaitun di Kebun Berkah',
      emoji: '🫒',
      story: 'Petani menanam 8 baris pohon zaitun di lembah yang subur. Di tiap baris, tumbuh subur 9 pohon zaitun berdaun lebat.',
      question: 'Berapa banyak pohon zaitun yang ditanam?',
      multiplier: 8,
      multiplicand: 9,
      product: 72,
      repeatedAddition: '9 + 9 + ... (8 kali) = 72',
      visualIcon: '🌳',
      visualRows: [
        '🌳 🌳 🌳 🌳 🌳 🌳 🌳 🌳 🌳', '🌳 🌳 🌳 🌳 🌳 🌳 🌳 🌳 🌳',
        '🌳 🌳 🌳 🌳 🌳 🌳 🌳 🌳 🌳', '🌳 🌳 🌳 🌳 🌳 🌳 🌳 🌳 🌳',
        '🌳 🌳 🌳 🌳 🌳 🌳 🌳 🌳 🌳', '🌳 🌳 🌳 🌳 🌳 🌳 🌳 🌳 🌳',
        '🌳 🌳 🌳 🌳 🌳 🌳 🌳 🌳 🌳', '🌳 🌳 🌳 🌳 🌳 🌳 🌳 🌳 🌳'
      ],
      explanationSteps: [
        '8 baris × 9 pohon.',
        'Gunakan trik jari atau kurangi 1: 8 - 1 = 7 (puluhan), 9 - 7 = 2 (satuan).',
        'Hasilnya adalah 72 pohon zaitun berkah.'
      ],
      practiceQuiz: {
        prompt: '7 siswa masing-masing menghafal 9 ayat suci Al-Qur\'an dalam sehari. Berapa ayat yang dihafal bersama?',
        choices: [54, 63, 72, 61],
        answer: 63,
        explanation: '7 × 9 = 63 ayat.'
      }
    }
  ],
  10: [
    {
      id: 'ex-10-1',
      tableNumber: 10,
      title: 'Pahala Kebaikan Dilipatgandakan Sepuluh Kali',
      emoji: '💎',
      story: 'Sebagaimana firman Allah: "Barangsiapa membawa amal yang baik, maka baginya pahala sepuluh kali lipatnya." (QS. Al-An\'am: 160). Bilal mengerjakan 6 amalan kebaikan hari ini.',
      question: 'Berapa kali lipat pahala kebaikan yang dijanjikan?',
      multiplier: 6,
      multiplicand: 10,
      product: 60,
      repeatedAddition: '10 + 10 + 10 + 10 + 10 + 10 = 60',
      visualIcon: '💎',
      visualRows: [
        '💎 💎 💎 💎 💎 💎 💎 💎 💎 💎', '💎 💎 💎 💎 💎 💎 💎 💎 💎 💎',
        '💎 💎 💎 💎 💎 💎 💎 💎 💎 💎', '💎 💎 💎 💎 💎 💎 💎 💎 💎 💎',
        '💎 💎 💎 💎 💎 💎 💎 💎 💎 💎', '💎 💎 💎 💎 💎 💎 💎 💎 💎 💎'
      ],
      explanationSteps: [
        'Ada 6 amalan kebaikan × 10 kali lipat.',
        'Trik Paling Mudah Sedunia: Tulis angka aslinya (6) lalu tambahkan angka 0 di belakangnya!',
        'Hasil: 60 pahala kebaikan masya Allah!'
      ],
      practiceQuiz: {
        prompt: 'Pak Utsman bersedekah 10 ribu rupiah kepada 8 anak dhuafa. Berapa ribu total sedekah beliau?',
        choices: [70, 80, 90, 85],
        answer: 80,
        explanation: '8 × 10 = 80 ribu rupiah.'
      }
    },
    {
      id: 'ex-10-2',
      tableNumber: 10,
      title: 'Sepuluh Hari Terakhir Bulan Ramadhan',
      emoji: '🌙',
      story: 'Sebuah kelompok tahfidz membuat 9 tim tadarus untuk menghidupkan 10 malam terakhir Ramadhan. Tiap tim menyelesaikan 10 juz Al-Qur\'an.',
      question: 'Berapa juz yang diselesaikan seluruh tim tadarus?',
      multiplier: 9,
      multiplicand: 10,
      product: 90,
      repeatedAddition: '10 + 10 + ... (9 kali) = 90',
      visualIcon: '🌙',
      visualRows: [
        '🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙', '🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙',
        '🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙', '🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙',
        '🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙', '🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙',
        '🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙', '🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙',
        '🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙 🌙'
      ],
      explanationSteps: [
        '9 tim × 10 juz.',
        'Angka 9 ditambah nol di belakang menjadi 90.',
        'Alhamdulillah selesai 90 juz!'
      ],
      practiceQuiz: {
        prompt: '10 kotak kurma masing-masing berisi 10 kilogram kurma sukkari. Berapa kilogram totalnya?',
        choices: [90, 100, 110, 120],
        answer: 100,
        explanation: '10 × 10 = 100 kilogram.'
      }
    }
  ]
};

export const MULTIPLICATION_TRICKS: MultiplicationTrick[] = [
  {
    tableNumber: 1,
    title: 'Cermin Ajaib (Sifat Identitas)',
    emoji: '🪞',
    subtitle: 'Angka dikali 1 tidak berubah sama sekali!',
    secret: 'Bayangkan angka 1 adalah cermin ajaib. Angka berapapun yang bercermin di hadapan angka 1, akan melihat dirinya sendiri persis tanpa berubah!',
    formula: 'N × 1 = N',
    visualGuide: [
      '7 × 1 = 7  (Angka 7 melihat dirinya di cermin)',
      '100 × 1 = 100',
      '0 × 1 = 0'
    ],
    exampleCalculation: 'Berapa 9 × 1? Jawabannya langsung 9!'
  },
  {
    tableNumber: 2,
    title: 'Trik Kembar Sepasang (Doubling)',
    emoji: '👯',
    subtitle: 'Cukup jumlahkan angka dengan dirinya sendiri!',
    secret: 'Mengalikan dengan 2 sama saja dengan menjumlahkan angka tersebut dua kali (membuat kembarannya).',
    formula: 'N × 2 = N + N',
    visualGuide: [
      '6 × 2 → 6 + 6 = 12',
      '7 × 2 → 7 + 7 = 14',
      '8 × 2 → 8 + 8 = 16',
      '9 × 2 → 9 + 9 = 18'
    ],
    exampleCalculation: 'Berapa 8 × 2? Tinggal hitung 8 + 8 = 16!'
  },
  {
    tableNumber: 3,
    title: 'Trik Kembar Tiga & Irama Musik',
    emoji: '🎶',
    subtitle: 'Gandakan dulu, lalu tambah satu kali lagi!',
    secret: 'Jika sulit mengingat 3 × N, hitung dulu (2 × N) lalu tambahkan N sekali lagi. Contoh 3 × 7 = (2 × 7) + 7 = 14 + 7 = 21!',
    formula: 'N × 3 = (N × 2) + N',
    visualGuide: [
      'Irama loncat 3: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30',
      '3 × 4 = (2 × 4) + 4 = 8 + 4 = 12',
      '3 × 8 = (2 × 8) + 8 = 16 + 8 = 24'
    ],
    exampleCalculation: '3 × 6 = (6 + 6) + 6 = 12 + 6 = 18!'
  },
  {
    tableNumber: 4,
    title: 'Trik Gandakan Dua Kali (Double Double)',
    emoji: '⚡',
    subtitle: 'Lipat dua kali seperti melipat kertas!',
    secret: 'Karena 4 = 2 × 2, cukup gandakan angka tersebut dua kali berturut-turut! Sangat cepat dan tidak perlu menghafal rumus panjang!',
    formula: 'N × 4 = (N + N) + (N + N)',
    visualGuide: [
      'Langkah 1: Gandakan pertama (N × 2)',
      'Langkah 2: Gandakan hasilnya lagi!',
      'Contoh 7 × 4 → 7+7 = 14 → 14+14 = 28!',
      'Contoh 9 × 4 → 9+9 = 18 → 18+18 = 36!'
    ],
    exampleCalculation: 'Hitung 8 × 4: 8+8 = 16, lalu 16+16 = 32! Selesai!'
  },
  {
    tableNumber: 5,
    title: 'Trik Jam Menit & Ujung Angka 0/5',
    emoji: '⏰',
    subtitle: 'Jika angka genap ujungnya 0, jika ganjil ujungnya 5!',
    secret: 'Lihat jarum panjang jam dinding! Setiap angka adalah kelipatan 5 menit (1=5, 2=10, 3=15, 4=20...). Trik kilat untuk angka genap: bagi dua lalu beri angka 0 di belakangnya!',
    formula: 'Genap: (N ÷ 2) lalu tempel "0" | Ganjil: akhiran pasti "5"',
    visualGuide: [
      '6 × 5 → Separuh 6 adalah 3 → Tempel 0 jadi 30!',
      '8 × 5 → Separuh 8 adalah 4 → Tempel 0 jadi 40!',
      '7 × 5 → 7 ganjil, mundur ke 6 (separuh 3) → tempel 5 jadi 35!'
    ],
    exampleCalculation: 'Berapa 4 × 5? Separuh 4 adalah 2, beri nol jadi 20!'
  },
  {
    tableNumber: 6,
    title: 'Trik Sahabat 5 + 1x',
    emoji: '🤝',
    subtitle: 'Hitung perkalian 5 dulu, lalu tambah angka itu sekali!',
    secret: 'Perkalian 5 sangat mudah dihafal. Maka untuk perkalian 6, cukup kalikan 5 lalu tambahkan angka tersebut sekali lagi!',
    formula: 'N × 6 = (N × 5) + N',
    visualGuide: [
      '6 × 7 = (5 × 7) + 7 = 35 + 7 = 42',
      '6 × 4 = (5 × 4) + 4 = 20 + 4 = 24',
      'Trik rima genap: 6 × 2 = 12, 6 × 4 = 24, 6 × 6 = 36, 6 × 8 = 48 (digit belakang sama dengan pengalinya!)'
    ],
    exampleCalculation: '6 × 8: digit belakangnya pasti 8! Separuh 8 adalah 4 → 48!'
  },
  {
    tableNumber: 7,
    title: 'Trik Urutan Magis 5, 6, 7, 8!',
    emoji: '🪄',
    subtitle: 'Ingat urutan angka berurutan 56 = 7 × 8',
    secret: 'Banyak anak merasa perkalian 7 paling menantang. Tapi tahukah kamu ada rahasia angka berurutan: 5, 6, 7, 8! Ya: 56 = 7 × 8! Untuk yang lain, gunakan sifat komutatif (bolak-balik)!',
    formula: 'A × B = B × A (Misal: 7 × 3 = 3 × 7 = 21)',
    visualGuide: [
      '7 × 2 = 14 (sudah tahu di perkalian 2)',
      '7 × 3 = 21 (sudah tahu di perkalian 3)',
      '7 × 5 = 35 (sudah tahu di perkalian 5)',
      '7 × 7 = 49 (Hari kemerdekaan RI 1945 + 4)',
      '7 × 8 = 56 (Ingat: 5, 6, 7, 8!)'
    ],
    exampleCalculation: 'Berapa 7 × 8? Ingat tangga angka: 5, 6, 7, 8 → 56!'
  },
  {
    tableNumber: 8,
    title: 'Trik Gandakan Tiga Kali (Triple Double)',
    emoji: '🚀',
    subtitle: 'Lipat 3 kali: ×2, lalu ×2, lalu ×2!',
    secret: 'Karena 8 = 2 × 2 × 2, cukup gandakan tiga kali secara berurutan. Kamu bahkan tidak perlu menghafal!',
    formula: 'N × 8 = ((N × 2) × 2) × 2',
    visualGuide: [
      'Hitung 5 × 8:',
      '• Langkah 1: 5 × 2 = 10',
      '• Langkah 2: 10 × 2 = 20',
      '• Langkah 3: 20 × 2 = 40! Selesai!'
    ],
    exampleCalculation: 'Hitung 6 × 8: 6 → 12 → 24 → 48!'
  },
  {
    tableNumber: 9,
    title: 'Rahasia Ajaib 10 Jari Tangan',
    emoji: '🖐️🤚',
    subtitle: 'Buka 10 jarimu, lipat jari sesuai nomor pengali!',
    secret: 'Buka kedua tangan di depanmu (jari 1 sampai 10 dari kiri ke kanan). Mau hitung 9 × 4? Lipat jari ke-4! Di sebelah kiri ada 3 jari (puluhan), di sebelah kanan ada 6 jari (satuan) → 36! Masya Allah luar biasa!',
    formula: 'Jumlah digit hasil selalu 9! Puluhan = N - 1, Satuan = 9 - Puluhan',
    visualGuide: [
      '9 × 2 = 18 (1 + 8 = 9)',
      '9 × 3 = 27 (2 + 7 = 9)',
      '9 × 4 = 36 (3 + 6 = 9)',
      '9 × 5 = 45 (4 + 5 = 9)',
      '9 × 6 = 54 (5 + 4 = 9)',
      '9 × 7 = 63 (6 + 3 = 9)',
      '9 × 8 = 72 (7 + 2 = 9)',
      '9 × 9 = 81 (8 + 1 = 9)'
    ],
    exampleCalculation: '9 × 7: Lipat jari ke-7. Kiri ada 6 jari, kanan ada 3 jari → 63!'
  },
  {
    tableNumber: 10,
    title: 'Trik Nol Meluncur (The Zero Glider)',
    emoji: '🎯',
    subtitle: 'Tinggal taruh angka 0 di sebelah kanan!',
    secret: 'Setiap bilangan bulat yang dikalikan 10, cukup geser posisinya menjadi puluhan dengan menempelkan angka nol di sebelah kanannya.',
    formula: 'N × 10 = N0',
    visualGuide: [
      '3 × 10 = 30',
      '7 × 10 = 70',
      '12 × 10 = 120',
      '99 × 10 = 990'
    ],
    exampleCalculation: 'Hitung 8 × 10: Tulis angka 8, tempel 0 di belakangnya jadi 80!'
  }
];
