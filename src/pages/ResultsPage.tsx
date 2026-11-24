import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CMSResult } from '../types/cms';
import { MainNavbar } from '../components/navbar/MainNavbar';
import { BrandShootsFooter } from '../components/footer/BrandShootsFooter';
import { ResultCard } from '../components/results/ResultCard';
import { ResultCaseStudyModal } from '../components/results/ResultCaseStudyModal';
import { useResults } from '../lib/cms/useResults';

gsap.registerPlugin(ScrollTrigger);

interface ResultsPageProps {
  transitionActive?: boolean;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ transitionActive = false }) => {
  const pageRef = useRef<HTMLElement>(null);
  const {
    results,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    error,
  } = useResults();
  const [selectedResult, setSelectedResult] = useState<CMSResult | null>(null);
  const [playVideoOnOpen, setPlayVideoOnOpen] = useState(false);

  const openCaseStudy = useCallback((result: CMSResult) => {
    setPlayVideoOnOpen(false);
    setSelectedResult(result);
  }, []);

  const openResultVideo = useCallback((result: CMSResult) => {
    setPlayVideoOnOpen(true);
    setSelectedResult(result);
  }, []);

  const closeCaseStudy = useCallback(() => {
    setSelectedResult(null);
    setPlayVideoOnOpen(false);
  }, []);

  useEffect(() => {
    if (transitionActive) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = new Lenis({
      duration: reducedMotion ? 0 : 1.25,
      easing: (value) => Math.min(1, 1.001 - Math.pow(2, -10 * value)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !reducedMotion,
      wheelMultiplier: reducedMotion ? 1 : 0.95,
      touchMultiplier: reducedMotion ? 1 : 1.1,
    });

    lenis.on('scroll', ScrollTrigger.update);
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(500, 33);

    const browserWindow = window as Window & { __lenis?: Lenis };
    browserWindow.__lenis = lenis;

    const firstRefresh = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    const secondRefresh = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    const handleVisibilityChange = () => {
      if (document.hidden) gsap.ticker.remove(ticker);
      else gsap.ticker.add(ticker);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearTimeout(firstRefresh);
      window.clearTimeout(secondRefresh);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      gsap.ticker.remove(ticker);
      lenis.off('scroll', ScrollTrigger.update);
      if (browserWindow.__lenis === lenis) delete browserWindow.__lenis;
      lenis.destroy();
    };
  }, [transitionActive]);

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page || transitionActive) return;

    const revealElements = page.querySelectorAll<HTMLElement>('[data-results-page-reveal]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(revealElements, { clearProps: 'all' });
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        revealElements,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'power2.out' }
      );
    }, page);

    return () => context.revert();
  }, [transitionActive]);

  useEffect(() => {
    if (isLoading) return;
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 80);
    return () => window.clearTimeout(refreshTimer);
  }, [isLoading, results.length]);

  return (
    <main
      ref={pageRef}
      data-results-page
      className="relative min-h-screen w-full overflow-x-hidden bg-[#08090C] text-white"
      style={{ pointerEvents: transitionActive ? 'none' : 'auto' }}
      aria-hidden={transitionActive}
    >
      <MainNavbar />

      <section aria-labelledby="results-page-title" className="px-5 pb-24 pt-36 sm:px-8 sm:pb-28 sm:pt-40 lg:px-12 lg:pb-36">
        <div className="mx-auto w-full max-w-[1380px]">
          <header data-results-page-reveal className="grid min-w-0 gap-8 border-b border-white/20 pb-9 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-end">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#008CFF]">
                Published case studies
              </p>
              <h1 id="results-page-title" className="mt-4 break-words text-5xl font-black uppercase leading-[0.86] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
                Work you can <br />measure.
              </h1>
            </div>
            <p className="max-w-md text-base font-light leading-relaxed text-white/60 lg:justify-self-end">
              Before-and-after audience and content performance from BrandShoots client engagements.
            </p>
          </header>

          <div className="min-w-0 pt-10" aria-busy={isLoading || isLoadingMore}>
            {isLoading && (
              <div data-results-loading role="status" className="border-y border-white/15 py-20 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                  Loading published results…
                </p>
              </div>
            )}

            {!isLoading && error && results.length === 0 && (
              <div data-results-error role="alert" className="border-y border-white/15 py-20 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#008CFF]">
                  Results could not be loaded
                </p>
                <p className="mx-auto mt-3 max-w-md text-sm font-light leading-relaxed text-white/55">
                  Please check your connection and try again.
                </p>
              </div>
            )}

            {!isLoading && !error && results.length === 0 && (
              <div data-results-empty className="border-y border-white/15 py-20 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                  No published results yet
                </p>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <>
                {error && (
                  <div data-results-error role="alert" className="mb-8 border-l-2 border-[#008CFF] py-2 pl-4 text-sm text-white/60">
                    Live updates are temporarily unavailable. Showing the latest loaded results.
                  </div>
                )}

                <div data-results-grid className="grid min-w-0 grid-cols-1 items-start gap-x-10 gap-y-16 lg:grid-cols-2 lg:gap-y-20">
                  {results.map((result) => (
                    <ResultCard
                      key={result.id}
                      result={result}
                      onViewCaseStudy={openCaseStudy}
                      onPlayVideo={openResultVideo}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-16 flex justify-center border-t border-white/20 pt-9">
                    <button
                      type="button"
                      data-results-load-more
                      onClick={loadMore}
                      disabled={isLoadingMore}
                      className="min-w-[190px] border border-white/35 px-7 py-4 text-xs font-bold uppercase tracking-[0.22em] text-white transition-colors hover:border-[#008CFF] hover:bg-[#008CFF] disabled:cursor-wait disabled:opacity-55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008CFF]"
                    >
                      {isLoadingMore ? 'Loading…' : 'Load more'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <BrandShootsFooter />

      <ResultCaseStudyModal
        isOpen={selectedResult !== null}
        result={selectedResult}
        onClose={closeCaseStudy}
        initialVideoPlayback={playVideoOnOpen}
      />
    </main>
  );
};

export default ResultsPage;
