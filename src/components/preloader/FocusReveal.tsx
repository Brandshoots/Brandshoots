interface FocusRevealProps {
  isFocusing: boolean;
  isLocked: boolean;
  className?: string;
}

/**
 * FocusReveal:
 * Cinema viewfinder autofocus reticles and micro-focus bracket indicator.
 * Visualizes the autofocus lock sequence.
 */
export const FocusReveal: React.FC<FocusRevealProps> = ({
  isFocusing,
  isLocked,
  className = ''
}) => {
  if (!isFocusing && !isLocked) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-30 flex items-center justify-center transition-opacity duration-300 ${
        isFocusing || isLocked ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      {/* Central Autofocus Target Box */}
      <div
        className={`relative transition-all duration-300 ease-out ${
          isLocked
            ? 'w-24 h-24 scale-95 border-brand-blue/80'
            : 'w-36 h-36 scale-110 border-white/40 animate-pulse'
        }`}
      >
        {/* Corner Brackets */}
        <span
          className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 transition-colors duration-200 ${
            isLocked ? 'border-brand-blue' : 'border-white/80'
          }`}
        />
        <span
          className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 transition-colors duration-200 ${
            isLocked ? 'border-brand-blue' : 'border-white/80'
          }`}
        />
        <span
          className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 transition-colors duration-200 ${
            isLocked ? 'border-brand-blue' : 'border-white/80'
          }`}
        />
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 transition-colors duration-200 ${
            isLocked ? 'border-brand-blue' : 'border-white/80'
          }`}
        />

        {/* Center Crosshair Micro-pip */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-1 h-1 rounded-full transition-all duration-200 ${
              isLocked ? 'bg-brand-blue scale-125 shadow-glow-blue' : 'bg-white/60'
            }`}
          />
        </div>

        {/* Technical Focal Distance readout */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono tracking-widest uppercase transition-colors duration-200">
          <span className={isLocked ? 'text-brand-blue font-semibold' : 'text-white/60'}>
            {isLocked ? 'AF-LOCK 35.0MM' : 'AF-SEARCHING...'}
          </span>
        </div>
      </div>
    </div>
  );
};
