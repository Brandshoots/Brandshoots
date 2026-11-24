import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { Multigrade3DTiles, Multigrade3DTilesHandle } from './Multigrade3DTiles';
import { BrandLogoOverlay, BrandLogoOverlayHandle } from './BrandLogoOverlay';
import { CameraFlash } from './CameraFlash';
import { PRELOADER_CONFIG } from '../../config/preloaderConfig';
import { createPreloaderTimeline } from '../../animations/preloaderTimeline';

interface BrandShootsPreloaderProps {
  onComplete?: () => void;
  forceReducedMotion?: boolean;
  readyToExit?: boolean;
}

/**
 * BrandShoots CINEMATIC STARTUP PRELOADER
 * Flow:
 * 1. 3D STREAMING REELS (B/W)
 * 2. MULTIGRADE TILES GATHER & DECELERATE (Collect)
 * 3. CAMERA AUTOFOCUS
 * 4. SHUTTER SNAP
 * 5. HIGH-INTENSITY WHITE XENON FLASH
 * 6. COLOR REVEAL BLOOM
 * 7. OFFICIAL BrandShoots LOGO + "CREATE. SHOOT. GROW."
 * 8. SMOOTH BUTTER DISSOLVE INTO HOMEPAGE HERO
 */
export const BrandShootsPreloader: React.FC<BrandShootsPreloaderProps> = ({
  onComplete,
  forceReducedMotion = false,
  readyToExit = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tilesContainerRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<Multigrade3DTilesHandle | null>(null);
  const logoOverlayRef = useRef<BrandLogoOverlayHandle | null>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const backdropHazeRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasCompletedRef = useRef(false);
  const waitingForReadinessRef = useRef(false);
  const readyToExitRef = useRef(readyToExit);
  const onCompleteRef = useRef(onComplete);
  readyToExitRef.current = readyToExit;
  onCompleteRef.current = onComplete;

  const resumeExit = useCallback(() => {
    if (!waitingForReadinessRef.current || !timelineRef.current) return;
    waitingForReadinessRef.current = false;
    timelineRef.current.play();
  }, []);

  const handleSequenceComplete = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    timelineRef.current?.kill();
    timelineRef.current = null;
    onCompleteRef.current?.();
  }, []);

  useEffect(() => {
    if (readyToExit) resumeExit();
  }, [readyToExit, resumeExit]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReduced = mediaQuery.matches || forceReducedMotion;
    let context: gsap.Context | undefined;

    const safetyTimer = window.setTimeout(() => {
      readyToExitRef.current = true;
      resumeExit();
    }, PRELOADER_CONFIG.safetyTimeoutMs);

    try {
      if (prefersReduced) {
        context = gsap.context(() => {
          const quickTimeline = gsap.timeline({
            paused: true,
            onComplete: handleSequenceComplete,
          });
          timelineRef.current = quickTimeline;
          quickTimeline.set(containerRef.current, { opacity: 1 });
          quickTimeline.call(() => {
            logoOverlayRef.current?.setStage('locked');
            logoOverlayRef.current?.setColorRevealed(true);
          });
          quickTimeline.to({}, { duration: 0.35 });
          quickTimeline.addPause('ready', () => {
            waitingForReadinessRef.current = true;
            if (readyToExitRef.current) window.requestAnimationFrame(resumeExit);
          });
          quickTimeline.to(containerRef.current, { opacity: 0, duration: 0.2, ease: 'power1.out' }, 'ready+=0.001');
          quickTimeline.play();
        }, containerRef);
      } else {
        context = gsap.context(() => {
          timelineRef.current = createPreloaderTimeline(
            {
              containerRef,
              tilesContainerRef,
              tilesRef,
              logoOverlayRef,
              atmosphereRef,
              flashRef,
              backdropHazeRef,
            },
            {
              onComplete: handleSequenceComplete,
              onHoldForReadiness: () => {
                waitingForReadinessRef.current = true;
                if (readyToExitRef.current) window.requestAnimationFrame(resumeExit);
              },
            }
          );
          timelineRef.current.play();
        }, containerRef);
      }
    } catch (error) {
      console.error('BrandShoots preloader setup failed', error);
      handleSequenceComplete();
    }

    return () => {
      window.clearTimeout(safetyTimer);
      waitingForReadinessRef.current = false;
      timelineRef.current?.kill();
      timelineRef.current = null;
      context?.revert();
    };
  }, [forceReducedMotion, handleSequenceComplete, resumeExit]);

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Loading BrandShoots homepage"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#050608] overflow-hidden select-none will-change-opacity"
      style={{
        perspective: '1300px',
        WebkitPerspective: '1300px',
      }}
    >
      {/* Studio Backdrop Atmosphere (Pure Obsidian & Film Grain) */}
      <div
        ref={backdropHazeRef}
        className="pointer-events-none absolute inset-0 opacity-0 z-10 will-change-opacity"
      >
        <div className="absolute inset-0 bg-[#050608]" />
        <div className="absolute inset-0 cinema-grain opacity-25" />
      </div>

      {/* Multidimensional 3D Streaming Tiles */}
      <div
        ref={tilesContainerRef}
        className="absolute inset-0 w-full h-full z-20 will-change-transform will-change-opacity opacity-0"
      >
        <Multigrade3DTiles ref={tilesRef} />
      </div>

      {/* Cinematic Focus Atmosphere with Obsidian Radial Falloff */}
      <div
        ref={atmosphereRef}
        className="pointer-events-none absolute inset-0 z-25 opacity-0 will-change-opacity"
      >
        {/* Soft Vignette Mask */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 90% at 50% 50%, rgba(5, 6, 8, 0.45) 0%, rgba(5, 6, 8, 0.82) 55%, #050608 100%)',
          }}
        />

        {/* Brand Electric Atmosphere */}
        <div
          className="absolute inset-0 opacity-45 mix-blend-screen"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(20, 151, 245, 0.25) 0%, rgba(7, 11, 51, 0.45) 50%, transparent 80%)',
          }}
        />

        {/* Subtle Conic Swirl for Cinematic Depth */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-screen"
          style={{
            background:
              'conic-gradient(from 135deg at 50% 50%, rgba(20, 151, 245, 0.2) 0deg, transparent 90deg, rgba(20, 151, 245, 0.25) 180deg, transparent 270deg, rgba(20, 151, 245, 0.2) 360deg)',
          }}
        />

        {/* Film grain layer over atmospheric swirl */}
        <div className="absolute inset-0 cinema-grain opacity-20" />
      </div>

      {/* Pure Editorial Official BrandShoots Identity */}
      <BrandLogoOverlay ref={logoOverlayRef} />

      {/* High-Intensity Xenon Camera Flash */}
      <CameraFlash ref={flashRef} />

      {/* Cinema Letterbox Framing */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-8 md:h-12 bg-gradient-to-b from-black to-transparent z-40 opacity-75" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 md:h-12 bg-gradient-to-t from-black to-transparent z-40 opacity-75" />
    </div>
  );
};

export default BrandShootsPreloader;
