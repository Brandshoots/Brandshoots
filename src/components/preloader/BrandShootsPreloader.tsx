import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Multigrade3DTiles } from './Multigrade3DTiles';
import { BrandLogoOverlay } from './BrandLogoOverlay';
import { CameraFlash } from './CameraFlash';
import { PRELOADER_CONFIG } from '../../config/preloaderConfig';
import { createPreloaderTimeline } from '../../animations/preloaderTimeline';

interface BrandShootsPreloaderProps {
  onComplete?: () => void;
  forceReducedMotion?: boolean;
}

/**
 * BRANDSHOOTS CINEMATIC STARTUP PRELOADER
 * Flow: 3D STREAMING REELS (B/W) -> TILES COLLECT -> FOCUS -> SHUTTER SNAP -> WHITE FLASH -> COLOR BLOOM -> OFFICIAL LOGO REVEAL -> EXIT
 * Pure 60 FPS hardware accelerated performance with zero lag.
 */
export const BrandShootsPreloader: React.FC<BrandShootsPreloaderProps> = ({
  onComplete,
  forceReducedMotion = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tilesContainerRef = useRef<HTMLDivElement>(null);
  const logoOverlayRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const backdropHazeRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [isCollecting, setIsCollecting] = useState(false);
  const [logoStage, setLogoStage] = useState<'hidden' | 'focus' | 'shutter' | 'snap' | 'locked' | 'expand'>('hidden');
  const [isColorRevealed, setIsColorRevealed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

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
        setLogoStage('locked');
        setIsColorRevealed(true);
      });
      quickTl.to(containerRef.current, { opacity: 0, duration: 0.6, delay: 0.7 });
      return;
    }

    const ctx = gsap.context(() => {
      timelineRef.current = createPreloaderTimeline(
        {
          containerRef,
          tilesContainerRef,
          logoOverlayRef,
          flashRef,
          backdropHazeRef
        },
        {
          onCollectStateChange: (collecting) => setIsCollecting(collecting),
          onLogoStageChange: (stage) => setLogoStage(stage),
          onColorReveal: (revealed) => setIsColorRevealed(revealed),
          onFocusStateChange: () => {},
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
      ctx.revert();
    };
  }, [forceReducedMotion, handleSequenceComplete, isCompleted]);

  if (isCompleted) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#050608] overflow-hidden select-none"
      style={{
        perspective: '1300px',
        WebkitPerspective: '1300px'
      }}
    >
      {/* Studio Backdrop Atmosphere (Pure Obsidian & Film Grain) */}
      <div
        ref={backdropHazeRef}
        className="pointer-events-none absolute inset-0 opacity-0 z-10"
      >
        <div className="absolute inset-0 bg-[#050608]" />
        <div className="absolute inset-0 cinema-grain opacity-25" />
      </div>

      {/* Multidimensional 3D Scrolling Tiles (100% Videos Playing) */}
      <div
        ref={tilesContainerRef}
        className="absolute inset-0 w-full h-full z-20 transition-opacity duration-700 ease-out will-change-transform"
        style={{
          opacity: isColorRevealed
            ? 0.35
            : logoStage !== 'hidden'
            ? 0.55
            : isCollecting
            ? 0.75
            : 1.0
        }}
      >
        <Multigrade3DTiles
          isCollecting={isCollecting}
          isColorRevealed={isColorRevealed}
          isExiting={logoStage === 'expand'}
        />
      </div>

      {/* CINEMATIC FOCUS ATMOSPHERE WITH DEFOCUS BACKDROP BLUR */}
      <div
        className={`pointer-events-none absolute inset-0 z-25 transition-all duration-700 ease-out will-change-[opacity,backdrop-filter] ${
          isCollecting || logoStage !== 'hidden' || isColorRevealed
            ? 'opacity-100 backdrop-blur-[8px]'
            : 'opacity-0 backdrop-blur-none'
        }`}
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

      {/* Pure Editorial Official BrandShoots Identity with Integrated Cinema Viewfinder */}
      <BrandLogoOverlay
        ref={logoOverlayRef}
        stage={logoStage}
        isColorRevealed={isColorRevealed}
      />

      {/* High-Intensity Xenon Camera Flash */}
      <CameraFlash ref={flashRef} />

      {/* Cinema Letterbox Framing */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-8 md:h-12 bg-gradient-to-b from-black to-transparent z-40 opacity-75" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 md:h-12 bg-gradient-to-t from-black to-transparent z-40 opacity-75" />
    </div>
  );
};
