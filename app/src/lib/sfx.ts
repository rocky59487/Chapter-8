/**
 * Synthesized sound effects via the Web Audio API — no asset files needed,
 * so they travel inside the bundle and work offline / inside an APK WebView.
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let enabled = true;

function ac(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(ctx.destination);
  }
  return ctx;
}

export function setSfxEnabled(on: boolean) {
  enabled = on;
}

/** Must be called from a user gesture on some browsers to unlock audio. */
export function unlockAudio() {
  const c = ac();
  if (c && c.state === 'suspended') c.resume().catch(() => {});
}

interface ToneOpts {
  freq: number;
  dur?: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
  /** sweep target frequency */
  to?: number;
}

function tone({ freq, dur = 0.16, type = 'sine', gain = 0.3, delay = 0, to }: ToneOpts) {
  const c = ac();
  if (!c || !masterGain || !enabled) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function chord(freqs: number[], opts: Partial<ToneOpts> = {}) {
  freqs.forEach((f, i) => tone({ freq: f, delay: i * 0.045, ...opts }));
}

export const sfx = {
  tap() {
    tone({ freq: 320, dur: 0.06, type: 'triangle', gain: 0.18 });
  },
  select() {
    tone({ freq: 520, dur: 0.08, type: 'triangle', gain: 0.2 });
  },
  correct() {
    // bright ascending arpeggio
    chord([523.25, 659.25, 783.99], { dur: 0.18, type: 'triangle', gain: 0.28 });
  },
  wrong() {
    tone({ freq: 200, to: 120, dur: 0.28, type: 'sawtooth', gain: 0.16 });
  },
  complete() {
    chord([523.25, 659.25, 783.99, 1046.5], {
      dur: 0.32,
      type: 'triangle',
      gain: 0.3,
    });
  },
  levelup() {
    chord([392, 523.25, 659.25, 783.99, 1046.5], {
      dur: 0.4,
      type: 'sine',
      gain: 0.3,
    });
  },
  streak() {
    tone({ freq: 660, to: 990, dur: 0.22, type: 'triangle', gain: 0.26 });
  },
  whoosh() {
    tone({ freq: 600, to: 200, dur: 0.2, type: 'sine', gain: 0.12 });
  },
  heart() {
    tone({ freq: 160, dur: 0.2, type: 'sine', gain: 0.2 });
  },
};
