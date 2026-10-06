import React from 'react';

interface FocusRevealProps {
  isFocusing?: boolean;
  isLocked?: boolean;
  stage?: 'hidden' | 'focus' | 'shutter' | 'snap' | 'locked' | 'expand';
  className?: string;
}

/**
 * CINEMA VIEWFINDER CAMERA FRAME:
 * - Pure, minimal corner L-brackets precisely framing outside the BRANDSHOOTS logo letters
 * - Zero artificial text or clutter
 * - Dynamic autofocus pulse into crisp electric brand-blue lock
 */
export const FocusReveal: React.FC<FocusRevealProps> = ({
  isFocusing = false,
  isLocked = false,
  stage = 'focus',
  className = ''
}) => {
  const activeLocked = isLocked || stage === 'locked' || stage === 'snap' || stage === 'shutter';
  const isVisible = isFocusing || isLocked || (stage && stage !== 'hidden' && stage !== 'expand');

  if (!isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-30 transition-all duration-300 ${className}`}
    >
      {/* ================= CORNER BRACKETS ================= */}
      {/* Top-Left Bracket (Frames outside 'B') */}
      <span
        className={`absolute -top-2 -left-2 w-7 sm:w-10 md:w-12 h-7 sm:h-10 md:h-12 border-t-[2.5px] border-l-[2.5px] transition-all duration-300 ${
          activeLocked
            ? 'border-[#1497F5] drop-shadow-[0_0_14px_rgba(20,151,245,0.95)] scale-100'
            : 'border-white/80 animate-pulse scale-105'
        }`}
      />

      {/* Top-Right Bracket (Frames outside 'S') */}
      <span
        className={`absolute -top-2 -right-2 w-7 sm:w-10 md:w-12 h-7 sm:h-10 md:h-12 border-t-[2.5px] border-r-[2.5px] transition-all duration-300 ${
          activeLocked
            ? 'border-[#1497F5] drop-shadow-[0_0_14px_rgba(20,151,245,0.95)] scale-100'
            : 'border-white/80 animate-pulse scale-105'
        }`}
      />

      {/* Bottom-Left Bracket (Frames outside 'B') */}
      <span
        className={`absolute -bottom-2 -left-2 w-7 sm:w-10 md:w-12 h-7 sm:h-10 md:h-12 border-b-[2.5px] border-l-[2.5px] transition-all duration-300 ${
          activeLocked
            ? 'border-[#1497F5] drop-shadow-[0_0_14px_rgba(20,151,245,0.95)] scale-100'
            : 'border-white/80 animate-pulse scale-105'
        }`}
      />

      {/* Bottom-Right Bracket (Frames outside 'S') */}
      <span
        className={`absolute -bottom-2 -right-2 w-7 sm:w-10 md:w-12 h-7 sm:h-10 md:h-12 border-b-[2.5px] border-r-[2.5px] transition-all duration-300 ${
          activeLocked
            ? 'border-[#1497F5] drop-shadow-[0_0_14px_rgba(20,151,245,0.95)] scale-100'
            : 'border-white/80 animate-pulse scale-105'
        }`}
      />

      {/* ================= CARDINAL CROSSHAIRS ================= */}
      <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-white/40" />
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-white/40" />
      <span className="absolute top-1/2 left-0 -translate-y-1/2 h-5 w-[2px] bg-white/40" />
      <span className="absolute top-1/2 right-0 -translate-y-1/2 h-5 w-[2px] bg-white/40" />
    </div>
  );
};
