import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Instagram, Youtube, Facebook, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MainNavbarProps {
  onOpenContact?: () => void;
}

export const MainNavbar: React.FC<MainNavbarProps> = ({ onOpenContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll detection with hysteresis for ultra-smooth, flicker-free transitions
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      // Hysteresis threshold: collapse past 70px, expand back up below 40px
      if (scrollY > 70) {
        setIsScrolled(true);
      } else if (scrollY < 40) {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Attach to global Lenis smooth scroll instance
    const checkLenis = () => {
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.on('scroll', (e: { scroll: number }) => {
          if (e.scroll > 70) {
            setIsScrolled(true);
          } else if (e.scroll < 40) {
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
  const isContact = location.pathname.startsWith('/contact');

  return (
    <>
      {/* ========================================================= */}
      {/* 1. MAIN EXPANDED NAVBAR (Full-Width at Top of Page)        */}
      {/* ========================================================= */}
      <header
        className={`fixed top-0 inset-x-0 z-50 w-full px-5 sm:px-8 md:px-12 lg:px-16 pt-5 sm:pt-6 md:pt-7 flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? 'opacity-0 -translate-y-5 scale-[0.98] pointer-events-none'
            : 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
        }`}
      >
        {/* Left: BrandShoots Official Logo */}
        <div className="flex items-center">
          <a
            href="/"
            onClick={handleScrollToTop}
            className="inline-block transition-transform duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer"
            aria-label="BrandShoots Official Logo"
          >
            <img
              src="/Logo Official.svg"
              alt="BrandShoots Official Logo"
              className="h-12 xs:h-14 sm:h-16 md:h-[68px] lg:h-[78px] w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
            />
          </a>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-11 text-white/85 font-sans text-xs lg:text-[13px] tracking-[0.22em] uppercase font-medium">
          {/* Home Icon/Link */}
          <a
            href="/"
            onClick={handleScrollToTop}
            aria-label="Home"
            className={`transition-colors duration-200 flex items-center justify-center p-1 ${
              isHome
                ? 'text-[#008CFF] drop-shadow-[0_0_8px_rgba(0,140,255,0.75)]'
                : 'text-white/80 hover:text-[#008CFF]'
            }`}
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 3L2 12h3v8h6v-5h2v5h6v-8h3L12 3z" />
            </svg>
          </a>

          {/* About Link */}
          <Link
            to="/about"
            className={`transition-colors duration-200 cursor-pointer uppercase tracking-[0.22em] ${
              isAbout
                ? 'text-[#008CFF] font-semibold drop-shadow-[0_0_8px_rgba(0,140,255,0.75)]'
                : 'text-white/85 hover:text-white'
            }`}
          >
            About
          </Link>

          {/* Portfolio Link */}
          <Link
            to="/portfolio"
            className={`transition-colors duration-200 cursor-pointer uppercase tracking-[0.22em] ${
              isPortfolio
                ? 'text-[#008CFF] font-semibold drop-shadow-[0_0_8px_rgba(0,140,255,0.75)]'
                : 'text-white/85 hover:text-white'
            }`}
          >
            Portfolio
          </Link>

          {/* Contact Link */}
          <Link
            to="/contact"
            className={`transition-colors duration-200 cursor-pointer uppercase tracking-[0.22em] ${
              isContact
                ? 'text-[#008CFF] font-semibold drop-shadow-[0_0_8px_rgba(0,140,255,0.75)]'
                : 'text-white/85 hover:text-white'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right: Desktop CTA & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* Desktop Get in Touch */}
          <button
            type="button"
            onClick={handleGetInTouch}
            className="hidden md:inline-flex items-center text-white hover:text-[#008CFF] font-sans text-xs lg:text-[13px] tracking-[0.22em] uppercase font-semibold transition-colors duration-200 cursor-pointer"
          >
            Get in Touch
          </button>

          {/* Mobile Hamburger Button with Animated Lines */}
          <button
            type="button"
            aria-label="Open Navigation Menu"
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex flex-col justify-center items-center w-11 h-11 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-[#008CFF]/50 text-white focus:outline-none transition-all duration-200 cursor-pointer shadow-sm active:scale-95 group"
          >
            <span className="w-5 h-[2px] bg-white rounded-full mb-1.5 transition-all group-hover:w-5.5" />
            <span className="w-5 h-[2px] bg-white rounded-full mb-1.5 transition-all group-hover:w-5.5" />
            <span className="w-3.5 h-[2px] bg-[#008CFF] rounded-full self-end mr-1 transition-all group-hover:w-4.5 group-hover:bg-[#52B2FF]" />
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. COLLAPSED NAVBAR: COMPACT DYNAMIC ISLAND ON RIGHT      */}
      {/* LOGO + 3-LINE MENU ONLY — ANCHORED ON THE RIGHT           */}
      {/* ========================================================= */}
      <div
        className={`fixed top-4 sm:top-5 right-5 sm:right-8 md:right-12 z-50 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 -translate-y-6 scale-[0.90] pointer-events-none'
        }`}
      >
        {/* Dynamic Island Capsule Container */}
        <div className="relative flex items-center gap-3 sm:gap-3.5 pl-3.5 pr-1.5 py-1.5 sm:pl-4 sm:pr-2 sm:py-2 rounded-full bg-[#05070A]/85 backdrop-blur-2xl backdrop-saturate-150 border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_24px_rgba(0,140,255,0.18)] hover:border-white/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_32px_rgba(0,140,255,0.25)] transition-all duration-300">
          {/* Subtle Island Specular Top Highlight */}
          <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          {/* Left: Compact BrandShoots Logo */}
          <a
            href="/"
            onClick={handleScrollToTop}
            className="flex items-center transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer pr-1 flex-shrink-0"
            aria-label="BrandShoots — Back to Top"
          >
            <img
              src="/Logo Official.svg"
              alt="BrandShoots Official Logo"
              className="h-5 sm:h-6 max-h-5 sm:max-h-6 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            />
          </a>

          {/* Vertical Subtle Separator */}
          <div className="w-[1px] h-3.5 sm:h-4 bg-white/15" />

          {/* Right: Hamburger Menu Lines Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open Full Navigation Menu"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.08] hover:bg-[#008CFF]/20 border border-white/15 hover:border-[#008CFF]/60 flex flex-col justify-center items-center gap-[3px] text-white transition-all duration-200 cursor-pointer active:scale-95 group shadow-sm"
          >
            {/* 3 Animated Hamburger Lines with Signature Electric Blue Accent */}
            <span className="w-3.5 sm:w-4 h-[2px] bg-white rounded-full transition-all duration-200 group-hover:w-4.5" />
            <span className="w-3.5 sm:w-4 h-[2px] bg-white rounded-full transition-all duration-200 group-hover:w-4.5" />
            <span className="w-2 sm:w-2.5 h-[2px] bg-[#008CFF] rounded-full transition-all duration-200 group-hover:w-3.5 group-hover:bg-[#52B2FF]" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. FULL TRANSLUCENT BLURRED OVERLAY MENU                   */}
      {/* ========================================================= */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="blurred-overlay-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#05070A]/85 backdrop-blur-2xl backdrop-saturate-150 px-6 py-6 sm:px-12 sm:py-9 select-none overflow-y-auto"
          >
            {/* Ambient Electric Blue Glow in Background */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#008CFF]/15 rounded-full blur-[130px] pointer-events-none" />

            {/* Top Bar inside Full Menu: Logo & Close Button (X) */}
            <div className="relative z-10 flex items-center justify-between w-full border-b border-white/10 pb-5">
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
                className="w-11 h-11 flex items-center justify-center text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 border border-white/12 transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Center: Large Staggered Navigation Items */}
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
              className="relative z-10 flex flex-col items-center justify-center gap-6 sm:gap-7 my-auto py-8 text-center"
            >
              {/* Home */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <button
                  type="button"
                  onClick={handleScrollToTop}
                  className={`flex items-center gap-2.5 text-2xl sm:text-3xl font-display font-bold tracking-[0.16em] uppercase transition-colors cursor-pointer ${
                    isHome ? 'text-[#008CFF]' : 'text-white/90 hover:text-[#008CFF]'
                  }`}
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 3L2 12h3v8h6v-5h2v5h6v-8h3L12 3z" />
                  </svg>
                  <span>Home</span>
                </button>
              </motion.div>

              {/* About */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  to="/about"
                  onClick={() => setMenuOpen(false)}
                  className={`text-2xl sm:text-3xl font-display font-semibold tracking-[0.16em] uppercase transition-colors ${
                    isAbout ? 'text-[#008CFF]' : 'text-white/90 hover:text-[#008CFF]'
                  }`}
                >
                  About
                </Link>
              </motion.div>

              {/* Portfolio */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  to="/portfolio"
                  onClick={() => setMenuOpen(false)}
                  className={`text-2xl sm:text-3xl font-display font-semibold tracking-[0.16em] uppercase transition-colors ${
                    isPortfolio ? 'text-[#008CFF]' : 'text-white/90 hover:text-[#008CFF]'
                  }`}
                >
                  Portfolio
                </Link>
              </motion.div>

              {/* Contact */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className={`text-2xl sm:text-3xl font-display font-semibold tracking-[0.16em] uppercase transition-colors ${
                    isContact ? 'text-[#008CFF]' : 'text-white/90 hover:text-[#008CFF]'
                  }`}
                >
                  Contact
                </Link>
              </motion.div>

              {/* Prominent CTA in Overlay Menu */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="pt-2"
              >
                <button
                  type="button"
                  onClick={handleGetInTouch}
                  className="px-9 py-3.5 rounded-full bg-[#008CFF] hover:bg-[#209CFF] text-white text-xs sm:text-sm tracking-[0.24em] uppercase font-bold shadow-[0_0_24px_rgba(0,140,255,0.5)] transition-all duration-200 active:scale-95 inline-block text-center cursor-pointer"
                >
                  Get in Touch
                </button>
              </motion.div>
            </motion.div>

            {/* Bottom: Social Media Links & Icons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.35 }}
              className="relative z-10 border-t border-white/10 pt-5 sm:pt-6 flex flex-col items-center gap-3.5 text-center"
            >
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/45">
                Connect With Us
              </span>

              {/* Social Media Link Icons */}
              <div className="flex items-center gap-4">
                {/* Instagram */}
                <a
                  href="https://instagram.com/wearebrandshoots"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram /wearebrandshoots"
                  className="w-11 h-11 rounded-full bg-white/[0.08] hover:bg-[#008CFF] border border-white/15 hover:border-[#008CFF] flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-md hover:shadow-[0_0_18px_rgba(0,140,255,0.6)] active:scale-95"
                >
                  <Instagram className="w-5 h-5" />
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@wearebrandshoots"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube /wearebrandshoots"
                  className="w-11 h-11 rounded-full bg-white/[0.08] hover:bg-[#008CFF] border border-white/15 hover:border-[#008CFF] flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-md hover:shadow-[0_0_18px_rgba(0,140,255,0.6)] active:scale-95"
                >
                  <Youtube className="w-5 h-5" />
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com/wearebrandshoots"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook /wearebrandshoots"
                  className="w-11 h-11 rounded-full bg-white/[0.08] hover:bg-[#008CFF] border border-white/15 hover:border-[#008CFF] flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-md hover:shadow-[0_0_18px_rgba(0,140,255,0.6)] active:scale-95"
                >
                  <Facebook className="w-5 h-5" />
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp /wearebrandshoots"
                  className="w-11 h-11 rounded-full bg-white/[0.08] hover:bg-[#008CFF] border border-white/15 hover:border-[#008CFF] flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-md hover:shadow-[0_0_18px_rgba(0,140,255,0.6)] active:scale-95"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>

              {/* Handle Tag */}
              <a
                href="https://instagram.com/wearebrandshoots"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] sm:text-xs tracking-[0.2em] text-[#008CFF] hover:text-[#52B2FF] font-semibold transition-colors"
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
