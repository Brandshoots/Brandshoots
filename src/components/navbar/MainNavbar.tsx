import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Youtube, Facebook, MessageCircle, X } from 'lucide-react';

interface MainNavbarProps {
  onOpenContact?: () => void;
}

export const MainNavbar: React.FC<MainNavbarProps> = ({ onOpenContact }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

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
    `text-[12px] font-medium tracking-[0.16em] uppercase transition-colors duration-200 ${
      active ? 'text-[#1497F5]' : 'text-white/70 hover:text-white'
    }`;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[120] border-b transition-colors duration-300 ${
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
            <img src="/Logo Official.svg" alt="BrandShoots Official Logo" width={1600} height={365} className="h-10 sm:h-11 w-auto" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
            <Link to="/" onClick={handleHomeClick} className={navLinkClass(isHome)}>
              HOME
            </Link>
            <Link to="/about" onClick={(event) => handleSameRouteTop(event, isAbout)} className={navLinkClass(isAbout)}>
              ABOUT
            </Link>
            <Link to="/portfolio" onClick={(event) => handleSameRouteTop(event, isPortfolio)} className={navLinkClass(isPortfolio)}>
              PORTFOLIO
            </Link>
            <Link to="/packages" onClick={(event) => handleSameRouteTop(event, isPackages)} className={navLinkClass(isPackages)}>
              PACKAGES
            </Link>
            <Link
              to="/contact"
              onClick={handleContactClick}
              className="ml-3 border border-white/35 px-5 py-2.5 text-[11px] font-semibold tracking-[0.16em] text-white transition-colors duration-200 hover:border-[#1497F5] hover:bg-[#1497F5] uppercase"
            >
              CONTACT
            </Link>
          </nav>

          <button
            type="button"
            aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 border border-white/25 text-white md:hidden"
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
        <div className="fixed inset-0 z-[110] flex flex-col bg-[#08090C] px-6 pb-8 pt-28 md:hidden">
          <nav className="flex flex-col border-t border-white/15" aria-label="Mobile navigation">
            <Link to="/" onClick={handleHomeClick} className="border-b border-white/15 py-5 text-2xl font-semibold tracking-[-0.03em] text-white">
              HOME
            </Link>
            <Link to="/about" onClick={(event) => handleSameRouteTop(event, isAbout)} className="border-b border-white/15 py-5 text-2xl font-semibold tracking-[-0.03em] text-white">
              ABOUT
            </Link>
            <Link to="/portfolio" onClick={(event) => handleSameRouteTop(event, isPortfolio)} className="border-b border-white/15 py-5 text-2xl font-semibold tracking-[-0.03em] text-white">
              PORTFOLIO
            </Link>
            <Link to="/packages" onClick={(event) => handleSameRouteTop(event, isPackages)} className="border-b border-white/15 py-5 text-2xl font-semibold tracking-[-0.03em] text-white">
              PACKAGES
            </Link>
            <Link to="/contact" onClick={handleContactClick} className="border-b border-white/15 py-5 text-2xl font-semibold tracking-[-0.03em] text-[#1497F5]">
              CONTACT
            </Link>
          </nav>

          <div className="mt-auto flex flex-wrap items-center gap-5 border-t border-white/15 pt-5 text-sm text-white/55">
            <a href="https://instagram.com/wearebrandshoots" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
              <Instagram className="h-4 w-4" /> Instagram
            </a>
            <a href="https://youtube.com/@wearebrandshoots" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
              <Youtube className="h-4 w-4" /> YouTube
            </a>
            <a href="https://facebook.com/wearebrandshoots" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
              <Facebook className="h-4 w-4" /> Facebook
            </a>
            <a href="https://wa.me/917075960672" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default MainNavbar;
