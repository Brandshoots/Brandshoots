interface FocusRevealProps {
  isFocusing: boolean;
  isLocked: boolean;
  className?: string;
}

/**
 * Optical Viewfinder Reticle:
 * Fine crosshair corner brackets that lock onto center.
 * ZERO text labels.
 */
export const FocusReveal = ({
  isFocusing,
  isLocked,
  className = ''
}: FocusRevealProps) => {
  if (!isFocusing && !isLocked) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-30 flex items-center justify-center transition-opacity duration-300 ${
        isFocusing || isLocked ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      {/* Central Autofocus Brackets */}
      <div
        className={`relative transition-all duration-300 ease-out ${
          isLocked
            ? 'w-32 h-20 sm:w-44 sm:h-28 scale-95 border-brand-blue/60'
            : 'w-48 h-32 sm:w-60 sm:h-40 scale-110 border-white/30 animate-pulse'
        }`}
      >
        {/* Corner Brackets */}
        <span
          className={`absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 transition-colors duration-200 ${
            isLocked ? 'border-brand-blue' : 'border-white/70'
          }`}
        />
        <span
          className={`absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 transition-colors duration-200 ${
            isLocked ? 'border-brand-blue' : 'border-white/70'
          }`}
        />
        <span
          className={`absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 transition-colors duration-200 ${
            isLocked ? 'border-brand-blue' : 'border-white/70'
          }`}
        />
        <span
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 transition-colors duration-200 ${
            isLocked ? 'border-brand-blue' : 'border-white/70'
          }`}
        />

        {/* Center Optical Dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
              isLocked ? 'bg-brand-blue scale-125 shadow-glow-blue' : 'bg-white/60'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
