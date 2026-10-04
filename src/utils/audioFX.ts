/**
 * Web Audio API Mechanical Shutter Synthesizer
 * Zero network payload, zero external dependencies.
 * Respects default mute (Section 35: No loud autoplay).
 */

let audioCtx: AudioContext | null = null;
let isAudioEnabled = false;

export function setAudioEnabled(enabled: boolean) {
  isAudioEnabled = enabled;
  if (enabled && !audioCtx) {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    } catch (e) {
      console.warn('AudioContext unavailable:', e);
    }
  }
}

export function playShutterClick() {
  if (!isAudioEnabled || !audioCtx) return;

  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // High frequency mechanical latch transient
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(2400, now);
    osc1.frequency.exponentialRampToValueAtTime(180, now + 0.04);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);

    // Mirror slap body thump
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(140, now + 0.01);
    osc2.frequency.exponentialRampToValueAtTime(45, now + 0.09);
    gain2.gain.setValueAtTime(0.22, now + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);

    osc1.start(now);
    osc1.stop(now + 0.05);
    osc2.start(now + 0.01);
    osc2.stop(now + 0.1);
  } catch (err) {
    console.warn('Sound synthesis error:', err);
  }
}
