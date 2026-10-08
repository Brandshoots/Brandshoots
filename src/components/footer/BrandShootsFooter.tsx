import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Facebook, MessageCircle, ArrowUp } from 'lucide-react';
import { ContactModal } from '../hero/ContactModal';
import { BRAND_PATHS, SHOOTS_PATHS, BRANDSHOOTS_LOGO_VIEWBOX } from './brandshootsLogoPaths';

interface BrandShootsFooterProps {
  onOpenContact?: () => void;
}

export const BrandShootsFooter: React.FC<BrandShootsFooterProps> = ({ onOpenContact }) => {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

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
      lenis.scrollTo(0, { duration: 1.0 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer
        id="footer"
        ref={footerRef}
        className="relative w-full bg-[#030508] text-white border-t border-white/[0.08] select-none overflow-hidden"
      >
        {/* Subtle horizon glow at top border */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#008CFF]/50 to-transparent pointer-events-none" />

        {/* Atmospheric lighting */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1200px] h-[380px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 20%, rgba(0, 140, 255, 0.12) 0%, rgba(3, 8, 20, 0.4) 50%, transparent 80%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-16 sm:pt-20 pb-12 flex flex-col items-center text-center">
          
          {/* ========================================================= */}
          {/* 1. MONUMENTAL BRANDSHOOTS VECTOR LOGO (Final Frame Anchor) */}
          {/* ========================================================= */}
          <div
            onClick={scrollToTop}
            className="cursor-pointer group select-none py-2 inline-flex flex-col items-center w-full max-w-[280px] xs:max-w-[340px] sm:max-w-xl md:max-w-2xl lg:max-w-3xl"
          >
            <svg
              viewBox={BRANDSHOOTS_LOGO_VIEWBOX}
              className="w-full h-auto overflow-hidden filter drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] transition-transform duration-300 group-hover:scale-[1.01]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <g className="logo-blue-layer">
                  {BRAND_PATHS.map((d, i) => (
                    <path key={`brand-path-${i}`} d={d} fill="#008CFF" />
                  ))}
                </g>
                <g className="logo-white-layer">
                  {SHOOTS_PATHS.map((d, i) => (
                    <path key={`shoots-path-${i}`} d={d} fill="#FFFFFF" />
                  ))}
                </g>
              </g>
            </svg>
          </div>

          {/* CREATE. SHOOT. GROW. Signature Creed */}
          <div className="mt-4 sm:mt-5 font-mono text-[10px] xs:text-[11px] sm:text-xs tracking-[0.42em] uppercase font-bold text-center">
            <span className="text-white/80">CREATE. </span>
            <span className="text-[#008CFF] drop-shadow-[0_0_10px_rgba(0,140,255,0.85)]">SHOOT. </span>
            <span className="text-white/80">GROW.</span>
          </div>

          {/* Statement */}
          <p className="mt-6 max-w-lg text-xs sm:text-sm text-white/50 leading-relaxed font-normal">
            A high-end creative agency engineering commercial films, visual architecture, and high-retention content systems for ambitious brands.
          </p>

          {/* ========================================================= */}
          {/* 2. ARCHITECTURAL EDITORIAL NAVIGATION ROW                 */}
          {/* ========================================================= */}
          <nav className="mt-10 sm:mt-12 flex flex-wrap justify-center items-center gap-7 sm:gap-11 text-white/75 font-sans text-xs sm:text-[13px] tracking-[0.24em] uppercase font-semibold">
            <Link
              to="/about"
              className="hover:text-[#008CFF] transition-colors duration-200 cursor-pointer"
            >
              ABOUT
            </Link>

            <Link
              to="/portfolio"
              className="hover:text-[#008CFF] transition-colors duration-200 cursor-pointer"
            >
              PORTFOLIO
            </Link>

            <Link
              to="/#what-we-do"
              className="hover:text-[#008CFF] transition-colors duration-200 cursor-pointer"
            >
              SERVICES
            </Link>

            <button
              type="button"
              onClick={handleOpenContact}
              className="text-[#008CFF] hover:text-[#52B2FF] transition-colors duration-200 cursor-pointer uppercase tracking-[0.24em]"
            >
              CONTACT
            </button>
          </nav>

          {/* ========================================================= */}
          {/* 3. SOCIAL MEDIA CHANNELS                                  */}
          {/* ========================================================= */}
          <div className="mt-8 sm:mt-10 flex items-center gap-3.5 sm:gap-4">
            <a
              href="https://instagram.com/wearebrandshoots"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/[0.06] hover:bg-[#008CFF] border border-white/12 flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-sm active:scale-95"
            >
              <Instagram className="w-4.5 h-4.5" />
            </a>

            <a
              href="https://youtube.com/@wearebrandshoots"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/[0.06] hover:bg-[#008CFF] border border-white/12 flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-sm active:scale-95"
            >
              <Youtube className="w-4.5 h-4.5" />
            </a>

            <a
              href="https://facebook.com/wearebrandshoots"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/[0.06] hover:bg-[#008CFF] border border-white/12 flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-sm active:scale-95"
            >
              <Facebook className="w-4.5 h-4.5" />
            </a>

            <a
              href="https://wa.me/919177656444"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/[0.06] hover:bg-[#008CFF] border border-white/12 flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-sm active:scale-95"
            >
              <MessageCircle className="w-4.5 h-4.5" />
            </a>
          </div>

          {/* ========================================================= */}
          {/* 4. FINAL CLOSING BAR: LOCATIONS, COPYRIGHT, BACK TO TOP   */}
          {/* ========================================================= */}
          <div className="w-full mt-12 sm:mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-[11px] font-mono tracking-widest text-white/40 uppercase">
              <span>Rajahmundry & Hyderabad, India</span>
              <span className="hidden sm:inline">•</span>
              <span>© {new Date().getFullYear()} BRANDSHOOTS. ALL RIGHTS RESERVED.</span>
            </div>

            {/* Back to Top */}
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-white/50 hover:text-[#008CFF] transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* Internal fallback contact modal */}
      <ContactModal
        isOpen={internalModalOpen}
        onClose={() => setInternalModalOpen(false)}
      />
    </>
  );
};

export default BrandShootsFooter;
