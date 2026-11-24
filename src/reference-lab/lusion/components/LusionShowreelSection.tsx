import React, { useRef } from 'react';
import { Play, Maximize2, Disc } from 'lucide-react';

interface LusionShowreelSectionProps {
  onWatchReelFullscreen: () => void;
}

export const LusionShowreelSection: React.FC<LusionShowreelSectionProps> = ({
  onWatchReelFullscreen,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section id="showreel" className="relative w-full py-28 px-6 md:px-14 z-10">
      <div className="max-w-[1500px] mx-auto">
        {/* Section Header Meta */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#139EF2] tracking-[0.25em] uppercase mb-3">
              <span>// 01</span>
              <span>•</span>
              <span>CINEMATIC SHOWREEL</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase">
              CRAFTED FOR REPUTATION.
              <br />
              <span className="text-white/40">SHOT FOR VELOCITY.</span>
            </h2>
          </div>

          <p className="max-w-md text-white/60 font-light text-base leading-relaxed">
            Every frame is deliberately composed with directional volumetric lighting, 
            anamorphic bokeh, and motion-tracked precision to evoke raw consumer desire.
          </p>
        </div>

        {/* Technical Framed Reel Container (Lusion #home-reel signature) */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.8)] group">
          {/* 4 Corner Crosshairs */}
          <div className="absolute top-4 left-4 z-20 font-mono text-white/40 text-sm select-none pointer-events-none">+</div>
          <div className="absolute top-4 right-4 z-20 font-mono text-white/40 text-sm select-none pointer-events-none">+</div>
          <div className="absolute bottom-4 left-4 z-20 font-mono text-white/40 text-sm select-none pointer-events-none">+</div>
          <div className="absolute bottom-4 right-4 z-20 font-mono text-white/40 text-sm select-none pointer-events-none">+</div>

          {/* Top HUD Bar */}
          <div className="absolute top-0 left-0 w-full z-20 px-8 py-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
            <div className="flex items-center gap-3">
              <Disc className="w-4 h-4 text-[#139EF2] animate-spin" />
              <span className="font-mono text-[11px] tracking-widest text-white">
                <span>BrandShoots</span><span className="uppercase"> DIRECTORS CUT // 2026</span>
              </span>
            </div>
            <span className="font-mono text-[10px] text-white/50 tracking-wider hidden sm:inline">
              RESOLUTION: 3840x2160 • COLOR: DCI-P3 WIDE
            </span>
          </div>

          {/* Video Preview Element */}
          <div className="relative aspect-video w-full overflow-hidden">
            <video
              ref={videoRef}
              src="/reels/wearebrandshoots/wearebrandshoots_2025-10-16_15-04-28_3744567634965812934_77785749886.mp4"
              poster="/reels/thumbnails-webp/santhi.pipes_rjy_2026-05-31_18-02-19_3909180466433077679_48644092133.webp"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />
            {/* Subtle Gradient Shade */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Center Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <button
                onClick={onWatchReelFullscreen}
                className="group/btn relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 hover:bg-[#139EF2] border border-white/20 hover:border-[#139EF2] backdrop-blur-xl transition-all duration-300 shadow-[0_0_50px_rgba(19,158,242,0.3)] hover:scale-110 active:scale-95"
                aria-label="Watch Showreel Fullscreen"
              >
                <span className="absolute inset-0 rounded-full border border-[#139EF2]/40 animate-ping" />
                <Play className="w-8 h-8 text-white fill-current ml-1" />
              </button>
            </div>
          </div>

          {/* Bottom HUD Bar */}
          <div className="px-6 md:px-8 py-4 bg-[#0a0d14]/90 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 font-mono text-[11px] text-white/50 tracking-wider">
              <span>CAMERA: RED V-RAPTOR XL 8K VV</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">LENSES: ATLAS ORION ANAMORPHIC</span>
              <span className="hidden lg:inline">•</span>
              <span className="hidden lg:inline">LIGHTING: APUTURE 1200D PRO MATRICES</span>
            </div>

            <button
              onClick={onWatchReelFullscreen}
              className="flex items-center gap-2 font-mono text-xs text-[#139EF2] hover:text-white transition-colors tracking-widest uppercase font-semibold"
            >
              <span>EXPAND CINEMA VIEW</span>
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
