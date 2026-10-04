import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Multigrade3DTiles } from './Multigrade3DTiles';
import { BrandLogoOverlay } from './BrandLogoOverlay';
import { FocusReveal } from './FocusReveal';
import { CameraFlash } from './CameraFlash';
import { PRELOADER_CONFIG } from '../../config/preloaderConfig';
import { createPreloaderTimeline } from '../../animations/preloaderTimeline';

interface BrandShootsPreloaderProps {
  onComplete?: () => void;
  forceReducedMotion?: boolean;
}

/**
 * BRANDSHOOTS CINEMATIC PRELOADER (PHASE 1)
 * Multidimensional 3D Scrolling Tiles (Camille Mormal Spatial Reference).
 * Flow: 3D STREAMING TILES -> TILES COLLECT -> FOCUS -> SHUTTER SNAP -> WHITE FLASH -> BRAND REVEAL -> EXPAND HERO
 * Pure visual art direction — zero badges, zero eyebrows, zero AI text labels.
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
  const [isFocusing, setIsFocusing] = useState(false);
  const [isFocusLocked, setIsFocusLocked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Mouse coordinate tracker for desktop cursor
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const handleSequenceComplete = useCallback(() => {
    setIsCompleted(true);
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    const checkTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(checkTouch);

    if (checkTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
          onFocusStateChange: (focusing, locked) => {
            setIsFocusing(focusing);
            setIsFocusLocked(locked);
          },
          onComplete: handleSequenceComplete
        }
      );

      timelineRef.current.play();
    });

    // Hard Safety Timeout Failsafe
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050608] overflow-hidden select-none cursor-default"
      style={{
        perspective: '1200px',
        WebkitPerspective: '1200px'
      }}
    >
      {/* Deep Space Studio Haze */}
      <div
        ref={backdropHazeRef}
        className="pointer-events-none absolute inset-0 opacity-0 z-10"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-brand-navy/70 rounded-full blur-[200px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand-blue/20 rounded-full blur-[150px]" />
        <div className="absolute inset-0 cinema-grain opacity-20" />
      </div>

      {/* Multidimensional 3D Scrolling Tiles */}
      <div ref={tilesContainerRef} className="absolute inset-0 w-full h-full z-20">
        <Multigrade3DTiles
          isCollecting={isCollecting}
          isColorRevealed={isColorRevealed}
        />
      </div>

      {/* Optical Viewfinder Target Brackets */}
      <FocusReveal isFocusing={isFocusing} isLocked={isFocusLocked} />

      {/* Pure Editorial BrandShoots Identity */}
      <BrandLogoOverlay
        ref={logoOverlayRef}
        stage={logoStage}
        isColorRevealed={isColorRevealed}
      />

      {/* High-Intensity White Camera Flash */}
      <CameraFlash ref={flashRef} />

      {/* Cinema Letterbox Mask */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 md:h-14 bg-gradient-to-b from-black to-transparent z-40 opacity-80" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 md:h-14 bg-gradient-to-t from-black to-transparent z-40 opacity-80" />

      {/* Minimal Desktop Precision Cursor */}
      {!isTouchDevice && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-50 w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50 mix-blend-difference flex items-center justify-center transition-transform duration-75"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>
      )}
    </div>
  );
};
