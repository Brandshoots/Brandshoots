import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCMSContent } from '../../lib/cms/useCMSContent';

gsap.registerPlugin(ScrollTrigger);

export const TheLeadershipSection: React.FC = () => {
  const { leadership } = useCMSContent();
  const nameParts = (leadership?.founderName || 'DURGARAO VALLEPU').trim().split(/\s+/);
  const firstName = nameParts[0] || 'DURGARAO';
  const lastName = nameParts.slice(1).join(' ') || 'VALLEPU';
  const sectionRef = useRef<HTMLElement>(null);
  const backdropGlowRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  // Portrait refs
  const portraitWrapperRef = useRef<HTMLDivElement>(null);
  const portraitImgRef = useRef<HTMLImageElement>(null);

  // Typography refs
  const textContentRef = useRef<HTMLDivElement>(null);
  const nameLine1Ref = useRef<HTMLSpanElement>(null);
  const nameLine2Ref = useRef<HTMLSpanElement>(null);
  const designationRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Background watermark parallax
      if (watermarkRef.current) {
        gsap.to(watermarkRef.current, {
          x: 100,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2.0,
          },
        });
      }

      // Parallax differential: Portrait moves slightly upward while text flows naturally
      if (portraitWrapperRef.current) {
        gsap.fromTo(
          portraitWrapperRef.current,
          { y: 60, scale: 0.96 },
          {
            y: -60,
            scale: 1.02,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      }

      if (textContentRef.current) {
        gsap.fromTo(
          textContentRef.current,
          { y: 30 },
          {
            y: -30,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.0,
            },
          }
        );
      }

      // Entrance reveal timeline
      const entryTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

      if (backdropGlowRef.current) {
        entryTl.fromTo(
          backdropGlowRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
          0
        );
      }

      if (nameLine1Ref.current && nameLine2Ref.current) {
        entryTl.fromTo(
          [nameLine1Ref.current, nameLine2Ref.current],
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: 'power3.out' },
          0.15
        );
      }

      if (designationRef.current) {
        entryTl.fromTo(
          designationRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
          0.3
        );
      }

      if (quoteRef.current) {
        entryTl.fromTo(
          quoteRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
          0.4
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="leadership"
      ref={sectionRef}
      className="relative w-full min-h-[90vh] py-24 sm:py-32 lg:py-40 bg-[#04060A] text-white flex items-center justify-center select-none overflow-hidden"
    >
      {/* Background Volumetric Blue Aura */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          ref={backdropGlowRef}
          className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1200px] h-[600px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.14) 0%, rgba(0, 50, 150, 0.03) 50%, transparent 75%)',
            filter: 'blur(100px)',
          }}
        />
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Atmospheric Watermark Depth Layer */}
      <div
        ref={watermarkRef}
        className="absolute bottom-10 -left-20 w-full whitespace-nowrap pointer-events-none select-none z-0 opacity-[0.03]"
      >
        <span className="font-display font-black text-[18vw] tracking-[-0.05em] uppercase text-white">
          VALLEPU • VISION •
        </span>
      </div>

      {/* ==================================================== */}
      {/* MAIN EDITORIAL COMPOSITION (Large Dominant Portrait) */}
      {/* ==================================================== */}
      <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* LEFT: COMMANDING FOUNDER PORTRAIT */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end order-1">
            <div
              ref={portraitWrapperRef}
              className="relative w-full max-w-[320px] xs:max-w-[360px] sm:max-w-[420px] lg:max-w-[480px] xl:max-w-[520px] aspect-[4/5] will-change-transform"
            >
              {/* Electric Blue Luminous Rim Halo */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-b from-[#008CFF]/25 via-white/5 to-[#008CFF]/20 opacity-70 blur-[8px] pointer-events-none" />

              {/* Framed Editorial Canvas */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden bg-[#070B12] border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_35px_rgba(0,140,255,0.2)]">
                <img
                  ref={portraitImgRef}
                  src={leadership?.founderImage || '/founder.png'}
                  alt={`${leadership?.founderName || 'Durgarao Vallepu'} — ${leadership?.founderRole || 'Founder'}`}
                  className="w-full h-full object-cover object-[center_20%] filter brightness-[0.96] contrast-[1.06] select-none"
                  draggable={false}
                  loading="lazy"
                />

                {/* Film Noir Subtle Vignette */}
                <div
                  className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(4,6,10,0.95) 0%, rgba(4,6,10,0.4) 60%, transparent 100%)',
                  }}
                />

                {/* Editorial Camera Target Ticks */}
                <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-white/40 pointer-events-none" />
                <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-white/40 pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-white/40 pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-white/40 pointer-events-none" />

                {/* Founder Badge */}
                <div className="absolute bottom-4 left-5 right-5 z-20 flex items-center justify-between text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
                    <span className="font-mono text-[9px] tracking-[0.24em] uppercase font-semibold text-white/80">
                      {leadership?.founderRole || 'FOUNDER & DIRECTOR'}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] tracking-[0.2em] text-[#008CFF] uppercase font-bold">
                    BRANDSHOOTS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: EDITORIAL TYPOGRAPHY & MANIFESTO */}
          <div
            ref={textContentRef}
            className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left items-center lg:items-start order-2 will-change-transform"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
              <span className="font-mono text-[10px] xs:text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#008CFF] font-semibold">
                03 // LEADERSHIP & VISION
              </span>
            </div>

            {/* Monumental Founder Name */}
            <h2 className="font-sans font-black uppercase text-4xl xs:text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.88] tracking-[-0.038em] text-white">
              <span ref={nameLine1Ref} className="block text-white">
                {firstName.toUpperCase()}
              </span>
              <span ref={nameLine2Ref} className="block text-[#008CFF] mt-1 sm:mt-2">
                {lastName.toUpperCase()}<span className="text-white">.</span>
              </span>
            </h2>

            {/* Designation */}
            <div
              ref={designationRef}
              className="mt-4 sm:mt-5 font-mono text-xs sm:text-sm tracking-[0.28em] uppercase text-white/75 font-bold flex items-center gap-2.5"
            >
              <span>{leadership?.founderRole || 'FOUNDER & CREATIVE DIRECTOR'}</span>
            </div>

            {/* Accent divider line */}
            <div className="w-20 sm:w-28 h-[2px] bg-gradient-to-r from-[#008CFF] to-transparent my-6 sm:my-7" />

            {/* Short Compelling Philosophy Copy */}
            <p
              ref={quoteRef}
              className="text-base sm:text-lg lg:text-xl text-white/80 font-normal leading-[1.65] max-w-xl"
            >
              {leadership?.founderBio ||
                '"Every frame is calculated. Every cut has intent. We don’t just capture visuals — we architect cultural presence and commercial momentum for brands that refuse to be ignored."'}
            </p>

            {/* Creative Tenets */}
            <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 w-full max-w-xl">
              {[
                { title: 'CINEMATIC INTENT', desc: 'Precision lensing & mood' },
                { title: 'AUDIENCE PSYCHOLOGY', desc: 'High-retention hooks' },
                { title: 'COMMERCIAL EXECUTION', desc: 'Tangible brand growth' },
              ].map((tenet, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col items-center sm:items-start text-center sm:text-left shadow-sm"
                >
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-[#008CFF]">
                    {tenet.title}
                  </span>
                  <span className="text-[11px] text-white/50 mt-1 font-medium">
                    {tenet.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheLeadershipSection;
