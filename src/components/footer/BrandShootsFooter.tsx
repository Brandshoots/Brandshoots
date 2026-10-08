import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Facebook, ArrowUp } from 'lucide-react';
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

  const scrollToSection = (id: string) => {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(`#${id}`, { duration: 0.85 });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer
        id="footer"
        ref={footerRef}
        className="relative w-full bg-[#020408] text-white border-t border-white/[0.08] select-none overflow-hidden"
      >
        {/* Faint blue horizon glow at top border */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#008CFF]/40 to-transparent pointer-events-none" />

        {/* Atmospheric lighting */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[85vw] max-w-[1100px] h-[350px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 20%, rgba(0, 140, 255, 0.12) 0%, rgba(2, 10, 28, 0.4) 50%, transparent 80%)',
            filter: 'blur(75px)',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-10 lg:px-12 pt-12 sm:pt-16 pb-8 flex flex-col items-center text-center">
          
          {/* ========================================================= */}
          {/* 1. BRANDSHOOTS VECTOR LOGO                                */}
          {/* ========================================================= */}
          <div
            onClick={scrollToTop}
            className="cursor-pointer group select-none py-1 inline-flex flex-col items-center w-full max-w-[280px] xs:max-w-[320px] sm:max-w-xl md:max-w-2xl"
          >
            <svg
              viewBox={BRANDSHOOTS_LOGO_VIEWBOX}
              className="w-full h-auto overflow-hidden filter drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] transition-transform duration-300 group-hover:scale-[1.02]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <g className="logo-blue-layer">
                  {BRAND_PATHS.map((d, i) => (
                    <path key={`brand-path-${i}`} d={d} fill="#018CFB" />
                  ))}
                </g>
                <g className="logo-white-layer">
                  {SHOOTS_PATHS.map((d, i) => (
                    <path key={`shoots-path-${i}`} d={d} fill="#FEFEFE" />
                  ))}
                </g>
              </g>
            </svg>
          </div>

          {/* CREATE. SHOOT. GROW. Tagline */}
          <div className="mt-3 sm:mt-4 font-mono text-[10px] xs:text-[11px] sm:text-xs tracking-[0.38em] uppercase font-bold text-center">
            <span className="text-white/80">CREATE. </span>
            <span className="text-[#008CFF] drop-shadow-[0_0_8px_rgba(0,140,255,0.75)]">SHOOT. </span>
            <span className="text-white/80">GROW.</span>
          </div>

          {/* Closing Statement */}
          <div className="mt-5 sm:mt-7 max-w-xl px-4">
            <h3 className="font-sans font-black tracking-[-0.03em] uppercase text-lg xs:text-xl sm:text-2xl md:text-3xl text-white leading-tight">
              LET'S CREATE SOMETHING{' '}
              <span className="text-[#008CFF] drop-shadow-[0_0_16px_rgba(0,140,255,0.5)]">
                WORTH REMEMBERING.
              </span>
            </h3>
          </div>

          {/* ========================================================= */}
          {/* 2. NAVIGATION & SOCIALS                                    */}
          {/* ========================================================= */}
          <div className="w-full mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/[0.08] flex flex-col items-center gap-6">
            
            {/* Navigation Links */}
            <nav aria-label="Footer Navigation" className="w-full">
              <ul className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 md:gap-12">
                <li>
                  <Link
                    to="/about"
                    className="font-mono text-xs sm:text-[13px] tracking-[0.22em] uppercase text-white/70 hover:text-white transition-colors py-1.5"
                  >
                    ABOUT
                  </Link>
                </li>
                <li>
                  <Link
                    to="/portfolio"
                    className="font-mono text-xs sm:text-[13px] tracking-[0.22em] uppercase text-white/70 hover:text-white transition-colors py-1.5"
                  >
                    PORTFOLIO
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('what-we-do')}
                    className="font-mono text-xs sm:text-[13px] tracking-[0.22em] uppercase text-white/70 hover:text-white transition-colors py-1.5 cursor-pointer"
                  >
                    SERVICES
                  </button>
                </li>
                <li>
                  <Link
                    to="/contact"
                    onClick={() => {
                      if (onOpenContact && window.location.pathname === '/contact') {
                        handleOpenContact();
                      }
                    }}
                    className="font-mono text-xs sm:text-[13px] tracking-[0.22em] uppercase text-[#008CFF] hover:text-[#52B2FF] font-semibold transition-colors py-1.5 cursor-pointer"
                  >
                    CONTACT
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Social Media Links */}
            <div className="flex items-center justify-center gap-3.5">
              <a
                href="https://instagram.com/wearebrandshoots"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @wearebrandshoots"
                className="w-10 h-10 rounded-full border border-white/15 bg-white/[0.03] hover:bg-[#008CFF]/20 hover:border-[#008CFF] flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>

              <a
                href="https://youtube.com/@wearebrandshoots"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube @wearebrandshoots"
                className="w-10 h-10 rounded-full border border-white/15 bg-white/[0.03] hover:bg-[#008CFF]/20 hover:border-[#008CFF] flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95"
              >
                <Youtube className="w-4.5 h-4.5" />
              </a>

              <a
                href="https://facebook.com/wearebrandshoots"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook @wearebrandshoots"
                className="w-10 h-10 rounded-full border border-white/15 bg-white/[0.03] hover:bg-[#008CFF]/20 hover:border-[#008CFF] flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. COPYRIGHT & BACK TO TOP                                */}
          {/* ========================================================= */}
          <div className="w-full mt-7 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.24em] text-white/40 uppercase order-2 sm:order-1">
              © BRANDSHOOTS. ALL RIGHTS RESERVED.
            </p>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Return to Top"
              className="group inline-flex items-center gap-2 font-mono text-xs tracking-[0.24em] uppercase text-white/60 hover:text-white transition-colors cursor-pointer order-1 sm:order-2"
            >
              <span>BACK TO TOP</span>
              <div className="w-6 h-6 rounded-full border border-white/15 group-hover:border-[#008CFF] bg-white/[0.04] group-hover:bg-[#008CFF]/20 flex items-center justify-center transition-all">
                <ArrowUp className="w-3 h-3 text-white/70 group-hover:text-[#008CFF]" />
              </div>
            </button>
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
