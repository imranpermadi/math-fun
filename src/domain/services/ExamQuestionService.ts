import { Difficulty, Grade } from '../enums';
import {
  DecomposeData,
  ExamQuestion,
  ExamQuestionType,
  MatchPair,
  MultiOption,
} from '../entities/ExamQuestion';

export class ExamQuestionService {
  private counter = 0;

  generateExam(grade: Grade, difficulty: Difficulty, count: number): ExamQuestion[] {
    const list: ExamQuestion[] = [];
    const types: ExamQuestionType[] = ['single', 'multi', 'match', 'decompose'];

    for (let i = 0; i < count; i++) {
      // Cycle through types so every exam has diverse question formats
      const type = types[i % types.length];
      list.push(this.generateQuestion(grade, difficulty, type));
    }

    return list;
  }

  generateQuestion(
    grade: Grade,
    difficulty: Difficulty,
    forcedType?: ExamQuestionType
  ): ExamQuestion {
    const id = `exam-${Date.now().toString(36)}-${this.counter++}`;
    const type =
      forcedType ??
      (['single', 'multi', 'match', 'decompose'][Math.floor(Math.random() * 4)] as ExamQuestionType);

    switch (type) {
      case 'decompose':
        return this.generateDecomposition(id, grade, difficulty);
      case 'multi':
        return this.generateMultiSelect(id, grade, difficulty);
      case 'match':
        return this.generateMatching(id, grade, difficulty);
      case 'single':
      default:
        return this.generateSingleChoice(id, grade, difficulty);
    }
  }

  /**
   * Metode Dekomposisi Buku Pelajaran SD (Memecah angka puluhan dan satuan).
   * Contoh: 34 + 23 -> (30 + 4) + (20 + 3) -> (30 + 20) + (4 + 3) = 50 + 7 = 57.
   */
  private generateDecomposition(id: string, grade: Grade, difficulty: Difficulty): ExamQuestion {
    const isAdd = grade === Grade.One ? true : Math.random() > 0.4;
    let tensA = (Math.floor(Math.random() * 4) + 2) * 10; // 20, 30, 40, 50
    let onesA = Math.floor(Math.random() * 7) + 2; // 2..8
    let tensB = (Math.floor(Math.random() * 3) + 1) * 10; // 10, 20, 30
    let onesB = Math.floor(Math.random() * 5) + 1; // 1..5

    if (!isAdd && (tensA <= tensB || onesA < onesB)) {
      tensA = 50;
      tensB = 20;
      onesA = 8;
      onesB = 3;
    }

    const a = tensA + onesA;
    const b = tensB + onesB;
    const tensResult = isAdd ? tensA + tensB : tensA - tensB;
    const onesResult = isAdd ? onesA + onesB : onesA - onesB;
    const finalAnswer = isAdd ? a + b : a - b;

    const opSign = isAdd ? '+' : '-';
    const opWord = isAdd ? 'Penjumlahan' : 'Pengurangan';

    const decompose: DecomposeData = {
      a,
      b,
      operation: isAdd ? '+' : '-',
      tensA,
      onesA,
      tensB,
      onesB,
      tensResult,
      onesResult,
      finalAnswer,
    };

    return {
      id,
      type: 'decompose',
      grade,
      difficulty,
      topic: `${opWord} Metode Dekomposisi`,
      prompt: `Gunakan metode dekomposisi (memecah angka puluhan dan satuan) untuk menghitung ${a} ${opSign} ${b}:`,
      hint: `Pecah ${a} menjadi puluhan dan satuan, lalu hitung masing-masing!`,
      explanation: `${a} = ${tensA} + ${onesA}\n${b} = ${tensB} + ${onesB}\n(${tensA} ${opSign} ${tensB}) + (${onesA} ${opSign} ${onesB}) = ${tensResult} + ${onesResult} = ${finalAnswer}`,
      decompose,
    };
  }

  /**
   * Pilihan Ganda Kompleks (Jawaban lebih dari satu / multi-select).
   * Contoh: "Pilihlah semua operasi hitung yang bernilai 24!"
   */
  private generateMultiSelect(id: string, grade: Grade, difficulty: Difficulty): ExamQuestion {
    if (grade === Grade.One) {
      // Target 10 - 20
      const target = Math.floor(Math.random() * 8) + 12; // 12..19
      const correct1 = `${target - 4} + 4`;
      const correct2 = `${target + 3} - 3`;
      const wrong1 = `${target - 1} + 3`;
      const wrong2 = `${target + 5} - 2`;

      const options: MultiOption[] = [
        { id: '1', label: `${correct1} = ${target}`, isCorrect: true },
        { id: '2', label: `${wrong1} (Bukan ${target})`, isCorrect: false },
        { id: '3', label: `${correct2} = ${target}`, isCorrect: true },
        { id: '4', label: `${wrong2} (Bukan ${target})`, isCorrect: false },
      ].sort(() => Math.random() - 0.5);

      return {
        id,
        type: 'multi',
        grade,
        difficulty,
        topic: 'Pilihan Ganda Kompleks (Penjumlahan & Pengurangan)',
        prompt: `Pilihlah SEMUA operasi hitung di bawah ini yang hasilnya tepat sama dengan ${target}! (Pilih lebih dari satu)`,
        hint: `Hitung setiap pilihan dengan teliti sebelum memberi tanda centang.`,
        explanation: `Operasi yang tepat menghasilkan angka ${target}.`,
        multiOptions: options,
      };
    }

    // Grade 2 & 3: Termasuk konsep perkalian berulang & pembagian
    const target = (Math.floor(Math.random() * 5) + 3) * 4; // e.g. 12, 16, 20, 24, 28, 32
    const factorA = 4;
    const factorB = target / 4;

    const options: MultiOption[] = [
      { id: '1', label: `${factorA} × ${factorB}`, isCorrect: true },
      { id: '2', label: Array(factorA).fill(factorB).join(' + '), isCorrect: true },
      { id: '3', label: `${target + 10} - 10`, isCorrect: true },
      { id: '4', label: `${factorA + 1} × ${factorB}`, isCorrect: false },
      { id: '5', label: `${target - 5} + 2`, isCorrect: false },
    ].sort(() => Math.random() - 0.5);

    return {
      id,
      type: 'multi',
      grade,
      difficulty,
      topic: 'Pilihan Ganda Kompleks (Perkalian & Penjumlahan Berulang)',
      prompt: `Manakah dari bentuk perhitungan di bawah ini yang bernilai tepat sama dengan ${target}? (Pilih semua yang benar)`,
      hint: `Ingat: perkalian ${factorA} × ${factorB} sama dengan menjumlahkan ${factorB} sebanyak ${factorA} kali.`,
      explanation: `${factorA} × ${factorB} = ${Array(factorA).fill(factorB).join(' + ')} = ${target}.`,
      multiOptions: options,
    };
  }

  /**
   * Soal Penjodohan (Matching): 4 Pasangan Soal dan Jawaban dengan Hasil Unik
   */
  private generateMatching(id: string, grade: Grade, difficulty: Difficulty): ExamQuestion {
    const pairs: MatchPair[] = [];
    const usedAnswers = new Set<string>();

    if (grade === Grade.One) {
      const candidates = [
        { left: '8 + 5', right: '13' },
        { left: '16 − 7', right: '9' },
        { left: '10 + 8', right: '18' },
        { left: '15 − 4', right: '11' },
        { left: '9 + 6', right: '15' },
        { left: '14 − 6', right: '8' },
        { left: '7 + 7', right: '14' },
        { left: '20 − 8', right: '12' },
        { left: '11 + 6', right: '17' },
        { left: '18 − 8', right: '10' },
      ].sort(() => Math.random() - 0.5);

      for (const c of candidates) {
        if (!usedAnswers.has(c.right)) {
          usedAnswers.add(c.right);
          pairs.push({ id: `m${pairs.length + 1}`, left: c.left, right: c.right });
          if (pairs.length === 4) break;
        }
      }
    } else if (grade === Grade.Two) {
      const candidates = [
        { left: '3 × 4 (penjumlahan berulang)', right: '12' },
        { left: '25 + 12 (dekomposisi)', right: '37' },
        { left: '45 − 15', right: '30' },
        { left: '5 × 5', right: '25' },
        { left: '4 × 4 (4 + 4 + 4 + 4)', right: '16' },
        { left: '34 + 15', right: '49' },
        { left: '60 − 22', right: '38' },
        { left: '2 × 9', right: '18' },
        { left: '5 × 4', right: '20' },
        { left: '50 − 16', right: '34' },
      ].sort(() => Math.random() - 0.5);

      for (const c of candidates) {
        if (!usedAnswers.has(c.right)) {
          usedAnswers.add(c.right);
          pairs.push({ id: `m${pairs.length + 1}`, left: c.left, right: c.right });
          if (pairs.length === 4) break;
        }
      }
    } else {
      // Grade 3
      const candidates = [
        { left: '6 × 4', right: '24' },
        { left: '35 ÷ 5 (pengurangan berulang)', right: '7' },
        { left: '48 ÷ 6', right: '8' },
        { left: '7 × 5', right: '35' },
        { left: '36 ÷ 4', right: '9' },
        { left: '8 × 4', right: '32' },
        { left: '54 ÷ 9', right: '6' },
        { left: '9 × 3', right: '27' },
        { left: '10 × 5', right: '50' },
        { left: '40 ÷ 8', right: '5' },
      ].sort(() => Math.random() - 0.5);

      for (const c of candidates) {
        if (!usedAnswers.has(c.right)) {
          usedAnswers.add(c.right);
          pairs.push({ id: `m${pairs.length + 1}`, left: c.left, right: c.right });
          if (pairs.length === 4) break;
        }
      }
    }

    return {
      id,
      type: 'match',
      grade,
      difficulty,
      topic: 'Penjodohan (Menghubungkan 4 Pasangan)',
      prompt: 'Jodohkan 4 soal di sebelah kiri dengan nilai hasil yang benar di sebelah kanan!',
      hint: 'Ketuk kotak soal di kiri, lalu ketuk jawaban pasangannya di kanan.',
      explanation: pairs.map((p) => `${p.left} = ${p.right}`).join(', '),
      matchPairs: pairs,
    };
  }

  /**
   * Pilihan Ganda Standar (Soal Cerita / Konsep Buku SD)
   */
  private generateSingleChoice(id: string, grade: Grade, difficulty: Difficulty): ExamQuestion {
    if (grade === Grade.One) {
      const a = Math.floor(Math.random() * 9) + 4;
      const b = Math.floor(Math.random() * 8) + 2;
      const ans = a + b;
      const choices = [ans, ans + 1, ans - 1, ans + 2].sort(() => Math.random() - 0.5);

      return {
        id,
        type: 'single',
        grade,
        difficulty,
        topic: 'Soal Cerita Penjumlahan',
        prompt: `Ahmad memiliki ${a} butir kurma untuk berbuka puasa. Ayahnya membawakannya ${b} butir kurma lagi. Berapa butir kurma Ahmad seluruhnya sekarang?`,
        unit: 'butir',
        choices,
        singleAnswer: ans,
        explanation: `${a} + ${b} = ${ans} butir kurma.`,
      };
    }

    if (grade === Grade.Two) {
      const jars = Math.floor(Math.random() * 4) + 2; // 2..5
      const perJar = Math.floor(Math.random() * 4) + 2; // 2..5
      const ans = jars * perJar;
      const choices = [ans, ans + jars, ans - 2, ans + 3].sort(() => Math.random() - 0.5);

      return {
        id,
        type: 'single',
        grade,
        difficulty,
        topic: 'Konsep Perkalian (Penjumlahan Berulang)',
        prompt: `Fatimah menyiapkan ${jars} piring kue sedekah. Setiap piring berisi ${perJar} kue. Kalimat matematika penjumlahan berulang dan hasil total kue Fatimah adalah:`,
        unit: 'kue',
        choices,
        singleAnswer: ans,
        explanation: `${Array(jars).fill(perJar).join(' + ')} = ${jars} × ${perJar} = ${ans} kue.`,
      };
    }

    // Grade 3: Pembagian / Nilai Tempat
    const totalKurma = (Math.floor(Math.random() * 4) + 2) * 6; // 12, 18, 24, 30
    const anak = 6;
    const ans = totalKurma / anak;
    const choices = [ans, ans + 1, ans - 1, ans + 2].sort(() => Math.random() - 0.5);

    return {
      id,
      type: 'single',
      grade,
      difficulty,
      topic: 'Konsep Pembagian (Bagi Rata)',
      prompt: `Ada ${totalKurma} butir kurma yang akan dibagikan sama rata kepada ${anak} anak yatim. Berapakah kurma yang diterima oleh masing-masing anak?`,
      unit: 'butir',
      choices,
      singleAnswer: ans,
      explanation: `${totalKurma} ÷ ${anak} = ${ans} butir kurma (setiap anak mendapat sama rata).`,
    };
  }
}

export const examQuestionService = new ExamQuestionService();
