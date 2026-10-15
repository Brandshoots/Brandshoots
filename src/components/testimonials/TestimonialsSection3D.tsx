import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { useCMSContent } from '../../lib/cms/useCMSContent';

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
      'The energy, pacing, and visual command they brought to our commercial films was electric. They gave our retail presence a nationwide luxury aura that drove unprecedented organic engagement.',
    author: 'Rajesh Jain',
    role: 'Founder & CEO',
  },
  {
    id: 'viswatuff',
    client: 'Viswatuff Glass',
    quote:
      'BrandShoots completely elevated how our industrial architectural products are perceived in the market. The film didn’t just showcase glass — it felt like an international luxury architectural showcase.',
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
      'A masterclass in industrial visual storytelling. They managed to make heavy infrastructure manufacturing look dynamic, futuristic, and commanding. Our corporate identity leveled up overnight.',
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
  const { testimonials: cmsTestimonials } = useCMSContent();
  const activeTestimonials =
    cmsTestimonials && cmsTestimonials.length > 0 ? cmsTestimonials : TESTIMONIALS;

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropGlowRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Swipe / Drag handling
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  // Viewport visibility tracking: pause auto-rotation when section is off-screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Parallax and scroll emergence
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const total = activeTestimonials.length;

  const goTo = useCallback(
    (targetIdx: number) => {
      if (total === 0) return;
      const normalized = (targetIdx + total) % total;
      setCurrentIndex(normalized);
    },
    [total]
  );

  const prev = useCallback(() => {
    goTo(currentIndex - 1);
  }, [goTo, currentIndex]);

  const next = useCallback(() => {
    goTo(currentIndex + 1);
  }, [goTo, currentIndex]);

  // Continuous auto-scroll / auto-advance every 5.5 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused || !isInView || total <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIdx) => (prevIdx + 1) % total);
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, isInView, total]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (touchStartX.current === null) return;
    if (touchDeltaX.current > 45) {
      prev();
    } else if (touchDeltaX.current < -45) {
      next();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isInView) return;
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInView, prev, next]);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#04060A] text-white flex flex-col justify-center items-center select-none overflow-hidden"
    >
      {/* Background Volumetric Glow — Soft, clean ambient depth */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          ref={backdropGlowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[900px] h-[400px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.09) 0%, rgba(0, 40, 120, 0.015) 50%, transparent 75%)',
            filter: 'blur(90px)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Section Header: Eyebrow + Crisp Headline */}
        <div className="flex flex-col items-center gap-2 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#008CFF]/10 border border-[#008CFF]/30 text-[#008CFF] font-mono text-[10px] xs:text-[11px] uppercase tracking-[0.28em] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF] animate-pulse" />
            <span>TESTIMONIALS</span>
          </div>
          <h2 className="font-sans font-black text-2xl xs:text-3xl sm:text-4xl uppercase tracking-[-0.03em] text-white">
            WHAT LEADERS SAY<span className="text-[#008CFF]">.</span>
          </h2>
        </div>

        {/* Outer Card Carousel Viewport (Smooth Horizontal Sliding Track) */}
        <div
          ref={containerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-[#070B13]/85 backdrop-blur-2xl border border-white/12 shadow-[0_20px_70px_rgba(0,0,0,0.85),0_0_35px_rgba(0,140,255,0.08)]"
        >
          {/* Glowing Top Edge Accent */}
          <div className="absolute inset-x-8 sm:inset-x-14 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#008CFF]/60 to-transparent pointer-events-none z-20" />

          {/* Sliding Track */}
          <div
            className="flex w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {activeTestimonials.map((t, idx) => (
              <div
                key={t.id || `testimonial-${idx}`}
                className="w-full shrink-0 flex flex-col items-center p-6 xs:p-8 sm:p-10 md:p-12 text-center"
              >
                {/* Card Header: 5 Stars & Elegant Quote Icon */}
                <div className="flex items-center justify-between w-full max-w-lg mb-6 pb-4 border-b border-white/8">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        className="w-3.5 h-3.5 fill-[#008CFF] text-[#008CFF]"
                      />
                    ))}
                  </div>

                  <div className="w-8 h-8 rounded-full bg-[#008CFF]/10 border border-[#008CFF]/30 flex items-center justify-center text-[#008CFF]">
                    <Quote className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Editorial Quote Typography (Comfortable, high-contrast, beautiful reading scale) */}
                <p className="font-sans font-medium text-base xs:text-lg sm:text-xl md:text-2xl leading-[1.5] sm:leading-[1.45] tracking-[-0.012em] text-white/95 max-w-2xl min-h-[110px] sm:min-h-[120px] flex items-center justify-center">
                  "{t.quote}"
                </p>

                {/* Author & Client Credentials */}
                <div className="mt-6 sm:mt-8 flex flex-col items-center gap-1.5">
                  <span className="text-base sm:text-lg font-bold text-white tracking-wide font-sans">
                    {t.author}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-mono tracking-[0.16em] uppercase text-white/60">
                    <span>{t.role}</span>
                    <span className="w-1 h-1 rounded-full bg-[#008CFF]" />
                    <span className="text-[#008CFF] font-semibold">{t.client}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Navigation Controls: Prev / Indicators / Next */}
          <div className="px-6 py-4 sm:py-5 border-t border-white/10 bg-black/30 flex items-center justify-between">
            {/* Prev Button */}
            <button
              type="button"
              onClick={prev}
              aria-label="Previous Testimonial"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.06] hover:bg-[#008CFF] border border-white/15 flex items-center justify-center text-white transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>

            {/* Stepper Indicators */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {activeTestimonials.map((t, idx) => (
                <button
                  key={`indicator-${t.id || idx}`}
                  type="button"
                  onClick={() => goTo(idx)}
                  aria-label={`Go to testimonial ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 sm:w-7 bg-[#008CFF] shadow-[0_0_8px_#008CFF]'
                      : 'w-1.5 sm:w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={next}
              aria-label="Next Testimonial"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.06] hover:bg-[#008CFF] border border-white/15 flex items-center justify-center text-white transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection3D;
