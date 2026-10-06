import gsap from 'gsap';

export interface PreloaderTimelineRefs {
  containerRef: React.RefObject<HTMLDivElement>;
  tilesContainerRef: React.RefObject<HTMLDivElement>;
  logoOverlayRef: React.RefObject<HTMLDivElement>;
  flashRef: React.RefObject<HTMLDivElement>;
  backdropHazeRef: React.RefObject<HTMLDivElement>;
}

export interface PreloaderTimelineCallbacks {
  onCollectStateChange: (collecting: boolean) => void;
  onLogoStageChange: (stage: 'hidden' | 'focus' | 'shutter' | 'snap' | 'locked' | 'expand') => void;
  onColorReveal: (revealed: boolean) => void;
  onFocusStateChange: (focusing: boolean, locked: boolean) => void;
  onComplete: () => void;
}

/**
 * Creates and runs the master GSAP cinematic preloader timeline.
 * Orchestrates 3D multigrade scrolling tiles, convergence ("collecting"),
 * shutter snap, white flash, and seamless expansion into the hero.
 */
export function createPreloaderTimeline(
  refs: PreloaderTimelineRefs,
  callbacks: PreloaderTimelineCallbacks
): gsap.core.Timeline {
  const {
    containerRef,
    tilesContainerRef,
    logoOverlayRef,
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
  tl.set(tilesContainerRef.current, { opacity: 0, scale: 0.95 });
  tl.set(backdropHazeRef.current, { opacity: 0 });
  tl.set(flashRef.current, { opacity: 0 });

  // ----------------------------------------------------
  // LABEL: intro (0.00s)
  // 3D Multigrade Tiles emerge into spatial perspective
  // ----------------------------------------------------
  tl.addLabel('intro', 0.0);
  tl.to(backdropHazeRef.current, {
    opacity: 0.5,
    duration: 0.8,
    ease: 'power2.inOut'
  }, 'intro+=0.1');

  tl.to(tilesContainerRef.current, {
    opacity: 1,
    scale: 1,
    duration: 1.0,
    ease: 'power3.out'
  }, 'intro+=0.2');

  // ----------------------------------------------------
  // LABEL: streaming (0.80s - 2.20s)
  // Rapid 3D multigrade tiles stream across the viewport
  // ----------------------------------------------------
  tl.addLabel('streaming', 0.8);

  // Mid-stream camera exposure flash
  tl.to(flashRef.current, {
    opacity: 0.65,
    duration: 0.08,
    ease: 'power4.in'
  }, 'streaming+=0.6');
  tl.to(flashRef.current, {
    opacity: 0,
    duration: 0.1,
    ease: 'power3.out'
  }, 'streaming+=0.68');

  // ----------------------------------------------------
  // LABEL: collect (~2.20s)
  // THE TILES COLLECT! (Camille Mormal inspired convergence)
  // Scrolling slows down, perspective straightens, tiles pull together
  // ----------------------------------------------------
  tl.addLabel('collect', 2.2);
  tl.call(() => callbacks.onCollectStateChange(true), undefined, 'collect');

  // ----------------------------------------------------
  // LABEL: focus (~2.80s)
  // Center autofocus target initiates
  // ----------------------------------------------------
  tl.addLabel('focus', 2.8);
  tl.call(() => callbacks.onFocusStateChange(true, false), undefined, 'focus');
  tl.call(() => callbacks.onLogoStageChange('focus'), undefined, 'focus+=0.1');

  // Autofocus locks sharp (~3.15s)
  tl.call(() => callbacks.onFocusStateChange(true, true), undefined, 'focus+=0.35');

  // ----------------------------------------------------
  // LABEL: shutter & snap (~3.45s)
  // Shutter iris tightens -> CLICK -> WHITE CAMERA FLASH
  // ----------------------------------------------------
  tl.addLabel('shutter', 3.45);
  tl.call(() => callbacks.onLogoStageChange('shutter'), undefined, 'shutter');

  tl.addLabel('snap', 3.6);
  tl.call(() => {
    callbacks.onLogoStageChange('snap');
  }, undefined, 'snap');

  // Emotional Peak: White Camera Flash
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
    duration: 0.28,
    ease: 'power2.out'
  }, 'flash+=0.09');

  // ----------------------------------------------------
  // LABEL: logoLock (~4.00s)
  // Hold the official identity with "Create. Shoot. Grow."
  // ----------------------------------------------------
  tl.addLabel('logoLock', 4.0);

  // ----------------------------------------------------
  // LABEL: expand & exit (~5.50s)
  // Clean, lightweight dissolve handoff into the Hero
  // ----------------------------------------------------
  tl.addLabel('expand', 5.5);
  tl.call(() => callbacks.onLogoStageChange('expand'), undefined, 'expand');

  // Clean, instantaneous opacity dissolve into the Hero
  tl.to(tilesContainerRef.current, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out'
  }, 'expand');

  if (logoOverlayRef.current) {
    tl.to(logoOverlayRef.current, {
      scale: 1.06,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    }, 'expand');
  }

  // Preloader container background dissolves cleanly into hero
  tl.to(containerRef.current, {
    opacity: 0,
    duration: 0.45,
    ease: 'power2.out'
  }, 'expand+=0.2');

  return tl;
}
