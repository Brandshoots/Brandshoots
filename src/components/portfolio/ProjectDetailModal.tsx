import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ClientProject, ProjectReelItem } from '../../data/clientsData';

interface ProjectDetailModalProps {
  isOpen: boolean;
  project: ClientProject | null;
  onClose: () => void;
}

const WHATSAPP_PHONE = '917075960672';

// Crisp WhatsApp SVG Icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  isOpen,
  project,
  onClose,
}) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Active reel state
  const [activeReelIndex, setActiveReelIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>('0:00');
  const [duration, setDuration] = useState<string>('0:00');

  // Format seconds into mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Reset active reel when project changes
  useEffect(() => {
    if (isOpen) {
      setActiveReelIndex(0);
      setIsPlaying(true);
    }
  }, [isOpen, project]);

  // Handle active video playback & keyboard shortcuts (ESC)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Auto-play active reel on mount/switch
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Fallback: mute & retry
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
      setIsPlaying(true);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, activeReelIndex, onClose]);

  if (!isOpen || !project) return null;

  const currentReelList: ProjectReelItem[] =
    project.reels && project.reels.length > 0
      ? project.reels
      : [
          {
            id: `${project.id}-main`,
            title: 'Main Brand Reel',
            category: project.category,
            duration: '0:30',
            videoUrl: project.videoUrl,
            posterUrl: project.posterUrl,
          },
        ];

  const activeReel: ProjectReelItem =
    currentReelList[activeReelIndex] || currentReelList[0];

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
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

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    if (dur > 0) {
      setProgress((cur / dur) * 100);
      setCurrentTime(formatTime(cur));
      setDuration(formatTime(dur));
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  const handleNativeFullscreen = () => {
    if (videoRef.current && videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleSelectReel = (idx: number) => {
    setActiveReelIndex(idx);
    setIsPlaying(true);
  };

  const handleDiscussProject = () => {
    onClose();
    navigate(`/contact?project=${project.slug}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} Project Showcase`}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-6 md:p-8 overflow-y-auto animate-fadeIn select-none"
      onClick={onClose}
    >
      {/* Background Subtle Volumetric Glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 50% 35%, rgba(0, 140, 255, 0.12) 0%, rgba(2, 3, 6, 0.9) 70%, #020306 100%)',
        }}
      />

      {/* Main Minimal Modal Chassis */}
      <div
        className="relative z-10 w-full max-w-5xl bg-[#07090e] border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(0,140,255,0.18)] overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================= */}
        {/* TOP BAR: MINIMAL BRAND IDENTITY & CLOSE BUTTON             */}
        {/* ========================================================= */}
        <div className="relative z-20 px-5 sm:px-8 py-4 sm:py-5 border-b border-white/10 bg-[#07090e]/95 backdrop-blur-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {project.logoUrl ? (
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/[0.06] border border-white/15 p-2 flex items-center justify-center shrink-0">
                <img
                  src={project.logoUrl}
                  alt={project.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : null}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] sm:text-xs tracking-[0.22em] uppercase text-[#008CFF] font-semibold">
                  {project.category}
                </span>
                <span className="text-white/30 text-xs hidden sm:inline">·</span>
                <span className="font-mono text-[10px] sm:text-xs tracking-widest uppercase text-white/40 hidden sm:inline">
                  {project.year} ARCHIVE
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-display font-black uppercase tracking-tight text-white truncate">
                {project.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Minimal Discuss Button in Header */}
            <button
              type="button"
              onClick={handleDiscussProject}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>DISCUSS PROJECT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Project Modal"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer active:scale-95"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MODAL BODY: MINIMAL 2-COLUMN VIEW (NO DOUBLE SCROLLBAR)   */}
        {/* ========================================================= */}
        <div className="p-5 sm:p-7 md:p-8 flex flex-col lg:flex-row gap-6 lg:gap-10 items-center lg:items-start">
          {/* ======================================================= */}
          {/* LEFT: CINEMA REEL VIEWFINDER (9:16 VERTICAL FRAME)      */}
          {/* ======================================================= */}
          <div className="w-full max-w-[320px] sm:max-w-[340px] shrink-0 flex flex-col gap-3">
            {/* Video Viewfinder */}
            <div className="relative w-full aspect-[9/16] max-h-[500px] rounded-2xl sm:rounded-3xl bg-black border border-white/20 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(0,140,255,0.2)] flex flex-col justify-between group/player">
              {/* Dynamic Island Sensor Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 w-20 h-3 rounded-full bg-black/95 border border-white/15 flex items-center justify-center gap-1.5 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_6px_#008CFF]" />
                <span className="w-1 h-1 rounded-full bg-white/30" />
              </div>

              {/* Viewfinder Registration Corner Marks */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/40 pointer-events-none z-20" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/40 pointer-events-none z-20" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/40 pointer-events-none z-20" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/40 pointer-events-none z-20" />

              {/* Top Tag */}
              <div className="absolute top-0 inset-x-0 z-20 p-4 pt-6 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between pointer-events-none">
                <span className="font-mono text-[9px] tracking-[0.2em] text-[#008CFF] uppercase font-bold truncate pr-2">
                  {activeReel.title}
                </span>
                <span className="font-mono text-[9px] tracking-widest text-white/60 uppercase border border-white/20 px-2 py-0.5 rounded-full bg-black/40 shrink-0">
                  {activeReel.duration || '9:16 4K'}
                </span>
              </div>

              {/* Video Element */}
              <video
                ref={videoRef}
                key={activeReel.videoUrl}
                src={activeReel.videoUrl}
                poster={activeReel.posterUrl}
                playsInline
                autoPlay
                loop
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
              />

              {/* Play Overlay when Paused */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 z-25 flex items-center justify-center bg-black/40 cursor-pointer pointer-events-auto"
                >
                  <div className="w-14 h-14 rounded-full bg-[#008CFF] text-white flex items-center justify-center shadow-[0_0_30px_rgba(0,140,255,0.8)] transform transition-transform hover:scale-110 active:scale-95">
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  </div>
                </div>
              )}

              {/* Bottom Video Controls */}
              <div className="absolute bottom-0 inset-x-0 z-20 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-2 pointer-events-auto">
                {/* Progress bar */}
                <div
                  onClick={handleSeek}
                  className="relative w-full h-1 bg-white/20 hover:h-1.5 rounded-full cursor-pointer transition-all overflow-hidden"
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-[#008CFF] shadow-[0_0_8px_#008CFF] rounded-full transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Buttons and Time */}
                <div className="flex items-center justify-between text-white/90 text-[11px] font-mono">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause className="w-3 h-3 fill-current" />
                      ) : (
                        <Play className="w-3 h-3 fill-current translate-x-0.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                    >
                      {isMuted ? (
                        <VolumeX className="w-3 h-3 text-red-400" />
                      ) : (
                        <Volume2 className="w-3 h-3 text-[#008CFF]" />
                      )}
                    </button>

                    <span className="tracking-widest text-[10px] text-white/70">
                      {currentTime} / {duration}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleNativeFullscreen}
                    aria-label="Fullscreen"
                    className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Multi-Reel Switcher (Clean, Compact, Minimal) */}
            {currentReelList.length > 1 && (
              <div className="pt-1">
                <div className="flex items-center justify-between px-1 mb-1.5 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  <span>Project Reels ({currentReelList.length})</span>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {currentReelList.map((reelItem, rIdx) => {
                    const isCurrent = rIdx === activeReelIndex;
                    return (
                      <button
                        key={reelItem.id}
                        type="button"
                        onClick={() => handleSelectReel(rIdx)}
                        className={`flex-1 py-1.5 px-2.5 rounded-lg border text-left transition-all duration-200 cursor-pointer flex items-center justify-between min-w-0 ${
                          isCurrent
                            ? 'bg-[#008CFF]/20 border-[#008CFF] text-white shadow-[0_0_10px_rgba(0,140,255,0.3)]'
                            : 'bg-white/[0.03] border-white/10 text-white/50 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <span
                          className={`text-[9px] font-mono font-bold ${
                            isCurrent ? 'text-[#008CFF]' : 'text-white/40'
                          }`}
                        >
                          0{rIdx + 1}
                        </span>
                        <span className="text-[11px] font-sans font-medium truncate ml-1.5 flex-1">
                          {reelItem.title}
                        </span>
                        <span className="text-[9px] font-mono text-white/40 ml-1 shrink-0">
                          {reelItem.duration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* RIGHT: PURE EDITORIAL ESSENTIALS (CLEAN & MINIMAL)      */}
          {/* ======================================================= */}
          <div className="flex-1 flex flex-col justify-between py-1 self-stretch">
            <div>
              <span className="block font-mono text-[11px] tracking-[0.24em] uppercase text-[#008CFF] font-semibold mb-2">
                • PROJECT OVERVIEW
              </span>

              {/* Clean Headline */}
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white uppercase tracking-tight leading-tight mb-4">
                {project.headline}
              </h3>

              {/* Concise Story / Synopsis */}
              <p className="text-sm sm:text-base text-white/75 font-sans leading-relaxed mb-6">
                {project.story}
              </p>

              {/* Minimal Deliverable Tags */}
              {project.deliverables && project.deliverables.length > 0 && (
                <div className="mb-6">
                  <span className="block font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase font-semibold mb-2.5">
                    DELIVERABLE SCOPE
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.deliverables.slice(0, 4).map((d) => (
                      <span
                        key={d}
                        className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-white/70 tracking-wider uppercase"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Actions: Primary Button + WhatsApp Link */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-auto">
              <button
                type="button"
                onClick={handleDiscussProject}
                className="py-3 px-6 rounded-full bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs uppercase tracking-[0.18em] font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,140,255,0.4)] active:scale-98 cursor-pointer"
              >
                <span>DISCUSS THIS PROJECT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
                  `Hi BRANDSHOOTS, I watched the ${project.name} commercial film and would like to discuss a similar production.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider text-white/60 hover:text-[#25D366] transition-colors py-2"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Chat on WhatsApp (+91 70759 60672) →</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
