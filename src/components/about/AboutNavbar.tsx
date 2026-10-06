import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Facebook, X } from 'lucide-react';

interface AboutNavbarProps {
  onOpenContact?: () => void;
}

export const AboutNavbar: React.FC<AboutNavbarProps> = ({ onOpenContact: _onOpenContact }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            className="text-[#008CFF] hover:text-[#52B2FF] transition-colors duration-200 flex items-center justify-center p-1"
          >
            <svg
              className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(0,140,255,0.75)]"
              viewBox="0 0 24 24"
            >
              <path d="M12 3L2 12h3v8h6v-5h2v5h6v-8h3L12 3z" />
            </svg>
          </Link>

          {/* Active About */}
          <span className="text-[#008CFF] font-semibold tracking-[0.22em] flex items-center gap-1.5 cursor-default">
            <span>About</span>
          </span>

          <Link
            to="/portfolio"
            className="hover:text-white transition-colors duration-200 cursor-pointer uppercase tracking-[0.22em]"
          >
            Portfolio
          </Link>

          <Link
            to="/contact"
            className="hover:text-white transition-colors duration-200 cursor-pointer uppercase tracking-[0.22em]"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Right CTA: Get in Touch (Navigates to /contact) */}
        <div className="hidden md:flex items-center">
          <Link
            to="/contact"
            className="text-white hover:text-[#008CFF] font-sans text-xs lg:text-[13px] tracking-[0.22em] uppercase font-semibold transition-colors duration-200 cursor-pointer"
          >
            Get in Touch
          </Link>
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
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/90 hover:text-white transition-colors"
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

            <span className="text-xl font-display font-semibold tracking-[0.16em] uppercase text-[#008CFF]">
              About
            </span>

            <Link
              to="/portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-display font-semibold tracking-[0.16em] uppercase text-white/90 hover:text-[#008CFF] transition-colors duration-200"
            >
              Portfolio
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-display font-semibold tracking-[0.16em] uppercase text-white/90 hover:text-[#008CFF] transition-colors duration-200"
            >
              Contact
            </Link>

            {/* Prominent CTA in Mobile Menu */}
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 px-8 py-3.5 rounded-full bg-[#008CFF] text-white text-xs tracking-[0.24em] uppercase font-bold shadow-[0_0_24px_rgba(0,140,255,0.5)] hover:bg-[#209CFF] transition-all duration-200 active:scale-95 inline-block text-center"
            >
              Get in Touch
            </Link>
          </div>

          {/* Bottom Social Media Links & Icons */}
          <div className="relative z-10 border-t border-white/10 pt-5 flex flex-col items-center gap-3.5 text-center">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/45">
              Connect With Us
            </span>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/wearebrandshoots"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram /wearebrandshoots"
                className="w-11 h-11 rounded-full bg-white/[0.08] hover:bg-[#008CFF] border border-white/15 hover:border-[#008CFF] flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-md hover:shadow-[0_0_16px_rgba(0,140,255,0.6)] active:scale-95"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                href="https://youtube.com/@wearebrandshoots"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube /wearebrandshoots"
                className="w-11 h-11 rounded-full bg-white/[0.08] hover:bg-[#008CFF] border border-white/15 hover:border-[#008CFF] flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-md hover:shadow-[0_0_16px_rgba(0,140,255,0.6)] active:scale-95"
              >
                <Youtube className="w-5 h-5" />
              </a>

              <a
                href="https://facebook.com/wearebrandshoots"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook /wearebrandshoots"
                className="w-11 h-11 rounded-full bg-white/[0.08] hover:bg-[#008CFF] border border-white/15 hover:border-[#008CFF] flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 shadow-md hover:shadow-[0_0_16px_rgba(0,140,255,0.6)] active:scale-95"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <span className="font-mono text-[11px] tracking-[0.2em] text-[#008CFF] font-semibold">
              /wearebrandshoots
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default AboutNavbar;
