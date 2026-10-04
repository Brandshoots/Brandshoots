import { useRef, useEffect } from 'react';
import { PRELOADER_REELS } from '../../config/preloaderReels';

interface Multigrade3DTilesProps {
  isCollecting: boolean;
  isColorRevealed: boolean;
  speedMultiplier?: number;
  className?: string;
}

/**
 * Multidimensional 3D Scrolling Tiles:
 * Camille Mormal Inspired Spatial Architecture.
 * 5 distinct columns staggered deeply in Z-space (-220px to +160px).
 * Pure cinematic imagery — ZERO badges, ZERO text overlays, ZERO clutter.
 */
export const Multigrade3DTiles = ({
  isCollecting,
  isColorRevealed,
  speedMultiplier = 1.0,
  className = ''
}: Multigrade3DTilesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const world3DRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 5 Columns distributed across the 12 cinematic reels for true wide multi-dimensional coverage
  const columns = [
    // Column 0 (Deep Background Left)
    [PRELOADER_REELS[0], PRELOADER_REELS[5], PRELOADER_REELS[10], PRELOADER_REELS[0], PRELOADER_REELS[5], PRELOADER_REELS[10]],
    // Column 1 (Midground Mid-Left)
    [PRELOADER_REELS[1], PRELOADER_REELS[6], PRELOADER_REELS[11], PRELOADER_REELS[1], PRELOADER_REELS[6], PRELOADER_REELS[11]],
    // Column 2 (Center Hero Stage)
    [PRELOADER_REELS[2], PRELOADER_REELS[7], PRELOADER_REELS[0], PRELOADER_REELS[2], PRELOADER_REELS[7], PRELOADER_REELS[0]],
    // Column 3 (Foreground Mid-Right)
    [PRELOADER_REELS[3], PRELOADER_REELS[8], PRELOADER_REELS[1], PRELOADER_REELS[3], PRELOADER_REELS[8], PRELOADER_REELS[1]],
    // Column 4 (Deep Background Right)
    [PRELOADER_REELS[4], PRELOADER_REELS[9], PRELOADER_REELS[2], PRELOADER_REELS[4], PRELOADER_REELS[9], PRELOADER_REELS[2]]
  ];

  // Multigrade velocities (alternating vertical speeds and directions)
  const colVelocities = [0.95, -1.35, 1.85, -1.15, 1.25];

  // Multidimensional Z-Depth distribution per column for dramatic spatial depth
  const colZDepths = [-180, 80, -40, 160, -140];
  const colRotationsY = [8, -4, 0, 4, -8]; // subtle cylindrical curving

  useEffect(() => {
    let animId: number;
    let positions = [0, 0, 0, 0, 0];

    const animate = () => {
      // Smooth deceleration when collecting
      const currentSpeed = isCollecting ? 0.05 : 0.75 * speedMultiplier;

      colRefs.current.forEach((col, idx) => {
        if (!col) return;
        const dirSpeed = colVelocities[idx] * currentSpeed;
        positions[idx] += dirSpeed;

        // Infinite seamless loop wrap
        const maxScroll = col.scrollHeight / 2;
        if (positions[idx] > maxScroll) positions[idx] -= maxScroll;
        if (positions[idx] < -maxScroll) positions[idx] += maxScroll;

        // Dynamic 3D transform combining vertical scroll with Z-depth
        const targetZ = isCollecting ? 0 : colZDepths[idx];
        const targetRotY = isCollecting ? 0 : colRotationsY[idx];

        col.style.transform = `
          translate3d(0, ${positions[idx]}px, ${targetZ}px)
          rotateY(${targetRotY}deg)
        `;
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isCollecting, speedMultiplier]);

  // High-Fidelity 3D Mouse Parallax & Dynamic Perspective Shift
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!world3DRef.current) return;

      if (isCollecting) {
        // Flat, perfectly aligned cinema grid during collect
        world3DRef.current.style.transform = `
          rotateX(0deg)
          rotateY(0deg)
          rotateZ(0deg)
          scale(0.96)
        `;
        return;
      }

      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;

      // Deep dimensional tilts
      const rotX = 14 - normY * 10;
      const rotY = -10 + normX * 14;
      const rotZ = -3 + normX * 2;

      world3DRef.current.style.transform = `
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
        rotateZ(${rotZ}deg)
        scale(1.22)
      `;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isCollecting]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden select-none bg-[#050608] flex items-center justify-center ${className}`}
      style={{
        perspective: '1200px',
        WebkitPerspective: '1200px'
      }}
    >
      {/* 3D Multidimensional World Stage */}
      <div
        ref={world3DRef}
        className="relative grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-5 md:gap-7 w-[160vw] sm:w-[140vw] md:w-[130vw] max-w-none h-[200vh] transition-all duration-1000 ease-out preserve-3d will-change-transform"
        style={{
          transformStyle: 'preserve-3d',
          transform: isCollecting
            ? 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(0.96)'
            : 'rotateX(14deg) rotateY(-10deg) rotateZ(-3deg) scale(1.22)',
          gap: isCollecting ? '0.85rem' : '1.75rem'
        }}
      >
        {columns.map((colReels, colIdx) => (
          <div
            key={colIdx}
            ref={(el) => (colRefs.current[colIdx] = el)}
            className="flex flex-col gap-4 sm:gap-6 md:gap-7 will-change-transform preserve-3d transition-all duration-1000 ease-out"
            style={{
              transformStyle: 'preserve-3d'
            }}
          >
            {colReels.map((reel, rIdx) => {
              // Distant columns get subtle depth blur when not collected
              const isDistant = !isCollecting && (colIdx === 0 || colIdx === 4);

              return (
                <div
                  key={`${reel.id}-${rIdx}`}
                  className={`relative rounded-xl md:rounded-2xl overflow-hidden bg-black/90 shadow-2xl transition-all duration-700 ${
                    isCollecting
                      ? 'border border-white/20 scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.95)]'
                      : 'border border-white/10 scale-100 shadow-[0_30px_70px_rgba(0,0,0,0.85)]'
                  }`}
                  style={{
                    aspectRatio: '16/10',
                    filter: isDistant ? 'blur(0.8px)' : 'none'
                  }}
                >
                  {/* Clean Edge-to-Edge Pure Cinema Footage / Poster */}
                  <img
                    src={reel.poster}
                    alt={reel.title}
                    loading="eager"
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      isColorRevealed
                        ? 'filter contrast-115 brightness-95'
                        : 'filter grayscale(100%) contrast(145%) brightness(88%)'
                    }`}
                    style={{
                      objectPosition: reel.cropPosition
                    }}
                  />

                  {/* Cinema Vignette within tile */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                  {/* Subtle Glass Chamfer Highlight */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/15 pointer-events-none" />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Atmospheric Radial Cinema Vignette */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, rgba(5, 6, 8, 0.75) 65%, #050608 100%)'
        }}
      />

      {/* Runtime Cinematic 35mm Film Grain */}
      <div className="pointer-events-none absolute inset-0 cinema-grain opacity-20 mix-blend-overlay" />
    </div>
  );
};
