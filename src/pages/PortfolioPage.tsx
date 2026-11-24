import React, { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioNavbar } from '../components/portfolio/PortfolioNavbar';
import { PortfolioWormhole3D } from '../components/portfolio/PortfolioWormhole3D';
import { PortfolioClienteleSection } from '../components/portfolio/PortfolioClienteleSection';
import { FinalCtaSection } from '../components/cta/FinalCtaSection';
import { BrandShootsFooter } from '../components/footer/BrandShootsFooter';

gsap.registerPlugin(ScrollTrigger);

interface PortfolioPageProps {
  transitionActive?: boolean;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ transitionActive = false }) => {

  // Butter-Smooth Lenis Inertial Scrolling synced with GSAP ScrollTrigger
  useEffect(() => {
    if (transitionActive) return;

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
    gsap.ticker.lagSmoothing(500, 33);

    (window as any).__lenis = lenis;

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    const timer2 = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      delete (window as any).__lenis;
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, [transitionActive]);

  return (
    <main className="relative w-full min-h-screen bg-[#020306] text-white overflow-x-hidden">
      {/* HOMEPAGE-MATCHED NAVIGATION BAR */}
      <PortfolioNavbar />
      <h1 className="sr-only">BrandShoots Commercial Video Portfolio</h1>

      {/* 2. 100vw × 100vh 3D CINEMATIC CORRIDOR (PROJECTS 01-08) */}
      <PortfolioWormhole3D />

      {/* 3. EDITORIAL CLIENTELE SECTION */}
      <PortfolioClienteleSection />

      {/* 4. CLIMAX CALL-TO-ACTION SECTION */}
      <FinalCtaSection />

      {/* 5. FINAL BrandShoots CINEMATIC FOOTER */}
      <BrandShootsFooter />
    </main>
  );
};

export default PortfolioPage;
