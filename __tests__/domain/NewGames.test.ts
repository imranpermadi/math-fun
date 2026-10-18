import { generateArcheryRound } from '../../src/presentation/games/pemanah-thariq/logic';
import { generateCannonRound } from '../../src/presentation/games/meriam-malahayati/logic';
import { generateCosmicRound } from '../../src/presentation/games/bintang-falak/logic';
import { generateChefRound } from '../../src/presentation/games/koki-berkah-slice/logic';
import { generateRallyRound } from '../../src/presentation/games/safari-rally-gurun/logic';
import { generateTowerRound } from '../../src/presentation/games/menara-arsitek-khazanah/logic';
import { generateAlchemyRound } from '../../src/presentation/games/laboratorium-ibnu-sina/logic';
import { generateMinecartRound } from '../../src/presentation/games/kereta-gua-permata/logic';
import { generateDefenseRound } from '../../src/presentation/games/benteng-pertahanan-hijrah/logic';
import { generateRhythmRound } from '../../src/presentation/games/ritme-bedug-berkah/logic';
import { MULTIPLICATION_EXAMPLES, MULTIPLICATION_TRICKS } from '../../src/presentation/games/hafalan-perkalian/examples';
import { Grade, Difficulty } from '../../src/domain/enums';

describe('New World-Class Math Games Logic Suite', () => {
  test('1. Pemanah Thariq generates valid targets with correct answer', () => {
    const round = generateArcheryRound(Grade.Two, Difficulty.Medium);
    expect(round.targets.length).toBeGreaterThanOrEqual(3);
    const correctTarget = round.targets.find(t => t.isCorrect);
    expect(correctTarget).toBeDefined();
    expect(correctTarget?.value).toBe(round.correctAnswer);
  });

  test('2. Meriam Malahayati generates valid FPB/KPK ships with correct answer', () => {
    const round = generateCannonRound(Grade.Three, Difficulty.Medium);
    expect(round.ships.length).toBe(3);
    const correctShip = round.ships.find(s => s.isCorrect);
    expect(correctShip).toBeDefined();
    expect(correctShip?.value).toBe(round.correctAnswer);
  });

  test('3. Bintang Falak generates positive and negative integers correctly', () => {
    const round = generateCosmicRound(Grade.Three, Difficulty.Medium);
    expect(round.meteors.length).toBe(3);
    const correctMeteor = round.meteors.find(m => m.isCorrect);
    expect(correctMeteor).toBeDefined();
    expect(correctMeteor?.value).toBe(round.correctAnswer);
  });

  test('4. Koki Berkah Slice generates valid fraction options', () => {
    const round = generateChefRound(Grade.Two, Difficulty.Medium);
    expect(round.options.length).toBe(3);
    const correctOption = round.options.find(o => o.isCorrect);
    expect(correctOption).toBeDefined();
  });

  test('5. Safari Rally Gurun generates valid speed/distance/time gates', () => {
    const round = generateRallyRound(Grade.Three, Difficulty.Medium);
    expect(round.gates.length).toBe(3);
    const correctGate = round.gates.find(g => g.isCorrect);
    expect(correctGate).toBeDefined();
    expect(correctGate?.value).toBe(round.correctAnswer);
  });

  test('6. Menara Arsitek Khazanah generates valid geometry area/perimeter foundations', () => {
    const round = generateTowerRound(Grade.Three, Difficulty.Medium);
    expect(round.foundations.length).toBe(3);
    const correctFound = round.foundations.find(f => f.isCorrect);
    expect(correctFound).toBeDefined();
    expect(correctFound?.value).toBe(round.correctAnswer);
  });

  test('7. Laboratorium Ibnu Sina generates valid ratio and percent flasks', () => {
    const round = generateAlchemyRound(Grade.Three, Difficulty.Medium);
    expect(round.flasks.length).toBe(3);
    const correctFlask = round.flasks.find(f => f.isCorrect);
    expect(correctFlask).toBeDefined();
    expect(correctFlask?.value).toBe(round.correctAnswer);
  });

  test('8. Kereta Gua Permata accurately identifies prime numbers', () => {
    const round = generateMinecartRound(Grade.Three, Difficulty.Medium);
    expect(round.gems.length).toBe(3);
    const correctGem = round.gems.find(g => g.isCorrect);
    expect(correctGem).toBeDefined();
    expect(correctGem?.isPrime).toBe(true);
  });

  test('9. Benteng Pertahanan Hijrah computes PEMDAS/KABATAKU correctly', () => {
    const round = generateDefenseRound(Grade.Three, Difficulty.Medium);
    expect(round.catapults.length).toBe(3);
    const correctCatapult = round.catapults.find(c => c.isCorrect);
    expect(correctCatapult).toBeDefined();
    expect(correctCatapult?.value).toBe(round.correctAnswer);
  });

  test('10. Ritme Bedug Berkah generates valid musical beat numbers', () => {
    const round = generateRhythmRound(Grade.Two, Difficulty.Medium);
    expect(round.drums.length).toBe(3);
    const correctDrum = round.drums.find(d => d.isCorrect);
    expect(correctDrum).toBeDefined();
    expect(correctDrum?.value).toBe(round.correctAnswer);
  });

  test('Multiplication Examples cover tables 1 through 10 with story, visual rows, and practice quiz', () => {
    for (let table = 1; table <= 10; table++) {
      const examples = MULTIPLICATION_EXAMPLES[table];
      expect(examples).toBeDefined();
      expect(examples.length).toBeGreaterThanOrEqual(1);

      examples.forEach(ex => {
        expect(ex.tableNumber).toBe(table);
        expect(ex.story).toBeTruthy();
        expect(ex.question).toBeTruthy();
        expect(ex.multiplier * ex.multiplicand).toBe(ex.product);
        expect(ex.visualRows.length).toBe(ex.multiplier);
        expect(ex.practiceQuiz.choices).toContain(ex.practiceQuiz.answer);
      });
    }
  });

  test('Multiplication Tricks cover tables 1 through 10 with formulas and visual guides', () => {
    expect(MULTIPLICATION_TRICKS.length).toBe(10);
    for (let table = 1; table <= 10; table++) {
      const trick = MULTIPLICATION_TRICKS.find(t => t.tableNumber === table);
      expect(trick).toBeDefined();
      expect(trick?.formula).toBeTruthy();
      expect(trick?.secret).toBeTruthy();
      expect(trick?.visualGuide.length).toBeGreaterThan(0);
    }
  });
});
