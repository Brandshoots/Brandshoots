import React, { useRef, useEffect, useState } from 'react';
import { ArrowUpRight, Play, Volume2, VolumeX } from 'lucide-react';
import { ClientProject } from '../../data/clientsData';

interface PortfolioMobileShowcaseProps {
  activeProjects: ClientProject[];
  onSelectProject: (project: ClientProject) => void;
}

interface MobileReelCardProps {
  project: ClientProject;
  index: number;
  total: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onSelectProject: (project: ClientProject) => void;
}

const MobileReelCard: React.FC<MobileReelCardProps> = ({
  project,
  index,
  total,
  isMuted,
  onToggleMute,
  onSelectProject,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Play/pause dynamically based on viewport intersection
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    video.muted = isMuted;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => setIsPlaying(false));
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      {
        threshold: 0.45,
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [isMuted]);

  // Keep muted state in sync
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const fallbackMetrics = [
    { label: 'Views', value: '250K+' },
    { label: 'Followers', value: '18K+' },
    { label: 'Likes', value: '34K+' },
  ];
  const stats =
    project.metrics && project.metrics.length > 0 ? project.metrics : fallbackMetrics;

  return (
    <article
      ref={containerRef}
      className="relative w-full py-7 first:pt-2 last:pb-10 flex flex-col items-center"
    >
      {/* ========================================================= */}
      {/* 1. DOMINANT 9:16 REEL (78–88vw, CENTERED, CLEAN BORDER) */}
      {/* ========================================================= */}
      <div
        onClick={togglePlay}
        className="relative w-[80vw] max-w-[325px] aspect-[9/16] mx-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-[#070B14] shadow-[0_16px_40px_rgba(0,0,0,0.85)] border border-white/10 cursor-pointer select-none group"
      >
        {/* Real Reel Video */}
        <video
          ref={videoRef}
          src={project.videoUrl}
          poster={project.posterUrl}
          playsInline
          muted={isMuted}
          loop
          preload={index === 0 ? 'auto' : 'metadata'}
          className="w-full h-full object-cover"
        />

        {/* Top Badges Overlay inside Reel */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
          <span className="font-mono text-[10px] tracking-widest text-white/80 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 uppercase shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMute();
            }}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="pointer-events-auto w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/85 hover:text-white active:scale-90 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.6)] cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-white/60" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#008CFF]" />
            )}
          </button>
        </div>

        {/* Centered Subtle Play Indicator when paused */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 pointer-events-none transition-opacity">
            <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-[0_0_24px_rgba(0,140,255,0.4)]">
              <Play className="w-5 h-5 text-white fill-white translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Bottom subtle edge vignette */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>

      {/* ========================================================= */}
      {/* 2. IMMEDIATELY BELOW REEL: TIGHT, CONNECTED EDITORIAL COMPOSITION */}
      {/*    Client logo → Client title → short description → stats → More Info */}
      {/* ========================================================= */}
      <div className="w-full max-w-[325px] mx-auto flex flex-col items-center text-center mt-3.5 px-2">
        {/* 2.1 Client Logo */}
        {project.logoUrl ? (
          <div className="flex items-center justify-center h-7 mb-1.5">
            <img
              src={project.logoUrl}
              alt={`${project.name} logo`}
              className="max-h-7 max-w-[130px] w-auto h-auto object-contain filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="h-1.5" />
        )}

        {/* 2.2 Client Title */}
        <h2 className="text-2xl sm:text-3xl font-sans font-black tracking-[-0.025em] text-white uppercase leading-[1.05] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
          {project.name}
        </h2>

        {/* 2.3 Short Description */}
        <p className="mt-1 text-xs sm:text-sm font-sans font-light text-white/75 leading-relaxed max-w-[310px]">
          {project.headline}
        </p>

        {/* 2.4 Client Stats Pills */}
        <div className="mt-3 grid grid-cols-3 gap-2 w-full max-w-[280px]">
          {stats.map((metric, idx) => (
            <div
              key={idx}
              className="px-2 py-1.5 rounded-xl bg-[#008CFF]/[0.05] border border-[#008CFF]/25 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-[0_0_12px_rgba(0,140,255,0.08)]"
            >
              <span className="text-xs sm:text-sm font-sans font-bold text-white tracking-tight leading-none drop-shadow-[0_0_8px_rgba(0,140,255,0.45)]">
                {metric.value}
              </span>
              <span className="mt-1 text-[8px] font-sans font-medium uppercase tracking-[0.12em] text-white/55 leading-none">
                {metric.label}
              </span>
            </div>
          ))}
        </div>

        {/* 2.5 More Info Action Button */}
        <div className="mt-3.5 flex justify-center">
          <button
            type="button"
            onClick={() => onSelectProject(project)}
            className="group inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#008CFF] hover:bg-[#1a97ff] active:scale-95 text-white font-mono text-[10px] sm:text-xs font-bold tracking-[0.18em] uppercase transition-all duration-300 shadow-[0_0_20px_rgba(0,140,255,0.4)] hover:shadow-[0_0_35px_rgba(0,140,255,0.65)] cursor-pointer"
          >
            <span>MORE INFO</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* Subtle Hairline Editorial Divider Between Clients */}
      {index < total - 1 && (
        <div className="w-[80vw] max-w-[325px] mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mt-7" />
      )}
    </article>
  );
};

export const PortfolioMobileShowcase: React.FC<PortfolioMobileShowcaseProps> = ({
  activeProjects,
  onSelectProject,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <section
      id="brandshoots-mobile-portfolio"
      className="relative w-full bg-[#030509] text-white pt-20 sm:pt-24 pb-12 px-4 overflow-hidden select-none"
    >
      {/* Ambient Central Studio Radial Aura */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] h-[550px] pointer-events-none opacity-35"
        style={{
          background:
            'radial-gradient(ellipse at 50% 25%, rgba(0, 140, 255, 0.14) 0%, rgba(8, 20, 60, 0.2) 45%, transparent 75%)',
          filter: 'blur(70px)',
        }}
      />

      {/* List of Client Projects in Normal Native Vertical Flow */}
      <div className="relative z-10 w-full flex flex-col">
        {activeProjects.map((project, index) => (
          <MobileReelCard
            key={project.id}
            project={project}
            index={index}
            total={activeProjects.length}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            onSelectProject={onSelectProject}
          />
        ))}
      </div>
    </section>
  );
};

export default PortfolioMobileShowcase;
