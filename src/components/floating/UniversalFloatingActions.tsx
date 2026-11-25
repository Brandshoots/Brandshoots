import React, { useEffect, useState } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCMSContent } from '../../lib/cms/useCMSContent';
import { INITIAL_CONTACT_PAGE, INITIAL_SITE_SETTINGS } from '../../lib/cms/seedData';

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

const InstagramGlyph: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <linearGradient id="igFloatingGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="25%" stopColor="#e6683c" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="75%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <path
      fill="url(#igFloatingGradient)"
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
    />
  </svg>
);

const WhatsAppGlyph: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="#25D366">
    <path d="M20.52 3.48A11.82 11.82 0 0 0 12.1 0C5.56 0 .24 5.32.24 11.86c0 2.09.55 4.13 1.59 5.93L.14 24l6.36-1.67a11.86 11.86 0 0 0 5.6 1.42h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.14-3.45-8.41Zm-8.42 18.27h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.78.99 1.01-3.68-.23-.38a9.85 9.85 0 0 1-1.51-5.23C2.19 6.43 6.63 2 12.1 2c2.65 0 5.14 1.03 7.01 2.9A9.84 9.84 0 0 1 22 11.89c0 5.44-4.43 9.86-9.9 9.86Zm5.41-7.39c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
  </svg>
);

export const UniversalFloatingActions: React.FC = () => {
  const location = useLocation();
  const { settings, contact } = useCMSContent();
  const isAdmin = location.pathname.startsWith('/admin');
  const isReferenceLab = location.pathname.startsWith('/reference-lab');
  const isContactPage = location.pathname === '/contact';
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    if (isAdmin || isReferenceLab) return;

    let rafId: number | null = null;
    const updateVisibility = () => {
      rafId = null;
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        setShowBackToTop(false);
        return;
      }
      // Show after ~42% scroll depth and remain visible down to the bottom
      setShowBackToTop(scrollTop / maxScroll >= 0.42);
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateVisibility);
      }
    };

    updateVisibility();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isAdmin, isReferenceLab, location.pathname]);

  const handleBackToTop = () => {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 0.9 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isAdmin || isReferenceLab) return null;

  const whatsappPhone = sanitizeWhatsAppNumber(
    settings?.whatsappPhone,
    contact?.whatsappPhone,
    INITIAL_SITE_SETTINGS.whatsappPhone
  );
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    'Hi BrandShoots, I would like to discuss a film production project.'
  )}`;
  const instagramUrl = safeHttpsUrl(
    settings?.instagramUrl,
    safeHttpsUrl(contact?.instagramUrl, INITIAL_CONTACT_PAGE.instagramUrl)
  );

  const actionClass =
    'group relative flex h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008CFF]';
  const tooltipClass =
    'pointer-events-none absolute md:bottom-full md:mb-2.5 md:left-1/2 md:-translate-x-1/2 hidden whitespace-nowrap rounded-md bg-[#0C1019]/95 border border-white/10 px-2.5 py-1 text-[11px] font-medium tracking-[0.06em] text-white/90 shadow-xl backdrop-blur-md opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 md:block';

  return (
    <div
      data-floating-actions
      className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-2.5 sm:right-5 md:bottom-6 md:right-8 z-[200] flex flex-col items-end gap-2.5 pointer-events-none"
    >
      {/* Global Floating Back to Top Button (appears after ~42% scroll) */}
      <button
        type="button"
        onClick={handleBackToTop}
        aria-label="Back to top"
        title="Back to top"
        className={`group relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#070A10]/90 backdrop-blur-xl border border-white/15 text-white/80 hover:text-white hover:border-[#008CFF]/60 hover:bg-[#008CFF]/15 shadow-[0_8px_28px_rgba(0,0,0,0.65)] transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008CFF] ${
          showBackToTop
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto cursor-pointer'
            : 'opacity-0 translate-y-3 scale-90 pointer-events-none'
        }`}
      >
        <ArrowUp className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-[#008CFF] transition-transform duration-200 group-hover:-translate-y-0.5" strokeWidth={2.2} />
      </button>

      <aside
        aria-label="Quick actions"
        className="pointer-events-auto flex flex-col md:flex-row items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full bg-[#070A10]/90 backdrop-blur-xl border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
      >
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open BrandShoots on Instagram"
          title="Instagram"
          className={`${actionClass} hover:bg-[#E1306C]/15`}
        >
          <span className={tooltipClass}>Instagram</span>
          <InstagramGlyph className="h-4 w-4 sm:h-[18px] sm:w-[18px] transition-transform duration-200 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(225,48,108,0.35)]" />
        </a>

        <div className="w-4 h-[1px] md:w-[1px] md:h-4 bg-white/[0.12]" aria-hidden="true" />

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with BrandShoots on WhatsApp"
          title="WhatsApp"
          className={`${actionClass} hover:bg-[#25D366]/15`}
        >
          <span className={tooltipClass}>WhatsApp</span>
          <WhatsAppGlyph className="h-4 w-4 sm:h-[18px] sm:w-[18px] transition-transform duration-200 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(37,211,102,0.35)]" />
        </a>

        <div className="w-4 h-[1px] md:w-[1px] md:h-4 bg-white/[0.12]" aria-hidden="true" />

        <Link
          to="/contact"
          aria-label="Contact BrandShoots"
          title="Contact"
          className={`${actionClass} hover:bg-[#008CFF]/15 ${isContactPage ? 'bg-[#008CFF]/20 ring-1 ring-[#008CFF]/50' : ''}`}
        >
          <span className={tooltipClass}>Contact</span>
          <MessageCircle
            className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-[#008CFF] transition-transform duration-200 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(0,140,255,0.4)]"
            strokeWidth={2.2}
          />
        </Link>
      </aside>
    </div>
  );
};

export default UniversalFloatingActions;
