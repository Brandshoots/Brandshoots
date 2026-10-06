import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Facebook, X } from 'lucide-react';

interface ContactNavbarProps {
  onScrollToForm?: () => void;
}

export const ContactNavbar: React.FC<ContactNavbarProps> = ({ onScrollToForm }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetInTouch = () => {
    if (onScrollToForm) {
      onScrollToForm();
    } else {
      const el = document.getElementById('contact-form');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. DESKTOP / MAIN NAVIGATION BAR (IDENTICAL TO HOMEPAGE)  */}
      {/* ========================================================= */}
      <header className="absolute top-0 left-0 right-0 z-50 w-full px-5 sm:px-8 md:px-12 lg:px-16 pt-5 sm:pt-6 md:pt-7 flex items-center justify-between">
        {/* Brand Logo (Upper Left) */}
        <div className="flex items-center">
          <Link
            to="/"
            className="inline-block transition-transform duration-200 hover:scale-[1.03]"
            aria-label="BrandShoots — Back to Home"
          >
            <img
              src="/Logo Official.svg"
              alt="BrandShoots Official Logo"
              className="h-12 xs:h-14 sm:h-16 md:h-[68px] lg:h-[78px] w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
            />
          </Link>
        </div>

        {/* Desktop Minimal Navigation */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-11 text-white/85 font-sans text-xs lg:text-[13px] tracking-[0.22em] uppercase font-medium">
          {/* Home Icon (Electric Blue) */}
          <Link
            to="/"
            aria-label="Home"
            className="text-white/85 hover:text-[#008CFF] transition-colors duration-200 flex items-center justify-center p-1"
          >
            <svg
              className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(0,140,255,0.4)]"
              viewBox="0 0 24 24"
            >
              <path d="M12 3L2 12h3v8h6v-5h2v5h6v-8h3L12 3z" />
            </svg>
          </Link>

          <Link
            to="/about"
            className="hover:text-white transition-colors duration-200 cursor-pointer uppercase tracking-[0.22em]"
          >
            About
          </Link>

          <Link
            to="/portfolio"
            className="hover:text-white transition-colors duration-200 cursor-pointer uppercase tracking-[0.22em]"
          >
            Portfolio
          </Link>

          {/* Active Contact */}
          <span className="text-[#008CFF] font-semibold tracking-[0.22em] flex items-center gap-1.5 cursor-default">
            <span>Contact</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
          </span>
        </nav>

        {/* Desktop Right CTA: Get in Touch (Scrolls to form) */}
        <div className="hidden md:flex items-center">
          <button
            type="button"
            onClick={handleGetInTouch}
            className="text-white hover:text-[#008CFF] font-sans text-xs lg:text-[13px] tracking-[0.22em] uppercase font-semibold transition-colors duration-200 cursor-pointer"
          >
            Get in Touch
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          aria-label="Open Navigation Menu"
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden flex flex-col justify-center items-center w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 text-white hover:text-[#008CFF] hover:border-[#008CFF]/40 focus:outline-none transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
        >
          <span className="w-5 h-[2px] bg-white rounded-full mb-1.5 transition-transform" />
          <span className="w-5 h-[2px] bg-white rounded-full mb-1.5 transition-transform" />
          <span className="w-3.5 h-[2px] bg-[#008CFF] rounded-full self-end mr-1 transition-transform" />
        </button>
      </header>

      {/* ========================================================= */}
      {/* 2. MOBILE TRANSLUCENT BLURRED NAVIGATION MENU (TRANS-BLUR) */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-8 select-none bg-[#05070A]/85 backdrop-blur-2xl transition-all duration-300 animate-fadeIn">
          {/* Top Bar with Logo and Close Button */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-block"
            >
              <img
                src="/Logo Official.svg"
                alt="BrandShoots Logo"
                className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
              />
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Navigation"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/90 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex flex-col gap-6 py-8 items-center text-center">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-xl font-display font-semibold tracking-[0.16em] uppercase text-white/80 hover:text-white transition-colors duration-200"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 3L2 12h3v8h6v-5h2v5h6v-8h3L12 3z" />
              </svg>
              <span>Home</span>
            </Link>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-display font-semibold tracking-[0.16em] uppercase text-white/80 hover:text-white transition-colors duration-200"
            >
              About
            </Link>

            <Link
              to="/portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-display font-semibold tracking-[0.16em] uppercase text-white/80 hover:text-white transition-colors duration-200"
            >
              Portfolio
            </Link>

            <span className="text-xl font-display font-bold tracking-[0.16em] uppercase text-[#008CFF] flex items-center gap-2 cursor-default">
              <span>Contact</span>
              <span className="w-2 h-2 rounded-full bg-[#008CFF] shadow-[0_0_10px_#008CFF]" />
            </span>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleGetInTouch();
              }}
              className="mt-4 px-8 py-3.5 rounded-full bg-[#008CFF] text-white text-xs tracking-[0.24em] uppercase font-bold shadow-[0_0_24px_rgba(0,140,255,0.5)] hover:bg-[#209CFF] transition-all duration-200 active:scale-95"
            >
              Start A Conversation
            </button>
          </div>

          {/* Bottom Socials */}
          <div className="border-t border-white/10 pt-4 flex flex-col items-center gap-3">
            <div className="flex items-center gap-5">
              <a
                href="https://instagram.com/wearebrandshoots"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#008CFF] flex items-center justify-center text-white/80 hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@wearebrandshoots"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#008CFF] flex items-center justify-center text-white/80 hover:text-white transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/wearebrandshoots"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#008CFF] flex items-center justify-center text-white/80 hover:text-white transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40">
              @wearebrandshoots
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactNavbar;
