import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SpaceMeshCanvas } from './SpaceMeshCanvas';

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
    id: 'brand-creative',
    number: '01',
    titleLines: ['BRAND', '&', 'CREATIVE'],
    category: 'CREATIVE STRATEGY',
    description: 'Concept development, campaign thinking, visual direction, storytelling and creative strategy.',
    imageUrl: '/reels/posters/wearebrandshoots_1786454245_3961387117295433628_77785749886.jpg',
    aspectRatio: 'portrait',
    tag: 'DIRECTION & IDENTITY',
  },
  {
    id: 'video-production',
    number: '02',
    titleLines: ['VIDEO', 'PRODUCTION'],
    category: 'CINEMATIC PRODUCTION',
    description: 'Commercials, brand films, product films, corporate films, campaign productions and cinematic content.',
    imageUrl: '/reels/posters/santhi.pipes_rjy_1783494112_3936556116926232206_48644092133.jpg',
    aspectRatio: 'cinematic',
    tag: 'CINEMATOGRAPHY',
  },
  {
    id: 'short-form',
    number: '03',
    titleLines: ['SHORT-FORM', 'CONTENT'],
    category: 'VERTICAL STORYTELLING',
    description: 'Reels, social-first videos, vertical storytelling, hooks and high-retention content.',
    imageUrl: '/reels/posters/wearebrandshoots_1777444216_3885805244420742638_77785749886.jpg',
    aspectRatio: 'portrait',
    tag: 'HIGH-RETENTION HOOKS',
  },
  {
    id: 'editing-post',
    number: '04',
    titleLines: ['EDITING', '& POST'],
    category: 'FINISHING & MOTION',
    description: 'Editing, colour, sound, motion graphics, finishing and post-production.',
    imageUrl: '/reels/posters/wearebrandshoots_1789108387_3983651808436403394_77785749886.jpg',
    aspectRatio: 'portrait',
    tag: 'PRECISION FINISHING',
  },
  {
    id: 'social-content',
    number: '05',
    titleLines: ['SOCIAL', 'CONTENT'],
    category: 'GROWTH SYSTEMS',
    description: 'Consistent visual storytelling designed for social platforms, campaigns and audience growth.',
    imageUrl: '/reels/posters/wearebrandshoots_1786854627_3964745654666992928_77785749886.jpg',
    aspectRatio: 'portrait',
    tag: 'GROWTH SYSTEMS',
  },
  {
    id: 'digital-growth',
    number: '06',
    titleLines: ['DIGITAL', 'GROWTH'],
    category: 'BRAND SCALE',
    description: 'Content systems, creative strategy, digital campaigns and long-term visual brand growth.',
    imageUrl: '/reels/posters/viswatuff.glass_rjy_1791174653_4000984496274606409_78432309239.jpg',
    aspectRatio: 'cinematic',
    tag: 'BRAND SCALE',
  },
];

export const WhatWeDoSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Blend overlay layers
  const topBlendRef = useRef<HTMLDivElement>(null);
  const bottomBlendRef = useRef<HTMLDivElement>(null);

  // Scene 0: Opening Headline
  const introLayerRef = useRef<HTMLDivElement>(null);
  const introLine1Ref = useRef<HTMLSpanElement>(null);
  const introLine2Ref = useRef<HTMLSpanElement>(null);
  const introLine3Ref = useRef<HTMLSpanElement>(null);
  const introSubcopyRef = useRef<HTMLParagraphElement>(null);

  // Scenes 1..6: The Six Capabilities
  const missionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const typoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const accentLineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scene 7: Final Manifesto Closer
  const finalLayerRef = useRef<HTMLDivElement>(null);
  const finalHeadingRef = useRef<HTMLHeadingElement>(null);

  // Active GSAP state
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Desktop Pointer Spatial Micro-Interactions
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    if (activeChapterIndex >= 1 && activeChapterIndex <= 6) {
      const activeImage = imageRefs.current[activeChapterIndex - 1];
      const activeTypo = typoRefs.current[activeChapterIndex - 1];

      if (activeImage) {
        gsap.to(activeImage, {
          x: nx * 14,
          y: ny * 10,
          rotateY: nx * 4,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }

      if (activeTypo) {
        gsap.to(activeTypo, {
          x: nx * 6,
          y: ny * 4,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    }
  };

  const handlePointerLeave = () => {
    if (activeChapterIndex >= 1 && activeChapterIndex <= 6) {
      const activeImage = imageRefs.current[activeChapterIndex - 1];
      const activeTypo = typoRefs.current[activeChapterIndex - 1];
      if (activeImage) {
        gsap.to(activeImage, { x: 0, y: 0, rotateY: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
      }
      if (activeTypo) {
        gsap.to(activeTypo, { x: 0, y: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
      }
    }
  };

  // GSAP SCROLLTRIGGER PINNING (DESKTOP ONLY via matchMedia)
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // DESKTOP: Full 3D Pinning & Scrubbing
      mm.add('(min-width: 1024px)', () => {
        if (!sectionRef.current || !stageRef.current) return;

        const masterTl = gsap.timeline({ defaults: { ease: 'none' } });

        if (introLayerRef.current) {
          gsap.set(introLayerRef.current, { autoAlpha: 1, y: 0, scale: 1 });
        }

        missionRefs.current.forEach((mission) => {
          if (!mission) return;
          gsap.set(mission, { autoAlpha: 0, pointerEvents: 'none', y: 0, scale: 1 });
        });

        if (finalLayerRef.current) {
          gsap.set(finalLayerRef.current, { autoAlpha: 0, y: 40, scale: 0.97 });
        }

        if (topBlendRef.current) {
          gsap.set(topBlendRef.current, { opacity: 0.5 });
          masterTl.fromTo(
            topBlendRef.current,
            { opacity: 0.5 },
            { opacity: 0, duration: 0.40, ease: 'power2.out' },
            0.05
          );
        }

        if (bottomBlendRef.current) {
          gsap.set(bottomBlendRef.current, { opacity: 0 });
          masterTl.fromTo(
            bottomBlendRef.current,
            { opacity: 0 },
            { opacity: 0.60, duration: 0.90, ease: 'power2.in' },
            13.60
          );
        }

        // Scene 0: Opening
        if (introLayerRef.current) {
          if (introLine1Ref.current) {
            masterTl.to(introLine1Ref.current, { y: isReduced ? 0 : -45, opacity: 0.2, duration: 0.60 }, 0.70);
          }
          if (introLine2Ref.current) {
            masterTl.to(introLine2Ref.current, { letterSpacing: '0.04em', scale: isReduced ? 1 : 1.05, duration: 0.60 }, 0.70);
          }
          if (introLine3Ref.current) {
            masterTl.to(introLine3Ref.current, { scale: isReduced ? 1 : 1.14, y: isReduced ? 0 : 25, duration: 0.60 }, 0.70);
          }
          if (introSubcopyRef.current) {
            masterTl.to(introSubcopyRef.current, { opacity: 0, y: isReduced ? 0 : -20, duration: 0.50 }, 0.70);
          }

          masterTl.to(
            introLayerRef.current,
            { autoAlpha: 0, y: isReduced ? 0 : -40, scale: isReduced ? 1 : 0.95, duration: 0.60, ease: 'power2.inOut' },
            0.70
          );
          masterTl.set(introLayerRef.current, { autoAlpha: 0, pointerEvents: 'none' }, 1.30);
        }

        // Scenes 1..6
        MISSIONS.forEach((_, idx) => {
          const m = missionRefs.current[idx];
          const t = typoRefs.current[idx];
          const img = imageRefs.current[idx];
          const l = accentLineRefs.current[idx];
          const startTime = 1.20 + idx * 1.65;

          if (m) {
            masterTl.fromTo(
              m,
              { autoAlpha: 0, y: isReduced ? 0 : 45, scale: isReduced ? 1 : 0.96 },
              { autoAlpha: 1, y: 0, scale: 1, duration: 0.50, ease: 'power2.out' },
              startTime
            );

            if (img) {
              masterTl.fromTo(img, { scale: 1.08 }, { scale: 1.0, duration: 0.70, ease: 'none' }, startTime);
            }

            masterTl.to(t, { x: isReduced ? 0 : (idx % 2 === 0 ? -75 : 75), autoAlpha: 0, duration: 0.50, ease: 'power2.inOut' }, startTime + 1.25);
            masterTl.to(img, { x: isReduced ? 0 : (idx % 2 === 0 ? -45 : -50), scale: 0.95, autoAlpha: 0, duration: 0.50, ease: 'power2.inOut' }, startTime + 1.25);

            if (l) {
              masterTl.fromTo(
                l,
                { scaleX: 0, opacity: 0 },
                { scaleX: 1, opacity: 1, duration: 0.45, ease: 'power2.inOut' },
                startTime + 1.20
              );
            }

            masterTl.set(m, { autoAlpha: 0, pointerEvents: 'none' }, startTime + 1.75);
          }
        });

        // Scene 7: Final Manifesto
        if (finalLayerRef.current) {
          masterTl.fromTo(
            finalLayerRef.current,
            { autoAlpha: 0, y: isReduced ? 0 : 45, scale: isReduced ? 1 : 0.97 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'power2.out' },
            11.35
          );

          if (finalHeadingRef.current) {
            masterTl.fromTo(
              finalHeadingRef.current,
              { letterSpacing: '0.04em', scale: 0.97 },
              { letterSpacing: '-0.04em', scale: 1, duration: 0.65, ease: 'power2.out' },
              11.45
            );
          }

          masterTl.to(finalLayerRef.current, { duration: 2.60 }, 11.90);
        }

        ScrollTrigger.create({
          id: 'what-we-do-trigger',
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=4200',
          pin: true,
          anticipatePin: 1,
          scrub: 1,
          animation: masterTl,
          onUpdate: (self) => {
            const p = self.progress;
            setScrollProgress(p);

            let chapter = 0;
            if (p < 0.086) chapter = 0;
            else if (p < 0.200) chapter = 1;
            else if (p < 0.314) chapter = 2;
            else if (p < 0.428) chapter = 3;
            else if (p < 0.541) chapter = 4;
            else if (p < 0.655) chapter = 5;
            else if (p < 0.772) chapter = 6;
            else chapter = 7;

            setActiveChapterIndex(chapter);
          },
        });
      });

      // MOBILE: Native natural fluid scroll with ScrollTrigger reveals
      mm.add('(max-width: 1023px)', () => {
        const mobileCards = document.querySelectorAll('.mobile-mission-card');
        mobileCards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
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
    activeChapterIndex >= 1 && activeChapterIndex <= 6 ? MISSIONS[activeChapterIndex - 1] : null;

  return (
    <section
      id="what-we-do"
      ref={sectionRef}
      className="relative w-full bg-[#F6F8FC] text-[#0A0D14] overflow-hidden select-none"
      style={{ isolation: 'isolate' }}
    >
      {/* ========================================================= */}
      {/* 1. SEAMLESS ENTRANCE & EXIT BLEND OVERLAYS                */}
      {/* ========================================================= */}
      <div
        ref={topBlendRef}
        className="absolute inset-x-0 top-0 h-12 sm:h-16 pointer-events-none z-30"
        style={{
          background: 'linear-gradient(to bottom, rgba(5,7,11,0.2) 0%, rgba(5,7,11,0.05) 60%, transparent 100%)',
        }}
      />
      <div
        ref={bottomBlendRef}
        className="absolute inset-x-0 bottom-0 h-14 sm:h-20 pointer-events-none z-30"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(5,7,11,0.15) 50%, rgba(5,7,11,0.6) 100%)',
        }}
      />

      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0A0D14 1px, transparent 1px),
            linear-gradient(to bottom, #0A0D14 1px, transparent 1px)
          `,
          backgroundSize: '3.5rem 3.5rem',
        }}
      />

      {/* ========================================================= */}
      {/* 2. DEDICATED MOBILE COMPOSITION (Visible on < 1024px)     */}
      {/* Layout per directive:                                     */}
      {/* SECTION LABEL -> STRONG HEADING -> SHORT DESCRIPTION      */}
      {/* -> LARGE MEDIA (80-90% width) -> CATEGORY / CTA           */}
      {/* ========================================================= */}
      <div className="block lg:hidden relative z-10 w-full px-5 py-16 sm:py-20 max-w-xl mx-auto">
        {/* Mobile Section Intro Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] xs:text-[11px] tracking-[0.26em] uppercase text-[#008CFF] font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
            <span>01 // WHAT WE DO</span>
          </div>
          <h2 className="font-sans font-black uppercase text-3xl xs:text-4xl leading-[0.92] text-[#0A0D14] tracking-[-0.03em]">
            WE CREATE STORIES THAT <span className="text-[#008CFF]">MOVE PEOPLE.</span>
          </h2>
          <p className="mt-3.5 font-sans text-xs xs:text-sm text-slate-600 font-medium tracking-wide max-w-sm mx-auto leading-relaxed">
            STRATEGY. PRODUCTION. EDITING. CONTENT BUILT TO MOVE PEOPLE.
          </p>
        </div>

        {/* The 6 Capabilities: High-impact mobile sequence */}
        <div className="flex flex-col gap-10">
          {MISSIONS.map((mission) => (
            <div
              key={`mobile-${mission.id}`}
              className="mobile-mission-card flex flex-col bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
            >
              {/* 1. SECTION LABEL */}
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold tracking-[0.24em] text-[#008CFF]">
                  {mission.number}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#008CFF]" />
                <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-slate-500 font-semibold">
                  {mission.category}
                </span>
              </div>

              {/* 2. STRONG HEADING */}
              <h3 className="font-sans font-black uppercase text-2xl xs:text-3xl leading-[0.95] tracking-[-0.03em] text-[#0A0D14]">
                {mission.titleLines.join(' ')}
              </h3>

              {/* 3. SHORT DESCRIPTION */}
              <p className="mt-2 text-xs xs:text-sm text-slate-600 leading-[1.55] font-normal">
                {mission.description}
              </p>

              {/* 4. LARGE MEDIA (80–90% of viewport width, immersive) */}
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-slate-200/80 my-3.5 shadow-sm">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#008CFF] to-transparent z-10" />
                <img
                  src={mission.imageUrl}
                  alt={`${mission.number} - ${mission.category}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white font-mono text-[8px] tracking-wider uppercase">
                  <span className="w-1 h-1 rounded-full bg-[#008CFF]" />
                  <span>BRANDSHOOTS STILL</span>
                </div>
                <div className="absolute top-2.5 right-2.5 z-10 font-mono text-[8px] tracking-widest text-white/90 bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded uppercase">
                  CH {mission.number}
                </div>
              </div>

              {/* 5. CATEGORY / CTA */}
              <div className="self-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#008CFF]/10 text-[#008CFF] border border-[#008CFF]/20 font-mono text-[10px] tracking-[0.2em] uppercase font-semibold">
                  <span className="w-1 h-1 rounded-full bg-[#008CFF]" />
                  <span>{mission.tag}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Closing Statement */}
        <div className="text-center mt-14 pt-10 border-t border-slate-200/60">
          <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-[#008CFF] font-semibold mb-2">
            THE BRANDSHOOTS STANDARD
          </div>
          <h3 className="font-sans font-black uppercase text-2xl xs:text-3xl leading-[0.95] text-[#0A0D14]">
            WE DON'T JUST MAKE CONTENT.<br />
            <span className="text-[#008CFF]">WE MAKE IT MOVE.</span>
          </h3>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. DESKTOP 3D PINNED STAGE (Visible on >= 1024px)          */}
      {/* ========================================================= */}
      <div className="hidden lg:block relative w-full">
        <SpaceMeshCanvas theme="light" scrollProgress={scrollProgress} className="opacity-95 z-0" />
        <div
          ref={stageRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="relative w-full h-[100dvh] max-h-[100dvh] overflow-hidden flex items-center justify-center z-20"
          style={{ perspective: '1200px' }}
        >
          <div className="relative w-full h-full max-w-[1600px] mx-auto flex items-center justify-center">
            {/* Scene 0: Desktop Intro */}
            <div
              ref={introLayerRef}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-30"
            >
              <div className="inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.28em] uppercase text-[#008CFF] font-semibold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
                <span>01 // WHAT WE DO</span>
              </div>
              <h2 className="font-sans font-black uppercase text-center tracking-[-0.04em] text-[#0A0D14]">
                <span ref={introLine1Ref} className="block text-[88px] xl:text-[104px] leading-[0.9] text-slate-800">
                  WE CREATE
                </span>
                <span ref={introLine2Ref} className="block text-[108px] xl:text-[128px] leading-[0.88] text-[#0A0D14] font-black">
                  STORIES THAT
                </span>
                <span ref={introLine3Ref} className="block text-[108px] xl:text-[128px] leading-[0.88] text-[#0A0D14]">
                  MOVE PEOPLE<span className="text-[#1497F5]">.</span>
                </span>
              </h2>
              <p ref={introSubcopyRef} className="mt-10 max-w-2xl font-mono text-base tracking-[0.16em] uppercase text-slate-700 font-semibold px-4">
                STRATEGY. PRODUCTION. EDITING. CONTENT BUILT TO MOVE PEOPLE.
              </p>
            </div>

            {/* Scenes 1..6: Desktop Chapters */}
            {MISSIONS.map((mission, idx) => {
              const isEven = idx % 2 === 1;
              const isCurrentActive = activeChapterIndex === idx + 1;

              return (
                <div
                  key={mission.id}
                  ref={(el) => (missionRefs.current[idx] = el)}
                  className={`absolute inset-0 flex flex-col justify-center items-center w-full h-full transition-opacity duration-300 ${
                    isCurrentActive ? 'pointer-events-auto' : 'pointer-events-none'
                  }`}
                >
                  <div
                    ref={(el) => (accentLineRefs.current[idx] = el)}
                    className="absolute inset-x-16 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#1497F5]/50 to-transparent pointer-events-none z-0 opacity-0"
                  />

                  <div className="w-full h-full max-w-7xl mx-auto px-12 flex flex-row items-center justify-between gap-16 z-10">
                    <div
                      ref={(el) => (typoRefs.current[idx] = el)}
                      className={`w-[50%] flex flex-col justify-center text-left ${
                        isEven ? 'order-2 pl-16' : 'order-1 pr-16'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono text-base font-bold tracking-[0.28em] text-[#008CFF]">
                          {mission.number}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
                        <span className="font-mono text-xs tracking-[0.28em] uppercase text-slate-500 font-semibold">
                          {mission.category}
                        </span>
                      </div>

                      <h3 className="font-sans font-black uppercase text-7xl xl:text-8xl leading-[0.9] tracking-[-0.035em] text-[#0A0D14]">
                        {mission.titleLines.map((line, lIdx) => (
                          <span key={lIdx} className="block">
                            {line}
                          </span>
                        ))}
                      </h3>

                      <p className="mt-5 max-w-lg font-sans text-[17px] leading-[1.65] text-slate-600 font-normal">
                        {mission.description}
                      </p>

                      <div className="mt-5 inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#008CFF]/10 text-[#008CFF] border border-[#008CFF]/25 font-mono text-xs tracking-[0.22em] uppercase font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
                        <span>{mission.tag}</span>
                      </div>
                    </div>

                    <div
                      ref={(el) => (imageRefs.current[idx] = el)}
                      className={`w-[48%] flex items-center justify-center ${
                        isEven ? 'order-1' : 'order-2'
                      }`}
                    >
                      <div
                        className={`relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.18)] bg-white ${
                          mission.aspectRatio === 'portrait'
                            ? 'w-84 aspect-[9/15] max-h-[64dvh]'
                            : 'w-full max-w-lg aspect-video max-h-[50dvh]'
                        }`}
                      >
                        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#1497F5] to-transparent pointer-events-none z-20" />
                        <img
                          src={mission.imageUrl}
                          alt={`${mission.number} - ${mission.category}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1497F5]" />
                          <span className="font-mono text-[9px] tracking-widest uppercase font-semibold">
                            BRANDSHOOTS STILL
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 z-20 font-mono text-[8px] tracking-[0.2em] text-white/90 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 uppercase">
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
                <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
                <span>THE BRANDSHOOTS STANDARD</span>
              </div>
              <h2
                ref={finalHeadingRef}
                className="font-sans font-black uppercase text-center tracking-[-0.04em] text-[#0A0D14]"
              >
                <span className="block text-[76px] xl:text-[90px] leading-[0.92] text-slate-800">
                  WE DON'T JUST
                </span>
                <span className="block text-[76px] xl:text-[90px] leading-[0.92] text-slate-800">
                  MAKE CONTENT.
                </span>
                <span className="block mt-6 text-[96px] xl:text-[116px] leading-[0.9] text-[#0A0D14] font-black">
                  WE MAKE IT MOVE<span className="text-[#1497F5]">.</span>
                </span>
              </h2>
            </div>
          </div>

          {/* Desktop Floating Pill */}
          <div className="absolute bottom-8 left-8 z-40 flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_10px_30px_rgba(15,23,42,0.08)] text-[#0A0D14] font-mono text-[11px] pointer-events-none">
            <span className="font-bold tracking-[0.2em] text-[#1497F5]">
              {activeChapterIndex >= 1 && activeChapterIndex <= 6
                ? `0${activeChapterIndex} / 06`
                : activeChapterIndex === 0
                ? 'CAPABILITIES'
                : 'FINAL'}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="tracking-[0.15em] uppercase text-slate-600 font-medium">
              {currentMission ? currentMission.category : 'WHAT WE DO'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
