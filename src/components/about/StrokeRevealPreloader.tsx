import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { LOGO_PATHS } from './logoPaths';

interface StrokeRevealPreloaderProps {
  onComplete: () => void;
}

export const StrokeRevealPreloader: React.FC<StrokeRevealPreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathsRef = useRef<(SVGPathElement | null)[]>([]);
  const taglineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial State: Screen is pitch black, paths hidden, glow dim
      gsap.set(glowRef.current, { scale: 0.5, opacity: 0 });
      gsap.set(taglineRef.current, { y: 15, opacity: 0 });

      pathsRef.current.forEach((path) => {
        if (!path) return;
        const len = (typeof path.getTotalLength === 'function' ? path.getTotalLength() : 800) || 800;
        gsap.set(path, {
          strokeDasharray: len,
          strokeDashoffset: len,
          stroke: '#008CFF',
          strokeWidth: 2.2,
          fill: 'transparent',
          filter: 'drop-shadow(0 0 6px rgba(0,140,255,0.7))',
        });
      });

      // 2. Master Cinematic Page-to-Page Preloader Timeline (Refined, Graceful Pacing)
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            scale: 1.03,
            duration: 0.55,
            ease: 'power3.inOut',
            onComplete,
          });
        },
      });

      // Sequence:
      // A. Electric blue ambient glow emerges
      tl.to(
        glowRef.current,
        {
          scale: 1.2,
          opacity: 0.5,
          duration: 0.6,
          ease: 'power2.out',
        },
        0.05
      )
        // B. Logo strokes draw smoothly and deliberately
        .to(
          pathsRef.current,
          {
            strokeDashoffset: 0,
            duration: 1.1,
            stagger: 0.022,
            ease: 'power2.inOut',
          },
          0.15
        )
        // C. Logo transitions smoothly to full brand fill
        .to(
          pathsRef.current,
          {
            fill: (i) => LOGO_PATHS[i].fill,
            stroke: 'transparent',
            filter: 'drop-shadow(0 0 20px rgba(0,140,255,0.5))',
            duration: 0.45,
            ease: 'power2.out',
          },
          1.15
        )
        // D. Tagline reveals with elegant spacing
        .to(
          taglineRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
          },
          1.35
        )
        // E. Intentional cinematic hold so user can register the brand logo
        .to(
          svgRef.current,
          {
            scale: 1.015,
            duration: 0.65,
            ease: 'sine.inOut',
          },
          1.5
        );
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#04060A] flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Subtle Central Electric Blue Ambient Core */}
      <div
        ref={glowRef}
        className="absolute w-[500px] h-[300px] rounded-full bg-[#008CFF]/20 blur-[110px] pointer-events-none"
      />

      {/* SVG Container: Official BRANDSHOOTS Vector Mark */}
      <div className="relative z-10 w-[88vw] max-w-[760px] flex flex-col items-center">
        <svg
          ref={svgRef}
          viewBox="175 360 1600 365"
          className="w-full h-auto max-h-[38vh] filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]"
        >
          {LOGO_PATHS.map((path, index) => (
            <path
              key={index}
              ref={(el) => {
                pathsRef.current[index] = el;
              }}
              d={path.d}
            />
          ))}
        </svg>

        {/* Small Tagline: CREATE. SHOOT. GROW. */}
        <div ref={taglineRef} className="mt-6 sm:mt-8 flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
          <span className="font-mono text-xs sm:text-[13px] tracking-[0.35em] uppercase text-white/80 font-medium">
            CREATE. SHOOT. GROW.
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
        </div>
      </div>
    </div>
  );
};

export default StrokeRevealPreloader;
