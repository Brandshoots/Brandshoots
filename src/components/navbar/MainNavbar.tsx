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
      setIsScrolled(scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const checkLenis = () => {
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.on('scroll', (e: { scroll: number }) => {
          setIsScrolled(e.scroll > 40);
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

  // GSAP 3-line to X morph animation for mobile hamburger (power3.inOut, 350ms, balanced and symmetrical)
  useEffect(() => {
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    const l3 = line3Ref.current;
    if (!l1 || !l2 || !l3) return;

    if (menuOpen) {
      gsap.to(l1, { y: 5.25, rotate: 45, duration: 0.35, ease: 'power3.inOut' });
      gsap.to(l2, { opacity: 0, scaleX: 0, duration: 0.25, ease: 'power3.inOut' });
      gsap.to(l3, { y: -5.25, rotate: -45, duration: 0.35, ease: 'power3.inOut' });
    } else {
      gsap.to(l1, { y: 0, rotate: 0, duration: 0.35, ease: 'power3.inOut' });
      gsap.to(l2, { opacity: 1, scaleX: 1, duration: 0.28, ease: 'power3.inOut' });
      gsap.to(l3, { y: 0, rotate: 0, duration: 0.35, ease: 'power3.inOut' });
    }
  }, [menuOpen]);

  // Prevent background scroll when the full overlay menu is open
  useEffect(() => {
    if (menuOpen) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMenuOpen(false);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
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

  const isHome = location.pathname === '/';
  const isAbout = location.pathname.startsWith('/about');
  const isPortfolio =
    location.pathname.startsWith('/portfolio') || location.pathname.startsWith('/projects');

  return (
    <>
      {/* ========================================================= */}
      {/* 1. DEDICATED MOBILE NAVBAR (Liquid Glass Blur & Polished Composition) */}
      {/* ========================================================= */}
      <header
        className={`md:hidden fixed top-0 inset-x-0 z-[120] w-full px-5 sm:px-6 py-3.5 flex items-center justify-between transition-all duration-300 ${
          isScrolled || menuOpen
            ? 'bg-[#04060A]/85 backdrop-blur-2xl backdrop-saturate-[180%] border-b border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.85)]'
            : 'bg-gradient-to-b from-[#04060A]/95 via-[#04060A]/50 to-transparent border-b border-transparent'
        }`}
      >
        {/* BrandShoots Official Logo (Enlarged, crisp, proportional, always readable) */}
        <a
          href="/"
          onClick={handleScrollToTop}
          className="flex items-center active:scale-95 transition-transform duration-200"
          aria-label="BrandShoots Official Logo"
        >
          <img
            src="/Logo Official.svg"
            alt="BrandShoots Official Logo"
            className="h-11 sm:h-12 w-auto object-contain filter drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]"
          />
        </a>

        {/* Clean, luxury agency hamburger icon (44x44px touch target, tactile frosted circular pill) */}
        <button
          type="button"
          aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] backdrop-blur-md flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95 select-none shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
        >
          <div className="w-[18px] h-[12px] relative flex flex-col justify-between items-center pointer-events-none">
            <span
              ref={line1Ref}
              className="w-[18px] h-[1.5px] bg-white rounded-full origin-center block"
            />
            <span
              ref={line2Ref}
              className="w-[18px] h-[1.5px] bg-white rounded-full origin-center block"
            />
            <span
              ref={line3Ref}
              className="w-[18px] h-[1.5px] bg-white rounded-full origin-center block"
            />
          </div>
        </button>
      </header>

      {/* ========================================================= */}
      {/* 2. DESKTOP UNIFIED MORPHING NAVBAR (Framer Motion Smooth)  */}
      {/* ========================================================= */}
      <div className="hidden md:flex fixed top-0 inset-x-0 z-50 justify-center pointer-events-none">
        <motion.header
          initial={false}
          animate={{
            maxWidth: isScrolled ? 580 : 1220,
            y: isScrolled ? 10 : 20,
            paddingTop: isScrolled ? 8 : 14,
            paddingBottom: isScrolled ? 8 : 14,
            paddingLeft: isScrolled ? 22 : 36,
            paddingRight: isScrolled ? 22 : 36,
            backgroundColor: isScrolled ? 'rgba(5, 7, 10, 0.82)' : 'rgba(5, 7, 10, 0)',
            borderColor: isScrolled ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0)',
            boxShadow: isScrolled
              ? '0 16px 40px rgba(0, 0, 0, 0.85), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)'
              : '0 0 0 rgba(0, 0, 0, 0), inset 0 0 0 0 rgba(255, 255, 255, 0)',
          }}
          transition={{
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            backdropFilter: isScrolled ? 'blur(28px) saturate(190%)' : 'blur(0px)',
            WebkitBackdropFilter: isScrolled ? 'blur(28px) saturate(190%)' : 'blur(0px)',
          }}
          className="relative pointer-events-auto flex items-center justify-between rounded-full border w-[92%] transition-[backdrop-filter]"
        >
          {/* Liquid glass top specular reflection sheen for scrolled pill */}
          <motion.div
            initial={false}
            animate={{ opacity: isScrolled ? 1 : 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none rounded-full"
          />

          {/* Left: BrandShoots Official Logo */}
          <div className="flex items-center flex-shrink-0">
            <a
              href="/"
              onClick={handleScrollToTop}
              className="inline-block transition-transform duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer"
              aria-label="BrandShoots Official Logo"
            >
              <motion.img
                src="/Logo Official.svg"
                alt="BrandShoots Official Logo"
                initial={false}
                animate={{
                  height: isScrolled ? 26 : 38,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
              />
            </a>
          </div>

          {/* Center: Desktop Navigation Links (Metallic Home Icon, About, Portfolio) */}
          <motion.nav
            initial={false}
            animate={{
              gap: isScrolled ? 24 : 38,
            }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex items-center text-white/85 font-sans text-xs lg:text-[13px] tracking-[0.22em] uppercase font-medium"
          >
            {/* 1. Metallic Home Icon (Clean, No Circle) */}
            <a
              href="/"
              onClick={handleScrollToTop}
              title="Home"
              aria-label="BrandShoots Home"
              className="p-1.5 transition-transform duration-200 cursor-pointer shrink-0 hover:scale-110 active:scale-95 flex items-center justify-center"
            >
              {/* High-Precision Metallic Home Icon */}
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 transition-transform duration-200 filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                fill="none"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <defs>
                  {/* Brushed Chrome / Titanium Gradient */}
                  <linearGradient id="navMetallicChrome" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="25%" stopColor="#E2E8F0" />
                    <stop offset="50%" stopColor="#94A3B8" />
                    <stop offset="75%" stopColor="#CBD5E1" />
                    <stop offset="100%" stopColor="#FFFFFF" />
                  </linearGradient>
                  {/* Active Sky Blue Metallic Accent Gradient */}
                  <linearGradient id="navMetallicActiveBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="25%" stopColor="#7DD3FC" />
                    <stop offset="60%" stopColor="#008CFF" />
                    <stop offset="85%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#BAE6FD" />
                  </linearGradient>
                </defs>
                <path
                  d="M3 10.25L12 3l9 7.25V20a1 1 0 0 1-1 1h-4.5a1 1 0 0 1-1-1v-4.5h-5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10.25z"
                  stroke={isHome ? 'url(#navMetallicActiveBlue)' : 'url(#navMetallicChrome)'}
                  fill={isHome ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)'}
                />
              </svg>
            </a>

            {/* 2. ABOUT */}
            <Link
              to="/about"
              className={`transition-colors duration-200 cursor-pointer uppercase tracking-[0.22em] shrink-0 whitespace-nowrap ${
                isAbout
                  ? 'text-[#008CFF] font-semibold drop-shadow-[0_0_8px_rgba(0,140,255,0.75)]'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              ABOUT
            </Link>

            {/* 3. PORTFOLIO */}
            <Link
              to="/portfolio"
              className={`transition-colors duration-200 cursor-pointer uppercase tracking-[0.22em] shrink-0 whitespace-nowrap ${
                isPortfolio
                  ? 'text-[#008CFF] font-semibold drop-shadow-[0_0_8px_rgba(0,140,255,0.75)]'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              PORTFOLIO
            </Link>
          </motion.nav>

          {/* Right: Clean, Simple Contact Button */}
          <div className="flex items-center flex-shrink-0">
            <button
              type="button"
              onClick={handleGetInTouch}
              className="px-5 py-2 sm:px-6 sm:py-2 rounded-full font-sans font-semibold uppercase tracking-[0.16em] text-[11px] sm:text-xs text-white bg-[#008CFF] hover:bg-[#007fe6] active:scale-95 transition-all duration-200 cursor-pointer select-none whitespace-nowrap shrink-0 border border-white/20 shadow-sm hover:shadow-[0_2px_12px_rgba(0,140,255,0.35)]"
            >
              CONTACT
            </button>
          </div>
        </motion.header>
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

            {/* Top Bar inside Full Menu (Desktop only, on mobile the fixed header is on top) */}
            <div className="hidden md:flex relative z-10 items-center justify-between w-full border-b border-white/10 pb-4 sm:pb-5">
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

            {/* Center: Large Readable Navigation Items in Figtree (Strictly Home, About, Portfolio, Contact) */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08, delayChildren: 0.08 },
                },
              }}
              className="relative z-10 flex flex-col items-center justify-center gap-6 sm:gap-8 my-auto pt-16 md:pt-0 py-6 text-center"
            >
              {/* 1. HOME */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <a
                  href="/"
                  onClick={handleScrollToTop}
                  className={`text-2xl xs:text-3xl sm:text-4xl font-figtree font-black tracking-[0.14em] uppercase transition-colors py-2 flex items-center justify-center gap-3 ${
                    isHome ? 'text-[#008CFF]' : 'text-white/90 hover:text-[#008CFF]'
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-7 h-7 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                    fill="none"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      d="M3 10.25L12 3l9 7.25V20a1 1 0 0 1-1 1h-4.5a1 1 0 0 1-1-1v-4.5h-5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10.25z"
                      stroke={isHome ? 'url(#navMetallicActiveBlue)' : 'url(#navMetallicChrome)'}
                      fill={isHome ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)'}
                    />
                  </svg>
                  <span>HOME</span>
                </a>
              </motion.div>

              {/* 2. ABOUT */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  to="/about"
                  onClick={() => setMenuOpen(false)}
                  className={`text-2xl xs:text-3xl sm:text-4xl font-figtree font-black tracking-[0.14em] uppercase transition-colors py-2 block ${
                    isAbout ? 'text-[#008CFF]' : 'text-white/90 hover:text-[#008CFF]'
                  }`}
                >
                  ABOUT
                </Link>
              </motion.div>

              {/* 3. PORTFOLIO */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  to="/portfolio"
                  onClick={() => setMenuOpen(false)}
                  className={`text-2xl xs:text-3xl sm:text-4xl font-figtree font-black tracking-[0.14em] uppercase transition-colors py-2 block ${
                    isPortfolio ? 'text-[#008CFF]' : 'text-white/90 hover:text-[#008CFF]'
                  }`}
                >
                  PORTFOLIO
                </Link>
              </motion.div>

              {/* 4. CONTACT (Clean, Simple) */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="pt-4"
              >
                <button
                  type="button"
                  onClick={handleGetInTouch}
                  className="px-9 py-3.5 sm:px-11 sm:py-4 rounded-full text-white text-xs sm:text-sm tracking-[0.2em] font-sans font-semibold uppercase bg-[#008CFF] hover:bg-[#007fe6] active:scale-95 transition-all duration-200 inline-block text-center cursor-pointer min-h-[44px] select-none border border-white/20 shadow-[0_2px_14px_rgba(0,140,255,0.3)]"
                >
                  CONTACT
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
