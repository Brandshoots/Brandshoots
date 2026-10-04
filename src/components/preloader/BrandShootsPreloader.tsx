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
 * Multi-Column 3D Multigrade Scrolling Tiles (Camille Mormal Reference).
 * Flow: 3D STREAMING TILES -> TILES COLLECT -> FOCUS -> SHUTTER SNAP -> WHITE FLASH -> BRAND REVEAL -> EXPAND HERO
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
        console.warn('Preloader safety failsafe triggered.');
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#07080B] overflow-hidden select-none cursor-default"
      style={{
        perspective: '1400px',
        WebkitPerspective: '1400px'
      }}
    >
      {/* Deep Void Ambient Haze */}
      <div
        ref={backdropHazeRef}
        className="pointer-events-none absolute inset-0 opacity-0 z-10"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[700px] bg-brand-navy/60 rounded-full blur-[180px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-blue/15 rounded-full blur-[140px]" />
        <div className="absolute inset-0 cinema-grain opacity-25" />
      </div>

      {/* 3D Multigrade Scrolling Tiles Field */}
      <div ref={tilesContainerRef} className="absolute inset-0 w-full h-full z-20">
        <Multigrade3DTiles
          isCollecting={isCollecting}
          isColorRevealed={isColorRevealed}
        />
      </div>

      {/* Center Autofocus Reticle Guide */}
      <FocusReveal isFocusing={isFocusing} isLocked={isFocusLocked} />

      {/* Editorial Official BrandShoots Logo Overlay */}
      <BrandLogoOverlay
        ref={logoOverlayRef}
        stage={logoStage}
        isColorRevealed={isColorRevealed}
      />

      {/* High-Intensity Camera Exposure Flash */}
      <CameraFlash ref={flashRef} />

      {/* Letterbox Mask */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-12 md:h-16 bg-gradient-to-b from-black to-transparent z-40 opacity-80" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 md:h-16 bg-gradient-to-t from-black to-transparent z-40 opacity-80" />

      {/* Subtle Desktop Crosshair Cursor */}
      {!isTouchDevice && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-50 w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 mix-blend-difference flex items-center justify-center transition-transform duration-75"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white/90" />
        </div>
      )}

      {/* Discreet Bottom Status Readout */}
      <div className="pointer-events-none absolute bottom-4 left-6 right-6 z-40 flex items-center justify-between text-[10px] font-mono tracking-widest text-white/40 uppercase">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          <span>BRANDSHOOTS MULTIGRADE 3D LAB</span>
        </div>
        <span>ACT I — CONTACT SHEET CONVERGENCE</span>
      </div>
    </div>
  );
};
