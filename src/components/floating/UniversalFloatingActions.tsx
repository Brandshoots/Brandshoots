import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarCheck, ArrowUp } from 'lucide-react';
import { useCMSContent } from '../../lib/cms/useCMSContent';

export const UniversalFloatingActions: React.FC = () => {
  const location = useLocation();
  const { contact } = useCMSContent();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isPastHeroOnMobile, setIsPastHeroOnMobile] = useState(false);

  // Hide on admin portal
  const isAdmin = location.pathname.startsWith('/admin');

  // Track scroll position for Back to Top and mobile hero clearance
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowBackToTop(scrollY > 300);

      if (window.innerWidth < 768) {
        // On mobile, keep the Hero title 100% unblocked; fade in actions once user starts scrolling
        setIsPastHeroOnMobile(scrollY > 140);
      } else {
        // On desktop, always show
        setIsPastHeroOnMobile(true);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Smooth scroll to top supporting Lenis & Native
  const handleScrollToTop = useCallback(() => {
    const lenis = (window as any).__lenis;
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(0, { duration: 1.1 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  if (isAdmin) {
    return null;
  }

  const rawPhone = contact?.whatsappPhone || '917075960672';
  const cleanPhone = rawPhone.replace(/\D/g, '') || '917075960672';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Hi BrandShoots, I would like to discuss a film production project.'
  )}`;
  const instagramUrl = contact?.instagramUrl || 'https://instagram.com/wearebrandshoots';

  return (
    <aside
      aria-label="Quick Actions"
      className={`fixed bottom-3 sm:bottom-6 right-3 sm:right-6 z-[60] flex flex-col items-end gap-2 sm:gap-3 select-none transition-all duration-300 ease-out ${
        isPastHeroOnMobile
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-5 pointer-events-none'
      }`}
    >
      {/* ========================================================= */}
      {/* 1. BACK TO TOP (Smooth Scroll to Top, visible when scrolled) */}
      {/* ========================================================= */}
      <div
        className={`transition-all duration-300 ease-out transform ${
          showBackToTop
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-3 scale-90 pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={handleScrollToTop}
          aria-label="Back to Top"
          className="group relative flex items-center h-10 sm:h-11 rounded-full bg-gradient-to-r from-[#0052D4] via-[#008CFF] to-[#38BDF8] text-white border border-white/30 hover:border-white/60 shadow-[0_6px_20px_rgba(0,140,255,0.45)] hover:shadow-[0_8px_30px_rgba(0,140,255,0.7)] transition-all duration-300 ease-out cursor-pointer hover:scale-105 active:scale-95 overflow-hidden"
        >
          {/* Glossy top light sheen */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none" />

          {/* Centered Icon */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] group-hover:-translate-y-0.5 transition-transform duration-200">
            <ArrowUp className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.6]" />
          </div>

          {/* Expandable Label */}
          <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-[130px] group-hover:opacity-100 group-hover:pr-4 group-hover:pl-0.5 transition-all duration-300 ease-out font-sans font-bold text-xs sm:text-[13px] text-white tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            Back to Top
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 2. INSTAGRAM (Redirects to official Instagram)            */}
      {/* ========================================================= */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow BrandShoots on Instagram"
        className="group relative flex items-center h-10 sm:h-11 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white border border-white/30 hover:border-white/60 shadow-[0_6px_20px_rgba(225,48,108,0.45)] hover:shadow-[0_8px_30px_rgba(225,48,108,0.7)] transition-all duration-300 ease-out pointer-events-auto cursor-pointer hover:scale-105 active:scale-95 overflow-hidden"
      >
        {/* Glossy top light sheen */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none" />

        {/* Centered Icon */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
          <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-white" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>

        {/* Expandable Label */}
        <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-[130px] group-hover:opacity-100 group-hover:pr-4 group-hover:pl-0.5 transition-all duration-300 ease-out font-sans font-bold text-xs sm:text-[13px] text-white tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          Instagram
        </span>
      </a>

      {/* ========================================================= */}
      {/* 3. WHATSAPP (Direct WhatsApp Chat)                        */}
      {/* ========================================================= */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center h-10 sm:h-11 rounded-full bg-gradient-to-r from-[#075E54] via-[#128C7E] to-[#25D366] text-white border border-white/30 hover:border-white/60 shadow-[0_6px_20px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.7)] transition-all duration-300 ease-out pointer-events-auto cursor-pointer hover:scale-105 active:scale-95 overflow-hidden"
      >
        {/* Glossy top light sheen */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none" />

        {/* Centered Icon */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
          <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-white" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </div>

        {/* Expandable Label */}
        <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-[150px] group-hover:opacity-100 group-hover:pr-4 group-hover:pl-0.5 transition-all duration-300 ease-out font-sans font-bold text-xs sm:text-[13px] text-white tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          WhatsApp
        </span>
      </a>

      {/* ========================================================= */}
      {/* 4. BOOK (Redirects to /contact)                           */}
      {/* ========================================================= */}
      <Link
        to="/contact"
        aria-label="Book a Film Shoot"
        className="group relative flex items-center h-10 sm:h-11 rounded-full bg-gradient-to-r from-[#8A0025] via-[#E50914] to-[#FF4B6E] text-white border border-white/30 hover:border-white/60 shadow-[0_6px_20px_rgba(229,9,20,0.45)] hover:shadow-[0_8px_30px_rgba(229,9,20,0.7)] transition-all duration-300 ease-out pointer-events-auto cursor-pointer hover:scale-105 active:scale-95 overflow-hidden"
      >
        {/* Glossy top light sheen */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none" />

        {/* Centered Icon */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
          <CalendarCheck className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.2]" />
        </div>

        {/* Expandable Label */}
        <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-[140px] group-hover:opacity-100 group-hover:pr-4 group-hover:pl-0.5 transition-all duration-300 ease-out font-sans font-bold text-xs sm:text-[13px] text-white tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          Book Shoot
        </span>
      </Link>
    </aside>
  );
};

export default UniversalFloatingActions;
