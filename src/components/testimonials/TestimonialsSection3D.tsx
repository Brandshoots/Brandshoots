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

      // 1. Current quote: opacity 1 -> 0, y 0 -> -30
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
          y: -30,
          duration: 0.32,
          ease: 'power2.in',
        });
      }

      if (authorRef.current) {
        outTl.to(
          authorRef.current,
          {
            opacity: 0,
            y: -20,
            duration: 0.25,
            ease: 'power2.in',
          },
          '-=0.18'
        );
      }
    },
    [currentIndex]
  );

  // Incoming animation triggered when currentIndex updates
  useEffect(() => {
    if (!shouldAnimateInRef.current) return;
    shouldAnimateInRef.current = false;

    if (!quoteContainerRef.current || !quoteTextRef.current || !authorRef.current) {
      isTransitioningRef.current = false;
      return;
    }

    // Reset container positions
    gsap.set(quoteContainerRef.current, { opacity: 1, y: 0 });
    gsap.set(authorRef.current, { opacity: 0, y: 24 });

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

    // New quote: opacity 0 -> 1, y 30 -> 0
    inTl.fromTo(
      lines,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.58,
        stagger: 0.06,
        ease: 'power3.out',
      }
    );

    // Client name follows slightly after
    inTl.fromTo(
      authorRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.48,
        ease: 'power3.out',
      },
      '-=0.28'
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
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' },
          0
        );
      }

      // 2. Main title reveal
      if (headingRef.current) {
        masterTl.fromTo(
          headingRef.current,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
          0.1
        );
      }

      // 3. Large quote SplitText reveal
      masterTl.fromTo(
        initialLines,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out' },
        0.22
      );

      // 4. Client author attribution
      if (authorRef.current) {
        masterTl.fromTo(
          authorRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' },
          0.42
        );
      }

      // 5. Minimal 01-05 number indicator
      if (navRef.current) {
        const buttons = navRef.current.querySelectorAll('.testimonial-nav-btn');
        masterTl.fromTo(
          buttons,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'power3.out' },
          0.48
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

  // Subtle auto-advance (8.5s), paused on hover
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
      className="relative w-full min-h-[85vh] lg:min-h-[90vh] py-24 sm:py-32 lg:py-40 bg-[#08090C] text-white overflow-hidden select-none border-t border-white/[0.08]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fine Atmospheric Grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-between min-h-[65vh]">
        {/* Top: Minimal Eyebrow + Bold Studio Heading */}
        <div>
          <div ref={eyebrowRef} className="flex items-center gap-2 mb-4 sm:mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[#008CFF] font-semibold">
              CLIENT RESONANCE
            </span>
          </div>

          <h2
            ref={headingRef}
            className="font-display font-black text-3xl xs:text-4xl sm:text-5xl lg:text-6xl tracking-[-0.035em] uppercase text-white leading-[0.95]"
          >
            TRUSTED BY <span className="text-[#008CFF]">VISIONARIES.</span>
          </h2>
        </div>

        {/* Testimonial Focus: Pure Typography in Expansive Negative Space */}
        <div className="my-14 sm:my-20 lg:my-24 max-w-5xl min-h-[260px] sm:min-h-[290px] lg:min-h-[310px] flex flex-col justify-center">
          <div ref={quoteContainerRef} className="relative">
            <p
              key={`quote-${currentIndex}`}
              ref={quoteTextRef}
              className="font-display font-bold text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[50px] leading-[1.18] sm:leading-[1.15] tracking-[-0.02em] uppercase text-white/95"
            >
              “{current.quote}”
            </p>
          </div>

          {/* Client Attribution: Quiet, Human, Clean */}
          <div ref={authorRef} key={`author-${currentIndex}`} className="mt-8 sm:mt-12 lg:mt-14">
            <div className="font-sans font-semibold text-lg sm:text-xl lg:text-2xl text-white tracking-wide">
              {current.author}
            </div>
            <div className="font-mono text-xs sm:text-sm text-white/50 tracking-[0.16em] uppercase mt-1 sm:mt-1.5">
              {current.role},{' '}
              <span className="text-[#008CFF] font-medium">{current.client}</span>
            </div>
          </div>
        </div>

        {/* Minimal Number Strip: 01 02 03 04 05 */}
        <div
          ref={navRef}
          className="pt-8 sm:pt-10 border-t border-white/[0.08] flex items-center justify-between"
        >
          <div className="flex items-center gap-6 sm:gap-10">
            {TESTIMONIALS.map((_, idx) => {
              const numStr = String(idx + 1).padStart(2, '0');
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goTo(idx)}
                  aria-label={`Go to testimonial ${numStr}`}
                  className={`testimonial-nav-btn relative py-2 font-mono text-xs sm:text-sm tracking-[0.22em] transition-colors duration-300 cursor-pointer ${
                    isActive
                      ? 'text-[#008CFF] font-bold'
                      : 'text-white/30 hover:text-white/70 font-normal'
                  }`}
                >
                  <span>{numStr}</span>
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#008CFF] transition-all duration-300 ${
                      isActive
                        ? 'opacity-100 scale-x-100 shadow-[0_0_8px_#008CFF]'
                        : 'opacity-0 scale-x-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection3D;
