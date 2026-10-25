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
  videoUrl: string;
  aspectRatio: 'portrait';
  tag: string;
}

const MISSIONS: MissionData[] = [
  {
    id: 'creative-content',
    number: '01',
    titleLines: ['CREATIVE', 'CONTENT'],
    category: 'CREATIVE CONTENT',
    description: 'High-impact social films, vertical storytelling, viral hooks, and creative campaign direction engineered to captivate algorithmic feeds.',
    imageUrl: '/what-we-do/creative-content.jpg',
    videoUrl: '/reels/aabharan_womens_accessories/aabharan_womens_accessories_2026-05-30_10-01-21_3908213461611903133_45301478774.mp4',
    aspectRatio: 'portrait',
    tag: 'CREATIVE DIRECTION & HOOKS',
  },
  {
    id: 'digital-growth',
    number: '02',
    titleLines: ['DIGITAL', 'GROWTH'],
    category: 'DIGITAL GROWTH',
    description: 'Full-funnel digital creative systems, visual campaigns, and scalable brand momentum engineered to convert viewers into lifelong advocates.',
    imageUrl: '/what-we-do/digital-growth.jpg',
    videoUrl: '/reels/viswatuff.glass_rjy/viswatuff.glass_rjy_2026-05-28_18-00-28_3907005057329571857_78432309239.mp4',
    aspectRatio: 'portrait',
    tag: 'CATEGORY LEADERSHIP & SCALE',
  },
  {
    id: 'editing-posting',
    number: '03',
    titleLines: ['EDITING &', 'POSTING'],
    category: 'EDITING & POSTING',
    description: 'Precision cinematic editing, luxury Hollywood color grading, immersive spatial sound design, and scheduled high-impact posting across platforms.',
    imageUrl: '/what-we-do/editing-posting.jpg',
    videoUrl: '/reels/sbventures_official/sbventures_official_2026-09-15_17-10-21_3986704799434897519_5720346010.mp4',
    aspectRatio: 'portrait',
    tag: 'PRECISION FINISHING & DISTRIBUTION',
  },
];

export const WhatWeDoSection: React.FC = () => {
  const { services } = useCMSContent();
  const activeMissions: MissionData[] =
    services && services.length === 3
      ? services.map((s, idx) => {
          // If stored imageUrl is empty or still points to old reel thumbnails, migrate to brand-new generated image
          const isLegacyThumb = !s.imageUrl || s.imageUrl.includes('/reels/thumbnails/');
          const resolvedImageUrl = isLegacyThumb ? MISSIONS[idx].imageUrl : s.imageUrl;
          return {
            id: s.id,
            number: s.number || `0${idx + 1}`,
            titleLines: s.titleLines,
            category: s.category,
            description: s.description,
            imageUrl: resolvedImageUrl,
            videoUrl: s.videoUrl || MISSIONS[idx]?.videoUrl,
            aspectRatio: 'portrait' as const,
            tag: s.tag,
          };
        })
      : MISSIONS;

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Scenes 1..3: The Capabilities
  const missionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const typoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mediaContainerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scene 4: 3D Climax - CREATE. SHOOT. GROW.
  const finalLayerRef = useRef<HTMLDivElement>(null);
  const finalHeadingRef = useRef<HTMLHeadingElement>(null);
  const finalWord1Ref = useRef<HTMLSpanElement>(null);
  const finalWord2Ref = useRef<HTMLSpanElement>(null);
  const finalWord3Ref = useRef<HTMLSpanElement>(null);

  // Active state: starts directly with Chapter 1
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(1);
  const activeChapterRef = useRef<number>(1);

  // Subtle pointer spatial parallax on desktop
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    if (activeChapterIndex >= 1 && activeChapterIndex <= 3) {
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
    } else if (activeChapterIndex === 4 && finalLayerRef.current) {
      gsap.to(finalLayerRef.current, {
        rotateY: nx * 14,
        rotateX: -ny * 12,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handlePointerLeave = () => {
    if (activeChapterIndex >= 1 && activeChapterIndex <= 3) {
      const activeMedia = mediaContainerRefs.current[activeChapterIndex - 1];
      const activeTypo = typoRefs.current[activeChapterIndex - 1];
      if (activeMedia) {
        gsap.to(activeMedia, { x: 0, y: 0, rotateY: 0, rotateX: 0, duration: 1.0, ease: 'power3.out', overwrite: 'auto' });
      }
      if (activeTypo) {
        gsap.to(activeTypo, { x: 0, y: 0, duration: 1.0, ease: 'power3.out', overwrite: 'auto' });
      }
    } else if (activeChapterIndex === 4 && finalLayerRef.current) {
      gsap.to(finalLayerRef.current, { rotateY: 0, rotateX: 0, duration: 1.0, ease: 'power3.out', overwrite: 'auto' });
    }
  };

  // User interaction unlock listener for iOS & Android autoplay policies
  useEffect(() => {
    const handleUserUnlock = () => {
      const vids = stageRef.current?.querySelectorAll('video');
      vids?.forEach((v) => {
        v.muted = true;
        v.defaultMuted = true;
      });
      const activeVideo = stageRef.current?.querySelector('video[data-active="true"]') as HTMLVideoElement | null;
      if (activeVideo && activeVideo.paused) {
        activeVideo.play().catch(() => {});
      }
    };

    window.addEventListener('touchstart', handleUserUnlock, { once: true, passive: true });
    window.addEventListener('pointerdown', handleUserUnlock, { once: true, passive: true });

    return () => {
      window.removeEventListener('touchstart', handleUserUnlock);
      window.removeEventListener('pointerdown', handleUserUnlock);
    };
  }, []);

  // GSAP SCROLL ENGINES (Unified Pinned 3D Stage on Mobile & Desktop)
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !stageRef.current) return;

      const masterTl = gsap.timeline({ defaults: { ease: 'none' } });

      // Initial setup
      missionRefs.current.forEach((mission, idx) => {
        if (!mission) return;
        if (idx === 0) {
          gsap.set(mission, { autoAlpha: 1, pointerEvents: 'auto', y: 0, scale: 1 });
        } else {
          gsap.set(mission, { autoAlpha: 0, pointerEvents: 'none', y: 0, scale: 1 });
        }
      });

      if (finalLayerRef.current) {
        gsap.set(finalLayerRef.current, { autoAlpha: 0 });
      }
      if (finalWord1Ref.current) gsap.set(finalWord1Ref.current, { autoAlpha: 0, z: -320, rotateX: 32, scale: 0.65 });
      if (finalWord2Ref.current) gsap.set(finalWord2Ref.current, { autoAlpha: 0, z: -320, rotateX: 32, scale: 0.65 });
      if (finalWord3Ref.current) gsap.set(finalWord3Ref.current, { autoAlpha: 0, z: -320, rotateX: 32, scale: 0.65 });

      // Scenes 1..3: Immersive Media Presentations
      activeMissions.forEach((_, idx) => {
        const m = missionRefs.current[idx];
        const t = typoRefs.current[idx];
        const media = mediaContainerRefs.current[idx];

        if (m) {
          if (idx === 0) {
            // First mission is initially visible, exits toward depth
            masterTl.to(
              t,
              { y: -35, opacity: 0, duration: 0.45, ease: 'power2.in' },
              0.9
            );
            if (media) {
              masterTl.to(
                media,
                { scale: 1.05, opacity: 0, y: -35, duration: 0.5, ease: 'power2.in' },
                0.9
              );
            }
            masterTl.set(m, { autoAlpha: 0, pointerEvents: 'none' }, 1.35);
          } else {
            const startTime = idx === 1 ? 1.35 : 2.8;
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
                { scale: 1.1, opacity: 0.7, rotateX: 5 },
                { scale: 1.0, opacity: 1, rotateX: 0, duration: 0.7, ease: 'power2.out' },
                startTime
              );
            }

            if (t) {
              masterTl.fromTo(
                t,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
                startTime + 0.1
              );
            }

            // Exit toward camera / depth before next chapter
            masterTl.to(
              t,
              { y: -35, opacity: 0, duration: 0.45, ease: 'power2.in' },
              startTime + 1.0
            );
            if (media) {
              masterTl.to(
                media,
                { scale: 1.05, opacity: 0, y: -35, duration: 0.5, ease: 'power2.in' },
                startTime + 1.0
              );
            }
            masterTl.set(m, { autoAlpha: 0, pointerEvents: 'none' }, startTime + 1.45);
          }
        }
      });

      // Scene 4: 3D Climax - CREATE. SHOOT. GROW.
      if (finalLayerRef.current) {
        masterTl.set(finalLayerRef.current, { autoAlpha: 1 }, 4.25);

        if (finalWord1Ref.current) {
          masterTl.fromTo(
            finalWord1Ref.current,
            { autoAlpha: 0, scale: 0.65, z: -320, rotateX: 32, y: 35 },
            { autoAlpha: 1, scale: 1, z: 0, rotateX: 0, y: 0, duration: 0.55, ease: 'power3.out' },
            4.35
          );
        }

        if (finalWord2Ref.current) {
          masterTl.fromTo(
            finalWord2Ref.current,
            { autoAlpha: 0, scale: 0.65, z: -320, rotateX: 32, y: 35 },
            { autoAlpha: 1, scale: 1, z: 0, rotateX: 0, y: 0, duration: 0.55, ease: 'power3.out' },
            4.65
          );
        }

        if (finalWord3Ref.current) {
          masterTl.fromTo(
            finalWord3Ref.current,
            { autoAlpha: 0, scale: 0.65, z: -320, rotateX: 32, y: 35 },
            { autoAlpha: 1, scale: 1, z: 0, rotateX: 0, y: 0, duration: 0.6, ease: 'power3.out' },
            4.95
          );
        }

        // Climax hold and forward 3D presence
        masterTl.to(finalLayerRef.current, { z: 40, duration: 0.65 }, 5.25);
      }

      const isMobile = window.innerWidth < 1024;
      ScrollTrigger.create({
        id: 'what-we-do-scrolltrigger',
        trigger: sectionRef.current,
        start: 'top top',
        end: isMobile ? '+=1800' : '+=2400',
        pin: true,
        anticipatePin: 1,
        scrub: isMobile ? 0.8 : 1.0,
        animation: masterTl,
        onUpdate: (self) => {
          const p = self.progress;
          let chapter = 1;
          if (p < 0.28) chapter = 1;
          else if (p < 0.58) chapter = 2;
          else if (p < 0.85) chapter = 3;
          else chapter = 4;

          if (chapter !== activeChapterRef.current) {
            activeChapterRef.current = chapter;
            setActiveChapterIndex(chapter);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
        <div
          className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
          }}
        />
      </div>

      {/* Top Edge Gentle Gradient Fade (Seamless Blend with Hero) */}
      <div
        className="absolute inset-x-0 top-0 h-20 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(to bottom, #04060A 0%, rgba(4,6,10,0.6) 50%, transparent 100%)',
        }}
      />

      {/* ========================================================= */}
      {/* CINEMATIC 3D PINNED STAGE (Responsive Mobile & Desktop)   */}
      {/* ========================================================= */}
      <div className="relative w-full">
        <div
          ref={stageRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="relative w-full h-[100dvh] max-h-[100dvh] overflow-hidden flex items-center justify-center z-20"
          style={{ perspective: '1400px' }}
        >
          <div className="relative w-full h-full max-w-[1680px] mx-auto flex items-center justify-center px-4 sm:px-8 lg:px-10">
            {/* Scenes 1..3: Immersive Chapters */}
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
                  <div className="w-full h-full max-w-7xl mx-auto px-4 sm:px-8 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-4 xs:gap-6 lg:gap-12 xl:gap-16 z-10 py-4 lg:py-0">
                    {/* Typography Column */}
                    <div
                      ref={(el) => (typoRefs.current[idx] = el)}
                      className={`w-full lg:w-[46%] flex flex-col justify-center text-center lg:text-left shrink-0 ${
                        isEven ? 'lg:order-2 lg:pl-8' : 'lg:order-1 lg:pr-8'
                      }`}
                    >
                      {/* Chapter Eyebrow Hierarchy */}
                      <div className="flex items-center justify-center lg:justify-start gap-2.5 mb-2.5 sm:mb-3.5">
                        <span className="font-mono text-xs sm:text-[13px] tracking-[0.28em] text-[#008CFF] font-bold">
                          {mission.number} / 03
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/40" />
                        <span className="font-mono text-[10px] sm:text-xs tracking-[0.22em] uppercase text-white/60 font-medium">
                          {mission.category}
                        </span>
                      </div>

                      {/* Editorial Monumental Heading */}
                      <h3 className="font-sans font-black uppercase text-2xl xs:text-3xl sm:text-4xl lg:text-6xl xl:text-7xl leading-[0.92] tracking-[-0.035em] text-white">
                        {mission.titleLines.map((line, lIdx) => (
                          <span key={lIdx} className="block">
                            {line}
                          </span>
                        ))}
                      </h3>

                      {/* Descriptive Narrative */}
                      <p className="mt-2.5 sm:mt-4 lg:mt-6 max-w-xs xs:max-w-sm sm:max-w-md lg:max-w-lg mx-auto lg:mx-0 font-sans text-xs xs:text-sm sm:text-base lg:text-lg leading-[1.5] lg:leading-[1.65] text-white/70 font-normal">
                        {mission.description}
                      </p>

                      {/* Intentional Tag Chip */}
                      <div className="mt-4 sm:mt-5 lg:mt-6 flex justify-center lg:justify-start">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/12 text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-white/75">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
                          <span>{mission.tag}</span>
                        </span>
                      </div>
                    </div>

                    {/* Dominant Immersive Media Canvas */}
                    <div
                      ref={(el) => (mediaContainerRefs.current[idx] = el)}
                      className={`w-full lg:w-[54%] flex items-center justify-center shrink-0 ${
                        isEven ? 'lg:order-1' : 'lg:order-2'
                      }`}
                    >
                      <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.85)] bg-black transition-transform aspect-[9/16] h-[48vh] xs:h-[52vh] sm:h-[58vh] lg:h-[68vh] xl:h-[72vh] max-h-[720px] w-auto max-w-[calc(100vw-3rem)] flex items-center justify-center group/card">
                        <img
                          src={mission.imageUrl || MISSIONS[idx]?.imageUrl}
                          alt={`${mission.category} - ${mission.titleLines.join(' ')}`}
                          loading={idx === 0 ? 'eager' : 'lazy'}
                          className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 ease-out group-hover/card:scale-105"
                        />
                        {/* Subtle Cinematic Vignette / Glare overlay */}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/55 via-transparent to-black/20" />

                        {/* Official Embedded BrandShoots Logo Watermark */}
                        <div className="absolute top-4 sm:top-5 right-4 sm:right-5 z-10 pointer-events-none flex items-center px-3.5 py-1.5 rounded-xl bg-black/65 backdrop-blur-md border border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
                          <img
                            src="/Logo-Official-Tight.png"
                            alt="BrandShoots"
                            className="h-4 sm:h-5 w-auto object-contain"
                          />
                        </div>

                        <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Scene 7: 3D Climax - CREATE. SHOOT. GROW. */}
            <div
              ref={finalLayerRef}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-30 pointer-events-none"
              style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
            >
              <h2
                ref={finalHeadingRef}
                className="font-sans font-black uppercase text-center tracking-[-0.04em] select-none flex flex-col items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <span
                  ref={finalWord1Ref}
                  className="block text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[136px] leading-[0.88] text-white tracking-[-0.03em]"
                  style={{
                    textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 10px 40px rgba(255,255,255,0.08)',
                  }}
                >
                  CREATE
                </span>
                <span
                  ref={finalWord2Ref}
                  className="block text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[136px] leading-[0.88] text-white/90 tracking-[-0.03em] my-1 sm:my-2"
                  style={{
                    textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 10px 40px rgba(255,255,255,0.08)',
                  }}
                >
                  SHOOT
                </span>
                <span
                  ref={finalWord3Ref}
                  className="block text-6xl xs:text-7xl sm:text-8xl md:text-9xl lg:text-[124px] xl:text-[150px] leading-[0.86] text-[#008CFF] font-black tracking-[-0.03em]"
                  style={{
                    textShadow: '0 0 50px rgba(0,140,255,0.7), 0 10px 30px rgba(0,0,0,0.9)',
                  }}
                >
                  GROW<span className="text-white">.</span>
                </span>
              </h2>
            </div>

            {/* Simple Minimalist Progress Bar */}
            <div
              className={`absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 pointer-events-none transition-all duration-300 ${
                activeChapterIndex >= 1 && activeChapterIndex <= 3
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-2 pointer-events-none'
              }`}
            >
              <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-[#008CFF] tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                0{activeChapterIndex}
              </span>
              <div className="w-24 sm:w-36 h-[2px] bg-white/20 rounded-full overflow-hidden backdrop-blur-sm shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                <div
                  className="h-full bg-gradient-to-r from-[#008CFF] to-[#52B2FF] transition-all duration-300 rounded-full shadow-[0_0_8px_#008CFF]"
                  style={{ width: `${(activeChapterIndex / 3) * 100}%` }}
                />
              </div>
              <span className="font-mono text-[10px] sm:text-[11px] text-white/40 tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                03
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
