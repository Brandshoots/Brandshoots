import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Youtube, Facebook, ArrowUp } from 'lucide-react';
import { ContactModal } from '../hero/ContactModal';

gsap.registerPlugin(ScrollTrigger);

interface BrandShootsFooterProps {
  onOpenContact?: () => void;
}

export const BrandShootsFooter: React.FC<BrandShootsFooterProps> = ({ onOpenContact }) => {
  const [internalModalOpen, setInternalModalOpen] = useState(false);

  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navListRef = useRef<HTMLUListElement>(null);
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
    if ((window as any).__lenis) {
      (window as any).__lenis.scrollTo(0, { duration: 0.85 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    if ((window as any).__lenis) {
      (window as any).__lenis.scrollTo(`#${id}`, { duration: 0.85 });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!footerRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 92%',
          toggleActions: 'play none none reverse',
        },
      });

      // Initial state
      gsap.set(logoRef.current, { y: 20, opacity: 0 });
      gsap.set(navListRef.current?.children ? Array.from(navListRef.current.children) : [], {
        y: 15,
        opacity: 0,
      });
      gsap.set(socialsRef.current?.children ? Array.from(socialsRef.current.children) : [], {
        scale: 0.85,
        opacity: 0,
      });
      gsap.set(copyrightRef.current, { y: 10, opacity: 0 });

      // Clean, sequential landing animation: Navigation & Socials first, Logo LAST
      tl.to(
        navListRef.current?.children ? Array.from(navListRef.current.children) : [],
        {
          y: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.45,
          ease: 'power2.out',
        },
        0
      )
        .to(
          socialsRef.current?.children ? Array.from(socialsRef.current.children) : [],
          {
            scale: 1,
            opacity: 1,
            stagger: 0.05,
            duration: 0.4,
            ease: 'power2.out',
          },
          0.15
        )
        // Official Studio Logo reveals LAST with premium authority
        .to(
          logoRef.current,
          { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out' },
          0.32
        )
        // Copyright & back to top settle
        .to(
          copyrightRef.current,
          { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' },
          0.48
        );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <footer
        id="footer"
        ref={footerRef}
        className="relative w-full bg-[#030508] text-white border-t border-white/10 select-none overflow-hidden snap-start snap-always"
      >
        {/* Subtle Ambient Radial Light */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-[800px] h-[250px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 100%, rgba(0, 140, 255, 0.08) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />

        <div className="relative z-10 max-w-[1720px] mx-auto px-6 sm:px-12 lg:px-16 pt-10 sm:pt-16 pb-8 sm:pb-12 flex flex-col justify-between">
          
          {/* Main Footer Row */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 md:gap-8 pb-12 sm:pb-14 border-b border-white/[0.08]">
            
            {/* Left: Official Brand Logo & Studio Subtitle */}
            <div ref={logoRef} className="flex flex-col items-center md:items-start">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTop();
                }}
                aria-label="BrandShoots — Back to Top"
                className="inline-block transition-transform duration-200 hover:scale-[1.03]"
              >
                <img
                  src="/Logo Official.svg"
                  alt="BrandShoots Official Logo"
                  className="h-11 sm:h-12 md:h-14 w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
                />
              </a>
              <span className="font-mono text-[11px] tracking-[0.24em] text-white/50 uppercase mt-3">
                Creative Branding & Content Studio
              </span>
            </div>

            {/* Center: Clean Useful Navigation */}
            <nav aria-label="Footer Navigation">
              <ul
                ref={navListRef}
                className="flex flex-wrap items-center justify-center gap-7 sm:gap-9 text-xs sm:text-[13px] font-mono tracking-[0.24em] uppercase text-white/75 font-medium"
              >
                <li>
                  <Link
                    to="/about"
                    className="hover:text-[#008CFF] transition-colors duration-200 cursor-pointer"
                  >
                    ABOUT
                  </Link>
                </li>
                <li>
                  <Link
                    to="/portfolio"
                    className="hover:text-[#008CFF] transition-colors duration-200 cursor-pointer"
                  >
                    PORTFOLIO
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('what-we-do')}
                    className="hover:text-[#008CFF] transition-colors duration-200 cursor-pointer"
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
                    className="text-[#008CFF] hover:text-[#52B2FF] font-semibold transition-colors duration-200 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>CONTACT</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_6px_#008CFF]" />
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Right: Official Social Media Links */}
            <div
              ref={socialsRef}
              className="flex items-center gap-3.5"
            >
              <a
                href="https://instagram.com/wearebrandshoots"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @wearebrandshoots"
                className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-[#008CFF] border border-white/10 hover:border-[#008CFF] flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-md hover:shadow-[0_0_16px_rgba(0,140,255,0.6)] active:scale-95"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href="https://youtube.com/@wearebrandshoots"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube @wearebrandshoots"
                className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-[#008CFF] border border-white/10 hover:border-[#008CFF] flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-md hover:shadow-[0_0_16px_rgba(0,140,255,0.6)] active:scale-95"
              >
                <Youtube className="w-4 h-4" />
              </a>

              <a
                href="https://facebook.com/wearebrandshoots"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook @wearebrandshoots"
                className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-[#008CFF] border border-white/10 hover:border-[#008CFF] flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-md hover:shadow-[0_0_16px_rgba(0,140,255,0.6)] active:scale-95"
              >
                <Facebook className="w-4 h-4" />
              </a>

              {/* Back to Top Quick Button */}
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Scroll to Top"
                className="w-10 h-10 rounded-full bg-white/[0.04] hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 ml-2 active:scale-95"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Bottom Copyright Row */}
          <div
            ref={copyrightRef}
            className="pt-7 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
          >
            <p className="font-mono text-[11px] sm:text-xs tracking-[0.22em] text-white/40 uppercase">
              © BRANDSHOOTS. ALL RIGHTS RESERVED.
            </p>
            <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] text-white/30 uppercase">
              CREATE. SHOOT. GROW.
            </p>
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
