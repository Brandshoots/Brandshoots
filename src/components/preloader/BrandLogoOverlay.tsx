import { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BrandLogoOverlayProps {
  stage: 'hidden' | 'focus' | 'shutter' | 'snap' | 'locked' | 'expand';
  isColorRevealed: boolean;
  className?: string;
}

/**
 * BrandLogoOverlay:
 * Pure luxury editorial identity reveal.
 * ZERO badges, ZERO eyebrows, ZERO decorative AI labels.
 * Pure official BrandShoots logo with optical shutter action, white flash,
 * and the Electric Brand Blue (#1497F5) reveal.
 */
export const BrandLogoOverlay = forwardRef<HTMLDivElement, BrandLogoOverlayProps>(({
  stage,
  isColorRevealed,
  className = ''
}, ref) => {
  if (stage === 'hidden') return null;

  return (
    <div
      ref={ref}
      className={`absolute inset-0 z-40 flex flex-col items-center justify-center p-6 select-none pointer-events-none ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{
          opacity: stage === 'expand' ? 0 : 1,
          scale: stage === 'expand' ? 1.5 : 1
        }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center justify-center max-w-md md:max-w-xl w-full"
      >
        {/* Soft Ambient Lens Glow behind Logo */}
        <div
          className={`absolute w-96 h-48 rounded-full blur-[110px] transition-all duration-700 pointer-events-none ${
            isColorRevealed
              ? 'bg-brand-blue/40 scale-120 opacity-100'
              : 'bg-white/10 scale-90 opacity-30'
          }`}
        />

        {/* Minimal Optical Shutter Iris (Subtle mechanical contraction) */}
        <AnimatePresence>
          {(stage === 'shutter' || stage === 'snap') && (
            <motion.div
              initial={{ scale: 2.2, opacity: 0, rotate: 0 }}
              animate={{ scale: 0.88, opacity: 0.9, rotate: 45 }}
              exit={{ scale: 2.6, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute w-60 h-60 rounded-full border-[6px] border-white/40 bg-black/70 backdrop-blur-md shutter-clip-hexagon shadow-2xl flex items-center justify-center"
            >
              <div className="w-20 h-20 rounded-full border border-brand-blue/80" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Exact Official BrandShoots Identity */}
        <img
          src="/Logo.png"
          alt="Brand Shoots"
          className={`relative w-full h-auto max-h-24 sm:max-h-28 md:max-h-36 object-contain transition-all duration-500 will-change-transform ${
            isColorRevealed
              ? 'filter drop-shadow-[0_0_35px_rgba(20,151,245,0.65)] brightness-110'
              : 'filter grayscale(100%) contrast(150%) brightness(120%)'
          }`}
          style={{
            transform: stage === 'snap' ? 'scale(1.06)' : 'scale(1.0)',
            transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        />

        {/* Pure Luxury Brand Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{
            opacity: stage === 'locked' || stage === 'expand' ? 1 : 0,
            y: stage === 'locked' || stage === 'expand' ? 0 : 14
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mt-6 flex items-center gap-3 font-sans text-xs sm:text-sm md:text-base tracking-[0.32em] uppercase font-semibold text-white/95"
        >
          <span>Create.</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue/80" />
          <span>Shoot.</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue/80" />
          <span className="text-brand-blue font-bold drop-shadow-[0_0_12px_rgba(20,151,245,0.7)]">Grow.</span>
        </motion.div>
      </motion.div>
    </div>
  );
});

BrandLogoOverlay.displayName = 'BrandLogoOverlay';
