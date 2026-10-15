import React, { useRef, useEffect, memo } from 'react';
import gsap from 'gsap';
import { PRELOADER_REELS } from '../../config/preloaderReels';
import { PreloaderReel } from '../../types';

interface Multigrade3DTilesProps {
  isCollecting: boolean;
  isColorRevealed: boolean;
  isExiting?: boolean;
  speedMultiplier?: number;
  className?: string;
}

interface TileData {
  id: string;
  poster: string;
  title: string;
}

/**
 * High-performance, pure image thumbnail tile.
 * Renders crystal-clear HD reel posters in dramatic B/W, blooming into full vibrant color upon flash snap.
 * Zero video decoding overhead for absolute 120 FPS smooth motion across all devices.
 */
const PreloaderThumbnailCard: React.FC<{
  poster: string;
  title: string;
  isColorRevealed: boolean;
}> = memo(({ poster, title, isColorRevealed }) => {
  return (
    <div
      className="relative rounded-lg md:rounded-xl overflow-hidden bg-[#0A0D14] border border-white/10 ring-1 ring-black/70 shadow-[0_12px_32px_rgba(0,0,0,0.8)] will-change-transform shrink-0 select-none"
      style={{ aspectRatio: '9/16' }}
    >
      <img
        src={poster}
        alt={title}
        loading="eager"
        decoding="async"
        className="w-full h-full object-cover transition-[filter] duration-700 ease-out pointer-events-none"
        style={{
          filter: isColorRevealed
            ? 'grayscale(0%) contrast(105%) brightness(100%)'
            : 'grayscale(100%) contrast(120%) brightness(88%)'
        }}
        draggable={false}
      />
      {/* Editorial Glass Edge Reflection */}
      <div className="absolute inset-0 rounded-lg md:rounded-xl ring-1 ring-inset ring-white/15 pointer-events-none" />
    </div>
  );
});

PreloaderThumbnailCard.displayName = 'PreloaderThumbnailCard';

/**
 * 60 FPS GSAP MASTER 3D FULL-BLEED MULTIGRADE TILES
 * - Features ONLY the authentic HD thumbnails from Reels Folder
 * - Pure image rendering with zero video decoder CPU/GPU overhead
 * - B/W to Color bloom transition synchronized with camera shutter snap
 * - 7 Full-bleed vertical lanes completely enveloping 100% of viewport with ZERO gaps on left & right
 * - Subtle border-radius (rounded-lg md:rounded-xl)
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

  // 7 Lanes covering all 26 authentic reels from Reels Folder
  // Symmetrically arranged around Column 3 (Dead-Center Hero Column)
  const lanes: PreloaderReel[][] = [
    // Column 0: Far-Left Lane (Visible on lg+ screens)
    [PRELOADER_REELS[4], PRELOADER_REELS[1], PRELOADER_REELS[20], PRELOADER_REELS[12]],
    // Column 1: Mid-Left Lane (Visible on sm+ screens)
    [PRELOADER_REELS[0], PRELOADER_REELS[8], PRELOADER_REELS[10], PRELOADER_REELS[21]],
    // Column 2: Near-Left Lane (Always visible)
    [PRELOADER_REELS[3], PRELOADER_REELS[7], PRELOADER_REELS[14], PRELOADER_REELS[22]],
    // Column 3: Center Stage (Hero Focus, Shutter Snap, Always visible)
    [PRELOADER_REELS[19], PRELOADER_REELS[11], PRELOADER_REELS[5], PRELOADER_REELS[2]],
    // Column 4: Near-Right Lane (Always visible)
    [PRELOADER_REELS[15], PRELOADER_REELS[13], PRELOADER_REELS[23], PRELOADER_REELS[16]],
    // Column 5: Mid-Right Lane (Visible on sm+ screens)
    [PRELOADER_REELS[9], PRELOADER_REELS[18], PRELOADER_REELS[24], PRELOADER_REELS[6]],
    // Column 6: Far-Right Lane (Visible on lg+ screens)
    [PRELOADER_REELS[17], PRELOADER_REELS[25], PRELOADER_REELS[0], PRELOADER_REELS[7]],
  ];

  // 3 Cycles of 4 cards = 12 cards per lane, guaranteeing infinite vertical continuity
  const REPEAT_CYCLES = 3;
  const columns: TileData[][] = lanes.map((lane, colIdx) => {
    const list: TileData[] = [];
    for (let c = 0; c < REPEAT_CYCLES; c++) {
      lane.forEach((reel, rIdx) => {
        list.push({
          id: `c${colIdx}-cyc${c}-r${rIdx}`,
          poster: reel.poster || '',
          title: reel.title,
        });
      });
    }
    return list;
  });

  // Alternating vertical velocities for rich cinematic parallax
  const baseVelocities = [0.90, -1.15, 1.30, -1.05, 1.35, -1.10, 0.85];
  // Subtle spatial IMAX concave curvature: center lane is forward, sides curve smoothly back
  const colZDepths = [-120, -40, 40, 90, 40, -40, -120];
  const colRotationsY = [5.0, 3.0, 1.2, 0, -1.2, -3.0, -5.0];

  // GSAP-managed animation state
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const animState = useRef({
    speedFactor: 1.0,
    rotX: isMobile ? 6 : 9,
    rotY: isMobile ? -2 : -4,
    // Scale ensures full-bleed coverage beyond screen margins at all times (zero left/right gaps)
    scale: isMobile ? 1.05 : 1.15,
    flattenProgress: 0, // 0 = 3D depth, 1 = unified flat convergence
    positions: [0, 0, 0, 0, 0, 0, 0],
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
        speedFactor: 0.015,
        rotX: 0,
        rotY: 0,
        // Maintains full-bleed coverage during convergence (never shrinking away from screen edges)
        scale: isMobileNow ? 1.02 : 1.06,
        flattenProgress: 1,
        duration: 1.35,
        ease: 'power3.out'
      });
    } else {
      gsap.to(animState.current, {
        speedFactor: 1.0,
        rotX: isMobileNow ? 6 : 9,
        rotY: isMobileNow ? -2 : -4,
        scale: isMobileNow ? 1.05 : 1.15,
        flattenProgress: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    }
  }, [isCollecting]);

  // 60 FPS Ticker loop with cached cycle heights (zero layout thrashing)
  useEffect(() => {
    const isMobileInitial = typeof window !== 'undefined' && window.innerWidth < 640;
    const defaultCycleHeight = isMobileInitial ? 520 : 1300;
    const cycleHeights = [
      defaultCycleHeight,
      defaultCycleHeight,
      defaultCycleHeight,
      defaultCycleHeight,
      defaultCycleHeight,
      defaultCycleHeight,
      defaultCycleHeight
    ];

    const measureCycleHeights = () => {
      colRefs.current.forEach((col, idx) => {
        if (col && col.scrollHeight > 0) {
          // Exactly 1/3 of the column height is 1 complete 4-card cycle
          cycleHeights[idx] = col.scrollHeight / REPEAT_CYCLES;
        }
      });
    };

    measureCycleHeights();

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

      // 2. Update Column Positions with seamless infinite wrap-around
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
      {/* 3D World Stage - Sized and centered to generously bleed over screen edges */}
      <div
        ref={world3DRef}
        className="relative flex flex-row items-center justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-auto max-w-none will-change-transform"
        style={{
          transformStyle: 'preserve-3d'
        }}
      >
        {columns.map((colReels, colIdx) => (
          <div
            key={colIdx}
            ref={(el) => (colRefs.current[colIdx] = el)}
            className={`flex flex-col gap-3.5 sm:gap-5 md:gap-6 shrink-0 will-change-transform ${
              colIdx === 0 || colIdx === 6
                ? 'hidden lg:flex w-[16.5vw] xl:w-[15.5vw]'
                : colIdx === 1 || colIdx === 5
                ? 'hidden sm:flex w-[23vw] lg:w-[16.5vw] xl:w-[15.5vw]'
                : 'flex w-[35vw] sm:w-[23vw] lg:w-[16.5vw] xl:w-[15.5vw]'
            }`}
            style={{
              transformStyle: 'preserve-3d'
            }}
          >
            {colReels.map((reel) => (
              <PreloaderThumbnailCard
                key={reel.id}
                poster={reel.poster}
                title={reel.title}
                isColorRevealed={isColorRevealed}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Atmospheric Depth Vignette (Anamorphic elliptical falloff that maintains edge visibility) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 90% 90% at center, transparent 40%, rgba(5, 6, 8, 0.45) 80%, rgba(5, 6, 8, 0.85) 100%)'
        }}
      />

      {/* 35mm Analog Film Grain Overlay */}
      <div className="pointer-events-none absolute inset-0 cinema-grain opacity-20 mix-blend-overlay" />
    </div>
  );
};
