import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface LusionNavbarProps {
  onOpenMenu: () => void;
  isMenuOpen: boolean;
  onOpenContact: () => void;
  activeSection: string;
}

export const LusionNavbar: React.FC<LusionNavbarProps> = ({
  onOpenMenu,
  isMenuOpen,
  onOpenContact,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioCanvasRef = useRef<HTMLCanvasElement>(null);

  // Live Canvas Audio Visualizer Animation (Authentic Lusion Signature)
  useEffect(() => {
    const canvas = audioCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 5;
      const barWidth = 2;
      const spacing = 3;
      const startX = (canvas.width - (bars * barWidth + (bars - 1) * spacing)) / 2;

      for (let i = 0; i < bars; i++) {
        const height = isMuted
          ? 3
          : Math.max(3, Math.sin(step + i * 1.2) * 8 + 9);
        const x = startX + i * (barWidth + spacing);
        const y = (canvas.height - height) / 2;

        ctx.fillStyle = isMuted ? 'rgba(255, 255, 255, 0.3)' : '#139EF2';
        ctx.fillRect(x, y, barWidth, height);
      }

      step += 0.12;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [isMuted]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 pointer-events-auto px-4 md:px-10 py-5 transition-all duration-300">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between">
        {/* BrandShoots Logo with exclusion blend mode */}
        <a
          href="#home"
          className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
          aria-label="BrandShoots Home"
        >
          <img
            src="/Logo Official.svg"
            alt="BrandShoots"
            className="h-7 md:h-8 w-auto brightness-200 contrast-125 object-contain"
          />
          <span className="hidden sm:inline-block font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase pl-3 border-l border-white/10">
            CINEMA LAB // 2026
          </span>
        </a>

        {/* Viewfinder Center Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest text-white/60 uppercase">
            REC • 4K 24FPS // ANAMORPHIC
          </span>
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Audio Visualizer Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#139EF2]/50 transition-all duration-300 group"
            title={isMuted ? 'Unmute Atmosphere' : 'Mute Atmosphere'}
            aria-label="Toggle Atmosphere Sound"
          >
            <canvas
              ref={audioCanvasRef}
              width={24}
              height={20}
              className="w-6 h-5"
            />
          </button>

          {/* Talk / Book Inquiry Pill CTA */}
          <button
            onClick={onOpenContact}
            className="group relative flex items-center gap-2.5 px-4 md:px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-[#139EF2]/60 backdrop-blur-xl transition-all duration-300 shadow-[0_0_20px_rgba(19,158,242,0.15)]"
          >
            {/* Status Indicator Dots (Lusion Signature) */}
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#139EF2] animate-ping" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#139EF2]" />
            </span>
            <span className="font-mono text-xs md:text-sm font-medium tracking-wider text-white uppercase">
              START INQUIRY
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white/70 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          {/* Menu Trigger Button */}
          <button
            onClick={onOpenMenu}
            className="relative flex items-center gap-2.5 px-4 md:px-5 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 transition-colors duration-300 shadow-lg font-mono text-xs md:text-sm font-semibold tracking-widest uppercase"
            aria-label={isMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          >
            <span>{isMenuOpen ? 'CLOSE' : 'MENU'}</span>
            <span className="flex flex-col gap-1 w-3">
              <span className={`block h-[1.5px] bg-black transition-all ${isMenuOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
              <span className={`block h-[1.5px] bg-black transition-all ${isMenuOpen ? '-rotate-45 -translate-y-[2.5px]' : ''}`} />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
