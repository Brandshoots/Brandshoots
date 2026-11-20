import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface LusionVideoOverlayProps {
  videoUrl: string | null;
  title: string;
  onClose: () => void;
}

export const LusionVideoOverlay: React.FC<LusionVideoOverlayProps> = ({
  videoUrl,
  title,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [durationTime, setDurationTime] = useState('00:00');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      const cur = video.currentTime;
      const dur = video.duration || 1;
      setProgress((cur / dur) * 100);

      const curM = Math.floor(cur / 60);
      const curS = Math.floor(cur % 60);
      const durM = Math.floor(dur / 60);
      const durS = Math.floor(dur % 60);

      setCurrentTime(`${String(curM).padStart(2, '0')}:${String(curS).padStart(2, '0')}`);
      setDurationTime(`${String(durM).padStart(2, '0')}:${String(durS).padStart(2, '0')}`);
    };

    video.addEventListener('timeupdate', updateTime);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!videoUrl) return null;

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * (video.duration || 0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 md:p-8 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-xs text-white/70 tracking-widest uppercase">
            CINEMA REEL VIEWER // {title}
          </span>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-black font-mono text-xs uppercase tracking-wider transition-colors"
        >
          <X className="w-4 h-4" />
          <span>CLOSE (ESC)</span>
        </button>
      </div>

      {/* Main Video Viewport */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          playsInline
          className="max-h-[80vh] max-w-full rounded-2xl shadow-[0_0_100px_rgba(0,0,0,1)] object-contain"
          onClick={togglePlay}
        />
      </div>

      {/* Bottom Custom Playback Bar (Lusion #video-overlay__controls) */}
      <div className="max-w-4xl mx-auto w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 backdrop-blur-xl space-y-3 z-20">
        {/* Progress Track */}
        <div
          onClick={handleScrub}
          className="relative w-full h-2 rounded-full bg-white/10 cursor-pointer overflow-hidden group"
        >
          <div
            className="absolute top-0 left-0 h-full bg-[#139EF2] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-white font-mono text-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#139EF2] flex items-center justify-center transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button
              onClick={toggleMute}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#139EF2] flex items-center justify-center transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <span className="text-white/60 tracking-wider">
              {currentTime} / {durationTime}
            </span>
          </div>

          <div className="flex items-center gap-4 text-white/40 text-[11px] tracking-wider">
            <span>PRESS SPACE TO PLAY/PAUSE</span>
            <button
              onClick={() => {
                if (videoRef.current?.requestFullscreen) {
                  videoRef.current.requestFullscreen();
                }
              }}
              className="hover:text-white transition-colors"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
