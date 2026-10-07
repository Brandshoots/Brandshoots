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
          end: '+=250%',
          pin: pinWrapperRef.current,
          scrub: 1.0,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Initial clean setup: Stage 1 CREATE is active; Stage 2 & 3 are hidden
      gsap.set(createWrapRef.current, {
        autoAlpha: 1,
        yPercent: 0,
        scale: 1,
      });

      gsap.set(shootWrapRef.current, {
        autoAlpha: 0,
        yPercent: 25,
        scale: 0.96,
      });

      gsap.set(growWrapRef.current, {
        autoAlpha: 0,
        yPercent: 25,
        scale: 0.96,
      });

      // ====================================================================
      // THREE CLEAN, SEQUENTIAL, NON-OVERLAPPING MANIFESTO STAGES
      // ====================================================================

      // Phase 1 (0.00s -> 0.70s): CREATE holds centered & sharp
      tl.to(progressBarRef.current, { width: '33%', duration: 0.7, ease: 'none' }, 0);

      // Transition 1 -> 2 (0.70s -> 1.00s): CREATE exits UP, then SHOOT enters FROM BELOW
      tl.to(
        createWrapRef.current,
        {
          autoAlpha: 0,
          yPercent: -25,
          scale: 1.03,
          duration: 0.3,
          ease: 'power2.in',
        },
        0.7
      )
        .to(
          shootWrapRef.current,
          {
            autoAlpha: 1,
            yPercent: 0,
            scale: 1.0,
            duration: 0.3,
            ease: 'power2.out',
          },
          1.0
        )
        .to(
          bgVolumetricRef.current,
          {
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.22) 0%, rgba(11, 16, 78, 0.35) 50%, transparent 80%)',
            duration: 0.4,
          },
          0.85
        )
        // Phase 2 (1.00s -> 1.70s): SHOOT holds centered & sharp
        .to(progressBarRef.current, { width: '66%', duration: 0.7, ease: 'none' }, 1.0);

      // Transition 2 -> 3 (1.70s -> 2.00s): SHOOT exits UP, then GROW enters FROM BELOW
      tl.to(
        shootWrapRef.current,
        {
          autoAlpha: 0,
          yPercent: -25,
          scale: 1.03,
          duration: 0.3,
          ease: 'power2.in',
        },
        1.7
      )
        .to(
          growWrapRef.current,
          {
            autoAlpha: 1,
            yPercent: 0,
            scale: 1.0,
            duration: 0.3,
            ease: 'power2.out',
          },
          2.0
        )
        .to(
          bgVolumetricRef.current,
          {
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.28) 0%, rgba(7, 11, 51, 0.45) 50%, transparent 85%)',
            duration: 0.4,
          },
          1.85
        )
        // Phase 3 (2.00s -> 2.70s): GROW holds centered & sharp to 100%
        .to(progressBarRef.current, { width: '100%', duration: 0.7, ease: 'none' }, 2.0)
        // Final hold (2.70s -> 3.00s)
        .to({}, { duration: 0.3 }, 2.7);
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
        className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col justify-between items-center py-8 sm:py-12 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto z-10 overflow-hidden"
      >
        {/* ======================================================== */}
        {/* TOP: EYEBROW & PROGRESS TELEMETRY                        */}
        {/* ======================================================== */}
        <div className="shrink-0 w-full flex flex-col items-center text-center z-20 pt-16 sm:pt-14">
          <div className="inline-flex items-center gap-2.5 font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#008CFF] font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
            <span>01 // THE MANIFESTO</span>
          </div>

          <div className="w-36 sm:w-48 h-[2px] bg-white/10 rounded-full mt-1 overflow-hidden">
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
        {/* CENTER: EDITORIAL TRANSFORMATION STAGE                   */}
        {/* ======================================================== */}
        <div
          ref={stageRef}
          className="flex-1 w-full flex items-center justify-center relative will-change-transform"
        >
          {/* ------------------------------------------------------ */}
          {/* STAGE 1: CREATE.                                       */}
          {/* ------------------------------------------------------ */}
          <div
            ref={createWrapRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none will-change-transform"
          >
            <h2
              ref={createTextRef}
              className="font-display font-black uppercase text-[12vw] xs:text-[11vw] sm:text-[10vw] md:text-[8.5vw] lg:text-[112px] xl:text-[132px] leading-[0.9] tracking-[-0.035em] text-[#F7F9FF] will-change-transform"
            >
              CREATE<span className="text-[#008CFF]">.</span>
            </h2>

            <div
              ref={createSubRef}
              className="mt-4 sm:mt-6 max-w-xl px-4 flex flex-col items-center"
            >
              <p className="font-sans text-sm sm:text-base md:text-[17px] text-white/75 font-normal leading-[1.65]">
                Before a camera rolls, we architect the vision. Strategy, script, and aesthetic intent crafted to resonate deeply.
              </p>
            </div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* STAGE 2: SHOOT.                                        */}
          {/* ------------------------------------------------------ */}
          <div
            ref={shootWrapRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none will-change-transform"
          >
            <h2
              ref={shootTextRef}
              className="font-display font-black uppercase text-[12vw] xs:text-[11vw] sm:text-[10vw] md:text-[8.5vw] lg:text-[112px] xl:text-[132px] leading-[0.9] tracking-[-0.035em] text-[#F7F9FF] will-change-transform"
            >
              SHOOT<span className="text-[#008CFF]">.</span>
            </h2>

            <div
              ref={shootSubRef}
              className="mt-4 sm:mt-6 max-w-xl px-4 flex flex-col items-center"
            >
              <p className="font-sans text-sm sm:text-base md:text-[17px] text-white/75 font-normal leading-[1.65]">
                Cinematic lighting, high-end lenses, and disciplined on-set execution. We capture frames that command undivided attention.
              </p>
            </div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* STAGE 3: GROW.                                         */}
          {/* ------------------------------------------------------ */}
          <div
            ref={growWrapRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none will-change-transform"
          >
            <h2
              ref={growTextRef}
              className="font-display font-black uppercase text-[12vw] xs:text-[11vw] sm:text-[10vw] md:text-[8.5vw] lg:text-[112px] xl:text-[132px] leading-[0.9] tracking-[-0.035em] text-[#008CFF] will-change-transform"
            >
              GROW<span className="text-[#F7F9FF]">.</span>
            </h2>

            <div
              ref={growSubRef}
              className="mt-4 sm:mt-6 max-w-xl px-4 flex flex-col items-center"
            >
              <p className="font-sans text-sm sm:text-base md:text-[17px] text-white/75 font-normal leading-[1.65]">
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
