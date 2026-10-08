import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const MobileCinematicHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const bottomContentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  // Subtle GSAP scroll parallax linking hero video & typography to scroll progression
  useEffect(() => {
    const container = containerRef.current;
    const videoWrapper = videoWrapperRef.current;
    const bottomContent = bottomContentRef.current;
    if (!container || !videoWrapper || !bottomContent) return;

    const ctx = gsap.context(() => {
      // Gentle parallax depth on video as user scrolls
      gsap.to(videoWrapper, {
        y: 70,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.0,
        },
      });

      // Typography shifts upward with subtle fade into the next section
      gsap.to(bottomContent, {
        y: -35,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '75% top',
          scrub: 0.8,
        },
      });
    }, container);

    // Ensure video plays continuously on mobile (handling mobile battery saver / low power policies)
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented, ensure muted and retry on user touch
          video.muted = true;
          const handleFirstTouch = () => {
            video.play().catch(() => {});
            window.removeEventListener('touchstart', handleFirstTouch);
          };
          window.addEventListener('touchstart', handleFirstTouch, { once: true, passive: true });
        });
      }
    }

    return () => ctx.revert();
  }, []);

  const scrollToNextSection = () => {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo('#what-we-do', { duration: 0.95 });
    } else {
      const el = document.getElementById('what-we-do');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[100svh] max-h-[100svh] bg-[#04060A] text-white overflow-hidden select-none"
    >
      {/* ========================================================= */}
      {/* 1. DOMINANT CINEMATIC REEL VIDEO LAYER                    */}
      {/* ========================================================= */}
      <div
        ref={videoWrapperRef}
        className="absolute inset-0 w-full h-full will-change-transform overflow-hidden pointer-events-none"
      >
        <video
          ref={videoRef}
          src="/reels/wearebrandshoots_1777444216_3885805244420742638_77785749886.mp4"
          poster="/reels/posters/wearebrandshoots_1777444216_3885805244420742638_77785749886.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center scale-[1.04]"
        />
      </div>

      {/* ========================================================= */}
      {/* 2. CINEMATIC LIGHTING & EDITORIAL GRADIENTS               */}
      {/* ========================================================= */}
      {/* Top Gradient for Navbar, Logo & Hamburger Clarity */}
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#04060A]/95 via-[#04060A]/60 to-transparent pointer-events-none z-10" />

      {/* Subtle Cinema Vignette for 35mm Film Depth */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(circle at center, transparent 40%, rgba(4,6,10,0.55) 85%, rgba(4,6,10,0.85) 100%)',
        }}
      />

      {/* Bottom Gradient for Typography & Creed Contrast */}
      <div
        className="absolute inset-x-0 bottom-0 h-80 sm:h-96 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(to top, #04060A 0%, rgba(4,6,10,0.96) 28%, rgba(4,6,10,0.75) 55%, rgba(4,6,10,0.2) 80%, transparent 100%)',
        }}
      />


      {/* ========================================================= */}
      {/* 3. BOTTOM EDITORIAL HIERARCHY: BRANDSHOOTS + CREED + CUE */}
      {/* ========================================================= */}
      <div
        ref={bottomContentRef}
        className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center text-center px-5 pb-[calc(env(safe-area-inset-bottom,0px)+18px)] will-change-transform"
      >
        {/* BRANDSHOOTS Title in Figtree */}
        <h1
          ref={titleRef}
          className="font-figtree font-black uppercase tracking-[-0.038em] text-[clamp(2.5rem,11.8vw,4.1rem)] leading-[0.92] select-none flex items-center justify-center drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
        >
          <span
            className="text-[#008CFF]"
            style={{ textShadow: '0 4px 28px rgba(0,0,0,0.95), 0 0 35px rgba(0,140,255,0.45)' }}
          >
            BRAND
          </span>
          <span
            className="text-white ml-[0.02em]"
            style={{ textShadow: '0 4px 28px rgba(0,0,0,0.95)' }}
          >
            SHOOTS
          </span>
        </h1>

        {/* CREATE. SHOOT. GROW. Tagline */}
        <p
          ref={taglineRef}
          className="mt-3 font-figtree font-bold text-[clamp(0.72rem,2.8vw,0.86rem)] tracking-[0.38em] uppercase text-white/90 select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
        >
          <span className="text-white">CREATE. </span>
          <span className="text-[#008CFF] drop-shadow-[0_0_12px_rgba(0,140,255,0.85)]">
            SHOOT.
          </span>
          <span className="text-white"> GROW.</span>
        </p>

        {/* Minimal Scroll Down Cue (Not a bulky button, subtle drift) */}
        <div
          ref={scrollCueRef}
          onClick={scrollToNextSection}
          className="mt-5 flex flex-col items-center gap-1 cursor-pointer text-white/55 hover:text-white transition-colors duration-200 select-none py-1 px-3 group"
          role="button"
          tabIndex={0}
          aria-label="Scroll down to Video Production & Capabilities"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              scrollToNextSection();
            }
          }}
        >
          {/* Minimal Blue Arrow with gentle float */}
          <svg
            className="w-3.5 h-3.5 text-[#008CFF] drop-shadow-[0_0_8px_#008CFF] transition-transform duration-300 group-hover:translate-y-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>

          {/* S C R O L L   D O W N */}
          <span className="font-mono text-[9px] tracking-[0.34em] uppercase font-semibold text-white/60">
            SCROLL DOWN
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileCinematicHero;
