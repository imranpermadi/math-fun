import { Question, QuestionRequest } from '../entities/Question';
import { Difficulty, Grade, Operation } from '../enums';
import {
  NAMES_BOY,
  NAMES_GIRL,
  TEMPLATES,
  renderTemplate,
} from '../../core/i18n/questionTemplates';

export type RandomFn = () => number; // returns [0,1)

interface Range {
  min: number;
  max: number;
}

interface Spec {
  a: Range;
  b: Range;
}

/** Operations unlocked per grade (Kurikulum: K1 +/-, K2 +/- and intro x, K3 all four). */
const OPERATIONS_BY_GRADE: Record<Grade, Operation[]> = {
  [Grade.One]: [Operation.Addition, Operation.Subtraction],
  [Grade.Two]: [Operation.Addition, Operation.Subtraction, Operation.Multiplication],
  [Grade.Three]: [
    Operation.Addition,
    Operation.Subtraction,
    Operation.Multiplication,
    Operation.Division,
  ],
};

const SPECS: Record<Grade, Record<Difficulty, Partial<Record<Operation, Spec>>>> = {
  [Grade.One]: {
    [Difficulty.Easy]: {
      [Operation.Addition]: { a: { min: 1, max: 9 }, b: { min: 1, max: 9 } },
      [Operation.Subtraction]: { a: { min: 2, max: 10 }, b: { min: 1, max: 9 } },
    },
    [Difficulty.Medium]: {
      [Operation.Addition]: { a: { min: 5, max: 15 }, b: { min: 1, max: 10 } },
      [Operation.Subtraction]: { a: { min: 8, max: 20 }, b: { min: 1, max: 10 } },
    },
    [Difficulty.Hard]: {
      [Operation.Addition]: { a: { min: 10, max: 50 }, b: { min: 10, max: 50 } },
      [Operation.Subtraction]: { a: { min: 20, max: 100 }, b: { min: 5, max: 50 } },
    },
  },
  [Grade.Two]: {
    [Difficulty.Easy]: {
      [Operation.Addition]: { a: { min: 10, max: 50 }, b: { min: 5, max: 40 } },
      [Operation.Subtraction]: { a: { min: 20, max: 99 }, b: { min: 5, max: 50 } },
      [Operation.Multiplication]: { a: { min: 2, max: 5 }, b: { min: 2, max: 5 } },
    },
    [Difficulty.Medium]: {
      [Operation.Addition]: { a: { min: 50, max: 500 }, b: { min: 20, max: 400 } },
      [Operation.Subtraction]: { a: { min: 100, max: 500 }, b: { min: 20, max: 99 } },
      [Operation.Multiplication]: { a: { min: 2, max: 10 }, b: { min: 2, max: 5 } },
    },
    [Difficulty.Hard]: {
      [Operation.Addition]: { a: { min: 200, max: 999 }, b: { min: 100, max: 999 } },
      [Operation.Subtraction]: { a: { min: 300, max: 999 }, b: { min: 50, max: 299 } },
      [Operation.Multiplication]: { a: { min: 2, max: 10 }, b: { min: 2, max: 10 } },
    },
  },
  [Grade.Three]: {
    [Difficulty.Easy]: {
      [Operation.Addition]: { a: { min: 100, max: 500 }, b: { min: 50, max: 400 } },
      [Operation.Subtraction]: { a: { min: 200, max: 700 }, b: { min: 50, max: 199 } },
      [Operation.Multiplication]: { a: { min: 2, max: 10 }, b: { min: 2, max: 10 } },
      // a = quotient, b = divisor (a*b computed as dividend)
      [Operation.Division]: { a: { min: 2, max: 10 }, b: { min: 2, max: 5 } },
    },
    [Difficulty.Medium]: {
      [Operation.Addition]: { a: { min: 300, max: 999 }, b: { min: 100, max: 999 } },
      [Operation.Subtraction]: { a: { min: 500, max: 999 }, b: { min: 100, max: 499 } },
      [Operation.Multiplication]: { a: { min: 6, max: 20 }, b: { min: 2, max: 10 } },
      [Operation.Division]: { a: { min: 3, max: 12 }, b: { min: 2, max: 10 } },
    },
    [Difficulty.Hard]: {
      [Operation.Addition]: { a: { min: 1000, max: 5000 }, b: { min: 500, max: 4000 } },
      [Operation.Subtraction]: { a: { min: 1500, max: 9999 }, b: { min: 300, max: 1499 } },
      [Operation.Multiplication]: { a: { min: 11, max: 50 }, b: { min: 2, max: 10 } },
      [Operation.Division]: { a: { min: 5, max: 25 }, b: { min: 2, max: 10 } },
    },
  },
};

export class QuestionGeneratorService {
  private counter = 0;

  constructor(private readonly random: RandomFn = Math.random) {}

  generate(req: QuestionRequest): Question {
    const operation = req.operation ?? this.pick(OPERATIONS_BY_GRADE[req.grade]);
    if (!OPERATIONS_BY_GRADE[req.grade].includes(operation)) {
      throw new Error(`Operation ${operation} not available for grade ${req.grade}`);
    }
    const spec = SPECS[req.grade][req.difficulty][operation];
    if (!spec) {
      throw new Error(`No spec for ${req.grade}/${req.difficulty}/${operation}`);
    }

    const [x, y, answer] = this.buildOperands(operation, spec);
    const template = this.pick(TEMPLATES[operation]);
    const name = this.pick([...NAMES_BOY, ...NAMES_GIRL]);

    return {
      id: `q-${Date.now().toString(36)}-${this.counter++}`,
      text: renderTemplate(template.text, { name, A: x, B: y }),
      operation,
      grade: req.grade,
      difficulty: req.difficulty,
      operands: [x, y],
      answer,
      unit: template.unit,
    };
  }

  generateMany(req: QuestionRequest, count: number): Question[] {
    return Array.from({ length: count }, () => this.generate(req));
  }

  /** Dynamic answer check: accepts number or string ("12", " 12 "). */
  validateAnswer(question: Question, input: number | string): boolean {
    const value = typeof input === 'number' ? input : Number(input.trim());
    return Number.isFinite(value) && value === question.answer;
  }

  /**
   * Multiple choice options for a question: the correct answer plus plausible
   * wrong ones (off-by-one/two/ten, wrong-operation result). Shuffled, unique, > 0.
   */
  generateChoices(question: Question, count = 3): number[] {
    const [a, b] = question.operands;
    const ans = question.answer;
    const candidates = [
      ans + 1, ans - 1, ans + 2, ans - 2, ans + 10, ans - 10,
      a + b, Math.abs(a - b), a * b,
    ];
    const pool = Array.from(new Set(candidates.filter((c) => c > 0 && c !== ans)));
    // shuffle pool then take what we need
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(this.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const choices = [ans, ...pool.slice(0, count - 1)];
    let bump = 3;
    while (choices.length < count) {
      if (!choices.includes(ans + bump)) choices.push(ans + bump);
      bump++;
    }
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(this.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    return choices;
  }

  private buildOperands(op: Operation, spec: Spec): [number, number, number] {
    switch (op) {
      case Operation.Addition: {
        const a = this.int(spec.a);
        const b = this.int(spec.b);
        return [a, b, a + b];
      }
      case Operation.Subtraction: {
        let a = this.int(spec.a);
        let b = this.int(spec.b);
        if (b >= a) [a, b] = [b + 1, a]; // keep result positive
        if (b >= a) b = a - 1;
        return [a, b, a - b];
      }
      case Operation.Multiplication: {
        const a = this.int(spec.a);
        const b = this.int(spec.b);
        return [a, b, a * b];
      }
      case Operation.Division: {
        const quotient = this.int(spec.a);
        const divisor = this.int(spec.b);
        return [quotient * divisor, divisor, quotient]; // always exact
      }
    }
  }

  private int({ min, max }: Range): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  private pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.random() * arr.length)];
  }
}

