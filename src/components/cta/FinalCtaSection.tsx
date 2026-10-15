import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, MessageCircle, Phone, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FinalCtaSectionProps {
  onOpenContact?: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const backdropAuraRef = useRef<HTMLDivElement>(null);
  const headlineWrapperRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const ctaHubRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Magnetic button hover interaction
  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const xTo = gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      xTo(x * 0.28);
      yTo(y * 0.28);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
      xTo(0);
      yTo(0);
    };
  }, []);

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

      // Headline emergence (soft translate + fade without overflow clipping)
      if (line1Ref.current && line2Ref.current) {
        gsap.fromTo(
          [line1Ref.current, line2Ref.current],
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headlineWrapperRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      if (ctaHubRef.current) {
        gsap.fromTo(
          ctaHubRef.current,
          { scale: 0.96, y: 28, opacity: 0 },
          {
            scale: 1,
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaHubRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
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
      className="relative w-full py-24 sm:py-28 md:py-32 lg:py-36 bg-[#020306] text-white flex flex-col justify-center items-center px-6 sm:px-12 select-none overflow-hidden"
    >
      {/* Background Radiating Blue Climax Aura (Clean luxury backdrop without harsh grid lines) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          ref={backdropAuraRef}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[110vw] max-w-[1500px] h-[650px] will-change-transform"
          style={{
            background:
              'radial-gradient(ellipse at 50% 80%, rgba(0, 140, 255, 0.18) 0%, rgba(0, 70, 180, 0.05) 50%, transparent 75%)',
            filter: 'blur(100px)',
          }}
        />

        {/* Minimal Cosmic Dust Specks */}
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute top-[20%] left-[15%] w-1 h-1 rounded-full bg-[#008CFF] shadow-[0_0_6px_#008CFF]" />
          <div className="absolute top-[35%] right-[18%] w-1 h-1 rounded-full bg-white shadow-[0_0_6px_#fff]" />
          <div className="absolute bottom-[28%] left-[24%] w-1 h-1 rounded-full bg-[#008CFF]/80 shadow-[0_0_5px_#008CFF]" />
          <div className="absolute bottom-[38%] right-[22%] w-1 h-1 rounded-full bg-white/70 shadow-[0_0_4px_#fff]" />
        </div>
      </div>

      {/* Main Climax Composition */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">

        {/* Monumental Climax Headline */}
        <div ref={headlineWrapperRef} className="will-change-transform w-full flex flex-col items-center">
          <h2 className="font-sans font-black uppercase text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] xl:text-[5.5rem] leading-[0.94] tracking-[-0.035em] text-white">
            <span
              ref={line1Ref}
              className="block text-white will-change-transform whitespace-normal sm:whitespace-nowrap"
            >
              LET'S CREATE SOMETHING
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
                className="relative z-10 block text-[#008CFF] will-change-transform"
                style={{
                  textShadow:
                    '0 0 18px rgba(0, 140, 255, 0.38), 0 0 36px rgba(0, 140, 255, 0.15)',
                }}
              >
                EXTRAORDINARY<span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">.</span>
              </span>
            </div>
          </h2>
        </div>

        {/* Interactive Action Hub */}
        <div
          ref={ctaHubRef}
          className="mt-10 sm:mt-12 w-full max-w-3xl flex flex-col items-center will-change-transform"
        >
          {/* Primary High-Impact Button */}
          <div ref={buttonRef} className="relative inline-block group will-change-transform">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#008CFF] via-[#52B2FF] to-[#008CFF] opacity-30 blur-md group-hover:opacity-75 transition-opacity duration-300" />
            <Link
              to="/contact"
              className="relative px-9 py-4 sm:px-12 sm:py-5 rounded-full bg-white text-[#04060A] font-mono font-black text-xs xs:text-sm tracking-[0.24em] uppercase shadow-[0_8px_24px_rgba(0,140,255,0.2)] hover:shadow-[0_8px_32px_rgba(0,140,255,0.4)] group-hover:bg-[#008CFF] group-hover:text-white transition-all duration-300 flex items-center gap-3 cursor-pointer active:scale-95"
            >
              <span>START YOUR PROJECT</span>
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Quick Communication Channels */}
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 w-full">
            <a
              href="https://wa.me/917075960672"
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
              href="tel:+917075960672"
              className="px-5 py-3.5 rounded-2xl bg-[#070B13]/80 backdrop-blur-xl border border-white/12 hover:border-[#008CFF]/60 flex items-center justify-center gap-3 transition-all duration-200 group shadow-sm active:scale-95"
            >
              <Phone className="w-4 h-4 text-[#008CFF]" />
              <div className="flex flex-col text-left">
                <span className="font-mono text-[9px] tracking-wider uppercase text-white/50">Hotline</span>
                <span className="text-xs font-semibold text-white group-hover:text-[#008CFF] transition-colors">+91 70759 60672</span>
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
