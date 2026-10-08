import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Instagram, Youtube, Facebook, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

interface MainNavbarProps {
  onOpenContact?: () => void;
}

export const MainNavbar: React.FC<MainNavbarProps> = ({ onOpenContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Mobile hamburger line refs for GSAP morph
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);

  // Scroll detection linked directly with Lenis and native window scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      if (scrollY > 55) {
        setIsScrolled(true);
      } else if (scrollY < 20) {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const checkLenis = () => {
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.on('scroll', (e: { scroll: number }) => {
          if (e.scroll > 55) {
            setIsScrolled(true);
          } else if (e.scroll < 20) {
            setIsScrolled(false);
          }
        });
      }
    };
    checkLenis();
    const lenisTimer = setTimeout(checkLenis, 300);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(lenisTimer);
    };
  }, []);

  // GSAP 3-line to X morph animation for mobile hamburger
  useEffect(() => {
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    const l3 = line3Ref.current;
    if (!l1 || !l2 || !l3) return;

    if (menuOpen) {
      gsap.to(l1, { y: 7, rotate: 45, duration: 0.25, ease: 'power2.out' });
      gsap.to(l2, { opacity: 0, x: -6, duration: 0.2, ease: 'power2.out' });
      gsap.to(l3, { y: -7, rotate: -45, width: '22px', backgroundColor: '#FFFFFF', duration: 0.25, ease: 'power2.out' });
    } else {
      gsap.to(l1, { y: 0, rotate: 0, duration: 0.25, ease: 'power2.out' });
      gsap.to(l2, { opacity: 1, x: 0, duration: 0.2, ease: 'power2.out' });
      gsap.to(l3, { y: 0, rotate: 0, width: '14px', backgroundColor: '#008CFF', duration: 0.25, ease: 'power2.out' });
    }
  }, [menuOpen]);

  // Prevent background scroll when the full overlay menu is open
  useEffect(() => {
    if (menuOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMenuOpen(false);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [menuOpen]);

  // Smooth scroll to top helper
  const handleScrollToTop = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setMenuOpen(false);
    if (location.pathname === '/') {
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.scrollTo(0, { duration: 0.85 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate('/');
    }
  };

  const handleNavScroll = (sectionId: string) => {
    setMenuOpen(false);
    if (location.pathname === '/') {
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.scrollTo(`#${sectionId}`, { duration: 0.85 });
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const handleGetInTouch = () => {
    setMenuOpen(false);
    if (onOpenContact) {
      onOpenContact();
    } else if (location.pathname === '/contact') {
      const el = document.getElementById('contact-form');
      if (el) {
        const lenis = (window as any).__lenis;
        if (lenis) {
          lenis.scrollTo(el, { duration: 0.85 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate('/contact');
    }
  };

  const isAbout = location.pathname.startsWith('/about');
  const isPortfolio =
    location.pathname.startsWith('/portfolio') || location.pathname.startsWith('/projects');

  return (
    <>
      {/* ========================================================= */}
      {/* 1. DEDICATED MOBILE NAVBAR (Consistent Across Whole Site) */}
      {/* ========================================================= */}
      <header
        className={`md:hidden fixed top-0 inset-x-0 z-50 w-full px-5 py-3.5 flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? 'bg-[#05070A]/92 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.7)]'
            : 'bg-gradient-to-b from-[#05070A]/90 via-[#05070A]/40 to-transparent border-b border-transparent'
        }`}
      >
        {/* BrandShoots Official Logo (Crisp, proportional, always readable) */}
        <a
          href="/"
          onClick={handleScrollToTop}
          className="flex items-center active:scale-95 transition-transform duration-200"
          aria-label="BrandShoots Official Logo"
        >
          <img
            src="/Logo Official.svg"
            alt="BrandShoots Official Logo"
            className="h-9 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
          />
        </a>

        {/* Clean 3-Line Hamburger Button (3 Lines -> X with GSAP) */}
        <button
          type="button"
          aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-11 h-11 rounded-xl bg-white/[0.06] active:bg-white/[0.14] border border-white/12 flex flex-col justify-center items-center gap-[5px] text-white focus:outline-none transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
        >
          <span
            ref={line1Ref}
            className="w-[22px] h-[2px] bg-white rounded-full transition-colors origin-center"
          />
          <span
            ref={line2Ref}
            className="w-[22px] h-[2px] bg-white rounded-full transition-colors origin-center"
          />
          <span
            ref={line3Ref}
            className="w-[14px] h-[2px] bg-[#008CFF] rounded-full self-end mr-1 transition-colors origin-center"
          />
        </button>
      </header>

      {/* ========================================================= */}
      {/* 2. DESKTOP UNIFIED MORPHING NAVBAR (Physically Linked)    */}
      {/* ========================================================= */}
      <div className="hidden md:flex fixed top-0 inset-x-0 z-50 justify-center pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <header
          className={`pointer-events-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled
              ? 'mt-3.5 w-[92%] max-w-4xl px-6 py-2.5 rounded-full bg-[#05070A]/85 backdrop-blur-2xl backdrop-saturate-150 border border-white/12 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_24px_rgba(0,140,255,0.18)]'
              : 'mt-0 w-full max-w-7xl px-8 md:px-12 pt-6 lg:pt-7 pb-4 bg-transparent border-transparent shadow-none'
          }`}
        >
          {/* Left: BrandShoots Official Logo */}
          <div className="flex items-center flex-shrink-0">
            <a
              href="/"
              onClick={handleScrollToTop}
              className="inline-block transition-transform duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer"
              aria-label="BrandShoots Official Logo"
            >
              <img
                src="/Logo Official.svg"
                alt="BrandShoots Official Logo"
                className={`w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isScrolled ? 'h-7 sm:h-8' : 'h-14 sm:h-16 md:h-[68px]'
                }`}
              />
            </a>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav
            className={`flex items-center text-white/85 font-sans text-xs lg:text-[13px] tracking-[0.22em] uppercase font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled ? 'gap-6 lg:gap-8' : 'gap-8 lg:gap-11'
            }`}
          >
            <Link
              to="/about"
              className={`transition-colors duration-200 cursor-pointer uppercase tracking-[0.22em] ${
                isAbout
                  ? 'text-[#008CFF] font-semibold drop-shadow-[0_0_8px_rgba(0,140,255,0.75)]'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              ABOUT US
            </Link>

            <Link
              to="/portfolio"
              className={`transition-colors duration-200 cursor-pointer uppercase tracking-[0.22em] ${
                isPortfolio
                  ? 'text-[#008CFF] font-semibold drop-shadow-[0_0_8px_rgba(0,140,255,0.75)]'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              PROJECT
            </Link>

            <button
              type="button"
              onClick={() => handleNavScroll('leadership')}
              className="text-white/85 hover:text-white transition-colors duration-200 cursor-pointer uppercase tracking-[0.22em]"
            >
              TEAM
            </button>

            <button
              type="button"
              onClick={() => handleNavScroll('what-we-do')}
              className="text-white/85 hover:text-white transition-colors duration-200 cursor-pointer uppercase tracking-[0.22em]"
            >
              SERVICES
            </button>
          </nav>

          {/* Right: Desktop CTA Button */}
          <div className="flex items-center flex-shrink-0">
            <button
              type="button"
              onClick={handleGetInTouch}
              className={`font-mono uppercase font-bold tracking-[0.2em] transition-all duration-300 cursor-pointer active:scale-95 ${
                isScrolled
                  ? 'px-4.5 py-2 text-[11px] rounded-full bg-[#008CFF] hover:bg-[#209CFF] text-white shadow-[0_0_20px_rgba(0,140,255,0.45)]'
                  : 'inline-flex items-center text-white hover:text-[#008CFF] font-sans text-xs lg:text-[13px] tracking-[0.22em] font-semibold'
              }`}
            >
              GET IN TOUCH
            </button>
          </div>
        </header>
      </div>

      {/* ========================================================= */}
      {/* 3. FULLSCREEN OVERLAY MENU (Mobile & Desktop Drawer)       */}
      {/* ========================================================= */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="blurred-overlay-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#05070A]/95 backdrop-blur-2xl backdrop-saturate-150 px-6 py-6 sm:px-12 sm:py-9 select-none overflow-y-auto"
          >
            {/* Ambient Electric Blue Glow in Background */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-[#008CFF]/15 rounded-full blur-[130px] pointer-events-none" />

            {/* Top Bar inside Full Menu: Logo & Close Button (X) */}
            <div className="relative z-10 flex items-center justify-between w-full border-b border-white/10 pb-4 sm:pb-5">
              <a
                href="/"
                onClick={handleScrollToTop}
                className="inline-block transition-transform duration-200 hover:scale-[1.03]"
                aria-label="BrandShoots Official Logo"
              >
                <img
                  src="/Logo Official.svg"
                  alt="BrandShoots Official Logo"
                  className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
                />
              </a>

              {/* Close Button (X) */}
              <button
                type="button"
                aria-label="Close Navigation Menu"
                onClick={() => setMenuOpen(false)}
                className="w-11 h-11 flex items-center justify-center text-white/90 hover:text-white rounded-full bg-white/10 hover:bg-white/20 border border-white/15 transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Center: Large Readable Navigation Items */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.07, delayChildren: 0.08 },
                },
              }}
              className="relative z-10 flex flex-col items-center justify-center gap-5 sm:gap-7 my-auto py-6 text-center"
            >
              {/* 1. ABOUT US */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  to="/about"
                  onClick={() => setMenuOpen(false)}
                  className={`text-2xl xs:text-3xl sm:text-4xl font-display font-black tracking-[0.14em] uppercase transition-colors py-2 block ${
                    isAbout ? 'text-[#008CFF]' : 'text-white/90 hover:text-[#008CFF]'
                  }`}
                >
                  ABOUT US
                </Link>
              </motion.div>

              {/* 2. PROJECT */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  to="/portfolio"
                  onClick={() => setMenuOpen(false)}
                  className={`text-2xl xs:text-3xl sm:text-4xl font-display font-black tracking-[0.14em] uppercase transition-colors py-2 block ${
                    isPortfolio ? 'text-[#008CFF]' : 'text-white/90 hover:text-[#008CFF]'
                  }`}
                >
                  PROJECT
                </Link>
              </motion.div>

              {/* 3. TEAM */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <button
                  type="button"
                  onClick={() => handleNavScroll('leadership')}
                  className="text-2xl xs:text-3xl sm:text-4xl font-display font-black tracking-[0.14em] uppercase text-white/90 hover:text-[#008CFF] transition-colors py-2 block cursor-pointer"
                >
                  TEAM
                </button>
              </motion.div>

              {/* 4. SERVICES */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <button
                  type="button"
                  onClick={() => handleNavScroll('what-we-do')}
                  className="text-2xl xs:text-3xl sm:text-4xl font-display font-black tracking-[0.14em] uppercase text-white/90 hover:text-[#008CFF] transition-colors py-2 block cursor-pointer"
                >
                  SERVICES
                </button>
              </motion.div>

              {/* 5. GET IN TOUCH */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="pt-3"
              >
                <button
                  type="button"
                  onClick={handleGetInTouch}
                  className="px-8 py-3.5 sm:px-10 sm:py-4 rounded-full bg-[#008CFF] hover:bg-[#209CFF] text-white text-xs sm:text-sm tracking-[0.24em] font-mono uppercase font-bold shadow-[0_0_24px_rgba(0,140,255,0.5)] transition-all duration-200 active:scale-95 inline-block text-center cursor-pointer"
                >
                  GET IN TOUCH
                </button>
              </motion.div>
            </motion.div>

            {/* Bottom: Social Media Links & Icons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.35 }}
              className="relative z-10 border-t border-white/10 pt-4 sm:pt-6 flex flex-col items-center gap-3 text-center"
            >
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/50">
                Connect With Us
              </span>

              <div className="flex items-center gap-3.5">
                <a
                  href="https://instagram.com/wearebrandshoots"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram /wearebrandshoots"
                  className="w-10 h-10 rounded-full bg-white/[0.08] hover:bg-[#008CFF] border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-sm active:scale-95"
                >
                  <Instagram className="w-4.5 h-4.5" />
                </a>

                <a
                  href="https://youtube.com/@wearebrandshoots"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube /wearebrandshoots"
                  className="w-10 h-10 rounded-full bg-white/[0.08] hover:bg-[#008CFF] border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-sm active:scale-95"
                >
                  <Youtube className="w-4.5 h-4.5" />
                </a>

                <a
                  href="https://facebook.com/wearebrandshoots"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook /wearebrandshoots"
                  className="w-10 h-10 rounded-full bg-white/[0.08] hover:bg-[#008CFF] border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-sm active:scale-95"
                >
                  <Facebook className="w-4.5 h-4.5" />
                </a>

                <a
                  href="https://wa.me/919177656444"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp /wearebrandshoots"
                  className="w-10 h-10 rounded-full bg-white/[0.08] hover:bg-[#008CFF] border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-sm active:scale-95"
                >
                  <MessageCircle className="w-4.5 h-4.5" />
                </a>
              </div>

              <a
                href="https://instagram.com/wearebrandshoots"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] tracking-[0.2em] text-[#008CFF] hover:text-[#52B2FF] font-semibold transition-colors"
              >
                /wearebrandshoots
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MainNavbar;
