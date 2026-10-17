import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface BrandLogoOverlayHandle {
  setStage: (stage: 'hidden' | 'focus' | 'shutter' | 'snap' | 'locked' | 'expand') => void;
  setColorRevealed: (revealed: boolean) => void;
}

interface BrandLogoOverlayProps {
  className?: string;
}

/**
 * BRAND LOGO OVERLAY
 * - Pure hardware-accelerated centerpiece using official vector bounds (/Logo-Official-Tight.svg)
 * - Zero React state updates: direct ref controller running on compositor transforms & opacity
 * - Eliminated expensive multi-pass backdrop-blur-2xl for locked 60 FPS
 * - Editorial Brand Tagline: "CREATE. SHOOT. GROW."
 */
export const BrandLogoOverlay = forwardRef<BrandLogoOverlayHandle, BrandLogoOverlayProps>(({
  className = ''
}, ref) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const logoImgRef = useRef<HTMLImageElement>(null);

  useImperativeHandle(ref, () => ({
    setStage: (stage) => {
      const root = rootRef.current;
      const card = cardRef.current;
      const tagline = taglineRef.current;
      if (!root || !card || !tagline) return;

      if (stage === 'hidden') {
        root.style.opacity = '0';
        card.style.transform = 'scale(0.94)';
        card.style.opacity = '0';
        tagline.style.opacity = '0';
        tagline.style.transform = 'translate3d(0, 8px, 0)';
      } else if (stage === 'focus') {
        root.style.opacity = '1';
        card.style.transform = 'scale(1.0)';
        card.style.opacity = '1';
      } else if (stage === 'shutter') {
        card.style.transform = 'scale(0.98)';
      } else if (stage === 'snap') {
        card.style.transform = 'scale(1.03)';
      } else if (stage === 'locked') {
        root.style.opacity = '1';
        card.style.transform = 'scale(1.0)';
        card.style.opacity = '1';
        tagline.style.opacity = '1';
        tagline.style.transform = 'translate3d(0, 0, 0)';
      } else if (stage === 'expand') {
        root.style.opacity = '0';
        card.style.transform = 'scale(1.06)';
        card.style.opacity = '0';
      }
    },
    setColorRevealed: (revealed) => {
      if (!logoImgRef.current) return;
      if (revealed) {
        logoImgRef.current.style.filter = 'drop-shadow(0 20px 45px rgba(0,0,0,0.95)) brightness(1.1)';
      } else {
        logoImgRef.current.style.filter = 'grayscale(100%) contrast(140%) brightness(1.15)';
      }
    }
  }));

  return (
    <div
      ref={rootRef}
      className={`absolute inset-0 z-40 flex items-center justify-center p-6 select-none pointer-events-none transition-opacity duration-300 will-change-opacity opacity-0 ${className}`}
    >
      <div
        ref={cardRef}
        className="relative flex flex-col items-center justify-center will-change-transform opacity-0"
        style={{
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease-out',
          transform: 'scale(0.94)'
        }}
      >
        {/* LOGO CONTAINER: Crisp obsidian glass with zero expensive backdrop-filter stall */}
        <div className="relative inline-flex items-center justify-center px-6 sm:px-12 py-5 sm:py-8 rounded-lg sm:rounded-xl bg-[#050608]/92 border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.95)]">
          {/* Subtle electric blue ambient aura behind the logo */}
          <div
            className="absolute inset-0 rounded-lg sm:rounded-xl pointer-events-none -z-10"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.16) 0%, rgba(0, 50, 140, 0.04) 60%, transparent 80%)',
            }}
          />

          {/* The Exact Official BrandShoots Vector Letters */}
          <img
            ref={logoImgRef}
            src="/Logo-Official-Tight.svg"
            alt="Brand Shoots"
            className="w-[88vw] max-w-[650px] sm:max-w-[780px] md:max-w-[920px] lg:max-w-[1020px] h-auto object-contain block z-10 transition-none"
            style={{
              filter: 'grayscale(100%) contrast(140%) brightness(1.15)'
            }}
          />
        </div>

        {/* Minimal Editorial Brand Tagline */}
        <div
          ref={taglineRef}
          className="relative z-20 mt-6 sm:mt-8 flex items-center gap-3 sm:gap-4 font-mono text-xs sm:text-base tracking-[0.4em] uppercase font-bold text-white/95 will-change-transform opacity-0"
          style={{
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease-out',
            transform: 'translate3d(0, 8px, 0)'
          }}
        >
          <span>Create.</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span>Shoot.</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span className="text-[#1497F5] font-extrabold shadow-glow-blue">Grow.</span>
        </div>
      </div>
    </div>
  );
});

BrandLogoOverlay.displayName = 'BrandLogoOverlay';
