import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FinalCtaSectionProps {
  onOpenContact?: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onOpenContact: _onOpenContact }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const backdropAuraRef = useRef<HTMLDivElement>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement>(null);
  const supportingCopyRef = useRef<HTMLParagraphElement>(null);
  const buttonWrapperRef = useRef<HTMLDivElement>(null);
  const magneticBtnRef = useRef<HTMLAnchorElement>(null);
  const btnContentRef = useRef<HTMLSpanElement>(null);
  const btnGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // MASTER CTA ENTRANCE CHOREOGRAPHY
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          end: 'bottom bottom',
          toggleActions: 'play none none reverse',
        },
      });

      // Initial state
      gsap.set(headlineLine1Ref.current, { yPercent: 110, rotateX: 18, opacity: 0 });
      gsap.set(headlineLine2Ref.current, { yPercent: 110, rotateX: 18, opacity: 0 });
      gsap.set(supportingCopyRef.current, { y: 35, opacity: 0 });
      gsap.set(buttonWrapperRef.current, { scale: 0.85, opacity: 0, y: 25 });
      gsap.set(backdropAuraRef.current, { scale: 0.7, opacity: 0.2 });

      // SEQUENCE:
      // Step 1: Backdrop aura blooms softly
      tl.to(
        backdropAuraRef.current,
        { scale: 1.15, opacity: 0.8, duration: 1.2, ease: 'power2.out' },
        0
      )
        // Step 2: "LET'S GROW" reveals with cinematic overflow mask slide
        .to(
          headlineLine1Ref.current,
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
          },
          0.1
        )
        // Step 3: "YOUR BUSINESS." dramatically enters and settles
        .to(
          headlineLine2Ref.current,
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: 0.88,
            ease: 'power3.out',
          },
          0.26
        )
        // Step 4: Supporting copy follows
        .to(
          supportingCopyRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
          },
          0.48
        )
        // Step 5: CONTACT US magnetic button appears with scale spring
        .to(
          buttonWrapperRef.current,
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'back.out(1.5)',
          },
          0.62
        );

      // 3. SUBTLE SCROLL-LINKED PARALLAX (Keeps the final moment breathing on scroll)
      if (sectionRef.current) {
        gsap.to([headlineLine1Ref.current, headlineLine2Ref.current], {
          y: -25,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Desktop Magnetic Hover Interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.innerWidth < 1024 || !magneticBtnRef.current) return;
    const rect = magneticBtnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(magneticBtnRef.current, {
      x: x * 0.35,
      y: y * 0.35,
      scale: 1.04,
      duration: 0.3,
      ease: 'power2.out',
    });

    if (btnContentRef.current) {
      gsap.to(btnContentRef.current, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    if (btnGlowRef.current) {
      gsap.to(btnGlowRef.current, {
        opacity: 0.8,
        scale: 1.15,
        duration: 0.3,
      });
    }
  };

  const handleMouseLeave = () => {
    if (!magneticBtnRef.current) return;
    gsap.to(magneticBtnRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: 'elastic.out(1.1, 0.4)',
    });

    if (btnContentRef.current) {
      gsap.to(btnContentRef.current, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1.1, 0.4)',
      });
    }

    if (btnGlowRef.current) {
      gsap.to(btnGlowRef.current, {
        opacity: 0.35,
        scale: 1,
        duration: 0.5,
      });
    }
  };

  return (
    <>
      <section
        id="cta"
        ref={sectionRef}
        className="relative w-full h-[100dvh] max-h-[100dvh] bg-[#04060A] text-white flex flex-col justify-center items-center py-6 sm:py-10 lg:py-14 px-6 sm:px-12 select-none overflow-hidden snap-start snap-always"
      >
        {/* ======================================================== */}
        {/* 1. ATMOSPHERIC CINEMATIC BACKDROP & ELECTRIC PULSE        */}
        {/* ======================================================== */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Central Blue Aura Glow */}
          <div
            ref={backdropAuraRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1100px] h-[550px]"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.14) 0%, rgba(0, 70, 180, 0.04) 45%, transparent 75%)',
              filter: 'blur(95px)',
            }}
          />

          {/* Top Gradient Transition from Leadership */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#04060A] via-[#04060A]/85 to-transparent" />

          {/* Minimal Horizon Architectural Grid */}
          <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:5rem_5rem]" />
        </div>

        {/* ======================================================== */}
        {/* 2. MAIN EDITORIAL CONTENT CONTAINER                       */}
        {/* ======================================================== */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col items-center text-center my-auto">
          
          {/* Eyebrow Tag: 04 // NEXT CHAPTER */}
          <div className="flex items-center gap-2 mb-3 sm:mb-4 overflow-hidden">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_6px_#008CFF]" />
            <span className="font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#008CFF] font-semibold">
              04 // NEXT CHAPTER
            </span>
          </div>

          {/* Monolithic Heading: LET'S GROW YOUR BUSINESS. */}
          <h2 className="font-display font-black uppercase tracking-[-0.035em] text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] text-white flex flex-col items-center filter drop-shadow-[0_16px_36px_rgba(0,0,0,0.92)]">
            {/* Line 1: LET'S GROW */}
            <span className="overflow-hidden inline-block py-0.5 sm:py-1">
              <span
                ref={headlineLine1Ref}
                className="inline-block will-change-transform text-white"
              >
                LET'S GROW
              </span>
            </span>

            {/* Line 2: YOUR BUSINESS. */}
            <span className="overflow-hidden inline-block py-0.5 sm:py-1 mt-0.5 sm:mt-1">
              <span
                ref={headlineLine2Ref}
                className="inline-block will-change-transform text-white"
              >
                YOUR BUSINESS
                <span className="text-[#008CFF] drop-shadow-[0_0_24px_rgba(0,140,255,0.8)]">.</span>
              </span>
            </span>
          </h2>

          {/* Supporting Copy */}
          <div className="overflow-hidden mt-4 sm:mt-6 max-w-xl px-4">
            <p
              ref={supportingCopyRef}
              className="font-sans text-sm sm:text-base md:text-lg text-white/70 font-normal leading-[1.6]"
            >
              “Have an idea, a brand, or a story worth telling?<br className="hidden sm:inline" />
              {' '}Let’s create something that moves people.”
            </p>
          </div>

          {/* Primary CTA: CONTACT US (Magnetic Button) */}
          <div
            ref={buttonWrapperRef}
            className="mt-6 sm:mt-8 lg:mt-10 flex items-center justify-center will-change-transform"
          >
            <div className="relative group p-2">
              {/* Outer Glowing Aura */}
              <div
                ref={btnGlowRef}
                className="absolute inset-0 rounded-full bg-[#008CFF]/25 blur-xl group-hover:bg-[#008CFF]/45 transition-all duration-300 pointer-events-none"
              />

              <Link
                to="/contact"
                ref={magneticBtnRef as any}
                onMouseMove={handleMouseMove as any}
                onMouseLeave={handleMouseLeave}
                className="relative inline-flex items-center gap-2.5 sm:gap-4 px-7 sm:px-11 py-3.5 sm:py-4.5 rounded-full bg-[#080D17] border border-[#008CFF]/60 hover:border-[#008CFF] text-[#F7F9FF] font-mono text-xs sm:text-sm tracking-[0.28em] uppercase font-bold shadow-[0_0_30px_rgba(0,140,255,0.3)] hover:shadow-[0_0_50px_rgba(0,140,255,0.65)] transition-all duration-200 cursor-pointer overflow-hidden will-change-transform active:scale-95"
              >
                {/* Button Internal Radial Sheen */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#008CFF]/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />

                <span
                  ref={btnContentRef}
                  className="relative z-10 flex items-center gap-2.5 sm:gap-4 will-change-transform"
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#008CFF] animate-pulse" />
                  <span>CONTACT US</span>
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#008CFF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </span>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default FinalCtaSection;
