import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, ArrowUpRight, Film, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ClientProject, ProjectReelItem } from '../../data/clientsData';

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
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Active reel being played in theater
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
        // Fallback for strict browser autoplay: mute & retry
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

  const currentReelList: ProjectReelItem[] = project.reels && project.reels.length > 0
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

  const activeReel: ProjectReelItem = currentReelList[activeReelIndex] || currentReelList[0];

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
      aria-label={`${project.name} Project Showcase & Reels`}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/92 backdrop-blur-2xl p-3 sm:p-5 md:p-8 overflow-y-auto animate-fadeIn select-none"
      onClick={onClose}
    >
      {/* Background Volumetric Horizon Glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(0, 140, 255, 0.14) 0%, rgba(2, 3, 6, 0.85) 65%, #020306 100%)',
        }}
      />

      {/* Main Modal Chassis Box */}
      <div
        className="relative z-10 w-full max-w-6xl max-h-[94vh] bg-[#07090e] border border-white/15 rounded-3xl sm:rounded-[2.5rem] shadow-[0_25px_90px_rgba(0,0,0,0.95),0_0_60px_rgba(0,140,255,0.2)] overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================= */}
        {/* TOP BAR: BRAND IDENTITY & ACTIONS                         */}
        {/* ========================================================= */}
        <div className="relative z-20 px-6 sm:px-8 py-5 border-b border-white/10 bg-[#07090e]/90 backdrop-blur-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            {project.logoUrl ? (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/[0.06] border border-white/15 p-2 flex items-center justify-center shrink-0">
                <img
                  src={project.logoUrl}
                  alt={project.name}
                  className="max-h-full max-w-full object-contain filter grayscale-0"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#008CFF]/20 border border-[#008CFF]/40 flex items-center justify-center shrink-0">
                <Film className="w-5 h-5 text-[#008CFF]" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] sm:text-xs tracking-[0.24em] uppercase text-[#008CFF] font-semibold">
                  {project.category}
                </span>
                <span className="text-white/30 text-xs hidden sm:inline">·</span>
                <span className="font-mono text-[10px] sm:text-xs tracking-widest uppercase text-white/40 hidden sm:inline">
                  {project.year} PRODUCTION ARCHIVE
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-white truncate">
                {project.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Discuss Project CTA Button */}
            <button
              type="button"
              onClick={handleDiscussProject}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-sans text-xs tracking-[0.16em] uppercase font-bold transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(0,140,255,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,140,255,0.65)] border border-[#7ec4ff]/40 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #0066cc 0%, #008CFF 50%, #29a0ff 100%)',
              }}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>DISCUSS PROJECT</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Project Modal"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MODAL BODY: 2-COLUMN CINEMA THEATER & IN-DEPTH PROJECT INFO */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* ======================================================= */}
          {/* COLUMN 1: THEATER CINEMA PLAYER & MULTI-REEL SWITCHER   */}
          {/* ======================================================= */}
          <div className="w-full lg:w-[420px] xl:w-[450px] shrink-0 flex flex-col gap-6">
            
            {/* 1. Main Cinema Viewfinder Frame (9:16 Video Player) */}
            <div className="relative w-full aspect-[9/16] rounded-3xl sm:rounded-[2rem] bg-black border border-white/20 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(0,140,255,0.25)] flex flex-col justify-between group/player">
              
              {/* Dynamic Island Sensor Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 w-24 h-3.5 rounded-full bg-black/95 border border-white/15 flex items-center justify-center gap-2 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_6px_#008CFF]" />
                <span className="w-1 h-1 rounded-full bg-white/30" />
              </div>

              {/* Viewfinder Registration Corner Marks */}
              <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-white/40 pointer-events-none z-20" />
              <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-white/40 pointer-events-none z-20" />
              <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-white/40 pointer-events-none z-20" />
              <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-white/40 pointer-events-none z-20" />

              {/* Active Reel Header Tag */}
              <div className="absolute top-0 inset-x-0 z-20 p-5 pt-7 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between pointer-events-none">
                <div className="min-w-0 pr-2">
                  <span className="font-mono text-[9px] tracking-[0.24em] text-[#008CFF] uppercase font-bold block">
                    {activeReel.category || 'CINEMA REEL'}
                  </span>
                  <h4 className="font-sans text-sm font-bold text-white truncate">
                    {activeReel.title}
                  </h4>
                </div>
                <span className="font-mono text-[10px] tracking-widest text-white/60 uppercase border border-white/20 px-2 py-0.5 rounded-full bg-black/40 shrink-0">
                  {activeReel.duration || '9:16 UHD'}
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

              {/* Center Play Indicator when Paused */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 z-25 flex items-center justify-center bg-black/40 cursor-pointer pointer-events-auto"
                >
                  <div className="w-16 h-16 rounded-full bg-[#008CFF] text-white flex items-center justify-center shadow-[0_0_35px_rgba(0,140,255,0.8)] transform transition-transform hover:scale-110 active:scale-95">
                    <Play className="w-7 h-7 fill-current translate-x-0.5" />
                  </div>
                </div>
              )}

              {/* Bottom Video Controls Overlay */}
              <div className="absolute bottom-0 inset-x-0 z-20 p-4 sm:p-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-2.5 pointer-events-auto">
                {/* Scrubbable Progress Bar */}
                <div
                  onClick={handleSeek}
                  className="relative w-full h-1.5 bg-white/20 hover:h-2 rounded-full cursor-pointer transition-all duration-150 overflow-hidden"
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-[#008CFF] shadow-[0_0_10px_#008CFF] rounded-full transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Control Actions & Time Display */}
                <div className="flex items-center justify-between text-white/90 text-xs font-mono">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#008CFF]" />}
                    </button>

                    <span className="tracking-widest text-[11px] text-white/70">
                      {currentTime} / {duration}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleNativeFullscreen}
                    aria-label="Native Fullscreen"
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Interactive Multi-Reel Selector (2-3 reels for that company) */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/50 font-semibold flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-[#008CFF]" />
                  <span>PROJECT REELS ({currentReelList.length})</span>
                </span>
                <span className="font-mono text-[10px] text-white/40 tracking-wider">
                  CLICK TO SWITCH
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {currentReelList.map((reelItem, rIdx) => {
                  const isCurrent = rIdx === activeReelIndex;
                  return (
                    <button
                      key={reelItem.id}
                      type="button"
                      onClick={() => handleSelectReel(rIdx)}
                      className={`relative rounded-xl p-2 flex flex-col text-left transition-all duration-200 cursor-pointer border ${
                        isCurrent
                          ? 'bg-[#008CFF]/15 border-[#008CFF] shadow-[0_0_15px_rgba(0,140,255,0.35)]'
                          : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 hover:border-white/25'
                      }`}
                    >
                      {/* Thumbnail Container */}
                      <div className="relative w-full aspect-[9/16] rounded-lg overflow-hidden bg-black/60 mb-2">
                        <img
                          src={reelItem.posterUrl}
                          alt={reelItem.title}
                          className="w-full h-full object-cover"
                        />
                        {isCurrent ? (
                          <div className="absolute inset-0 bg-[#008CFF]/30 flex items-center justify-center">
                            <span className="px-1.5 py-0.5 rounded bg-[#008CFF] text-[9px] font-mono text-white font-bold tracking-wider">
                              PLAYING
                            </span>
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Play className="w-5 h-5 fill-white text-white drop-shadow" />
                          </div>
                        )}
                      </div>

                      <span className="font-sans text-[11px] font-bold text-white line-clamp-1 leading-tight">
                        {reelItem.title}
                      </span>
                      <span className="font-mono text-[9px] text-white/45 tracking-widest uppercase mt-0.5">
                        {reelItem.duration || `REEL 0${rIdx + 1}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* COLUMN 2: COMPLETE IN-DEPTH PROJECT INFO & BRIEFING     */}
          {/* ======================================================= */}
          <div className="flex-1 flex flex-col gap-7">
            
            {/* Headline & High-Level Narrative */}
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.26em] uppercase text-[#008CFF] font-semibold mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#008CFF]" />
                <span>CASE OVERVIEW</span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight leading-[1.05]">
                {project.headline}
              </h3>

              <p className="mt-4 text-sm sm:text-base text-white/75 font-sans leading-relaxed">
                {project.story}
              </p>
            </div>

            {/* Strategic Challenge & Solution Breakdown */}
            {(project.challenge || project.solution) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {project.challenge && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.025] border border-white/10 flex flex-col">
                    <span className="font-mono text-[10px] tracking-[0.24em] text-white/45 uppercase font-bold mb-2">
                      01 / THE CHALLENGE
                    </span>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                      {project.challenge}
                    </p>
                  </div>
                )}

                {project.solution && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#008CFF]/[0.04] border border-[#008CFF]/25 flex flex-col">
                    <span className="font-mono text-[10px] tracking-[0.24em] text-[#008CFF] uppercase font-bold mb-2">
                      02 / OUR CINEMATIC SOLUTION
                    </span>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                      {project.solution}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Verified Performance Metrics */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="pt-1">
                <span className="font-mono text-[10px] tracking-[0.24em] text-white/45 uppercase font-bold block mb-3">
                  MEASURED CAMPAIGN IMPACT
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  {project.metrics.map((metric, mIdx) => (
                    <div
                      key={`metric-${mIdx}`}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-start"
                    >
                      <span className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                        {metric.value}
                      </span>
                      <span className="font-mono text-[10px] sm:text-[11px] tracking-wider text-white/50 uppercase mt-1">
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Production Deliverables & Scope */}
            {project.deliverables && project.deliverables.length > 0 && (
              <div>
                <span className="font-mono text-[10px] tracking-[0.24em] text-white/45 uppercase font-bold block mb-3">
                  DELIVERABLE SCOPE & PRODUCTION ASSETS
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.deliverables.map((item, dIdx) => (
                    <div
                      key={`deliv-${dIdx}`}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/12 text-xs font-sans text-white/85"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#008CFF]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cinema Technical Specifications */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#030509] border border-white/10 flex flex-col gap-2">
              <span className="font-mono text-[10px] tracking-[0.24em] text-[#008CFF] uppercase font-bold">
                TECHNICAL CINEMATOGRAPHY SPECS
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 font-mono text-[11px] text-white/70">
                <div>
                  <span className="text-white/35 block text-[9px] uppercase tracking-wider">CAMERA</span>
                  <span className="font-semibold text-white">RED & ARRI LF</span>
                </div>
                <div>
                  <span className="text-white/35 block text-[9px] uppercase tracking-wider">FORMAT</span>
                  <span className="font-semibold text-white">9:16 Vertical 4K</span>
                </div>
                <div>
                  <span className="text-white/35 block text-[9px] uppercase tracking-wider">COLOR</span>
                  <span className="font-semibold text-white">ACES Film Log</span>
                </div>
                <div>
                  <span className="text-white/35 block text-[9px] uppercase tracking-wider">AUDIO</span>
                  <span className="font-semibold text-white">Spatial Mobile</span>
                </div>
              </div>
            </div>

            {/* Direct Project Discussion Banner & CTA */}
            <div className="mt-auto pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#008CFF]/15 via-white/[0.03] to-transparent border border-[#008CFF]/35">
              <div>
                <h4 className="font-sans font-bold text-sm sm:text-base text-white">
                  Want to discuss a similar production for your brand?
                </h4>
                <p className="font-sans text-xs text-white/60 mt-0.5">
                  Let's schedule a dedicated creative discussion for {project.name}-tier cinematography.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDiscussProject}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-sans text-xs tracking-[0.16em] uppercase font-bold transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(0,140,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.5)] hover:shadow-[0_0_30px_rgba(0,140,255,0.7)] border border-[#7ec4ff]/40 active:scale-95 shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #0066cc 0%, #008CFF 50%, #29a0ff 100%)',
                }}
              >
                <span>DISCUSS PROJECT</span>
                <ArrowUpRight className="w-4 h-4 text-white" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
