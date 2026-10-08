import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const TheLeadershipSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const backdropGlowRef = useRef<HTMLDivElement>(null);

  // Portrait refs
  const portraitCardRef = useRef<HTMLDivElement>(null);
  const portraitMaskRef = useRef<HTMLDivElement>(null);
  const portraitImgRef = useRef<HTMLImageElement>(null);

  // Typography refs
  const rightContentRef = useRef<HTMLDivElement>(null);
  const nameLine1Ref = useRef<HTMLSpanElement>(null);
  const nameLine2Ref = useRef<HTMLSpanElement>(null);
  const designationRef = useRef<HTMLDivElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);
  const bioParagraphRef = useRef<HTMLParagraphElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const entryTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      if (backdropGlowRef.current) {
        entryTl.fromTo(
          backdropGlowRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
          0
        );
      }

      if (portraitMaskRef.current && portraitImgRef.current) {
        entryTl.fromTo(
          portraitMaskRef.current,
          { opacity: 0, scale: 0.96, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: 'power3.out' },
          0.1
        );
      }

      if (nameLine1Ref.current && nameLine2Ref.current) {
        entryTl.fromTo(
          [nameLine1Ref.current, nameLine2Ref.current],
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'power3.out' },
          0.2
        );
      }

      if (designationRef.current) {
        entryTl.fromTo(
          designationRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' },
          0.32
        );
      }

      if (accentLineRef.current) {
        entryTl.fromTo(
          accentLineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.4, ease: 'power2.out', transformOrigin: 'left center' },
          0.38
        );
      }

      if (bioParagraphRef.current) {
        entryTl.fromTo(
          bioParagraphRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' },
          0.44
        );
      }

      if (pillarsRef.current) {
        entryTl.fromTo(
          pillarsRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
          0.52
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="leadership"
      ref={sectionRef}
      className="relative w-full py-16 sm:py-24 lg:py-28 bg-[#04060A] text-white flex items-center justify-center px-5 sm:px-10 lg:px-14 xl:px-20 select-none overflow-hidden"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          ref={backdropGlowRef}
          className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[950px] h-[600px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.12) 0%, rgba(0, 75, 180, 0.04) 45%, transparent 75%)',
            filter: 'blur(90px)',
          }}
        />
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#05070A] to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#04060A] to-transparent" />
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:5rem_5rem]" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 xl:gap-16 items-center">
          
          {/* ==================================================== */}
          {/* LEFT: LARGE FOUNDER PORTRAIT                         */}
          {/* On mobile: prominent 82vw max 320px aspect-[4/5]      */}
          {/* ==================================================== */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end order-1">
            <div
              ref={portraitCardRef}
              className="relative w-full max-w-[270px] xs:max-w-[300px] sm:max-w-[340px] lg:max-w-[440px] xl:max-w-[480px] aspect-[4/5]"
            >
              <div className="absolute -inset-1.5 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/15 via-white/5 to-[#008CFF]/30 opacity-40 blur-[4px] pointer-events-none" />

              <div
                ref={portraitMaskRef}
                className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0A0D14] border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.95)]"
              >
                <img
                  ref={portraitImgRef}
                  src="/founder.png"
                  alt="Durgarao Vallepu — Founder, BRANDSHOOTS"
                  className="w-full h-full object-cover object-[center_20%] select-none"
                  draggable={false}
                />

                <div
                  className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(4,6,10,0.9) 0%, rgba(4,6,10,0.3) 60%, transparent 100%)',
                  }}
                />

                {/* Subtle corner ticks */}
                <div className="absolute top-3.5 left-3.5 w-2.5 h-2.5 border-t border-l border-white/35 pointer-events-none" />
                <div className="absolute top-3.5 right-3.5 w-2.5 h-2.5 border-t border-r border-white/35 pointer-events-none" />
                <div className="absolute bottom-3.5 left-3.5 w-2.5 h-2.5 border-b border-l border-white/35 pointer-events-none" />
                <div className="absolute bottom-3.5 right-3.5 w-2.5 h-2.5 border-b border-r border-white/35 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* RIGHT: EDITORIAL TYPOGRAPHY & FOUNDER MATTER         */}
          {/* ==================================================== */}
          <div
            ref={rightContentRef}
            className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left items-center lg:items-start order-2 lg:pl-4 xl:pl-8"
          >
            {/* Top Eyebrow: THE LEADERSHIP */}
            <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_6px_#008CFF] inline-block shrink-0" />
              <span className="font-mono text-[10px] xs:text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#008CFF] font-semibold">
                03 // THE LEADERSHIP
              </span>
            </div>

            {/* Large Founder Name: DURGARAO VALLEPU */}
            <h2 className="font-sans font-black uppercase tracking-[-0.035em] text-3xl xs:text-4xl sm:text-5xl lg:text-7xl xl:text-8xl leading-[0.9] text-white">
              <span ref={nameLine1Ref} className="block">
                DURGARAO
              </span>
              <span ref={nameLine2Ref} className="block text-white mt-0.5">
                VALLEPU
              </span>
            </h2>

            {/* Role: Founder, BRANDSHOOTS */}
            <div ref={designationRef} className="flex items-center gap-2 mt-3 sm:mt-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_6px_#008CFF]" />
              <p className="font-mono text-xs sm:text-sm tracking-[0.22em] uppercase text-white/80 font-medium">
                FOUNDER, <span className="text-[#008CFF] font-bold">BRANDSHOOTS</span>
              </p>
            </div>

            {/* Accent Divider */}
            <div
              ref={accentLineRef}
              className="w-20 sm:w-28 lg:w-32 h-[2px] bg-gradient-to-r from-[#008CFF] to-transparent my-3 sm:my-3.5 origin-left"
            />

            {/* Short, Impactful Description (1-3 sentences per guideline) */}
            <div className="max-w-xl">
              <p
                ref={bioParagraphRef}
                className="font-sans text-xs xs:text-sm sm:text-base lg:text-[17px] leading-[1.65] text-white/75 font-normal"
              >
                Leading the creative direction and cinematic vision at BRANDSHOOTS. Shaping every film, commercial, and campaign to capture genuine emotion and command cultural presence.
              </p>
            </div>

            {/* Core Tenets / Pillars: Mobile-friendly row */}
            <div
              ref={pillarsRef}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-4 sm:mt-5"
            >
              <span className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[10px] xs:text-[11px] font-mono uppercase tracking-[0.2em] text-white/75 select-none">
                CREATE WITH INTENT
              </span>
              <span className="px-3 py-1.5 rounded-full bg-[#008CFF]/10 border border-[#008CFF]/30 text-[10px] xs:text-[11px] font-mono uppercase tracking-[0.2em] text-[#008CFF] font-semibold select-none">
                SHOOT WITH PURPOSE
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[10px] xs:text-[11px] font-mono uppercase tracking-[0.2em] text-white/75 select-none">
                GROW DIGITAL PRESENCE
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default TheLeadershipSection;
