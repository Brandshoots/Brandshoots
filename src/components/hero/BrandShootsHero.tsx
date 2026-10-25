import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { ReelWall3D } from './ReelWall3D';
import { HeroCinematicBackground } from './HeroCinematicBackground';
import { useCMSContent } from '../../lib/cms/useCMSContent';

gsap.registerPlugin(ScrollTrigger);

interface BrandShootsHeroProps {
  isPreloaderActive?: boolean;
}

export const BrandShootsHero: React.FC<BrandShootsHeroProps> = ({ isPreloaderActive = false }) => {
  const { hero, heroReels } = useCMSContent();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleBrandRef = useRef<HTMLSpanElement>(null);
  const titleShootsRef = useRef<HTMLSpanElement>(null);
  const reelWallContainerRef = useRef<HTMLDivElement>(null);
  const mobileVideoContainerRef = useRef<HTMLDivElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const [isMuted, setIsMuted] = useState(true);

  // Responsive breakpoint tracking
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  // Mobile Full Screen Reels List (uses CMS custom mobile video or hero reels)
  const mobileReelsList = useMemo(() => {
    if (hero?.mobileVideoUrl) {
      return [
        {
          src: hero.mobileVideoUrl,
          poster:
            hero.mobilePosterUrl ||
            '/reels/posters/wearebrandshoots_1777444216_3885805244420742638_77785749886.jpg',
          title: hero.mobileFeaturedTitle || 'BrandShoots Studio Reel',
        },
        ...(heroReels || []).map((r) => ({
          src: r.src,
          poster: r.poster,
          title: r.title,
        })),
      ];
    }
    if (heroReels && heroReels.length > 0) {
      return heroReels.map((r) => ({
        src: r.src,
        poster: r.poster,
        title: r.title,
      }));
    }
    return [
      {
        src: '/reels/wearebrandshoots_1777444216_3885805244420742638_77785749886.mp4',
        poster: '/reels/posters/wearebrandshoots_1777444216_3885805244420742638_77785749886.jpg',
        title: 'BrandShoots Flagship Reel',
      },
    ];
  }, [hero, heroReels]);

  const [mobileReelIndex, setMobileReelIndex] = useState(0);
  const currentMobileReel = mobileReelsList[mobileReelIndex % mobileReelsList.length];
  const currentMobileSrc = currentMobileReel?.src;
  const currentMobilePoster = currentMobileReel?.poster;
  const currentMobileTitle = currentMobileReel?.title;

  const handleMobileNext = () => {
    setMobileReelIndex((prev) => (prev + 1) % mobileReelsList.length);
  };

  const handleMobilePrev = () => {
    setMobileReelIndex((prev) => (prev - 1 + mobileReelsList.length) % mobileReelsList.length);
  };

  // Mobile Touch Swipe Handling
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Horizontal swipe trigger
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        handleMobileNext();
      } else {
        handleMobilePrev();
      }
    }
  };

  // Mobile Full Screen Video Playback & Lifecycle
  useEffect(() => {
    if (!isMobile) return;
    const video = mobileVideoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = isMuted;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');

    const tryPlay = () => {
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    };

    tryPlay();
    video.addEventListener('canplay', tryPlay, { once: true });
    video.addEventListener('loadeddata', tryPlay, { once: true });

    // Interaction fallback for mobile browser policies
    const unlock = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
    window.addEventListener('click', unlock, { once: true, passive: true });

    // IntersectionObserver: Pause when hero is scrolled out of view to save mobile battery
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.05 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('click', unlock);
      video.removeEventListener('canplay', tryPlay);
      video.removeEventListener('loadeddata', tryPlay);
    };
  }, [isMobile, currentMobileSrc, isMuted]);

  // GSAP Entrance Timeline for the Hero (Synchronized with preloader completion)
  useEffect(() => {
    if (isPreloaderActive) {
      if (titleBrandRef.current) gsap.set(titleBrandRef.current, { y: 30, opacity: 0, scale: 0.96 });
      if (titleShootsRef.current) gsap.set(titleShootsRef.current, { y: 30, opacity: 0, scale: 0.96 });
      if (reelWallContainerRef.current) gsap.set(reelWallContainerRef.current, { opacity: 0, scale: 0.94 });
      if (mobileVideoContainerRef.current) gsap.set(mobileVideoContainerRef.current, { opacity: 0 });
      if (taglineRef.current) gsap.set(taglineRef.current, { y: -16, opacity: 0 });
      if (scrollIndicatorRef.current) gsap.set(scrollIndicatorRef.current, { y: 16, opacity: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Initial state
      gsap.set(
        [
          titleBrandRef.current,
          titleShootsRef.current,
          taglineRef.current,
          scrollIndicatorRef.current,
        ],
        { opacity: 0 }
      );

      gsap.set(titleBrandRef.current, { y: 30, scale: 0.96 });
      gsap.set(titleShootsRef.current, { y: 30, scale: 0.96 });
      if (reelWallContainerRef.current) gsap.set(reelWallContainerRef.current, { opacity: 0, scale: 0.94 });
      if (mobileVideoContainerRef.current) gsap.set(mobileVideoContainerRef.current, { opacity: 0 });
      gsap.set(taglineRef.current, { y: -16 });
      gsap.set(scrollIndicatorRef.current, { y: 16 });

      // Sequenced cinematic entrance
      if (reelWallContainerRef.current) {
        tl.to(
          reelWallContainerRef.current,
          { opacity: 1, scale: 1, duration: 0.95, ease: 'power2.out' },
          0.05
        );
      }
      if (mobileVideoContainerRef.current) {
        tl.to(
          mobileVideoContainerRef.current,
          { opacity: 1, duration: 0.85, ease: 'power2.out' },
          0.05
        );
      }

      tl.to(
        taglineRef.current,
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        0.15
      )
        .to(
          [titleBrandRef.current, titleShootsRef.current],
          { opacity: 1, y: 0, scale: 1, duration: 0.75, stagger: 0.08, ease: 'power3.out' },
          0.3
        )
        .to(scrollIndicatorRef.current, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.6);

      // Subtle float animation on scroll indicator
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          y: '+=5',
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1.2,
        });
      }

      // CINEMATIC EXIT SCRUB (HERO -> SECTION 02):
      if (heroRef.current) {
        const exitTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        });

        if (reelWallContainerRef.current) {
          exitTl.to(
            reelWallContainerRef.current,
            { y: -140, scale: 1.18, opacity: 0.12, filter: 'blur(6px)', ease: 'power1.out' },
            0
          );
        }

        if (mobileVideoContainerRef.current) {
          exitTl.to(
            mobileVideoContainerRef.current,
            { y: -70, scale: 1.05, opacity: 0.25, ease: 'power1.out' },
            0
          );
        }

        if (taglineRef.current) {
          exitTl.to(taglineRef.current, { y: -50, opacity: 0, ease: 'power1.out' }, 0);
        }

        if (titleBrandRef.current && titleShootsRef.current) {
          exitTl.to(
            [titleBrandRef.current, titleShootsRef.current],
            { y: -60, scale: 0.92, opacity: 0, filter: 'blur(8px)', ease: 'power1.out' },
            0
          );
        }

        if (scrollIndicatorRef.current) {
          exitTl.to(scrollIndicatorRef.current, { y: -30, opacity: 0, ease: 'power1.out' }, 0);
        }
      }
    }, heroRef);

    return () => ctx.revert();
  }, [isPreloaderActive]);

  const scrollToAbout = () => {
    if ((window as any).__lenis) {
      (window as any).__lenis.scrollTo('#what-we-do', { duration: 0.85 });
    } else {
      const el = document.getElementById('what-we-do');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full h-[100svh] min-h-[100svh] max-h-[100svh] md:h-[100dvh] md:max-h-[100dvh] bg-[#05070A] text-white overflow-hidden select-none"
    >
      {/* ========================================================= */}
      {/* 1. MOBILE CINEMATIC FULL SCREEN REEL (100% Full Bleed)    */}
      {/* ========================================================= */}
      <div
        ref={mobileVideoContainerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="block md:hidden absolute inset-0 w-full h-full overflow-hidden z-0 select-none"
      >
        {/* Instant high-res poster - prevents black flash */}
        <img
          src={currentMobilePoster}
          alt={currentMobileTitle || 'BrandShoots Reel'}
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center scale-[1.01] pointer-events-none select-none transition-opacity duration-300"
        />

        {/* Full-bleed vertical video */}
        <video
          ref={mobileVideoRef}
          src={currentMobileSrc}
          poster={currentMobilePoster}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-center scale-[1.01] pointer-events-none select-none"
        />

        {/* Top Gradient for Navbar, Logo & Menu Clarity */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#04060A]/95 via-[#04060A]/60 to-transparent pointer-events-none z-10" />

        {/* Cinematic Vignette for 35mm Film Depth */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'radial-gradient(circle at center, transparent 35%, rgba(4,6,10,0.45) 75%, rgba(4,6,10,0.85) 100%)',
          }}
        />
        <div className="absolute inset-0 bg-black/25 pointer-events-none z-10" />

        {/* Bottom Gradient for Tagline & BrandShoots Title Contrast */}
        <div
          className="absolute inset-x-0 bottom-0 h-80 pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(to top, #04060A 0%, rgba(4,6,10,0.96) 28%, rgba(4,6,10,0.7) 60%, transparent 100%)',
          }}
        />

        {/* Mobile Swipe Left / Right Navigation Controls */}
        <div className="absolute inset-y-0 left-2 flex items-center z-20 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleMobilePrev();
            }}
            aria-label="Previous Reel"
            className="w-8 h-8 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white/90 flex items-center justify-center active:scale-90 shadow-md cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-2 flex items-center z-20 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleMobileNext();
            }}
            aria-label="Next Reel"
            className="w-8 h-8 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white/90 flex items-center justify-center active:scale-90 shadow-md cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Reel Progress Capsule Dots */}
        <div className="absolute bottom-[17vh] inset-x-0 flex items-center justify-center gap-1.5 z-20 pointer-events-none">
          {Array.from({ length: Math.min(mobileReelsList.length, 10) }).map((_, idx) => (
            <span
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === (mobileReelIndex % Math.min(mobileReelsList.length, 10))
                  ? 'w-4 bg-[#008CFF] shadow-[0_0_8px_rgba(0,140,255,0.9)]'
                  : 'w-1 bg-white/35'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. DESKTOP CINEMATIC BACKGROUND ENVIRONMENTS & 3D CYLINDER*/}
      {/* ========================================================= */}
      <div className="hidden md:block absolute inset-0">
        <HeroCinematicBackground />
        <div className="absolute inset-0 cinema-grain pointer-events-none z-20 opacity-30" />
        <div className="absolute inset-0 cinema-vignette pointer-events-none z-10 opacity-55" />
      </div>

      {/* ========================================================= */}
      {/* 3. HEADER: TAGLINE (CREATE. SHOOT. GROW.)                 */}
      {/* ========================================================= */}
      <div
        ref={taglineRef}
        className="absolute top-[16vh] sm:top-[17vh] md:top-[18vh] lg:top-[19vh] left-0 right-0 z-30 font-mono text-[11px] sm:text-[13px] md:text-[14px] lg:text-[15px] tracking-[0.38em] sm:tracking-[0.48em] uppercase font-bold text-center pointer-events-none px-4"
      >
        <span className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          {hero?.taglinePrefix || 'CREATE. '}
        </span>
        <span className="text-[#008CFF] drop-shadow-[0_0_14px_rgba(0,140,255,0.85)]">
          {hero?.taglineAccent || 'SHOOT.'}
        </span>
        <span className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          {hero?.taglineSuffix || ' GROW.'}
        </span>
      </div>

      {/* ========================================================= */}
      {/* 4. REAL 3D CYLINDRICAL REEL WALL INSTALLATION (Desktop only) */}
      {/* ========================================================= */}
      <div
        ref={reelWallContainerRef}
        className="hidden md:block absolute top-[44%] sm:top-[44.5%] md:top-[45%] lg:top-[45.5%] left-0 right-0 -translate-y-1/2 w-full h-[430px] sm:h-[470px] md:h-[520px] lg:h-[550px] z-10 pointer-events-none overflow-hidden"
      >
        {!isMobile && (
          <ReelWall3D
            isPreloaderActive={isPreloaderActive}
            isMuted={isMuted}
            onToggleMute={toggleAudio}
          />
        )}
      </div>

      {/* Desktop Atmospheric Horizon Gradient Buffer */}
      <div
        className="hidden md:block absolute bottom-0 inset-x-0 h-32 sm:h-40 pointer-events-none z-20"
        style={{
          background:
            'linear-gradient(to top, #04060A 0%, rgba(4,6,10,0.92) 35%, rgba(4,6,10,0.4) 70%, transparent 100%)',
        }}
      />

      {/* ========================================================= */}
      {/* 5. CENTRAL TITLE: BRANDSHOOTS                             */}
      {/* ========================================================= */}
      <div className="absolute bottom-[9vh] sm:bottom-[9.5vh] md:bottom-[10vh] lg:bottom-[10.5vh] left-0 right-0 z-30 text-center select-none pointer-events-none px-4 sm:px-10">
        <h1 className="font-display font-black tracking-[-0.038em] uppercase text-[12.5vw] sm:text-[10vw] lg:text-[8.8vw] xl:text-[124px] 2xl:text-[132px] leading-[0.88] flex items-center justify-center">
          {/* BRAND — clean flat electric blue with glowing shadow */}
          <span
            ref={titleBrandRef}
            className="inline-block text-[#008CFF]"
            style={{ textShadow: '0 4px 28px rgba(0,0,0,0.95), 0 0 35px rgba(0,140,255,0.45)' }}
          >
            {hero?.brandTitle || 'BRAND'}
          </span>

          {/* SHOOTS — clean flat white with crisp shadow */}
          <span
            ref={titleShootsRef}
            className="inline-block text-white ml-[0.015em]"
            style={{ textShadow: '0 4px 28px rgba(0,0,0,0.95)' }}
          >
            {hero?.shootsTitle || 'SHOOTS'}
          </span>
        </h1>
      </div>

      {/* Scroll Down Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-[2.2vh] sm:bottom-[2.5vh] md:bottom-[2.8vh] left-0 right-0 z-30 flex flex-col items-center gap-1 cursor-pointer text-white/60 hover:text-white transition-colors duration-200"
        onClick={() => {
          scrollToAbout();
        }}
      >
        {/* Blue Down Arrow */}
        <svg
          className="w-4 h-4 text-[#008CFF] drop-shadow-[0_0_8px_#008CFF]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>

        {/* S C R O L L   D O W N */}
        <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.34em] sm:tracking-[0.38em] uppercase font-semibold text-white/70 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          Scroll Down
        </span>
      </div>

      {/* Audio Unmute / Mute Toggle Pill (Responsive) */}
      <button
        type="button"
        onClick={toggleAudio}
        className="absolute bottom-[3vh] right-4 sm:right-8 z-40 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/80 hover:text-white transition-all duration-200 active:scale-90 select-auto pointer-events-auto shadow-lg"
        aria-label={isMuted ? 'Unmute reel audio' : 'Mute reel audio'}
      >
        {isMuted ? (
          <VolumeX className="w-3.5 h-3.5 text-white/70" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-[#008CFF] drop-shadow-[0_0_6px_rgba(0,140,255,0.8)]" />
        )}
      </button>
    </section>
  );
};

export default BrandShootsHero;
