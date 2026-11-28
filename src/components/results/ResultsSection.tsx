import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CMSResult } from '../../types/cms';
import { useFeaturedResults } from '../../lib/cms/useResults';
import { ResultCard } from './ResultCard';
import { ResultCaseStudyModal } from './ResultCaseStudyModal';

gsap.registerPlugin(ScrollTrigger);

export const ResultsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { results, isLoading, error } = useFeaturedResults();
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

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || results.length === 0) return;

    const revealElements = section.querySelectorAll<HTMLElement>('[data-results-reveal]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(revealElements, { clearProps: 'all' });
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        revealElements,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            once: true,
          },
        }
      );
    }, section);

    return () => context.revert();
  }, [results]);

  if (!isLoading && (error || results.length === 0)) return null;

  return (
    <section
      ref={sectionRef}
      data-results-section="featured"
      aria-labelledby="featured-results-title"
      className="w-full overflow-hidden bg-[#08090C] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-12 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <div data-results-reveal className="flex flex-col gap-6 border-b border-white/20 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#008CFF]">
              Measured growth
            </p>
            <h2 id="featured-results-title" className="mt-3 text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              Results that <br />show the work.
            </h2>
          </div>
          <p className="max-w-sm text-sm font-light leading-relaxed text-white/55 sm:text-right">
            Verified before-and-after snapshots from published BrandShoots engagements.
          </p>
        </div>

        {isLoading ? (
          <div role="status" aria-live="polite" className="border-b border-white/15 py-16 text-sm text-white/55">
            Loading published results…
          </div>
        ) : results.length === 1 ? (
          <div data-results-reveal className="min-w-0 pt-10">
            <ResultCard
              result={results[0]}
              layout="spotlight"
              onViewCaseStudy={openCaseStudy}
              onPlayVideo={openResultVideo}
            />
          </div>
        ) : (
          <div
            className={`grid min-w-0 grid-cols-1 gap-x-7 gap-y-10 pt-10 ${
              results.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
            }`}
          >
            {results.slice(0, 3).map((result) => (
              <div key={result.id} data-results-reveal className="min-w-0">
                <ResultCard
                  result={result}
                  onViewCaseStudy={openCaseStudy}
                  onPlayVideo={openResultVideo}
                />
              </div>
            ))}
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div data-results-reveal className="mt-14 border-t border-white/20 pt-7 text-right">
            <Link
              to="/results"
              className="group inline-flex items-center gap-3 border-b border-[#008CFF] pb-1 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:text-[#008CFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008CFF]"
            >
              View all results
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>

      <ResultCaseStudyModal
        isOpen={selectedResult !== null}
        result={selectedResult}
        onClose={closeCaseStudy}
        initialVideoPlayback={playVideoOnOpen}
      />
    </section>
  );
};

export default ResultsSection;
