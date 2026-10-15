import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface AboutFooterProps {
  onOpenContact?: () => void;
}

export const AboutFooter: React.FC<AboutFooterProps> = ({ onOpenContact: _onOpenContact }) => {
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const glowAuraRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const btnWrapperRef = useRef<HTMLDivElement>(null);
  const magneticBtnRef = useRef<HTMLButtonElement>(null);
  const btnContentRef = useRef<HTMLSpanElement>(null);

  // Heavy GSAP Animation for Ready to Collaborate
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!ctaSectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ctaSectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      // Initial Setup
      gsap.set(glowAuraRef.current, { scale: 0.6, opacity: 0 });
      gsap.set(tagRef.current, { y: 20, opacity: 0 });
      gsap.set(line1Ref.current, { y: 35, opacity: 0 });
      gsap.set(line2Ref.current, { y: 35, opacity: 0 });
      gsap.set(copyRef.current, { y: 30, opacity: 0 });
      gsap.set(btnWrapperRef.current, { scale: 0.8, y: 25, opacity: 0 });

      tl.to(
        glowAuraRef.current,
        { scale: 1.2, opacity: 0.75, duration: 1.1, ease: 'power2.out' },
        0
      )
        .to(
          tagRef.current,
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
          0.1
        )
        .to(
          line1Ref.current,
          { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
          0.2
        )
        .to(
          line2Ref.current,
          { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
          0.36
        )
        .to(
          copyRef.current,
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
          0.52
        )
        .to(
          btnWrapperRef.current,
          { scale: 1, y: 0, opacity: 1, duration: 0.75, ease: 'back.out(1.5)' },
          0.66
        );

      // Scroll Parallax on Headline
      gsap.to([line1Ref.current, line2Ref.current], {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: ctaSectionRef.current,
          start: 'top center',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, ctaSectionRef);

    return () => ctx.revert();
  }, []);

  const btnRectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    if (magneticBtnRef.current) {
      btnRectRef.current = magneticBtnRef.current.getBoundingClientRect();
    }
  };

  // Magnetic Button Hover Physics
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.innerWidth < 1024 || !magneticBtnRef.current) return;
    let rect = btnRectRef.current;
    if (!rect) {
      rect = magneticBtnRef.current.getBoundingClientRect();
      btnRectRef.current = rect;
    }
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(magneticBtnRef.current, {
      x: x * 0.35,
      y: y * 0.35,
      scale: 1.04,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    if (btnContentRef.current) {
      gsap.to(btnContentRef.current, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handleMouseLeave = () => {
    btnRectRef.current = null;
    if (!magneticBtnRef.current) return;
    gsap.to(magneticBtnRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: 'elastic.out(1.1, 0.4)',
      overwrite: 'auto',
    });

    if (btnContentRef.current) {
      gsap.to(btnContentRef.current, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1.1, 0.4)',
        overwrite: 'auto',
      });
    }
  };

  return (
    <section className="relative w-full bg-[#04060A] text-white border-t border-white/10 select-none overflow-hidden">
      {/* ======================================================== */}
      {/* 1. FINAL ABOUT CALL TO ACTION: READY TO COLLABORATE       */}
      {/* ======================================================== */}
      <div
        ref={ctaSectionRef}
        className="relative z-10 max-w-6xl mx-auto text-center py-24 sm:py-32 px-6 sm:px-12 overflow-hidden"
      >
        {/* Ambient Volumetric Blue Core */}
        <div
          ref={glowAuraRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1000px] h-[550px] pointer-events-none opacity-70"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.18) 0%, rgba(0, 100, 220, 0.06) 45%, transparent 75%)',
            filter: 'blur(100px)',
          }}
        />

        {/* Tag Pill */}
        <div
          ref={tagRef}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#008CFF]/10 border border-[#008CFF]/30 mb-7"
        >
          <span className="w-2 h-2 rounded-full bg-[#008CFF] shadow-[0_0_10px_#008CFF]" />
          <span className="font-mono text-xs tracking-[0.28em] uppercase text-[#008CFF] font-semibold">
            READY TO COLLABORATE?
          </span>
        </div>

        {/* Monolithic Heading with Masked Line Splitting */}
        <h2 className="font-sans font-black uppercase text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] xl:text-[5.5rem] leading-[0.94] tracking-[-0.035em] text-[#F7F9FF] mb-7">
          <span className="block py-1">
            <span ref={line1Ref} className="inline-block will-change-transform whitespace-normal md:whitespace-nowrap">
              LET'S CREATE SOMETHING
            </span>
          </span>
          <div className="relative inline-block mt-2 sm:mt-3">
            {/* Refined Soft Volumetric Glow Aura (Subtle, Clean Studio Backlight) */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] max-w-[600px] h-[180%] pointer-events-none rounded-full"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.16) 0%, rgba(0, 140, 255, 0.04) 50%, transparent 72%)',
                filter: 'blur(45px)',
              }}
            />
            <span
              ref={line2Ref}
              className="relative z-10 inline-block will-change-transform text-[#008CFF]"
              style={{
                textShadow:
                  '0 0 18px rgba(0, 140, 255, 0.38), 0 0 36px rgba(0, 140, 255, 0.15)',
              }}
            >
              EXTRAORDINARY<span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">.</span>
            </span>
          </div>
        </h2>

        {/* Supporting Copy */}
        <div className="overflow-hidden max-w-xl mx-auto mb-11">
          <p
            ref={copyRef}
            className="font-sans text-sm sm:text-base md:text-lg text-white/70 leading-relaxed font-normal"
          >
            Have an idea, a brand, or a visual production worth elevating? Partner with BrandShoots.
          </p>
        </div>

        {/* Magnetic Interactive CTA Button */}
        <div
          ref={btnWrapperRef}
          className="flex items-center justify-center will-change-transform"
        >
          <Link
            to="/contact"
            ref={magneticBtnRef as any}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove as any}
            onMouseLeave={handleMouseLeave}
            className="relative inline-flex items-center gap-3.5 sm:gap-4 px-10 sm:px-14 py-4 sm:py-5 rounded-full bg-[#080D17] border border-[#008CFF]/70 hover:border-[#008CFF] text-[#F7F9FF] font-mono text-xs sm:text-sm tracking-[0.28em] uppercase font-bold shadow-[0_0_24px_rgba(0,140,255,0.25)] hover:shadow-[0_0_36px_rgba(0,140,255,0.45)] transition-all duration-200 cursor-pointer active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#008CFF]/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
            <span
              ref={btnContentRef}
              className="relative z-10 flex items-center gap-3 sm:gap-4"
            >
              <Sparkles className="w-4 h-4 text-[#008CFF] animate-pulse" />
              <span>GET IN TOUCH</span>
              <ArrowUpRight className="w-4 h-4 text-[#008CFF]" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutFooter;
