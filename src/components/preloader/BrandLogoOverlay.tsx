import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { FocusReveal } from './FocusReveal';

interface BrandLogoOverlayProps {
  stage: 'hidden' | 'focus' | 'shutter' | 'snap' | 'locked' | 'expand';
  isColorRevealed: boolean;
  className?: string;
}

/**
 * BRAND LOGO OVERLAY:
 * - Pure unconstrained centerpiece using tight vector bounds (/Logo-Official-Tight.svg)
 * - Clean camera corner brackets hugging outside the logo letters
 * - High performance, always mounted ref container for GSAP synchronization
 */
export const BrandLogoOverlay = forwardRef<HTMLDivElement, BrandLogoOverlayProps>(({
  stage,
  isColorRevealed,
  className = ''
}, ref) => {
  const isVisible = stage !== 'hidden';
  const isLocked = stage === 'locked' || stage === 'snap' || stage === 'shutter';

  return (
    <div
      ref={ref}
      className={`absolute inset-0 z-40 flex items-center justify-center p-6 select-none pointer-events-none transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{
          opacity: stage === 'hidden' ? 0 : stage === 'expand' ? 0 : 1,
          scale: stage === 'expand' ? 1.08 : stage === 'snap' ? 1.03 : 1.0
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center justify-center"
      >
        {/* LOGO CONTAINER WITH EXACT CAMERA VIEWFINDER BRACKETS & FROSTED GLASS BACKDROP BLUR */}
        <div className="relative inline-flex items-center justify-center px-6 sm:px-12 py-5 sm:py-8 rounded-2xl sm:rounded-3xl backdrop-blur-2xl bg-black/60 border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.92)]">
          {/* Subtle electric blue ambient aura behind the logo */}
          <div
            className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none -z-10"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.16) 0%, rgba(0, 50, 140, 0.04) 60%, transparent 80%)',
            }}
          />

          {/* Cinema Camera Frame hugging the outside boundary */}
          <FocusReveal
            isFocusing={stage === 'focus'}
            isLocked={isLocked}
            stage={stage}
          />

          {/* The Exact Official BrandShoots Vector Letters */}
          <img
            src="/Logo-Official-Tight.svg"
            alt="Brand Shoots"
            className={`w-[88vw] max-w-[650px] sm:max-w-[780px] md:max-w-[920px] lg:max-w-[1020px] h-auto object-contain block transition-all duration-500 will-change-transform z-10 ${
              isColorRevealed
                ? 'filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)] brightness-110'
                : 'filter grayscale(100%) contrast(140%) brightness(115%)'
            }`}
          />
        </div>

        {/* Minimal Editorial Brand Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: stage === 'locked' || stage === 'expand' ? 1 : 0,
            y: stage === 'locked' || stage === 'expand' ? 0 : 8
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="relative z-20 mt-6 sm:mt-8 flex items-center gap-3 sm:gap-4 font-mono text-xs sm:text-base tracking-[0.4em] uppercase font-bold text-white/95"
        >
          <span>Create.</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span>Shoot.</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span className="text-[#1497F5] font-extrabold shadow-glow-blue">Grow.</span>
        </motion.div>
      </motion.div>
    </div>
  );
});

BrandLogoOverlay.displayName = 'BrandLogoOverlay';
