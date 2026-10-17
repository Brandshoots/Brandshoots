import { forwardRef } from 'react';

interface CameraFlashProps {
  className?: string;
}

/**
 * Hardware-Accelerated Camera Xenon Flash
 * Operates purely on compositor opacity with zero GPU filter or blend mode stalls.
 */
export const CameraFlash = forwardRef<HTMLDivElement, CameraFlashProps>(({ className = '' }, ref) => {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-50 opacity-0 bg-white will-change-opacity select-none ${className}`}
    >
      {/* Intense center ambient falloff */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, #FFFFFF 0%, rgba(255, 255, 255, 0.95) 60%, rgba(255, 255, 255, 0.8) 100%)'
        }}
      />
    </div>
  );
});

CameraFlash.displayName = 'CameraFlash';
