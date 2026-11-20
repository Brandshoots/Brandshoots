import React from 'react';
import { Play, ChevronDown } from 'lucide-react';

interface LusionHeroProps {
  onWatchReel: () => void;
  onExplorePortfolio: () => void;
}

export const LusionHero: React.FC<LusionHeroProps> = ({ onWatchReel, onExplorePortfolio }) => {
  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex flex-col justify-between pt-32 pb-12 px-6 md:px-14 z-10 pointer-events-none"
    >
      {/* 1. Viewfinder Technical Crosshairs (Lusion Signature) */}
      <div className="absolute top-28 left-6 md:left-14 font-mono text-[10px] text-white/30 tracking-widest uppercase flex items-center gap-2">
        <span className="text-[#139EF2] font-bold text-sm">+</span>
        <span>LAT: 16.9890° N // LON: 81.7839° E</span>
      </div>

      <div className="absolute top-28 right-6 md:right-14 font-mono text-[10px] text-white/30 tracking-widest uppercase flex items-center gap-2">
        <span>FPS: 24.000 // T1.5 MASTER PRIME</span>
        <span className="text-[#139EF2] font-bold text-sm">+</span>
      </div>

      {/* 2. Hero Centerpiece Typography */}
      <div className="max-w-[1500px] mx-auto w-full mt-12 md:mt-20">
        {/* Subtle Category Micro-Tag */}
        <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-6 pointer-events-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-[#139EF2]" />
          <span className="font-mono text-[11px] tracking-[0.2em] text-white/80 uppercase">
            COMMERCIAL FILMMAKING & PRODUCTION
          </span>
        </div>

        {/* Main Master Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[104px] font-extrabold tracking-[-0.035em] text-white leading-[0.95] mb-8 uppercase select-none">
          ENGINEERING
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/50">
            COMMERCIAL
          </span>
          <br />
          <span className="text-[#139EF2]">CINEMA.</span>
        </h1>

        {/* Cinematic Subtitle & Manifesto */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <p className="md:col-span-7 text-lg md:text-2xl text-white/70 font-light leading-relaxed max-w-2xl">
            We don’t produce generic corporate videos. We architect high-retention, 
            anamorphic brand films and automated commercial content engines that 
            transform regional titans into market monopolies.
          </p>

          {/* Interactive Hero Actions */}
          <div className="md:col-span-5 flex flex-wrap items-center gap-4 pointer-events-auto">
            <button
              onClick={onWatchReel}
              className="group relative flex items-center gap-3 px-7 py-4 rounded-full bg-[#139EF2] text-white font-mono text-xs md:text-sm tracking-widest uppercase font-semibold hover:bg-[#0d82ca] transition-all duration-300 shadow-[0_0_30px_rgba(19,158,242,0.4)]"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#139EF2]">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </span>
              <span>PLAY 2026 REEL</span>
            </button>

            <button
              onClick={onExplorePortfolio}
              className="group flex items-center gap-2.5 px-6 py-4 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/30 text-white font-mono text-xs md:text-sm tracking-widest uppercase transition-all duration-300"
            >
              <span>EXPLORE WORK</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Hero Bottom HUD & Scroll Indicator */}
      <div className="w-full max-w-[1500px] mx-auto flex flex-col sm:flex-row items-center justify-between pt-12 border-t border-white/10 gap-4">
        <div className="flex items-center gap-6 font-mono text-xs text-white/40 tracking-wider">
          <span>CLIENT RATIO: 100% RETENTION</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">2.5M+ ORGANIC REACH</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">4K PRORES 4444 XQ</span>
        </div>

        <button
          onClick={onExplorePortfolio}
          className="flex items-center gap-2 text-white/50 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors pointer-events-auto group"
        >
          <span>SCROLL TO DESCEND</span>
          <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform text-[#139EF2]" />
        </button>
      </div>
    </section>
  );
};
