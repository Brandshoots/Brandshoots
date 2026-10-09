import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrandShootsPreloader } from './components/preloader/BrandShootsPreloader';
import { MainNavbar } from './components/navbar/MainNavbar';
import { BrandShootsHero } from './components/hero/BrandShootsHero';
import { WhatWeDoSection } from './components/what-we-do/WhatWeDoSection';
import { OurClientsSection } from './components/clients/OurClientsSection';
import { TheLeadershipSection } from './components/leadership/TheLeadershipSection';
import { TestimonialsSection3D } from './components/testimonials/TestimonialsSection3D';
import { FinalCtaSection } from './components/cta/FinalCtaSection';
import { BrandShootsFooter } from './components/footer/BrandShootsFooter';
import { ClientProjectView } from './components/portfolio/ClientProjectView';
import { AboutPage } from './pages/AboutPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const location = useLocation();
  const [preloaderActive, setPreloaderActive] = useState(() => {
    // If nopreload query param is provided or directly accessing a project/about/portfolio/contact/admin route, bypass
    if (typeof window !== 'undefined') {
      if (window.location.search.includes('nopreload')) return false;
      if (
        window.location.pathname.startsWith('/portfolio') ||
        window.location.pathname.startsWith('/projects/') ||
        window.location.pathname.startsWith('/about') ||
        window.location.pathname.startsWith('/contact') ||
        window.location.pathname.startsWith('/admin')
      ) {
        return false;
      }
    }
    return true;
  });

  // Always reset scroll to top on page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Butter-smooth Lenis inertial scrolling synchronized with GSAP ScrollTrigger (homepage only)
  useEffect(() => {
    if (preloaderActive) return;
    // Only run the homepage scroll engine on the homepage route
    if (location.pathname !== '/') return;

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.35,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // Expose lenis globally for interactive triggers and smooth navigation
    (window as any).__lenis = lenis;

    // Refresh ScrollTrigger once DOM layout finishes settling
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      clearTimeout(timer);
      delete (window as any).__lenis;
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, [preloaderActive, location.pathname]);

  return (
    <main className="relative w-full min-h-screen bg-[#05070B] overflow-x-hidden">
      {/* Routes: non-homepage routes always render regardless of preloader state */}
      <Routes>
        {/* HOMEPAGE — gated behind cinematic startup preloader */}
        <Route
          path="/"
          element={
            <>
              {/* 1. Master Cinematic Startup Preloader (homepage only) */}
              {preloaderActive && (
                <BrandShootsPreloader onComplete={() => setPreloaderActive(false)} />
              )}

              {/* 2. BrandShoots Cinematic Homepage Sections */}
              {!preloaderActive && (
                <div id="homepage-experience" className="w-full">
                  <MainNavbar />
                  <BrandShootsHero />
                  <WhatWeDoSection />
                  <OurClientsSection />
                  <TheLeadershipSection />
                  <TestimonialsSection3D />
                  <FinalCtaSection />
                  <BrandShootsFooter />
                </div>
              )}
            </>
          }
        />

        {/* PORTFOLIO 3D WORMHOLE EXPERIENCE */}
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/:clientSlug" element={<ClientProjectView />} />
        <Route path="/projects/:clientSlug" element={<ClientProjectView />} />

        {/* ABOUT — always accessible, has its own StrokeRevealPreloader */}
        <Route path="/about" element={<AboutPage />} />

        {/* CONTACT — always accessible, has its own StrokeRevealPreloader */}
        <Route path="/contact" element={<ContactPage />} />

        {/* ADMIN CMS & PORTAL */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </main>
  );
}

export default App;
