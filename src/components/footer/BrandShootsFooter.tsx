import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Youtube, Facebook, ArrowUp, ArrowUpRight } from 'lucide-react';
import { ContactModal } from '../hero/ContactModal';
import { BRAND_PATHS, SHOOTS_PATHS, BRANDSHOOTS_LOGO_VIEWBOX } from './brandshootsLogoPaths';

gsap.registerPlugin(ScrollTrigger);

interface BrandShootsFooterProps {
  onOpenContact?: () => void;
}

export const BrandShootsFooter: React.FC<BrandShootsFooterProps> = ({ onOpenContact }) => {
  const [internalModalOpen, setInternalModalOpen] = useState(false);

  // Core DOM refs for GSAP choreography
  const footerRef = useRef<HTMLElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const logoSvgRef = useRef<SVGSVGElement>(null);
  const revealBladeRef = useRef<HTMLDivElement>(null);
  const blueLayerRef = useRef<SVGGElement>(null);
  const whiteLayerRef = useRef<SVGGElement>(null);
  const lightSweepRectRef = useRef<SVGRectElement>(null);
  const logoGlowRef = useRef<HTMLDivElement>(null);

  const taglineRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);

  const handleOpenContact = () => {
    if (onOpenContact) {
      onOpenContact();
    } else {
      setInternalModalOpen(true);
    }
  };

  const scrollToTop = () => {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(`#${id}`, { duration: 0.85 });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // ====================================================================
  // 1. UNIQUE LIVING LOGO INTERACTION: 3D PARALLAX & LIGHT SWEEP
  // ====================================================================
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!logoWrapRef.current) return;
    const rect = logoWrapRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    // Subtle 3D tilt on the main logo chassis
    gsap.to(logoWrapRef.current, {
      rotateY: nx * 7,
      rotateX: -ny * 5,
      scale: 1.025,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    // Blue layer parallax: shifts smoothly by a few pixels for visual depth
    if (blueLayerRef.current) {
      gsap.to(blueLayerRef.current, {
        x: nx * 9,
        y: ny * 5,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    // White layer: anchored and dominant (very subtle companion offset)
    if (whiteLayerRef.current) {
      gsap.to(whiteLayerRef.current, {
        x: nx * 2.5,
        y: ny * 1.5,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    // Dynamic backlight tracks pointer movement
    if (logoGlowRef.current) {
      gsap.to(logoGlowRef.current, {
        x: nx * 35,
        y: ny * 20,
        opacity: 0.22,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const triggerLightSweep = () => {
    if (lightSweepRectRef.current) {
      gsap.fromTo(
        lightSweepRectRef.current,
        { x: -400, opacity: 0.85 },
        { x: 1900, opacity: 0, duration: 1.0, ease: 'power2.out', overwrite: 'auto' }
      );
    }
  };

  const handlePointerEnter = () => {
    triggerLightSweep();
  };

  const handlePointerLeave = () => {
    if (logoWrapRef.current) {
      gsap.to(logoWrapRef.current, {
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.65,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
    if (blueLayerRef.current) {
      gsap.to(blueLayerRef.current, {
        x: 0,
        y: 0,
        duration: 0.65,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
    if (whiteLayerRef.current) {
      gsap.to(whiteLayerRef.current, {
        x: 0,
        y: 0,
        duration: 0.65,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
    if (logoGlowRef.current) {
      gsap.to(logoGlowRef.current, {
        x: 0,
        y: 0,
        opacity: 0.12,
        duration: 0.65,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
  };

  // Logo Click: Subtly compresses then smoothly scrolls to top
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerLightSweep();
    if (logoWrapRef.current) {
      gsap.timeline()
        .to(logoWrapRef.current, {
          scale: 0.95,
          duration: 0.12,
          ease: 'power2.in',
        })
        .to(logoWrapRef.current, {
          scale: 1,
          duration: 0.4,
          ease: 'back.out(2)',
          onComplete: () => {
            scrollToTop();
          },
        });
    } else {
      scrollToTop();
    }
  };

  // ====================================================================
  // 2. GSAP SCROLLTRIGGER CHOREOGRAPHY — CINEMATIC FINAL FILM FRAME
  // Sequence:
  // 1. Background slowly darkens & atmosphere blooms
  // 2. Logo begins stroke / mask reveal with electric-blue blade
  // 3. Logo settles into center
  // 4. Blue light sweep passes across
  // 5. CREATE. SHOOT. GROW. reveals underneath
  // 6. Closing statement reveals line-by-line
  // 7. Navigation links stagger in
  // 8. Social icons settle last
  // 9. Copyright appears at the very end
  // ====================================================================
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!footerRef.current) return;

      const statementLines = statementRef.current?.querySelectorAll('.statement-line');
      const navItems = navContainerRef.current?.querySelectorAll('.nav-link-item');
      const socialBtns = socialsRef.current?.querySelectorAll('.social-btn');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });

      // 1. Atmosphere blooms
      tl.fromTo(
        atmosphereRef.current,
        { opacity: 0, scale: 0.88 },
        { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' },
        0
      );

      // 2. Logo mask reveal (CSS polygon clipPath wipe from left to right)
      if (logoSvgRef.current) {
        tl.fromTo(
          logoSvgRef.current,
          { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)', opacity: 1 },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            opacity: 1,
            duration: 0.95,
            ease: 'power2.inOut',
            onComplete: () => {
              if (logoSvgRef.current) {
                logoSvgRef.current.style.clipPath = 'none';
              }
            },
          },
          0.08
        );
      }

      // 2b. Reveal glow blade moving alongside mask wipe
      if (revealBladeRef.current) {
        tl.fromTo(
          revealBladeRef.current,
          { left: '0%', opacity: 1 },
          { left: '100%', opacity: 0, duration: 0.95, ease: 'power2.inOut' },
          0.08
        );
      }

      // 3. Logo settles into center with authoritative 3D lift
      tl.fromTo(
        logoWrapRef.current,
        { opacity: 0, y: 32, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' },
        0.12
      );

      // 4. Blue light sweep passes cleanly across the newly revealed logo
      if (lightSweepRectRef.current) {
        tl.fromTo(
          lightSweepRectRef.current,
          { x: -350, opacity: 0.9 },
          { x: 1900, opacity: 0, duration: 0.85, ease: 'power2.out' },
          0.75
        );
      }

      // 5. CREATE. SHOOT. GROW. reveals underneath
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 12, letterSpacing: '0.24em' },
        { opacity: 1, y: 0, letterSpacing: '0.38em', duration: 0.55, ease: 'power2.out' },
        0.9
      );

      // 6. Closing statement reveals line-by-line
      if (statementLines && statementLines.length > 0) {
        tl.fromTo(
          Array.from(statementLines),
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: 'power3.out' },
          1.05
        );
      }

      // 7. Navigation links stagger in
      if (navItems && navItems.length > 0) {
        tl.fromTo(
          Array.from(navItems),
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out' },
          1.25
        );
      }

      // 8. Social icons settle with subtle scale bounce
      if (socialBtns && socialBtns.length > 0) {
        tl.fromTo(
          Array.from(socialBtns),
          { scale: 0.8, opacity: 0, y: 12 },
          { scale: 1, opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'back.out(1.4)' },
          1.4
        );
      }

      // 9. Copyright & Back-to-Top appear last
      tl.fromTo(
        copyrightRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
        1.55
      );


      // IntersectionObserver guarantee: triggers entrance smoothly whenever footer is in view
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            tl.play();
            observer.disconnect();
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(footerRef.current);

      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      return () => {
        observer.disconnect();
        clearTimeout(refreshTimer);
      };
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <footer
        id="footer"
        ref={footerRef}
        className="relative w-full bg-[#020408] text-white border-t border-white/[0.08] select-none overflow-hidden"
      >
        {/* ========================================================= */}
        {/* VISUAL ENVIRONMENT: CINEMATIC STUDIO ATMOSPHERE           */}
        {/* ========================================================= */}
        {/* Faint blue horizon glow at top border */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#008CFF]/35 to-transparent pointer-events-none" />

        {/* Deep navy atmospheric light behind logo & light falloff */}
        <div
          ref={atmosphereRef}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1300px] h-[520px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 20%, rgba(0, 140, 255, 0.09) 0%, rgba(2, 10, 28, 0.45) 50%, transparent 80%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Faint film grain overlay */}
        <div className="absolute inset-0 cinema-grain opacity-15 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-16 sm:pt-22 lg:pt-28 pb-10 sm:pb-12 flex flex-col items-center text-center">
          
          {/* ========================================================= */}
          {/* 1. TOP HEROIC VISUAL: LARGE CENTERED BRANDSHOOTS SVG LOGO */}
          {/* THE LOGO IS THE EXPERIENCE — FINAL FRAME OF FILM          */}
          {/* ========================================================= */}
          <div className="relative w-full flex flex-col items-center">
            
            {/* Clickable Living Logo Container with 3D Parallax & Sweep */}
            <div
              ref={logoWrapRef}
              onPointerMove={handlePointerMove}
              onPointerEnter={handlePointerEnter}
              onPointerLeave={handlePointerLeave}
              onClick={handleLogoClick}
              role="button"
              tabIndex={0}
              aria-label="BrandShoots — Back to Top"
              className="relative cursor-pointer group select-none py-2 px-3 sm:px-6 inline-flex flex-col items-center focus:outline-none"
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Dynamic Living Ambient Backlight behind logo */}
              <div
                ref={logoGlowRef}
                className="absolute inset-0 pointer-events-none rounded-full blur-[60px] opacity-12 bg-radial from-[#008CFF]/50 via-[#004880]/20 to-transparent transition-opacity duration-300"
              />

              {/* Reveal Blade (electric-blue trailing light line during mask reveal) */}
              <div
                ref={revealBladeRef}
                className="absolute top-2 bottom-2 w-[2px] bg-gradient-to-b from-transparent via-[#008CFF] to-transparent pointer-events-none filter drop-shadow-[0_0_8px_#008CFF]"
                style={{ opacity: 0 }}
              />

              {/* Genuine BRANDSHOOTS Vector SVG — Preserves 100% Brand Vector Art */}
              <svg
                ref={logoSvgRef}
                viewBox={BRANDSHOOTS_LOGO_VIEWBOX}
                className="w-full max-w-[320px] xs:max-w-[420px] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl h-auto overflow-visible filter drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Soft Electric-Blue Shimmer / Light Sweep Gradient */}
                  <linearGradient id="brandshootsFooterSweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#008CFF" stopOpacity="0" />
                    <stop offset="30%" stopColor="#008CFF" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#80D0FF" stopOpacity="0.85" />
                    <stop offset="70%" stopColor="#008CFF" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#008CFF" stopOpacity="0" />
                  </linearGradient>

                  {/* Alpha Mask for Light Sweep restricted to Logo Letters */}
                  <mask id="brandshootsFooterSweepMask">
                    <g>
                      {BRAND_PATHS.map((d, i) => (
                        <path key={`mask-b-${i}`} d={d} fill="#FFFFFF" />
                      ))}
                      {SHOOTS_PATHS.map((d, i) => (
                        <path key={`mask-s-${i}`} d={d} fill="#FFFFFF" />
                      ))}
                    </g>
                  </mask>
                </defs>

                {/* Main Logo Group */}
                <g>
                  {/* Blue Layer: BRAND (Shifts with Parallax for Optical Depth) */}
                  <g ref={blueLayerRef} className="logo-blue-layer">
                    {BRAND_PATHS.map((d, i) => (
                      <path
                        key={`brand-path-${i}`}
                        d={d}
                        fill="#018CFB"
                        className="transition-colors duration-200"
                      />
                    ))}
                  </g>

                  {/* White Layer: SHOOTS (Remains Dominant Visual Anchor) */}
                  <g ref={whiteLayerRef} className="logo-white-layer">
                    {SHOOTS_PATHS.map((d, i) => (
                      <path
                        key={`shoots-path-${i}`}
                        d={d}
                        fill="#FEFEFE"
                        className="transition-colors duration-200"
                      />
                    ))}
                  </g>

                  {/* Traversing Light Sweep Beam */}
                  <rect
                    ref={lightSweepRectRef}
                    x="180"
                    y="360"
                    width="450"
                    height="230"
                    fill="url(#brandshootsFooterSweepGrad)"
                    mask="url(#brandshootsFooterSweepMask)"
                    style={{ mixBlendMode: 'screen', opacity: 0 }}
                  />
                </g>
              </svg>

              {/* Subtle Horizon / Reflection & Contact Shadow Beneath Logo */}
              <div className="w-4/5 max-w-xl h-4 bg-gradient-to-r from-transparent via-[#008CFF]/20 to-transparent blur-md rounded-full mt-1 sm:mt-2 pointer-events-none" />
            </div>

            {/* CREATE. SHOOT. GROW. Tagline Underneath Logo */}
            <div
              ref={taglineRef}
              className="mt-4 sm:mt-5 flex items-center justify-center gap-2 sm:gap-2.5 font-mono text-[10px] xs:text-[11px] sm:text-xs md:text-sm tracking-[0.38em] uppercase font-bold text-white/55"
            >
              <span className="text-white/80">CREATE.</span>
              <span className="text-[#008CFF] drop-shadow-[0_0_10px_rgba(0,140,255,0.75)]">SHOOT.</span>
              <span className="text-white/80">GROW.</span>
            </div>

            {/* Powerful Closing Statement: "LET'S CREATE SOMETHING WORTH REMEMBERING." */}
            <div ref={statementRef} className="mt-8 sm:mt-11 max-w-3xl px-4">
              <div className="overflow-hidden">
                <span className="statement-line inline-block font-display font-black tracking-[-0.03em] uppercase text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-[44px] leading-[1.1] text-white">
                  LET'S CREATE SOMETHING
                </span>
              </div>
              <div className="overflow-hidden mt-1 sm:mt-1.5">
                <span className="statement-line inline-block font-display font-black tracking-[-0.03em] uppercase text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-[44px] leading-[1.1] text-white">
                  WORTH <span className="text-[#008CFF] drop-shadow-[0_0_24px_rgba(0,140,255,0.5)]">REMEMBERING.</span>
                </span>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* 2. MIDDLE ROW: EDITORIAL NAVIGATION & SOCIALS             */}
          {/* ========================================================= */}
          <div className="w-full mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-white/[0.08] flex flex-col items-center gap-8 sm:gap-10">
            
            {/* Clean Editorial Navigation Links */}
            <nav
              ref={navContainerRef}
              aria-label="Footer Navigation"
              className="w-full flex justify-center"
            >
              <ul className="grid grid-cols-2 sm:flex sm:items-center justify-center gap-6 sm:gap-10 md:gap-14 lg:gap-16">
                {/* ABOUT */}
                <li className="nav-link-item">
                  <Link
                    to="/about"
                    className="group relative inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-mono tracking-[0.24em] uppercase text-white/70 hover:text-white transition-colors duration-300 py-1"
                  >
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      ABOUT
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#008CFF] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#008CFF] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>

                {/* PORTFOLIO */}
                <li className="nav-link-item">
                  <Link
                    to="/portfolio"
                    className="group relative inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-mono tracking-[0.24em] uppercase text-white/70 hover:text-white transition-colors duration-300 py-1"
                  >
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      PORTFOLIO
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#008CFF] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#008CFF] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>

                {/* SERVICES */}
                <li className="nav-link-item">
                  <button
                    type="button"
                    onClick={() => scrollToSection('what-we-do')}
                    className="group relative inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-mono tracking-[0.24em] uppercase text-white/70 hover:text-white transition-colors duration-300 py-1 cursor-pointer"
                  >
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      SERVICES
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#008CFF] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#008CFF] transition-all duration-300 group-hover:w-full" />
                  </button>
                </li>

                {/* CONTACT */}
                <li className="nav-link-item">
                  <Link
                    to="/contact"
                    onClick={() => {
                      if (onOpenContact && window.location.pathname === '/contact') {
                        handleOpenContact();
                      }
                    }}
                    className="group relative inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-mono tracking-[0.24em] uppercase text-[#008CFF] hover:text-[#52B2FF] font-semibold transition-colors duration-300 py-1 cursor-pointer"
                  >
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      CONTACT
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#008CFF] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#008CFF] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Refined Social Icons with Subtle Circular Outline */}
            <div
              ref={socialsRef}
              className="flex items-center justify-center gap-4"
            >
              {/* Instagram */}
              <a
                href="https://instagram.com/wearebrandshoots"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @wearebrandshoots"
                className="social-btn group relative w-10.5 h-10.5 sm:w-11 sm:h-11 rounded-full border border-white/15 bg-white/[0.03] hover:bg-[#008CFF]/15 hover:border-[#008CFF]/60 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 shadow-sm hover:shadow-[0_0_18px_rgba(0,140,255,0.45)]"
              >
                <Instagram className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110 text-white/80 group-hover:text-white" />
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@wearebrandshoots"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube @wearebrandshoots"
                className="social-btn group relative w-10.5 h-10.5 sm:w-11 sm:h-11 rounded-full border border-white/15 bg-white/[0.03] hover:bg-[#008CFF]/15 hover:border-[#008CFF]/60 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 shadow-sm hover:shadow-[0_0_18px_rgba(0,140,255,0.45)]"
              >
                <Youtube className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110 text-white/80 group-hover:text-white" />
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com/wearebrandshoots"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook @wearebrandshoots"
                className="social-btn group relative w-10.5 h-10.5 sm:w-11 sm:h-11 rounded-full border border-white/15 bg-white/[0.03] hover:bg-[#008CFF]/15 hover:border-[#008CFF]/60 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 shadow-sm hover:shadow-[0_0_18px_rgba(0,140,255,0.45)]"
              >
                <Facebook className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110 text-white/80 group-hover:text-white" />
              </a>
            </div>

          </div>

          {/* ========================================================= */}
          {/* 3. FINAL BRAND MOMENT: COPYRIGHT & BACK TO TOP            */}
          {/* ========================================================= */}
          <div
            ref={copyrightRef}
            className="w-full mt-10 sm:mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left"
          >
            {/* Left: Copyright */}
            <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.24em] text-white/40 uppercase order-2 sm:order-1">
              © BRANDSHOOTS. ALL RIGHTS RESERVED.
            </p>

            {/* Center: Brand Triad */}
            <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.26em] text-white/30 uppercase hidden md:block order-2">
              CREATE. SHOOT. GROW.
            </p>

            {/* Right: Refined Back to Top Interaction */}
            <div className="flex items-center order-1 sm:order-3">
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Return to Top"
                className="group inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.24em] uppercase text-white/60 hover:text-white transition-colors duration-300 cursor-pointer"
              >
                <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
                  BACK TO TOP
                </span>
                <div className="w-7 h-7 rounded-full border border-white/15 group-hover:border-[#008CFF] bg-white/[0.04] group-hover:bg-[#008CFF]/20 flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_12px_rgba(0,140,255,0.4)]">
                  <ArrowUp className="w-3.5 h-3.5 text-white/70 group-hover:text-[#008CFF] transition-colors" />
                </div>
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Integrated Contact Modal */}
      <ContactModal
        isOpen={internalModalOpen}
        onClose={() => setInternalModalOpen(false)}
      />
    </>
  );
};

export default BrandShootsFooter;
