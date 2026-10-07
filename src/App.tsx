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
import { ContactModal } from './components/hero/ContactModal';
import { ClientProjectView } from './components/portfolio/ClientProjectView';
import { AboutPage } from './pages/AboutPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ContactPage } from './pages/ContactPage';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const location = useLocation();
  const [preloaderActive, setPreloaderActive] = useState(() => {
    // If nopreload query param is provided or directly accessing a project/about/portfolio/contact route, bypass
    if (typeof window !== 'undefined') {
      if (window.location.search.includes('nopreload')) return false;
      if (
        window.location.pathname.startsWith('/portfolio') ||
        window.location.pathname.startsWith('/projects/') ||
        window.location.pathname.startsWith('/about') ||
        window.location.pathname.startsWith('/contact')
      ) {
        return false;
      }
    }
    return true;
  });
  const [contactModalOpen, setContactModalOpen] = useState(false);

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

    // Expose lenis globally for interactive triggers
    (window as any).__lenis = lenis;

    // Section positions for keyboard navigation
    const getTargets = () => {
      const hero = document.getElementById('hero');
      const whatWeDo = document.getElementById('what-we-do');
      const clients = document.getElementById('clients');
      const leadership = document.getElementById('leadership');
      const testimonials = document.getElementById('testimonials');
      const cta = document.getElementById('cta');

      if (!hero || !whatWeDo || !clients || !leadership || !cta) return null;

      const vh = window.innerHeight;
      const heroTop = 0;
      const whatWeDoTop = whatWeDo.offsetTop;
      const clientsTop = clients.offsetTop;
      const leadershipTop = leadership.offsetTop;
      const testimonialsTop = testimonials ? testimonials.offsetTop : leadershipTop + 600;
      const ctaTop = cta.offsetTop;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);

      return {
        heroTop,
        whatWeDoTop,
        clientsTop,
        leadershipTop,
        testimonialsTop,
        ctaTop,
        maxScroll,
      };
    };

    // Keyboard Section Navigation (ArrowDown, ArrowUp, PageDown, PageUp)
    let isProgrammaticScrolling = false;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (location.pathname !== '/' || isProgrammaticScrolling) return;
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(e.key)) {
        const targets = getTargets();
        if (!targets) return;

        const currentScroll = window.scrollY;
        const sectionPoints = [
          targets.heroTop,
          targets.whatWeDoTop,
          targets.clientsTop,
          targets.leadershipTop,
          targets.testimonialsTop,
          targets.ctaTop,
          targets.maxScroll,
        ];

        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
          const next = sectionPoints.find((pt) => pt > currentScroll + 20);
          if (next !== undefined) {
            e.preventDefault();
            isProgrammaticScrolling = true;
            lenis.scrollTo(next, {
              duration: 0.75,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              onComplete: () => {
                isProgrammaticScrolling = false;
              },
            });
          }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          const prev = [...sectionPoints].reverse().find((pt) => pt < currentScroll - 20);
          if (prev !== undefined) {
            e.preventDefault();
            isProgrammaticScrolling = true;
            lenis.scrollTo(prev, {
              duration: 0.75,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              onComplete: () => {
                isProgrammaticScrolling = false;
              },
            });
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Refresh ScrollTrigger once DOM layout finishes settling
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
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
                  <MainNavbar onOpenContact={() => setContactModalOpen(true)} />
                  <BrandShootsHero />
                  <WhatWeDoSection />
                  <OurClientsSection />
                  <TheLeadershipSection />
                  <TestimonialsSection3D />
                  <FinalCtaSection onOpenContact={() => setContactModalOpen(true)} />
                  <BrandShootsFooter onOpenContact={() => setContactModalOpen(true)} />
                  <ContactModal
                    isOpen={contactModalOpen}
                    onClose={() => setContactModalOpen(false)}
                  />
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
      </Routes>
    </main>
  );
}

export default App;
