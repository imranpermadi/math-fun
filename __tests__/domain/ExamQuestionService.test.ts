import { ExamQuestionService } from '../../src/domain/services/ExamQuestionService';
import { Difficulty, Grade } from '../../src/domain/enums';

describe('ExamQuestionService', () => {
  const service = new ExamQuestionService();

  test('generates exam with exact count and mixed question types', () => {
    const questions = service.generateExam(Grade.Two, Difficulty.Medium, 10);
    expect(questions).toHaveLength(10);

    const types = new Set(questions.map((q) => q.type));
    expect(types.has('single')).toBe(true);
    expect(types.has('multi')).toBe(true);
    expect(types.has('match')).toBe(true);
    expect(types.has('decompose')).toBe(true);
  });

  test('decomposition question arithmetic is always mathematically sound', () => {
    for (let i = 0; i < 20; i++) {
      const q = service.generateQuestion(Grade.Two, Difficulty.Easy, 'decompose');
      expect(q.decompose).toBeDefined();
      const d = q.decompose!;

      expect(d.a).toBe(d.tensA + d.onesA);
      expect(d.b).toBe(d.tensB + d.onesB);

      if (d.operation === '+') {
        expect(d.tensResult).toBe(d.tensA + d.tensB);
        expect(d.onesResult).toBe(d.onesA + d.onesB);
        expect(d.finalAnswer).toBe(d.a + d.b);
      } else {
        expect(d.tensResult).toBe(d.tensA - d.tensB);
        expect(d.onesResult).toBe(d.onesA - d.onesB);
        expect(d.finalAnswer).toBe(d.a - d.b);
        expect(d.finalAnswer).toBeGreaterThan(0);
      }
    }
  });

  test('multi-select question always has at least one correct option', () => {
    const q = service.generateQuestion(Grade.Two, Difficulty.Medium, 'multi');
    expect(q.multiOptions).toBeDefined();
    const correctCount = q.multiOptions!.filter((o) => o.isCorrect).length;
    expect(correctCount).toBeGreaterThanOrEqual(1);
  });

  test('matching question provides 4 distinct pairs with unique answers across all grades', () => {
    for (const g of [Grade.One, Grade.Two, Grade.Three]) {
      const q = service.generateQuestion(g, Difficulty.Easy, 'match');
      expect(q.matchPairs).toBeDefined();
      expect(q.matchPairs!.length).toBe(4);
      const rightValues = new Set(q.matchPairs!.map((p) => p.right));
      expect(rightValues.size).toBe(4);
    }
  });
});
