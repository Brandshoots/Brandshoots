import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrandShootsPreloader } from './components/preloader/BrandShootsPreloader';
import { BrandShootsHero } from './components/hero/BrandShootsHero';
import { WhatWeDoSection } from './components/what-we-do/WhatWeDoSection';
import { OurClientsSection } from './components/clients/OurClientsSection';
import { TheLeadershipSection } from './components/leadership/TheLeadershipSection';
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

    // -------------------------------------------------------------------------
    // CINEMATIC 100vh / 100vw CHAPTER SNAP-LOCKING SYSTEM
    // -------------------------------------------------------------------------
    // Firmly locks each chapter into full 100vh/100vw frame upon scroll rest.
    // Prevents awkward half-section resting, prevents stranded views.
    let snapTimeout: number | undefined;
    let isProgrammaticScrolling = false;
    let lastScrollY = window.scrollY;

    const getElementDocTop = (el: HTMLElement | null): number => {
      if (!el) return 0;
      const target = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el;
      const rect = target.getBoundingClientRect();
      return Math.round(rect.top + window.scrollY);
    };

    const getTargets = () => {
      const hero = document.getElementById('hero');
      const whatWeDo = document.getElementById('what-we-do');
      const clients = document.getElementById('clients');
      const leadership = document.getElementById('leadership');
      const cta = document.getElementById('cta');

      if (!hero || !whatWeDo || !clients || !leadership || !cta) return null;

      const vh = window.innerHeight;
      const heroTop = 0;
      const whatWeDoTop = getElementDocTop(whatWeDo);
      const clientsTop = getElementDocTop(clients);
      const clientsEnd = clientsTop + Math.round(vh * 1.6);
      const leadershipTop = getElementDocTop(leadership);
      const ctaTop = getElementDocTop(cta);
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);

      return {
        heroTop,
        whatWeDoTop,
        clientsTop,
        clientsEnd,
        leadershipTop,
        ctaTop,
        maxScroll,
      };
    };

    const determineTarget = (currentScroll: number, isScrollingDown: boolean) => {
      const targets = getTargets();
      if (!targets) return null;

      const {
        heroTop,
        whatWeDoTop,
        clientsTop,
        clientsEnd,
        leadershipTop,
        ctaTop,
        maxScroll,
      } = targets;

      // 1. Between Hero (0) and What We Do (whatWeDoTop)
      if (currentScroll < whatWeDoTop - 30) {
        if (isScrollingDown) {
          return currentScroll > whatWeDoTop * 0.28 ? whatWeDoTop : heroTop;
        } else {
          return currentScroll < whatWeDoTop * 0.72 ? heroTop : whatWeDoTop;
        }
      }

      // 2. Between What We Do and Clients Start (clientsTop)
      if (currentScroll >= whatWeDoTop - 30 && currentScroll < clientsTop - 30) {
        const mid = whatWeDoTop + (clientsTop - whatWeDoTop) * 0.35;
        if (isScrollingDown) {
          return currentScroll > mid ? clientsTop : whatWeDoTop;
        } else {
          return currentScroll < mid + 60 ? whatWeDoTop : clientsTop;
        }
      }

      // 3. Inside Clients Pinned Scrub Region (clientsTop to clientsEnd)
      // The section is pinned to 100vh, user is scrubbing 3-5 client logos
      if (currentScroll >= clientsTop - 30 && currentScroll <= clientsEnd + 30) {
        if (currentScroll < clientsTop + 50 && !isScrollingDown) {
          return whatWeDoTop;
        }
        if (currentScroll > clientsEnd - 50 && isScrollingDown) {
          return leadershipTop;
        }
        // Active scrubbing range: do not snap-interfere while user is reviewing logos
        return null;
      }

      // 4. Between Clients Pin End and Leadership (leadershipTop)
      if (currentScroll > clientsEnd + 30 && currentScroll < leadershipTop - 30) {
        const mid = clientsEnd + (leadershipTop - clientsEnd) * 0.35;
        if (isScrollingDown) {
          return currentScroll > mid ? leadershipTop : clientsTop;
        } else {
          return currentScroll < mid ? clientsTop : leadershipTop;
        }
      }

      // 5. Between Leadership (leadershipTop) and CTA (ctaTop)
      if (currentScroll >= leadershipTop - 30 && currentScroll < ctaTop - 30) {
        const mid = leadershipTop + (ctaTop - leadershipTop) * 0.4;
        if (isScrollingDown) {
          return currentScroll > mid ? ctaTop : leadershipTop;
        } else {
          return currentScroll < mid ? leadershipTop : ctaTop;
        }
      }

      // 6. Between CTA and Page Bottom (maxScroll / Footer)
      if (currentScroll >= ctaTop - 30) {
        const mid = ctaTop + (maxScroll - ctaTop) * 0.5;
        if (isScrollingDown) {
          return currentScroll > mid ? maxScroll : ctaTop;
        } else {
          return currentScroll < mid ? ctaTop : maxScroll;
        }
      }

      return null;
    };

    const handleScrollSnap = () => {
      if (isProgrammaticScrolling || location.pathname !== '/') return;

      const currentScroll = window.scrollY;
      const isScrollingDown = currentScroll >= lastScrollY;
      lastScrollY = currentScroll;

      window.clearTimeout(snapTimeout);
      snapTimeout = window.setTimeout(() => {
        if (isProgrammaticScrolling) return;

        // If still coasting with momentum, wait for inertial velocity to subside
        if (Math.abs(lenis.velocity) > 0.15) {
          handleScrollSnap();
          return;
        }

        const currentPos = window.scrollY;
        const targetTop = determineTarget(currentPos, isScrollingDown);
        if (targetTop === null) return;

        // If already within 6px of target, section is firmly locked
        if (Math.abs(currentPos - targetTop) <= 6) return;

        const isMobile = window.innerWidth < 768;
        isProgrammaticScrolling = true;
        lenis.scrollTo(targetTop, {
          duration: isMobile ? 0.6 : 0.8,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          onComplete: () => {
            isProgrammaticScrolling = false;
          },
        });
      }, 130);
    };

    lenis.on('scroll', handleScrollSnap);

    // Keyboard Section Navigation (ArrowDown, ArrowUp, PageDown, PageUp)
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
      window.clearTimeout(snapTimeout);
      window.removeEventListener('keydown', handleKeyDown);
      delete (window as any).__lenis;
      lenis.off('scroll', handleScrollSnap);
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, [preloaderActive, location.pathname]);

  return (
    <main className="relative w-full min-h-screen bg-[#05070B] overflow-x-hidden snap-y snap-proximity md:snap-none">
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
                  <BrandShootsHero />
                  <WhatWeDoSection />
                  <OurClientsSection />
                  <TheLeadershipSection />
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
