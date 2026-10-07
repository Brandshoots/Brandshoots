import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

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
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const quoteContainerRef = useRef<HTMLDivElement>(null);
  const quoteTextRef = useRef<HTMLParagraphElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const isTransitioningRef = useRef(false);
  const shouldAnimateInRef = useRef(false);
  const splitRef = useRef<any>(null);

  // Touch Swipe Gesture Tracking
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);

  // Switch to specific testimonial with GSAP choreography
  const goTo = useCallback(
    (targetIdx: number) => {
      if (targetIdx === currentIndex || isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      // 1. OLD: opacity 1 -> 0, y -20
      const outTl = gsap.timeline({
        onComplete: () => {
          if (splitRef.current) {
            try {
              splitRef.current.revert();
            } catch {
              // ignore
            }
            splitRef.current = null;
          }
          shouldAnimateInRef.current = true;
          setCurrentIndex(targetIdx);
        },
      });

      if (quoteContainerRef.current) {
        outTl.to(quoteContainerRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.28,
          ease: 'power2.in',
        });
      }

      if (authorRef.current) {
        outTl.to(
          authorRef.current,
          {
            opacity: 0,
            y: -14,
            duration: 0.22,
            ease: 'power2.in',
          },
          '-=0.14'
        );
      }
    },
    [currentIndex]
  );

  // Incoming animation: NEW: opacity 0 -> 1, y 20 -> 0
  useEffect(() => {
    if (!shouldAnimateInRef.current) return;
    shouldAnimateInRef.current = false;

    if (!quoteContainerRef.current || !quoteTextRef.current || !authorRef.current) {
      isTransitioningRef.current = false;
      return;
    }

    // Reset container positions
    gsap.set(quoteContainerRef.current, { opacity: 1, y: 0 });
    gsap.set(authorRef.current, { opacity: 0, y: 16 });

    let lines: any = quoteTextRef.current;
    try {
      splitRef.current = new SplitText(quoteTextRef.current, {
        type: 'lines',
        linesClass: 'overflow-hidden inline-block w-full',
      });
      lines = splitRef.current.lines;
    } catch {
      lines = quoteTextRef.current;
    }

    const inTl = gsap.timeline({
      onComplete: () => {
        isTransitioningRef.current = false;
      },
    });

    // NEW quote: opacity 0 -> 1, y 20 -> 0
    inTl.fromTo(
      lines,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
      }
    );

    // Client name follows slightly after
    inTl.fromTo(
      authorRef.current,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.42,
        ease: 'power2.out',
      },
      '-=0.24'
    );
  }, [currentIndex]);

  // Initial Section Entry with ScrollTrigger
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      let initialLines: any = quoteTextRef.current;
      try {
        if (quoteTextRef.current) {
          splitRef.current = new SplitText(quoteTextRef.current, {
            type: 'lines',
            linesClass: 'overflow-hidden inline-block w-full',
          });
          initialLines = splitRef.current.lines;
        }
      } catch {
        initialLines = quoteTextRef.current;
      }

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // 1. Eyebrow label reveal
      if (eyebrowRef.current) {
        masterTl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
          0
        );
      }

      // 2. Compact heading reveal
      if (headingRef.current) {
        masterTl.fromTo(
          headingRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
          0.08
        );
      }

      // 3. Quote reveal (opacity 0 -> 1, y 20 -> 0)
      masterTl.fromTo(
        initialLines,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' },
        0.18
      );

      // 4. Client author attribution
      if (authorRef.current) {
        masterTl.fromTo(
          authorRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          0.34
        );
      }

      // 5. Subtle number indicator
      if (navRef.current) {
        const buttons = navRef.current.querySelectorAll('.testimonial-nav-btn');
        masterTl.fromTo(
          buttons,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.03, ease: 'power2.out' },
          0.4
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowRight') {
        goTo((currentIndex + 1) % TESTIMONIALS.length);
      } else if (e.key === 'ArrowLeft') {
        goTo((currentIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, goTo]);

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

  // Subtle auto-advance (9s), paused on hover
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      goTo((currentIndex + 1) % TESTIMONIALS.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [currentIndex, isHovered, goTo]);

  const current = TESTIMONIALS[currentIndex];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative w-full py-20 sm:py-28 lg:py-32 bg-[#F6F8FC] text-[#0A0D14] overflow-hidden select-none border-t border-slate-200/90 border-b border-slate-200/90"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Entrance Blend: Soft feather from dark section above */}
      <div
        className="absolute inset-x-0 top-0 h-10 sm:h-14 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(5,7,11,0.08) 0%, transparent 100%)',
        }}
      />

      {/* Bottom Exit Blend: Soft feather into dark section below */}
      <div
        className="absolute inset-x-0 bottom-0 h-10 sm:h-14 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(5,7,11,0.1) 100%)',
        }}
      />

      {/* Subtle Fine Grid Texture for Crisp Architectural Light Aesthetic */}
      <div
        className="absolute inset-0 opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 23, 42, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Spacious Open Editorial Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 lg:px-14">
        {/* 1. Compact Studio Header */}
        <div className="mb-12 sm:mb-16">
          <div ref={eyebrowRef} className="flex items-center gap-2 mb-2 sm:mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_6px_#008CFF]" />
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#008CFF] font-semibold">
              CLIENT RESONANCE
            </span>
          </div>

          <h2
            ref={headingRef}
            className="font-display font-bold text-lg sm:text-xl md:text-2xl tracking-[-0.02em] uppercase text-[#0A0D14]"
          >
            TRUSTED BY <span className="text-[#008CFF]">VISIONARIES.</span>
          </h2>
        </div>

        {/* 2. Refined Testimonial Column (Strict 650–780px Desktop Width, 2-3 Lines) */}
        <div className="max-w-[740px] min-h-[180px] sm:min-h-[190px] lg:min-h-[200px] flex flex-col justify-center">
          <div ref={quoteContainerRef} className="relative">
            <p
              key={`quote-${currentIndex}`}
              ref={quoteTextRef}
              className="font-sans font-light sm:font-normal text-lg sm:text-2xl lg:text-[27px] leading-[1.42] sm:leading-[1.4] tracking-[-0.015em] text-[#0F172A]"
            >
              “{current.quote}”
            </p>
          </div>

          {/* 3. Small, Refined Client Info */}
          <div ref={authorRef} key={`author-${currentIndex}`} className="mt-7 sm:mt-9">
            <div className="font-sans font-semibold text-sm sm:text-base text-[#0A0D14] tracking-wide">
              {current.author}
            </div>
            <div className="font-mono text-[10px] sm:text-[11px] text-slate-500 tracking-[0.16em] uppercase mt-1">
              {current.role},{' '}
              <span className="text-[#008CFF] font-semibold">{current.client}</span>
            </div>
          </div>
        </div>

        {/* 4. Subtle, Minimal Number Row (01 - 05) */}
        <div ref={navRef} className="mt-12 sm:mt-16 flex items-center gap-5 sm:gap-7">
          {TESTIMONIALS.map((_, idx) => {
            const numStr = String(idx + 1).padStart(2, '0');
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                aria-label={`Go to testimonial ${numStr}`}
                className={`testimonial-nav-btn relative py-1 font-mono text-[11px] sm:text-xs tracking-[0.2em] transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'text-[#008CFF] font-semibold'
                    : 'text-slate-400 hover:text-slate-700 font-normal'
                }`}
              >
                <span>{numStr}</span>
                {isActive && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-[#008CFF]" />
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
