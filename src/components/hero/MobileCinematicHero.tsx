import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { Play, Pause, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const REEL_VIDEOS = [
  {
    src: '/reels/wearebrandshoots_1777444216_3885805244420742638_77785749886.mp4',
    poster: '/reels/posters/wearebrandshoots_1777444216_3885805244420742638_77785749886.jpg',
    client: 'Bags World',
    category: 'Commercial Campaign'
  },
  {
    src: '/reels/wearebrandshoots_1786454245_3961387117295433628_77785749886.mp4',
    poster: '/reels/posters/wearebrandshoots_1786454245_3961387117295433628_77785749886.jpg',
    client: 'Aabharan Jewellers',
    category: 'Luxury Visuals'
  },
  {
    src: '/reels/viswatuff.glass_rjy_1791174653_4000984496274606409_78432309239.mp4',
    poster: '/reels/posters/viswatuff.glass_rjy_1791174653_4000984496274606409_78432309239.jpg',
    client: 'Viswatuff Glass',
    category: 'Architectural Reel'
  },
  {
    src: '/reels/wearebrandshoots_1788094941_3975150238988110104_77785749886.mp4',
    poster: '/reels/posters/wearebrandshoots_1788094941_3975150238988110104_77785749886.jpg',
    client: 'Jain Beauty Studio',
    category: 'Fashion & Editorial'
  },
  {
    src: '/reels/santhi.pipes_rjy_1783494112_3936556116926232206_48644092133.mp4',
    poster: '/reels/posters/santhi.pipes_rjy_1783494112_3936556116926232206_48644092133.jpg',
    client: 'Santhi Pipes',
    category: 'Industrial Film'
  }
];

export const MobileCinematicHero: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [doubleTapFlash, setDoubleTapFlash] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleBlockRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Touch Swipe Gesture State
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const touchDeltaXRef = useRef<number>(0);
  const lastTapTimeRef = useRef<number>(0);

  // Auto-advance reels every 7.5 seconds when playing
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % REEL_VIDEOS.length);
    }, 7500);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Entrance animations for typography
  useEffect(() => {
    if (titleBlockRef.current) {
      gsap.fromTo(
        titleBlockRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.65, delay: 0.1, ease: 'power3.out' }
      );
    }
  }, []);

  // Reset video playback and animate progress on reel change
  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.currentTime = 0;
      if (isPlaying) {
        vid.play().catch(() => {});
      }
    }

    if (progressRef.current) {
      gsap.killTweensOf(progressRef.current);
      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 7.5, ease: 'none' }
      );
    }
  }, [currentIdx, isPlaying]);

  // Toggle Video Playback on Single Tap
  const handleTap = useCallback(() => {
    const now = Date.now();
    // Double tap detector (within 280ms)
    if (now - lastTapTimeRef.current < 280) {
      setDoubleTapFlash(true);
      setTimeout(() => setDoubleTapFlash(false), 450);
      lastTapTimeRef.current = 0;
      return;
    }
    lastTapTimeRef.current = now;

    const vid = videoRef.current;
    if (!vid) return;

    if (vid.paused) {
      vid.play().catch(() => {});
      setIsPlaying(true);
    } else {
      vid.pause();
      setIsPlaying(false);
    }

    setShowPlayIcon(true);
    setTimeout(() => setShowPlayIcon(false), 700);
  }, []);

  // Touch Swipe Handling for Instant Reel Switching
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchDeltaXRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaXRef.current = e.touches[0].clientX - touchStartXRef.current;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = touchDeltaXRef.current;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartYRef.current);

    // If horizontal swipe is dominant (over 45px and not a vertical scroll)
    if (Math.abs(deltaX) > 45 && deltaY < 60) {
      if (deltaX < 0) {
        // Swipe Left -> Next
        setCurrentIdx((prev) => (prev + 1) % REEL_VIDEOS.length);
      } else {
        // Swipe Right -> Prev
        setCurrentIdx((prev) => (prev - 1 + REEL_VIDEOS.length) % REEL_VIDEOS.length);
      }
    }
  };

  const activeReel = REEL_VIDEOS[currentIdx];

  const scrollToAbout = () => {
    const el = document.getElementById('what-we-do');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[100dvh] overflow-hidden bg-[#05070A] select-none touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleTap}
    >
      {/* ======================================================== */}
      {/* 1. FULL-SCREEN 9:16 VERTICAL CINEMATIC VIDEO BACKGROUND  */}
      {/* ======================================================== */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          ref={videoRef}
          key={activeReel.src}
          src={activeReel.src}
          poster={activeReel.poster}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover animate-fadeIn"
        />

        {/* Cinematic Film Vignette & Dark Tint */}
        <div className="absolute inset-0 bg-[#05070A]/30 pointer-events-none" />
        <div className="absolute inset-0 cinema-grain opacity-20 pointer-events-none" />
      </div>

      {/* Camera Shutter Flash Reaction on Double Tap */}
      {doubleTapFlash && (
        <div className="absolute inset-0 bg-white/70 pointer-events-none z-40 animate-cameraFlash" />
      )}

      {/* Play / Pause Interactive Pulsing Feedback Badge */}
      {showPlayIcon && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center animate-scaleFade">
            {isPlaying ? (
              <Play className="w-7 h-7 fill-current text-[#008CFF] ml-0.5" />
            ) : (
              <Pause className="w-7 h-7 fill-current text-white/90" />
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. TOP LIGHT BLUE GRADIENT & FLOATING REEL BADGE         */}
      {/* ======================================================== */}
      <div
        className="absolute top-0 inset-x-0 h-44 z-20 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,7,10,0.96) 0%, rgba(3,10,24,0.85) 45%, rgba(0,140,255,0.14) 75%, transparent 100%)',
        }}
      />
      {/* Delicate Light Blue Ambient Halo */}
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-[90vw] h-28 z-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(0, 140, 255, 0.28) 0%, rgba(0, 90, 210, 0.08) 55%, transparent 80%)',
          filter: 'blur(25px)',
        }}
      />
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#008CFF]/70 to-transparent z-25 pointer-events-none" />

      {/* Floating Client & Reel Badge (Top Right beneath Header) */}
      <div className="absolute top-[82px] right-5 z-25 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white/90 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#008CFF] animate-pulse" />
          <span className="font-mono text-[10px] tracking-wider uppercase font-semibold text-white/90">
            {activeReel.client}
          </span>
          <span className="text-white/30 text-[9px]">•</span>
          <span className="font-mono text-[9px] tracking-wider text-[#008CFF] font-bold">
            4K
          </span>
        </div>
      </div>

      {/* Quick Swipe Chevrons (Subtle Left/Right hints) */}
      <div className="absolute inset-y-0 left-2 z-20 flex items-center pointer-events-none opacity-40">
        <ChevronLeft className="w-6 h-6 text-white/70 animate-pulse" />
      </div>
      <div className="absolute inset-y-0 right-2 z-20 flex items-center pointer-events-none opacity-40">
        <ChevronRight className="w-6 h-6 text-white/70 animate-pulse" />
      </div>

      {/* ======================================================== */}
      {/* 3. BOTTOM BLUE GRADIENT & BRANDING BLOCK                 */}
      {/* ======================================================== */}
      <div
        className="absolute bottom-0 inset-x-0 h-[58vh] z-20 pointer-events-none"
        style={{
          background:
            'linear-gradient(0deg, rgba(5,7,10,0.98) 0%, rgba(5,7,10,0.85) 45%, rgba(0,140,255,0.18) 75%, transparent 100%)',
        }}
      />

      {/* Electric Blue Atmosphere Ambient Glow in Bottom-Left */}
      <div
        className="absolute -bottom-10 -left-10 w-[100vw] h-[380px] pointer-events-none z-20"
        style={{
          background:
            'radial-gradient(circle at 18% 85%, rgba(0, 140, 255, 0.42) 0%, rgba(0, 100, 240, 0.18) 42%, transparent 75%)',
          filter: 'blur(45px)',
        }}
      />

      {/* Bottom-Left Branding Block */}
      <div
        ref={titleBlockRef}
        className="absolute bottom-[84px] sm:bottom-[92px] left-0 right-0 z-30 px-6 sm:px-8 flex flex-col items-start pointer-events-none"
      >
        {/* Active Reel Indicator & Pagination Dots (Interactive Tap) */}
        <div
          className="flex items-center gap-2 mb-2.5 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {REEL_VIDEOS.map((reel, idx) => (
            <button
              key={reel.src}
              type="button"
              onClick={() => setCurrentIdx(idx)}
              aria-label={`Jump to reel ${idx + 1}`}
              className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                currentIdx === idx
                  ? 'w-8 bg-[#008CFF] shadow-[0_0_12px_#008CFF]'
                  : 'w-2.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Reel Progress Bar */}
        <div className="w-36 h-[2px] bg-white/15 rounded-full overflow-hidden mb-3.5">
          <div
            ref={progressRef}
            className="w-full h-full bg-[#008CFF] origin-left rounded-full shadow-[0_0_8px_#008CFF]"
          />
        </div>

        {/* Category Pill Tag */}
        <div className="mb-1.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#008CFF]" />
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#008CFF] font-bold">
            {activeReel.category}
          </span>
        </div>

        {/* Prominent 3D Extruded BRANDSHOOTS Logo */}
        <h1 className="font-display font-black tracking-[-0.038em] uppercase text-[12.5vw] xs:text-[46px] leading-[0.88] text-left">
          {/* BRAND — blue */}
          <span
            className="inline-block text-[#008CFF]"
            style={{
              textShadow:
                '0 1px 0 #60B8FF, 0 2px 0 #28A0FF, 0 3px 0 #007EE6, 0 4px 0 #005096, 0 6px 18px rgba(0,0,0,0.95), 0 0 28px rgba(0,140,255,0.6)',
            }}
          >
            BRAND
          </span>

          {/* SHOOTS — white */}
          <span
            className="inline-block text-white ml-[0.015em]"
            style={{
              textShadow:
                '0 1px 0 #F8FAFC, 0 2px 0 #E2E8F0, 0 3px 0 #CBD5E1, 0 4px 0 #94A3B8, 0 5px 0 #64748B, 0 7px 18px rgba(0,0,0,0.95)',
            }}
          >
            SHOOTS
          </span>
        </h1>

        {/* Tagline: CREATE. SHOOT. GROW. */}
        <div className="mt-2.5 font-mono text-xs xs:text-[13px] tracking-[0.42em] uppercase font-bold text-left">
          <span className="text-white">CREATE. </span>
          <span className="text-[#008CFF] drop-shadow-[0_0_12px_rgba(0,140,255,0.85)]">
            SHOOT.
          </span>
          <span className="text-white"> GROW.</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. SCROLL DOWN INDICATOR (BOTTOM CENTER)                 */}
      {/* ======================================================== */}
      <div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 cursor-pointer pointer-events-auto"
        onClick={(e) => {
          e.stopPropagation();
          scrollToAbout();
        }}
      >
        <div className="px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-md">
          <svg
            className="w-3.5 h-3.5 text-[#008CFF] drop-shadow-[0_0_8px_#008CFF] animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span className="font-mono text-[9px] tracking-[0.28em] uppercase font-bold text-white/70">
            Scroll Down
          </span>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0.5; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        @keyframes scaleFade {
          0% { transform: scale(0.7); opacity: 0; }
          40% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        .animate-scaleFade {
          animation: scaleFade 0.65s ease-out forwards;
        }

        @keyframes cameraFlash {
          0% { opacity: 0.85; }
          100% { opacity: 0; }
        }
        .animate-cameraFlash {
          animation: cameraFlash 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MobileCinematicHero;
