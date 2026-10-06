import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioNavbar } from '../components/portfolio/PortfolioNavbar';
import { PortfolioWormhole3D } from '../components/portfolio/PortfolioWormhole3D';
import { ContactModal } from '../components/hero/ContactModal';

gsap.registerPlugin(ScrollTrigger);

export const PortfolioPage: React.FC = () => {
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Set document title and scroll to top on mount
  useEffect(() => {
    document.title = 'Portfolio | BRANDSHOOTS — 3D Cinematic Archive';
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative w-full min-h-screen bg-[#030508] text-white select-none">
      {/* 1. HOMEPAGE-MATCHED NAVIGATION BAR */}
      <PortfolioNavbar onOpenContact={() => setContactModalOpen(true)} />

      {/* 2. 100vw × 100vh 3D TIME MACHINE / WORMHOLE CINEMATIC CORRIDOR */}
      <PortfolioWormhole3D />

      {/* 3. CONTACT MODAL */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </main>
  );
};

export default PortfolioPage;
