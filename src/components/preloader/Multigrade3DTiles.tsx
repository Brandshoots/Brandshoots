import { useRef, useEffect } from 'react';
import { PRELOADER_REELS } from '../../config/preloaderReels';

interface Multigrade3DTilesProps {
  isCollecting: boolean; // True when tiles converge together
  isColorRevealed: boolean; // True after white flash
  speedMultiplier?: number;
  className?: string;
}

/**
 * Multigrade 3D Scrolling Tiles:
 * Inspired directly by Camille Mormal's iconic 3D multi-column spatial grid.
 * 4 columns streaming at staggered multigrade speeds, responding to mouse tilt,
 * and converging ("collecting") tightly into the center for the brand reveal.
 */
export const Multigrade3DTiles = ({
  isCollecting,
  isColorRevealed,
  speedMultiplier = 1.0,
  className = ''
}: Multigrade3DTilesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const grid3DRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Distribute reels across 4 columns
  const columns = [
    [PRELOADER_REELS[0], PRELOADER_REELS[4], PRELOADER_REELS[8], PRELOADER_REELS[0], PRELOADER_REELS[4], PRELOADER_REELS[8]],
    [PRELOADER_REELS[1], PRELOADER_REELS[5], PRELOADER_REELS[9], PRELOADER_REELS[1], PRELOADER_REELS[5], PRELOADER_REELS[9]],
    [PRELOADER_REELS[2], PRELOADER_REELS[6], PRELOADER_REELS[10], PRELOADER_REELS[2], PRELOADER_REELS[6], PRELOADER_REELS[10]],
    [PRELOADER_REELS[3], PRELOADER_REELS[7], PRELOADER_REELS[11], PRELOADER_REELS[3], PRELOADER_REELS[7], PRELOADER_REELS[11]]
  ];

  // Column speed configurations (multigrade: different speeds and directions)
  const colSpeeds = [0.85, -1.25, 1.45, -0.95];

  useEffect(() => {
    let animId: number;
    let positions = [0, 0, 0, 0];

    const animate = () => {
      // Reduce speed when collecting
      const currentSpeed = isCollecting ? 0.08 : 0.65 * speedMultiplier;

      colRefs.current.forEach((col, idx) => {
        if (!col) return;
        const dirSpeed = colSpeeds[idx] * currentSpeed;
        positions[idx] += dirSpeed;

        // Reset for infinite seamless looping
        const maxScroll = col.scrollHeight / 2;
        if (positions[idx] > maxScroll) positions[idx] -= maxScroll;
        if (positions[idx] < -maxScroll) positions[idx] += maxScroll;

        col.style.transform = `translate3d(0, ${positions[idx]}px, 0)`;
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isCollecting, speedMultiplier]);

  // Mouse Parallax 3D Tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!grid3DRef.current) return;
      if (isCollecting) {
        // Straighten out cleanly when collected
        grid3DRef.current.style.transform = `
          rotateX(0deg)
          rotateY(0deg)
          rotateZ(0deg)
          scale(${isCollecting ? 0.98 : 1.15})
        `;
        return;
      }

      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      grid3DRef.current.style.transform = `
        rotateX(${10 - y * 6}deg)
        rotateY(${-8 + x * 8}deg)
        rotateZ(-2deg)
        scale(1.18)
      `;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isCollecting]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden select-none bg-[#07080B] flex items-center justify-center ${className}`}
      style={{
        perspective: '1400px',
        WebkitPerspective: '1400px'
      }}
    >
      {/* 3D Tilted Multigrade Grid Layer */}
      <div
        ref={grid3DRef}
        className="relative grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-7 w-[140vw] sm:w-[125vw] md:w-[115vw] max-w-none h-[180vh] transition-all duration-1000 ease-out will-change-transform"
        style={{
          transform: isCollecting
            ? 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(0.98)'
            : 'rotateX(12deg) rotateY(-8deg) rotateZ(-3deg) scale(1.18)',
          gap: isCollecting ? '1rem' : '1.75rem'
        }}
      >
        {columns.map((colReels, colIdx) => (
          <div
            key={colIdx}
            ref={(el) => (colRefs.current[colIdx] = el)}
            className="flex flex-col gap-4 md:gap-7 will-change-transform"
          >
            {colReels.map((reel, rIdx) => (
              <div
                key={`${reel.id}-${rIdx}`}
                className={`relative group rounded-xl md:rounded-2xl overflow-hidden border border-white/10 bg-black/80 shadow-2xl transition-all duration-700 ${
                  isCollecting ? 'scale-95 border-brand-blue/30' : 'scale-100'
                }`}
                style={{
                  aspectRatio: '16/10',
                  boxShadow: '0 20px 40px -15px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.1)'
                }}
              >
                {/* Media Image Poster */}
                <img
                  src={reel.poster}
                  alt={reel.title}
                  loading="eager"
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    isColorRevealed
                      ? 'filter contrast-110 brightness-95'
                      : 'filter grayscale(100%) contrast(145%) brightness(88%)'
                  }`}
                  style={{
                    objectPosition: reel.cropPosition
                  }}
                />

                {/* Subtle vignette inside each tile */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Film metadata readout on tile corner */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[9px] font-mono tracking-wider text-white/60 pointer-events-none">
                  <span className="uppercase truncate max-w-[120px]">{reel.category}</span>
                  <span className={isColorRevealed ? 'text-brand-blue' : 'text-white/40'}>
                    {reel.metadata.lens}
                  </span>
                </div>

                {/* Top left mini index badge */}
                <div className="absolute top-2 left-2.5 px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-[8px] font-mono text-white/50">
                  {colIdx + 1}.{rIdx + 1}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Dynamic Darkening Vignette around the viewport edges */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle at center, transparent 35%, rgba(7, 8, 11, 0.7) 70%, #07080B 100%)'
        }}
      />

      {/* Film Grain Shader */}
      <div className="pointer-events-none absolute inset-0 cinema-grain opacity-25 mix-blend-overlay" />
    </div>
  );
};
