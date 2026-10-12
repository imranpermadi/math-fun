import {
  getTableItems,
  generateQuizQuestions,
  MULTI_COLORS,
} from '../../src/presentation/games/hafalan-perkalian/logic';

describe('HafalanPerkalian Logic', () => {
  describe('getTableItems', () => {
    test('generates exactly 10 items for multiplication table of N', () => {
      const n = 7;
      const items = getTableItems(n);

      expect(items).toHaveLength(10);

      items.forEach((item, index) => {
        const a = index + 1;
        expect(item.multiplier).toBe(a);
        expect(item.multiplicand).toBe(n);
        expect(item.product).toBe(a * n);
        expect(item.speechText).toBe(`${a} kali ${n} sama dengan ${a * n}`);
      });
    });

    test('correctly generates edge table 1 and table 10', () => {
      const table1 = getTableItems(1);
      expect(table1[0].product).toBe(1);
      expect(table1[9].product).toBe(10);

      const table10 = getTableItems(10);
      expect(table10[0].product).toBe(10);
      expect(table10[9].product).toBe(100);
    });
  });

  describe('generateQuizQuestions', () => {
    test('generates requested count of questions with valid targetN', () => {
      const questions = generateQuizQuestions(3, 10);
      expect(questions).toHaveLength(10);

      questions.forEach((q) => {
        expect(q.b).toBe(3);
        expect(q.a).toBeGreaterThanOrEqual(1);
        expect(q.a).toBeLessThanOrEqual(10);
        expect(q.answer).toBe(q.a * q.b);
        expect(q.prompt).toBe(`${q.a} × ${q.b} = ?`);
      });
    });

    test('generates mixed questions when targetN is mix', () => {
      const questions = generateQuizQuestions('mix', 15);
      expect(questions).toHaveLength(15);

      const multipliers = new Set(questions.map((q) => q.b));
      expect(multipliers.size).toBeGreaterThan(1);

      questions.forEach((q) => {
        expect(q.answer).toBe(q.a * q.b);
      });
    });

    test('always provides exactly 4 unique choices containing the correct answer', () => {
      for (const target of [1, 2, 5, 8, 10, 'mix'] as const) {
        const questions = generateQuizQuestions(target, 10);
        questions.forEach((q) => {
          expect(q.choices).toHaveLength(4);
          expect(q.choices).toContain(q.answer);

          // All choices must be strictly unique
          const unique = new Set(q.choices);
          expect(unique.size).toBe(4);

          // All choices must be positive integers
          q.choices.forEach((c) => {
            expect(c).toBeGreaterThan(0);
            expect(Number.isInteger(c)).toBe(true);
          });
        });
      }
    });
  });

  describe('MULTI_COLORS', () => {
    test('defines distinct theme colors for tables 1 through 10', () => {
      for (let i = 1; i <= 10; i++) {
        expect(MULTI_COLORS[i]).toBeDefined();
        expect(MULTI_COLORS[i]).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    });
  });
});
