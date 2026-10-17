import gsap from 'gsap';
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
    duration: 0.6,
    ease: 'power2.inOut'
  }, 'intro+=0.1');

  tl.to(tilesContainerRef.current, {
    opacity: 1,
    scale: 1,
    duration: 0.7,
    ease: 'power3.out'
  }, 'intro+=0.15');

  // ----------------------------------------------------
  // LABEL: streaming (0.75s)
  // Rapid 3D multigrade tiles stream across the viewport
  // ----------------------------------------------------
  tl.addLabel('streaming', 0.75);

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
  // LABEL: collect (~1.80s)
  // Convergence: tiles gather together, perspective flattens
  // ----------------------------------------------------
  tl.addLabel('collect', 1.8);
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
  // LABEL: focus (~2.40s)
  // Center autofocus target initiates
  // ----------------------------------------------------
  tl.addLabel('focus', 2.4);
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
  // LABEL: shutter & snap (~2.85s)
  // Shutter iris tightens -> CLICK -> WHITE CAMERA FLASH
  // ----------------------------------------------------
  tl.addLabel('shutter', 2.85);
  tl.call(() => {
    if (logoOverlayRef.current) {
      logoOverlayRef.current.setStage('shutter');
    }
  }, undefined, 'shutter');

  tl.addLabel('snap', 2.96);
  tl.call(() => {
    if (logoOverlayRef.current) {
      logoOverlayRef.current.setStage('snap');
    }
  }, undefined, 'snap');

  // Emotional Peak: White Xenon Camera Flash (~3.02s)
  tl.addLabel('flash', 3.02);
  tl.to(flashRef.current, {
    opacity: 1,
    duration: 0.08,
    ease: 'expo.in',
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
  }, 'flash+=0.08');

  tl.to(tilesContainerRef.current, {
    opacity: 0.35,
    duration: 0.4,
    ease: 'power2.out'
  }, 'flash+=0.08');

  // ----------------------------------------------------
  // LABEL: logoLock (~3.15s - 3.85s)
  // Hold the official identity with "Create. Shoot. Grow."
  // ----------------------------------------------------
  tl.addLabel('logoLock', 3.15);

  // ----------------------------------------------------
  // LABEL: expand & exit (~3.85s)
  // Clean, instantaneous dissolve handoff into the Hero
  // ----------------------------------------------------
  tl.addLabel('expand', 3.85);
  tl.call(() => {
    if (logoOverlayRef.current) {
      logoOverlayRef.current.setStage('expand');
    }
    if (tilesRef.current) {
      tilesRef.current.exit();
    }
  }, undefined, 'expand');

  // Clean dissolve of tiles
  tl.to(tilesContainerRef.current, {
    opacity: 0,
    duration: 0.45,
    ease: 'power2.out'
  }, 'expand');

  // Preloader container background dissolves cleanly into hero
  tl.to(containerRef.current, {
    opacity: 0,
    duration: 0.4,
    ease: 'power2.out'
  }, 'expand+=0.15');

  return tl;
}
