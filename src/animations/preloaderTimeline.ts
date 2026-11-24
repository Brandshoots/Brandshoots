import gsap from 'gsap';
import { PRELOADER_CONFIG } from '../config/preloaderConfig';
import { Multigrade3DTilesHandle } from '../components/preloader/Multigrade3DTiles';
import { BrandLogoOverlayHandle } from '../components/preloader/BrandLogoOverlay';

export interface PreloaderTimelineRefs {
  containerRef: React.RefObject<HTMLDivElement>;
  tilesContainerRef: React.RefObject<HTMLDivElement>;
  tilesRef: React.RefObject<Multigrade3DTilesHandle | null>;
  logoOverlayRef: React.RefObject<BrandLogoOverlayHandle | null>;
  atmosphereRef: React.RefObject<HTMLDivElement>;
  flashRef: React.RefObject<HTMLDivElement>;
  backdropHazeRef: React.RefObject<HTMLDivElement>;
}

export interface PreloaderTimelineCallbacks {
  onComplete: () => void;
  onHoldForReadiness?: () => void;
}

/**
 * MASTER HARDWARE-ACCELERATED PRELOADER TIMELINE
 * Orchestrates 3D multigrade streaming, convergence, shutter snap,
 * white xenon camera flash, color bloom, and seamless dissolve handoff into the hero.
 * 100% hardware-accelerated compositor operations, ZERO React state updates during playback.
 */
export function createPreloaderTimeline(
  refs: PreloaderTimelineRefs,
  callbacks: PreloaderTimelineCallbacks
): gsap.core.Timeline {
  const {
    containerRef,
    tilesContainerRef,
    tilesRef,
    logoOverlayRef,
    atmosphereRef,
    flashRef,
    backdropHazeRef
  } = refs;

  const focusTime = PRELOADER_CONFIG.focusTiming;
  const snapTime = PRELOADER_CONFIG.logoSnapTiming;
  const flashTime = snapTime + 0.06;
  const flashEndPosition = `flash+=${PRELOADER_CONFIG.flashDuration}`;
  const expandTime = PRELOADER_CONFIG.totalSequenceDuration - PRELOADER_CONFIG.exitDuration;
  const collectTime = Math.max(0.5, focusTime - 0.2);
  const shutterTime = Math.max(focusTime + 0.15, snapTime - 0.1);

  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      if (tilesRef.current) {
        tilesRef.current.exit();
      }
      callbacks.onComplete();
    }
  });

  // Initial State Setup - Compositor transforms only
  tl.set(containerRef.current, { opacity: 1, visibility: 'visible' });
  tl.set(tilesContainerRef.current, { opacity: 0, scale: 0.95 });
  tl.set(backdropHazeRef.current, { opacity: 0 });
  tl.set(atmosphereRef.current, { opacity: 0 });
  tl.set(flashRef.current, { opacity: 0 });

  // ----------------------------------------------------
  // LABEL: intro (0.00s)
  // 3D Multigrade Tiles emerge into spatial perspective
  // ----------------------------------------------------
  tl.addLabel('intro', 0.0);
  tl.to(backdropHazeRef.current, {
    opacity: 0.5,
    duration: 0.42,
    ease: 'power2.inOut'
  }, 'intro+=0.05');

  tl.to(tilesContainerRef.current, {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    ease: 'power3.out'
  }, 'intro+=0.1');

  // ----------------------------------------------------
  // LABEL: streaming (0.35s)
  // Rapid 3D multigrade tiles stream across the viewport
  // ----------------------------------------------------
  tl.addLabel('streaming', 0.35);

  // Mid-stream camera exposure flash
  tl.to(flashRef.current, {
    opacity: 0.6,
    duration: 0.07,
    ease: 'power4.in'
  }, 'streaming+=0.45');
  tl.to(flashRef.current, {
    opacity: 0,
    duration: 0.1,
    ease: 'power3.out'
  }, 'streaming+=0.52');

  // ----------------------------------------------------
  // LABEL: collect (~0.55s)
  // Convergence: tiles gather together, perspective flattens
  // ----------------------------------------------------
  tl.addLabel('collect', collectTime);
  tl.call(() => {
    if (tilesRef.current) {
      tilesRef.current.collect();
    }
  }, undefined, 'collect');

  tl.to(tilesContainerRef.current, {
    opacity: 0.75,
    duration: 0.7,
    ease: 'power2.out'
  }, 'collect');

  tl.to(atmosphereRef.current, {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out'
  }, 'collect');

  // ----------------------------------------------------
  // LABEL: focus (~0.75s)
  // Center autofocus target initiates
  // ----------------------------------------------------
  tl.addLabel('focus', focusTime);
  tl.call(() => {
    if (logoOverlayRef.current) {
      logoOverlayRef.current.setStage('focus');
    }
  }, undefined, 'focus');

  tl.to(tilesContainerRef.current, {
    opacity: 0.55,
    duration: 0.45,
    ease: 'power2.out'
  }, 'focus');

  // ----------------------------------------------------
  // LABEL: shutter & snap (~0.95s)
  // Shutter iris tightens -> CLICK -> WHITE CAMERA FLASH
  // ----------------------------------------------------
  tl.addLabel('shutter', shutterTime);
  tl.call(() => {
    if (logoOverlayRef.current) {
      logoOverlayRef.current.setStage('shutter');
    }
  }, undefined, 'shutter');

  tl.addLabel('snap', snapTime);
  tl.call(() => {
    if (logoOverlayRef.current) {
      logoOverlayRef.current.setStage('snap');
    }
  }, undefined, 'snap');

  // Emotional Peak: White Xenon Camera Flash (~3.02s)
  tl.addLabel('flash', flashTime);
  tl.to(flashRef.current, {
    opacity: 1,
    duration: PRELOADER_CONFIG.flashDuration,
    onComplete: () => {
      // Official Brand Blue blooms at peak flash behind pure white cover
      if (tilesRef.current) {
        tilesRef.current.revealColor();
      }
      if (logoOverlayRef.current) {
        logoOverlayRef.current.setColorRevealed(true);
        logoOverlayRef.current.setStage('locked');
      }
    }
  }, 'flash');

  // Flash decays into crisp locked identity
  tl.to(flashRef.current, {
    opacity: 0,
    duration: 0.25,
    ease: 'power2.out'
  }, flashEndPosition);

  tl.to(tilesContainerRef.current, {
    opacity: 0.35,
    duration: 0.4,
    ease: 'power2.out'
  }, flashEndPosition);

  // ----------------------------------------------------
  // LABEL: logoLock (~1.11s - 1.55s)
  // Hold the official identity with "Create. Shoot. Grow."
  // ----------------------------------------------------
  tl.addLabel('logoLock', flashTime + PRELOADER_CONFIG.flashDuration);

  // ----------------------------------------------------
  // LABEL: expand & exit
  // Clean, instantaneous dissolve handoff into the Hero
  // ----------------------------------------------------
  tl.addLabel('expand', expandTime);
  tl.addPause('expand', () => {
    callbacks.onHoldForReadiness?.();
  });
  tl.call(() => {
    if (logoOverlayRef.current) {
      logoOverlayRef.current.setStage('expand');
    }
    if (tilesRef.current) {
      tilesRef.current.exit();
    }
  }, undefined, 'expand+=0.001');

  // Clean dissolve of tiles
  tl.to(tilesContainerRef.current, {
    opacity: 0,
    duration: PRELOADER_CONFIG.exitDuration,
    ease: 'power2.out'
  }, 'expand');

  // Preloader container background dissolves cleanly into hero
  tl.to(containerRef.current, {
    opacity: 0,
    duration: PRELOADER_CONFIG.exitDuration,
    ease: 'power2.out'
  }, 'expand');

  return tl;
}
