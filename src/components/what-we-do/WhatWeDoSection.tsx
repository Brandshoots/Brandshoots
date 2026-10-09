import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCMSContent } from '../../lib/cms/useCMSContent';

gsap.registerPlugin(ScrollTrigger);

interface MissionData {
  id: string;
  number: string;
  titleLines: string[];
  category: string;
  description: string;
  imageUrl: string;
  aspectRatio: 'portrait' | 'cinematic';
  tag: string;
}

const MISSIONS: MissionData[] = [
  {
    id: 'video-production',
    number: '01',
    titleLines: ['VIDEO', 'PRODUCTION'],
    category: 'CINEMATIC PRODUCTION',
    description: 'Commercials, brand films, product films, corporate films, and high-stakes campaign productions crafted with high-end cinematic lenses.',
    imageUrl: '/reels/posters/santhi.pipes_rjy_1783494112_3936556116926232206_48644092133.jpg',
    aspectRatio: 'cinematic',
    tag: 'CINEMATOGRAPHY & DIRECTION',
  },
  {
    id: 'brand-creative',
    number: '02',
    titleLines: ['BRAND &', 'CREATIVE'],
    category: 'CREATIVE STRATEGY',
    description: 'Concept development, campaign thinking, visual direction, world-building and narrative strategy designed to position brands at the apex.',
    imageUrl: '/reels/posters/wearebrandshoots_1786454245_3961387117295433628_77785749886.jpg',
    aspectRatio: 'portrait',
    tag: 'DIRECTION & IDENTITY',
  },
  {
    id: 'short-form',
    number: '03',
    titleLines: ['SHORT-FORM', 'CONTENT'],
    category: 'VERTICAL STORYTELLING',
    description: 'Reels, social-first films, vertical storytelling, high-retention hooks and viral retention systems that captivate algorithmic feeds.',
    imageUrl: '/reels/posters/wearebrandshoots_1777444216_3885805244420742638_77785749886.jpg',
    aspectRatio: 'portrait',
    tag: 'HIGH-RETENTION HOOKS',
  },
  {
    id: 'editing-post',
    number: '04',
    titleLines: ['EDITING', '& POST'],
    category: 'FINISHING & MOTION',
    description: 'Precision editing, luxury Hollywood color grading, immersive spatial sound design, and bespoke motion graphics finishing.',
    imageUrl: '/reels/posters/wearebrandshoots_1789108387_3983651808436403394_77785749886.jpg',
    aspectRatio: 'portrait',
    tag: 'PRECISION FINISHING',
  },
  {
    id: 'social-content',
    number: '05',
    titleLines: ['SOCIAL', 'CONTENT'],
    category: 'GROWTH SYSTEMS',
    description: 'Consistent visual storytelling architectures designed for rapid audience scaling, brand authority, and sustained engagement.',
    imageUrl: '/reels/posters/wearebrandshoots_1786854627_3964745654666992928_77785749886.jpg',
    aspectRatio: 'portrait',
    tag: 'GROWTH ARCHITECTURE',
  },
  {
    id: 'digital-growth',
    number: '06',
    titleLines: ['DIGITAL', 'GROWTH'],
    category: 'BRAND SCALE',
    description: 'Full-funnel digital creative systems, visual campaigns and long-term brand momentum engineered to convert viewers into advocates.',
    imageUrl: '/reels/posters/viswatuff.glass_rjy_1791174653_4000984496274606409_78432309239.jpg',
    aspectRatio: 'cinematic',
    tag: 'CATEGORY LEADERSHIP',
  },
];

export const WhatWeDoSection: React.FC = () => {
  const { services } = useCMSContent();
  const activeMissions: MissionData[] =
    services && services.length >= 6
      ? services.slice(0, 6).map((s) => ({
          id: s.id,
          number: s.number,
          titleLines: s.titleLines,
          category: s.category,
          description: s.description,
          imageUrl: s.imageUrl,
          aspectRatio: s.aspectRatio,
          tag: s.tag,
        }))
      : MISSIONS;

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Scene 0: Opening Headline
  const introLayerRef = useRef<HTMLDivElement>(null);
  const introLine1Ref = useRef<HTMLSpanElement>(null);
  const introLine2Ref = useRef<HTMLSpanElement>(null);
  const introLine3Ref = useRef<HTMLSpanElement>(null);
  const introSubcopyRef = useRef<HTMLParagraphElement>(null);

  // Scenes 1..6: The Six Capabilities
  const missionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const typoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mediaContainerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scene 7: Closer
  const finalLayerRef = useRef<HTMLDivElement>(null);
  const finalHeadingRef = useRef<HTMLHeadingElement>(null);

  // Active state
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  // Subtle pointer spatial parallax on desktop
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    if (activeChapterIndex >= 1 && activeChapterIndex <= 6) {
      const activeMedia = mediaContainerRefs.current[activeChapterIndex - 1];
      const activeTypo = typoRefs.current[activeChapterIndex - 1];

      if (activeMedia) {
        gsap.to(activeMedia, {
          x: nx * 18,
          y: ny * 14,
          rotateY: nx * 5,
          rotateX: -ny * 4,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }

      if (activeTypo) {
        gsap.to(activeTypo, {
          x: nx * 8,
          y: ny * 6,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    }
  };

  const handlePointerLeave = () => {
    if (activeChapterIndex >= 1 && activeChapterIndex <= 6) {
      const activeMedia = mediaContainerRefs.current[activeChapterIndex - 1];
      const activeTypo = typoRefs.current[activeChapterIndex - 1];
      if (activeMedia) {
        gsap.to(activeMedia, { x: 0, y: 0, rotateY: 0, rotateX: 0, duration: 1.0, ease: 'power3.out', overwrite: 'auto' });
      }
      if (activeTypo) {
        gsap.to(activeTypo, { x: 0, y: 0, duration: 1.0, ease: 'power3.out', overwrite: 'auto' });
      }
    }
  };

  // GSAP SCROLL ENGINES (Desktop Pinning with Camera Progression + Mobile Smooth Reveal)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // DESKTOP: Continuous Camera & Depth Pinning
      mm.add('(min-width: 1024px)', () => {
        if (!sectionRef.current || !stageRef.current) return;

        const masterTl = gsap.timeline({ defaults: { ease: 'none' } });

        // Initial setup
        if (introLayerRef.current) {
          gsap.set(introLayerRef.current, { autoAlpha: 1, y: 0, scale: 1 });
        }

        missionRefs.current.forEach((mission) => {
          if (!mission) return;
          gsap.set(mission, { autoAlpha: 0, pointerEvents: 'none', y: 0, scale: 1 });
        });

        if (finalLayerRef.current) {
          gsap.set(finalLayerRef.current, { autoAlpha: 0, y: 50, scale: 0.95 });
        }

        // Scene 0: Intro transition (Camera glides into depth)
        if (introLayerRef.current) {
          masterTl.to(
            [introLine1Ref.current, introLine2Ref.current, introLine3Ref.current],
            { y: -60, opacity: 0, scale: 0.92, duration: 0.65, stagger: 0.08, ease: 'power2.inOut' },
            0.6
          );
          if (introSubcopyRef.current) {
            masterTl.to(introSubcopyRef.current, { opacity: 0, y: -30, duration: 0.45 }, 0.6);
          }
          masterTl.to(introLayerRef.current, { autoAlpha: 0, duration: 0.4 }, 0.95);
          masterTl.set(introLayerRef.current, { autoAlpha: 0, pointerEvents: 'none' }, 1.0);
        }

        // Scenes 1..6: Immersive Media Presentations
        activeMissions.forEach((_, idx) => {
          const m = missionRefs.current[idx];
          const t = typoRefs.current[idx];
          const media = mediaContainerRefs.current[idx];
          const startTime = 1.0 + idx * 1.8;

          if (m) {
            // Enter from depth with 3D scale and camera emergence
            masterTl.fromTo(
              m,
              { autoAlpha: 0, scale: 0.92, z: -100 },
              { autoAlpha: 1, scale: 1, z: 0, duration: 0.55, ease: 'power2.out' },
              startTime
            );

            if (media) {
              masterTl.fromTo(
                media,
                { scale: 1.12, opacity: 0.7, rotateX: 6 },
                { scale: 1.0, opacity: 1, rotateX: 0, duration: 0.7, ease: 'power2.out' },
                startTime
              );
            }

            if (t) {
              masterTl.fromTo(
                t,
                { y: 35, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
                startTime + 0.1
              );
            }

            // Exit toward camera / depth before next chapter
            masterTl.to(
              t,
              { y: -45, opacity: 0, duration: 0.45, ease: 'power2.in' },
              startTime + 1.35
            );
            masterTl.to(
              media,
              { scale: 1.06, opacity: 0, y: -40, duration: 0.5, ease: 'power2.in' },
              startTime + 1.35
            );
            masterTl.set(m, { autoAlpha: 0, pointerEvents: 'none' }, startTime + 1.8);
          }
        });

        // Scene 7: Final Manifesto
        if (finalLayerRef.current) {
          masterTl.fromTo(
            finalLayerRef.current,
            { autoAlpha: 0, y: 60, scale: 0.94 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.65, ease: 'power3.out' },
            11.8
          );
          masterTl.to(finalLayerRef.current, { duration: 2.2 }, 12.45);
        }

        ScrollTrigger.create({
          id: 'what-we-do-scrolltrigger',
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=4400',
          pin: true,
          anticipatePin: 1,
          scrub: 1.1,
          animation: masterTl,
          onUpdate: (self) => {
            const p = self.progress;
            let chapter = 0;
            if (p < 0.08) chapter = 0;
            else if (p < 0.22) chapter = 1;
            else if (p < 0.36) chapter = 2;
            else if (p < 0.50) chapter = 3;
            else if (p < 0.64) chapter = 4;
            else if (p < 0.78) chapter = 5;
            else if (p < 0.90) chapter = 6;
            else chapter = 7;
            setActiveChapterIndex(chapter);
          },
        });
      });

      // MOBILE: Natural continuous scroll with viewport-proportional media
      mm.add('(max-width: 1023px)', () => {
        const cards = document.querySelectorAll('.mobile-mission-card');
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const currentMission =
    activeChapterIndex >= 1 && activeChapterIndex <= 6 ? activeMissions[activeChapterIndex - 1] : null;

  return (
    <section
      id="what-we-do"
      ref={sectionRef}
      className="relative w-full bg-[#04060A] text-white overflow-hidden select-none"
    >
      {/* Background Volumetric Blue Atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1400px] h-[700px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.12) 0%, rgba(0, 60, 160, 0.03) 50%, transparent 75%)',
            filter: 'blur(100px)',
          }}
        />
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* ========================================================= */}
      {/* 1. DEDICATED MOBILE COMPOSITION (Clean, Large Media)       */}
      {/* ========================================================= */}
      <div className="block lg:hidden relative z-10 w-full px-5 py-16 sm:py-24 max-w-xl mx-auto">
        {/* Mobile Section Intro */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] xs:text-[11px] tracking-[0.28em] uppercase text-[#008CFF] font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
            <span>01 // VIDEO PRODUCTION</span>
          </div>
          <h2 className="font-sans font-black uppercase text-3xl xs:text-4xl leading-[0.92] text-white tracking-[-0.03em]">
            WE CRAFT FILMS THAT <span className="text-[#008CFF]">DEFINE BRANDS.</span>
          </h2>
          <p className="mt-3.5 font-sans text-xs xs:text-sm text-white/60 font-medium tracking-wide max-w-sm mx-auto leading-relaxed">
            COMMERCIALS. BRAND FILMS. REELS. NARRATIVE MOMENTUM.
          </p>
        </div>

        {/* The 6 Capabilities: Dominant mobile media cards */}
        <div className="flex flex-col gap-10">
          {activeMissions.map((mission) => (
            <div
              key={`mobile-${mission.id}`}
              className="mobile-mission-card flex flex-col bg-[#070B12]/85 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.85)]"
            >
              {/* Eyebrow Label */}
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold tracking-[0.24em] text-[#008CFF]">
                  {mission.number}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#008CFF]" />
                <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-white/50 font-semibold">
                  {mission.category}
                </span>
              </div>

              {/* Dominant Heading */}
              <h3 className="font-sans font-black uppercase text-2xl xs:text-3xl leading-[0.95] tracking-[-0.03em] text-white">
                {mission.titleLines.join(' ')}
              </h3>

              {/* Description */}
              <p className="mt-2 text-xs xs:text-sm text-white/70 leading-[1.55] font-normal">
                {mission.description}
              </p>

              {/* Large Immersive Media Canvas */}
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-black/60 border border-white/15 my-4 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#008CFF] to-transparent z-10" />
                <img
                  src={mission.imageUrl}
                  alt={`${mission.number} - ${mission.category}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/75 backdrop-blur-md text-white font-mono text-[8px] tracking-wider uppercase border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] animate-pulse" />
                  <span>BRANDSHOOTS CINEMATIC</span>
                </div>
                <div className="absolute top-2.5 right-2.5 z-10 font-mono text-[8px] tracking-widest text-white/90 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 uppercase">
                  CH {mission.number}
                </div>
              </div>

              {/* Category Pill */}
              <div className="self-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#008CFF]/15 text-[#008CFF] border border-[#008CFF]/30 font-mono text-[10px] tracking-[0.2em] uppercase font-semibold">
                  <span className="w-1 h-1 rounded-full bg-[#008CFF]" />
                  <span>{mission.tag}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Closer */}
        <div className="text-center mt-16 pt-10 border-t border-white/10">
          <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#008CFF] font-semibold mb-2">
            THE BRANDSHOOTS STANDARD
          </div>
          <h3 className="font-sans font-black uppercase text-2xl xs:text-3xl leading-[0.95] text-white">
            WE DON'T JUST MAKE CONTENT.<br />
            <span className="text-[#008CFF]">WE MAKE IT COMMAND.</span>
          </h3>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. DESKTOP 3D PINNED STAGE (Large Immersive Media Journey) */}
      {/* ========================================================= */}
      <div className="hidden lg:block relative w-full">
        <div
          ref={stageRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="relative w-full h-[100dvh] max-h-[100dvh] overflow-hidden flex items-center justify-center z-20"
          style={{ perspective: '1400px' }}
        >
          <div className="relative w-full h-full max-w-[1680px] mx-auto flex items-center justify-center px-10">
            {/* Scene 0: Desktop Intro */}
            <div
              ref={introLayerRef}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-30"
            >
              <div className="inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.32em] uppercase text-[#008CFF] font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-[#008CFF] shadow-[0_0_10px_#008CFF]" />
                <span>01 // VIDEO PRODUCTION & CAPABILITIES</span>
              </div>
              <h2 className="font-sans font-black uppercase text-center tracking-[-0.04em] text-white">
                <span ref={introLine1Ref} className="block text-[86px] xl:text-[106px] leading-[0.9] text-white/90">
                  WE CRAFT
                </span>
                <span ref={introLine2Ref} className="block text-[106px] xl:text-[130px] leading-[0.88] text-white font-black">
                  FILMS THAT
                </span>
                <span ref={introLine3Ref} className="block text-[106px] xl:text-[130px] leading-[0.88] text-[#008CFF]">
                  DEFINE BRANDS<span className="text-white">.</span>
                </span>
              </h2>
              <p ref={introSubcopyRef} className="mt-8 max-w-2xl font-mono text-base tracking-[0.2em] uppercase text-white/60 font-semibold px-4">
                STRATEGY. PRODUCTION. EDITING. HOLLYWOOD FINISHING.
              </p>
            </div>

            {/* Scenes 1..6: Desktop Immersive Chapters */}
            {activeMissions.map((mission, idx) => {
              const isEven = idx % 2 === 1;
              const isCurrentActive = activeChapterIndex === idx + 1;

              return (
                <div
                  key={mission.id}
                  ref={(el) => (missionRefs.current[idx] = el)}
                  className={`absolute inset-0 flex flex-col justify-center items-center w-full h-full transition-opacity duration-300 ${
                    isCurrentActive ? 'pointer-events-auto' : 'pointer-events-none'
                  }`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="w-full h-full max-w-7xl mx-auto px-8 flex flex-row items-center justify-between gap-12 xl:gap-16 z-10">
                    {/* Typography Column */}
                    <div
                      ref={(el) => (typoRefs.current[idx] = el)}
                      className={`w-[46%] flex flex-col justify-center text-left ${
                        isEven ? 'order-2 pl-8' : 'order-1 pr-8'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="font-mono text-lg font-bold tracking-[0.28em] text-[#008CFF]">
                          {mission.number}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
                        <span className="font-mono text-xs tracking-[0.3em] uppercase text-white/50 font-semibold">
                          {mission.category}
                        </span>
                      </div>

                      <h3 className="font-sans font-black uppercase text-6xl xl:text-7xl leading-[0.92] tracking-[-0.035em] text-white">
                        {mission.titleLines.map((line, lIdx) => (
                          <span key={lIdx} className="block">
                            {line}
                          </span>
                        ))}
                      </h3>

                      <p className="mt-6 max-w-lg font-sans text-base lg:text-lg leading-[1.65] text-white/70 font-normal">
                        {mission.description}
                      </p>

                      <div className="mt-6 inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-[#008CFF]/15 text-[#008CFF] border border-[#008CFF]/30 font-mono text-xs tracking-[0.22em] uppercase font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
                        <span>{mission.tag}</span>
                      </div>
                    </div>

                    {/* Dominant Immersive Media Canvas */}
                    <div
                      ref={(el) => (mediaContainerRefs.current[idx] = el)}
                      className={`w-[54%] flex items-center justify-center ${
                        isEven ? 'order-1' : 'order-2'
                      }`}
                    >
                      <div
                        className={`relative rounded-2xl overflow-hidden border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_40px_rgba(0,140,255,0.2)] bg-black/80 transition-transform ${
                          mission.aspectRatio === 'portrait'
                            ? 'w-[360px] xl:w-[410px] aspect-[9/15] max-h-[72dvh]'
                            : 'w-full max-w-2xl aspect-[16/10] max-h-[60dvh]'
                        }`}
                      >
                        {/* Glowing Specular Top Line */}
                        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#008CFF] to-transparent pointer-events-none z-20" />
                        
                        <img
                          src={mission.imageUrl}
                          alt={`${mission.number} - ${mission.category}`}
                          className="w-full h-full object-cover filter brightness-[0.96] contrast-[1.05]"
                        />

                        {/* Subtle Cinematic Vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                        {/* Media Badges */}
                        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-md bg-black/75 backdrop-blur-md text-white border border-white/15">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] animate-pulse" />
                          <span className="font-mono text-[9px] tracking-widest uppercase font-semibold">
                            BRANDSHOOTS CINEMATIC
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 z-20 font-mono text-[9px] tracking-[0.2em] text-white/90 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-white/15 uppercase">
                          CHAPTER {mission.number}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Scene 7: Desktop Final */}
            <div
              ref={finalLayerRef}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-30 pointer-events-none"
            >
              <div className="inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.28em] uppercase text-[#008CFF] font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-[#008CFF] shadow-[0_0_10px_#008CFF]" />
                <span>THE BRANDSHOOTS CREED</span>
              </div>
              <h2
                ref={finalHeadingRef}
                className="font-sans font-black uppercase text-center tracking-[-0.04em] text-white"
              >
                <span className="block text-[72px] xl:text-[88px] leading-[0.92] text-white/80">
                  WE DON'T JUST
                </span>
                <span className="block text-[72px] xl:text-[88px] leading-[0.92] text-white/80">
                  MAKE CONTENT.
                </span>
                <span className="block mt-6 text-[94px] xl:text-[116px] leading-[0.9] text-white font-black">
                  WE MAKE IT COMMAND<span className="text-[#008CFF]">.</span>
                </span>
              </h2>
            </div>
          </div>

          {/* Desktop Floating Navigation Progress Pill */}
          <div className="absolute bottom-8 left-10 z-40 flex items-center gap-3 px-4 py-2 rounded-full bg-[#070B12]/85 backdrop-blur-xl border border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.8)] text-white font-mono text-[11px] pointer-events-none">
            <span className="font-bold tracking-[0.2em] text-[#008CFF]">
              {activeChapterIndex >= 1 && activeChapterIndex <= 6
                ? `0${activeChapterIndex} / 06`
                : activeChapterIndex === 0
                ? 'OVERVIEW'
                : 'COMMAND'}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="tracking-[0.16em] uppercase text-white/70 font-medium">
              {currentMission ? currentMission.category : 'VIDEO PRODUCTION'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
