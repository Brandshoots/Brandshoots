import gsap from 'gsap';
import { playShutterClick } from '../utils/audioFX';

export interface PreloaderTimelineRefs {
  containerRef: React.RefObject<HTMLDivElement>;
  deviceContainerRef: React.RefObject<HTMLDivElement>;
  deviceOuterRef: React.RefObject<HTMLDivElement>;
  screenInnerRef: React.RefObject<HTMLDivElement>;
  flashRef: React.RefObject<HTMLDivElement>;
  backdropHazeRef: React.RefObject<HTMLDivElement>;
}

export interface PreloaderTimelineCallbacks {
  onReelChange: (index: number) => void;
  onLogoStageChange: (stage: 'hidden' | 'focus' | 'shutter' | 'snap' | 'locked' | 'expand') => void;
  onColorReveal: (revealed: boolean) => void;
  onFocusStateChange: (focusing: boolean, locked: boolean) => void;
  onComplete: () => void;
}

/**
 * Creates and runs the master GSAP cinematic preloader timeline.
 * Synchronizes video memory cuts, white flashes, autofocus lock, shutter snap,
 * brand color bloom, and seamless screen expansion handoff.
 */
export function createPreloaderTimeline(
  refs: PreloaderTimelineRefs,
  callbacks: PreloaderTimelineCallbacks
): gsap.core.Timeline {
  const {
    containerRef,
    deviceContainerRef,
    deviceOuterRef,
    screenInnerRef,
    flashRef,
    backdropHazeRef
  } = refs;

  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      callbacks.onComplete();
    }
  });

  // Initial State Setup
  tl.set(containerRef.current, { opacity: 1, visibility: 'visible' });
  tl.set(deviceContainerRef.current, {
    opacity: 0,
    scale: 0.88,
    y: 25,
    rotateX: 4,
    rotateY: -3
  });
  tl.set(backdropHazeRef.current, { opacity: 0 });
  tl.set(flashRef.current, { opacity: 0 });

  // ----------------------------------------------------
  // LABEL: intro (0.00s)
  // Deep silence, black environment with gradual ambient rise
  // ----------------------------------------------------
  tl.addLabel('intro', 0.0);
  tl.to(backdropHazeRef.current, {
    opacity: 0.45,
    duration: 0.8,
    ease: 'power2.inOut'
  }, 'intro+=0.1');

  // ----------------------------------------------------
  // LABEL: deviceReveal (~0.30s)
  // Physical cinema monitor emerges with weight and stabilized float
  // ----------------------------------------------------
  tl.addLabel('deviceReveal', 0.35);
  tl.to(deviceContainerRef.current, {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 1,
    rotateY: -1,
    duration: 0.85,
    ease: 'power3.out'
  }, 'deviceReveal');

  // Continuous micro handheld float on the device
  tl.to(deviceContainerRef.current, {
    rotateX: -1.2,
    rotateY: 1.5,
    y: -4,
    duration: 2.2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: 1
  }, 'deviceReveal+=0.4');

  // ----------------------------------------------------
  // LABEL: memory01 (~0.50s)
  // First memory fragment cuts into existence
  // ----------------------------------------------------
  tl.addLabel('memory01', 0.52);
  tl.call(() => callbacks.onReelChange(0), undefined, 'memory01');

  // ----------------------------------------------------
  // Micro exposure pop & flash cut to memory02 (~0.88s)
  // ----------------------------------------------------
  tl.addLabel('flash01', 0.88);
  tl.to(flashRef.current, {
    opacity: 0.75,
    duration: 0.07,
    ease: 'power4.in',
    onComplete: () => callbacks.onReelChange(1)
  }, 'flash01');
  tl.to(flashRef.current, {
    opacity: 0,
    duration: 0.09,
    ease: 'power3.out'
  }, 'flash01+=0.07');

  // ----------------------------------------------------
  // LABEL: memory02 (~0.98s) -> Hard cut to memory03 (~1.32s)
  // ----------------------------------------------------
  tl.addLabel('memory03', 1.32);
  tl.call(() => callbacks.onReelChange(2), undefined, 'memory03');

  // ----------------------------------------------------
  // Camera exposure flash cut to memory04 (~1.65s)
  // ----------------------------------------------------
  tl.addLabel('flash02', 1.65);
  tl.to(flashRef.current, {
    opacity: 0.85,
    duration: 0.08,
    ease: 'power4.in',
    onComplete: () => callbacks.onReelChange(3)
  }, 'flash02');
  tl.to(flashRef.current, {
    opacity: 0,
    duration: 0.1,
    ease: 'power3.out'
  }, 'flash02+=0.08');

  // ----------------------------------------------------
  // Cut to memory05 (~1.98s)
  // ----------------------------------------------------
  tl.addLabel('memory05', 1.98);
  tl.call(() => callbacks.onReelChange(4), undefined, 'memory05');

  // ----------------------------------------------------
  // LABEL: memoryHold (~2.40s)
  // Final memory clip (Director master frame) enters and slows down
  // ----------------------------------------------------
  tl.addLabel('memoryHold', 2.38);
  tl.call(() => callbacks.onReelChange(5), undefined, 'memoryHold');

  // Deceleration: Motion settles, still breath (Section 18)
  tl.to(deviceContainerRef.current, {
    rotateX: 0,
    rotateY: 0,
    y: 0,
    scale: 1.02,
    duration: 0.7,
    ease: 'power2.out'
  }, 'memoryHold+=0.2');

  // ----------------------------------------------------
  // LABEL: focus (~2.95s)
  // Autofocus lock sequence initiates
  // ----------------------------------------------------
  tl.addLabel('focus', 2.95);
  tl.call(() => callbacks.onFocusStateChange(true, false), undefined, 'focus');

  // Autofocus locks sharp (~3.25s)
  tl.call(() => callbacks.onFocusStateChange(true, true), undefined, 'focus+=0.3');

  // ----------------------------------------------------
  // LABEL: shutter & snap (~3.45s)
  // Shutter iris tightens -> CLICK -> WHITE FLASH
  // ----------------------------------------------------
  tl.addLabel('shutter', 3.42);
  tl.call(() => callbacks.onLogoStageChange('shutter'), undefined, 'shutter');

  tl.addLabel('snap', 3.58);
  tl.call(() => {
    callbacks.onLogoStageChange('snap');
    playShutterClick();
  }, undefined, 'snap');

  // Emotional Peak: White Camera Flash (Section 21)
  tl.addLabel('flash', 3.65);
  tl.to(flashRef.current, {
    opacity: 1,
    duration: 0.09,
    ease: 'expo.in',
    onComplete: () => {
      // Official Brand Blue blooms at peak flash!
      callbacks.onColorReveal(true);
      callbacks.onLogoStageChange('locked');
      callbacks.onFocusStateChange(false, true);
    }
  }, 'flash');

  // Flash decays into crisp locked identity
  tl.to(flashRef.current, {
    opacity: 0,
    duration: 0.22,
    ease: 'power2.out'
  }, 'flash+=0.09');

  // ----------------------------------------------------
  // LABEL: logoLock (~3.90s)
  // Hold the official identity with "Create. Shoot. Grow."
  // ----------------------------------------------------
  tl.addLabel('logoLock', 3.90);
  tl.to(deviceContainerRef.current, {
    scale: 1.04,
    duration: 0.5,
    ease: 'power1.out'
  }, 'logoLock');

  // ----------------------------------------------------
  // LABEL: expand & exit (~4.40s)
  // THE BIG TRANSITION: Screen expands toward viewer,
  // device hardware flies past viewport borders,
  // revealing the Phase 2 Hero stage seamlessly (Section 25, 26, 27)
  // ----------------------------------------------------
  tl.addLabel('expand', 4.40);
  tl.call(() => callbacks.onLogoStageChange('expand'), undefined, 'expand');

  // Outer gimbal hardware fades & flies outward beyond the frame
  tl.to(deviceOuterRef.current, {
    opacity: 0,
    scale: 1.4,
    duration: 0.5,
    ease: 'power2.in'
  }, 'expand');

  // Device screen scales dramatically forward into full viewport
  tl.to(deviceContainerRef.current, {
    scale: 3.6,
    y: 0,
    duration: 1.1,
    ease: 'power4.inOut'
  }, 'expand');

  // Optic internal barrel zoom
  tl.to(screenInnerRef.current, {
    scale: 1.15,
    duration: 1.1,
    ease: 'power3.inOut'
  }, 'expand');

  // Background overlay fades smoothly to handoff
  tl.to(containerRef.current, {
    opacity: 0,
    duration: 0.55,
    ease: 'power2.out'
  }, 'expand+=0.65');

  return tl;
}
