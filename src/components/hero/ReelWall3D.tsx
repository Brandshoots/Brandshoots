import React, { useEffect, useRef, useMemo } from 'react';
import { useCMSContent } from '../../lib/cms/useCMSContent';
import { INITIAL_HERO_REELS } from '../../lib/cms/seedData';
import { CMSHeroReel } from '../../types/cms';

export interface ReelWall3DProps {
  onLoaded?: () => void;
  isPreloaderActive?: boolean;
}

// 14 slots for a seamless 360-degree cylinder
const TOTAL_SLOTS = 14;

const HeroCylinderVideo: React.FC<{ src: string; poster?: string }> = React.memo(({ src, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');

    const startPlayback = () => {
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {
          const unlock = () => {
            video.play().catch(() => {});
          };
          window.addEventListener('click', unlock, { once: true, passive: true });
          window.addEventListener('touchstart', unlock, { once: true, passive: true });
        });
      }
    };

    startPlayback();
    video.addEventListener('loadeddata', startPlayback, { once: true });
    video.addEventListener('canplay', startPlayback, { once: true });
    video.addEventListener('loadedmetadata', startPlayback, { once: true });

    return () => {
      video.removeEventListener('loadeddata', startPlayback);
      video.removeEventListener('canplay', startPlayback);
      video.removeEventListener('loadedmetadata', startPlayback);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className="w-full h-full object-cover rounded-[15px]"
    />
  );
});
HeroCylinderVideo.displayName = 'HeroCylinderVideo';

export const ReelWall3D: React.FC<ReelWall3DProps> = ({ onLoaded }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotGroupRef = useRef<HTMLDivElement>(null);

  // Read live CMS reels synced across tabs & Firebase
  const { heroReels } = useCMSContent();

  const activeReels: CMSHeroReel[] = useMemo(() => {
    if (heroReels && heroReels.length > 0) {
      const visible = heroReels.filter((r) => r.visible !== false);
      if (visible.length > 0) return visible;
    }
    return INITIAL_HERO_REELS;
  }, [heroReels]);

  // Seamless 14-slot cylinder arrangement
  const cylinderItems = useMemo(() => {
    return Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
      ...activeReels[i % activeReels.length],
      slotIndex: i,
    }));
  }, [activeReels]);

  useEffect(() => {
    if (onLoaded) {
      onLoaded();
    }

    // Interactive subtle mouse parallax damping
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number | null = null;
    let isInView = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isInView) return;
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = (e.clientX - halfW) / halfW;
      mouseY = (e.clientY - halfH) / halfH;
    };

    const updateParallax = () => {
      if (!isInView || document.hidden) {
        rafId = null;
        return;
      }
      currentX += (mouseX * 4 - currentX) * 0.05;
      currentY += (-mouseY * 2.5 - currentY) * 0.05;

      if (rotGroupRef.current) {
        rotGroupRef.current.style.setProperty('--mouse-rx', `${currentY}deg`);
        rotGroupRef.current.style.setProperty('--mouse-ry', `${currentX}deg`);
      }
      rafId = requestAnimationFrame(updateParallax);
    };

    const startLoop = () => {
      if (!rafId && isInView && !document.hidden) {
        rafId = requestAnimationFrame(updateParallax);
      }
    };

    const stopLoop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    startLoop();

    // IntersectionObserver: Pause cylinder videos & GPU rotation when scrolled out of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInView = entry.isIntersecting;
          const vids = containerRef.current?.querySelectorAll('video');
          if (isInView && !document.hidden) {
            if (rotGroupRef.current) {
              rotGroupRef.current.style.animationPlayState = 'running';
            }
            vids?.forEach((v) => {
              if (v.paused) v.play().catch(() => {});
            });
            startLoop();
          } else {
            if (rotGroupRef.current) {
              rotGroupRef.current.style.animationPlayState = 'paused';
            }
            vids?.forEach((v) => {
              if (!v.paused) v.pause();
            });
            stopLoop();
          }
        });
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Visibility change listener: pause decoders when tab is hidden
    const handleVisibilityChange = () => {
      const vids = containerRef.current?.querySelectorAll('video');
      if (document.hidden) {
        stopLoop();
        vids?.forEach((v) => {
          if (!v.paused) v.pause();
        });
      } else if (isInView) {
        vids?.forEach((v) => {
          if (v.paused) v.play().catch(() => {});
        });
        startLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Unmute/play on user interaction fallback
    const handleUnlock = () => {
      const vids = containerRef.current?.querySelectorAll('video');
      vids?.forEach((v) => {
        if (v.paused) v.play().catch(() => {});
      });
      window.removeEventListener('pointerdown', handleUnlock);
    };
    window.addEventListener('pointerdown', handleUnlock, { once: true });

    return () => {
      stopLoop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointerdown', handleUnlock);
    };
  }, [onLoaded]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center pointer-events-none select-none overflow-hidden"
    >
      {/* ======================================================== */}
      {/* 1. CINEMATIC 3D CYLINDER INSTALLATION SCENE              */}
      {/* ======================================================== */}
      <div
        className="cylinder-scene relative w-full h-[430px] sm:h-[470px] md:h-[540px] lg:h-[580px] flex items-center justify-center"
        style={{
          perspective: '37rem',
          WebkitMaskImage:
            'linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)',
          maskImage:
            'linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)',
        }}
      >
        <div
          ref={rotGroupRef}
          className="cylinder-rotator"
          style={{
            display: 'grid',
            placeSelf: 'center',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {cylinderItems.map((item) => (
            <div
              key={`${item.id}-${item.slotIndex}-${item.src}`}
              className="cylinder-card group"
              style={{
                ['--i' as string]: item.slotIndex,
                ['--n' as string]: TOTAL_SLOTS,
              }}
            >
              <div className="relative w-full h-full rounded-[16px] overflow-hidden bg-[#07090E] border border-white/10 ring-1 ring-black/80 shadow-[0_16px_50px_rgba(0,0,0,0.95)]">
                {/* Real 9:16 BrandShoots Video with Autoplay Guarantee */}
                <HeroCylinderVideo src={item.src} poster={item.poster} />

                {/* Subtle Inner Bezel Glass Glare */}
                <div className="absolute inset-0 pointer-events-none rounded-[15px] bg-gradient-to-b from-white/10 via-transparent to-black/40" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MATHEMATICALLY FORMULATED CYLINDER CSS                */}
      {/* ======================================================== */}
      <style>{`
        .cylinder-rotator {
          animation: cylinderAutoRotate 34s linear infinite;
          transform: rotateX(var(--mouse-rx, 0deg)) rotateY(var(--mouse-ry, 0deg));
        }

        @keyframes cylinderAutoRotate {
          from {
            transform: rotateX(var(--mouse-rx, 0deg)) rotateY(calc(0deg + var(--mouse-ry, 0deg)));
          }
          to {
            transform: rotateX(var(--mouse-rx, 0deg)) rotateY(calc(360deg + var(--mouse-ry, 0deg)));
          }
        }

        .cylinder-card {
          --w: 236px;
          --ba: calc(360deg / var(--n));
          /* tan(180deg / 14) = tan(12.857deg) = 0.22824 */
          --radius: calc((0.5 * var(--w) + 7px) / 0.22824);
          grid-area: 1 / 1;
          width: var(--w);
          aspect-ratio: 9 / 16;
          backface-visibility: hidden;
          will-change: transform;
          transform:
            rotateY(calc(var(--i) * var(--ba)))
            translateZ(calc(-1 * var(--radius)));
        }

        @media (max-width: 1440px) {
          .cylinder-card {
            --w: 215px;
          }
        }

        @media (max-width: 1024px) {
          .cylinder-card {
            --w: 190px;
          }
          .cylinder-scene {
            perspective: 34rem !important;
          }
        }

        /* Dedicated Mobile View (< 768px): 4-5 visible 9:16 reels across 75-85% width */
        @media (max-width: 767px) {
          .cylinder-scene {
            height: 370px !important;
            perspective: 34rem !important;
          }
          .cylinder-rotator {
            animation: cylinderAutoRotateMobile 32s linear infinite !important;
            transform: translateZ(-250px) rotateX(var(--mouse-rx, 0deg)) rotateY(var(--mouse-ry, 0deg));
          }
          @keyframes cylinderAutoRotateMobile {
            from {
              transform: translateZ(-250px) rotateX(var(--mouse-rx, 0deg)) rotateY(calc(0deg + var(--mouse-ry, 0deg)));
            }
            to {
              transform: translateZ(-250px) rotateX(var(--mouse-rx, 0deg)) rotateY(calc(360deg + var(--mouse-ry, 0deg)));
            }
          }
          .cylinder-card {
            --w: 148px !important;
            --radius: 255px !important;
            --ba: calc(360deg / var(--n));
            grid-area: 1 / 1;
            width: var(--w);
            aspect-ratio: 9 / 16;
            backface-visibility: hidden;
            will-change: transform;
            transform:
              rotateY(calc(var(--i) * var(--ba)))
              translateZ(var(--radius)) !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cylinder-rotator {
            animation-duration: 90s;
          }
        }
      `}</style>
    </div>
  );
};

export default ReelWall3D;
