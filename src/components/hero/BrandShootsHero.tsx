import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReelWall3D } from './ReelWall3D';
import { HeroCinematicBackground } from './HeroCinematicBackground';
import { MobileCinematicHero } from './MobileCinematicHero';

gsap.registerPlugin(ScrollTrigger);

export const BrandShootsHero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleBrandRef = useRef<HTMLSpanElement>(null);
  const titleShootsRef = useRef<HTMLSpanElement>(null);
  const reelWallContainerRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance Timeline for the Hero
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Initial state
      gsap.set(
        [
          titleBrandRef.current,
          titleShootsRef.current,
          taglineRef.current,
          scrollIndicatorRef.current,
        ],
        { opacity: 0 }
      );

      gsap.set(titleBrandRef.current, { y: 16, scale: 0.98 });
      gsap.set(titleShootsRef.current, { y: 16, scale: 0.98 });
      gsap.set(reelWallContainerRef.current, { opacity: 0, scale: 0.98 });
      gsap.set(taglineRef.current, { y: 8 });
      gsap.set(scrollIndicatorRef.current, { y: 8 });

      // Sequenced entrance
      tl.to(
        reelWallContainerRef.current,
        { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
        0.1
      )
        .to(
          [titleBrandRef.current, titleShootsRef.current],
          { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.08 },
          '-=0.35'
        )
        .to(taglineRef.current, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
        .to(scrollIndicatorRef.current, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2');

      // Subtle float animation on scroll indicator
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          y: '+=5',
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1.0,
        });
      }

      // CINEMATIC EXIT SCRUB (HERO -> SECTION 02):
      // As user scrolls down leaving the hero:
      // - Reel wall scales forward and curves outward as camera glides through
      // - Hero title moves upward and recedes with depth blur
      // - Tagline and scroll indicator dissolve gracefully
      if (heroRef.current) {
        const exitTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        });

        if (reelWallContainerRef.current) {
          exitTl.to(
            reelWallContainerRef.current,
            { y: -140, scale: 1.18, opacity: 0.15, filter: 'blur(6px)', ease: 'power1.out' },
            0
          );
        }

        if (titleBrandRef.current && titleShootsRef.current) {
          exitTl.to(
            [titleBrandRef.current, titleShootsRef.current],
            { y: -90, scale: 0.88, opacity: 0, filter: 'blur(10px)', ease: 'power1.out' },
            0
          );
        }

        if (taglineRef.current) {
          exitTl.to(taglineRef.current, { y: -50, opacity: 0, ease: 'power1.out' }, 0);
        }

        if (scrollIndicatorRef.current) {
          exitTl.to(scrollIndicatorRef.current, { y: -30, opacity: 0, ease: 'power1.out' }, 0);
        }
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToAbout = () => {
    if ((window as any).__lenis) {
      (window as any).__lenis.scrollTo('#what-we-do', { duration: 0.85 });
    } else {
      const el = document.getElementById('what-we-do');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full h-[100svh] min-h-[100svh] max-h-[100svh] md:h-[100dvh] md:max-h-[100dvh] bg-[#05070A] text-white overflow-hidden select-none"
    >
      {/* ========================================================= */}
      {/* 1. CINEMATIC BACKGROUND ENVIRONMENTS                      */}
      {/* ========================================================= */}
      {/* Mobile: Dedicated Responsive Composition */}
      <div className="block md:hidden w-full h-full">
        <MobileCinematicHero />
      </div>

      {/* Desktop: Three.js Particles + Parallax Environment */}
      <div className="hidden md:block">
        <HeroCinematicBackground />
        <div className="absolute inset-0 cinema-grain pointer-events-none z-20 opacity-30" />
        <div className="absolute inset-0 cinema-vignette pointer-events-none z-10 opacity-55" />
      </div>

      {/* ========================================================= */}
      {/* 2. CENTERPIECE: 3D TITLE & CYLINDRICAL REEL INSTALLATION */}
      {/* ========================================================= */}

      {/* Massive Central Title: BRANDSHOOTS with Physical 3D Extrusion Depth (Layered in Front of Carousel) */}
      <div className="hidden md:block absolute top-[16vh] lg:top-[17vh] left-0 right-0 z-30 text-center select-none pointer-events-none px-6 sm:px-10">
        <h1 className="font-display font-black tracking-[-0.038em] uppercase text-[10vw] lg:text-[9.2vw] xl:text-[132px] leading-[0.88] flex items-center justify-center">
          {/* BRAND — clean flat electric blue */}
          <span
            ref={titleBrandRef}
            className="inline-block text-[#008CFF]"
            style={{ textShadow: '0 4px 24px rgba(0,0,0,0.8)' }}
          >
            BRAND
          </span>

          {/* SHOOTS — clean flat white */}
          <span
            ref={titleShootsRef}
            className="inline-block text-white ml-[0.015em]"
            style={{ textShadow: '0 4px 24px rgba(0,0,0,0.8)' }}
          >
            SHOOTS
          </span>
        </h1>
      </div>

      {/* REAL 3D CYLINDRICAL REEL WALL INSTALLATION (Desktop Only) */}
      <div
        ref={reelWallContainerRef}
        className="hidden md:block absolute top-[56%] left-0 right-0 md:-translate-y-1/2 w-full h-[580px] z-10 pointer-events-none overflow-hidden"
      >
        <ReelWall3D />
      </div>

      {/* Atmospheric Horizon Gradient Buffer for Tagline & Scroll Indicator Contrast */}
      <div
        className="hidden md:block absolute bottom-0 inset-x-0 h-44 pointer-events-none z-20"
        style={{
          background:
            'linear-gradient(to top, rgba(5,7,10,0.98) 0%, rgba(5,7,10,0.85) 45%, rgba(5,7,10,0.2) 80%, transparent 100%)',
        }}
      />

      {/* ========================================================= */}
      {/* 5. FOOTER: TAGLINE & SCROLL INDICATOR                    */}
      {/* ========================================================= */}

      {/* Tagline: CREATE. SHOOT. GROW. (Desktop Only) */}
      <div
        ref={taglineRef}
        className="hidden md:block absolute bottom-[17.5vh] left-0 right-0 z-30 font-mono text-[13px] lg:text-[14px] tracking-[0.48em] uppercase font-bold text-center pointer-events-none"
      >
        <span className="text-white">CREATE. </span>
        <span className="text-[#008CFF] drop-shadow-[0_0_14px_rgba(0,140,255,0.85)]">
          SHOOT.
        </span>
        <span className="text-white"> GROW.</span>
      </div>

      {/* Scroll Down Indicator (Desktop Only) */}
      <div
        ref={scrollIndicatorRef}
        className="hidden md:flex absolute bottom-[5.5vh] left-0 right-0 z-30 flex-col items-center gap-1 cursor-pointer text-white/55 hover:text-white transition-colors duration-200"
        onClick={() => {
          scrollToAbout();
        }}
      >
        {/* Blue Down Arrow */}
        <svg
          className="w-4 h-4 text-[#008CFF] drop-shadow-[0_0_8px_#008CFF]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>

        {/* S C R O L L   D O W N */}
        <span className="font-mono text-[10px] tracking-[0.38em] uppercase font-medium text-white/60">
          Scroll Down
        </span>
      </div>
    </section>
  );
};

export default BrandShootsHero;
