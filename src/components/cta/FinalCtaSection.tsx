import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, MessageCircle, Phone, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FinalCtaSectionProps {
  onOpenContact?: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onOpenContact }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const backdropAuraRef = useRef<HTMLDivElement>(null);
  const headlineWrapperRef = useRef<HTMLDivElement>(null);
  const ctaHubRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Scrubbed climax growth as user scrolls into the contact horizon
      if (backdropAuraRef.current) {
        gsap.fromTo(
          backdropAuraRef.current,
          { scale: 0.7, opacity: 0.2 },
          {
            scale: 1.25,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 1.2,
            },
          }
        );
      }

      if (headlineWrapperRef.current) {
        gsap.fromTo(
          headlineWrapperRef.current,
          { scale: 0.92, y: 50, opacity: 0.3 },
          {
            scale: 1,
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              end: 'center center',
              scrub: 1.0,
            },
          }
        );
      }

      if (ctaHubRef.current) {
        gsap.fromTo(
          ctaHubRef.current,
          { scale: 0.94, y: 40, opacity: 0.2 },
          {
            scale: 1,
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'center center',
              scrub: 1.0,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative w-full py-28 sm:py-36 lg:py-48 bg-[#04060A] text-white flex flex-col justify-center items-center px-6 sm:px-12 select-none overflow-hidden"
    >
      {/* Background Radiating Blue Climax Aura */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          ref={backdropAuraRef}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[110vw] max-w-[1500px] h-[650px] will-change-transform"
          style={{
            background:
              'radial-gradient(ellipse at 50% 80%, rgba(0, 140, 255, 0.25) 0%, rgba(0, 70, 180, 0.08) 45%, transparent 75%)',
            filter: 'blur(100px)',
          }}
        />
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Main Climax Composition */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
          <span className="font-mono text-[10px] xs:text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#008CFF] font-semibold">
            05 // THE NEXT CHAPTER
          </span>
        </div>

        {/* Monumental Climax Headline */}
        <div ref={headlineWrapperRef} className="will-change-transform">
          <h2 className="font-sans font-black uppercase text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-[-0.04em] text-white">
            <span className="block text-white">LET'S CREATE SOMETHING</span>
            <span className="block text-[#008CFF] mt-2 drop-shadow-[0_0_35px_rgba(0,140,255,0.45)]">
              UNFORGETTABLE<span className="text-white">.</span>
            </span>
          </h2>

          <p className="mt-6 sm:mt-8 font-sans text-sm xs:text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed font-normal">
            From high-stakes commercial productions to viral social systems and category-defining brand identities — let's tell your story with uncompromising visual authority.
          </p>
        </div>

        {/* Interactive Action Hub */}
        <div
          ref={ctaHubRef}
          className="mt-12 sm:mt-16 w-full max-w-3xl flex flex-col items-center will-change-transform"
        >
          {/* Primary High-Impact Button */}
          <div className="relative inline-block group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#008CFF] via-[#52B2FF] to-[#008CFF] opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-300" />
            <button
              type="button"
              onClick={onOpenContact}
              className="relative px-9 py-4 sm:px-12 sm:py-5 rounded-full bg-white text-[#04060A] font-mono font-black text-xs xs:text-sm tracking-[0.24em] uppercase shadow-[0_12px_40px_rgba(0,140,255,0.4)] group-hover:bg-[#008CFF] group-hover:text-white transition-all duration-300 flex items-center gap-3 cursor-pointer active:scale-95"
            >
              <span>START YOUR PROJECT</span>
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Quick Communication Channels */}
          <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 w-full">
            <a
              href="https://wa.me/919177656444"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-2xl bg-[#070B13]/80 backdrop-blur-xl border border-white/12 hover:border-[#008CFF]/60 flex items-center justify-center gap-3 transition-all duration-200 group shadow-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-[#008CFF]" />
              <div className="flex flex-col text-left">
                <span className="font-mono text-[9px] tracking-wider uppercase text-white/50">WhatsApp</span>
                <span className="text-xs font-semibold text-white group-hover:text-[#008CFF] transition-colors">Direct Studio Chat</span>
              </div>
            </a>

            <a
              href="tel:+919177656444"
              className="px-5 py-3.5 rounded-2xl bg-[#070B13]/80 backdrop-blur-xl border border-white/12 hover:border-[#008CFF]/60 flex items-center justify-center gap-3 transition-all duration-200 group shadow-sm active:scale-95"
            >
              <Phone className="w-4 h-4 text-[#008CFF]" />
              <div className="flex flex-col text-left">
                <span className="font-mono text-[9px] tracking-wider uppercase text-white/50">Hotline</span>
                <span className="text-xs font-semibold text-white group-hover:text-[#008CFF] transition-colors">+91 91776 56444</span>
              </div>
            </a>

            <div className="px-5 py-3.5 rounded-2xl bg-[#070B13]/80 backdrop-blur-xl border border-white/12 flex items-center justify-center gap-3 shadow-sm">
              <MapPin className="w-4 h-4 text-[#008CFF]" />
              <div className="flex flex-col text-left">
                <span className="font-mono text-[9px] tracking-wider uppercase text-white/50">Locations</span>
                <span className="text-xs font-semibold text-white">Rajahmundry & Hyd</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;
