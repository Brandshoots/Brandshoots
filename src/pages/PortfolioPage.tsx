import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StrokeRevealPreloader } from '../components/about/StrokeRevealPreloader';
import { PortfolioNavbar } from '../components/portfolio/PortfolioNavbar';
import { JosephBerryPortfolio } from '../components/portfolio/JosephBerryPortfolio';
import { ContactModal } from '../components/hero/ContactModal';

gsap.registerPlugin(ScrollTrigger);

export const PortfolioPage: React.FC = () => {
  const [preloaderActive, setPreloaderActive] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('nopreload')) {
      return false;
    }
    return true;
  });
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Set document title and scroll to top on mount
  useEffect(() => {
    document.title = 'Portfolio | BRANDSHOOTS — Interactive Cinematic Showcase';
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative w-full min-h-screen bg-[#020306] text-white select-none">
      {/* Page Preloader */}
      {preloaderActive && (
        <StrokeRevealPreloader onComplete={() => setPreloaderActive(false)} />
      )}

      {/* 1. HOMEPAGE-MATCHED NAVIGATION BAR */}
      <PortfolioNavbar onOpenContact={() => setContactModalOpen(true)} />

      {/* 2. FULLSCREEN PROJECT-DRIVEN INTERACTIVE PORTFOLIO SHOWCASE */}
      <JosephBerryPortfolio />

      {/* 3. CONTACT MODAL */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </main>
  );
};

export default PortfolioPage;
