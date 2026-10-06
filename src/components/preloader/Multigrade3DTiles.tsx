import React, { useRef, useEffect, memo } from 'react';
import gsap from 'gsap';
import { PRELOADER_REELS } from '../../config/preloaderReels';

interface Multigrade3DTilesProps {
  isCollecting: boolean;
  isColorRevealed: boolean;
  isExiting?: boolean;
  speedMultiplier?: number;
  className?: string;
}

interface TileData {
  id: string;
  source: string;
  poster: string;
  isVideo?: boolean;
}

/**
 * High-performance, reliably auto-playing video tile.
 * Automatically guarantees muted autoplay across all browser environments.
 */
const PreloaderVideoCard: React.FC<{
  source: string;
  poster: string;
  isColorRevealed: boolean;
  isVideo?: boolean;
}> = memo(({ source, poster, isColorRevealed, isVideo = true }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isVideo) return;
    const video = videoRef.current;
    if (!video) return;

    // Strict browser autoplay configuration
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');

    const startPlayback = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback: unlock playback on user gesture if browser is restrictive
          const gestureUnlock = () => {
            video.play().catch(() => {});
          };
          window.addEventListener('click', gestureUnlock, { once: true, passive: true });
          window.addEventListener('touchstart', gestureUnlock, { once: true, passive: true });
        });
      }
    };

    // Immediately trigger playback without waiting
    startPlayback();

    video.addEventListener('loadeddata', startPlayback, { once: true });
    video.addEventListener('canplay', startPlayback, { once: true });
    video.addEventListener('loadedmetadata', startPlayback, { once: true });

    return () => {
      video.removeEventListener('loadeddata', startPlayback);
      video.removeEventListener('canplay', startPlayback);
      video.removeEventListener('loadedmetadata', startPlayback);
    };
  }, [source, isVideo]);

  return (
    <div
      className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-[#0A0D14] border border-white/10 ring-1 ring-black/70 shadow-[0_12px_32px_rgba(0,0,0,0.8)] will-change-transform"
      style={{ aspectRatio: '9/16' }}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={source}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover transition-[filter] duration-700 ease-out"
          style={{
            filter: isColorRevealed
              ? 'grayscale(0%) contrast(105%) brightness(100%)'
              : 'grayscale(100%) contrast(120%) brightness(88%)'
          }}
        />
      ) : (
        <img
          src={poster}
          alt="BrandShoots Reel"
          loading="eager"
          className="w-full h-full object-cover transition-[filter] duration-700 ease-out"
          style={{
            filter: isColorRevealed
              ? 'grayscale(0%) contrast(105%) brightness(100%)'
              : 'grayscale(100%) contrast(120%) brightness(88%)'
          }}
        />
      )}
      {/* Editorial Glass Edge Reflection */}
      <div className="absolute inset-0 rounded-2xl md:rounded-3xl ring-1 ring-inset ring-white/15 pointer-events-none" />
    </div>
  );
});

PreloaderVideoCard.displayName = 'PreloaderVideoCard';

/**
 * 60 FPS GSAP TICKER-POWERED 3D MULTIGRADE TILES
 * - All 10 BrandShoots videos actively auto-playing with zero latency
 * - Seamless mathematical continuous infinite scroll (zero jumping/glitches)
 * - Optimized GPU transforms with sub-pixel precision and decoupled reflows
 */
export const Multigrade3DTiles: React.FC<Multigrade3DTilesProps> = ({
  isCollecting,
  isColorRevealed,
  isExiting = false,
  speedMultiplier = 1.0,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const world3DRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 5 Columns, pairing all 10 authentic reels across 5 vertical lanes
  // 10 cards per column (5 repeated cycles of [R_A, R_B]).
  // Cycle index 2 (center cards 4 & 5) are active playing videos.
  // Cycles 0, 1, 3, 4 are high-resolution poster images for seamless top/bottom continuity.
  const reelPairs = [
    [PRELOADER_REELS[0], PRELOADER_REELS[5]],
    [PRELOADER_REELS[1], PRELOADER_REELS[6]],
    [PRELOADER_REELS[2], PRELOADER_REELS[7]],
    [PRELOADER_REELS[3], PRELOADER_REELS[8]],
    [PRELOADER_REELS[4], PRELOADER_REELS[9]],
  ];

  const columns: TileData[][] = reelPairs.map((pair, colIdx) => {
    const list: TileData[] = [];
    for (let c = 0; c < 5; c++) {
      const isCardVideo = c >= 1 && c <= 3;
      list.push({
        id: `c${colIdx}-${c * 2}`,
        source: pair[0].source,
        poster: pair[0].poster,
        isVideo: isCardVideo,
      });
      list.push({
        id: `c${colIdx}-${c * 2 + 1}`,
        source: pair[1].source,
        poster: pair[1].poster,
        isVideo: isCardVideo,
      });
    }
    return list;
  });

  // Alternating vertical velocities for rich cinematic parallax
  const baseVelocities = [0.85, -1.15, 1.35, -1.10, 0.90];
  const colZDepths = [-100, 35, 0, 85, -70];
  const colRotationsY = [4.5, -2.5, 0, 2.5, -4.5];

  // GSAP-managed animation state
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const animState = useRef({
    speedFactor: 1.0,
    rotX: isMobile ? 6 : 10,
    rotY: isMobile ? -3 : -5,
    scale: isMobile ? 0.98 : 1.10,
    flattenProgress: 0, // 0 = 3D depth, 1 = unified flat alignment
    positions: [0, 0, 0, 0, 0],
    isExiting: false
  });

  useEffect(() => {
    animState.current.isExiting = isExiting;
  }, [isExiting]);

  // Smooth deceleration and convergence when isCollecting changes
  useEffect(() => {
    const isMobileNow = window.innerWidth < 640;
    if (isCollecting) {
      gsap.to(animState.current, {
        speedFactor: 0.018,
        rotX: 0,
        rotY: 0,
        scale: isMobileNow ? 0.90 : 0.97,
        flattenProgress: 1,
        duration: 1.35,
        ease: 'power3.out'
      });
    } else {
      gsap.to(animState.current, {
        speedFactor: 1.0,
        rotX: isMobileNow ? 6 : 10,
        rotY: isMobileNow ? -3 : -5,
        scale: isMobileNow ? 0.98 : 1.10,
        flattenProgress: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    }
  }, [isCollecting]);

  // 60 FPS Ticker loop with cached cycle heights (zero layout thrashing)
  useEffect(() => {
    const isMobileInitial = typeof window !== 'undefined' && window.innerWidth < 640;
    const defaultCycleHeight = isMobileInitial ? 420 : 1100;
    const cycleHeights = [defaultCycleHeight, defaultCycleHeight, defaultCycleHeight, defaultCycleHeight, defaultCycleHeight];

    const measureCycleHeights = () => {
      colRefs.current.forEach((col, idx) => {
        if (col && col.scrollHeight > 0) {
          // 1/5th of the column scrollHeight is exactly 1 full cycle (2 cards + gaps)
          cycleHeights[idx] = col.scrollHeight / 5;
        }
      });
    };

    measureCycleHeights();

    // Resize observer to update cached heights without per-frame reflows
    const resizeObserver = new ResizeObserver(() => {
      measureCycleHeights();
    });

    colRefs.current.forEach((col) => {
      if (col) resizeObserver.observe(col);
    });

    const onTick = (_time: number, deltaTime: number) => {
      const state = animState.current;
      if (state.isExiting) return;

      // Delta time normalization against 60fps standard (16.67ms = 1.0)
      const dt = Math.min(Math.max(deltaTime / 16.667, 0.4), 2.0);

      // 1. Update 3D World Transform
      if (world3DRef.current) {
        gsap.set(world3DRef.current, {
          rotationX: state.rotX,
          rotationY: state.rotY,
          scale: state.scale,
          force3D: true
        });
      }

      // 2. Update Column Positions with seamless wrap-around
      const cols = colRefs.current;
      for (let i = 0; i < cols.length; i++) {
        const col = cols[i];
        if (!col) continue;

        const delta = baseVelocities[i] * state.speedFactor * speedMultiplier * dt;
        state.positions[i] += delta;

        const ch = cycleHeights[i] || defaultCycleHeight;
        if (state.positions[i] > 0) {
          state.positions[i] -= ch;
        } else if (state.positions[i] < -ch) {
          state.positions[i] += ch;
        }

        const currentZ = colZDepths[i] * (1 - state.flattenProgress);
        const currentRotY = colRotationsY[i] * (1 - state.flattenProgress);

        gsap.set(col, {
          y: state.positions[i],
          z: currentZ,
          rotationY: currentRotY,
          force3D: true
        });
      }
    };

    gsap.ticker.add(onTick);

    return () => {
      resizeObserver.disconnect();
      gsap.ticker.remove(onTick);
    };
  }, [speedMultiplier]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden select-none bg-[#050608] flex items-center justify-center ${className}`}
      style={{
        perspective: '1400px',
        WebkitPerspective: '1400px'
      }}
    >
      {/* 3D World Stage */}
      <div
        ref={world3DRef}
        className="relative flex flex-row items-center justify-center gap-2.5 sm:gap-4 md:gap-6 w-auto max-w-none will-change-transform"
        style={{
          transformStyle: 'preserve-3d'
        }}
      >
        {columns.map((colReels, colIdx) => (
          <div
            key={colIdx}
            ref={(el) => (colRefs.current[colIdx] = el)}
            className="flex flex-col gap-3.5 sm:gap-5 md:gap-7 shrink-0 w-[28vw] xs:w-[26vw] sm:w-[22vw] md:w-[18vw] lg:w-[15vw] will-change-transform"
            style={{
              transformStyle: 'preserve-3d'
            }}
          >
            {colReels.map((reel) => (
              <PreloaderVideoCard
                key={reel.id}
                source={reel.source}
                poster={reel.poster}
                isColorRevealed={isColorRevealed}
                isVideo={reel.isVideo}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Atmospheric Depth Vignette (High-performance gradient) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 35%, rgba(5, 6, 8, 0.70) 70%, #050608 100%)'
        }}
      />

      {/* 35mm Analog Film Grain Overlay */}
      <div className="pointer-events-none absolute inset-0 cinema-grain opacity-20 mix-blend-overlay" />
    </div>
  );
};
