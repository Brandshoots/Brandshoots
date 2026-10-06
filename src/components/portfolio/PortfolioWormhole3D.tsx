import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CLIENT_PROJECTS } from '../../data/clientsData';
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/**
 * PHASE 3 PORTFOLIO — 3D TIME MACHINE WORMHOLE CORRIDOR
 *
 * Built directly according to the client's hand-drawn specifications:
 * 1. Fixed Top Navbar + "Our Portfolio" header with chapter counter.
 * 2. 3D Alternating Composition:
 *    - Frame 1: 3D Tile on the LEFT (angled in 3D perspective), Title & Matter on the RIGHT.
 *    - Frame 2: Matter on the LEFT, 3D Tile on the RIGHT (angled in 3D perspective).
 * 3. 3D Time Machine Wormhole Effect:
 *    - Reels enter with real 3D spatial velocity from the side (translateX, translateZ, rotateY).
 *    - Distinctive 3D perspective (perspective: 800px) with dramatic optical convergence.
 *    - Concentric wormhole warp rings in background that pulse with scroll.
 * 4. NO client logo on the video (removed completely).
 * 5. "dont keep them before only": Upcoming reels are strictly hidden until their chapter begins.
 * 6. Smooth GSAP ScrollTrigger snapping for all 10 clients.
 */

// Cubic smoothstep easing
function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

export const PortfolioWormhole3D: React.FC = () => {
  const totalProjects = CLIENT_PROJECTS.length; // 10 projects
  const containerRef = useRef<HTMLDivElement>(null);

  // Fractional scroll unit across chapters: 0.0 to 9.0
  const [scrollUnit, setScrollUnit] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Video references for playback control
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Track responsive screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // GSAP ScrollTrigger configuration with Snap lock
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const snapPoints = 1 / (totalProjects - 1);

    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.4,
      snap: {
        snapTo: snapPoints,
        duration: { min: 0.28, max: 0.65 },
        delay: 0.03,
        ease: 'power2.out',
      },
      onUpdate: (self) => {
        const u = self.progress * (totalProjects - 1);
        setScrollUnit(u);
        const currentActive = Math.round(u);
        setActiveIndex(currentActive);
      },
    });

    return () => {
      st.kill();
    };
  }, [totalProjects]);

  // Video playback management: play active and adjacent, pause distant
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      const distance = Math.abs(scrollUnit - idx);
      if (distance < 0.75) {
        if (video.paused) {
          video.play().catch(() => {});
        }
      } else {
        if (!video.paused) {
          video.pause();
        }
      }
    });
  }, [scrollUnit]);

  // Smooth jump to project chapter
  const scrollToProject = useCallback(
    (index: number) => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const totalScrollable = container.offsetHeight - window.innerHeight;
      const targetTop = container.offsetTop + (index / (totalProjects - 1)) * totalScrollable;
      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    },
    [totalProjects]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#030508] text-white select-none"
      style={{
        // 100vh per project for generous scroll travel and exact snap settle
        height: `${totalProjects * 100}vh`,
      }}
    >
      {/* ================================================================== */}
      {/* FIXED 100vw × 100vh CINEMATIC VIEWPORT PINNED FOR SCROLL PROGRESS */}
      {/* ================================================================== */}
      <div className="fixed inset-0 w-full h-full overflow-hidden flex flex-col justify-between pointer-events-none">
        {/* ========================================================= */}
        {/* TIME MACHINE WORMHOLE TUNNEL BACKGROUND (3D WARP RINGS)   */}
        {/* ========================================================= */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Deep Obsidian Abyss */}
          <div className="absolute inset-0 bg-[#030508]" />

          {/* 3D Concentric Wormhole Warp Rings */}
          <svg
            className="absolute inset-0 w-full h-full opacity-45 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <radialGradient id="wormholeCenterGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#008CFF" stopOpacity="0.25" />
                <stop offset="40%" stopColor="#008CFF" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#030508" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="wormholeStreakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#008CFF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Receding Perspective Tunnel Guideway */}
            <line x1="0%" y1="0%" x2="50%" y2="50%" stroke="rgba(0,140,255,0.12)" strokeWidth="1" />
            <line x1="100%" y1="0%" x2="50%" y2="50%" stroke="rgba(0,140,255,0.12)" strokeWidth="1" />
            <line x1="0%" y1="100%" x2="50%" y2="50%" stroke="rgba(0,140,255,0.18)" strokeWidth="1" />
            <line x1="100%" y1="100%" x2="50%" y2="50%" stroke="rgba(0,140,255,0.18)" strokeWidth="1" />

            {/* Dynamic Receding Wormhole Ellipses */}
            {[
              { rx: '48%', ry: '38%', opacity: 0.12, stroke: '#008CFF' },
              { rx: '36%', ry: '28%', opacity: 0.18, stroke: '#008CFF' },
              { rx: '25%', ry: '19%', opacity: 0.25, stroke: '#008CFF' },
              { rx: '16%', ry: '12%', opacity: 0.35, stroke: '#008CFF' },
              { rx: '9%', ry: '7%', opacity: 0.45, stroke: '#00d2ff' },
            ].map((ring, rIdx) => {
              // Subtle scroll-linked pulsing
              const pulseScale = 1 + (((scrollUnit * 0.2 + rIdx * 0.15) % 1) - 0.5) * 0.08;
              return (
                <ellipse
                  key={rIdx}
                  cx="50%"
                  cy="50%"
                  rx={ring.rx}
                  ry={ring.ry}
                  fill="none"
                  stroke={ring.stroke}
                  strokeWidth="1.2"
                  strokeDasharray="6 8"
                  opacity={ring.opacity}
                  style={{
                    transform: `scale(${pulseScale})`,
                    transformOrigin: '50% 50%',
                    transition: 'transform 0.1s ease-out',
                  }}
                />
              );
            })}

            {/* Center Wormhole Event Horizon Core */}
            <circle cx="50%" cy="50%" r="220" fill="url(#wormholeCenterGlow)" />
          </svg>

          {/* Architectural Subtle Grid */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
              backgroundSize: '100px 100px',
            }}
          />
        </div>

        {/* ========================================================= */}
        {/* TOP HEADER: "OUR PORTFOLIO" (FROM USER REFERENCE SKETCH) */}
        {/* ========================================================= */}
        <div className="relative z-20 w-full px-6 sm:px-10 md:px-16 pt-24 md:pt-28 flex items-center justify-between pointer-events-none">
          {/* Left Sub-heading: Our Portfolio */}
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#008CFF] shadow-[0_0_10px_#008CFF]" />
            <h1 className="text-sm sm:text-base md:text-lg font-display font-bold tracking-[0.22em] uppercase text-white/90">
              Our Portfolio
            </h1>
            <span className="hidden sm:inline text-white/20 font-mono text-xs">//</span>
            <span className="hidden sm:inline text-white/40 font-mono text-xs tracking-[0.18em]">
              3D TIME MACHINE CORRIDOR
            </span>
          </div>

          {/* Right Chapter Counter */}
          <div className="flex items-center gap-2 font-mono text-xs sm:text-sm tracking-[0.2em] text-white/50">
            <span className="text-[#008CFF] font-semibold">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-white/20">/</span>
            <span>{String(totalProjects).padStart(2, '0')}</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN 3D WORKSPACE: ALTERNATING 3D TILE & MATTER LAYOUT     */}
        {/* ========================================================= */}
        <div className="relative z-10 w-full flex-1 flex items-center justify-center px-4 sm:px-8 md:px-14 lg:px-20 pointer-events-none">
          {CLIENT_PROJECTS.map((project, idx) => {
            const delta = scrollUnit - idx; // 0 = active/focused, < 0 = upcoming, > 0 = exiting

            // STRICT "dont keep them before only" RULE:
            // Upcoming reels are strictly hidden and not rendered beforehand!
            if (delta < -1.05 || delta > 1.05) {
              return null;
            }

            // Layout Mode: Alternating based on index
            // Even index (0, 2, 4, 6, 8): 3D Tile on LEFT, Matter on RIGHT (Top Sketch)
            // Odd index (1, 3, 5, 7, 9): Matter on LEFT, 3D Tile on RIGHT (Bottom Sketch)
            const isTileOnLeft = idx % 2 === 0;

            // Target 3D Perspective Angles (Dramatic 3D trapezoidal convergence)
            // Left tile angles inwards towards right: rotateY(+32deg)
            // Right tile angles inwards towards left: rotateY(-32deg)
            const targetRotY = isTileOnLeft ? 32 : -32;

            // 3D Time Machine Dynamic Spatial Trajectory
            let tileTransform = '';
            let matterTransform = '';
            let opacity = 1;

            if (delta < 0) {
              // ------------------------------------------------------------------
              // ENTERING (delta goes from -1 to 0):
              // "Every tile should come from left to right" in 3D through the wormhole!
              // ------------------------------------------------------------------
              const progress = delta + 1; // 0 to 1
              const ease = smoothstep(progress);

              opacity = ease;

              if (isMobile) {
                // Mobile 3D entry: sweeps in from the left with subtle 3D tilt
                const startX = -45 * (1 - ease);
                const currentRotY = targetRotY * 0.5 * ease;
                tileTransform = `translate3d(${startX}vw, 0px, ${-200 * (1 - ease)}px) rotateY(${currentRotY}deg) scale(${
                  0.88 + 0.12 * ease
                })`;
                matterTransform = `translate3d(${(1 - ease) * 25}px, 0px, 0px)`;
              } else {
                // Desktop 3D Time Machine Entry:
                // Reel rushes in from the left and deep in the wormhole (translateZ: -500px -> 0px)!
                const startX = -50 * (1 - ease); // comes from left to right
                const startZ = -550 * (1 - ease); // rushes forward from deep space
                const currentRotY = targetRotY + (1 - ease) * 28; // dramatic uncoiling rotation

                tileTransform = `translate3d(${startX}vw, 0px, ${startZ}px) rotateY(${currentRotY}deg) scale(${
                  0.82 + 0.18 * ease
                })`;

                matterTransform = `translate3d(${(1 - ease) * (isTileOnLeft ? 50 : -50)}px, 0px, 0px)`;
              }
            } else if (delta > 0) {
              // ------------------------------------------------------------------
              // EXITING (delta goes from 0 to 1):
              // Outgoing reel exits to the side into 3D space (as drawn in bottom sketch)
              // ------------------------------------------------------------------
              const progress = delta; // 0 to 1
              const ease = progress * progress;

              opacity = Math.max(0, 1 - progress);

              if (isMobile) {
                const exitX = -35 * ease;
                tileTransform = `translate3d(${exitX}vw, 0px, ${-150 * ease}px) scale(${1 - 0.15 * ease})`;
                matterTransform = `translate3d(${ease * 25}px, 0px, 0px)`;
              } else {
                // Outgoing reel shoots outward towards the side and deep into tunnel
                const exitX = (isTileOnLeft ? -45 : 45) * ease;
                const exitZ = -450 * ease;
                const currentRotY = targetRotY + (isTileOnLeft ? 22 : -22) * ease;

                tileTransform = `translate3d(${exitX}vw, 0px, ${exitZ}px) rotateY(${currentRotY}deg) scale(${
                  1 - 0.22 * ease
                })`;

                matterTransform = `translate3d(${ease * (isTileOnLeft ? 40 : -40)}px, 0px, 0px)`;
              }
            } else {
              // ------------------------------------------------------------------
              // ACTIVE / SETTLED (delta = 0)
              // Locked in dramatic 3D perspective
              // ------------------------------------------------------------------
              opacity = 1;
              if (isMobile) {
                tileTransform = `translate3d(0vw, 0px, 0px) rotateY(${targetRotY * 0.4}deg) scale(1)`;
              } else {
                tileTransform = `translate3d(0vw, 0px, 0px) rotateY(${targetRotY}deg) scale(1)`;
              }
              matterTransform = `translate3d(0px, 0px, 0px)`;
            }

            return (
              <div
                key={project.id}
                className="absolute inset-x-4 sm:inset-x-8 md:inset-x-14 lg:inset-x-20 top-24 sm:top-28 lg:top-32 bottom-20 lg:bottom-24 flex items-center justify-center transition-opacity duration-150"
                style={{
                  opacity,
                  visibility: opacity > 0.01 ? 'visible' : 'hidden',
                  pointerEvents: Math.abs(delta) < 0.25 ? 'auto' : 'none',
                  // Dramatic perspective lens for unmistakable 3D optical depth
                  perspective: isMobile ? '650px' : '820px',
                  perspectiveOrigin: isTileOnLeft ? '35% 50%' : '65% 50%',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Responsive Layout Container */}
                <div
                  className={`w-full max-w-7xl h-full flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-4 sm:gap-6 lg:gap-14 ${
                    isTileOnLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* =================================================== */}
                  {/* 1. 3D VIDEO REEL TILE (ANGLED 3D CINEMA SCREEN)     */}
                  {/* =================================================== */}
                  <div
                    className="w-full lg:w-1/2 flex items-center justify-center shrink-0"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: tileTransform,
                      transition: 'transform 0.04s ease-out',
                    }}
                  >
                    <div
                      className="relative group rounded-2xl overflow-hidden bg-[#070b12] border-2 border-white/20 shadow-2xl"
                      style={{
                        // 58vh desktop, 34vh mobile with breathing room, native 9:16 aspect ratio
                        height: isMobile ? 'min(34vh, 290px)' : 'min(58vh, 520px)',
                        aspectRatio: '9 / 16',
                        // Multi-layer physical 3D drop shadow & electric blue rim glow
                        boxShadow: isTileOnLeft
                          ? '25px 35px 90px -15px rgba(0, 0, 0, 0.95), 0 0 50px -10px rgba(0, 140, 255, 0.35)'
                          : '-25px 35px 90px -15px rgba(0, 0, 0, 0.95), 0 0 50px -10px rgba(0, 140, 255, 0.35)',
                      }}
                    >
                      {/* Razor-thin Electric Blue Outer Rim Highlight */}
                      <div className="absolute inset-0 border border-[#008CFF]/40 rounded-2xl pointer-events-none z-20" />

                      {/* 3D Glass Light Glint Reflection Gradient */}
                      <div
                        className="absolute inset-0 pointer-events-none z-20 rounded-2xl"
                        style={{
                          background: isTileOnLeft
                            ? 'linear-gradient(125deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 40%, transparent 60%)'
                            : 'linear-gradient(235deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 40%, transparent 60%)',
                        }}
                      />

                      {/* Corner Accent Brackets */}
                      <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#008CFF] pointer-events-none z-20" />
                      <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#008CFF] pointer-events-none z-20" />
                      <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#008CFF] pointer-events-none z-20" />
                      <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#008CFF] pointer-events-none z-20" />

                      {/* Chapter Indicator Badge (Clean, No Client Logo) */}
                      <div className="absolute top-3.5 right-3.5 z-20 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 font-mono text-[9px] sm:text-[10px] text-white/80 tracking-widest pointer-events-none flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
                        <span>REEL {String(idx + 1).padStart(2, '0')}</span>
                      </div>

                      {/* Real HTML5 Looping Video Reel (Pure Clean Video, No Watermark Logo) */}
                      <video
                        ref={(el) => (videoRefs.current[idx] = el)}
                        src={project.videoUrl}
                        poster={project.posterUrl}
                        playsInline
                        muted
                        loop
                        preload="metadata"
                        className="w-full h-full object-cover rounded-2xl bg-black"
                      />
                    </div>
                  </div>

                  {/* =================================================== */}
                  {/* 2. MATTER ABOUT THAT CLIENT (EDITORIAL COPY & DATA) */}
                  {/* =================================================== */}
                  <div
                    className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left shrink-0 max-w-xl"
                    style={{
                      transform: matterTransform,
                      transition: 'transform 0.04s ease-out',
                    }}
                  >
                    {/* Category Kicker */}
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-1 sm:mb-2">
                      <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.26em] text-[#008CFF] font-semibold">
                        // {String(idx + 1).padStart(2, '0')} • {project.category}
                      </span>
                      <span className="text-white/20 font-mono text-xs">•</span>
                      <span className="text-[10px] sm:text-xs font-mono text-white/50">
                        {project.year}
                      </span>
                    </div>

                    {/* Big Client Display Title */}
                    <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-white uppercase drop-shadow-md leading-[1.05]">
                      {project.name}
                    </h2>

                    {/* Headline Hook */}
                    <p className="mt-1 sm:mt-2 text-xs sm:text-base md:text-lg font-medium text-white/90 tracking-wide line-clamp-1">
                      {project.headline}
                    </p>

                    {/* In-depth Matter Story Paragraph */}
                    <p className="mt-1.5 sm:mt-2.5 text-[11px] sm:text-sm md:text-[15px] text-white/60 leading-relaxed font-sans line-clamp-2 sm:line-clamp-3">
                      {project.story}
                    </p>

                    {/* Deliverables Chips (Hidden on small mobile) */}
                    {project.deliverables && project.deliverables.length > 0 && (
                      <div className="mt-3 hidden sm:flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2">
                        {project.deliverables.slice(0, 3).map((item, dIdx) => (
                          <span
                            key={dIdx}
                            className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/70"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Impact Metrics Row (Desktop only) */}
                    {project.metrics && project.metrics.length > 0 && (
                      <div className="mt-3.5 hidden sm:grid grid-cols-2 gap-4 max-w-xs pt-2.5 border-t border-white/[0.08]">
                        {project.metrics.map((metric, mIdx) => (
                          <div key={mIdx}>
                            <div className="text-base sm:text-lg font-display font-bold text-white">
                              {metric.value}
                            </div>
                            <div className="text-[10px] font-mono uppercase tracking-wider text-[#008CFF]/90">
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Link */}
                    <div className="mt-3 sm:mt-5 flex items-center justify-center lg:justify-start">
                      <Link
                        to={`/portfolio/${project.slug}`}
                        className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#008CFF]/15 hover:bg-[#008CFF]/25 border border-[#008CFF]/40 hover:border-[#008CFF] text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-white transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(0,140,255,0.15)] hover:shadow-[0_0_30px_rgba(0,140,255,0.3)]"
                      >
                        <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#008CFF]" />
                        <span>VIEW FULL ARCHIVE</span>
                        <ArrowUpRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#008CFF]" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* BOTTOM CONTROLS & TIMELINE TRACKER                        */}
        {/* ========================================================= */}
        <div className="relative z-20 w-full px-6 sm:px-10 md:px-16 pb-5 sm:pb-8 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-auto">
          {/* Scroll Navigation Prompt */}
          <div className="text-[10px] sm:text-[11px] font-mono text-white/35 uppercase tracking-[0.22em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
            <span>SCROLL TO ADVANCE PROJECTS</span>
          </div>

          {/* Interactive Chapter Timeline Ticks */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {CLIENT_PROJECTS.map((proj, pIdx) => {
              const isActive = activeIndex === pIdx;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => scrollToProject(pIdx)}
                  aria-label={`Jump to ${proj.name}`}
                  className="group relative py-1 px-1 focus:outline-none cursor-pointer"
                >
                  <span
                    className={`block transition-all duration-300 rounded-full ${
                      isActive
                        ? 'w-6 sm:w-8 h-1.5 bg-[#008CFF] shadow-[0_0_8px_#008CFF]'
                        : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/50'
                    }`}
                  />
                  {/* Tooltip on Hover */}
                  <span className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap bg-black/90 border border-white/15 px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider text-white">
                    {proj.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Stepper Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={() => scrollToProject(Math.max(0, activeIndex - 1))}
              aria-label="Previous Project"
              className="w-8 h-8 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-white/70 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={activeIndex === totalProjects - 1}
              onClick={() => scrollToProject(Math.min(totalProjects - 1, activeIndex + 1))}
              aria-label="Next Project"
              className="w-8 h-8 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-white/70 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
