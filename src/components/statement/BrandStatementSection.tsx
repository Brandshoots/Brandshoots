import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const BrandStatementSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [line1Ref.current, line2Ref.current, line3Ref.current],
        { opacity: 0, y: 35, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-20 sm:py-28 md:py-36 bg-[#04060A] text-white overflow-hidden select-none flex items-center justify-center border-t border-white/5"
    >
      {/* Background Volumetric Blue Atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1200px] h-[500px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.1) 0%, rgba(0, 60, 160, 0.02) 50%, transparent 75%)',
            filter: 'blur(90px)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-full flex flex-col items-center justify-center text-center px-3 sm:px-6">
        <h2 className="w-full max-w-full flex flex-col items-center justify-center font-sans font-black uppercase text-center tracking-[-0.035em] sm:tracking-[-0.04em] text-white select-none">
          <span
            ref={line1Ref}
            className="block whitespace-nowrap text-[7vw] xs:text-[7.4vw] sm:text-5xl md:text-6xl lg:text-[86px] xl:text-[106px] leading-[0.95] text-white/90"
          >
            WE CRAFT
          </span>
          <span
            ref={line2Ref}
            className="block whitespace-nowrap text-[8.6vw] xs:text-[9vw] sm:text-6xl md:text-7xl lg:text-[106px] xl:text-[130px] leading-[0.92] text-white font-black my-1 sm:my-2"
          >
            FILMS THAT
          </span>
          <span
            ref={line3Ref}
            className="block whitespace-nowrap text-[7.2vw] xs:text-[7.6vw] sm:text-6xl md:text-7xl lg:text-[106px] xl:text-[130px] leading-[0.92] text-[#008CFF]"
          >
            DEFINE BRANDS<span className="text-white">.</span>
          </span>
        </h2>
      </div>
    </section>
  );
};

export default BrandStatementSection;
