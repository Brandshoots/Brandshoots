import React, { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ContactNavbar } from '../components/contact/ContactNavbar';
import { ContactFormSection } from '../components/contact/ContactFormSection';
import { BrandShootsFooter } from '../components/footer/BrandShootsFooter';

gsap.registerPlugin(ScrollTrigger);

interface ContactPageProps {
  transitionActive?: boolean;
}

export const ContactPage: React.FC<ContactPageProps> = ({ transitionActive = false }) => {

  // Butter-Smooth Lenis Inertial Scrolling synced with GSAP ScrollTrigger
  useEffect(() => {
    if (transitionActive) return;

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
    gsap.ticker.lagSmoothing(500, 33);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      clearTimeout(timer);
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, [transitionActive]);

  useEffect(() => {
    if (transitionActive || window.location.hash !== '#site-visit') return;
    const timer = window.setTimeout(() => {
      document.getElementById('site-visit')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [transitionActive]);

  const handleScrollToForm = () => {
    const el = document.getElementById('contact-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="relative w-full min-h-screen bg-[#04060A] text-white overflow-x-hidden selection:bg-[#008CFF] selection:text-white">
      {/* CONTACT NAVBAR */}
      <ContactNavbar onScrollToForm={handleScrollToForm} />

      {/* 3. CINEMATIC CONTACT FORM & SITE VISIT SECTION */}
      <ContactFormSection />

      {/* 4. OFFICIAL BrandShoots FOOTER */}
      <BrandShootsFooter onOpenContact={handleScrollToForm} />
    </main>
  );
};
