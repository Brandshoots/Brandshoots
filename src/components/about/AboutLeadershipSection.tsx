import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const AboutLeadershipSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitMaskRef = useRef<HTMLDivElement>(null);
  const portraitImgRef = useRef<HTMLImageElement>(null);
  const nameLine1Ref = useRef<HTMLSpanElement>(null);
  const nameLine2Ref = useRef<HTMLSpanElement>(null);
  const designationRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.set(portraitMaskRef.current, {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      });
      gsap.set(portraitImgRef.current, { scale: 1.15 });
      gsap.set([nameLine1Ref.current, nameLine2Ref.current], { yPercent: 110, opacity: 0 });
      gsap.set(designationRef.current, { y: 20, opacity: 0 });
      gsap.set(statementRef.current, { y: 25, opacity: 0 });

      tl.to(
        portraitMaskRef.current,
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 0.85,
          ease: 'power3.inOut',
        },
        0
      )
        .to(
          portraitImgRef.current,
          { scale: 1.0, duration: 0.95, ease: 'power2.out' },
          0
        )
        .to(
          [nameLine1Ref.current, nameLine2Ref.current],
          { yPercent: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: 'power3.out' },
          0.3
        )
        .to(
          designationRef.current,
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
          0.5
        )
        .to(
          statementRef.current,
          { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
          0.6
        );

      // Subtle Scroll Parallax on Portrait
      gsap.to(portraitImgRef.current, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024 || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(cardRef.current, {
      rotateY: x * 10,
      rotateX: -y * 10,
      scale: 1.02,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleCardMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      scale: 1.0,
      duration: 0.6,
      ease: 'power2.out',
    });
  };

  return (
    <section
      id="leadership"
      ref={sectionRef}
      className="relative w-full min-h-[92vh] sm:min-h-screen bg-[#04060A] text-white flex items-center justify-center py-24 sm:py-32 px-6 sm:px-12 lg:px-16 select-none overflow-hidden"
    >
      {/* Background Aura */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[950px] h-[550px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(19, 158, 242, 0.12) 0%, rgba(11, 16, 78, 0.25) 50%, transparent 75%)',
            filter: 'blur(90px)',
          }}
        />
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:5rem_5rem]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Col: High-Impact Portrait */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end order-1">
            <div
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] aspect-[4/5] will-change-transform transition-shadow duration-300 cursor-pointer"
            >
              {/* Outer Glow Rim */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-b from-white/15 via-[#008CFF]/20 to-transparent opacity-40 blur-[2px] pointer-events-none" />

              <div
                ref={portraitMaskRef}
                className="relative w-full h-full rounded-3xl overflow-hidden bg-[#0A0D14] border border-white/12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)]"
              >
                <img
                  ref={portraitImgRef}
                  src="/founder.png"
                  alt="Durgarao Vallepu — Founder, BRANDSHOOTS"
                  className="w-full h-full object-cover object-[center_20%] select-none will-change-transform"
                />

                {/* Bottom Depth Vignette */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(4,6,10,0.9) 0%, rgba(4,6,10,0.3) 60%, transparent 100%)',
                  }}
                />

                {/* Corner Markers */}
                <div className="absolute top-3.5 left-3.5 w-2.5 h-2.5 border-t border-l border-white/30 pointer-events-none" />
                <div className="absolute top-3.5 right-3.5 w-2.5 h-2.5 border-t border-r border-white/30 pointer-events-none" />
                <div className="absolute bottom-3.5 left-3.5 w-2.5 h-2.5 border-b border-l border-white/30 pointer-events-none" />
                <div className="absolute bottom-3.5 right-3.5 w-2.5 h-2.5 border-b border-r border-white/30 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Right Col: Editorial Typography & Statement */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left order-2 lg:pl-6">
            
            {/* Unified Eyebrow */}
            <div className="inline-flex items-center gap-2.5 font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#008CFF] font-semibold mb-3 sm:mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
              <span>03 // THE LEADERSHIP</span>
            </div>

            {/* Founder Name */}
            <h3 className="font-display font-black uppercase tracking-[-0.035em] text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.92] text-white mb-3 sm:mb-4">
              <span className="overflow-hidden block py-0.5">
                <span ref={nameLine1Ref} className="inline-block">
                  DURGARAO
                </span>
              </span>
              <span className="overflow-hidden block py-0.5">
                <span ref={nameLine2Ref} className="inline-block text-[#008CFF]">
                  VALLEPU
                </span>
              </span>
            </h3>

            {/* Title */}
            <div ref={designationRef} className="flex items-center gap-2.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
              <p className="font-mono text-xs sm:text-sm tracking-[0.22em] uppercase text-white/80 font-semibold">
                FOUNDER — <span className="text-[#008CFF]">BRANDSHOOTS</span>
              </p>
            </div>

            {/* Accent Rule */}
            <div className="w-20 sm:w-28 h-[1.5px] bg-gradient-to-r from-[#008CFF] to-transparent mb-5 sm:mb-6" />

            {/* Short Supporting Statement */}
            <p
              ref={statementRef}
              className="font-sans text-sm sm:text-base md:text-[17px] text-white/75 leading-[1.65] max-w-xl font-normal mb-6 sm:mb-8"
            >
              Leading BrandShoots with the conviction that high-production craft and digital brand growth belong together. Every frame is composed to elevate perceived brand equity and ignite audience momentum.
            </p>

            {/* Strategic Pillars Pills */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {['CREATE WITH INTENT', 'SHOOT WITH PURPOSE', 'GROW DIGITAL PRESENCE'].map((pill, pIdx) => (
                <span
                  key={pIdx}
                  className="px-3.5 py-1.5 rounded-full font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] font-semibold border border-white/10 bg-white/[0.03] text-white/80 hover:border-[#008CFF]/50 hover:text-[#008CFF] transition-all cursor-default"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutLeadershipSection;
