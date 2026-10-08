import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { Play, Pause } from 'lucide-react';

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

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaFrameRef = useRef<HTMLDivElement>(null);
  const brandingRef = useRef<HTMLDivElement>(null);
  const progressBarsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Touch Swipe Gesture State
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const touchDeltaXRef = useRef<number>(0);

  // Auto-advance reels every 7 seconds when playing
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % REEL_VIDEOS.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Entrance animations for media card and branding
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (mediaFrameRef.current) {
        gsap.fromTo(
          mediaFrameRef.current,
          { opacity: 0, scale: 0.94, y: 16 },
          { opacity: 1, scale: 1, y: 0, duration: 0.7, delay: 0.1, ease: 'power3.out' }
        );
      }
      if (brandingRef.current) {
        gsap.fromTo(
          brandingRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.65, delay: 0.25, ease: 'power3.out' }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Update video and animate progress bar on reel change
  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.defaultMuted = true;
      vid.muted = true;
      vid.playsInline = true;
      vid.currentTime = 0;
      if (isPlaying) {
        vid.play().catch(() => {});
      }
    }

    // Animate the active progress indicator
    progressBarsRef.current.forEach((bar, idx) => {
      if (!bar) return;
      gsap.killTweensOf(bar);
      if (idx < currentIdx) {
        gsap.set(bar, { scaleX: 1 });
      } else if (idx > currentIdx) {
        gsap.set(bar, { scaleX: 0 });
      } else {
        gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 7.0, ease: 'none' });
      }
    });
  }, [currentIdx, isPlaying]);

  // Toggle Video Playback on Single Tap of Media Card
  const handleTogglePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
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
    setTimeout(() => setShowPlayIcon(false), 650);
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

    if (Math.abs(deltaX) > 40 && deltaY < 60) {
      if (deltaX < 0) {
        setCurrentIdx((prev) => (prev + 1) % REEL_VIDEOS.length);
      } else {
        setCurrentIdx((prev) => (prev - 1 + REEL_VIDEOS.length) % REEL_VIDEOS.length);
      }
    }
  };

  const scrollToAbout = () => {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo('#what-we-do', { duration: 0.85 });
    } else {
      const el = document.getElementById('what-we-do');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeReel = REEL_VIDEOS[currentIdx];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[100svh] max-h-[100svh] bg-[#05070A] text-white flex flex-col justify-between pt-[62px] pb-3 px-5 overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Atmosphere & Ambient Horizon Lights */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[360px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.16) 0%, rgba(0, 70, 190, 0.04) 50%, transparent 75%)',
            filter: 'blur(60px)',
          }}
        />
        <div className="absolute inset-0 cinema-grain opacity-20 pointer-events-none" />
      </div>

      {/* ======================================================== */}
      {/* 1. TOP METADATA ROW & REEL PROGRESS INDICATORS           */}
      {/* ======================================================== */}
      <div className="relative z-10 w-full max-w-[340px] mx-auto pt-1 flex flex-col gap-2">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.24em] uppercase text-white/60">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_6px_#008CFF]" />
            <span className="text-[#008CFF] font-bold">CINEMATIC MEDIA</span>
          </div>
          <div className="flex items-center gap-1 text-white/80 font-semibold">
            <span>{activeReel.client}</span>
            <span className="text-white/30">•</span>
            <span className="text-[#008CFF]">4K</span>
          </div>
        </div>

        {/* 5 Reel Segmented Progress Bars */}
        <div className="grid grid-cols-5 gap-1.5 w-full">
          {REEL_VIDEOS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIdx(idx)}
              aria-label={`Jump to reel ${idx + 1}`}
              className="h-[2.5px] bg-white/15 rounded-full overflow-hidden cursor-pointer"
            >
              <div
                ref={(el) => (progressBarsRef.current[idx] = el)}
                className="w-full h-full bg-[#008CFF] origin-left rounded-full shadow-[0_0_6px_#008CFF]"
              />
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MIDDLE: DOMINANT CINEMATIC MEDIA CONTAINER             */}
      {/* Frame proportions calibrated for 360-412px viewports     */}
      {/* ======================================================== */}
      <div
        ref={mediaFrameRef}
        onClick={handleTogglePlay}
        className="relative z-10 w-full max-w-[325px] xs:max-w-[340px] mx-auto flex-1 my-2 max-h-[46svh] min-h-[250px] aspect-[9/13] rounded-2xl overflow-hidden bg-[#0A0E17] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_28px_rgba(0,140,255,0.14)] cursor-pointer group flex items-center justify-center"
      >
        {/* Active Reel Video with Protected Focal Point */}
        <video
          ref={videoRef}
          key={activeReel.src}
          src={activeReel.src}
          poster={activeReel.poster}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-[center_20%] transition-opacity duration-300"
        />

        {/* Subtle Top & Bottom Edge Vignettes for Atmosphere */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

        {/* Top-Right Chapter/Reel Pill */}
        <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/12 text-white font-mono text-[9px] tracking-wider uppercase">
          REEL {String(currentIdx + 1).padStart(2, '0')} / 05
        </div>

        {/* Bottom-Left Category Pill */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/15">
          <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-white/90">
            {activeReel.category}
          </span>
        </div>

        {/* Play / Pause Feedback Pulse Badge */}
        {showPlayIcon && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-black/70 backdrop-blur-md border border-white/25 text-white flex items-center justify-center animate-scaleFade">
              {isPlaying ? (
                <Play className="w-6 h-6 fill-current text-[#008CFF] ml-0.5" />
              ) : (
                <Pause className="w-6 h-6 fill-current text-white/90" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. BOTTOM: BRANDSHOOTS + CREATE. SHOOT. GROW. + SCROLL    */}
      {/* Protected text zone — zero collision with video faces     */}
      {/* ======================================================== */}
      <div
        ref={brandingRef}
        className="relative z-10 w-full max-w-[360px] mx-auto flex flex-col items-center text-center pb-1"
      >
        {/* BRANDSHOOTS Title in Figtree font */}
        <h1 className="font-sans font-black tracking-[-0.035em] uppercase text-[36px] xs:text-[42px] leading-none flex items-center justify-center filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
          <span className="text-[#008CFF] drop-shadow-[0_2px_14px_rgba(0,140,255,0.45)]">
            BRAND
          </span>
          <span className="text-white ml-[0.02em]">
            SHOOTS
          </span>
        </h1>

        {/* CREATE. SHOOT. GROW. Tagline */}
        <div className="mt-1.5 font-mono text-[11px] xs:text-xs tracking-[0.42em] uppercase font-bold text-center">
          <span className="text-white/85">CREATE. </span>
          <span className="text-[#008CFF] drop-shadow-[0_0_10px_rgba(0,140,255,0.8)]">
            SHOOT.
          </span>
          <span className="text-white/85"> GROW.</span>
        </div>

        {/* Subtle SCROLL DOWN indicator */}
        <div
          onClick={scrollToAbout}
          className="mt-2.5 flex items-center gap-1.5 text-white/50 hover:text-white/80 active:text-white transition-colors duration-200 cursor-pointer py-1"
        >
          <svg
            className="w-3.5 h-3.5 text-[#008CFF] animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span className="font-mono text-[9px] tracking-[0.28em] uppercase font-semibold text-white/60">
            SCROLL DOWN
          </span>
        </div>
      </div>

      <style>{`
        @keyframes scaleFade {
          0% { transform: scale(0.7); opacity: 0; }
          40% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        .animate-scaleFade {
          animation: scaleFade 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MobileCinematicHero;
