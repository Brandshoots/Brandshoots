import React, { useRef, useEffect, useState, useCallback } from 'react';

interface BrandShootsPreloaderProps {
  onComplete?: () => void;
}

/**
 * BRANDSHOOTS CINEMATIC PRE-RENDERED PRELOADER
 * Architecture:
 * - Instant 0ms Lightweight Poster (<5KB WebP)
 * - Hardware Video Playback (1080p desktop / 720p mobile, 30fps H.264/WebM)
 * - Zero JS animation calculations: no GSAP, no Framer Motion, no Three.js, no SVG/blur filters
 * - Fast handoff: automatically exits when video ends or at max 2.5s
 * - Pure CSS opacity dissolve, completely removing video element from DOM on completion
 */
export const BrandShootsPreloader: React.FC<BrandShootsPreloaderProps> = ({ onComplete }) => {
  const [isRemoved, setIsRemoved] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const exitCalledRef = useRef(false);

  const exitPreloader = useCallback(() => {
    if (exitCalledRef.current) return;
    exitCalledRef.current = true;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Trigger smooth 350ms compositor opacity dissolve
    setIsFading(true);

    setTimeout(() => {
      setIsRemoved(true);
      if (onComplete) {
        onComplete();
      }
    }, 350);
  }, [onComplete]);

  useEffect(() => {
    const video = videoRef.current;

    // Hard failsafe: maximum visible duration is strictly 2.5 seconds
    timerRef.current = setTimeout(() => {
      exitPreloader();
    }, 2500);

    if (video) {
      video.defaultMuted = true;
      video.muted = true;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser policy or environment blocks video playback, immediately exit to homepage
          exitPreloader();
        });
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [exitPreloader]);

  if (isRemoved) {
    return null;
  }

  // Responsive video selection: 720p on mobile (<768px), 1080p on desktop
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div
      id="brandshoots-cinematic-preloader"
      className="fixed inset-0 z-[99999] bg-[#050608] flex items-center justify-center overflow-hidden select-none pointer-events-none will-change-opacity"
      style={{
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.35s ease-out'
      }}
    >
      {/* 1. Instant 0ms Lightweight Poster (<5KB WebP) — renders before video decodes */}
      <picture className="absolute inset-0 w-full h-full">
        <source srcSet="/preloader/preloader-poster.webp" type="image/webp" />
        <img
          src="/preloader/preloader-poster.jpg"
          alt="BrandShoots"
          fetchPriority="high"
          decoding="sync"
          className="w-full h-full object-cover object-center"
        />
      </picture>

      {/* 2. Pre-rendered Cinematic Video — Autoplay muted, playsInline, loop=false */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        loop={false}
        preload="auto"
        onEnded={exitPreloader}
        onError={exitPreloader}
        className="absolute inset-0 w-full h-full object-cover object-center"
      >
        {isMobile ? (
          <>
            <source src="/preloader/preloader-720p.webm" type="video/webm" />
            <source src="/preloader/preloader-720p.mp4" type="video/mp4" />
          </>
        ) : (
          <>
            <source src="/preloader/preloader-1080p.webm" type="video/webm" />
            <source src="/preloader/preloader-1080p.mp4" type="video/mp4" />
          </>
        )}
      </video>

      {/* 3. Cinema Letterbox Framing */}
      <div className="absolute inset-x-0 top-0 h-8 md:h-12 bg-gradient-to-b from-black to-transparent z-10 opacity-75" />
      <div className="absolute inset-x-0 bottom-0 h-8 md:h-12 bg-gradient-to-t from-black to-transparent z-10 opacity-75" />
    </div>
  );
};
