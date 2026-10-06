import { QuestionGeneratorService } from '../../src/domain/services/QuestionGeneratorService';
import { Difficulty, Grade, Operation } from '../../src/domain/enums';

describe('QuestionGeneratorService', () => {
  const svc = new QuestionGeneratorService();

  it('subtraction never negative, division always exact', () => {
    for (let i = 0; i < 300; i++) {
      for (const grade of [Grade.One, Grade.Two, Grade.Three]) {
        for (const difficulty of [Difficulty.Easy, Difficulty.Medium, Difficulty.Hard]) {
          const q = svc.generate({ grade, difficulty });
          expect(q.answer).toBeGreaterThanOrEqual(1);
          expect(q.text).not.toMatch(/\{\w+\}/);
          if (q.operation === Operation.Division) expect(q.operands[0] % q.operands[1]).toBe(0);
        }
      }
    }
  });

  it('validates answers', () => {
    const q = svc.generate({ grade: Grade.One, difficulty: Difficulty.Easy, operation: Operation.Addition });
    expect(svc.validateAnswer(q, q.answer)).toBe(true);
    expect(svc.validateAnswer(q, ` ${q.answer} `)).toBe(true);
    expect(svc.validateAnswer(q, q.answer + 1)).toBe(false);
    expect(svc.validateAnswer(q, 'abc')).toBe(false);
  });

  it('rejects division for grade 1', () => {
    expect(() =>
      svc.generate({ grade: Grade.One, difficulty: Difficulty.Easy, operation: Operation.Division }),
    ).toThrow();
  });
});

