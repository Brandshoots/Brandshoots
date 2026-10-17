import { PreloaderConfig } from '../types';

export const PRELOADER_CONFIG: PreloaderConfig = {
  reelSequence: ['reel-01', 'reel-02', 'reel-03', 'reel-04', 'reel-05', 'reel-06'],
  totalSequenceDuration: 4.25, // seconds - tightened for zero lag
  flashDuration: 0.08, // 80ms camera flash
  deviceScale: {
    desktop: 1.0,
    tablet: 0.88,
    mobile: 0.72
  },
  deviceRotation: {
    maxTiltX: 5.0, // degrees
    maxTiltY: 7.0, // degrees
    floatSpeed: 3.5 // breathing period
  },
  logoSnapTiming: 2.96,
  focusTiming: 2.4,
  exitDuration: 0.45,
  safetyTimeoutMs: 5500, // Never trap visitor: hard failsafe
  brandColors: {
    blue: '#1497F5',
    electric: '#139EF2',
    navy: '#070B33',
    deepNavy: '#0B104E',
    silver: '#B9BEC9',
    softWhite: '#F7F9FF'
  }
};
