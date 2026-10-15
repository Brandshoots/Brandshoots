import React, { useState, useEffect, useCallback } from 'react';
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
import { BrandShootsFooter } from '../components/footer/BrandShootsFooter';

gsap.registerPlugin(ScrollTrigger);

export const AboutPage: React.FC = () => {
  const [preloaderActive, setPreloaderActive] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('nopreload')) {
      return false;
    }
    return true;
  });

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderActive(false);
  }, []);

  // Set document title, scroll to top, and clear legacy session flag
  useEffect(() => {
    document.title = 'About | BRANDSHOOTS — Create. Shoot. Grow.';
    window.scrollTo(0, 0);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('brandshoots_about_seen');
      } catch (e) {
        // Ignore storage exceptions
      }
    }
  }, []);

  // Butter-Smooth Lenis Inertial Scrolling synced with GSAP ScrollTrigger
  useEffect(() => {
    if (preloaderActive) return;

    const lenis = new Lenis({
      duration: 1.25,
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
    // Maintain healthy lagSmoothing to prevent visual stuttering on momentary frame spikes
    gsap.ticker.lagSmoothing(500, 33);

    (window as any).__lenis = lenis;

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      delete (window as any).__lenis;
      gsap.ticker.remove(ticker);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
    };
  }, [preloaderActive]);

  return (
    <main className="relative w-full min-h-screen bg-[#04060A] text-white overflow-x-hidden">
      {/* 1. FAST SVG PRELOADER OVERLAY WITH OFFICIAL LOGO ONLY */}
      {preloaderActive && (
        <StrokeRevealPreloader onComplete={handlePreloaderComplete} />
      )}

      {/* 2. CINEMATIC ABOUT PAGE CHAPTERS (Rendered seamlessly underneath preloader overlay) */}
      <AboutNavbar />

      {/* 3D Brand Manifesto: CREATE -> SHOOT -> GROW with Amplified 3D Depth */}
      <ManifestoScrollSection />

      {/* Rebuilt 100vw × 100vh 3D Chapter: THE BRANDSHOOTS CORE */}
      <BrandShootsCore3D />

      {/* Leadership: Durgarao Vallepu */}
      <AboutLeadershipSection />

      {/* Ready to Collaborate CTA */}
      <AboutFooter />

      {/* Official BrandShoots Footer (Identical to Homepage) */}
      <BrandShootsFooter />
    </main>
  );
};

export default AboutPage;
