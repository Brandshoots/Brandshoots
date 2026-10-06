import React, { useEffect, useRef, useState } from 'react';
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

  const [pathLengths, setPathLengths] = useState<number[]>([]);

  useEffect(() => {
    // Measure total length of each SVG path dynamically
    const lengths = pathsRef.current.map((path) => (path ? path.getTotalLength() : 800));
    setPathLengths(lengths);
  }, []);

  useEffect(() => {
    if (pathLengths.length === 0) return;

    const ctx = gsap.context(() => {
      // 1. Initial State: Screen is pitch black, paths hidden, glow dim
      gsap.set(glowRef.current, { scale: 0.5, opacity: 0 });
      gsap.set(taglineRef.current, { y: 15, opacity: 0 });

      pathsRef.current.forEach((path, i) => {
        if (!path) return;
        const len = pathLengths[i] || 800;
        gsap.set(path, {
          strokeDasharray: len,
          strokeDashoffset: len,
          stroke: '#008CFF',
          strokeWidth: 2.2,
          fill: 'transparent',
          filter: 'drop-shadow(0 0 6px rgba(0,140,255,0.7))',
        });
      });

      // 2. Master Fast Preloader Timeline
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            scale: 1.04,
            duration: 0.45,
            ease: 'power3.inOut',
            onComplete,
          });
        },
      });

      // Rapid Sequence:
      // A. Electric blue ambient glow emerges
      tl.to(
        glowRef.current,
        {
          scale: 1.15,
          opacity: 0.45,
          duration: 0.4,
          ease: 'power2.out',
        },
        0.05
      )
        // B. Logo strokes draw rapidly
        .to(
          pathsRef.current,
          {
            strokeDashoffset: 0,
            duration: 0.55,
            stagger: 0.014,
            ease: 'power2.inOut',
          },
          0.1
        )
        // C. Logo snaps to full brand fill
        .to(
          pathsRef.current,
          {
            fill: (i) => LOGO_PATHS[i].fill,
            stroke: 'transparent',
            filter: 'drop-shadow(0 0 16px rgba(0,140,255,0.45))',
            duration: 0.3,
            ease: 'power2.out',
          },
          0.62
        )
        // D. Tagline reveals swiftly
        .to(
          taglineRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.25,
            ease: 'power2.out',
          },
          0.72
        )
        // E. Brief micro-hold then exit
        .to(
          svgRef.current,
          {
            scale: 1.02,
            duration: 0.25,
            ease: 'power1.out',
          },
          0.85
        );
    }, containerRef);

    return () => ctx.revert();
  }, [pathLengths, onComplete]);

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
