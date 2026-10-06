import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ClientItem {
  id: string;
  name: string;
  logo: string;
  slug: string;
}

export const CLIENTS_LIST: ClientItem[] = [
  { id: 'santhi-pipes', name: 'Santhi Pipes', logo: '/clients/Shanti Pipes.png', slug: 'santhi-pipes' },
  { id: 'bags-world', name: 'Bags World', logo: '/clients/Bags World Logo.PNG', slug: 'bags-world' },
  { id: 'aabharan-jewellers', name: 'Aabharan Jewellers', logo: '/clients/Aabharan Logo.png', slug: 'aabharan-jewellers' },
  { id: 'fresh-fresh', name: 'Fresh & Fresh', logo: '/clients/Fresh and Fresh Logo.png', slug: 'fresh-and-fresh' },
  { id: 'dayanidhi', name: 'Dayanidhi Creations', logo: '/clients/Dayanidhi Logo.png', slug: 'dayanidhi-creations' },
  { id: 'jain-beauty', name: 'Jain Beauty Studio', logo: '/clients/Jain Beauty Logo.png', slug: 'jain-beauty' },
  { id: 'rk-home', name: 'RK Home Living', logo: '/clients/Rk home.png', slug: 'rk-home-living' },
  { id: 'sb-ventures', name: 'SB Ventures', logo: '/clients/SB Ventures Logo.png', slug: 'sb-ventures' },
  { id: 'kc-overseas', name: 'KC Overseas', logo: '/clients/KC Overseas Logo.PNG', slug: 'kc-overseas' },
  { id: 'srk-doors', name: 'SRK Doors World', logo: '/clients/SRK Doors World Logo.png', slug: 'srk-doors-world' },
  { id: 'jain-enterprises', name: 'Jain Enterprises', logo: '/clients/Jain Enterprises Logo.png', slug: 'jain-enterprises' },
  { id: 'nirmala', name: 'Nirmala', logo: '/clients/Nirmala logo.png', slug: 'nirmala' },
  { id: 'rudra', name: 'Rudra', logo: '/clients/Rudra logo.png', slug: 'rudra' },
  { id: 'sahana', name: 'Sahana', logo: '/clients/Sahana Logo.PNG', slug: 'sahana' },
  { id: 't3', name: 'T3 Studio', logo: '/clients/T3 Logo.png', slug: 't3' },
];

export const OurClientsSection: React.FC = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  // Active continuous progress
  const [activeProgress, setActiveProgress] = useState<number>(0);
  const activeProgressRef = useRef<number>(0);
  const targetProgressRef = useRef<number>(0);

  // Drag interaction flags
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startProgressRef = useRef<number>(0);

  const totalItems = CLIENTS_LIST.length;

  // Normalized circular active index (0 to totalItems - 1)
  const normActive = ((activeProgress % totalItems) + totalItems) % totalItems;
  const activeIndex = Math.round(normActive) % totalItems;

  // 1. Smooth Lerp loop for continuous auto-playing 3D carousel physics (60fps)
  useEffect(() => {
    let animId: number;

    const tick = () => {
      // Continuous auto-sliding carousel (always gently advancing forward)
      if (!isDraggingRef.current) {
        targetProgressRef.current += 0.0032;
      }

      const diff = targetProgressRef.current - activeProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        activeProgressRef.current += diff * 0.12;
        setActiveProgress(activeProgressRef.current);
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 2. GSAP ScrollTrigger: natural scroll movement as user scrolls past section (useLayoutEffect for clean DOM unmount)
  useLayoutEffect(() => {
    let pinTrigger: ReturnType<typeof ScrollTrigger.create> | null = null;
    const ctx = gsap.context(() => {
      if (sectionRef.current) {
        // Heading reveal on viewport entry
        if (headingRef.current) {
          gsap.fromTo(
            headingRef.current,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        // SNAP LOCK AT 100VH + SCROLL 3-5 LOGOS THEN NEXT SECTION:
        // Locks the section full screen (100vh). As user scrolls, it rotates ~4 client logos (3 to 5 logos).
        // Once those 3-5 logos have scrolled, it releases and transitions to the next section.
        let lastProgress = 0;
        pinTrigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * 1.6)}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          snap: {
            snapTo: (value: number) => (value < 0.1 ? 0 : value > 0.88 ? 1 : value),
            duration: { min: 0.25, max: 0.5 },
            delay: 0.08,
            ease: 'power2.out',
          },
          onUpdate: (self) => {
            if (!isDraggingRef.current) {
              const delta = self.progress - lastProgress;
              lastProgress = self.progress;
              if (Math.abs(delta) > 0.0001) {
                // Advance 4 logos over the 100vh locked pin duration (3-5 logos)
                targetProgressRef.current += delta * 4.0;
              }
            }
          },
        });
      }
    }, sectionRef);

    return () => {
      // Kill pinned ScrollTrigger FIRST before reverting context.
      // If we don't, GSAP tries removeChild on a pin-spacer that React already detached → crash.
      try {
        if (pinTrigger) {
          pinTrigger.kill(true);
          pinTrigger = null;
        }
      } catch (_) {
        // swallow any edge-case DOM errors during unmount
      }
      try {
        ctx.revert();
      } catch (_) {
        // swallow any edge-case DOM errors during unmount
      }
    };
  }, [totalItems]);

  // 3. Mouse & Touch Drag Handlers (User-Controlled)
  const handlePointerDown = (clientX: number) => {
    isDraggingRef.current = true;
    startXRef.current = clientX;
    startProgressRef.current = targetProgressRef.current;
  };

  const handlePointerMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current) return;
    const deltaX = clientX - startXRef.current;
    const sensitivity = window.innerWidth < 768 ? 0.004 : 0.0028;
    targetProgressRef.current = startProgressRef.current - deltaX * sensitivity;
  }, []);

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // 4. Wheel Handler over carousel container
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      targetProgressRef.current += e.deltaX * 0.002;
    }
  };

  // 5. Click item: if center -> navigate to project view; if side -> rotate to center
  const handleItemClick = (index: number, item: ClientItem) => {
    let diff = index - normActive;
    while (diff > totalItems / 2) diff -= totalItems;
    while (diff < -totalItems / 2) diff += totalItems;

    if (Math.abs(diff) < 0.45) {
      navigate(`/portfolio/${item.slug}`);
    } else {
      targetProgressRef.current = activeProgressRef.current + diff;
    }
  };

  return (
    <div id="clients-chapter" className="relative w-full">
      <section
        id="clients"
        ref={sectionRef}
        className="relative w-full h-[100dvh] max-h-[100dvh] bg-[#05070B] text-white flex flex-col justify-between py-4 sm:py-6 lg:py-8 px-4 sm:px-8 lg:px-12 select-none overflow-hidden snap-start snap-always"
      >
      {/* Background Architectural Atmosphere & Blue Aura */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1200px] h-[550px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.10) 0%, rgba(0, 80, 200, 0.03) 45%, transparent 75%)',
            filter: 'blur(80px)',
          }}
        />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* ======================================================== */}
      {/* TOP: MINIMAL EDITORIAL HEADING + DEDICATED CTA BUTTON    */}
      {/* ======================================================== */}
      <div
        ref={headingRef}
        className="relative w-full max-w-[1720px] mx-auto flex flex-col items-center text-center pt-1 sm:pt-2 z-20 shrink-0"
      >
        {/* Master Heading */}
        <h2 className="font-editorial font-black uppercase text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none text-white">
          OUR CLIENTS
        </h2>

        {/* Dedicated "OUR PORTFOLIO" Pill CTA */}
        <button
          type="button"
          onClick={() => navigate('/portfolio/santhi-pipes')}
          className="mt-5 sm:mt-7 inline-flex items-center gap-2 px-5 sm:px-6 py-1.5 sm:py-2.5 rounded-full bg-white/5 hover:bg-[#008CFF]/15 border border-white/15 hover:border-[#008CFF]/50 text-white/90 hover:text-white text-xs sm:text-sm font-mono uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] group/cta cursor-pointer"
        >
          <span>OUR PORTFOLIO</span>
          <svg
            className="w-3.5 h-3.5 text-[#008CFF] group-hover/cta:translate-x-1 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      {/* ======================================================== */}
      {/* CENTERPIECE: 3D CLIENT LOGO SHOWCASE STACK (NO REEL CARDS) */}
      {/* ======================================================== */}
      <div
        ref={carouselContainerRef}
        onWheel={handleWheel}
        onMouseDown={(e) => handlePointerDown(e.clientX)}
        onMouseMove={(e) => handlePointerMove(e.clientX)}
        onMouseUp={handlePointerUp}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
        onTouchEnd={handlePointerUp}
        className="relative w-full max-w-[1720px] mx-auto flex-1 min-h-[250px] max-h-[50vh] sm:max-h-[54vh] my-auto flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
        style={{ perspective: '1400px' }}
      >
        {CLIENTS_LIST.map((item, index) => {
          // Circular symmetric wrapping math
          let diff = index - normActive;
          while (diff > totalItems / 2) diff -= totalItems;
          while (diff < -totalItems / 2) diff += totalItems;

          const absDiff = Math.abs(diff);

          // Hide tiles that are far around the back
          if (absDiff > 3.6) return null;

          // Continuous smoothly interpolated metrics (Zero harsh popping or stepped jumps)
          const activeFactor = Math.max(0, 1 - absDiff * 1.8);

          // 3D Geometry Calculation for 1:1 Square Brand Tiles
          const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768;
          const xPercent = diff * (isMobileView ? 92 : 86); // Refined horizontal spread to eliminate corner clipping
          const yArc = absDiff * absDiff * 12; // Gentle downward arc
          const rotDeg = diff * 5.2; // Controlled angular rotation
          const scale = Math.max(0.72, 1 - absDiff * 0.08); // Progressive scale depth
          const zIndex = Math.round(100 - absDiff * 10);
          const opacity = Math.max(0.18, 1 - absDiff * 0.22);

          // C1-Smooth continuous depth-of-field blur (Zero sudden step jumps, completely soft and cinematic)
          const blurAmount = absDiff <= 0.4
            ? 0
            : Math.min(4.5, Math.pow((absDiff - 0.4) / 1.4, 1.25) * 3.5);

          return (
            <div
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                handleItemClick(index, item);
              }}
              className="absolute top-1/2 left-1/2 cursor-pointer select-none group/tile w-[230px] xs:w-[260px] sm:w-[310px] md:w-[365px] lg:w-[410px] aspect-square"
              style={{
                transform: `translate(-50%, -50%) translate3d(${xPercent}%, ${yArc}px, 0) rotate(${rotDeg}deg) scale(${scale})`,
                zIndex,
                opacity,
                filter: blurAmount > 0.05 ? `blur(${blurAmount.toFixed(2)}px)` : 'none',
                transformOrigin: '50% 100%',
                willChange: 'transform, opacity, filter',
              }}
            >
              {/* Studio Glass Client Tile (1:1 Ratio Tile) */}
              <div
                className="relative w-full h-full rounded-2xl overflow-hidden border flex flex-col justify-between transition-all duration-300"
                style={{
                  backgroundColor: '#07090E',
                  borderColor: `rgba(${Math.round(255 - 255 * activeFactor)}, ${Math.round(255 - 115 * activeFactor)}, 255, ${(0.10 + 0.65 * activeFactor).toFixed(2)})`,
                  boxShadow: activeFactor > 0.1
                    ? `0 20px 50px rgba(0, 140, 255, ${(0.22 * activeFactor).toFixed(2)}), 0 10px 30px rgba(0, 0, 0, 0.8)`
                    : '0 10px 30px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* Center: Undistorted Client Logo (Maximized in 1:1 Tile) */}
                <div className="relative z-10 w-full flex-1 flex items-center justify-center p-3 sm:p-5 md:p-6 min-h-0">
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="max-h-[145px] xs:max-h-[170px] sm:max-h-[220px] md:max-h-[260px] lg:max-h-[295px] max-w-[90%] w-auto h-auto object-contain filter drop-shadow-[0_4px_24px_rgba(0,0,0,0.75)] brightness-105 select-none transition-transform duration-300 group-hover/tile:scale-105"
                    draggable={false}
                  />
                </div>

                {/* Bottom: Client Name & Discrete Action Arrow (Smoothly fades in when focused) */}
                <div
                  className="relative z-10 px-4 sm:px-6 pb-2.5 pt-2 sm:pb-3.5 sm:pt-2.5 border-t border-white/10 flex items-center justify-between shrink-0 transition-opacity duration-200"
                  style={{ opacity: Math.max(0, 1 - absDiff * 1.6) }}
                >
                  <h3 className="font-editorial font-bold text-xs xs:text-sm sm:text-base text-white group-hover/tile:text-[#008CFF] transition-colors tracking-wide leading-tight truncate pr-2">
                    {item.name}
                  </h3>
                  <svg
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/30 group-hover/tile:text-[#008CFF] group-hover/tile:translate-x-1 transition-all duration-300 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>

                {/* Electric Blue Active Rim Light (Smoothly fades in & out) */}
                <div
                  className="absolute inset-0 rounded-2xl border-2 border-[#008CFF] pointer-events-none shadow-[inset_0_0_20px_rgba(0,140,255,0.25)] transition-opacity duration-200"
                  style={{ opacity: activeFactor }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* BOTTOM: MINIMAL USER CONTROLS (PAGINATION & ARROWS)      */}
      {/* ======================================================== */}
      <div className="relative w-full max-w-[1720px] mx-auto flex items-center justify-between z-20 pb-1 sm:pb-2 border-t border-white/10 pt-3 sm:pt-4 shrink-0">
        {/* Active Client Name */}
        <div className="flex items-center gap-2.5">
          <span className="font-editorial font-bold text-sm sm:text-base text-white tracking-wide">
            {CLIENTS_LIST[activeIndex]?.name}
          </span>
        </div>

        {/* Pagination Navigation Dots */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {CLIENTS_LIST.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                let diff = i - normActive;
                while (diff > totalItems / 2) diff -= totalItems;
                while (diff < -totalItems / 2) diff += totalItems;
                targetProgressRef.current = activeProgressRef.current + diff;
              }}
              aria-label={`Jump to ${c.name}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === i
                  ? 'w-6 sm:w-8 bg-[#008CFF] shadow-[0_0_8px_#008CFF]'
                  : 'w-1.5 sm:w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Quick Prev / Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              targetProgressRef.current = Math.round(targetProgressRef.current) - 1;
            }}
            aria-label="Previous Client"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => {
              targetProgressRef.current = Math.round(targetProgressRef.current) + 1;
            }}
            aria-label="Next Client"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  </div>
);
};

export default OurClientsSection;
