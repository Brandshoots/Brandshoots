import React, { useRef, memo, useImperativeHandle, forwardRef } from 'react';
import gsap from 'gsap';
import { PRELOADER_REELS } from '../../config/preloaderReels';
import { PreloaderReel } from '../../types';

export interface Multigrade3DTilesHandle {
  collect: () => void;
  revealColor: () => void;
  exit: () => void;
}

interface Multigrade3DTilesProps {
  className?: string;
}

interface TileData {
  id: string;
  poster: string;
  title: string;
}

/**
 * Pure Compositor Thumbnail Card
 * Crystal-clear HD reel posters with zero will-change VRAM bloat and zero continuous filter transitions.
 */
const PreloaderThumbnailCard: React.FC<{
  poster: string;
  title: string;
}> = memo(({ poster, title }) => {
  return (
    <div
      className="relative rounded-lg md:rounded-xl overflow-hidden bg-[#0A0D14] border border-white/10 ring-1 ring-black/70 shadow-[0_12px_32px_rgba(0,0,0,0.8)] shrink-0 select-none"
      style={{ aspectRatio: '9/16' }}
    >
      <img
        src={poster}
        alt={title}
        loading="eager"
        decoding="async"
        className="w-full h-full object-cover pointer-events-none transition-none preloader-poster-img"
        style={{
          filter: 'grayscale(100%) contrast(120%) brightness(88%)'
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
 * 60/120 FPS COMPOSITOR-DRIVEN MULTIGRADE TILES
 * - Infinite vertical streaming running 100% on GPU compositor thread via CSS transforms.
 * - Zero React state updates: zero virtual DOM diffing during animation.
 * - Zero JS per-frame RAF ticker and zero ResizeObserver layout queries.
 * - Smooth deceleration via Web Animations API playbackRate interpolation.
 * - Instant B/W to Color bloom triggered at peak flash with zero 700ms filter thrashing.
 */
export const Multigrade3DTiles = forwardRef<Multigrade3DTilesHandle, Multigrade3DTilesProps>(({
  className = ''
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const world3DRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 7 Lanes covering authentic reels from PRELOADER_REELS
  // Symmetrically arranged around Column 3 (Center Hero Column)
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

  // 2 Cycles of 4 cards = 8 cards per lane, perfectly sufficient for infinite seamless loop (-50%)
  const REPEAT_CYCLES = 2;
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

  // Alternating scroll durations for natural cinematic parallax
  // Odd indices scroll Up, Even indices scroll Down
  const laneDurations = [24, 18, 15, 17, 14, 19, 25];
  const isUpwardLane = [false, true, false, true, false, true, false];

  // Spatial IMAX concave curvature: center lane is forward, sides curve smoothly back
  const colZDepths = [-120, -40, 40, 90, 40, -40, -120];
  const colRotationsY = [5.0, 3.0, 1.2, 0, -1.2, -3.0, -5.0];

  useImperativeHandle(ref, () => ({
    collect: () => {
      // 1. Flatten 3D world perspective smoothly
      if (world3DRef.current) {
        gsap.to(world3DRef.current, {
          rotationX: 0,
          rotationY: 0,
          scale: 1.05,
          duration: 1.2,
          ease: 'power3.out'
        });
      }

      // 2. Flatten individual column depths & rotations
      colRefs.current.forEach((col) => {
        if (!col) return;
        gsap.to(col, {
          z: 0,
          rotationY: 0,
          duration: 1.2,
          ease: 'power3.out'
        });
      });

      // 3. Smoothly decelerate lane scrolling on the compositor
      trackRefs.current.forEach((track) => {
        if (!track) return;
        try {
          const anims = track.getAnimations();
          anims.forEach((anim) => {
            gsap.to(anim, {
              playbackRate: 0.02,
              duration: 1.2,
              ease: 'power2.out'
            });
          });
        } catch {
          track.style.animationPlayState = 'paused';
        }
      });
    },
    revealColor: () => {
      if (containerRef.current) {
        const imgs = containerRef.current.querySelectorAll<HTMLImageElement>('.preloader-poster-img');
        imgs.forEach((img) => {
          img.style.filter = 'grayscale(0%) contrast(105%) brightness(100%)';
        });
      }
    },
    exit: () => {
      trackRefs.current.forEach((track) => {
        if (!track) return;
        track.style.animationPlayState = 'paused';
      });
    }
  }));

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden select-none bg-[#050608] flex items-center justify-center ${className}`}
      style={{
        perspective: '1400px',
        WebkitPerspective: '1400px'
      }}
    >
      {/* 3D World Stage - Hardware accelerated container */}
      <div
        ref={world3DRef}
        className="relative flex flex-row items-center justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-auto max-w-none will-change-transform"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(8deg) rotateY(-3deg) scale(1.12)'
        }}
      >
        {columns.map((colReels, colIdx) => (
          <div
            key={colIdx}
            ref={(el) => (colRefs.current[colIdx] = el)}
            className={`shrink-0 will-change-transform ${
              colIdx === 0 || colIdx === 6
                ? 'hidden lg:block w-[16.5vw] xl:w-[15.5vw]'
                : colIdx === 1 || colIdx === 5
                ? 'hidden sm:block w-[23vw] lg:w-[16.5vw] xl:w-[15.5vw]'
                : 'block w-[35vw] sm:w-[23vw] lg:w-[16.5vw] xl:w-[15.5vw]'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: `translate3d(0, 0, ${colZDepths[colIdx]}px) rotateY(${colRotationsY[colIdx]}deg)`
            }}
          >
            {/* Compositor-animated infinite scroll track */}
            <div
              ref={(el) => (trackRefs.current[colIdx] = el)}
              className="flex flex-col gap-3.5 sm:gap-5 md:gap-6 will-change-transform"
              style={{
                animation: `${isUpwardLane[colIdx] ? 'preloaderLaneScrollUp' : 'preloaderLaneScrollDown'} ${laneDurations[colIdx]}s linear infinite`,
                animationPlayState: 'running'
              }}
            >
              {colReels.map((reel) => (
                <PreloaderThumbnailCard
                  key={reel.id}
                  poster={reel.poster}
                  title={reel.title}
                />
              ))}
            </div>
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
});

Multigrade3DTiles.displayName = 'Multigrade3DTiles';
