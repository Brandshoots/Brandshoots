import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface StrokeRevealPreloaderProps {
  onComplete: () => void;
}

export const StrokeRevealPreloader: React.FC<StrokeRevealPreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let completed = false;
    const safeComplete = () => {
      if (completed) return;
      completed = true;
      onCompleteRef.current();
    };

    const ctx = gsap.context(() => {
      // 1. Initial State: clean, deep cinematic black canvas
      gsap.set(containerRef.current, { opacity: 1 });
      gsap.set(glowRef.current, { scale: 0.6, opacity: 0 });
      gsap.set(logoRef.current, { scale: 0.94, opacity: 0 });

      // 2. Master Page-to-Page Preloader Timeline
      const tl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) {
            gsap.to(containerRef.current, {
              opacity: 0,
              scale: 1.02,
              duration: 0.25,
              ease: 'power2.inOut',
              onComplete: safeComplete,
            });
          } else {
            safeComplete();
          }
        },
      });

      // A. Electric blue ambient aura blooms in center
      tl.to(
        glowRef.current,
        {
          scale: 1.25,
          opacity: 0.6,
          duration: 0.35,
          ease: 'power2.out',
        },
        0.02
      )
        // B. Official Logo reveals with smooth scale and crystal-clear opacity
        .to(
          logoRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: 'power2.out',
          },
          0.05
        )
        // C. Subtle cinematic hold for brand presence
        .to(
          logoRef.current,
          {
            scale: 1.015,
            duration: 0.2,
            ease: 'sine.inOut',
          },
          0.4
        )
        // D. Gentle fade as container dissolves into the page
        .to(
          logoRef.current,
          {
            opacity: 0.95,
            duration: 0.15,
          },
          0.6
        );
    }, containerRef);

    // Guaranteed safety timeout: releases page within 950ms regardless of any event
    const safetyTimeout = setTimeout(safeComplete, 950);

    return () => {
      clearTimeout(safetyTimeout);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#04060A] flex items-center justify-center select-none overflow-hidden"
    >
      {/* Central Volumetric Electric Blue Ambient Aura */}
      <div
        ref={glowRef}
        className="absolute w-[520px] h-[320px] rounded-full bg-[#008CFF]/25 blur-[120px] pointer-events-none"
      />

      {/* Official BRANDSHOOTS Vector Logo Only */}
      <div className="relative z-10 w-[84vw] max-w-[620px] flex items-center justify-center px-6 pointer-events-none">
        <img
          ref={logoRef}
          src="/Logo Official.svg"
          alt="BrandShoots Official Logo"
          className="w-full h-auto max-h-[35vh] object-contain filter drop-shadow-[0_12px_45px_rgba(0,140,255,0.45)]"
        />
      </div>
    </div>
  );
};

export default StrokeRevealPreloader;
