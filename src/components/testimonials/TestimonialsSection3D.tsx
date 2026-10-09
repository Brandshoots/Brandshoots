import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

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
  const sectionRef = useRef<HTMLElement>(null);
  const quoteWrapperRef = useRef<HTMLDivElement>(null);
  const quoteTextRef = useRef<HTMLParagraphElement>(null);
  const authorInfoRef = useRef<HTMLDivElement>(null);
  const backdropGlowRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isTransitioningRef = useRef(false);
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Parallax and scroll emergence
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax scroll on watermark
      if (watermarkRef.current) {
        gsap.to(watermarkRef.current, {
          x: -120,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2.0,
          },
        });
      }

      // Quote container entrance from depth
      if (quoteWrapperRef.current) {
        gsap.fromTo(
          quoteWrapperRef.current,
          { opacity: 0, scale: 0.96, y: 35 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.75,
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

  const goTo = useCallback(
    (targetIdx: number) => {
      if (targetIdx === currentIndexRef.current || isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      const outTl = gsap.timeline({
        onComplete: () => {
          setCurrentIndex(targetIdx);
          if (quoteTextRef.current && authorInfoRef.current) {
            gsap.fromTo(
              quoteTextRef.current,
              { opacity: 0, y: 14 },
              { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
            gsap.fromTo(
              authorInfoRef.current,
              { opacity: 0, y: 10 },
              {
                opacity: 1,
                y: 0,
                duration: 0.35,
                ease: 'power2.out',
                onComplete: () => {
                  isTransitioningRef.current = false;
                },
              }
            );
          } else {
            isTransitioningRef.current = false;
          }
        },
      });

      if (quoteTextRef.current) {
        outTl.to(quoteTextRef.current, { opacity: 0, y: -14, duration: 0.22, ease: 'power2.in' }, 0);
      }
      if (authorInfoRef.current) {
        outTl.to(authorInfoRef.current, { opacity: 0, y: -8, duration: 0.18, ease: 'power2.in' }, 0);
      }
    },
    []
  );

  const prev = useCallback(() => {
    const nextIdx = (currentIndexRef.current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
    goTo(nextIdx);
  }, [goTo]);

  const next = useCallback(() => {
    const nextIdx = (currentIndexRef.current + 1) % TESTIMONIALS.length;
    goTo(nextIdx);
  }, [goTo]);

  // Continuous auto-scroll / auto-advance every 5 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      const nextIdx = (currentIndexRef.current + 1) % TESTIMONIALS.length;
      goTo(nextIdx);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, goTo]);

  const activeTestimonial = TESTIMONIALS[currentIndex];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#04060A] text-white flex flex-col justify-center items-center select-none overflow-hidden"
    >
      {/* Background Volumetric Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          ref={backdropGlowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1000px] h-[450px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.10) 0%, rgba(0, 40, 120, 0.02) 50%, transparent 75%)',
            filter: 'blur(90px)',
          }}
        />
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Atmospheric Watermark Depth Layer (Refined, proportional) */}
      <div
        ref={watermarkRef}
        className="absolute top-1/3 left-0 w-full whitespace-nowrap pointer-events-none select-none z-0 opacity-[0.025]"
      >
        <span className="font-display font-black text-[9vw] lg:text-[8vw] tracking-[-0.03em] uppercase text-white">
          CLIENT RESONANCE • MARKET IMPACT • BRAND ELEVATION •
        </span>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-6 sm:mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
          <span className="font-mono text-[10px] xs:text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#008CFF] font-semibold">
            04 // CLIENT RESONANCE
          </span>
        </div>

        {/* Refined Luxury Quote Card (Auto-scrolls, pauses on hover) */}
        <div
          ref={quoteWrapperRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="relative w-full flex flex-col items-center bg-[#070B13]/75 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-9 md:p-11 border border-white/12 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(0,140,255,0.08)]"
        >
          {/* Glowing Top Edge */}
          <div className="absolute inset-x-8 sm:inset-x-12 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#008CFF]/60 to-transparent pointer-events-none" />

          {/* Luminous Quote Badge */}
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#008CFF]/12 border border-[#008CFF]/30 flex items-center justify-center text-[#008CFF] mb-4 sm:mb-6 shadow-[0_0_15px_rgba(0,140,255,0.25)]">
            <Quote className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          {/* Editorial Quote Typography */}
          <p
            ref={quoteTextRef}
            className="font-figtree font-medium text-lg xs:text-xl sm:text-2xl md:text-[26px] lg:text-[27px] leading-[1.45] sm:leading-[1.4] tracking-[-0.015em] text-white/95 max-w-3xl"
          >
            "{activeTestimonial.quote}"
          </p>

          {/* Author & Client Credentials */}
          <div
            ref={authorInfoRef}
            className="mt-6 sm:mt-7 flex flex-col items-center gap-1"
          >
            <span className="text-sm sm:text-base font-bold text-white tracking-wide">
              {activeTestimonial.author}
            </span>
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono tracking-[0.16em] uppercase text-white/60">
              <span>{activeTestimonial.role}</span>
              <span className="w-1 h-1 rounded-full bg-[#008CFF]" />
              <span className="text-[#008CFF] font-semibold">{activeTestimonial.client}</span>
            </div>
          </div>

          {/* Interactive Navigation Controls (Clean Stepper & Arrows) */}
          <div className="mt-6 sm:mt-8 flex items-center justify-between w-full max-w-xs pt-4 sm:pt-5 border-t border-white/10">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous Testimonial"
              className="w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] rounded-full bg-white/[0.06] hover:bg-[#008CFF] border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Pagination Indicators */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {TESTIMONIALS.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => goTo(idx)}
                  aria-label={`Go to testimonial ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-5 sm:w-6 bg-[#008CFF] shadow-[0_0_8px_#008CFF]'
                      : 'w-1.5 sm:w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next Testimonial"
              className="w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] rounded-full bg-white/[0.06] hover:bg-[#008CFF] border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection3D;
