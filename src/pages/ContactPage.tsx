import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { StrokeRevealPreloader } from '../components/about/StrokeRevealPreloader';
import { ContactNavbar } from '../components/contact/ContactNavbar';
import { ContactFormSection } from '../components/contact/ContactFormSection';
import { BrandShootsFooter } from '../components/footer/BrandShootsFooter';

gsap.registerPlugin(ScrollTrigger);

export const ContactPage: React.FC = () => {
  const [preloaderActive, setPreloaderActive] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('nopreload')) {
      return false;
    }
    return true;
  });

  // Set document title & reset scroll
  useEffect(() => {
    document.title = 'Contact | BRANDSHOOTS — Creative Branding & Production Studio';
    window.scrollTo(0, 0);
  }, []);

  // Butter-Smooth Lenis Inertial Scrolling synced with GSAP ScrollTrigger
  useEffect(() => {
    if (preloaderActive) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      clearTimeout(timer);
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, [preloaderActive]);

  const handleScrollToForm = () => {
    const el = document.getElementById('contact-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="relative w-full min-h-screen bg-[#04060A] text-white overflow-x-hidden selection:bg-[#008CFF] selection:text-white">
      {/* 1. FAST SVG STROKE-DRAWING PRELOADER OVERLAY */}
      {preloaderActive && (
        <StrokeRevealPreloader onComplete={() => setPreloaderActive(false)} />
      )}

      {/* 2. CONTACT NAVBAR (EXACT HOMEPAGE STYLE WITH CONTACT ACTIVE) */}
      <ContactNavbar onScrollToForm={handleScrollToForm} />

      {/* 3. CINEMATIC CONTACT FORM & SITE VISIT SECTION */}
      <ContactFormSection />

      {/* 4. OFFICIAL BRANDSHOOTS FOOTER */}
      <BrandShootsFooter onOpenContact={handleScrollToForm} />
    </main>
  );
};
