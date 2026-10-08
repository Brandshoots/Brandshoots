import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StrokeRevealPreloader } from '../components/about/StrokeRevealPreloader';
import { PortfolioNavbar } from '../components/portfolio/PortfolioNavbar';
import { PortfolioWormhole3D } from '../components/portfolio/PortfolioWormhole3D';
import { ContactModal } from '../components/hero/ContactModal';

gsap.registerPlugin(ScrollTrigger);

export const PortfolioPage: React.FC = () => {
  const [preloaderActive, setPreloaderActive] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.search.includes('nopreload')) return false;
      // If user has already loaded the site, don't interrupt internal route navigation
      if (sessionStorage.getItem('bs_intro_seen')) return false;
    }
    return true;
  });
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Set document title and scroll to top on mount
  useEffect(() => {
    document.title = 'Portfolio | BRANDSHOOTS — 3D Cinematic Archive';
    window.scrollTo(0, 0);
    sessionStorage.setItem('bs_intro_seen', 'true');
  }, []);

  // Butter-Smooth Lenis Inertial Scrolling synced with GSAP ScrollTrigger
  useEffect(() => {
    if (preloaderActive) return;

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.15,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    (window as any).__lenis = lenis;

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      clearTimeout(timer);
      delete (window as any).__lenis;
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, [preloaderActive]);

  return (
    <main className="relative w-full min-h-screen bg-[#020306] text-white select-none overflow-x-hidden">
      {/* Page Preloader */}
      {preloaderActive && (
        <StrokeRevealPreloader onComplete={() => setPreloaderActive(false)} />
      )}

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
