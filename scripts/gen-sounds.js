// Generates small WAV sound effects into assets/sounds. Run: node scripts/gen-sounds.js
const fs = require('fs');
const path = require('path');

const RATE = 22050;
const out = path.join(__dirname, '..', 'assets', 'sounds');
fs.mkdirSync(out, { recursive: true });

/** notes: [freqHz, durationSec][]; freq 0 = silence */
function render(notes, { wave = 'sine', volume = 0.5 } = {}) {
  const samples = [];
  for (const [freq, dur] of notes) {
    const n = Math.floor(RATE * dur);
    for (let i = 0; i < n; i++) {
      const t = i / RATE;
      // fast attack + exponential-ish release so notes don't click
      const env = Math.min(1, i / 200) * Math.pow(1 - i / n, 1.5);
      let s = 0;
      if (freq > 0) {
        const ph = 2 * Math.PI * freq * t;
        s = wave === 'square' ? Math.sign(Math.sin(ph)) * 0.6 : Math.sin(ph) + 0.25 * Math.sin(2 * ph);
      }
      samples.push(s * env * volume);
    }
  }
  return samples;
}

function wav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => data.writeInt16LE(Math.max(-1, Math.min(1, s)) * 32767, i * 2));
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8);
  h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(RATE, 24); h.writeUInt32LE(RATE * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36); h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}

const C5 = 523, E5 = 659, G5 = 784, C6 = 1047, A4 = 440;
const sounds = {
  correct: render([[E5, 0.12], [G5, 0.12], [C6, 0.25]]),
  wrong: render([[220, 0.18], [165, 0.3]], { wave: 'square', volume: 0.3 }),
  tap: render([[880, 0.05]], { volume: 0.4 }),
  pop: render([[600, 0.04], [900, 0.06]], { volume: 0.4 }),
  win: render([[C5, 0.12], [E5, 0.12], [G5, 0.12], [C6, 0.12], [0, 0.05], [G5, 0.1], [C6, 0.4]]),
  whoosh: render([[300, 0.05], [400, 0.05], [500, 0.05], [700, 0.08]], { volume: 0.3 }),
  tick: render([[A4, 0.03]], { volume: 0.3 }),
};

for (const [name, samples] of Object.entries(sounds)) {
  fs.writeFileSync(path.join(out, `${name}.wav`), wav(samples));
}
console.log('sounds generated:', Object.keys(sounds).join(', '));

