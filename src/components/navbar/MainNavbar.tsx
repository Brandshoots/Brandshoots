import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Youtube, Facebook, MessageCircle, X } from 'lucide-react';
import { useCMSContent } from '../../lib/cms/useCMSContent';
import { INITIAL_CONTACT_PAGE, INITIAL_SITE_SETTINGS } from '../../lib/cms/seedData';

const safeHttpsUrl = (value: string | undefined, fallback: string): string => {
  try {
    const url = new URL((value || '').trim());
    return url.protocol === 'https:' && url.hostname && !url.username && !url.password
      ? url.toString()
      : fallback;
  } catch {
    return fallback;
  }
};

const sanitizeWhatsAppNumber = (...values: Array<string | undefined>): string => {
  for (const value of values) {
    const digits = (value || '').replace(/\D/g, '');
    if (/^\d{7,15}$/.test(digits)) return digits;
  }
  return INITIAL_SITE_SETTINGS.whatsappPhone;
};

interface MainNavbarProps {
  onOpenContact?: () => void;
}

export const MainNavbar: React.FC<MainNavbarProps> = ({ onOpenContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { settings, contact } = useCMSContent();
  const instagramUrl = safeHttpsUrl(
    settings?.instagramUrl,
    safeHttpsUrl(contact?.instagramUrl, INITIAL_CONTACT_PAGE.instagramUrl)
  );
  const youtubeUrl = safeHttpsUrl(
    settings?.youtubeUrl,
    safeHttpsUrl(contact?.youtubeUrl, INITIAL_CONTACT_PAGE.youtubeUrl)
  );
  const facebookUrl = safeHttpsUrl(contact?.facebookUrl, INITIAL_CONTACT_PAGE.facebookUrl);
  const whatsappPhone = sanitizeWhatsAppNumber(
    settings?.whatsappPhone,
    contact?.whatsappPhone,
    INITIAL_SITE_SETTINGS.whatsappPhone
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled((window.scrollY || document.documentElement.scrollTop) > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  const isHome = location.pathname === '/';
  const isAbout = location.pathname.startsWith('/about');
  const isPortfolio =
    location.pathname.startsWith('/portfolio') || location.pathname.startsWith('/projects');
  const isResults = location.pathname.startsWith('/results');
  const isPackages = location.pathname.startsWith('/packages');
  const isContact = location.pathname.startsWith('/contact');

  const handleHomeClick = (event: React.MouseEvent) => {
    setMenuOpen(false);
    if (!isHome) return;
    event.preventDefault();
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 0.8 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactClick = (event: React.MouseEvent) => {
    setMenuOpen(false);
    if (onOpenContact) {
      event.preventDefault();
      onOpenContact();
      return;
    }

    if (!isContact) return;
    event.preventDefault();
    const form = document.getElementById('contact-form');
    if (!form) return;
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(form, { duration: 0.8 });
    else form.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSameRouteTop = (event: React.MouseEvent, active: boolean) => {
    setMenuOpen(false);
    if (!active) return;
    event.preventDefault();
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 0.8 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinkClass = (active: boolean) =>
    `font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-colors duration-200 ${
      active ? 'text-[#008CFF]' : 'text-white/70 hover:text-white'
    }`;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[260] border-b transition-colors duration-300 ${
          isScrolled || menuOpen
            ? 'border-white/10 bg-[#08090C]/95 backdrop-blur-md'
            : 'border-transparent bg-[#08090C]/25'
        }`}
      >
        <div className="mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link
            to="/"
            onClick={handleHomeClick}
            aria-label="BrandShoots Official Logo"
            className="flex shrink-0 items-center"
          >
            <img src="/Logo Official.svg" alt="BrandShoots Official Logo" width={1600} height={365} className="h-20 sm:h-22 w-auto" />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Primary navigation">
            <Link to="/" onClick={handleHomeClick} className={navLinkClass(isHome)}>
              HOME
            </Link>
            <Link to="/portfolio" onClick={(event) => handleSameRouteTop(event, isPortfolio)} className={navLinkClass(isPortfolio)}>
              PORTFOLIO
            </Link>
            <Link to="/results" onClick={(event) => handleSameRouteTop(event, isResults)} className={navLinkClass(isResults)}>
              RESULTS
            </Link>
            <Link to="/packages" onClick={(event) => handleSameRouteTop(event, isPackages)} className={navLinkClass(isPackages)}>
              PACKAGES
            </Link>
            <Link to="/about" onClick={(event) => handleSameRouteTop(event, isAbout)} className={navLinkClass(isAbout)}>
              ABOUT
            </Link>
            <Link
              to="/contact"
              onClick={handleContactClick}
              className="ml-3 border border-white/35 px-5 py-2 font-mono text-xs font-semibold tracking-[0.2em] text-white transition-colors duration-200 hover:border-[#008CFF] hover:bg-[#008CFF] uppercase"
            >
              CONTACT
            </Link>
          </nav>

          <button
            type="button"
            aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 border border-white/25 text-white lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <>
              <span className="block h-px w-5 bg-white" />
              <span className="block h-px w-5 bg-white" />
              <span className="block h-px w-5 bg-white" />
            </>}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[250] flex flex-col overflow-y-auto bg-[#08090C] px-6 pb-8 pt-28 lg:hidden">
          <nav className="flex flex-col border-t border-white/15" aria-label="Mobile navigation">
            <Link to="/" onClick={handleHomeClick} className="border-b border-white/15 py-5 font-sans text-2xl font-black uppercase tracking-tight text-white">
              HOME
            </Link>
            <Link to="/portfolio" onClick={(event) => handleSameRouteTop(event, isPortfolio)} className="border-b border-white/15 py-5 font-sans text-2xl font-black uppercase tracking-tight text-white">
              PORTFOLIO
            </Link>
            <Link to="/results" onClick={(event) => handleSameRouteTop(event, isResults)} className="border-b border-white/15 py-5 font-sans text-2xl font-black uppercase tracking-tight text-white">
              RESULTS
            </Link>
            <Link to="/packages" onClick={(event) => handleSameRouteTop(event, isPackages)} className="border-b border-white/15 py-5 font-sans text-2xl font-black uppercase tracking-tight text-white">
              PACKAGES
            </Link>
            <Link to="/about" onClick={(event) => handleSameRouteTop(event, isAbout)} className="border-b border-white/15 py-5 font-sans text-2xl font-black uppercase tracking-tight text-white">
              ABOUT
            </Link>
            <Link to="/contact" onClick={handleContactClick} className="border-b border-white/15 py-5 font-sans text-2xl font-black uppercase tracking-tight text-[#008CFF]">
              CONTACT
            </Link>
          </nav>

          <div className="mt-auto border-t border-white/15 pt-6 pb-2">
            <div className="flex items-center justify-around sm:justify-start sm:gap-6 text-white/70">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 hover:text-[#E1306C] hover:border-[#E1306C]/40 hover:bg-[#E1306C]/10 transition-all duration-200 active:scale-95"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/10 transition-all duration-200 active:scale-95"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10 transition-all duration-200 active:scale-95"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={`https://wa.me/${whatsappPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 hover:text-[#25D366] hover:border-[#25D366]/40 hover:bg-[#25D366]/10 transition-all duration-200 active:scale-95"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MainNavbar;
