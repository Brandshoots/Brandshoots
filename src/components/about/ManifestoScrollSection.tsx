import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ManifestoScrollSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);

  // Stage references with 3D transform containers
  const stageRef = useRef<HTMLDivElement>(null);
  const createWrapRef = useRef<HTMLDivElement>(null);
  const createTextRef = useRef<HTMLHeadingElement>(null);
  const createSubRef = useRef<HTMLDivElement>(null);

  const shootWrapRef = useRef<HTMLDivElement>(null);
  const shootTextRef = useRef<HTMLHeadingElement>(null);
  const shootSubRef = useRef<HTMLDivElement>(null);

  const growWrapRef = useRef<HTMLDivElement>(null);
  const growTextRef = useRef<HTMLHeadingElement>(null);
  const growSubRef = useRef<HTMLDivElement>(null);

  const bgVolumetricRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Interactive pointer/touch parallax for 3D stage
    const onMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768 || !stageRef.current) return;
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      gsap.to(stageRef.current, {
        rotateY: normX * 4,
        rotateX: -normY * 4,
        duration: 0.8,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const ctx = gsap.context(() => {
      if (!sectionRef.current || !pinWrapperRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=240%',
          pin: pinWrapperRef.current,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Initial 3D Spatial Setup (Sharp & Dimensional with subtle DOF)
      gsap.set(createWrapRef.current, {
        opacity: 1,
        scale: 1,
        z: 0,
        rotateX: 0,
        zIndex: 10,
        transformPerspective: 1400,
      });
      gsap.set(createTextRef.current, {
        scale: 1,
        filter: 'blur(0px)',
        transformPerspective: 1400,
      });

      gsap.set(shootWrapRef.current, {
        opacity: 0,
        scale: 0.45,
        z: -550,
        rotateX: 14,
        rotateY: -10,
        filter: 'blur(5px)',
        zIndex: 20,
        transformPerspective: 1400,
      });

      gsap.set(growWrapRef.current, {
        opacity: 0,
        scale: 0.4,
        z: -700,
        rotateX: -16,
        rotateY: 10,
        filter: 'blur(6px)',
        zIndex: 30,
        transformPerspective: 1400,
      });

      // ====================================================================
      // THREE CLEAN, SEQUENTIAL 3D SPATIAL MANIFESTO STAGES (Zero Overlap)
      // ====================================================================

      // Phase 1 (0.00 -> 0.35): CREATE is centered, sharp, and dominant
      tl.to(progressBarRef.current, { width: '33%', duration: 0.45, ease: 'none' }, 0)
        .to(createTextRef.current, { letterSpacing: '-0.02em', duration: 0.4 }, 0)

        // Stage 1 Exit (0.35 -> 0.55): CREATE glides forward and out
        .to(
          createWrapRef.current,
          {
            scale: 1.6,
            z: 250,
            y: -30,
            opacity: 0,
            duration: 0.2,
            ease: 'power2.in',
          },
          0.35
        )
        .to(
          createSubRef.current,
          { y: -40, opacity: 0, duration: 0.16 },
          0.35
        )

        // Stage 2 Entrance (0.55 -> 0.75): SHOOT surges forward from deep Z-space
        .to(
          shootWrapRef.current,
          {
            opacity: 1,
            scale: 1,
            z: 0,
            rotateX: 0,
            rotateY: 0,
            filter: 'blur(0px)',
            duration: 0.22,
            ease: 'power2.out',
          },
          0.55
        )
        .to(
          shootSubRef.current,
          { y: 0, opacity: 1, duration: 0.18, ease: 'power2.out' },
          0.6
        )
        .to(
          bgVolumetricRef.current,
          {
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.26) 0%, rgba(11, 16, 78, 0.45) 50%, transparent 80%)',
            scale: 1.25,
            duration: 0.35,
          },
          0.55
        )

        // Phase 2 Hold (0.75 -> 1.10): SHOOT is centered, sharp, and dominant
        .to(progressBarRef.current, { width: '66%', duration: 0.55, ease: 'none' }, 0.55)
        .to(shootTextRef.current, { letterSpacing: '-0.02em', duration: 0.35 }, 0.6)

        // Stage 2 Exit (1.10 -> 1.30): SHOOT glides forward and out
        .to(
          shootWrapRef.current,
          {
            scale: 1.6,
            z: 250,
            y: -30,
            opacity: 0,
            duration: 0.2,
            ease: 'power2.in',
          },
          1.1
        )
        .to(
          shootSubRef.current,
          { y: -40, opacity: 0, duration: 0.16 },
          1.1
        )

        // Stage 3 Entrance (1.30 -> 1.50): GROW bursts into focus with volumetric presence
        .to(
          growWrapRef.current,
          {
            opacity: 1,
            scale: 1,
            z: 0,
            rotateX: 0,
            rotateY: 0,
            filter: 'blur(0px)',
            duration: 0.22,
            ease: 'power2.out',
          },
          1.3
        )
        .to(
          growSubRef.current,
          { y: 0, opacity: 1, duration: 0.18, ease: 'power2.out' },
          1.35
        )
        .to(
          bgVolumetricRef.current,
          {
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.32) 0%, rgba(7, 11, 51, 0.55) 50%, transparent 85%)',
            scale: 1.35,
            duration: 0.35,
          },
          1.3
        )
        .to(growTextRef.current, { letterSpacing: '-0.02em', duration: 0.35 }, 1.35)

        // Phase 3 Hold (1.50 -> 1.85): GROW holds dominant
        .to(progressBarRef.current, { width: '100%', duration: 0.55, ease: 'none' }, 1.3)

        // Stage 3 Dissolution into BrandShootsCore3D (1.85 -> 2.10)
        .to(
          growWrapRef.current,
          {
            scale: 0.94,
            opacity: 0.4,
            filter: 'blur(3px)',
            duration: 0.25,
            ease: 'power2.out',
          },
          1.85
        )
        .to({}, { duration: 0.15 }, 2.05);
    }, sectionRef);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative w-full bg-[#04060A] text-white overflow-hidden select-none"
    >
      <div
        ref={pinWrapperRef}
        className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col justify-between items-center py-8 sm:py-12 px-6 sm:px-12 max-w-[1720px] mx-auto z-10 overflow-hidden"
      >
        {/* ======================================================== */}
        {/* TOP: EYEBROW & PROGRESS TELEMETRY                        */}
        {/* ======================================================== */}
        <div className="shrink-0 w-full flex flex-col items-center text-center z-20 pt-16 sm:pt-14">
          <div className="flex items-center gap-3 mb-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#008CFF] shadow-[0_0_12px_#008CFF]" />

          </div>

          <div className="w-36 sm:w-48 h-[2px] bg-white/10 rounded-full mt-2 overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-[#008CFF] to-[#60B8FF] w-0 transition-all"
            />
          </div>
        </div>

        {/* Volumetric Radial Light Glow */}
        <div
          ref={bgVolumetricRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[1200px] h-[600px] pointer-events-none transition-all duration-700"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.2) 0%, rgba(11, 16, 78, 0.35) 50%, transparent 75%)',
            filter: 'blur(100px)',
          }}
        />

        {/* ======================================================== */}
        {/* CENTER: 3D VOLUMETRIC TRANSFORMATION STAGE               */}
        {/* ======================================================== */}
        <div
          ref={stageRef}
          className="flex-1 w-full flex items-center justify-center relative will-change-transform"
          style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
        >
          {/* ------------------------------------------------------ */}
          {/* 3D STAGE 1: CREATE.                                    */}
          {/* ------------------------------------------------------ */}
          <div
            ref={createWrapRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none will-change-transform"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <h2
              ref={createTextRef}
              className="font-display font-black uppercase text-[15vw] sm:text-[14vw] md:text-[13vw] lg:text-[160px] xl:text-[200px] leading-[0.84] tracking-[-0.04em] text-[#F7F9FF] will-change-transform filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
              style={{
                textShadow:
                  '0 2px 0 #CBD5E1, 0 6px 1px rgba(0,0,0,0.7), 0 20px 40px rgba(0,0,0,0.95)',
              }}
            >
              CREATE<span className="text-[#008CFF] drop-shadow-[0_0_20px_#008CFF]">.</span>
            </h2>

            <div
              ref={createSubRef}
              className="mt-6 sm:mt-9 max-w-xl px-4 flex flex-col items-center"
            >

              <p className="font-editorial text-sm sm:text-base text-white/70 font-normal leading-relaxed">
                Before a camera rolls, we architect the vision. Strategy, script, and aesthetic intent crafted to resonate deeply.
              </p>
            </div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* 3D STAGE 2: SHOOT.                                     */}
          {/* ------------------------------------------------------ */}
          <div
            ref={shootWrapRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none will-change-transform"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <h2
              ref={shootTextRef}
              className="font-display font-black uppercase text-[15vw] sm:text-[14vw] md:text-[13vw] lg:text-[160px] xl:text-[200px] leading-[0.84] tracking-[-0.04em] text-[#F7F9FF] will-change-transform filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
              style={{
                textShadow:
                  '0 2px 0 #60B8FF, 0 6px 1px rgba(0,0,0,0.7), 0 20px 40px rgba(0,140,255,0.4)',
              }}
            >
              SHOOT<span className="text-[#008CFF] drop-shadow-[0_0_25px_#008CFF]">.</span>
            </h2>

            <div
              ref={shootSubRef}
              className="mt-6 sm:mt-9 max-w-xl px-4 flex flex-col items-center"
            >

              <p className="font-editorial text-sm sm:text-base text-white/70 font-normal leading-relaxed">
                Cinematic lighting, high-end lenses, and disciplined on-set execution. We capture frames that command undivided attention.
              </p>
            </div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* 3D STAGE 3: GROW.                                      */}
          {/* ------------------------------------------------------ */}
          <div
            ref={growWrapRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none will-change-transform"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <h2
              ref={growTextRef}
              className="font-display font-black uppercase text-[15vw] sm:text-[14vw] md:text-[13vw] lg:text-[160px] xl:text-[200px] leading-[0.84] tracking-[-0.04em] text-[#008CFF] will-change-transform filter drop-shadow-[0_25px_70px_rgba(0,140,255,0.6)]"
              style={{
                textShadow:
                  '0 2px 0 #28A0FF, 0 8px 2px rgba(0,0,0,0.8), 0 25px 50px rgba(0,140,255,0.5)',
              }}
            >
              GROW<span className="text-white drop-shadow-[0_0_20px_#fff]">.</span>
            </h2>

            <div
              ref={growSubRef}
              className="mt-6 sm:mt-9 max-w-xl px-4 flex flex-col items-center"
            >

              <p className="font-editorial text-sm sm:text-base text-white/70 font-normal leading-relaxed">
                Crafted content distributed with purpose. Turning impressions into loyal communities and compounding brand value.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="shrink-0 w-full flex items-center justify-between text-white/35 font-mono text-[11px] tracking-[0.24em] uppercase pt-4 border-t border-white/[0.06]">
          <span>BRANDSHOOTS</span>
          <span>SCROLL TO PROGRESS</span>
        </div>
      </div>
    </section>
  );
};

export default ManifestoScrollSection;
