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
    const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

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

  // MASTER GSAP TIMELINE & SCROLLTRIGGER PINNING
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!sectionRef.current || !stageRef.current) return;

      const masterTl = gsap.timeline({ defaults: { ease: 'none' } });

      // Initial State: Intro is visible; all missions & final are hidden
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
      }
      if (bottomBlendRef.current) {
        gsap.set(bottomBlendRef.current, { opacity: 0 });
      }

      // -------------------------------------------------------------
      // TOP & BOTTOM BLEND AUTOMATION (SUBTLE SOFT FEATHERING)
      // Top blend fades out quickly on entry; bottom blend only appears at unpin
      // -------------------------------------------------------------
      if (topBlendRef.current) {
        masterTl.fromTo(
          topBlendRef.current,
          { opacity: 0.5 },
          { opacity: 0, duration: 0.40, ease: 'power2.out' },
          0.05
        );
      }

      if (bottomBlendRef.current) {
        masterTl.fromTo(
          bottomBlendRef.current,
          { opacity: 0 },
          { opacity: 0.60, duration: 0.90, ease: 'power2.in' },
          13.60
        );
      }

      // -------------------------------------------------------------
      // SCENE 0: OPENING STATEMENT (0.00 -> 1.30)
      // "WE CREATE STORIES THAT MOVE PEOPLE."
      // -------------------------------------------------------------
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

      // -------------------------------------------------------------
      // SCENE 1: 01 — BRAND & CREATIVE (1.20 -> 2.95)
      // -------------------------------------------------------------
      const m1 = missionRefs.current[0];
      const t1 = typoRefs.current[0];
      const img1 = imageRefs.current[0];
      const l1 = accentLineRefs.current[0];

      if (m1) {
        masterTl.fromTo(
          m1,
          { autoAlpha: 0, y: isReduced ? 0 : 45, scale: isReduced ? 1 : 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.50, ease: 'power2.out' },
          1.20
        );

        if (img1) {
          masterTl.fromTo(img1, { scale: 1.08 }, { scale: 1.0, duration: 0.70, ease: 'none' }, 1.20);
        }

        masterTl.to(t1, { x: isReduced ? 0 : -75, autoAlpha: 0, duration: 0.50, ease: 'power2.inOut' }, 2.45);
        masterTl.to(img1, { x: isReduced ? 0 : -45, scale: 0.95, autoAlpha: 0, duration: 0.50, ease: 'power2.inOut' }, 2.45);

        if (l1) {
          masterTl.fromTo(
            l1,
            { scaleX: 0, transformOrigin: 'left center', opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.45, ease: 'power2.inOut' },
            2.40
          );
        }

        masterTl.set(m1, { autoAlpha: 0, pointerEvents: 'none' }, 2.95);
      }

      // -------------------------------------------------------------
      // SCENE 2: 02 — VIDEO PRODUCTION (2.85 -> 4.60)
      // -------------------------------------------------------------
      const m2 = missionRefs.current[1];
      const t2 = typoRefs.current[1];
      const img2 = imageRefs.current[1];
      const l2 = accentLineRefs.current[1];

      if (m2) {
        masterTl.fromTo(
          m2,
          { autoAlpha: 0, x: isReduced ? 0 : 65, scale: isReduced ? 1 : 0.96 },
          { autoAlpha: 1, x: 0, scale: 1, duration: 0.50, ease: 'power2.out' },
          2.85
        );

        if (img2) {
          masterTl.fromTo(img2, { scale: 1.08 }, { scale: 1.0, duration: 0.70, ease: 'none' }, 2.85);
        }

        masterTl.to(t2, { x: isReduced ? 0 : 75, autoAlpha: 0, duration: 0.50, ease: 'power2.inOut' }, 4.10);
        masterTl.to(img2, { x: isReduced ? 0 : -50, scale: 0.95, autoAlpha: 0, duration: 0.50, ease: 'power2.inOut' }, 4.10);

        if (l2) {
          masterTl.fromTo(
            l2,
            { scaleX: 0, transformOrigin: 'right center', opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.45, ease: 'power2.inOut' },
            4.05
          );
        }

        masterTl.set(m2, { autoAlpha: 0, pointerEvents: 'none' }, 4.60);
      }

      // -------------------------------------------------------------
      // SCENE 3: 03 — SHORT-FORM CONTENT (4.50 -> 6.25)
      // -------------------------------------------------------------
      const m3 = missionRefs.current[2];
      const t3 = typoRefs.current[2];
      const img3 = imageRefs.current[2];
      const l3 = accentLineRefs.current[2];

      if (m3) {
        masterTl.fromTo(
          m3,
          { autoAlpha: 0, x: isReduced ? 0 : -65, scale: isReduced ? 1 : 0.96 },
          { autoAlpha: 1, x: 0, scale: 1, duration: 0.50, ease: 'power2.out' },
          4.50
        );

        if (img3) {
          masterTl.fromTo(img3, { scale: 1.08 }, { scale: 1.0, duration: 0.70, ease: 'none' }, 4.50);
        }

        masterTl.to(t3, { x: isReduced ? 0 : -75, autoAlpha: 0, duration: 0.50, ease: 'power2.inOut' }, 5.75);
        masterTl.to(img3, { x: isReduced ? 0 : 50, scale: 0.95, autoAlpha: 0, duration: 0.50, ease: 'power2.inOut' }, 5.75);

        if (l3) {
          masterTl.fromTo(
            l3,
            { scaleX: 0, transformOrigin: 'left center', opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.45, ease: 'power2.inOut' },
            5.70
          );
        }

        masterTl.set(m3, { autoAlpha: 0, pointerEvents: 'none' }, 6.25);
      }

      // -------------------------------------------------------------
      // SCENE 4: 04 — EDITING & POST (6.15 -> 7.90)
      // -------------------------------------------------------------
      const m4 = missionRefs.current[3];
      const t4 = typoRefs.current[3];
      const img4 = imageRefs.current[3];
      const l4 = accentLineRefs.current[3];

      if (m4) {
        masterTl.fromTo(
          m4,
          { autoAlpha: 0, x: isReduced ? 0 : 65, scale: isReduced ? 1 : 0.96 },
          { autoAlpha: 1, x: 0, scale: 1, duration: 0.50, ease: 'power2.out' },
          6.15
        );

        if (img4) {
          masterTl.fromTo(img4, { scale: 1.08 }, { scale: 1.0, duration: 0.70, ease: 'none' }, 6.15);
        }

        masterTl.to(t4, { x: isReduced ? 0 : 75, autoAlpha: 0, duration: 0.50, ease: 'power2.inOut' }, 7.40);
        masterTl.to(img4, { x: isReduced ? 0 : -50, scale: 0.95, autoAlpha: 0, duration: 0.50, ease: 'power2.inOut' }, 7.40);

        if (l4) {
          masterTl.fromTo(
            l4,
            { scaleX: 0, transformOrigin: 'right center', opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.45, ease: 'power2.inOut' },
            7.35
          );
        }

        masterTl.set(m4, { autoAlpha: 0, pointerEvents: 'none' }, 7.90);
      }

      // -------------------------------------------------------------
      // SCENE 5: 05 — SOCIAL CONTENT (7.80 -> 9.55)
      // -------------------------------------------------------------
      const m5 = missionRefs.current[4];
      const t5 = typoRefs.current[4];
      const img5 = imageRefs.current[4];
      const l5 = accentLineRefs.current[4];

      if (m5) {
        masterTl.fromTo(
          m5,
          { autoAlpha: 0, x: isReduced ? 0 : -65, scale: isReduced ? 1 : 0.96 },
          { autoAlpha: 1, x: 0, scale: 1, duration: 0.50, ease: 'power2.out' },
          7.80
        );

        if (img5) {
          masterTl.fromTo(img5, { scale: 1.08 }, { scale: 1.0, duration: 0.70, ease: 'none' }, 7.80);
        }

        masterTl.to(t5, { x: isReduced ? 0 : -75, autoAlpha: 0, duration: 0.50, ease: 'power2.inOut' }, 9.05);
        masterTl.to(img5, { x: isReduced ? 0 : 50, scale: 0.95, autoAlpha: 0, duration: 0.50, ease: 'power2.inOut' }, 9.05);

        if (l5) {
          masterTl.fromTo(
            l5,
            { scaleX: 0, transformOrigin: 'left center', opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.45, ease: 'power2.inOut' },
            9.00
          );
        }

        masterTl.set(m5, { autoAlpha: 0, pointerEvents: 'none' }, 9.55);
      }

      // -------------------------------------------------------------
      // SCENE 6: 06 — DIGITAL GROWTH (9.45 -> 11.20)
      // -------------------------------------------------------------
      const m6 = missionRefs.current[5];
      const t6 = typoRefs.current[5];
      const img6 = imageRefs.current[5];

      if (m6) {
        masterTl.fromTo(
          m6,
          { autoAlpha: 0, x: isReduced ? 0 : 65, scale: isReduced ? 1 : 0.96 },
          { autoAlpha: 1, x: 0, scale: 1, duration: 0.50, ease: 'power2.out' },
          9.45
        );

        if (img6) {
          masterTl.fromTo(img6, { scale: 1.08 }, { scale: 1.0, duration: 0.70, ease: 'none' }, 9.45);
        }

        // Clean departure before final manifesto
        masterTl.to(t6, { y: isReduced ? 0 : -45, autoAlpha: 0, duration: 0.50, ease: 'power2.inOut' }, 10.70);
        masterTl.to(img6, { y: isReduced ? 0 : -45, scale: 0.94, autoAlpha: 0, duration: 0.50, ease: 'power2.inOut' }, 10.70);

        masterTl.set(m6, { autoAlpha: 0, pointerEvents: 'none' }, 11.20);
      }

      // -------------------------------------------------------------
      // SCENE 7: FINAL MANIFESTO CLOSER (11.35 -> 14.50)
      // "WE DON'T JUST MAKE CONTENT. WE MAKE IT MOVE."
      // REMAINS 100% VISIBLE ALL THE WAY TO THE PIN RELEASE!
      // -------------------------------------------------------------
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

        // Final hold: locked solidly through 14.50s
        masterTl.to(finalLayerRef.current, { duration: 2.60 }, 11.90);
      }

      // -------------------------------------------------------------
      // GSAP SCROLLTRIGGER PINNED ENGINE
      // scrub: 1 gives heavy, cinematic, controlled scroll physics
      // -------------------------------------------------------------
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

          // Map progress directly to active scene (0 = Intro, 1..6 = Missions, 7 = Final)
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

      {/* Top Entrance Blend: Subtle soft edge that vanishes immediately */}
      <div
        ref={topBlendRef}
        className="absolute inset-x-0 top-0 h-12 sm:h-16 pointer-events-none z-30"
        style={{
          background: 'linear-gradient(to bottom, rgba(5,7,11,0.3) 0%, rgba(5,7,11,0.08) 60%, transparent 100%)',
        }}
      />

      {/* Bottom Exit Blend: Subtle soft feather only at the unpin seam */}
      <div
        ref={bottomBlendRef}
        className="absolute inset-x-0 bottom-0 h-14 sm:h-20 pointer-events-none z-30"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(5,7,11,0.2) 50%, rgba(5,7,11,0.65) 100%)',
        }}
      />

      {/* ========================================================= */}
      {/* 2. DYNAMIC FULL 3D SPACE MESH CANVAS & ARCHITECTURAL GRID  */}
      {/* ========================================================= */}
      {/* Base architectural precision grid spanning 100% full background */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0A0D14 1px, transparent 1px),
            linear-gradient(to bottom, #0A0D14 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
        }}
      />

      {/* Dynamic 3D undulating space mesh canvas (100% edge-to-edge coverage) */}
      <SpaceMeshCanvas theme="light" scrollProgress={scrollProgress} className="opacity-95 z-0" />

      {/* Subtle radial center ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-30"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(20, 151, 245, 0.12) 0%, rgba(246, 248, 252, 0) 70%)',
        }}
      />

      {/* ========================================================= */}
      {/* 3. THE 100dvh PINNED CINEMATIC STAGE                      */}
      {/* ========================================================= */}
      <div
        ref={stageRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative w-full h-[100dvh] max-h-[100dvh] overflow-hidden flex items-center justify-center z-20"
        style={{ perspective: '1200px' }}
      >
        <div className="relative w-full h-full max-w-[1600px] mx-auto flex items-center justify-center">
          {/* ----------------------------------------------------- */}
          {/* SCENE 0: OPENING STATEMENT                            */}
          {/* "WE CREATE STORIES THAT MOVE PEOPLE."                 */}
          {/* ----------------------------------------------------- */}
          <div
            ref={introLayerRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-30"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 font-mono text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#1497F5] font-bold mb-6 sm:mb-8">
              <span className="w-8 h-[1.5px] bg-[#1497F5]" />
              <span>WHAT WE DO</span>
              <span className="w-8 h-[1.5px] bg-[#1497F5]" />
            </div>

            {/* Monumental Headline */}
            <h2 className="font-editorial font-black uppercase text-center tracking-[-0.04em] text-[#0A0D14]">
              <span
                ref={introLine1Ref}
                className="block text-[12vw] xs:text-[11vw] sm:text-[9vw] md:text-[8vw] lg:text-[88px] xl:text-[104px] leading-[0.9] text-slate-800"
              >
                WE CREATE
              </span>
              <span
                ref={introLine2Ref}
                className="block text-[14vw] xs:text-[13vw] sm:text-[10.5vw] md:text-[9.5vw] lg:text-[108px] xl:text-[128px] leading-[0.88] text-[#0A0D14] font-black"
              >
                STORIES THAT
              </span>
              <span
                ref={introLine3Ref}
                className="block text-[14vw] xs:text-[13vw] sm:text-[10.5vw] md:text-[9.5vw] lg:text-[108px] xl:text-[128px] leading-[0.88] text-[#0A0D14]"
              >
                MOVE PEOPLE<span className="text-[#1497F5]">.</span>
              </span>
            </h2>

            {/* Studio Subcopy */}
            <p
              ref={introSubcopyRef}
              className="mt-8 sm:mt-10 max-w-2xl font-mono text-xs sm:text-sm md:text-base tracking-[0.16em] uppercase text-slate-700 font-semibold px-4"
            >
              STRATEGY. PRODUCTION. EDITING. CONTENT BUILT TO MOVE PEOPLE.
            </p>

            {/* Scroll Cue */}
            <div className="mt-8 sm:mt-12 flex items-center gap-2 text-slate-400 font-mono text-[10px] tracking-[0.25em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1497F5] animate-pulse" />
              <span>SCROLL TO EXPLORE</span>
            </div>
          </div>

          {/* ----------------------------------------------------- */}
          {/* SCENES 1 TO 6: THE SIX CREATIVE CHAPTERS              */}
          {/* (IMAGE ONLY - NO REELS)                               */}
          {/* ----------------------------------------------------- */}
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
                {/* Thin electric blue accent line traveling across */}
                <div
                  ref={(el) => (accentLineRefs.current[idx] = el)}
                  className="absolute inset-x-8 sm:inset-x-16 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#1497F5]/50 to-transparent pointer-events-none z-0 opacity-0"
                />

                <div className="w-full h-full max-w-[1500px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 pt-16 pb-14 sm:py-0 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-5 sm:gap-8 lg:gap-16 z-10">
                  {/* Monumental Editorial Typography */}
                  <div
                    ref={(el) => (typoRefs.current[idx] = el)}
                    className={`w-full lg:w-[50%] flex flex-col justify-center text-left ${
                      isEven ? 'lg:order-2 lg:pl-10 xl:pl-16' : 'lg:order-1 lg:pr-10 xl:pr-16'
                    }`}
                  >
                    {/* Chapter Number & Category */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
                      <span className="font-mono text-sm sm:text-base md:text-xl font-bold tracking-[0.25em] text-[#1497F5]">
                        {mission.number}
                      </span>
                      <span className="w-8 sm:w-12 h-[1.5px] bg-[#1497F5]" />
                      <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-slate-500 font-bold">
                        {mission.category}
                      </span>
                    </div>

                    {/* Massive Editorial Title */}
                    <h3 className="font-editorial font-black uppercase text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-[-0.035em] text-[#0A0D14]">
                      {mission.titleLines.map((line, lIdx) => (
                        <span key={lIdx} className="block">
                          {line}
                        </span>
                      ))}
                    </h3>

                    {/* Concise Editorial Description */}
                    <p className="mt-3 sm:mt-5 max-w-lg font-sans text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                      {mission.description}
                    </p>

                    {/* Editorial Tag */}
                    <div className="mt-3 sm:mt-6 inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[#1497F5]/10 text-[#0080E5] border border-[#1497F5]/25 text-[9px] sm:text-[10px] font-mono tracking-[0.2em] uppercase font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1497F5]" />
                      <span>{mission.tag}</span>
                    </div>
                  </div>

                  {/* Editorial Image Frame (IMAGE ONLY - NO REEL) */}
                  <div
                    ref={(el) => (imageRefs.current[idx] = el)}
                    className={`w-full lg:w-[48%] flex items-center justify-center ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <div
                      className={`relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.18),0_0_25px_rgba(20,151,245,0.06)] group bg-white ${
                        mission.aspectRatio === 'portrait'
                          ? 'w-48 xs:w-56 sm:w-64 md:w-72 lg:w-84 aspect-[9/15] max-h-[44dvh] sm:max-h-[52dvh] lg:max-h-[64dvh]'
                          : 'w-full max-w-[300px] xs:max-w-[360px] sm:max-w-md lg:max-w-lg aspect-video max-h-[30dvh] sm:max-h-[40dvh] lg:max-h-[50dvh]'
                      }`}
                    >
                      {/* Top electric blue highlight */}
                      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#1497F5] to-transparent pointer-events-none z-20" />

                      {/* Real High-Resolution Photography Still */}
                      <img
                        src={mission.imageUrl}
                        alt={`${mission.number} - ${mission.category}`}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Corner BrandShoots attribution pill */}
                      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1497F5]" />
                        <span className="font-mono text-[9px] tracking-widest uppercase font-semibold">
                          BRANDSHOOTS STILL
                        </span>
                      </div>

                      {/* Top-right chapter badge */}
                      <div className="absolute top-3 right-3 z-20 font-mono text-[8px] tracking-[0.2em] text-white/90 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 uppercase">
                        CHAPTER {mission.number}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* ----------------------------------------------------- */}
          {/* SCENE 7: THE FINAL STATEMENT                          */}
          {/* "WE DON'T JUST MAKE CONTENT. WE MAKE IT MOVE."        */}
          {/* REMAINS 100% VISIBLE TO THE VERY END OF THE PIN!      */}
          {/* ----------------------------------------------------- */}
          <div
            ref={finalLayerRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-30 pointer-events-none"
          >
            <div className="flex items-center gap-3 font-mono text-[11px] sm:text-xs tracking-[0.35em] uppercase text-[#1497F5] font-bold mb-6 sm:mb-8">
              <span className="w-8 h-[1.5px] bg-[#1497F5]" />
              <span>THE BRANDSHOOTS STANDARD</span>
              <span className="w-8 h-[1.5px] bg-[#1497F5]" />
            </div>

            <h2
              ref={finalHeadingRef}
              className="font-editorial font-black uppercase text-center tracking-[-0.04em] text-[#0A0D14]"
            >
              <span className="block text-[11vw] xs:text-[10vw] sm:text-[8vw] md:text-[6.5vw] lg:text-[76px] xl:text-[90px] leading-[0.92] text-slate-800">
                WE DON'T JUST
              </span>
              <span className="block text-[11vw] xs:text-[10vw] sm:text-[8vw] md:text-[6.5vw] lg:text-[76px] xl:text-[90px] leading-[0.92] text-slate-800">
                MAKE CONTENT.
              </span>
              <span className="block mt-4 sm:mt-6 text-[13vw] xs:text-[12vw] sm:text-[9.5vw] md:text-[8vw] lg:text-[96px] xl:text-[116px] leading-[0.9] text-[#0A0D14] font-black">
                WE MAKE IT
              </span>
              <span className="block text-[13vw] xs:text-[12vw] sm:text-[9.5vw] md:text-[8vw] lg:text-[96px] xl:text-[116px] leading-[0.9] text-[#0A0D14] font-black">
                MOVE<span className="text-[#1497F5]">.</span>
              </span>
            </h2>

            {/* Downward indicator leading into Clients */}
            <div className="mt-8 sm:mt-12 flex flex-col items-center gap-2.5 text-slate-500 font-mono text-[10px] tracking-[0.25em] uppercase font-bold">
              <div className="w-[1.5px] h-8 sm:h-12 bg-gradient-to-b from-[#1497F5] to-transparent animate-pulse" />
              <span>OUR CLIENTS & PARTNERS</span>
            </div>
          </div>
        </div>

        {/* ======================================================= */}
        {/* 4. FLOATING EXHIBITION METADATA PILL (BOTTOM-LEFT)      */}
        {/* ======================================================= */}
        <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-40 hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_10px_30px_rgba(15,23,42,0.08)] text-[#0A0D14] font-mono text-[11px] pointer-events-none">
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
    </section>
  );
};

export default WhatWeDoSection;
