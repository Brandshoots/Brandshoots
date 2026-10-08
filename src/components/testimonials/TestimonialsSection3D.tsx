import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  id: string;
  client: string;
  quote: string;
  author: string;
  role: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'bags-world',
    client: 'Bags World',
    quote:
      'The energy and pacing they brought to our commercial reels was electric. They gave our retail presence a nationwide brand aura that drove unprecedented organic engagement.',
    author: 'Rajesh Jain',
    role: 'Founder & CEO',
  },
  {
    id: 'viswatuff',
    client: 'Viswatuff Glass',
    quote:
      'BrandShoots transformed how our industrial architectural products are perceived in the market. The film didn’t just showcase glass — it felt like an international luxury architectural showcase.',
    author: 'Visweswara Rao',
    role: 'Managing Director',
  },
  {
    id: 'aabharan',
    client: 'Aabharan Jewellers',
    quote:
      'Their visual direction captured the heritage and intricate craftsmanship of our temple jewelry with breathtaking nuance. Every cut, macro shot, and transition reflected pure luxury.',
    author: 'Kiran Kumar',
    role: 'Creative Director',
  },
  {
    id: 'shanti-pipes',
    client: 'Shanti Pipes',
    quote:
      'A masterclass in industrial storytelling. They managed to make heavy infrastructure manufacturing look dynamic, futuristic, and commanding. Our corporate identity leveled up overnight.',
    author: 'Santhi Ramudu',
    role: 'Executive Director',
  },
  {
    id: 'jain-beauty',
    client: 'Jain Beauty Studio',
    quote:
      'Every single frame was high-fashion editorial art. BrandShoots doesn’t just shoot footage; they architect an entire visual culture for your brand that resonates deeply with audiences.',
    author: 'Pooja Jain',
    role: 'Brand Lead',
  },
];

export const TestimonialsSection3D: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteContainerRef = useRef<HTMLDivElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isTransitioningRef = useRef(false);

  // Touch Swipe Gesture Tracking
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);

  const goTo = useCallback(
    (targetIdx: number) => {
      if (targetIdx === currentIndex || isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      const outTl = gsap.timeline({
        onComplete: () => {
          setCurrentIndex(targetIdx);
          if (quoteContainerRef.current && authorRef.current) {
            gsap.fromTo(
              quoteContainerRef.current,
              { opacity: 0, y: 14 },
              { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
            gsap.fromTo(
              authorRef.current,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', onComplete: () => {
                isTransitioningRef.current = false;
              }}
            );
          } else {
            isTransitioningRef.current = false;
          }
        },
      });

      if (quoteContainerRef.current) {
        outTl.to(quoteContainerRef.current, {
          opacity: 0,
          y: -12,
          duration: 0.22,
          ease: 'power2.in',
        });
      }
    },
    [currentIndex]
  );

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartYRef.current);

    if (Math.abs(deltaX) > 40 && deltaY < 60) {
      if (deltaX < 0) {
        goTo((currentIndex + 1) % TESTIMONIALS.length);
      } else {
        goTo((currentIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
      }
    }
  };

  // Auto-advance
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      goTo((currentIndex + 1) % TESTIMONIALS.length);
    }, 8500);
    return () => clearInterval(timer);
  }, [currentIndex, isHovered, goTo]);

  const current = TESTIMONIALS[currentIndex];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative w-full py-16 sm:py-24 lg:py-28 bg-[#F6F8FC] text-[#0A0D14] overflow-hidden select-none border-t border-slate-200/80 border-b border-slate-200/80"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Entrance Blend */}
      <div
        className="absolute inset-x-0 top-0 h-12 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(5,7,11,0.12) 0%, transparent 100%)',
        }}
      />

      {/* Bottom Exit Blend */}
      <div
        className="absolute inset-x-0 bottom-0 h-12 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(5,7,11,0.12) 100%)',
        }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 23, 42, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Editorial Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-10 lg:px-12">
        {/* Studio Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_6px_#008CFF]" />
            <span className="font-mono text-[10px] xs:text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#008CFF] font-semibold">
              04 // CLIENT RESONANCE
            </span>
          </div>

          <h2 className="font-sans font-black uppercase tracking-[-0.035em] text-2xl xs:text-3xl sm:text-4xl md:text-5xl leading-[0.94] text-[#0A0D14]">
            TRUSTED BY <span className="text-[#008CFF]">VISIONARIES.</span>
          </h2>
        </div>

        {/* Testimonial Block */}
        <div className="min-h-[140px] sm:min-h-[160px] flex flex-col justify-center">
          <div ref={quoteContainerRef} className="relative">
            <p className="font-sans font-normal text-base xs:text-lg sm:text-xl md:text-2xl leading-[1.5] text-[#0F172A] tracking-[-0.01em]">
              “{current.quote}”
            </p>
          </div>

          {/* Client Author Info */}
          <div ref={authorRef} className="mt-5 sm:mt-7">
            <div className="font-sans font-bold text-sm xs:text-base text-[#0A0D14]">
              {current.author}
            </div>
            <div className="font-mono text-[11px] xs:text-xs text-slate-500 tracking-[0.2em] uppercase mt-0.5">
              {current.role},{' '}
              <span className="text-[#008CFF] font-semibold">{current.client}</span>
            </div>
          </div>
        </div>

        {/* Minimal Number Navigation (01 - 05) */}
        <div className="mt-8 sm:mt-12 flex items-center gap-5 sm:gap-7">
          {TESTIMONIALS.map((_, idx) => {
            const numStr = String(idx + 1).padStart(2, '0');
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                aria-label={`Go to testimonial ${numStr}`}
                className={`relative py-1 font-mono text-xs sm:text-sm tracking-[0.22em] transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'text-[#008CFF] font-bold'
                    : 'text-slate-400 hover:text-slate-700 font-normal'
                }`}
              >
                <span>{numStr}</span>
                {isActive && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-[#008CFF] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection3D;
