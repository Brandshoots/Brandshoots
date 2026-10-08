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
  const isTransitioningRef = useRef(false);

  // Parallax and scroll emergence
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax scroll on watermark
      if (watermarkRef.current) {
        gsap.to(watermarkRef.current, {
          x: -160,
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
          { opacity: 0, scale: 0.94, y: 50 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
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
      if (targetIdx === currentIndex || isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      const outTl = gsap.timeline({
        onComplete: () => {
          setCurrentIndex(targetIdx);
          if (quoteTextRef.current && authorInfoRef.current) {
            gsap.fromTo(
              quoteTextRef.current,
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
            );
            gsap.fromTo(
              authorInfoRef.current,
              { opacity: 0, y: 12 },
              {
                opacity: 1,
                y: 0,
                duration: 0.4,
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
        outTl.to(quoteTextRef.current, { opacity: 0, y: -18, duration: 0.25, ease: 'power2.in' }, 0);
      }
      if (authorInfoRef.current) {
        outTl.to(authorInfoRef.current, { opacity: 0, y: -10, duration: 0.2, ease: 'power2.in' }, 0);
      }
    },
    [currentIndex]
  );

  const prev = () => {
    const nextIdx = (currentIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
    goTo(nextIdx);
  };

  const next = () => {
    const nextIdx = (currentIndex + 1) % TESTIMONIALS.length;
    goTo(nextIdx);
  };

  const activeTestimonial = TESTIMONIALS[currentIndex];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative w-full min-h-[90vh] py-24 sm:py-32 lg:py-40 bg-[#04060A] text-white flex flex-col justify-center items-center select-none overflow-hidden"
    >
      {/* Background Volumetric Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          ref={backdropGlowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1200px] h-[550px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.12) 0%, rgba(0, 40, 120, 0.02) 50%, transparent 75%)',
            filter: 'blur(100px)',
          }}
        />
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Atmospheric Watermark Depth Layer */}
      <div
        ref={watermarkRef}
        className="absolute top-1/4 left-0 w-full whitespace-nowrap pointer-events-none select-none z-0 opacity-[0.03]"
      >
        <span className="font-display font-black text-[16vw] tracking-[-0.04em] uppercase text-white">
          CLIENT RESONANCE • MARKET IMPACT •
        </span>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-12 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
          <span className="font-mono text-[10px] xs:text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#008CFF] font-semibold">
            04 // CLIENT RESONANCE
          </span>
        </div>

        {/* Large Cinematic Quote Frame */}
        <div
          ref={quoteWrapperRef}
          className="relative w-full flex flex-col items-center bg-[#070B13]/70 backdrop-blur-2xl rounded-3xl p-8 sm:p-14 lg:p-16 border border-white/12 shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_35px_rgba(0,140,255,0.12)]"
        >
          {/* Glowing Top Edge */}
          <div className="absolute inset-x-12 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#008CFF]/60 to-transparent pointer-events-none" />

          {/* Luminous Quote Icon */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#008CFF]/15 border border-[#008CFF]/30 flex items-center justify-center text-[#008CFF] mb-6 sm:mb-8 shadow-[0_0_20px_rgba(0,140,255,0.3)]">
            <Quote className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          {/* Monumental Quote Typography */}
          <p
            ref={quoteTextRef}
            className="font-display font-medium text-2xl xs:text-3xl sm:text-4xl md:text-5xl leading-[1.24] tracking-[-0.025em] text-white/95 max-w-4xl"
          >
            "{activeTestimonial.quote}"
          </p>

          {/* Author & Client Credentials */}
          <div
            ref={authorInfoRef}
            className="mt-8 sm:mt-12 flex flex-col items-center gap-1.5"
          >
            <span className="text-base sm:text-lg font-bold text-white tracking-wide">
              {activeTestimonial.author}
            </span>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono tracking-[0.16em] uppercase text-white/60">
              <span>{activeTestimonial.role}</span>
              <span className="w-1 h-1 rounded-full bg-[#008CFF]" />
              <span className="text-[#008CFF] font-semibold">{activeTestimonial.client}</span>
            </div>
          </div>

          {/* Interactive Navigation Controls */}
          <div className="mt-10 sm:mt-12 flex items-center justify-between w-full max-w-xs pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous Testimonial"
              className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-[#008CFF] border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Pagination Indicators */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => goTo(idx)}
                  aria-label={`Go to testimonial ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 bg-[#008CFF] shadow-[0_0_10px_#008CFF]'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next Testimonial"
              className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-[#008CFF] border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Client Brand Switcher Tabs */}
        <div className="mt-8 flex flex-wrap justify-center gap-2.5 sm:gap-3">
          {TESTIMONIALS.map((t, idx) => (
            <button
              key={`tab-${t.id}`}
              type="button"
              onClick={() => goTo(idx)}
              className={`px-3.5 py-1.5 rounded-full font-mono text-[11px] tracking-[0.16em] uppercase transition-all duration-200 cursor-pointer ${
                currentIndex === idx
                  ? 'bg-[#008CFF]/20 text-[#008CFF] border border-[#008CFF]/50 font-bold'
                  : 'bg-white/[0.04] text-white/50 hover:text-white border border-white/10'
              }`}
            >
              {t.client}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection3D;
