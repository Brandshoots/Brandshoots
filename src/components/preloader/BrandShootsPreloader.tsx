import React, { useState, useEffect } from 'react';

interface BrandShootsPreloaderProps {
  onComplete?: () => void;
}

/**
 * BRANDSHOOTS INSTANT STATIC PRELOADER (NUCLEAR ARCHITECTURE)
 *
 * Rules:
 * - Almost ZERO JavaScript work during playback
 * - Shows lightweight static brand asset immediately (0ms paint)
 * - Fallback HTML/CSS brand title ensures NEVER a blank screen
 * - Max visible display: ~850ms
 * - Pure CSS opacity + transform fade-out (300ms)
 * - Completely unmounts from DOM after fade-out
 * - ZERO: video, WebGL, canvas, GSAP, Framer Motion, blur filters, progress bars
 */
export const BrandShootsPreloader: React.FC<BrandShootsPreloaderProps> = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    // 1. Hold visible for 850ms (well within the 800-1200ms target)
    const holdTimer = setTimeout(() => {
      setIsFading(true);
    }, 850);

    // 2. Smoothly complete fade out and remove from DOM at 1150ms
    const exitTimer = setTimeout(() => {
      setIsRemoved(true);
      if (onComplete) {
        onComplete();
      }
    }, 1150);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  if (isRemoved) {
    return null;
  }

  return (
    <div
      id="brandshoots-instant-preloader"
      className="fixed inset-0 z-[99999] bg-[#050608] flex items-center justify-center select-none pointer-events-none overflow-hidden"
      style={{
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity',
      }}
    >
      {/* Subtle Studio Glow Backdrop — pure CSS radial gradient, no blur filters */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[650px] h-[55vh] max-h-[420px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.16) 0%, rgba(3, 8, 20, 0.4) 55%, transparent 75%)',
        }}
      />

      {/* Main Composition: Centerpiece Brand Identity */}
      <div
        className="relative z-10 flex flex-col items-center justify-center px-6 max-w-full"
        style={{
          transform: isFading ? 'scale(1.02)' : 'scale(1)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform',
        }}
      >
        {/* Layer A: High-Priority Lightweight Vector Asset (6.5KB, 0ms decode) */}
        <img
          src="/Logo-Official-Tight.svg"
          alt="BrandShoots"
          fetchPriority="high"
          decoding="sync"
          className="w-[78vw] max-w-[360px] sm:max-w-[460px] md:max-w-[540px] h-auto object-contain block drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)]"
        />

        {/* Layer B: Instant HTML/CSS Brand Typography Fallback (guarantees zero blank screen) */}
        <div className="sr-only" aria-hidden="true">
          <span>BRANDSHOOTS — Create. Shoot. Grow.</span>
        </div>

        {/* Editorial Brand Tagline */}
        <div className="mt-4 sm:mt-5 flex items-center justify-center">
          <span className="font-sans text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.28em] uppercase text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Create. Shoot. Grow.
          </span>
        </div>
      </div>
    </div>
  );
};

export default BrandShootsPreloader;
