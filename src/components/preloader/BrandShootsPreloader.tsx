import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Multigrade3DTiles, Multigrade3DTilesHandle } from './Multigrade3DTiles';
import { BrandLogoOverlay, BrandLogoOverlayHandle } from './BrandLogoOverlay';
import { CameraFlash } from './CameraFlash';
import { PRELOADER_CONFIG } from '../../config/preloaderConfig';
import { createPreloaderTimeline } from '../../animations/preloaderTimeline';
import { preloadAllHeroReels } from '../../config/heroReels';

interface BrandShootsPreloaderProps {
  onComplete?: () => void;
  forceReducedMotion?: boolean;
}

/**
 * BRANDSHOOTS CINEMATIC STARTUP PRELOADER
 * Flow: 3D STREAMING REELS (B/W) -> TILES COLLECT -> FOCUS -> SHUTTER SNAP -> WHITE FLASH -> COLOR BLOOM -> OFFICIAL LOGO REVEAL -> EXIT
 * Pure 60 FPS hardware accelerated performance with zero lag and zero React re-renders during playback.
 */
export const BrandShootsPreloader: React.FC<BrandShootsPreloaderProps> = ({
  onComplete,
  forceReducedMotion = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tilesContainerRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<Multigrade3DTilesHandle | null>(null);
  const logoOverlayRef = useRef<BrandLogoOverlayHandle | null>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const backdropHazeRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [isCompleted, setIsCompleted] = useState(false);

  // Warm up hero assets and official logo in memory during preloader
  useEffect(() => {
    preloadAllHeroReels();
    const logoImg = new Image();
    logoImg.src = '/Logo-Official-Tight.svg';
  }, []);

  const handleSequenceComplete = useCallback(() => {
    setIsCompleted(true);
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReduced = mediaQuery.matches || forceReducedMotion;

    if (prefersReduced) {
      const quickTl = gsap.timeline({ onComplete: handleSequenceComplete });
      quickTl.to(containerRef.current, { opacity: 1, duration: 0.1 });
      quickTl.call(() => {
        if (logoOverlayRef.current) {
          logoOverlayRef.current.setStage('locked');
          logoOverlayRef.current.setColorRevealed(true);
        }
      });
      quickTl.to(containerRef.current, { opacity: 0, duration: 0.5, delay: 0.6 });
      return;
    }

    const ctx = gsap.context(() => {
      timelineRef.current = createPreloaderTimeline(
        {
          containerRef,
          tilesContainerRef,
          tilesRef,
          logoOverlayRef,
          atmosphereRef,
          flashRef,
          backdropHazeRef
        },
        {
          onComplete: handleSequenceComplete
        }
      );

      timelineRef.current.play();
    });

    // Safety timeout failsafe
    const safetyTimer = setTimeout(() => {
      if (!isCompleted) {
        handleSequenceComplete();
      }
    }, PRELOADER_CONFIG.safetyTimeoutMs);

    return () => {
      clearTimeout(safetyTimer);
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      ctx.revert();
    };
  }, [forceReducedMotion, handleSequenceComplete, isCompleted]);

  if (isCompleted) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#050608] overflow-hidden select-none will-change-opacity"
      style={{
        perspective: '1300px',
        WebkitPerspective: '1300px'
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

      {/* CINEMATIC FOCUS ATMOSPHERE WITH OBSIDIAN RADIAL FALLOFF */}
      <div
        ref={atmosphereRef}
        className="pointer-events-none absolute inset-0 z-25 opacity-0 will-change-opacity"
      >
        {/* Soft Vignette Mask */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 90% 90% at 50% 50%, rgba(5, 6, 8, 0.45) 0%, rgba(5, 6, 8, 0.82) 55%, #050608 100%)'
          }}
        />

        {/* Brand Electric Atmosphere */}
        <div
          className="absolute inset-0 opacity-45 mix-blend-screen"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(20, 151, 245, 0.25) 0%, rgba(7, 11, 51, 0.45) 50%, transparent 80%)'
          }}
        />

        {/* Subtle Conic Swirl for Cinematic Depth */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-screen"
          style={{
            background: 'conic-gradient(from 135deg at 50% 50%, rgba(20, 151, 245, 0.2) 0deg, transparent 90deg, rgba(20, 151, 245, 0.25) 180deg, transparent 270deg, rgba(20, 151, 245, 0.2) 360deg)'
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
