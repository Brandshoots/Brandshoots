import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Youtube, Facebook, X } from 'lucide-react';
import { ReelWall3D } from './ReelWall3D';
import { HeroCinematicBackground } from './HeroCinematicBackground';
import { MobileCinematicHero } from './MobileCinematicHero';
import { ContactModal } from './ContactModal';

gsap.registerPlugin(ScrollTrigger);

export const BrandShootsHero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const getInTouchRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const titleBrandRef = useRef<HTMLSpanElement>(null);
  const titleShootsRef = useRef<HTMLSpanElement>(null);
  const reelWallContainerRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileNavLinksRef = useRef<HTMLDivElement>(null);
  const mobileSocialsRef = useRef<HTMLDivElement>(null);

  // Prevent background scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [mobileMenuOpen]);

  // GSAP Entrance Timeline for the Hero
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Initial state
      gsap.set(
        [
          logoRef.current,
          navRef.current,
          getInTouchRef.current,
          hamburgerRef.current,
          titleBrandRef.current,
          titleShootsRef.current,
          taglineRef.current,
          scrollIndicatorRef.current,
        ],
        { opacity: 0 }
      );

      gsap.set(logoRef.current, { y: -10 });
      gsap.set(navRef.current, { y: -10 });
      gsap.set(getInTouchRef.current, { y: -10 });
      gsap.set(hamburgerRef.current, { y: -10 });
      gsap.set(titleBrandRef.current, { y: 16, scale: 0.98 });
      gsap.set(titleShootsRef.current, { y: 16, scale: 0.98 });
      gsap.set(reelWallContainerRef.current, { opacity: 0, scale: 0.98 });
      gsap.set(taglineRef.current, { y: 8 });
      gsap.set(scrollIndicatorRef.current, { y: 8 });

      // Sequenced entrance
      tl.to(logoRef.current, { opacity: 1, y: 0, duration: 0.45 })
        .to(navRef.current, { opacity: 1, y: 0, duration: 0.4 }, '-=0.3')
        .to(getInTouchRef.current, { opacity: 1, y: 0, duration: 0.4 }, '-=0.3')
        .to(hamburgerRef.current, { opacity: 1, y: 0, duration: 0.4 }, '-=0.3')
        .to(
          reelWallContainerRef.current,
          { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.2'
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
      // - Reel wall subtly moves upward/backward with depth
      // - Hero title and tagline slightly scale away
      // - Scroll indicator dissolves
      if (heroRef.current && reelWallContainerRef.current) {
        const exitTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        exitTl
          .to(
            reelWallContainerRef.current,
            { y: -90, scale: 0.92, opacity: 0.35, ease: 'none' },
            0
          )
          .to(
            [titleBrandRef.current, titleShootsRef.current],
            { y: -45, scale: 0.94, opacity: 0.25, ease: 'none' },
            0
          )
          .to(taglineRef.current, { y: -30, opacity: 0, ease: 'none' }, 0)
          .to(scrollIndicatorRef.current, { y: -20, opacity: 0, ease: 'none' }, 0);
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Smooth GSAP animation for Mobile Menu overlay
  useEffect(() => {
    if (mobileMenuOpen && mobileMenuRef.current) {
      const links = mobileNavLinksRef.current?.children;
      const socials = mobileSocialsRef.current?.children;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(mobileMenuRef.current, { opacity: 0 }, { opacity: 1, duration: 0.28 });
      if (links) {
        tl.fromTo(
          links,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 },
          '-=0.12'
        );
      }
      if (socials) {
        tl.fromTo(
          socials,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.04 },
          '-=0.2'
        );
      }
    }
  }, [mobileMenuOpen]);

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

  const scrollToTop = () => {
    if ((window as any).__lenis) {
      (window as any).__lenis.scrollTo(0, { duration: 0.85 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-screen h-[100dvh] max-h-[100dvh] bg-[#05070A] text-white overflow-hidden select-none snap-start snap-always"
    >
      {/* ========================================================= */}
      {/* 1. CINEMATIC BACKGROUND ENVIRONMENTS                      */}
      {/* ========================================================= */}
      {/* Mobile: Full-Screen 9:16 Video Hero with Top/Bottom Blue Gradients */}
      <div className="block md:hidden">
        <MobileCinematicHero />
      </div>

      {/* Desktop: Three.js Particles + Parallax Environment */}
      <div className="hidden md:block">
        <HeroCinematicBackground />
        <div className="absolute inset-0 cinema-grain pointer-events-none z-20 opacity-30" />
        <div className="absolute inset-0 cinema-vignette pointer-events-none z-10 opacity-55" />
      </div>

      {/* ========================================================= */}
      {/* 2. TOP NAVIGATION BAR                                    */}
      {/* ========================================================= */}
      <header className="absolute top-0 left-0 right-0 z-50 w-full px-5 sm:px-8 md:px-12 lg:px-16 pt-5 sm:pt-6 md:pt-7 flex items-center justify-between">
        {/* Brand Logo (Upper Left) - Sized Prominently with highest z-index */}
        <div ref={logoRef} className="flex items-center">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
            className="inline-block transition-transform duration-200 hover:scale-[1.03]"
          >
            <img
              src="/Logo Official.svg"
              alt="BrandShoots Official Logo"
              className="h-12 xs:h-14 sm:h-16 md:h-[68px] lg:h-[78px] w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
            />
          </a>
        </div>

        {/* Desktop Minimal Navigation */}
        <nav
          ref={navRef}
          className="hidden md:flex items-center gap-8 lg:gap-11 text-white/85 font-sans text-xs lg:text-[13px] tracking-[0.22em] uppercase font-medium"
        >
          {/* Home Icon (Electric Blue) */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
            aria-label="Home"
            className="text-[#008CFF] hover:text-[#52B2FF] transition-colors duration-200 flex items-center justify-center p-1"
          >
            <svg
              className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(0,140,255,0.75)]"
              viewBox="0 0 24 24"
            >
              <path d="M12 3L2 12h3v8h6v-5h2v5h6v-8h3L12 3z" />
            </svg>
          </a>
          <Link
            to="/about"
            className="hover:text-white transition-colors duration-200 cursor-pointer uppercase tracking-[0.22em]"
          >
            About
          </Link>
          <Link
            to="/portfolio"
            className="hover:text-white transition-colors duration-200 cursor-pointer uppercase tracking-[0.22em]"
          >
            Portfolio
          </Link>
          <Link
            to="/contact"
            className="hover:text-white transition-colors duration-200 cursor-pointer uppercase tracking-[0.22em]"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Right CTA: Get in Touch (Navigates to /contact) */}
        <div ref={getInTouchRef} className="hidden md:flex items-center">
          <Link
            to="/contact"
            className="text-white hover:text-[#008CFF] font-sans text-xs lg:text-[13px] tracking-[0.22em] uppercase font-semibold transition-colors duration-200 cursor-pointer"
          >
            Get in Touch
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          ref={hamburgerRef}
          type="button"
          aria-label="Open Navigation Menu"
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden flex flex-col justify-center items-center w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 text-white hover:text-[#008CFF] hover:border-[#008CFF]/40 focus:outline-none transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
        >
          <span className="w-5 h-[2px] bg-white rounded-full mb-1.5 transition-transform" />
          <span className="w-5 h-[2px] bg-white rounded-full mb-1.5 transition-transform" />
          <span className="w-3.5 h-[2px] bg-[#008CFF] rounded-full self-end mr-1 transition-transform" />
        </button>
      </header>

      {/* ========================================================= */}
      {/* 3. MOBILE TRANSLUCENT BLURRED NAVIGATION MENU (TRANS-BLUR) */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[#05070A]/75 backdrop-blur-2xl backdrop-saturate-150 px-6 py-7 sm:px-10 sm:py-9 border-l border-white/10"
        >
          {/* Subtle Ambient Sheen */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-36 bg-[#008CFF]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar inside Mobile Menu */}
          <div className="relative z-10 flex items-center justify-between w-full border-b border-white/10 pb-5">
            <img
              src="/Logo Official.svg"
              alt="BrandShoots Official Logo"
              className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
            />
            {/* Close Button (X) */}
            <button
              type="button"
              aria-label="Close Navigation Menu"
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Staggered Navigation Items */}
          <div
            ref={mobileNavLinksRef}
            className="relative z-10 flex flex-col items-center justify-center gap-7 my-auto text-center"
          >
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToTop();
              }}
              className="flex items-center gap-2.5 text-xl font-display font-bold tracking-[0.16em] uppercase text-[#008CFF]"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 3L2 12h3v8h6v-5h2v5h6v-8h3L12 3z" />
              </svg>
              <span>Home</span>
            </button>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-display font-semibold tracking-[0.16em] uppercase text-white/90 hover:text-[#008CFF] transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to="/portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-display font-semibold tracking-[0.16em] uppercase text-white/90 hover:text-[#008CFF] transition-colors duration-200"
            >
              Portfolio
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-display font-semibold tracking-[0.16em] uppercase text-white/90 hover:text-[#008CFF] transition-colors duration-200"
            >
              Contact
            </Link>

            {/* Prominent CTA in Mobile Menu */}
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 px-8 py-3.5 rounded-full bg-[#008CFF] text-white text-xs tracking-[0.24em] uppercase font-bold shadow-[0_0_24px_rgba(0,140,255,0.5)] hover:bg-[#209CFF] transition-all duration-200 active:scale-95 inline-block text-center"
            >
              Get in Touch
            </Link>
          </div>

          {/* Bottom Social Media Links & Icons */}
          <div
            ref={mobileSocialsRef}
            className="relative z-10 border-t border-white/10 pt-5 flex flex-col items-center gap-3.5 text-center"
          >
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/45">
              Connect With Us
            </span>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/wearebrandshoots"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram /wearebrandshoots"
                className="w-11 h-11 rounded-full bg-white/[0.08] hover:bg-[#008CFF] border border-white/15 hover:border-[#008CFF] flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-md hover:shadow-[0_0_16px_rgba(0,140,255,0.6)] active:scale-95"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@wearebrandshoots"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube /wearebrandshoots"
                className="w-11 h-11 rounded-full bg-white/[0.08] hover:bg-[#008CFF] border border-white/15 hover:border-[#008CFF] flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-md hover:shadow-[0_0_16px_rgba(0,140,255,0.6)] active:scale-95"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/wearebrandshoots"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook /wearebrandshoots"
                className="w-11 h-11 rounded-full bg-white/[0.08] hover:bg-[#008CFF] border border-white/15 hover:border-[#008CFF] flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-md hover:shadow-[0_0_16px_rgba(0,140,255,0.6)] active:scale-95"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <span className="font-mono text-[11px] tracking-[0.2em] text-[#008CFF] font-semibold">
              /wearebrandshoots
            </span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. CENTERPIECE: 3D TITLE & CYLINDRICAL REEL INSTALLATION */}
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

      {/* Interactive Contact & Inquiry Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </section>
  );
};

export default BrandShootsHero;
