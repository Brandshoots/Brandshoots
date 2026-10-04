export interface ReelMetadata {
  lens: string;
  fps: string;
  iso: string;
  shutter: string;
  timecode: string;
}

export interface PreloaderReel {
  id: string;
  title: string;
  category: string;
  source: string;
  poster: string;
  duration: number; // seconds
  priority: number;
  cropPosition: string;
  metadata: ReelMetadata;
}

export interface PreloaderConfig {
  reelSequence: string[];
  totalSequenceDuration: number;
  flashDuration: number; // in seconds, e.g. 0.12
  deviceScale: {
    desktop: number;
    tablet: number;
    mobile: number;
  };
  deviceRotation: {
    maxTiltX: number;
    maxTiltY: number;
    floatSpeed: number;
  };
  logoSnapTiming: number;
  focusTiming: number;
  exitDuration: number;
  safetyTimeoutMs: number;
  brandColors: {
    blue: string;
    electric: string;
    navy: string;
    deepNavy: string;
    silver: string;
    softWhite: string;
  };
}

export type PreloaderState = 
  | 'idle'
  | 'intro'
  | 'deviceReveal'
  | 'memoryMontage'
  | 'memoryHold'
  | 'focusLock'
  | 'shutterClick'
  | 'logoLocked'
  | 'screenExpanding'
  | 'completed';
