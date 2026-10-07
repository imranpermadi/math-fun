import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

const FILES = {
  correct: require('../../../assets/sounds/correct.wav'),
  wrong: require('../../../assets/sounds/wrong.wav'),
  tap: require('../../../assets/sounds/tap.wav'),
  pop: require('../../../assets/sounds/pop.wav'),
  win: require('../../../assets/sounds/win.wav'),
  whoosh: require('../../../assets/sounds/whoosh.wav'),
  tick: require('../../../assets/sounds/tick.wav'),
} as const;

export type SfxName = keyof typeof FILES;

/** Sound effects + text-to-speech + haptics. Every call is fire-and-forget and never throws. */
class SoundServiceImpl {
  private players: Partial<Record<SfxName, AudioPlayer>> = {};
  private enabled = true;
  private ready = false;

  setEnabled(on: boolean) {
    this.enabled = on;
    if (!on) Speech.stop().catch?.(() => undefined);
  }

  private async init() {
    if (this.ready) return;
    this.ready = true;
    try {
      await setAudioModeAsync({ playsInSilentMode: true });
    } catch { /* ignore */ }
  }

  play(name: SfxName) {
    if (!this.enabled) return;
    try {
      this.init();
      let p = this.players[name];
      if (!p) p = this.players[name] = createAudioPlayer(FILES[name]);
      p.seekTo(0).catch(() => undefined);
      p.play();
    } catch { /* ignore audio failures */ }
  }

  speak(text: string) {
    if (!this.enabled) return;
    try {
      Speech.stop();
      Speech.speak(text, { language: 'id-ID', rate: 0.9, pitch: 1.1 });
    } catch { /* ignore */ }
  }

  stopSpeaking() {
    try { Speech.stop(); } catch { /* ignore */ }
  }

  tap() {
    this.play('tap');
    Haptics.selectionAsync().catch(() => undefined);
  }

  pop() {
    this.play('pop');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
  }

  correct() {
    this.play('correct');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
  }

  wrong() {
    this.play('wrong');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
  }

  win() {
    this.play('win');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
  }
}

export const SoundService = new SoundServiceImpl();

