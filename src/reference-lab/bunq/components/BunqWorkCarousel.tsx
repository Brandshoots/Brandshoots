import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Maximize2, Play } from 'lucide-react';
import { ClientProject } from '../../../data/clientsData';
import { soundSynth } from './BunqSoundSynth';

interface BunqWorkCarouselProps {
  projects: ClientProject[];
  onSelectProject: (p: ClientProject) => void;
}

export const BunqWorkCarousel: React.FC<BunqWorkCarouselProps> = ({
  projects,
  onSelectProject,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragDeltaX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeProject = projects[activeIndex] || projects[0];

  // Specific aesthetic accent glow colors for each client
  const clientAuras: Record<string, string> = {
    'santhi-pipes': 'rgba(19, 158, 242, 0.28)',
    'viswatuff-glass': 'rgba(0, 140, 255, 0.32)',
    'bags-world': 'rgba(235, 94, 40, 0.24)',
    'aabharan-jewellers': 'rgba(230, 175, 46, 0.28)',
    'sahana-dry-fruits': 'rgba(224, 122, 95, 0.25)',
    'tea3-cafe': 'rgba(74, 187, 137, 0.26)',
    'dayanidhi-interiors': 'rgba(176, 137, 104, 0.28)',
    'jain-beauty-studio': 'rgba(224, 86, 160, 0.28)',
    'sb-ventures': 'rgba(80, 140, 240, 0.28)',
    'kc-overseas': 'rgba(100, 200, 230, 0.25)',
    'playzone-entertainment': 'rgba(240, 90, 70, 0.28)',
    'adv-leela-srinivas': 'rgba(150, 150, 170, 0.25)',
  };

  const currentAura = clientAuras[activeProject?.slug] || 'rgba(19, 158, 242, 0.25)';

  const nextProject = useCallback(() => {
    soundSynth.playCardTick();
    setActiveIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const prevProject = useCallback(() => {
    soundSynth.playCardTick();
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextProject();
      if (e.key === 'ArrowLeft') prevProject();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextProject, prevProject]);

  // Pointer drag handling
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragDeltaX.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    dragDeltaX.current = e.clientX - dragStartX.current;
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDeltaX.current < -50) {
      nextProject();
    } else if (dragDeltaX.current > 50) {
      prevProject();
    }
  };

  // Wheel scrubbing with threshold
  const lastWheelTime = useRef(0);
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 260) return;
    if (Math.abs(e.deltaX) > 30 || Math.abs(e.deltaY) > 50) {
      if (e.deltaX > 30 || e.deltaY > 50) {
        nextProject();
        lastWheelTime.current = now;
      } else if (e.deltaX < -30 || e.deltaY < -50) {
        prevProject();
        lastWheelTime.current = now;
      }
    }
  };

  return (
    <section
      id="work"
      className="relative w-full min-h-screen py-24 bg-[#04060A] text-white overflow-hidden select-none flex flex-col justify-between"
      onWheel={handleWheel}
    >
      {/* Dynamic Background Radial Aura (Lerping client brand color) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-60"
        style={{ background: currentAura }}
      />

      {/* Grid line texture overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Section Header */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#139EF2] mb-3">
            <span>[ + ]</span>
            <span>SELECTED CLIENT COMMISSIONS</span>
            <span className="w-8 h-[1px] bg-[#139EF2]/40" />
            <span>2026 REEL ARCHIVE</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-['Figtree'] leading-[0.95]">
            Featured Work
          </h2>
        </div>

        {/* Carousel Control Buttons & Keyboard Telemetry */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-white/40">
            <span>Drag, scroll, or use</span>
            <span className="px-1.5 py-0.5 rounded border border-white/20 text-white/80">←</span>
            <span className="px-1.5 py-0.5 rounded border border-white/20 text-white/80">→</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevProject}
              aria-label="Previous Project"
              className="w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-[#139EF2] hover:border-[#139EF2] hover:text-white flex items-center justify-center transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={nextProject}
              aria-label="Next Project"
              className="w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-[#139EF2] hover:border-[#139EF2] hover:text-white flex items-center justify-center transition-all"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Cylindrical Perspective Carousel Stage */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-full h-[520px] sm:h-[580px] my-6 flex items-center justify-center perspective-[1200px] cursor-grab active:cursor-grabbing z-10"
      >
        <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
          {projects.map((project, idx) => {
            const total = projects.length;
            // Calculate signed distance along loop
            let offset = (idx - activeIndex + total) % total;
            if (offset > total / 2) offset -= total;

            const isCenter = offset === 0;
            const isVisible = Math.abs(offset) <= 3;

            if (!isVisible) return null;

            // Mathematical 3D Transform based on BUNQ LABS stage model:
            // turn: 28deg * sign, back: -80px * abs, scale: 1 - 0.16 * abs
            const rotateY = offset * -28;
            const translateX = offset * (window.innerWidth < 640 ? 160 : 280);
            const translateZ = -Math.abs(offset) * 90;
            const scale = Math.max(0.68, 1 - Math.abs(offset) * 0.14);
            const opacity = Math.max(0.2, 1 - Math.abs(offset) * 0.32);
            const zIndex = 20 - Math.abs(offset);

            return (
              <div
                key={project.id}
                onClick={() => {
                  if (isCenter) {
                    soundSynth.playWhoosh(350, 120, 0.25);
                    onSelectProject(project);
                  } else {
                    soundSynth.playCardTick();
                    setActiveIndex(idx);
                  }
                }}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: isDragging
                    ? 'none'
                    : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease',
                }}
                className={`absolute w-[240px] sm:w-[280px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl transition-all cursor-pointer group ${
                  isCenter
                    ? 'ring-2 ring-[#139EF2] shadow-[0_0_50px_rgba(19,158,242,0.35)]'
                    : 'border border-white/10 hover:border-white/30'
                }`}
              >
                {/* Background Poster Image */}
                <img
                  src={project.posterUrl}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Ambient vignette and bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />

                {/* Card Top Pill: Category */}
                <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10">
                  <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded bg-black/70 backdrop-blur-md text-white/90 border border-white/10">
                    {project.category}
                  </span>
                  <span className="text-[11px] font-mono text-[#139EF2] font-bold">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Card Center: Quick Play/Open Prompt */}
                {isCenter && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                    <div className="w-14 h-14 rounded-full bg-[#139EF2] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play size={20} className="ml-1" />
                    </div>
                  </div>
                )}

                {/* Card Bottom Meta */}
                <div className="absolute bottom-4 inset-x-4 space-y-1.5 z-10">
                  {project.logoUrl && (
                    <div className="h-6 flex items-center mb-1">
                      <img
                        src={project.logoUrl}
                        alt={project.name}
                        className="h-5 w-auto object-contain filter brightness-125"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-white font-['Figtree'] leading-tight">
                    {project.name}
                  </h3>
                  <p className="text-xs text-white/70 line-clamp-2 font-['Figtree']">
                    {project.headline}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Workbar HUD (BUNQ LABS Signature Workbar) */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 w-full z-10">
        <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Active Project Meta & Slide-Up Counter */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-[#139EF2] uppercase tracking-widest">
                PROJECT NUMBER
              </span>
              <div className="text-2xl font-black font-mono text-white tracking-wider flex items-center gap-1">
                <span>{String(activeIndex + 1).padStart(2, '0')}</span>
                <span className="text-white/30 text-lg">/</span>
                <span className="text-white/40 text-lg">{String(projects.length).padStart(2, '0')}</span>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-white/10" />

            <div>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                ACTIVE SHOWCASE
              </span>
              <div className="text-base sm:text-lg font-bold text-white font-['Figtree']">
                {activeProject.name} — <span className="text-[#139EF2]">{activeProject.headline}</span>
              </div>
            </div>
          </div>

          {/* Open Project Action */}
          <button
            onClick={() => {
              soundSynth.playWhoosh(350, 120, 0.25);
              onSelectProject(activeProject);
            }}
            className="w-full md:w-auto px-6 py-3 rounded-full bg-[#139EF2] hover:bg-[#008CFF] text-white font-semibold text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(19,158,242,0.35)]"
          >
            <span>Open Case Study & Reels</span>
            <Maximize2 size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};
