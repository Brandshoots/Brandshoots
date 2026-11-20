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
  const posterSrc = poster.replace('/reels_new/thumbnails/', '/reels_new/preloader-thumbnails/');

  return (
    <div
      className="relative rounded-lg md:rounded-xl overflow-hidden bg-[#0A0D14] border border-white/10 ring-1 ring-black/70 shadow-[0_12px_32px_rgba(0,0,0,0.8)] shrink-0 select-none"
      style={{ aspectRatio: '9/16' }}
    >
      <img
        src={posterSrc}
        alt={title}
        loading="eager"
        decoding="async"
        className="w-full h-full object-cover pointer-events-none transition-none preloader-poster-img"
        style={{
          filter: 'var(--preloader-poster-filter, grayscale(100%) contrast(108%) brightness(92%))'
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
 * FAST 2D COMPOSITOR-DRIVEN MULTIGRADE TILES
 * - Infinite vertical streaming using lightweight 2D translateY animations.
 * - Zero React state updates during playback.
 * - No perspective, depth transforms, or per-frame JavaScript ticker.
 * - Instant B/W to Color bloom triggered at peak flash with one CSS variable update.
 */
export const Multigrade3DTiles = forwardRef<Multigrade3DTilesHandle, Multigrade3DTilesProps>(({
  className = ''
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
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

  // Four cards are enough to cover the viewport during the short intro. The
  // preloader no longer mounts a second duplicate cycle for every lane.
  const REPEAT_CYCLES = 1;
  const columns: TileData[][] = lanes.slice(1, 6).map((lane, colIdx) => {
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

  // Slower, softer movement keeps poster edges crisp during the short intro.
  const laneDurations = [32, 27, 24, 29, 23, 28, 34];
  const isUpwardLane = [false, true, false, true, false, true, false];

  useImperativeHandle(ref, () => ({
    collect: () => {
      // Slow the flat 2D lane scrolls before the logo lock without touching
      // layout or creating extra 3D compositor layers.
      trackRefs.current.forEach((track) => {
        if (!track) return;
        try {
          const anims = track.getAnimations();
          anims.forEach((anim) => {
            gsap.to(anim, {
              playbackRate: 0.12,
              duration: 0.6,
              ease: 'power2.out'
            });
          });
        } catch {
          track.style.animationPlayState = 'paused';
        }
      });
    },
    revealColor: () => {
      // Flip one inherited CSS variable instead of writing a filter to every
      // poster during the flash. This keeps the reveal on a single style pass.
      containerRef.current?.style.setProperty(
        '--preloader-poster-filter',
        'grayscale(0%) contrast(100%) brightness(100%)'
      );
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
    >
      {/* Flat 2D poster stage. The lane layout stays the same without 3D perspective. */}
      <div className="relative flex h-full flex-row items-stretch justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-auto max-w-none">
        {columns.map((colReels, colIdx) => (
          <div
            key={colIdx}
            className={`h-full overflow-hidden shrink-0 ${
              colIdx === 0 || colIdx === 4
                ? 'hidden lg:block w-[calc((100vw-6rem)/5)]'
                : colIdx === 1 || colIdx === 3
                ? 'block w-[calc((100vw-1.5rem)/3)] sm:w-[calc((100vw-2rem)/3)] md:w-[calc((100vw-2.5rem)/3)] lg:w-[calc((100vw-6rem)/5)]'
                : 'block w-[calc((100vw-1.5rem)/3)] sm:w-[calc((100vw-2rem)/3)] md:w-[calc((100vw-2.5rem)/3)] lg:w-[calc((100vw-6rem)/5)]'
            }`}
          >
            {/* Compositor-animated infinite scroll track */}
            <div
              ref={(el) => (trackRefs.current[colIdx] = el)}
              className="flex flex-col gap-3.5 sm:gap-5 md:gap-6 will-change-transform"
              style={{
                animation: `${isUpwardLane[colIdx] ? 'preloaderLaneScrollUp' : 'preloaderLaneScrollDown'} ${laneDurations[colIdx]}s cubic-bezier(0.37, 0, 0.63, 1) infinite`,
                animationDelay: `${-colIdx * 1.15}s`,
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
