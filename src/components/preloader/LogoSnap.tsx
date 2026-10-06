import { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogoSnapProps {
  stage: 'hidden' | 'focus' | 'shutter' | 'snap' | 'locked' | 'expand';
  isColorRevealed: boolean;
  className?: string;
}

/**
 * LogoSnap:
 * Orchestrates the photographic snap event for the official Brand Shoots identity.
 * Shutter blades contract -> CLICK -> White flash -> Aperture expands ->
 * Official logo locks into place while Electric Brand Blue (#1497F5) blooms from monochrome.
 */
export const LogoSnap = forwardRef<HTMLDivElement, LogoSnapProps>(({
  stage,
  isColorRevealed,
  className = ''
}, ref) => {
  if (stage === 'hidden') return null;

  return (
    <div
      ref={ref}
      className={`absolute inset-0 z-40 flex flex-col items-center justify-center p-6 select-none ${className}`}
    >
      {/* Aperture Iris Blades Simulation during shutter action */}
      <AnimatePresence>
        {(stage === 'shutter' || stage === 'snap') && (
          <motion.div
            initial={{ scale: 1.8, opacity: 0, rotate: 0 }}
            animate={{ scale: 0.85, opacity: 0.9, rotate: 45 }}
            exit={{ scale: 2.2, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute w-56 h-56 rounded-full border-[10px] border-white/20 bg-black/60 backdrop-blur-md shutter-clip-hexagon shadow-2xl flex items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full border-2 border-brand-blue/50" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Official BrandShoots Logo Container */}
      <div className="relative flex flex-col items-center justify-center max-w-xs md:max-w-md w-full">
        {/* Subtle lens flare behind logo */}
        <div
          className={`absolute w-72 h-36 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
            isColorRevealed
              ? 'bg-brand-blue/30 scale-105 opacity-100'
              : 'bg-white/10 scale-90 opacity-40'
          }`}
        />

        {/* The Exact Official Logo Asset */}
        <img
          src="/Logo Official.svg"
          alt="Brand Shoots"
          className={`relative w-full h-auto max-h-24 md:max-h-28 object-contain transition-all duration-500 will-change-transform ${
            isColorRevealed
              ? 'filter drop-shadow-[0_0_24px_rgba(20,151,245,0.45)]'
              : 'filter grayscale(100%) contrast(150%) brightness(120%)'
          }`}
          style={{
            transform: stage === 'snap' ? 'scale(1.04)' : 'scale(1.0)',
            transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        />

        {/* Refined Brand Tagline: "Create. Shoot. Grow." */}
        <div className="mt-4 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: stage === 'locked' || stage === 'expand' ? 1 : 0,
              y: stage === 'locked' || stage === 'expand' ? 0 : 10
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="flex items-center gap-2.5 font-sans text-xs md:text-sm tracking-[0.28em] uppercase font-medium text-white/90"
          >
            <span>Create.</span>
            <span className="w-1 h-1 rounded-full bg-brand-blue/80" />
            <span>Shoot.</span>
            <span className="w-1 h-1 rounded-full bg-brand-blue/80" />
            <span className="text-brand-blue font-semibold">Grow.</span>
          </motion.div>
        </div>

        {/* Subtitle / Positioning micro-badge */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{
            opacity: stage === 'locked' || stage === 'expand' ? 0.65 : 0
          }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-2 text-[10px] md:text-[11px] font-mono tracking-widest text-[#B9BEC9] uppercase"
        >
          Creative Branding & Content Production
        </motion.p>
      </div>
    </div>
  );
});

LogoSnap.displayName = 'LogoSnap';
