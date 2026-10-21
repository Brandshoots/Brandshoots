import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, ArrowUpRight, Instagram } from 'lucide-react';
import { ClientProject, ProjectReelItem } from '../../data/clientsData';
import { getProjectSocialLink } from '../../data/clientSocialData';

interface ProjectDetailModalProps {
  isOpen: boolean;
  project: ClientProject | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  isOpen,
  project,
  onClose,
}) => {
  const modalRootRef = useRef<HTMLDivElement>(null);
  const modalChassisRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [activeReelIndex, setActiveReelIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Freeze background scrolling (Lenis + Body + Window event isolation)
  useEffect(() => {
    if (!isOpen) return;

    // 1. Freeze Lenis inertial scroll engine
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.stop();
    }

    // 2. Lock body and html overflow
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // 3. Trap wheel and touchmove events inside modal root so they NEVER bubble to window/Lenis
    const handleWheelCapture = (e: WheelEvent) => {
      e.stopPropagation();
    };

    const handleTouchCapture = (e: TouchEvent) => {
      e.stopPropagation();
    };

    const rootEl = modalRootRef.current;
    if (rootEl) {
      rootEl.addEventListener('wheel', handleWheelCapture, { passive: true, capture: true });
      rootEl.addEventListener('touchmove', handleTouchCapture, { passive: true, capture: true });
    }

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      if (lenis) {
        lenis.start();
      }
      if (rootEl) {
        rootEl.removeEventListener('wheel', handleWheelCapture, { capture: true });
        rootEl.removeEventListener('touchmove', handleTouchCapture, { capture: true });
      }
    };
  }, [isOpen]);

  // Clean close handler that stops and mutes the modal video
  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.muted = true;
    }
    onClose();
  };

  // Reset active reel when modal opens or project changes
  useEffect(() => {
    if (isOpen) {
      setActiveReelIndex(0);
      setIsPlaying(true);
    }
  }, [isOpen, project]);

  // Stop video on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.muted = true;
      }
    };
  }, []);

  // ESC key listener to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // If closed or no project, return null
  if (!isOpen || !project) return null;

  // Available reels for this client only - never supplement with other clients
  const clientReels: ProjectReelItem[] =
    project.reels && project.reels.length > 0
      ? project.reels
      : [
          {
            id: `${project.id}-main`,
            title: project.name,
            category: project.category,
            duration: '',
            videoUrl: project.videoUrl,
            posterUrl: project.posterUrl,
          },
        ];

  const currentReel = clientReels[activeReelIndex] || clientReels[0];
  const hasMultipleReels = clientReels.length > 1;
  const socialLink = getProjectSocialLink(project);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleSelectReel = (idx: number) => {
    if (idx === activeReelIndex) return;
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setActiveReelIndex(idx);
    setIsPlaying(true);
  };

  return (
    <div
      ref={modalRootRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-10 select-none animate-fadeIn"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* Blurred & dark backdrop over existing portfolio - no decorative background effects */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-2xl transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Main Case Study Viewer Chassis */}
      <div
        ref={modalChassisRef}
        className="relative z-10 w-full max-w-[880px] lg:max-w-[900px] max-h-[88vh] bg-[#07090e] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-y-auto custom-scrollbar flex flex-col p-5 sm:p-6 lg:p-7"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Top Bar: Close Button */}
        <div className="flex items-center justify-end w-full pb-2 sm:pb-3">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="group flex items-center gap-2 text-white/60 hover:text-white font-sans text-xs tracking-wider transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-white/5"
          >
            <span className="hidden sm:inline">CLOSE</span>
            <X className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
          </button>
        </div>

        {/* Content: Two Columns on Desktop, Clean Single Column on Mobile */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center lg:items-center flex-1 min-h-0">
          
          {/* MOBILE ONLY: Client Title Above Reel */}
          <div className="w-full lg:hidden text-left mb-2">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-2xl font-sans font-black uppercase text-white tracking-tight leading-tight">
                {project.name}
              </h2>
              {socialLink && (
                <a
                  href={socialLink.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${project.name} on Instagram`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-white font-mono text-[10px] font-semibold tracking-wider shrink-0 mt-0.5 active:scale-95 transition-all"
                >
                  <Instagram className="w-3 h-3 text-[#008CFF]" />
                  <span>{socialLink.instagram}</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-white/60" />
                </a>
              )}
            </div>
            {project.headline && (
              <p className="mt-1 text-xs text-white/70 font-sans font-light leading-relaxed">
                {project.headline}
              </p>
            )}
          </div>

          {/* LEFT COLUMN: ONE 9:16 CLIENT REEL (Balanced Sizing) */}
          <div className="w-full max-w-[250px] sm:max-w-[270px] lg:max-w-[285px] xl:max-w-[295px] shrink-0 mx-auto lg:mx-0">
            <div className="relative aspect-[9/16] w-full rounded-2xl bg-black border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center group/player">
              <video
                ref={videoRef}
                key={currentReel.videoUrl}
                src={currentReel.videoUrl}
                poster={currentReel.posterUrl}
                playsInline
                autoPlay
                loop
                muted={isMuted}
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
              />

              {/* Minimal Play/Pause Overlay if paused */}
              {!isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label="Play video"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition-opacity"
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </div>
                </button>
              )}

              {/* Clean Video Controls (Play/Pause, Mute/Unmute) */}
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 pointer-events-auto">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="w-7 h-7 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3 fill-current translate-x-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  className="w-7 h-7 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  {isMuted ? (
                    <VolumeX className="w-3 h-3 text-white/50" />
                  ) : (
                    <Volume2 className="w-3 h-3 text-[#008CFF]" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CLIENT INFORMATION */}
          <div className="flex-1 flex flex-col justify-center w-full text-left min-w-0">
            
            {/* DESKTOP ONLY: Client Title, Headline & Instagram Link */}
            <div className="hidden lg:block mb-3.5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl xl:text-[28px] font-sans font-black uppercase text-white tracking-tight leading-[1.08]">
                  {project.name}
                </h2>
                {socialLink && (
                  <a
                    href={socialLink.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${project.name} on Instagram`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 hover:border-[#008CFF]/60 text-white font-mono text-[11px] font-semibold tracking-wider transition-all duration-200 group/insta shrink-0 active:scale-95 shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                  >
                    <Instagram className="w-3.5 h-3.5 text-[#008CFF] transition-transform group-hover/insta:scale-110" />
                    <span className="text-white/90 group-hover/insta:text-white">{socialLink.instagram}</span>
                    <ArrowUpRight className="w-3 h-3 text-white/50 group-hover/insta:text-white transition-transform group-hover/insta:translate-x-0.5 group-hover/insta:-translate-y-0.5" />
                  </a>
                )}
              </div>
              {project.headline && (
                <p className="mt-1 text-xs xl:text-sm text-white/65 font-sans font-light leading-relaxed">
                  {project.headline}
                </p>
              )}
            </div>

            {/* HOW WE WORKED WITH THEM */}
            <div className="space-y-2.5">
              <h3 className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-[#008CFF]">
                HOW WE WORKED WITH THEM
              </h3>
              <p className="text-xs sm:text-[13px] text-white/80 font-sans font-light leading-relaxed">
                {project.story}
              </p>

              {/* Bullet Points */}
              {project.deliverables && project.deliverables.length > 0 && (
                <ul className="space-y-1 pt-0.5">
                  {project.deliverables.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-white/70 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] mt-1 shrink-0" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* 2-3 Small Tile Badges: ##+ Views, ##+ Followers, ##+ Likes */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="grid grid-cols-3 gap-2 pt-1.5">
                  {project.metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="animate-glow-blink-slow bg-[#008CFF]/[0.03] border border-[#008CFF]/20 rounded-xl py-2 px-2 sm:py-2.5 sm:px-2.5 text-center transition-all duration-300 hover:border-[#008CFF]/45 shadow-[0_0_14px_rgba(0,140,255,0.08)]"
                      style={{ animationDelay: `${idx * 0.28}s` }}
                    >
                      <div className="text-sm sm:text-base lg:text-base font-sans font-medium text-white tracking-tight drop-shadow-[0_0_8px_rgba(0,140,255,0.45)]">
                        {metric.value}
                      </div>
                      <div className="text-[9px] sm:text-[10px] font-sans font-normal uppercase tracking-wider text-white/50 mt-0.5">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* MORE REELS (Only shown if client has multiple reels) */}
            {hasMultipleReels && (
              <div className="mt-3.5 pt-3 border-t border-white/10">
                <h4 className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-white/45 mb-2">
                  MORE REELS
                </h4>

                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  {clientReels.map((reel, idx) => {
                    const isSelected = idx === activeReelIndex;
                    return (
                      <button
                        key={reel.id || reel.videoUrl}
                        type="button"
                        onClick={() => handleSelectReel(idx)}
                        className={`group relative w-[64px] sm:w-[72px] aspect-[9/16] rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer bg-[#0c101a] shrink-0 ${
                          isSelected
                            ? 'border-[#008CFF] ring-2 ring-[#008CFF]/50'
                            : 'border-white/10 hover:border-white/40 opacity-75 hover:opacity-100'
                        }`}
                      >
                        {/* Fallback label behind image */}
                        <div className="absolute inset-0 bg-[#0c101a] flex items-center justify-center p-1.5 text-center pointer-events-none">
                          <span className="text-[9px] font-sans text-white/40 leading-tight">
                            {reel.title || `Reel 0${idx + 1}`}
                          </span>
                        </div>

                        {/* Poster preview image only - no heavy video decoding */}
                        <img
                          src={reel.posterUrl}
                          alt=""
                          className="relative z-10 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
