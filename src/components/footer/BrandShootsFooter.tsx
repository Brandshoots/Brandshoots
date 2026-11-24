import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCMSContent } from '../../lib/cms/useCMSContent';
import { INITIAL_CONTACT_PAGE, INITIAL_SITE_SETTINGS } from '../../lib/cms/seedData';

gsap.registerPlugin(ScrollTrigger);

const safeHttpsUrl = (value: string | undefined, fallback: string): string => {
  try {
    const url = new URL((value || '').trim());
    if (url.protocol === 'https:' && url.hostname && !url.username && !url.password) {
      return url.toString();
    }
  } catch {}
  return fallback;
};

const sanitizeWhatsAppNumber = (...values: Array<string | undefined>): string => {
  for (const value of values) {
    const digits = (value || '').replace(/\D/g, '');
    if (/^\d{7,15}$/.test(digits)) return digits;
  }
  return INITIAL_SITE_SETTINGS.whatsappPhone;
};

interface BrandShootsFooterProps {
  onOpenContact?: () => void;
}

export const BrandShootsFooter: React.FC<BrandShootsFooterProps> = () => {
  const footerRef = useRef<HTMLElement>(null);
  const { settings, contact } = useCMSContent();
  const fullAddress = (contact?.fullAddress || INITIAL_CONTACT_PAGE.fullAddress).replace(
    /\bCollage\b/gi,
    'College'
  );
  const instagramUrl = safeHttpsUrl(
    settings?.instagramUrl,
    safeHttpsUrl(contact?.instagramUrl, INITIAL_SITE_SETTINGS.instagramUrl)
  );
  const youtubeUrl = safeHttpsUrl(
    settings?.youtubeUrl,
    safeHttpsUrl(contact?.youtubeUrl, INITIAL_SITE_SETTINGS.youtubeUrl)
  );
  const facebookUrl = safeHttpsUrl(contact?.facebookUrl, INITIAL_CONTACT_PAGE.facebookUrl);
  const whatsappPhone = sanitizeWhatsAppNumber(
    settings?.whatsappPhone,
    contact?.whatsappPhone,
    INITIAL_SITE_SETTINGS.whatsappPhone
  );
  const whatsappUrl = `https://wa.me/${whatsappPhone}`;

  const scrollToTop = () => {
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 0.9 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleServicesClick = (event: React.MouseEvent) => {
    if (window.location.pathname !== '/') return;
    const section = document.getElementById('what-we-do');
    if (!section) return;
    event.preventDefault();
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(section, { duration: 0.9 });
    else section.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const context = gsap.context(() => {
      if (!footerRef.current) return;
      gsap.fromTo(footerRef.current.querySelectorAll('nav a, footer a, footer button'), { opacity: 0, y: 14 }, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: { trigger: footerRef.current, start: 'top 88%', once: true },
      });
    }, footerRef);
    return () => context.revert();
  }, []);

  return (
    <footer ref={footerRef} id="footer" className="w-full bg-[#08090C] text-white">
      <div className="mx-auto w-full max-w-[1380px] px-5 pb-8 pt-16 sm:px-8 sm:pt-20 lg:px-12">
        <div className="flex flex-col gap-10 border-b border-white/20 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link to="/" onClick={() => window.location.pathname === '/' && scrollToTop()} className="inline-block">
              <img src="/Logo Official.svg" alt="BrandShoots Official Logo" width={1600} height={365} loading="lazy" decoding="async" className="h-12 w-auto sm:h-14" />
            </Link>
            <p className="mt-4 font-mono text-xs font-semibold tracking-[0.28em] text-white/55 uppercase">
              CREATE. <span className="text-[#008CFF]">SHOOT.</span> GROW.
            </p>
            <p className="mt-5 max-w-md font-sans font-light text-sm leading-relaxed text-white/60">
              A high-end creative agency engineering commercial films, visual architecture, and high-retention content systems for ambitious brands.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-4 font-mono text-xs font-semibold tracking-[0.2em] text-white/65 uppercase sm:flex sm:flex-wrap sm:gap-8">
            <Link to="/" className="transition-colors hover:text-[#008CFF]">HOME</Link>
            <Link to="/about" className="transition-colors hover:text-[#008CFF]">ABOUT</Link>
            <Link to="/portfolio" className="transition-colors hover:text-[#008CFF]">PORTFOLIO</Link>
            <Link to="/results" className="transition-colors hover:text-[#008CFF]">RESULTS</Link>
            <Link to="/packages" className="transition-colors hover:text-[#008CFF]">PACKAGES</Link>
            <Link to="/#what-we-do" onClick={handleServicesClick} className="transition-colors hover:text-[#008CFF]">SERVICES</Link>
            <Link to="/contact" className="text-[#008CFF] transition-colors hover:text-white">CONTACT</Link>
          </nav>
        </div>

        <div className="flex flex-col gap-8 border-b border-white/20 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-sans font-light text-white/65">
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">YouTube</a>
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a>
          </div>
          <button type="button" onClick={scrollToTop} className="self-start font-mono text-xs tracking-[0.2em] text-white/50 uppercase transition-colors hover:text-[#008CFF] sm:self-auto">
            Back to Top ↑
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-6 font-mono text-[10px] tracking-[0.12em] text-white/50 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-8">
          <address className="min-w-0 max-w-3xl whitespace-normal break-words font-normal not-italic normal-case leading-relaxed [overflow-wrap:anywhere]">
            {fullAddress}
          </address>
          <span className="whitespace-normal sm:whitespace-nowrap sm:text-right">
            © {new Date().getFullYear()} BrandShoots. ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default BrandShootsFooter;
