import React, { lazy, ReactNode, Suspense, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrandShootsPreloader } from '../components/preloader/BrandShootsPreloader';
import { MainNavbar } from '../components/navbar/MainNavbar';
import { BrandShootsHero } from '../components/hero/BrandShootsHero';

gsap.registerPlugin(ScrollTrigger);

const BrandStatementSection = lazy(() => import('../components/statement/BrandStatementSection').then((module) => ({ default: module.BrandStatementSection })));
const AnnouncementsSection = lazy(() => import('../components/announcements/AnnouncementsSection').then((module) => ({ default: module.AnnouncementsSection })));
const BrandMetricsSection = lazy(() => import('../components/metrics/BrandMetricsSection').then((module) => ({ default: module.BrandMetricsSection })));
const WhatWeDoSection = lazy(() => import('../components/what-we-do/WhatWeDoSection').then((module) => ({ default: module.WhatWeDoSection })));
const PackagesTeaser = lazy(() => import('../components/packages/PackagesTeaser').then((module) => ({ default: module.PackagesTeaser })));
const TheLeadershipSection = lazy(() => import('../components/leadership/TheLeadershipSection').then((module) => ({ default: module.TheLeadershipSection })));
const OurClientsSection = lazy(() => import('../components/clients/OurClientsSection').then((module) => ({ default: module.OurClientsSection })));
const TestimonialsSection3D = lazy(() => import('../components/testimonials/TestimonialsSection3D').then((module) => ({ default: module.TestimonialsSection3D })));
const FinalCtaSection = lazy(() => import('../components/cta/FinalCtaSection').then((module) => ({ default: module.FinalCtaSection })));
const BrandShootsFooter = lazy(() => import('../components/footer/BrandShootsFooter').then((module) => ({ default: module.BrandShootsFooter })));

interface DeferredHomepageSectionProps {
  children: ReactNode;
  minHeight: number;
}

const DeferredHomepageSection: React.FC<DeferredHomepageSectionProps> = ({ children, minHeight }) => {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const placeholder = placeholderRef.current;
    if (!placeholder || shouldRender) return;
    if (!('IntersectionObserver' in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin: '700px 0px' }
    );
    observer.observe(placeholder);
    return () => observer.disconnect();
  }, [shouldRender]);

  useEffect(() => {
    if (!shouldRender) return;
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 60);
    return () => window.clearTimeout(timer);
  }, [shouldRender]);

  return (
    <div ref={placeholderRef} style={shouldRender ? undefined : { minHeight }}>
      {shouldRender ? <Suspense fallback={<div style={{ minHeight }} aria-hidden="true" />}>{children}</Suspense> : null}
    </div>
  );
};

export const HomePage: React.FC = () => {
  const [preloaderActive, setPreloaderActive] = useState(() => {
    if (window.location.search.includes('nopreload')) return false;
    try {
      return sessionStorage.getItem('brandshoots_preloader_seen') !== '1';
    } catch {
      return true;
    }
  });

  const handlePreloaderComplete = () => {
    try {
      sessionStorage.setItem('brandshoots_preloader_seen', '1');
    } catch {}
    setPreloaderActive(false);
  };

  useEffect(() => {
    if (preloaderActive) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (value) => Math.min(1, 1.001 - Math.pow(2, -10 * value)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
    });
    lenis.on('scroll', ScrollTrigger.update);
    (window as any).__lenis = lenis;

    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(500, 33);

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    const handleVisibilityChange = () => {
      if (document.hidden) gsap.ticker.remove(ticker);
      else gsap.ticker.add(ticker);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearTimeout(refreshTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      delete (window as any).__lenis;
      gsap.ticker.remove(ticker);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
    };
  }, [preloaderActive]);

  return (
    <>
      {preloaderActive && <BrandShootsPreloader onComplete={handlePreloaderComplete} />}
      <div
        id="homepage-experience"
        className="w-full"
        style={{ pointerEvents: preloaderActive ? 'none' : 'auto' }}
        aria-hidden={preloaderActive}
      >
        <MainNavbar />
        <BrandShootsHero isPreloaderActive={preloaderActive} />
        {!preloaderActive && (
          <>
            <DeferredHomepageSection minHeight={680}><BrandStatementSection /></DeferredHomepageSection>
            <DeferredHomepageSection minHeight={760}><AnnouncementsSection /></DeferredHomepageSection>
            <DeferredHomepageSection minHeight={640}><BrandMetricsSection /></DeferredHomepageSection>
            <DeferredHomepageSection minHeight={2400}><WhatWeDoSection /></DeferredHomepageSection>
            <DeferredHomepageSection minHeight={820}><PackagesTeaser /></DeferredHomepageSection>
            <DeferredHomepageSection minHeight={820}><TheLeadershipSection /></DeferredHomepageSection>
            <DeferredHomepageSection minHeight={760}><OurClientsSection /></DeferredHomepageSection>
            <DeferredHomepageSection minHeight={680}><TestimonialsSection3D /></DeferredHomepageSection>
            <DeferredHomepageSection minHeight={680}><FinalCtaSection /></DeferredHomepageSection>
            <DeferredHomepageSection minHeight={480}><BrandShootsFooter /></DeferredHomepageSection>
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;
