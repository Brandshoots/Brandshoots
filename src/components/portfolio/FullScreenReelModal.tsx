import React, { useRef, useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { ClientProject } from '../../data/clientsData';

interface FullScreenReelModalProps {
  isOpen: boolean;
  project: ClientProject | null;
  onClose: () => void;
}

export const FullScreenReelModal: React.FC<FullScreenReelModalProps> = ({
  isOpen,
  project,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>('0:00');
  const [duration, setDuration] = useState<string>('0:00');

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Close modal on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Auto play when modal opens
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: mute and play
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, project, onClose]);

  if (!isOpen || !project) return null;

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
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} — Full Screen Reel`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 backdrop-blur-2xl transition-all duration-300 animate-fadeIn p-4 sm:p-6 md:p-8"
      onClick={onClose}
    >
      {/* Background Ambient Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0, 140, 255, 0.12) 0%, transparent 70%)',
        }}
      />

      {/* Close Button Top Right */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close Full Screen Reel"
        className="absolute top-5 right-5 sm:top-7 sm:right-8 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/90 hover:text-white transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Main Reel Frame Chassis (Sculpted Titanium Cinema Viewfinder) */}
      <div
        className="relative z-10 w-full max-w-[440px] max-h-[92vh] aspect-[9/16] p-2 sm:p-2.5 rounded-[2.5rem] bg-gradient-to-b from-[#242938] via-[#0f131c] to-[#181d28] border border-white/20 shadow-[0_30px_100px_rgba(0,0,0,0.95),0_0_60px_rgba(0,140,255,0.3)] ring-1 ring-[#008CFF]/50 flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dynamic Island Sensor Pill at Top Bezel */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 w-24 h-3.5 rounded-full bg-black/95 border border-white/10 flex items-center justify-center gap-2 pointer-events-none shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_6px_#008CFF]" />
          <span className="w-1 h-1 rounded-full bg-white/30" />
        </div>

        {/* Inner Curved Cinema Screen with OLED Bezel */}
        <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-[#060a12] border border-white/10 flex flex-col justify-between">
          {/* Cinema Viewfinder Corner Registration Brackets */}
          <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-white/40 pointer-events-none z-20" />
          <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-white/40 pointer-events-none z-20" />
          <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-white/40 pointer-events-none z-20" />
          <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-white/40 pointer-events-none z-20" />

          {/* Top Header Information Overlay */}
          <div className="absolute top-0 inset-x-0 z-20 p-5 pt-6 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between pointer-events-auto">
            <div>
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.24em] text-[#008CFF] uppercase font-semibold block">
                {project.category}
              </span>
              <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-white mt-0.5">
                {project.name}
              </h3>
            </div>
            <span className="font-mono text-[11px] tracking-widest text-white/50 uppercase border border-white/15 px-2.5 py-1 rounded-full bg-black/40">
              9:16 REEL
            </span>
          </div>

          {/* The Fullscreen Video Element */}
          <video
            ref={videoRef}
            src={project.videoUrl}
            poster={project.posterUrl}
            playsInline
            autoPlay
            loop
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer"
          />

        {/* Center Pause/Play Indicator when paused */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 cursor-pointer pointer-events-auto"
          >
            <div className="w-16 h-16 rounded-full bg-[#008CFF]/90 text-white flex items-center justify-center shadow-[0_0_30px_rgba(0,140,255,0.8)] transform transition-transform hover:scale-110 active:scale-95">
              <Play className="w-7 h-7 fill-current translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Bottom Video Controls Overlay */}
        <div className="absolute bottom-0 inset-x-0 z-20 p-4 sm:p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col gap-3 pointer-events-auto">
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

          {/* Control Buttons & Timestamp */}
          <div className="flex items-center justify-between text-white/90 text-xs font-mono">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#008CFF]" />}
              </button>

              <span className="tracking-widest text-white/70">
                {currentTime} / {duration}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNativeFullscreen}
              aria-label="Native Fullscreen"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default FullScreenReelModal;
