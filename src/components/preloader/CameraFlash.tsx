import { forwardRef } from 'react';

interface CameraFlashProps {
  className?: string;
}

/**
 * Camera Exposure Flash (~80ms-180ms)
 * Simulates a high-intensity xenon camera flash / exposure burst
 */
export const CameraFlash = forwardRef<HTMLDivElement, CameraFlashProps>(({ className = '' }, ref) => {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-50 opacity-0 bg-white mix-blend-screen transition-none ${className}`}
      style={{
        boxShadow: '0 0 120px 40px rgba(255, 255, 255, 0.95)',
        filter: 'brightness(1.8)'
      }}
    >
      {/* Intense center burst */}
      <div className="absolute inset-0 bg-gradient-radial from-white via-white/80 to-transparent opacity-90" />
    </div>
  );
});

CameraFlash.displayName = 'CameraFlash';
