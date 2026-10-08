import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StrokeRevealPreloader } from '../components/about/StrokeRevealPreloader';
import { PortfolioNavbar } from '../components/portfolio/PortfolioNavbar';
import { PortfolioWormhole3D } from '../components/portfolio/PortfolioWormhole3D';
import { PortfolioClienteleSection } from '../components/portfolio/PortfolioClienteleSection';
import { BrandShootsFooter } from '../components/footer/BrandShootsFooter';

gsap.registerPlugin(ScrollTrigger);

export const PortfolioPage: React.FC = () => {
  const [preloaderActive, setPreloaderActive] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('nopreload')) {
      return false;
    }
    return true;
  });

  // Set document title and scroll to top on mount
  useEffect(() => {
    document.title = 'Portfolio | BRANDSHOOTS — Cinematic Showcase';
    window.scrollTo(0, 0);
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
    <main className="relative w-full min-h-screen bg-[#020306] text-white select-none">
      {/* Page Preloader */}
      {preloaderActive && (
        <StrokeRevealPreloader onComplete={() => setPreloaderActive(false)} />
      )}

      {/* 1. HOMEPAGE-MATCHED NAVIGATION BAR */}
      <PortfolioNavbar />

      {/* 2. 100vw × 100vh 3D CINEMATIC CORRIDOR (PROJECTS 01-08) */}
      <PortfolioWormhole3D />

      {/* 3. EDITORIAL CLIENTELE SECTION */}
      <PortfolioClienteleSection />

      {/* 4. FINAL BRANDSHOOTS CINEMATIC FOOTER */}
      <BrandShootsFooter />
    </main>
  );
};

export default PortfolioPage;
