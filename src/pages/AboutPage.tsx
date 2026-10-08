import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { StrokeRevealPreloader } from '../components/about/StrokeRevealPreloader';
import { AboutNavbar } from '../components/about/AboutNavbar';
import { ManifestoScrollSection } from '../components/about/ManifestoScrollSection';
import { BrandShootsCore3D } from '../components/about/BrandShootsCore3D';
import { AboutLeadershipSection } from '../components/about/AboutLeadershipSection';
import { AboutFooter } from '../components/about/AboutFooter';

gsap.registerPlugin(ScrollTrigger);

export const AboutPage: React.FC = () => {
  const [preloaderActive, setPreloaderActive] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('nopreload')) {
      return false;
    }
    return true;
  });

  // Set document title
  useEffect(() => {
    document.title = 'About | BRANDSHOOTS — Creative Branding & Production Studio';
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
      touchMultiplier: 1.0,
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
    <main className="relative w-full min-h-screen bg-[#04060A] text-white overflow-x-hidden">
      {/* 1. FAST SVG PRELOADER OVERLAY WITH OFFICIAL LOGO ONLY */}
      {preloaderActive && (
        <StrokeRevealPreloader onComplete={() => setPreloaderActive(false)} />
      )}

      {/* 2. CINEMATIC ABOUT PAGE CHAPTERS (Rendered seamlessly underneath preloader overlay) */}
      <AboutNavbar />

      {/* 3D Brand Manifesto: CREATE -> SHOOT -> GROW with Amplified 3D Depth */}
      <ManifestoScrollSection />

      {/* Rebuilt 100vw × 100vh 3D Chapter: THE BRANDSHOOTS CORE */}
      <BrandShootsCore3D />

      {/* Leadership: Durgarao Vallepu */}
      <AboutLeadershipSection />

      {/* Ready to Collaborate (Heavy GSAP) & Footer */}
      <AboutFooter />
    </main>
  );
};

export default AboutPage;
