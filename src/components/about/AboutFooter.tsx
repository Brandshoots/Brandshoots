import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Youtube, Facebook, ArrowUpRight, ArrowUp, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface AboutFooterProps {
  onOpenContact?: () => void;
}

export const AboutFooter: React.FC<AboutFooterProps> = ({ onOpenContact: _onOpenContact }) => {
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const glowAuraRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const btnWrapperRef = useRef<HTMLDivElement>(null);
  const magneticBtnRef = useRef<HTMLButtonElement>(null);
  const btnContentRef = useRef<HTMLSpanElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Heavy GSAP Animation for Ready to Collaborate
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!ctaSectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ctaSectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      // Initial Setup
      gsap.set(glowAuraRef.current, { scale: 0.6, opacity: 0 });
      gsap.set(tagRef.current, { y: 20, opacity: 0 });
      gsap.set(line1Ref.current, { yPercent: 110, rotateX: 20, opacity: 0 });
      gsap.set(line2Ref.current, { yPercent: 110, rotateX: 20, opacity: 0 });
      gsap.set(copyRef.current, { y: 30, opacity: 0 });
      gsap.set(btnWrapperRef.current, { scale: 0.8, y: 25, opacity: 0 });

      tl.to(
        glowAuraRef.current,
        { scale: 1.2, opacity: 0.75, duration: 1.1, ease: 'power2.out' },
        0
      )
        .to(
          tagRef.current,
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
          0.1
        )
        .to(
          line1Ref.current,
          { yPercent: 0, rotateX: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
          0.2
        )
        .to(
          line2Ref.current,
          { yPercent: 0, rotateX: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
          0.36
        )
        .to(
          copyRef.current,
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
          0.52
        )
        .to(
          btnWrapperRef.current,
          { scale: 1, y: 0, opacity: 1, duration: 0.75, ease: 'back.out(1.5)' },
          0.66
        );

      // Scroll Parallax on Headline
      gsap.to([line1Ref.current, line2Ref.current], {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: ctaSectionRef.current,
          start: 'top center',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, ctaSectionRef);

    return () => ctx.revert();
  }, []);

  // Magnetic Button Hover Physics
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.innerWidth < 1024 || !magneticBtnRef.current) return;
    const rect = magneticBtnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(magneticBtnRef.current, {
      x: x * 0.35,
      y: y * 0.35,
      scale: 1.04,
      duration: 0.3,
      ease: 'power2.out',
    });

    if (btnContentRef.current) {
      gsap.to(btnContentRef.current, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = () => {
    if (!magneticBtnRef.current) return;
    gsap.to(magneticBtnRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: 'elastic.out(1.1, 0.4)',
    });

    if (btnContentRef.current) {
      gsap.to(btnContentRef.current, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1.1, 0.4)',
      });
    }
  };

  return (
    <footer className="relative w-full bg-[#030508] text-white border-t border-white/10 select-none overflow-hidden">
      {/* ======================================================== */}
      {/* 1. FINAL ABOUT CALL TO ACTION: READY TO COLLABORATE       */}
      {/* ======================================================== */}
      <div
        ref={ctaSectionRef}
        className="relative z-10 max-w-5xl mx-auto text-center py-28 sm:py-36 px-6 sm:px-12 border-b border-white/[0.08] overflow-hidden"
      >
        {/* Ambient Volumetric Blue Core */}
        <div
          ref={glowAuraRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[950px] h-[550px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.22) 0%, rgba(11, 16, 78, 0.25) 50%, transparent 75%)',
            filter: 'blur(95px)',
          }}
        />

        {/* Tag Pill */}
        <div
          ref={tagRef}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#008CFF]/10 border border-[#008CFF]/30 mb-7"
        >
          <span className="w-2 h-2 rounded-full bg-[#008CFF] shadow-[0_0_10px_#008CFF]" />
          <span className="font-mono text-xs tracking-[0.28em] uppercase text-[#008CFF] font-semibold">
            READY TO COLLABORATE?
          </span>
        </div>

        {/* Monolithic Heading with Masked Line Splitting */}
        <h2 className="font-display font-black uppercase text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.88] tracking-tight text-[#F7F9FF] mb-7 filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)]">
          <span className="overflow-hidden block py-1">
            <span ref={line1Ref} className="inline-block will-change-transform">
              LET’S CREATE SOMETHING
            </span>
          </span>
          <span className="overflow-hidden block py-1 mt-0.5 sm:mt-1">
            <span
              ref={line2Ref}
              className="inline-block will-change-transform text-[#008CFF] drop-shadow-[0_0_30px_rgba(0,140,255,0.7)]"
            >
              UNFORGETTABLE.
            </span>
          </span>
        </h2>

        {/* Supporting Copy */}
        <div className="overflow-hidden max-w-xl mx-auto mb-11">
          <p
            ref={copyRef}
            className="font-editorial text-base sm:text-lg md:text-xl text-white/70 leading-relaxed font-normal"
          >
            Have an idea, a brand, or a visual production worth elevating? Partner with BrandShoots.
          </p>
        </div>

        {/* Magnetic Interactive CTA Button */}
        <div
          ref={btnWrapperRef}
          className="flex items-center justify-center will-change-transform"
        >
          <Link
            to="/contact"
            ref={magneticBtnRef as any}
            onMouseMove={handleMouseMove as any}
            onMouseLeave={handleMouseLeave}
            className="relative inline-flex items-center gap-3.5 sm:gap-4 px-10 sm:px-14 py-4 sm:py-5 rounded-full bg-[#080D17] border border-[#008CFF]/70 hover:border-[#008CFF] text-[#F7F9FF] font-mono text-xs sm:text-sm tracking-[0.28em] uppercase font-bold shadow-[0_0_30px_rgba(0,140,255,0.3)] hover:shadow-[0_0_55px_rgba(0,140,255,0.7)] transition-all duration-200 cursor-pointer active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#008CFF]/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
            <span
              ref={btnContentRef}
              className="relative z-10 flex items-center gap-3 sm:gap-4"
            >
              <Sparkles className="w-4 h-4 text-[#008CFF] animate-pulse" />
              <span>GET IN TOUCH</span>
              <ArrowUpRight className="w-4 h-4 text-[#008CFF]" />
            </span>
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. BASE FOOTER NAVIGATION & BRAND IDENTITY               */}
      {/* ======================================================== */}
      <div className="relative z-10 max-w-[1720px] mx-auto px-6 sm:px-12 lg:px-16 pt-12 pb-10 flex flex-col justify-between">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pb-10 border-b border-white/[0.08]">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start">
            <Link
              to="/"
              className="inline-block transition-transform duration-200 hover:scale-[1.03]"
            >
              <img
                src="/Logo Official.svg"
                alt="BrandShoots Official Logo"
                className="h-11 sm:h-12 w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
              />
            </Link>
            <span className="font-mono text-[11px] tracking-[0.24em] text-white/50 uppercase mt-3">
              CREATIVE BRANDING & PRODUCTION STUDIO
            </span>
          </div>

          {/* Nav links */}
          <nav aria-label="About Footer Navigation">
            <ul className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-mono tracking-[0.22em] uppercase text-white/70 font-medium">
              <li>
                <Link to="/" className="hover:text-[#008CFF] transition-colors">
                  HOME
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('manifesto')}
                  className="hover:text-[#008CFF] transition-colors cursor-pointer"
                >
                  MANIFESTO
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('brandshoots-core')}
                  className="hover:text-[#008CFF] transition-colors cursor-pointer"
                >
                  3D CORE
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('capabilities')}
                  className="hover:text-[#008CFF] transition-colors cursor-pointer"
                >
                  CAPABILITIES
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('leadership')}
                  className="hover:text-[#008CFF] transition-colors cursor-pointer"
                >
                  LEADERSHIP
                </button>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-[#008CFF] hover:text-[#60B8FF] font-semibold cursor-pointer"
                >
                  CONTACT
                </Link>
              </li>
            </ul>
          </nav>

          {/* Socials & Back to Top */}
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/wearebrandshoots"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @wearebrandshoots"
              className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-[#008CFF] border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all shadow-md active:scale-95"
            >
              <Instagram className="w-4 h-4" />
            </a>

            <a
              href="https://youtube.com/@wearebrandshoots"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube @wearebrandshoots"
              className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-[#008CFF] border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all shadow-md active:scale-95"
            >
              <Youtube className="w-4 h-4" />
            </a>

            <a
              href="https://facebook.com/wearebrandshoots"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook @wearebrandshoots"
              className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-[#008CFF] border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all shadow-md active:scale-95"
            >
              <Facebook className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll to Top"
              className="w-10 h-10 rounded-full bg-white/[0.04] hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all ml-2 active:scale-95 cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="font-mono text-[11px] sm:text-xs tracking-[0.22em] text-white/40 uppercase">
            © BRANDSHOOTS. ALL RIGHTS RESERVED.
          </p>
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] text-white/30 uppercase">
            CREATE. SHOOT. GROW.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AboutFooter;
