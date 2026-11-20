import React, { useRef, useState, useEffect } from 'react';
import { ClientProject } from '../../../data/clientsData';

interface WithMediaCaseDrawerProps {
  project: ClientProject | null;
  onClose: () => void;
  onStartInquiry: (serviceName?: string) => void;
}

export const WithMediaCaseDrawer: React.FC<WithMediaCaseDrawerProps> = ({
  project,
  onClose,
  onStartInquiry,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/85 backdrop-blur-md transition-all">
      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative z-10 w-full max-w-3xl h-full bg-[#05070B] border-l border-white/[0.1] shadow-2xl flex flex-col justify-between overflow-y-auto">
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#05070B]/90 backdrop-blur-md border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            {project.logoUrl && (
              <img
                src={project.logoUrl}
                alt={project.name}
                className="h-8 max-w-[120px] object-contain filter brightness-0 invert opacity-80"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            )}
            <div className="flex flex-col">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400">
                Case Study // {project.category}
              </span>
              <h3 className="text-lg font-black uppercase text-white tracking-tight">
                {project.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/[0.05] border border-white/[0.1] text-slate-300 hover:text-white hover:border-blue-400 transition-all"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Main Reel Player with Sound Control */}
          <div className="relative w-full aspect-[9/16] max-h-[520px] mx-auto rounded-2xl overflow-hidden bg-black border border-white/[0.1] shadow-2xl">
            <video
              ref={videoRef}
              src={project.videoUrl}
              poster={project.posterUrl}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              className="w-full h-full object-contain"
            />
            {/* Audio Toggle Pill */}
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.muted = !videoRef.current.muted;
                  setIsMuted(videoRef.current.muted);
                }
              }}
              className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs text-white font-mono flex items-center gap-1.5 hover:bg-black/90 transition-all"
            >
              <span>{isMuted ? '🔇 Unmute' : '🔊 Sound On'}</span>
            </button>
          </div>

          {/* Headline & Narrative Story */}
          <div>
            <h4 className="text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-tight mb-3">
              {project.headline}
            </h4>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {project.story}
            </p>
          </div>

          {/* Challenge & Solution Grid */}
          {(project.challenge || project.solution) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.challenge && (
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-red-400 block mb-2">
                    // The Challenge
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {project.challenge}
                  </p>
                </div>
              )}
              {project.solution && (
                <div className="p-5 rounded-xl bg-blue-950/20 border border-blue-500/20">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-blue-400 block mb-2">
                    // The Engineering Solution
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Verified Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.08]">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 block mb-4">
                Verified Audience Impact
              </span>
              <div className="grid grid-cols-3 gap-4">
                {project.metrics.map((m, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                      {m.value}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider text-slate-400">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deliverables Checklist */}
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 block mb-3">
              Scope & Deliverables Executed
            </span>
            <ul className="space-y-2.5">
              {project.deliverables.map((del, dIdx) => (
                <li key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span>{del}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instagram Link if available */}
          {project.instagramUrl && (
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Client Handle:</span>
              <a
                href={project.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>{project.instagram || '@client'}</span>
                <span>↗</span>
              </a>
            </div>
          )}
        </div>

        {/* Drawer Bottom Action Band */}
        <div className="sticky bottom-0 z-20 p-6 bg-[#05070B]/95 backdrop-blur-md border-t border-white/[0.08] flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Want Similar Results?</span>
            <span className="text-sm font-bold text-white uppercase">{project.category}</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onStartInquiry(`Project inspired by ${project.name}`);
            }}
            className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all"
          >
            Commission Similar Shoot →
          </button>
        </div>
      </div>
    </div>
  );
};
