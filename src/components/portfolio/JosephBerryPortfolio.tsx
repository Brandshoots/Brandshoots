import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CLIENT_PROJECTS, ClientProject } from '../../data/clientsData';
import { ArrowUpRight, Play, Maximize2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { FullScreenReelModal } from './FullScreenReelModal';

gsap.registerPlugin(ScrollTrigger);

// Curated 6 premier cinematic projects for the main sequential showcase
const FEATURED_PROJECTS: ClientProject[] = CLIENT_PROJECTS.slice(0, 6);

export const JosephBerryPortfolio: React.FC = () => {
  const navigate = useNavigate();

  // DOM Refs
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const mediaStageRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [selectedModalProject, setSelectedModalProject] = useState<ClientProject | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [hoveredDrawerIndex, setHoveredDrawerIndex] = useState<number | null>(null);

  // Mouse tilt tracking
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Sync scroll to project index helper
  const navigateToProject = useCallback((index: number) => {
    const pinWrapper = pinWrapperRef.current;
    if (!pinWrapper) return;
    const clampedIndex = Math.max(0, Math.min(FEATURED_PROJECTS.length - 1, index));
    const totalScroll = pinWrapper.offsetHeight - window.innerHeight;
    const targetScroll =
      pinWrapper.offsetTop + (clampedIndex / (FEATURED_PROJECTS.length - 1)) * totalScroll;

    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(targetScroll, { duration: 0.95 });
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }, []);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDrawerOpen) {
        if (e.key === 'Escape') setIsDrawerOpen(false);
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (currentIndex < FEATURED_PROJECTS.length - 1) {
          navigateToProject(currentIndex + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          navigateToProject(currentIndex - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isDrawerOpen, navigateToProject]);

  // Mouse tilt calculation
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const nx = (clientX / innerWidth - 0.5) * 2; // -1 to 1
    const ny = (clientY / innerHeight - 0.5) * 2; // -1 to 1
    setTilt({ x: nx * 4.5, y: -ny * 4.5 });
  }, []);

  // GSAP ScrollTrigger timeline pinning & synchronization
  useEffect(() => {
    const pinWrapper = pinWrapperRef.current;
    const viewport = viewportRef.current;
    if (!pinWrapper || !viewport) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: pinWrapper,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;
          setScrollProgress(p);

          // Calculate active project segment
          const segmentSize = 1 / FEATURED_PROJECTS.length;
          const calculatedIndex = Math.min(
            FEATURED_PROJECTS.length - 1,
            Math.max(0, Math.floor(p / segmentSize))
          );
          setCurrentIndex(calculatedIndex);
        },
      });

      return () => {
        st.kill();
      };
    }, pinWrapper);

    return () => ctx.revert();
  }, []);

  // Play only active video, pause inactive for peak performance & battery savings
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIndex) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, [currentIndex]);

  // Smooth editorial title transition on index change
  useEffect(() => {
    const titleEl = titleContainerRef.current;
    if (!titleEl) return;
    gsap.fromTo(
      titleEl.children,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', stagger: 0.05 }
    );
  }, [currentIndex]);

  const activeProject = FEATURED_PROJECTS[currentIndex] || FEATURED_PROJECTS[0];

  return (
    <>
      {/* ========================================================= */}
      {/* 1. MASTER TALL SCROLL TRACK (Pins 100vh Viewport)          */}
      {/* ========================================================= */}
      <div
        ref={pinWrapperRef}
        className="relative w-full"
        style={{ height: `${FEATURED_PROJECTS.length * 100}vh` }}
      >
        {/* Fixed 100vh Sticky Viewport Presentation */}
        <div
          ref={viewportRef}
          onMouseMove={handleMouseMove}
          className="sticky top-0 w-full h-[100svh] min-h-[100svh] max-h-[100svh] bg-[#020306] text-white overflow-hidden select-none flex flex-col justify-between"
        >
          {/* ======================================================= */}
          {/* A. ATMOSPHERIC BACKGROUND LAYERS                        */}
          {/* ======================================================= */}
          {/* Architectural Blueprint Grid Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,140,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,140,255,0.4) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />

          {/* Deep Volumetric BrandShoots Electric Blue Center Aura */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] lg:w-[900px] h-[550px] lg:h-[750px] rounded-full pointer-events-none opacity-25 blur-[140px]"
            style={{
              background: 'radial-gradient(circle, #008CFF 0%, rgba(0,140,255,0.2) 50%, transparent 80%)',
            }}
          />

          {/* Joseph Berry Outlined Ghost Typography Watermark */}
          <div
            className="absolute top-[42%] left-0 w-full pointer-events-none -translate-y-1/2 overflow-hidden whitespace-nowrap will-change-transform opacity-[0.06] select-none"
            style={{
              transform: `translate3d(${scrollProgress * -280}px, -50%, 0)`,
            }}
          >
            <span
              className="font-display font-black text-[15vw] tracking-[-0.03em] uppercase block"
              style={{
                WebkitTextStroke: '1.5px rgba(255,255,255,0.7)',
                color: 'transparent',
              }}
            >
              BRANDSHOOTS // PORTFOLIO ARCHIVE // 4K CINEMA // MASTER CUTS //
            </span>
          </div>

          {/* ======================================================= */}
          {/* B. TOP SUB-HEADER HUD: METADATA & CHAPTER SPECS        */}
          {/* ======================================================= */}
          <div className="relative z-20 w-full pt-20 sm:pt-24 px-6 sm:px-12 flex items-center justify-between pointer-events-none">
            {/* Left: Active Project Category & Timeline */}
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#008CFF] shadow-[0_0_10px_#008CFF] animate-pulse" />
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.34em] uppercase text-white/60 font-semibold">
                0{currentIndex + 1} // {activeProject.category} // {activeProject.year}
              </span>
            </div>

            {/* Right: Technical Resolution Specs */}
            <div className="hidden sm:flex items-center gap-4 text-white/40 font-mono text-[10px] tracking-[0.28em] uppercase">
              <span>9:16 VERTICAL CINEMA</span>
              <span>•</span>
              <span className="text-[#008CFF]/80">4K PRORES 422 HQ</span>
            </div>
          </div>

          {/* ======================================================= */}
          {/* C. CENTER STAGE: DOMINANT MEDIA + EDITORIAL COPY        */}
          {/* ======================================================= */}
          <div className="relative z-20 flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 lg:gap-12 py-2">
            
            {/* 1. LEFT COLUMN: DOMINANT EDITORIAL TYPOGRAPHY */}
            <div
              ref={titleContainerRef}
              className="w-full md:w-[48%] lg:w-[45%] flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1"
            >
              {/* Category Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 mb-3 sm:mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
                <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.24em] uppercase text-white/70 font-medium">
                  {activeProject.category}
                </span>
              </div>

              {/* Massive Editorial Project Title */}
              <div className="overflow-hidden">
                <h2 className="font-display font-black text-[clamp(2.3rem,5.2vw,5.2rem)] leading-[0.92] tracking-[-0.035em] uppercase text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                  {activeProject.name}
                </h2>
              </div>

              {/* Sub-Headline Story Hook */}
              <p className="mt-3 sm:mt-4 text-white/70 font-sans text-xs sm:text-sm lg:text-base leading-relaxed max-w-md font-normal line-clamp-2 sm:line-clamp-3">
                {activeProject.headline}
              </p>

              {/* Deliverables Tags */}
              <div className="mt-4 hidden sm:flex flex-wrap items-center gap-2">
                {activeProject.deliverables.slice(0, 3).map((item, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-[9px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-white/60"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* Primary Call-to-Actions */}
              <div className="mt-5 sm:mt-7 flex items-center gap-3 sm:gap-4">
                {/* Explore Case Study Page */}
                <button
                  type="button"
                  onClick={() => navigate(`/projects/${activeProject.slug}`)}
                  className="group inline-flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#008CFF] hover:bg-[#007fe6] text-white font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] transition-all duration-200 active:scale-95 shadow-[0_4px_24px_rgba(0,140,255,0.4)] cursor-pointer"
                >
                  <span>EXPLORE PROJECT</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>

                {/* Watch Fullscreen Reel Modal */}
                <button
                  type="button"
                  onClick={() => setSelectedModalProject(activeProject)}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white/90 hover:text-white font-sans text-xs sm:text-sm font-medium uppercase tracking-[0.16em] transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-[#008CFF]" />
                  <span>PLAY REEL</span>
                </button>
              </div>
            </div>

            {/* 2. RIGHT COLUMN: LARGE DOMINANT CINEMATIC MEDIA STAGE */}
            <div
              ref={mediaStageRef}
              className="w-full md:w-[50%] lg:w-[48%] flex items-center justify-center relative order-1 md:order-2"
              style={{
                perspective: '1200px',
              }}
            >
              {/* Stacked Interactive Cinema Frame Stage */}
              <div
                className="relative w-[280px] xs:w-[310px] sm:w-[350px] md:w-[360px] lg:w-[410px] xl:w-[440px] h-[48vh] sm:h-[54vh] md:h-[64vh] lg:h-[70vh] transition-transform duration-300 ease-out will-change-transform"
                style={{
                  transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                }}
              >
                {/* Render All Featured Projects (Active = scale 1, opacity 1, Inactive = scale 0.94, opacity 0) */}
                {FEATURED_PROJECTS.map((proj, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <div
                      key={proj.id}
                      className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isActive
                          ? 'opacity-100 scale-100 pointer-events-auto z-10'
                          : 'opacity-0 scale-95 pointer-events-none z-0'
                      }`}
                    >
                      {/* Primary Titanium Cinema Frame with Razor-Thin Blue Bevel */}
                      <div
                        onClick={() => setSelectedModalProject(proj)}
                        className="relative w-full h-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#07090E] border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(0,140,255,0.18)] cursor-pointer group"
                      >
                        {/* High-Bitrate Reel Video */}
                        <video
                          ref={(el) => {
                            videoRefs.current[idx] = el;
                          }}
                          src={proj.videoUrl}
                          poster={proj.posterUrl}
                          loop
                          muted
                          playsInline
                          preload={idx <= 1 ? 'auto' : 'metadata'}
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                        />

                        {/* Liquid Glass Perimeter Sheen */}
                        <div className="absolute inset-0 rounded-[24px] sm:rounded-[32px] ring-1 ring-inset ring-white/20 pointer-events-none" />

                        {/* Top Gradient Shadow */}
                        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#020306]/85 via-transparent to-transparent pointer-events-none" />

                        {/* Bottom Gradient Shadow for Reel Watermark & Title */}
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#020306]/90 via-[#020306]/40 to-transparent pointer-events-none" />

                        {/* Top Left Viewfinder Indicator Badge */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/80 font-mono text-[9px] tracking-[0.2em] uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] animate-pulse" />
                          <span>REEL 0{idx + 1}</span>
                        </div>

                        {/* Hover Overlay: "WATCH FULLSCREEN REEL" Center Plaque */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/35 backdrop-blur-[2px]">
                          <div className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full bg-[#008CFF] text-white font-sans text-xs font-bold uppercase tracking-[0.16em] shadow-[0_4px_24px_rgba(0,140,255,0.7)] transform scale-90 group-hover:scale-100 transition-transform duration-300">
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>WATCH FULLSCREEN</span>
                          </div>
                        </div>

                        {/* Bottom Bar: Client Name inside Frame */}
                        <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-white/90">
                          <span className="font-figtree font-bold text-sm tracking-wide">
                            {proj.name}
                          </span>
                          <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                            <Maximize2 className="w-3.5 h-3.5 text-white/80" />
                          </span>
                        </div>
                      </div>

                      {/* Secondary Floating Cinematic Plaque (Joseph Berry Layered Technique) */}
                      <div
                        className="hidden lg:flex absolute -bottom-5 -right-8 w-56 p-4 rounded-2xl bg-[#080B12]/90 backdrop-blur-xl border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex-col gap-2 pointer-events-none z-20"
                        style={{
                          transform: `translate3d(${tilt.x * 1.5}px, ${tilt.y * 1.5}px, 30px)`,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/50">
                            KEY METRIC
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
                        </div>
                        {proj.metrics && proj.metrics[0] ? (
                          <div className="flex items-baseline justify-between">
                            <span className="text-xl font-bold font-figtree text-[#008CFF]">
                              {proj.metrics[0].value}
                            </span>
                            <span className="font-mono text-[9px] uppercase tracking-wider text-white/70">
                              {proj.metrics[0].label}
                            </span>
                          </div>
                        ) : (
                          <div className="text-xs font-semibold text-white/80">
                            High Velocity Production
                          </div>
                        )}
                        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-white/40 tracking-wider">
                          <span>AUDIO: DOLBY 5.1</span>
                          <span>MASTER CUT</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ======================================================= */}
          {/* D. BOTTOM CONTROLS & PROJECT SWITCHER DOCK              */}
          {/* ======================================================= */}
          <div className="relative z-30 w-full px-6 sm:px-12 pb-5 sm:pb-8 flex items-end justify-between border-t border-white/[0.08] pt-4">
            
            {/* 1. Left: Sequential Project Switcher Rail (01 — 06) */}
            <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-none py-1">
              {FEATURED_PROJECTS.map((proj, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => navigateToProject(idx)}
                    className={`group relative flex items-center gap-2 text-left cursor-pointer transition-all duration-300 shrink-0 select-none pb-1 ${
                      isActive ? 'text-white' : 'text-white/40 hover:text-white/80'
                    }`}
                  >
                    <span
                      className={`font-mono text-xs transition-colors duration-200 ${
                        isActive ? 'text-[#008CFF] font-bold' : 'text-white/40 group-hover:text-white'
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <span className="font-sans text-xs sm:text-[13px] tracking-[0.14em] uppercase font-semibold">
                      {proj.name}
                    </span>

                    {/* Active Bottom Glow Indicator */}
                    {isActive && (
                      <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[#008CFF] shadow-[0_0_10px_#008CFF] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* 2. Right: Joseph Berry Vertical Progress Bar & All Projects Drawer Button */}
            <div className="flex items-center gap-5 sm:gap-8 shrink-0">
              
              {/* Joseph Berry Minimal Counter & Vertical Progression Bar */}
              <div className="hidden sm:flex items-center gap-3 select-none">
                <span className="font-mono text-xs font-bold text-[#008CFF]">
                  0{currentIndex + 1}
                </span>

                {/* Vertical Progress Bar */}
                <div className="relative w-[3px] h-8 sm:h-10 bg-white/15 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 inset-x-0 bg-[#008CFF] shadow-[0_0_8px_#008CFF] rounded-full transition-all duration-300"
                    style={{
                      height: `${((currentIndex + 1) / FEATURED_PROJECTS.length) * 100}%`,
                    }}
                  />
                </div>

                <span className="font-mono text-xs font-medium text-white/40">
                  0{FEATURED_PROJECTS.length}
                </span>
              </div>

              {/* All Projects Drawer Opener Button */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white/90 hover:text-white font-mono text-[11px] sm:text-xs tracking-[0.18em] uppercase transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <span>ALL PROJECTS ({CLIENT_PROJECTS.length})</span>
                <span className="text-[#008CFF]">↗</span>
              </button>
            </div>

          </div>

          {/* ======================================================= */}
          {/* E. MOBILE PREV / NEXT SWIPE CONTROLS                    */}
          {/* ======================================================= */}
          <div className="md:hidden absolute top-1/2 inset-x-2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-30">
            <button
              type="button"
              onClick={() => navigateToProject(currentIndex - 1)}
              disabled={currentIndex === 0}
              aria-label="Previous Project"
              className={`w-9 h-9 rounded-full bg-black/60 border border-white/15 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto transition-opacity ${
                currentIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'opacity-80 active:scale-95'
              }`}
            >
              <ChevronUp className="w-4 h-4 -rotate-90" />
            </button>
            <button
              type="button"
              onClick={() => navigateToProject(currentIndex + 1)}
              disabled={currentIndex === FEATURED_PROJECTS.length - 1}
              aria-label="Next Project"
              className={`w-9 h-9 rounded-full bg-black/60 border border-white/15 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto transition-opacity ${
                currentIndex === FEATURED_PROJECTS.length - 1
                  ? 'opacity-20 cursor-not-allowed'
                  : 'opacity-80 active:scale-95'
              }`}
            >
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. JOSEPH BERRY "ALL PROJECTS" CINEMATIC INDEX DRAWER      */}
      {/* ========================================================= */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[150] flex flex-col justify-between bg-[#030508]/96 backdrop-blur-3xl text-white px-6 sm:px-14 py-8 animate-in fade-in duration-300">
          
          {/* Drawer Header */}
          <div className="w-full flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#008CFF] shadow-[0_0_12px_#008CFF]" />
              <span className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-white/70">
                COMPLETE PORTFOLIO ARCHIVE ({CLIENT_PROJECTS.length})
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Drawer Body: Full Project List with Hover Previews */}
          <div className="relative flex-1 w-full flex items-center justify-between my-auto py-8">
            
            {/* Project List */}
            <div className="w-full lg:w-3/5 flex flex-col gap-3 sm:gap-4 max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin">
              {CLIENT_PROJECTS.map((proj, idx) => (
                <div
                  key={proj.id}
                  onMouseEnter={() => setHoveredDrawerIndex(idx)}
                  onMouseLeave={() => setHoveredDrawerIndex(null)}
                  onClick={() => {
                    setIsDrawerOpen(false);
                    // If in featured list, scroll to it; otherwise navigate to project case study page
                    const featuredIdx = FEATURED_PROJECTS.findIndex((p) => p.id === proj.id);
                    if (featuredIdx !== -1) {
                      navigateToProject(featuredIdx);
                    } else {
                      navigate(`/projects/${proj.slug}`);
                    }
                  }}
                  className="group flex items-baseline justify-between p-3.5 sm:p-4 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/10 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    <span className="font-mono text-xs text-white/40 group-hover:text-[#008CFF] transition-colors">
                      {idx < 9 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span className="font-display font-bold text-xl sm:text-2xl md:text-3xl uppercase tracking-tight text-white/80 group-hover:text-white transition-colors">
                      {proj.name}
                    </span>
                  </div>

                  <div className="hidden sm:flex items-center gap-4 text-white/40 font-mono text-[10px] tracking-widest uppercase">
                    <span>{proj.category}</span>
                    <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-[#008CFF] transition-colors" />
                  </div>
                </div>
              ))}
            </div>

            {/* Hover Floating Poster Preview Stage (Desktop Only) */}
            <div className="hidden lg:flex w-2/5 items-center justify-center pointer-events-none pl-12">
              <div className="relative w-[280px] h-[480px] rounded-2xl overflow-hidden bg-[#07090E] border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.95)]">
                {CLIENT_PROJECTS.map((proj, idx) => {
                  const isHovered = hoveredDrawerIndex === idx;
                  return (
                    <img
                      key={proj.id}
                      src={proj.posterUrl}
                      alt={proj.name}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                    />
                  );
                })}
                {hoveredDrawerIndex === null && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white/30 font-mono text-xs uppercase tracking-widest">
                    <span>HOVER PROJECT TO PREVIEW</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Drawer Footer */}
          <div className="w-full pt-4 border-t border-white/10 flex items-center justify-between text-white/40 font-mono text-[10px] tracking-widest uppercase">
            <span>BRANDSHOOTS PRODUCTION HOUSE</span>
            <span>PRESS ESC TO CLOSE</span>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 3. FULLSCREEN REEL MODAL WITH UNMUTED AUDIO               */}
      {/* ========================================================= */}
      <FullScreenReelModal
        isOpen={Boolean(selectedModalProject)}
        project={selectedModalProject}
        onClose={() => setSelectedModalProject(null)}
      />
    </>
  );
};

export default JosephBerryPortfolio;
