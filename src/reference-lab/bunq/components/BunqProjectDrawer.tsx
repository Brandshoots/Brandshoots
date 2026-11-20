import React, { useEffect, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ClientProject } from '../../../data/clientsData';
import { soundSynth } from './BunqSoundSynth';

interface BunqProjectDrawerProps {
  project: ClientProject | null;
  onClose: () => void;
  onSelectProject: (p: ClientProject) => void;
  onStartInquiry: (service: string) => void;
  allProjects: ClientProject[];
}

export const BunqProjectDrawer: React.FC<BunqProjectDrawerProps> = ({
  project,
  onClose,
  onSelectProject,
  onStartInquiry,
  allProjects,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && project) {
        soundSynth.playWhoosh(220, 80, 0.2);
        onClose();
      }
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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [project]);

  if (!project) return null;

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity duration-300"
        onClick={() => {
          soundSynth.playWhoosh(220, 80, 0.2);
          onClose();
        }}
      />

      {/* Main Case Study Modal / Full Container */}
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[920px] bg-[#05070B] border border-white/10 rounded-2xl shadow-2xl z-10 flex flex-col overflow-hidden m-4">
        {/* Top Sticky Bar */}
        <div className="bg-[#05070B]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tracking-widest text-[#139EF2] uppercase px-2.5 py-1 rounded bg-[#139EF2]/10 border border-[#139EF2]/20">
              CASE STUDY // {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-sm font-semibold tracking-wide text-white/90 font-['Figtree']">
              {project.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onStartInquiry(project.category)}
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#139EF2] hover:bg-[#008CFF] text-white text-xs font-semibold tracking-wider uppercase transition-colors"
            >
              Start Project
              <ArrowRight size={13} />
            </button>
            <button
              onClick={() => {
                soundSynth.playWhoosh(220, 80, 0.2);
                onClose();
              }}
              aria-label="Close project modal"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 space-y-12">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {project.logoUrl && (
                <div className="h-10 px-3 py-1 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                  <img
                    src={project.logoUrl}
                    alt={project.name}
                    className="h-7 w-auto object-contain filter brightness-110"
                  />
                </div>
              )}
              <div className="text-xs font-mono text-white/40 tracking-wider">
                {project.year} • {project.category}
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-['Figtree'] leading-[1.1]">
              {project.headline}
            </h1>

            <p className="text-base sm:text-lg text-white/70 font-['Figtree'] max-w-3xl leading-relaxed">
              {project.story}
            </p>
          </div>

          {/* Stats Bar (BUNQ LABS cs-stats pattern) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 px-6 rounded-xl bg-white/[0.03] border border-white/10 font-mono">
            <div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest">Industry</div>
              <div className="text-xs sm:text-sm text-white font-medium mt-1">
                {project.category}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest">Year Produced</div>
              <div className="text-xs sm:text-sm text-white font-medium mt-1">{project.year}</div>
            </div>
            <div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest">Aspect Ratio</div>
              <div className="text-xs sm:text-sm text-[#139EF2] font-medium mt-1">9:16 Vertical Cine</div>
            </div>
            <div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest">Client Handle</div>
              <a
                href={project.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs sm:text-sm text-white hover:text-[#139EF2] transition-colors font-medium mt-1 inline-block truncate max-w-full"
              >
                {project.instagram || '@wearebrandshoots'}
              </a>
            </div>
          </div>

          {/* Media Showcase: 9:16 Reel Player alongside Challenge & Solution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Reel Video Player (Left 5 Cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-white/20 shadow-[0_0_40px_rgba(0,140,255,0.15)] group">
                <video
                  ref={videoRef}
                  src={project.videoUrl}
                  poster={project.posterUrl}
                  loop
                  playsInline
                  autoPlay
                  muted={isMuted}
                  className="w-full h-full object-cover"
                />

                {/* Video Controls Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between pointer-events-none">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-black/60 text-white/80">
                      CINE 9:16
                    </span>
                    <button
                      onClick={toggleMute}
                      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                      className="pointer-events-auto w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                    >
                      {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause video' : 'Play video'}
                      className="pointer-events-auto px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-mono uppercase flex items-center gap-1.5 transition-colors"
                    >
                      {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                      {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <span className="text-[11px] font-mono text-white/60">DaVinci Graded</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Narrative: Challenge, Solution & Deliverables (Right 7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {project.challenge && (
                <div className="space-y-2 border-l-2 border-[#139EF2]/40 pl-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#139EF2]">
                    THE CHALLENGE
                  </span>
                  <p className="text-sm text-white/80 leading-relaxed font-['Figtree']">
                    {project.challenge}
                  </p>
                </div>
              )}

              {project.solution && (
                <div className="space-y-2 border-l-2 border-white/20 pl-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-white/50">
                    THE PRODUCTION SOLUTION
                  </span>
                  <p className="text-sm text-white/80 leading-relaxed font-['Figtree']">
                    {project.solution}
                  </p>
                </div>
              )}

              {/* Deliverables Checklist */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono uppercase tracking-widest text-white/40 block">
                  VERIFIED DELIVERABLES
                </span>
                <div className="space-y-2">
                  {project.deliverables.map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-white/90 font-['Figtree']"
                    >
                      <CheckCircle2 size={14} className="text-[#139EF2] shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Metrics if present */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-white/40 block mb-2">
                    CAMPAIGN PERFORMANCE
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    {project.metrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-[#139EF2]/5 border border-[#139EF2]/20 text-center"
                      >
                        <div className="text-lg font-bold text-white font-['Figtree']">
                          {m.value}
                        </div>
                        <div className="text-[10px] font-mono text-white/50 uppercase mt-0.5">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Next Project Teaser Footer */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-[11px] font-mono uppercase tracking-widest text-white/40 block">
                Next In Portfolio
              </span>
              <span className="text-lg font-bold text-white font-['Figtree']">
                {nextProject.name} — {nextProject.headline}
              </span>
            </div>

            <button
              onClick={() => {
                soundSynth.playCardTick();
                onSelectProject(nextProject);
              }}
              className="px-5 py-2.5 rounded-full border border-white/20 hover:border-[#139EF2] hover:text-[#139EF2] text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all"
            >
              <span>Explore Next Project</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
