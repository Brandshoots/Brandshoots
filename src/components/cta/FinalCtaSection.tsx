import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FinalCtaSectionProps {
  onOpenContact?: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onOpenContact }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const backdropAuraRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const buttonWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      if (backdropAuraRef.current) {
        tl.fromTo(
          backdropAuraRef.current,
          { scale: 0.8, opacity: 0.2 },
          { scale: 1.1, opacity: 0.8, duration: 1.0, ease: 'power2.out' },
          0
        );
      }

      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          0.1
        );
      }

      if (copyRef.current) {
        tl.fromTo(
          copyRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
          0.25
        );
      }

      if (buttonWrapperRef.current) {
        tl.fromTo(
          buttonWrapperRef.current,
          { scale: 0.9, opacity: 0, y: 14 },
          { scale: 1, opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.5)' },
          0.38
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative w-full py-16 sm:py-24 lg:py-28 bg-[#04060A] text-white flex flex-col justify-center items-center px-5 sm:px-12 select-none overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          ref={backdropAuraRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1000px] h-[450px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.18) 0%, rgba(0, 70, 180, 0.04) 50%, transparent 75%)',
            filter: 'blur(90px)',
          }}
        />
        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-[#04060A] to-transparent" />
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:5rem_5rem]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_6px_#008CFF]" />
          <span className="font-mono text-[10px] xs:text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#008CFF] font-semibold">
            05 // NEXT CHAPTER
          </span>
        </div>

        {/* Monolithic Heading */}
        <h2
          ref={headlineRef}
          className="font-sans font-black uppercase tracking-[-0.035em] text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.92] text-white"
        >
          <span className="block">LET'S GROW</span>
          <span className="block mt-1">
            YOUR BUSINESS<span className="text-[#008CFF] drop-shadow-[0_0_20px_rgba(0,140,255,0.7)]">.</span>
          </span>
        </h2>

        {/* Supporting Copy */}
        <p
          ref={copyRef}
          className="mt-4 sm:mt-5 font-sans text-xs xs:text-sm sm:text-base md:text-lg text-white/70 max-w-lg font-normal leading-relaxed px-4"
        >
          Have an idea, a brand, or a story worth telling?<br className="hidden sm:inline" />
          {' '}Let's create something that moves people.
        </p>

        {/* Primary CTA: CONTACT US Button */}
        <div
          ref={buttonWrapperRef}
          className="mt-6 sm:mt-8 flex items-center justify-center"
        >
          <div className="relative group p-1">
            <div className="absolute inset-0 rounded-full bg-[#008CFF]/25 blur-xl group-hover:bg-[#008CFF]/45 transition-all duration-300 pointer-events-none" />

            {onOpenContact ? (
              <button
                type="button"
                onClick={onOpenContact}
                className="relative inline-flex items-center gap-2.5 sm:gap-3.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#080D17] border border-[#008CFF]/80 hover:border-[#008CFF] text-[#F7F9FF] font-mono text-xs sm:text-sm tracking-[0.24em] uppercase font-bold shadow-[0_0_28px_rgba(0,140,255,0.35)] hover:shadow-[0_0_45px_rgba(0,140,255,0.6)] transition-all duration-200 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#008CFF]" />
                <span>CONTACT US</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#008CFF]" />
              </button>
            ) : (
              <Link
                to="/contact"
                className="relative inline-flex items-center gap-2.5 sm:gap-3.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#080D17] border border-[#008CFF]/80 hover:border-[#008CFF] text-[#F7F9FF] font-mono text-xs sm:text-sm tracking-[0.24em] uppercase font-bold shadow-[0_0_28px_rgba(0,140,255,0.35)] hover:shadow-[0_0_45px_rgba(0,140,255,0.6)] transition-all duration-200 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#008CFF]" />
                <span>CONTACT US</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#008CFF]" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;
