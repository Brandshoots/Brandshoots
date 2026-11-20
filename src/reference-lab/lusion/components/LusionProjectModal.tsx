import React, { useEffect, useRef } from 'react';
import { X, ArrowRight, Instagram, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { ClientProject } from '../../../data/clientsData';

interface LusionProjectModalProps {
  project: ClientProject | null;
  onClose: () => void;
  onSelectProject: (project: ClientProject) => void;
  onStartInquiry: (service: string) => void;
  allProjects: ClientProject[];
}

export const LusionProjectModal: React.FC<LusionProjectModalProps> = ({
  project,
  onClose,
  onSelectProject,
  onStartInquiry,
  allProjects,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];
  const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex flex-col justify-between animate-fadeIn">
      {/* Top Bar Navigation */}
      <div className="sticky top-0 left-0 w-full z-30 px-6 md:px-12 py-5 bg-black/60 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#139EF2]" />
          <span className="font-mono text-xs text-white/50 tracking-widest uppercase">
            CASE STUDY // {project.category}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectProject(prevProject)}
            className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.15] border border-white/10 flex items-center justify-center text-white transition-colors"
            title="Previous Project"
            aria-label="Previous Project"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectProject(nextProject)}
            className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.15] border border-white/10 flex items-center justify-center text-white transition-colors"
            title="Next Project"
            aria-label="Next Project"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black hover:bg-neutral-200 font-mono text-xs font-semibold tracking-wider uppercase transition-colors"
          >
            <X className="w-4 h-4" />
            <span>CLOSE</span>
          </button>
        </div>
      </div>

      {/* Main Case Study Body (Lusion Zero Tech Layout) */}
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Spatial Cinema Video Plane */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative rounded-2xl overflow-hidden bg-black border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.9)] aspect-[9/14] sm:aspect-video w-full">
              {/* Corner crosshairs */}
              <div className="absolute top-3 left-3 z-20 font-mono text-white/40 text-xs">+</div>
              <div className="absolute top-3 right-3 z-20 font-mono text-white/40 text-xs">+</div>
              <div className="absolute bottom-3 left-3 z-20 font-mono text-white/40 text-xs">+</div>
              <div className="absolute bottom-3 right-3 z-20 font-mono text-white/40 text-xs">+</div>

              <video
                ref={videoRef}
                src={project.videoUrl}
                poster={project.posterUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {/* Camera Viewfinder Metadata */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-white/50">
              <span>COLOR PROFILE: ACEScc DCI-P3</span>
              <span>LENS: ATLAS ANAMORPHIC 40mm T2</span>
              <span>CLIENT CODE: #{project.slug.toUpperCase()}</span>
            </div>
          </div>

          {/* Right: Technical Project Dossier */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="font-mono text-xs text-[#139EF2] tracking-[0.2em] uppercase mb-2">
                {project.category} • {project.year}
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase mb-4">
                {project.name}
              </h1>
              <p className="text-lg text-white/80 font-light leading-relaxed">
                {project.headline}
              </p>
            </div>

            {/* Performance Metrics */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                {project.metrics.map((m, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-white font-mono">{m.value}</div>
                    <div className="text-[10px] text-white/40 font-mono uppercase tracking-wider">{m.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Challenge & Solution */}
            {project.challenge && (
              <div className="space-y-3">
                <h4 className="font-mono text-xs text-white/50 tracking-widest uppercase">
                  THE PRODUCTION CHALLENGE
                </h4>
                <p className="text-sm text-white/70 font-light leading-relaxed">
                  {project.challenge}
                </p>
              </div>
            )}

            {project.solution && (
              <div className="space-y-3">
                <h4 className="font-mono text-xs text-white/50 tracking-widest uppercase">
                  THE CINEMATOGRAPHIC SOLUTION
                </h4>
                <p className="text-sm text-white/70 font-light leading-relaxed">
                  {project.solution}
                </p>
              </div>
            )}

            {/* Deliverables */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs text-white/50 tracking-widest uppercase">
                COMMISSIONED DELIVERABLES
              </h4>
              <div className="space-y-2">
                {project.deliverables.map((d, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-[#139EF2] shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  onClose();
                  onStartInquiry(`Commercial Production for ${project.name}`);
                }}
                className="w-full py-3.5 rounded-xl bg-[#139EF2] hover:bg-[#0d82ca] text-white font-mono text-xs tracking-widest uppercase font-semibold transition-all shadow-[0_0_25px_rgba(19,158,242,0.3)] flex items-center justify-center gap-2"
              >
                <span>COMMISSION SIMILAR PROJECT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {project.instagramUrl && (
                <a
                  href={project.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-mono text-xs tracking-widest uppercase text-center border border-white/10 flex items-center justify-center gap-2 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#139EF2]" />
                  <span>VIEW ON INSTAGRAM ({project.instagram})</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Next Project Teaser (Lusion #project-details-preview) */}
      <div
        onClick={() => onSelectProject(nextProject)}
        className="w-full py-6 px-6 md:px-12 bg-[#0a0d14] border-t border-white/10 flex items-center justify-between hover:bg-[#101522] transition-colors cursor-pointer group"
      >
        <div>
          <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase block">
            NEXT CASE STUDY //
          </span>
          <span className="text-xl font-bold text-white group-hover:text-[#139EF2] uppercase transition-colors">
            {nextProject.name} — {nextProject.category}
          </span>
        </div>

        <div className="flex items-center gap-3 text-white/60 group-hover:text-white font-mono text-xs tracking-widest uppercase">
          <span className="hidden sm:inline">EXPLORE NEXT</span>
          <ArrowRight className="w-5 h-5 text-[#139EF2] group-hover:translate-x-1.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
