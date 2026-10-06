import React, { useEffect, useRef } from 'react';

export interface ReelWall3DProps {
  onLoaded?: () => void;
}

// 10 Real BrandShoots Video Reels with their verified posters
const REEL_VIDEOS = [
  {
    src: '/reels/wearebrandshoots_1777444216_3885805244420742638_77785749886.mp4',
    poster: '/reels/posters/wearebrandshoots_1777444216_3885805244420742638_77785749886.jpg'
  },
  {
    src: '/reels/wearebrandshoots_1786454245_3961387117295433628_77785749886.mp4',
    poster: '/reels/posters/wearebrandshoots_1786454245_3961387117295433628_77785749886.jpg'
  },
  {
    src: '/reels/viswatuff.glass_rjy_1791174653_4000984496274606409_78432309239.mp4',
    poster: '/reels/posters/viswatuff.glass_rjy_1791174653_4000984496274606409_78432309239.jpg'
  },
  {
    src: '/reels/wearebrandshoots_1788094941_3975150238988110104_77785749886.mp4',
    poster: '/reels/posters/wearebrandshoots_1788094941_3975150238988110104_77785749886.jpg'
  },
  {
    src: '/reels/santhi.pipes_rjy_1783494112_3936556116926232206_48644092133.mp4',
    poster: '/reels/posters/santhi.pipes_rjy_1783494112_3936556116926232206_48644092133.jpg'
  },
  {
    src: '/reels/wearebrandshoots_1789108387_3983651808436403394_77785749886.mp4',
    poster: '/reels/posters/wearebrandshoots_1789108387_3983651808436403394_77785749886.jpg'
  },
  {
    src: '/reels/wearebrandshoots_1790170837_3992564060770112832_77785749886.mp4',
    poster: '/reels/posters/wearebrandshoots_1790170837_3992564060770112832_77785749886.jpg'
  },
  {
    src: '/reels/wearebrandshoots_1786854627_3964745654666992928_77785749886.mp4',
    poster: '/reels/posters/wearebrandshoots_1786854627_3964745654666992928_77785749886.jpg'
  },
  {
    src: '/reels/wearebrandshoots_1789541302_3987282906831722378_77785749886.mp4',
    poster: '/reels/posters/wearebrandshoots_1789541302_3987282906831722378_77785749886.jpg'
  },
  {
    src: '/reels/wearebrandshoots_1787252706_3968084628303865353_77785749886.mp4',
    poster: '/reels/posters/wearebrandshoots_1787252706_3968084628303865353_77785749886.jpg'
  }
];

// 14 slots for a seamless 360-degree cylinder
const TOTAL_SLOTS = 14;
const CYLINDER_ITEMS = Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
  ...REEL_VIDEOS[i % REEL_VIDEOS.length],
  index: i
}));

export const ReelWall3D: React.FC<ReelWall3DProps> = ({ onLoaded }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotGroupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onLoaded) {
      onLoaded();
    }

    // Interactive subtle mouse parallax damping
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = (e.clientX - halfW) / halfW;
      mouseY = (e.clientY - halfH) / halfH;
    };

    const updateParallax = () => {
      currentX += (mouseX * 4 - currentX) * 0.05;
      currentY += (-mouseY * 2.5 - currentY) * 0.05;

      if (rotGroupRef.current) {
        rotGroupRef.current.style.setProperty('--mouse-rx', `${currentY}deg`);
        rotGroupRef.current.style.setProperty('--mouse-ry', `${currentX}deg`);
      }
      rafId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(updateParallax);

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
      cancelAnimationFrame(rafId);
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
            'linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)'
        }}
      >
        <div
          ref={rotGroupRef}
          className="cylinder-rotator"
          style={{
            display: 'grid',
            placeSelf: 'center',
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
        >
          {CYLINDER_ITEMS.map((item) => (
            <div
              key={item.index}
              className="cylinder-card group"
              style={{
                ['--i' as string]: item.index,
                ['--n' as string]: TOTAL_SLOTS
              }}
            >
              <div className="relative w-full h-full rounded-[16px] overflow-hidden bg-[#07090E] border border-white/10 ring-1 ring-black/80 shadow-[0_16px_50px_rgba(0,0,0,0.95)]">
                {/* Real 9:16 BrandShoots Video */}
                <video
                  src={item.src}
                  poster={item.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover rounded-[15px]"
                />

                {/* Subtle Inner Bezel Glass Glare */}
                <div className="absolute inset-0 pointer-events-none rounded-[15px] bg-gradient-to-b from-white/10 via-transparent to-black/40" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MATHEMATICALLY FORMULATED CYLINDER CSS                */}
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
