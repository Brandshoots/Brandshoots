import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const TheLeadershipSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const backdropGlowRef = useRef<HTMLDivElement>(null);

  // Eyebrow label refs
  const labelDotRef = useRef<HTMLSpanElement>(null);
  const labelTextRef = useRef<HTMLSpanElement>(null);

  // Portrait refs
  const portraitCardRef = useRef<HTMLDivElement>(null);
  const portraitMaskRef = useRef<HTMLDivElement>(null);
  const portraitImgRef = useRef<HTMLImageElement>(null);
  const lightSheenRef = useRef<HTMLDivElement>(null);

  // Right-side typography & matter refs
  const nameLine1Ref = useRef<HTMLSpanElement>(null);
  const nameLine2Ref = useRef<HTMLSpanElement>(null);
  const designationRef = useRef<HTMLDivElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);
  const bioParagraphRef = useRef<HTMLParagraphElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      const mm = gsap.matchMedia();

      // ====================================================================
      // DESKTOP & TABLET EXPERIENCE (>= 1024px) — CINEMATIC EDITORIAL SPREAD
      // ====================================================================
      mm.add('(min-width: 1024px)', () => {
        // Master Entrance Timeline triggered cleanly when section enters viewport
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });

        // Eyebrow label & soft aura
        tl.from(labelDotRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: 'back.out(1.7)' })
          .from(labelTextRef.current, { x: -14, opacity: 0, duration: 0.35, ease: 'power3.out' }, '-=0.15')
          .from(backdropGlowRef.current, { scale: 0.8, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
          
          // 1. IMAGE: Smooth curtain surge + scale recovery
          .fromTo(
            portraitMaskRef.current,
            { opacity: 0, scale: 0.94, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'power3.out' },
            '-=0.25'
          )
          .fromTo(
            portraitImgRef.current,
            { scale: 1.15 },
            { scale: 1.0, duration: 0.85, ease: 'power2.out' },
            '<'
          )
          .fromTo(lightSheenRef.current, { xPercent: -150, opacity: 0.8 }, { xPercent: 200, opacity: 0, duration: 0.7, ease: 'power2.inOut' }, '-=0.3')
          
          // 2. NAME: Clean curtain reveal from below inside overflow-hidden mask
          .fromTo(
            [nameLine1Ref.current, nameLine2Ref.current],
            { yPercent: 105, opacity: 0 },
            { yPercent: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out' },
            '-=0.35'
          )
          
          // 3. DETAILS: Designation & Accent Line
          .fromTo(designationRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.3')
          .fromTo(accentLineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power2.out' }, '-=0.25')
          
          // 4. DESCRIPTION: Staggered reveal
          .fromTo(bioParagraphRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.25')
          
          // 5. DETAILS: Pillars subtle fade/slide
          .fromTo(pillarsRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.2');

        // Continuous subtle scroll parallax on portrait image
        if (portraitImgRef.current && sectionRef.current) {
          gsap.to(portraitImgRef.current, {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      });

      // ====================================================================
      // MOBILE & TABLET EXPERIENCE (< 1024px) — TOUCH OPTIMIZED
      // ====================================================================
      mm.add('(max-width: 1023px)', () => {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });

        scrollTl
          .fromTo(
            labelDotRef.current,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
          )
          .fromTo(
            labelTextRef.current,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' },
            '-=0.2'
          )
          .fromTo(
            portraitMaskRef.current,
            { opacity: 0, scale: 0.94, y: 15 },
            { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: 'power3.out' },
            '-=0.2'
          )
          .fromTo(
            portraitImgRef.current,
            { scale: 1.12 },
            { scale: 1.0, duration: 0.8, ease: 'power2.out' },
            '-=0.6'
          )
          .fromTo(
            [nameLine1Ref.current, nameLine2Ref.current],
            { yPercent: 105, opacity: 0 },
            { yPercent: 0, opacity: 1, stagger: 0.08, duration: 0.55, ease: 'power3.out' },
            '-=0.35'
          )
          .fromTo(
            designationRef.current,
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
            '-=0.2'
          )
          .fromTo(
            accentLineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.45, ease: 'power2.out' },
            '-=0.2'
          )
          .fromTo(
            bioParagraphRef.current,
            { y: 14, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' },
            '-=0.2'
          )
          .fromTo(
            pillarsRef.current,
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
            '-=0.2'
          );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Desktop subtle mouse parallax / perspective sheen on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024 || !portraitCardRef.current) return;
    const rect = portraitCardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(portraitCardRef.current, {
      rotateY: x * 6,
      rotateX: -y * 6,
      duration: 0.45,
      ease: 'power1.out',
      transformPerspective: 1200,
    });
  };

  const handleMouseLeave = () => {
    if (!portraitCardRef.current) return;
    gsap.to(portraitCardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  };

  return (
    <section
      id="leadership"
      ref={sectionRef}
      className="relative w-full h-[100dvh] max-h-[100dvh] bg-[#04060A] text-white flex items-center justify-center py-4 sm:py-6 lg:py-8 px-5 sm:px-10 lg:px-14 xl:px-20 select-none overflow-hidden snap-start snap-always"
    >
      {/* ======================================================== */}
      {/* 1. ATMOSPHERIC BACKDROP & SUBTLE ELECTRIC BLUE RADIANCE   */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft Radial Ambient Aura behind the portrait */}
        <div
          ref={backdropGlowRef}
          className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[950px] h-[600px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.12) 0%, rgba(0, 75, 180, 0.04) 45%, transparent 75%)',
            filter: 'blur(90px)',
          }}
        />

        {/* Cinematic Film Vignette: Top & Bottom Blends */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#05070A] via-[#04060A]/80 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#04060A] via-[#04060A]/90 to-transparent" />

        {/* Minimalist Architectural Horizon Grid Lines */}
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:5rem_5rem]" />
      </div>

      {/* ======================================================== */}
      {/* 2. VIEWPORT CONTAINER — BESPOKE EDITORIAL SPREAD          */}
      {/* ======================================================== */}
      <div className="relative w-full max-w-[1720px] mx-auto z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 xs:gap-4 sm:gap-6 lg:gap-12 xl:gap-16 items-center">
          
          {/* ==================================================== */}
          {/* LEFT: LARGE FOUNDER PORTRAIT                         */}
          {/* ==================================================== */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end order-1">
            <div
              ref={portraitCardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[170px] xs:max-w-[195px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[440px] xl:max-w-[480px] aspect-[4/5] will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Sculpted Outer Architectural Glow Rim */}
              <div className="absolute -inset-1.5 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/15 via-white/5 to-[#008CFF]/25 opacity-40 blur-[2px] pointer-events-none" />

              {/* Mask Container for Progressive Scroll Reveal */}
              <div
                ref={portraitMaskRef}
                className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0A0D14] border border-white/12 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)]"
              >
                {/* Official Founder Photograph */}
                <img
                  ref={portraitImgRef}
                  src="/founder.png"
                  alt="Durgarao Vallepu — Founder, BRANDSHOOTS"
                  className="w-full h-full object-cover object-[center_20%] select-none will-change-transform"
                  loading="eager"
                  draggable={false}
                />

                {/* Bottom Depth Vignette: Fades lower body smoothly into darkness */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(4,6,10,0.9) 0%, rgba(4,6,10,0.35) 60%, transparent 100%)',
                  }}
                />

                {/* Radial Lens Atmosphere */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 30%, transparent 55%, rgba(4,6,10,0.45) 100%)',
                  }}
                />

                {/* Dynamic Light Sweep Bar */}
                <div
                  ref={lightSheenRef}
                  className="absolute inset-y-0 w-1/2 -skew-x-12 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)',
                  }}
                />

                {/* Subtle Editorial Corner Ticks */}
                <div className="absolute top-3.5 left-3.5 w-2.5 h-2.5 border-t border-l border-white/30 pointer-events-none" />
                <div className="absolute top-3.5 right-3.5 w-2.5 h-2.5 border-t border-r border-white/30 pointer-events-none" />
                <div className="absolute bottom-3.5 left-3.5 w-2.5 h-2.5 border-b border-l border-white/30 pointer-events-none" />
                <div className="absolute bottom-3.5 right-3.5 w-2.5 h-2.5 border-b border-r border-white/30 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* RIGHT: EDITORIAL TYPOGRAPHY & FOUNDER MATTER         */}
          {/* ==================================================== */}
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left items-center lg:items-start order-2 lg:pl-4 xl:pl-8">
            
            {/* Top Eyebrow: THE LEADERSHIP */}
            <div className="flex items-center gap-2 sm:gap-2.5 mb-1.5 sm:mb-3">
              <span
                ref={labelDotRef}
                className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#008CFF] shadow-[0_0_10px_#008CFF] inline-block shrink-0"
              />
              <span
                ref={labelTextRef}
                className="font-mono text-[11px] sm:text-xs md:text-[13px] tracking-[0.35em] uppercase text-[#008CFF] font-semibold"
              >
                03 // THE LEADERSHIP
              </span>
            </div>

            {/* Large Founder Name: DURGARAO VALLEPU */}
            <div className="overflow-hidden">
              <h2 className="font-display font-black uppercase tracking-[-0.035em] text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.88] text-[#F7F9FF] filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.9)]">
                <span className="overflow-hidden block py-0.5">
                  <span ref={nameLine1Ref} className="inline-block will-change-transform">
                    DURGARAO
                  </span>
                </span>
                <span className="overflow-hidden block py-0.5">
                  <span ref={nameLine2Ref} className="inline-block will-change-transform text-[#F7F9FF]">
                    VALLEPU
                  </span>
                </span>
              </h2>
            </div>

            {/* Designation & Electric Line */}
            <div ref={designationRef} className="flex items-center gap-2 sm:gap-2.5 mt-1.5 sm:mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_6px_#008CFF]" />
              <p className="font-mono text-xs sm:text-sm md:text-[15px] tracking-[0.26em] uppercase text-white/80 font-medium">
                Founder, <span className="text-[#008CFF] font-semibold">BRANDSHOOTS</span>
              </p>
            </div>

            {/* Gradient Accent Divider */}
            <div
              ref={accentLineRef}
              className="w-20 sm:w-32 lg:w-36 h-[1.5px] sm:h-[2px] bg-gradient-to-r from-[#008CFF] to-transparent my-2 sm:my-3 lg:my-4 origin-left"
            />

            {/* Editorial Founder Statement ("Matter about him") */}
            <div className="max-w-xl">
              <p
                ref={bioParagraphRef}
                className="font-editorial text-xs xs:text-sm sm:text-base lg:text-lg xl:text-[19px] leading-[1.45] sm:leading-[1.6] text-white/75 font-normal tracking-[-0.01em] line-clamp-3 xs:line-clamp-4 lg:line-clamp-none"
              >
                Leading the creative direction and cinematic vision at BRANDSHOOTS. Driven by the philosophy that transformative brands are forged at the intersection of high-impact visual storytelling and strategic digital scale — shaping every film, commercial, and campaign to capture genuine human emotion and command cultural presence.
              </p>
            </div>

            {/* Core Tenets / Pillars: Echoing CREATE. SHOOT. GROW. */}
            <div
              ref={pillarsRef}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 xs:gap-2 sm:gap-3 mt-3 sm:mt-5 lg:mt-6 pt-2.5 sm:pt-4 border-t border-white/10"
            >
              <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[10px] xs:text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-white/70">
                CREATE WITH INTENT
              </span>
              <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#008CFF]/10 border border-[#008CFF]/30 text-[10px] xs:text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#008CFF] font-medium">
                SHOOT WITH PURPOSE
              </span>
              <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[10px] xs:text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-white/70">
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
