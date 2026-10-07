import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

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

  // Frame corner ticks refs
  const cornerTLRef = useRef<HTMLDivElement>(null);
  const cornerTRRef = useRef<HTMLDivElement>(null);
  const cornerBRRef = useRef<HTMLDivElement>(null);
  const cornerBLRef = useRef<HTMLDivElement>(null);

  // Right-side typography & matter refs
  const rightContentRef = useRef<HTMLDivElement>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const nameLine1Ref = useRef<HTMLSpanElement>(null);
  const nameLine2Ref = useRef<HTMLSpanElement>(null);
  const designationRef = useRef<HTMLDivElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);
  const bioParagraphRef = useRef<HTMLParagraphElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  // Pill refs
  const pill1Ref = useRef<HTMLSpanElement>(null);
  const pill2Ref = useRef<HTMLSpanElement>(null);
  const pill3Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const corners = [
        cornerTLRef.current,
        cornerTRRef.current,
        cornerBRRef.current,
        cornerBLRef.current,
      ].filter(Boolean);

      const pills = [
        pill1Ref.current,
        pill2Ref.current,
        pill3Ref.current,
      ].filter(Boolean);

      // ====================================================================
      // 1. SPLITTEXT LINE-BY-LINE TYPOGRAPHY SETUP
      // ====================================================================
      let split1: SplitText | null = null;
      let split2: SplitText | null = null;
      let nameLines: HTMLElement[] = [];

      try {
        if (nameLine1Ref.current && nameLine2Ref.current) {
          split1 = new SplitText(nameLine1Ref.current, {
            type: 'lines',
            linesClass: 'overflow-hidden inline-block',
          });
          split2 = new SplitText(nameLine2Ref.current, {
            type: 'lines',
            linesClass: 'overflow-hidden inline-block',
          });
          nameLines = [
            ...(split1.lines as HTMLElement[]),
            ...(split2.lines as HTMLElement[]),
          ];
        }
      } catch {
        // Fallback if DOM not yet measured
        if (nameLine1Ref.current && nameLine2Ref.current) {
          nameLines = [nameLine1Ref.current, nameLine2Ref.current];
        }
      }

      // ====================================================================
      // 2. MASTER ENTRY TIMELINE (Sequential, Cinematic Section Entrance)
      // ====================================================================
      const entryTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // Atmospheric background glow
      if (backdropGlowRef.current) {
        entryTl.fromTo(
          backdropGlowRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' },
          0
        );
      }

      // Eyebrow reveal: dot + text
      if (labelDotRef.current && labelTextRef.current) {
        entryTl
          .fromTo(
            labelDotRef.current,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' },
            0.05
          )
          .fromTo(
            labelTextRef.current,
            { x: -14, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.35, ease: 'power3.out' },
            0.12
          );
      }

      // Image: scale 1.06 → 1, y 30 → 0, opacity 0 → 1
      if (portraitMaskRef.current && portraitImgRef.current) {
        entryTl
          .fromTo(
            portraitMaskRef.current,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1, duration: 0.55, ease: 'power3.out' },
            0.10
          )
          .fromTo(
            portraitImgRef.current,
            { scale: 1.06, y: 30, opacity: 0 },
            { scale: 1.0, y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' },
            0.10
          );
      }

      // Dynamic light sheen sweep
      if (lightSheenRef.current) {
        entryTl.fromTo(
          lightSheenRef.current,
          { xPercent: -130, opacity: 0.85 },
          { xPercent: 220, opacity: 0, duration: 0.65, ease: 'power2.inOut' },
          0.20
        );
      }

      // Frame corners sequential reveal
      if (corners.length > 0) {
        entryTl.fromTo(
          corners,
          { opacity: 0, scale: 0.3 },
          { opacity: 1, scale: 1, duration: 0.3, stagger: 0.06, ease: 'back.out(2)' },
          0.20
        );
      }

      // Reveal DURGARAO VALLEPU line-by-line (masked lines)
      if (nameLines.length > 0) {
        entryTl.fromTo(
          nameLines,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.50, stagger: 0.08, ease: 'power3.out' },
          0.18
        );
      }

      // Role: Founder, BRANDSHOOTS
      if (designationRef.current) {
        entryTl.fromTo(
          designationRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' },
          0.32
        );
      }

      // Blue accent line
      if (accentLineRef.current) {
        entryTl.fromTo(
          accentLineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.40, ease: 'power2.out', transformOrigin: 'left center' },
          0.38
        );
      }

      // Bio paragraph
      if (bioParagraphRef.current) {
        entryTl.fromTo(
          bioParagraphRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' },
          0.42
        );
      }

      // Sequential pills reveal
      if (pills.length > 0) {
        entryTl.fromTo(
          pills,
          { opacity: 0, y: 12, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.06, ease: 'power2.out' },
          0.50
        );
      }

      // ====================================================================
      // 3. GSAP SCROLL SCRUB EXPERIENCE (Cinematic Scroll Parallax)
      // ====================================================================
      mm.add('(min-width: 1024px)', () => {
        // Desktop smooth scrub
        const scrubTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        // Image slowly moves inside its existing frame
        if (portraitImgRef.current) {
          scrubTl.fromTo(portraitImgRef.current, { yPercent: -4 }, { yPercent: 4, ease: 'none' }, 0);
        }

        // Name slightly moves/scales as user scrolls
        if (nameContainerRef.current) {
          scrubTl.fromTo(nameContainerRef.current, { y: -6, scale: 0.99 }, { y: 6, scale: 1.01, ease: 'none' }, 0);
        }

        // Paragraph subtly shifts
        if (bioParagraphRef.current) {
          scrubTl.fromTo(bioParagraphRef.current, { y: -4, opacity: 0.9 }, { y: 4, opacity: 1.0, ease: 'none' }, 0);
        }

        // Blue underline reacts to scroll progress
        if (accentLineRef.current) {
          scrubTl.fromTo(accentLineRef.current, { scaleX: 0.85 }, { scaleX: 1.15, transformOrigin: 'left center', ease: 'none' }, 0);
        }
      });

      mm.add('(max-width: 1023px)', () => {
        // Mobile smooth scrub
        const mobileScrubTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        });

        if (portraitImgRef.current) {
          mobileScrubTl.fromTo(portraitImgRef.current, { yPercent: -3 }, { yPercent: 3, ease: 'none' }, 0);
        }

        if (nameContainerRef.current) {
          mobileScrubTl.fromTo(nameContainerRef.current, { y: -4 }, { y: 4, ease: 'none' }, 0);
        }

        if (accentLineRef.current) {
          mobileScrubTl.fromTo(accentLineRef.current, { scaleX: 0.9 }, { scaleX: 1.1, transformOrigin: 'center center', ease: 'none' }, 0);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Desktop subtle mouse camera parallax (strictly bounded to 3-6px)
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (window.innerWidth < 1024 || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    // Outer card shift: max 5px
    if (portraitCardRef.current) {
      gsap.to(portraitCardRef.current, {
        x: normX * 5,
        y: normY * 5,
        duration: 0.55,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    // Counter image parallax: max 4px
    if (portraitImgRef.current) {
      gsap.to(portraitImgRef.current, {
        x: -normX * 4,
        y: -normY * 4,
        duration: 0.65,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    // Typography drift: max 3px
    if (rightContentRef.current) {
      gsap.to(rightContentRef.current, {
        x: normX * 3,
        y: normY * 3,
        duration: 0.60,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handleMouseLeave = () => {
    if (portraitCardRef.current) {
      gsap.to(portraitCardRef.current, { x: 0, y: 0, duration: 0.7, ease: 'power2.out', overwrite: 'auto' });
    }
    if (portraitImgRef.current) {
      gsap.to(portraitImgRef.current, { x: 0, y: 0, duration: 0.7, ease: 'power2.out', overwrite: 'auto' });
    }
    if (rightContentRef.current) {
      gsap.to(rightContentRef.current, { x: 0, y: 0, duration: 0.7, ease: 'power2.out', overwrite: 'auto' });
    }
  };

  // GSAP Pill Hover / Tap Interactions
  const handlePillEnter = (el: HTMLElement | null, isAccent = false) => {
    if (!el) return;
    gsap.to(el, {
      scale: 1.05,
      y: -2,
      borderColor: 'rgba(0, 140, 255, 0.75)',
      backgroundColor: isAccent ? 'rgba(0, 140, 255, 0.22)' : 'rgba(0, 140, 255, 0.14)',
      boxShadow: '0 0 16px rgba(0, 140, 255, 0.3)',
      color: '#ffffff',
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handlePillLeave = (el: HTMLElement | null, isAccent = false) => {
    if (!el) return;
    gsap.to(el, {
      scale: 1.0,
      y: 0,
      borderColor: isAccent ? 'rgba(0, 140, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
      backgroundColor: isAccent ? 'rgba(0, 140, 255, 0.1)' : 'rgba(255, 255, 255, 0.04)',
      boxShadow: 'none',
      color: isAccent ? '#008CFF' : 'rgba(255, 255, 255, 0.7)',
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handlePillTouchStart = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.to(el, {
      scale: 0.96,
      backgroundColor: 'rgba(0, 140, 255, 0.25)',
      duration: 0.15,
      overwrite: 'auto',
    });
  };

  const handlePillTouchEnd = (el: HTMLElement | null, isAccent = false) => {
    if (!el) return;
    gsap.to(el, {
      scale: 1.0,
      backgroundColor: isAccent ? 'rgba(0, 140, 255, 0.1)' : 'rgba(255, 255, 255, 0.04)',
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  return (
    <section
      id="leadership"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[100dvh] bg-[#04060A] text-white flex items-center justify-center py-8 sm:py-12 lg:py-14 px-5 sm:px-10 lg:px-14 xl:px-20 select-none overflow-hidden"
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
      <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 xs:gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* ==================================================== */}
          {/* LEFT: LARGE FOUNDER PORTRAIT                         */}
          {/* ==================================================== */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end order-1">
            <div
              ref={portraitCardRef}
              className="relative w-full max-w-[190px] xs:max-w-[220px] sm:max-w-[270px] md:max-w-[320px] lg:max-w-[440px] xl:max-w-[480px] aspect-[4/5] will-change-transform"
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

                {/* Subtle Editorial Corner Ticks (Sequentially Animated) */}
                <div ref={cornerTLRef} className="absolute top-3.5 left-3.5 w-2.5 h-2.5 border-t border-l border-white/30 pointer-events-none" />
                <div ref={cornerTRRef} className="absolute top-3.5 right-3.5 w-2.5 h-2.5 border-t border-r border-white/30 pointer-events-none" />
                <div ref={cornerBLRef} className="absolute bottom-3.5 left-3.5 w-2.5 h-2.5 border-b border-l border-white/30 pointer-events-none" />
                <div ref={cornerBRRef} className="absolute bottom-3.5 right-3.5 w-2.5 h-2.5 border-b border-r border-white/30 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* RIGHT: EDITORIAL TYPOGRAPHY & FOUNDER MATTER         */}
          {/* ==================================================== */}
          <div
            ref={rightContentRef}
            className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left items-center lg:items-start order-2 lg:pl-4 xl:pl-8 will-change-transform"
          >
            
            {/* Top Eyebrow: THE LEADERSHIP */}
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span
                ref={labelDotRef}
                className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_6px_#008CFF] inline-block shrink-0"
              />
              <span
                ref={labelTextRef}
                className="font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#008CFF] font-semibold"
              >
                03 // THE LEADERSHIP
              </span>
            </div>

            {/* Large Founder Name: DURGARAO VALLEPU (SplitText Masked Line Reveal) */}
            <div ref={nameContainerRef} className="overflow-hidden will-change-transform">
              <h2 className="font-display font-black uppercase tracking-[-0.035em] text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] text-white filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.9)]">
                <span className="overflow-hidden block py-0.5">
                  <span ref={nameLine1Ref} className="inline-block will-change-transform">
                    DURGARAO
                  </span>
                </span>
                <span className="overflow-hidden block py-0.5">
                  <span ref={nameLine2Ref} className="inline-block will-change-transform text-white">
                    VALLEPU
                  </span>
                </span>
              </h2>
            </div>

            {/* Designation & Electric Line */}
            <div ref={designationRef} className="flex items-center gap-2 mt-3 sm:mt-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_6px_#008CFF]" />
              <p className="font-mono text-xs sm:text-sm tracking-[0.24em] uppercase text-white/75 font-medium">
                Founder, <span className="text-[#008CFF] font-semibold">BRANDSHOOTS</span>
              </p>
            </div>

            {/* Gradient Accent Divider (Reacts to Scroll Scrub) */}
            <div
              ref={accentLineRef}
              className="w-20 sm:w-28 lg:w-32 h-[1.5px] sm:h-[2px] bg-gradient-to-r from-[#008CFF] to-transparent my-2.5 sm:my-3 lg:my-3.5 origin-left"
            />

            {/* Editorial Founder Statement ("Matter about him") */}
            <div className="max-w-xl">
              <p
                ref={bioParagraphRef}
                className="font-sans text-sm sm:text-base lg:text-[17px] leading-[1.65] text-white/75 font-normal"
              >
                Leading the creative direction and cinematic vision at BRANDSHOOTS. Driven by the philosophy that transformative brands are forged at the intersection of high-impact visual storytelling and strategic digital scale — shaping every film, commercial, and campaign to capture genuine human emotion and command cultural presence.
              </p>
            </div>

            {/* Core Tenets / Pillars: Echoing CREATE. SHOOT. GROW. with GSAP Hover/Tap Interactions */}
            <div
              ref={pillarsRef}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mt-5 sm:mt-6"
            >
              <span
                ref={pill1Ref}
                onMouseEnter={() => handlePillEnter(pill1Ref.current, false)}
                onMouseLeave={() => handlePillLeave(pill1Ref.current, false)}
                onPointerDown={() => handlePillTouchStart(pill1Ref.current)}
                onPointerUp={() => handlePillTouchEnd(pill1Ref.current, false)}
                className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] sm:text-xs font-mono uppercase tracking-[0.22em] text-white/75 cursor-pointer select-none will-change-transform inline-block"
              >
                CREATE WITH INTENT
              </span>
              <span
                ref={pill2Ref}
                onMouseEnter={() => handlePillEnter(pill2Ref.current, true)}
                onMouseLeave={() => handlePillLeave(pill2Ref.current, true)}
                onPointerDown={() => handlePillTouchStart(pill2Ref.current)}
                onPointerUp={() => handlePillTouchEnd(pill2Ref.current, true)}
                className="px-3.5 py-1.5 rounded-full bg-[#008CFF]/10 border border-[#008CFF]/30 text-[11px] sm:text-xs font-mono uppercase tracking-[0.22em] text-[#008CFF] font-medium cursor-pointer select-none will-change-transform inline-block"
              >
                SHOOT WITH PURPOSE
              </span>
              <span
                ref={pill3Ref}
                onMouseEnter={() => handlePillEnter(pill3Ref.current, false)}
                onMouseLeave={() => handlePillLeave(pill3Ref.current, false)}
                onPointerDown={() => handlePillTouchStart(pill3Ref.current)}
                onPointerUp={() => handlePillTouchEnd(pill3Ref.current, false)}
                className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] sm:text-xs font-mono uppercase tracking-[0.22em] text-white/75 cursor-pointer select-none will-change-transform inline-block"
              >
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
