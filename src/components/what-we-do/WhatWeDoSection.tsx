import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const WhatWeDoSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const weCreateRef = useRef<HTMLDivElement>(null);
  const headlineLine1Ref = useRef<HTMLDivElement>(null);
  const headlineLine2Ref = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. HERO PARALLAX RECESSION (Desktop only >= 1024px to prevent mobile gaps)
      if (window.innerWidth >= 1024) {
        const heroElement = document.querySelector('section');
        if (heroElement && sectionRef.current) {
          gsap.to(heroElement, {
            y: -80,
            opacity: 0.6,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
            },
          });
        }
      }

      // 2. EDITORIAL CINEMATIC REVEAL (Layered upward surge & stagger)
      if (sectionRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });

        // 1. Studio Logo subtly appears
        tl.fromTo(
          logoRef.current,
          { opacity: 0, y: -12, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' }
        )
        // 2. "WE CREATE" eyebrow reveals
        .fromTo(
          weCreateRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
          '-=0.18'
        )
        // 3. Headline reveals upward into view inside overflow-hidden mask
        .fromTo(
          headlineLine1Ref.current,
          { yPercent: 105, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.45, ease: 'power3.out' },
          '-=0.15'
        )
        .fromTo(
          headlineLine2Ref.current,
          { yPercent: 105, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.45, ease: 'power3.out' },
          '-=0.3'
        )
        // 4. Supporting copy follows with smooth focus
        .fromTo(
          paragraphRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          '-=0.2'
        )
        // 5. Section indicator line & badge settles
        .fromTo(
          tagRef.current,
          { opacity: 0, x: 15 },
          { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' },
          '-=0.22'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="what-we-do"
      ref={sectionRef}
      className="relative w-full h-[100dvh] max-h-[100dvh] bg-[#F4F3EE] text-[#0A0D12] overflow-hidden select-none flex flex-col justify-between snap-start snap-always"
    >
      {/* Anchor for About navigation */}
      <div id="about" className="absolute -top-10" />

      {/* Subtle architectural grid lines for studio depth */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* ======================================================== */}
      {/* EDITORIAL CANVAS: EXACT 100dvh ON ALL VIEWPORTS          */}
      {/* ======================================================== */}
      <div
        ref={containerRef}
        className="relative w-full h-full max-h-[100dvh] flex flex-col justify-between px-6 sm:px-12 md:px-16 lg:px-24 py-6 sm:py-8 lg:py-12 max-w-[1600px] mx-auto z-20"
      >
        {/* ------------------------------------------------------ */}
        {/* TOP: OFFICIAL BRANDSHOOTS LOGO (HIGH-CONTRAST)         */}
        {/* ------------------------------------------------------ */}
        <div ref={logoRef} className="w-full flex justify-center items-center pt-1 sm:pt-2">
          <img
            src="/Logo-Official-Dark.svg"
            alt="BrandShoots Official Logo"
            className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
          />
        </div>

        {/* ------------------------------------------------------ */}
        {/* CENTERPIECE: EDITORIAL TYPOGRAPHY                      */}
        {/* ------------------------------------------------------ */}
        <div className="flex flex-col items-center text-center my-auto w-full py-6 sm:py-8 lg:py-5">
          {/* WE CREATE */}
          <div ref={weCreateRef} className="overflow-hidden mb-2 sm:mb-4 lg:mb-5">
            <span className="font-editorial font-bold text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl tracking-[0.32em] sm:tracking-[0.38em] uppercase text-[#64748B]">
              WE CREATE
            </span>
          </div>

          {/* STORIES THAT MOVE */}
          <div className="overflow-hidden w-full">
            <div ref={headlineLine1Ref} className="w-full will-change-transform">
              <h2 className="font-editorial font-black uppercase text-[10vw] xs:text-[9.5vw] sm:text-[8vw] md:text-[7.4vw] lg:text-[84px] xl:text-[104px] 2xl:text-[118px] leading-[0.92] tracking-[-0.038em] text-[#0A0D12]">
                {/* Desktop / Tablet Break */}
                <span className="hidden sm:inline">STORIES THAT MOVE</span>
                {/* Intentional Mobile Line Break */}
                <span className="sm:hidden">STORIES THAT</span>
              </h2>
            </div>
          </div>

          {/* PEOPLE. */}
          <div className="overflow-hidden w-full mt-1 sm:mt-2">
            <div ref={headlineLine2Ref} className="w-full will-change-transform">
              <h2 className="font-editorial font-black uppercase text-[10vw] xs:text-[9.5vw] sm:text-[8vw] md:text-[7.4vw] lg:text-[84px] xl:text-[104px] 2xl:text-[118px] leading-[0.92] tracking-[-0.038em] text-[#0A0D12]">
                {/* Desktop / Tablet */}
                <span className="hidden sm:inline">
                  PEOPLE<span className="text-[#008CFF] drop-shadow-[0_0_16px_rgba(0,140,255,0.45)]">.</span>
                </span>
                {/* Intentional Mobile Line Break */}
                <span className="sm:hidden">
                  MOVE PEOPLE<span className="text-[#008CFF] drop-shadow-[0_0_16px_rgba(0,140,255,0.45)]">.</span>
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------ */}
        {/* BOTTOM: SUPPORTING STATEMENT & SECTION TAG             */}
        {/* ------------------------------------------------------ */}
        <div className="w-full flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-8 pb-1 sm:pb-3 border-t border-[#CBD5E1]/60 pt-4 sm:pt-6">
          {/* Supporting Copy */}
          <div className="max-w-xl text-left">
            <p
              ref={paragraphRef}
              className="font-editorial text-xs xs:text-sm sm:text-base md:text-lg lg:text-[20px] leading-[1.4] font-semibold text-[#334155] tracking-[-0.012em]"
            >
              BRANDSHOOTS is a creative production studio turning ideas into films, campaigns and visual experiences.
            </p>
          </div>

          {/* Section Indicator: 01 — WHAT WE DO */}
          <div
            ref={tagRef}
            className="flex items-center gap-2.5 sm:gap-3 self-start sm:self-end shrink-0"
          >
            <span className="font-mono text-xs sm:text-sm font-bold tracking-[0.28em] uppercase text-[#008CFF]">
              01
            </span>
            <span className="w-6 h-[1.5px] bg-[#008CFF]" />
            <span className="font-editorial font-bold text-xs sm:text-sm tracking-[0.28em] uppercase text-[#0A0D12]">
              WHAT WE DO
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhatWeDoSection;
