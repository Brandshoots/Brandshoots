import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { DeviceFrame } from './DeviceFrame';
import { PRELOADER_CONFIG } from '../../config/preloaderConfig';
import { createPreloaderTimeline } from '../../animations/preloaderTimeline';

interface BrandShootsPreloaderProps {
  onComplete?: () => void;
  forceReducedMotion?: boolean;
}

/**
 * BRANDSHOOTS CINEMATIC PRELOADER (PHASE 1)
 * The Opening Film of the Brand Shoots digital flagship experience.
 * Sequence: MEMORIES -> FRAMES -> CAMERA -> FOCUS -> SNAP -> BRAND -> ENTER WEBSITE
 */
export const BrandShootsPreloader: React.FC<BrandShootsPreloaderProps> = ({
  onComplete,
  forceReducedMotion = false
}) => {
  // Master DOM References for GSAP timeline
  const containerRef = useRef<HTMLDivElement>(null);
  const deviceContainerRef = useRef<HTMLDivElement>(null);
  const deviceOuterRef = useRef<HTMLDivElement>(null);
  const screenInnerRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const backdropHazeRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Reactive state controlled via GSAP callbacks
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [logoStage, setLogoStage] = useState<'hidden' | 'focus' | 'shutter' | 'snap' | 'locked' | 'expand'>('hidden');
  const [isColorRevealed, setIsColorRevealed] = useState(false);
  const [isFocusing, setIsFocusing] = useState(false);
  const [isFocusLocked, setIsFocusLocked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Custom Subtle Cursor coordinates
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const handleSequenceComplete = useCallback(() => {
    setIsCompleted(true);
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  // Subtle Mouse Parallax & Custom Cursor Handling
  useEffect(() => {
    const checkTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(checkTouch);

    if (checkTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Subtle real-world tilt based on mouse position
      if (deviceContainerRef.current && logoStage !== 'expand') {
        const normX = (e.clientX / window.innerWidth - 0.5) * 2;
        const normY = (e.clientY / window.innerHeight - 0.5) * 2;

        gsap.to(deviceContainerRef.current, {
          rotateY: normX * PRELOADER_CONFIG.deviceRotation.maxTiltY,
          rotateX: -normY * PRELOADER_CONFIG.deviceRotation.maxTiltX,
          duration: 0.8,
          ease: 'power2.out'
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [logoStage]);

  // Master GSAP Timeline Execution & Failsafe Guard
  useEffect(() => {
    // Check Reduced Motion Preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReduced = mediaQuery.matches || forceReducedMotion;

    if (prefersReduced) {
      // Rapid accessible transition: 500ms logo reveal then exit
      const quickTl = gsap.timeline({ onComplete: handleSequenceComplete });
      quickTl.to(containerRef.current, { opacity: 1, duration: 0.1 });
      quickTl.call(() => {
        setLogoStage('locked');
        setIsColorRevealed(true);
      });
      quickTl.to(containerRef.current, { opacity: 0, duration: 0.6, delay: 0.7 });
      return;
    }

    // Initialize GSAP Timeline Context
    const ctx = gsap.context(() => {
      timelineRef.current = createPreloaderTimeline(
        {
          containerRef,
          deviceContainerRef,
          deviceOuterRef,
          screenInnerRef,
          flashRef,
          backdropHazeRef
        },
        {
          onReelChange: (index) => setActiveReelIndex(index),
          onLogoStageChange: (stage) => setLogoStage(stage),
          onColorReveal: (revealed) => setIsColorRevealed(revealed),
          onFocusStateChange: (focusing, locked) => {
            setIsFocusing(focusing);
            setIsFocusLocked(locked);
          },
          onComplete: handleSequenceComplete
        }
      );

      // Trigger playback
      timelineRef.current.play();
    });

    // Hard Safety Timeout Failsafe (Section 31: NEVER trap visitor)
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#08090C] overflow-hidden select-none cursor-default"
      style={{
        perspective: '1200px',
        WebkitPerspective: '1200px'
      }}
    >
      {/* Deep Void Ambient Haze */}
      <div
        ref={backdropHazeRef}
        className="pointer-events-none absolute inset-0 opacity-0"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-brand-navy/60 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-brand-blue/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 cinema-grain opacity-35" />
      </div>

      {/* Cinematic Studio Letterbox Mask */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 md:h-14 bg-gradient-to-b from-black to-transparent z-40 opacity-80" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 md:h-14 bg-gradient-to-t from-black to-transparent z-40 opacity-80" />

      {/* Center Device Stage (Slightly above midpoint per Section 04) */}
      <div
        ref={deviceContainerRef}
        className="relative z-30 transform -translate-y-3 md:-translate-y-5"
      >
        <DeviceFrame
          activeReelIndex={activeReelIndex}
          logoStage={logoStage}
          isColorRevealed={isColorRevealed}
          isFocusing={isFocusing}
          isFocusLocked={isFocusLocked}
          flashRef={flashRef}
          screenInnerRef={screenInnerRef}
          deviceOuterRef={deviceOuterRef}
        />
      </div>

      {/* Minimal Desktop Precision Cursor (Section 34) */}
      {!isTouchDevice && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-50 w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 mix-blend-difference flex items-center justify-center transition-transform duration-75"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`
          }}
        >
          <div className="w-1 h-1 rounded-full bg-white/80" />
        </div>
      )}

      {/* Bottom Subtle Status Indicator (Discreet Production Footnote) */}
      <div className="pointer-events-none absolute bottom-4 left-6 right-6 flex items-center justify-between text-[10px] font-mono tracking-widest text-white/40 uppercase">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue/80 animate-ping" />
          <span>BRANDSHOOTS FILM LAB</span>
        </div>
        <span>ACT I — REEL MONTAGES</span>
      </div>
    </div>
  );
};
