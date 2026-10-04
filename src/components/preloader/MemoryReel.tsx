import { useRef, useEffect, useState } from 'react';
import { PreloaderReel } from '../../types';

interface MemoryReelProps {
  reel: PreloaderReel;
  isActive: boolean;
  isPreloading: boolean;
  transitionType?: 'hardCut' | 'microZoom' | 'cropShift' | 'blackFlash' | 'whiteFlash';
  className?: string;
}

/**
 * MemoryReel:
 * Renders individual film fragments with runtime Black & White high-contrast grading,
 * smooth fallback posters, and progressive decoding.
 */
export const MemoryReel: React.FC<MemoryReelProps> = ({
  reel,
  isActive,
  isPreloading,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback to poster gracefully if autoplay is restricted
          setHasError(true);
        });
      }
    } else if (!isPreloading) {
      videoRef.current.pause();
    }
  }, [isActive, isPreloading]);

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden select-none transition-opacity duration-75 ${
        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
      } ${className}`}
    >
      {/* Fallback / Instant Poster */}
      <img
        src={reel.poster}
        alt={reel.title}
        loading="eager"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-150 ${
          videoLoaded && !hasError ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          objectPosition: reel.cropPosition,
          filter: 'grayscale(100%) contrast(145%) brightness(88%)'
        }}
      />

      {/* Primary Video Element (when preloading or active) */}
      {(isActive || isPreloading) && (
        <video
          ref={videoRef}
          src={reel.source}
          poster={reel.poster}
          muted
          playsInline
          loop
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setHasError(true)}
          className={`absolute inset-0 w-full h-full object-cover will-change-transform ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            objectPosition: reel.cropPosition,
            filter: 'grayscale(100%) contrast(145%) brightness(90%)'
          }}
        />
      )}

      {/* Subtle cinema vignette and contrast enhancement */}
      <div className="absolute inset-0 cinema-vignette pointer-events-none mix-blend-multiply opacity-60" />

      {/* Dynamic runtime film grain texture */}
      <div className="absolute inset-0 cinema-grain pointer-events-none opacity-40 mix-blend-overlay" />
    </div>
  );
};
