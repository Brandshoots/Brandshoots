import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCMSContent } from '../../lib/cms/useCMSContent';
import { INITIAL_HERO_REELS } from '../../lib/cms/seedData';
import { CMSHeroReel } from '../../types/cms';

export interface ReelWall3DProps {
  onLoaded?: () => void;
  isPreloaderActive?: boolean;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

// 14 slots for a seamless 360-degree cylinder
const TOTAL_SLOTS = 14;
const SLOT_ANGLE = 360 / TOTAL_SLOTS; // ~25.7142857deg per slot
const REEL_DWELL_MS = 5200; // Time active center reel plays before snapping

interface CylinderCardProps {
  item: CMSHeroReel & { slotIndex: number };
  isCenter: boolean;
  isMuted: boolean;
  onToggleMute?: () => void;
  onSelectSlot: (slotIndex: number) => void;
}

const CylinderCard: React.FC<CylinderCardProps> = React.memo(
  ({
    item,
    isCenter,
    isMuted,
    onToggleMute,
    onSelectSlot,
  }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Audio volume & mute synchronization
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;
      video.muted = isMuted;
      video.defaultMuted = isMuted;
      if (isMuted) {
        video.setAttribute('muted', '');
      } else {
        video.removeAttribute('muted');
      }
    }, [isMuted]);

    // Active center reel video lifecycle & reliable autoplay
    useEffect(() => {
      const video = videoRef.current;
      if (!video || !isCenter) return;

      video.defaultMuted = true;
      video.muted = isMuted;
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
            // Fallback: browser strictly requires muted autoplay
            video.muted = true;
            video.play().catch(() => {});
          });
        }
      };

      startPlayback();
      video.addEventListener('loadeddata', startPlayback, { once: true });
      video.addEventListener('canplay', startPlayback, { once: true });
      video.addEventListener('loadedmetadata', startPlayback, { once: true });

      // Unlock on user interaction if browser policy demands gesture
      const unlock = () => {
        if (video.paused) {
          video.play().catch(() => {});
        }
      };
      window.addEventListener('click', unlock, { once: true, passive: true });
      window.addEventListener('touchstart', unlock, { once: true, passive: true });

      return () => {
        window.removeEventListener('click', unlock);
        window.removeEventListener('touchstart', unlock);
        video.removeEventListener('loadeddata', startPlayback);
        video.removeEventListener('canplay', startPlayback);
        video.removeEventListener('loadedmetadata', startPlayback);
        video.pause();
        // Immediately release hardware video decoder
        video.removeAttribute('src');
        video.load();
      };
    }, [isCenter, item.src]);

    const handleClick = useCallback(() => {
      onSelectSlot(item.slotIndex);
    }, [onSelectSlot, item.slotIndex]);

    return (
      <div
        onClick={handleClick}
        className={`cylinder-card group cursor-pointer ${
          isCenter ? 'cylinder-card-center' : ''
        }`}
        style={{
          ['--i' as string]: item.slotIndex,
          ['--n' as string]: TOTAL_SLOTS,
        }}
        title={isCenter ? item.title : `Switch to ${item.title}`}
      >
        <div className="relative w-full h-full rounded-[16px] overflow-hidden bg-[#07090E] border border-white/10 ring-1 ring-black/80 shadow-[0_16px_50px_rgba(0,0,0,0.95)]">
          {/* 1. Instant High-Res Poster Image (Always rendered underneath - prevents ANY black frame or loading flash) */}
          <img
            src={item.poster}
            alt={item.title || 'BrandShoots Reel'}
            loading="eager"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover rounded-[15px] pointer-events-none select-none z-0"
          />

          {/* 2. Single Active Video (Mounted on demand ONLY when reel is centered) */}
          {isCenter && (
            <video
              ref={videoRef}
              src={item.src}
              poster={item.poster}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover rounded-[15px] pointer-events-none select-none z-10"
            />
          )}

          {/* 3. Subtle Inner Bezel Glass Glare */}
          <div className="absolute inset-0 pointer-events-none rounded-[15px] bg-gradient-to-b from-white/10 via-transparent to-black/40 z-20" />

          {/* 4. Center Reel Audio Toggle & Indicator */}
          {isCenter && onToggleMute && (
            <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 pointer-events-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMute();
                }}
                className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition-all active:scale-90 shadow-md cursor-pointer"
                aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-white/80" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#008CFF] drop-shadow-[0_0_6px_rgba(0,140,255,0.8)]" />
                )}
              </button>
            </div>
          )}

          {/* 5. Subtle Cyan Rim for Center Reel */}
          {isCenter && (
            <div className="absolute inset-0 rounded-[15px] border border-[#008CFF]/35 pointer-events-none shadow-[inset_0_0_24px_rgba(0,140,255,0.2)] z-20" />
          )}
        </div>
      </div>
    );
  }
);
CylinderCard.displayName = 'CylinderCard';

export const ReelWall3D: React.FC<ReelWall3DProps> = ({
  onLoaded,
  isPreloaderActive = false,
  isMuted: controlledMuted,
  onToggleMute: controlledToggleMute,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotGroupRef = useRef<HTMLDivElement>(null);

  // Internal audio state fallback if not controlled from parent
  const [internalMuted, setInternalMuted] = useState(true);
  const isMuted = controlledMuted !== undefined ? controlledMuted : internalMuted;
  const toggleMute = controlledToggleMute || (() => setInternalMuted((prev) => !prev));

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

  // Rotational State Management for Snapping Carousel
  const [stepIndex, setStepIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [dragOffsetAngle, setDragOffsetAngle] = useState(0);
  const dragStartX = useRef(0);
  const hasDraggedRef = useRef(false);

  // Active Center Slot Index
  const centerSlotIndex = useMemo(() => {
    return ((stepIndex % TOTAL_SLOTS) + TOTAL_SLOTS) % TOTAL_SLOTS;
  }, [stepIndex]);

  const centerSlotIndexRef = useRef(centerSlotIndex);
  centerSlotIndexRef.current = centerSlotIndex;
  const stepIndexRef = useRef(stepIndex);
  stepIndexRef.current = stepIndex;

  // Smooth Snap Transition to a Target Step
  const snapTo = useCallback((targetStep: number) => {
    setStepIndex(targetStep);
  }, []);

  const snapNext = useCallback(() => {
    if (isDragging) return;
    snapTo(stepIndexRef.current + 1);
  }, [isDragging, snapTo]);

  const snapPrev = useCallback(() => {
    if (isDragging) return;
    snapTo(stepIndexRef.current - 1);
  }, [isDragging, snapTo]);

  const snapToSlot = useCallback(
    (targetSlotIndex: number) => {
      const currentCenter = centerSlotIndexRef.current;
      const currentStep = stepIndexRef.current;
      if (isDragging || hasDraggedRef.current || targetSlotIndex === currentCenter) return;
      let diff = targetSlotIndex - currentCenter;
      if (diff > TOTAL_SLOTS / 2) diff -= TOTAL_SLOTS;
      if (diff < -TOTAL_SLOTS / 2) diff += TOTAL_SLOTS;
      snapTo(currentStep + diff);
    },
    [isDragging, snapTo]
  );

  // Dwell timer: plays active center video, then snaps to next reel
  useEffect(() => {
    if (isPreloaderActive || isHovered || isDragging || !isInView) return;

    const timer = setInterval(() => {
      snapNext();
    }, REEL_DWELL_MS);

    return () => clearInterval(timer);
  }, [isPreloaderActive, isHovered, isDragging, isInView, snapNext]);

  // Mouse Parallax & Intersection Observer
  useEffect(() => {
    if (onLoaded) {
      onLoaded();
    }

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number | null = null;
    let inView = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (!inView) return;
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = (e.clientX - halfW) / halfW;
      mouseY = (e.clientY - halfH) / halfH;
    };

    const updateParallax = () => {
      if (!inView || document.hidden) {
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
      if (!rafId && inView && !document.hidden) {
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

    // IntersectionObserver: Pause video & timer when hero leaves viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          inView = entry.isIntersecting;
          setIsInView(entry.isIntersecting);
          const vids = containerRef.current?.querySelectorAll('video');
          if (inView && !document.hidden) {
            vids?.forEach((v) => {
              if (v.paused) v.play().catch(() => {});
            });
            startLoop();
          } else {
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

    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsInView(isVisible);
      const vids = containerRef.current?.querySelectorAll('video');
      if (document.hidden) {
        stopLoop();
        vids?.forEach((v) => {
          if (!v.paused) v.pause();
        });
      } else if (inView) {
        vids?.forEach((v) => {
          if (v.paused) v.play().catch(() => {});
        });
        startLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopLoop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [onLoaded]);

  // Pointer Drag & Touch Handling
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    dragStartX.current = e.clientX;
    hasDraggedRef.current = false;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX.current;
    if (Math.abs(deltaX) > 8) {
      hasDraggedRef.current = true;
    }
    // Drag sensitivity in degrees
    const angleDelta = deltaX * 0.16;
    setDragOffsetAngle(angleDelta);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const draggedSlots = Math.round(dragOffsetAngle / SLOT_ANGLE);
    setDragOffsetAngle(0);

    if (draggedSlots !== 0) {
      snapTo(stepIndex - draggedSlots);
    }

    if (hasDraggedRef.current) {
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 100);
    }
  };

  // Base rotation angle from stepIndex + optional drag offset
  const baseRotationY = -(stepIndex * SLOT_ANGLE) + dragOffsetAngle;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center pointer-events-none select-none overflow-hidden"
    >
      {/* ======================================================== */}
      {/* 1. CINEMATIC 3D CYLINDER INSTALLATION SCENE              */}
      {/* ======================================================== */}
      <div
        className="cylinder-scene relative w-full h-[430px] sm:h-[470px] md:h-[540px] lg:h-[580px] flex items-center justify-center pointer-events-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (isDragging) handlePointerUp();
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          perspective: '37rem',
          WebkitMaskImage:
            'linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)',
          maskImage:
            'linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)',
          touchAction: 'pan-y',
        }}
      >
        {/* Layer 1: Parallax Gimbal (updated at 60fps with ZERO transition delay/jank) */}
        <div
          ref={rotGroupRef}
          className="cylinder-parallax"
          style={{
            display: 'grid',
            placeSelf: 'center',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Layer 2: Rotational Carousel (smooth snapping transition) */}
          <div
            className={`cylinder-rotator ${isDragging ? 'cylinder-rotator-dragging' : ''}`}
            style={{
              display: 'grid',
              placeSelf: 'center',
              transformStyle: 'preserve-3d',
              willChange: 'transform',
              ['--rot-y' as string]: `${baseRotationY}deg`,
            }}
          >
            {cylinderItems.map((item) => (
              <CylinderCard
                key={`${item.id}-${item.slotIndex}`}
                item={item}
                isCenter={item.slotIndex === centerSlotIndex}
                isMuted={isMuted}
                onToggleMute={toggleMute}
                onSelectSlot={snapToSlot}
              />
            ))}
          </div>
        </div>

        {/* Navigation Chevrons on sides (Available on both desktop & mobile) */}
        <div className="flex absolute inset-y-0 left-2 sm:left-3 md:left-6 items-center z-30 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              snapPrev();
            }}
            aria-label="Previous Reel"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/55 hover:bg-black/80 backdrop-blur-md border border-white/15 hover:border-white/30 text-white/80 hover:text-white flex items-center justify-center transition-all active:scale-90 shadow-lg cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="flex absolute inset-y-0 right-2 sm:right-3 md:right-6 items-center z-30 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              snapNext();
            }}
            aria-label="Next Reel"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/55 hover:bg-black/80 backdrop-blur-md border border-white/15 hover:border-white/30 text-white/80 hover:text-white flex items-center justify-center transition-all active:scale-90 shadow-lg cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Mobile Single Reel Pagination Cue */}
        <div className="sm:hidden absolute bottom-1.5 inset-x-0 flex items-center justify-center gap-1.5 z-30 pointer-events-none">
          {Array.from({ length: Math.min(activeReels.length, 14) }).map((_, idx) => (
            <span
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === (centerSlotIndex % Math.min(activeReels.length, 14))
                  ? 'w-4 bg-[#008CFF] shadow-[0_0_8px_rgba(0,140,255,0.85)]'
                  : 'w-1 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MATHEMATICALLY FORMULATED CYLINDER CSS                */}
      {/* ======================================================== */}
      <style>{`
        .cylinder-parallax {
          transform: rotateX(var(--mouse-rx, 0deg)) rotateY(var(--mouse-ry, 0deg));
          /* Zero transition so mouse parallax is instantaneous at 60fps */
        }

        .cylinder-rotator {
          transition: transform 0.85s cubic-bezier(0.25, 1, 0.5, 1);
          transform: rotateY(var(--rot-y, 0deg));
        }

        .cylinder-rotator.cylinder-rotator-dragging {
          transition: none !important;
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
          transition: filter 0.4s ease, opacity 0.4s ease;
        }

        .cylinder-card-center {
          filter: brightness(1.05);
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

        /* Dedicated Mobile View (< 768px): STRICTLY ONE SINGLE FOCAL REEL AT ONCE */
        @media (max-width: 767px) {
          .cylinder-scene {
            height: 440px !important;
            perspective: 32rem !important;
          }
          .cylinder-parallax {
            transform: translateZ(190px) rotateX(var(--mouse-rx, 0deg)) rotateY(var(--mouse-ry, 0deg)) !important;
          }
          .cylinder-rotator {
            transition: transform 0.85s cubic-bezier(0.25, 1, 0.5, 1);
            transform: rotateY(var(--rot-y, 0deg)) !important;
          }
          .cylinder-rotator.cylinder-rotator-dragging {
            transition: none !important;
          }
          .cylinder-card {
            --w: min(245px, 68vw) !important;
            --radius: calc((0.5 * var(--w) + 6px) / 0.22824) !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            transition: opacity 0.4s ease, filter 0.4s ease;
            transform:
              rotateY(calc(var(--i) * var(--ba)))
              translateZ(calc(-1 * var(--radius))) !important;
          }
          .cylinder-card-center {
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
            filter: brightness(1.06) drop-shadow(0 20px 45px rgba(0,0,0,0.95)) !important;
          }
        }

        /* Compact Mobile View (<= 380px): Single Reel */
        @media (max-width: 380px) {
          .cylinder-scene {
            height: 400px !important;
            perspective: 28rem !important;
          }
          .cylinder-parallax {
            transform: translateZ(160px) rotateX(var(--mouse-rx, 0deg)) rotateY(var(--mouse-ry, 0deg)) !important;
          }
          .cylinder-card {
            --w: min(218px, 68vw) !important;
            --radius: calc((0.5 * var(--w) + 5px) / 0.22824) !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            transform:
              rotateY(calc(var(--i) * var(--ba)))
              translateZ(calc(-1 * var(--radius))) !important;
          }
          .cylinder-card-center {
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cylinder-rotator {
            transition-duration: 0.01s !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ReelWall3D;
