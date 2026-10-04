import { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BrandLogoOverlayProps {
  stage: 'hidden' | 'focus' | 'shutter' | 'snap' | 'locked' | 'expand';
  isColorRevealed: boolean;
  className?: string;
}

/**
 * BrandLogoOverlay:
 * High-fashion editorial stage centered over the converging 3D multigrade tiles.
 * Displays the exact official BrandShoots logo asset with camera shutter action,
 * tactile autofocus lock, and the Electric Brand Blue (#1497F5) reveal.
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
      {/* Central Viewfinder Glass Backing for Pristine Logo Contrast */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: stage === 'expand' ? 0 : 1,
          scale: stage === 'expand' ? 1.4 : 1
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center justify-center px-8 md:px-16 py-8 md:py-12 rounded-3xl bg-black/75 backdrop-blur-xl border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.95)] max-w-lg md:max-w-xl w-full"
      >
        {/* Viewfinder Corner Framing Guides */}
        <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/40" />
        <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/40" />
        <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/40" />
        <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/40" />

        {/* Ambient Brand Blue Bloom Glow */}
        <div
          className={`absolute inset-0 rounded-3xl blur-3xl transition-all duration-700 pointer-events-none ${
            isColorRevealed
              ? 'bg-brand-blue/30 scale-105 opacity-100'
              : 'bg-white/5 scale-90 opacity-40'
          }`}
        />

        {/* Shutter Iris Blades Animation */}
        <AnimatePresence>
          {(stage === 'shutter' || stage === 'snap') && (
            <motion.div
              initial={{ scale: 2.2, opacity: 0, rotate: 0 }}
              animate={{ scale: 0.9, opacity: 0.95, rotate: 45 }}
              exit={{ scale: 2.5, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute w-56 h-56 rounded-full border-[10px] border-white/30 bg-black/80 backdrop-blur-md shutter-clip-hexagon shadow-2xl flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full border-2 border-brand-blue" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Minimal Viewfinder Metadata */}
        <div className="w-full flex items-center justify-between text-[10px] font-mono tracking-widest text-white/50 mb-4 uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white font-semibold">RECORDING 4K</span>
          </div>
          <span className="text-brand-blue font-medium">35MM T1.5</span>
        </div>

        {/* Official BrandShoots Logo Asset */}
        <img
          src="/Logo.png"
          alt="Brand Shoots"
          className={`relative w-full h-auto max-h-24 md:max-h-32 object-contain transition-all duration-500 will-change-transform ${
            isColorRevealed
              ? 'filter drop-shadow-[0_0_35px_rgba(20,151,245,0.6)] brightness-110'
              : 'filter grayscale(100%) contrast(150%) brightness(120%)'
          }`}
          style={{
            transform: stage === 'snap' ? 'scale(1.05)' : 'scale(1.0)',
            transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        />

        {/* Official Brand Tagline: "Create. Shoot. Grow." */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{
            opacity: stage === 'locked' || stage === 'expand' ? 1 : 0,
            y: stage === 'locked' || stage === 'expand' ? 0 : 12
          }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="mt-6 flex items-center gap-3 font-sans text-xs md:text-sm tracking-[0.3em] uppercase font-semibold text-white/95"
        >
          <span>Create.</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue/80" />
          <span>Shoot.</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue/80" />
          <span className="text-brand-blue font-bold drop-shadow-[0_0_12px_rgba(20,151,245,0.8)]">Grow.</span>
        </motion.div>

        {/* Agency Classification */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{
            opacity: stage === 'locked' || stage === 'expand' ? 0.75 : 0
          }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="mt-3 text-[10px] md:text-[11px] font-mono tracking-widest text-[#B9BEC9] uppercase"
        >
          Creative Branding & Content Production Studio
        </motion.p>
      </motion.div>
    </div>
  );
});

BrandLogoOverlay.displayName = 'BrandLogoOverlay';
