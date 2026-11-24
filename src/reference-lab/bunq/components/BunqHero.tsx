import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { soundSynth } from './BunqSoundSynth';

interface BunqHeroProps {
  onStartInquiry: (service?: string) => void;
  onExploreWork: () => void;
}

export const BunqHero: React.FC<BunqHeroProps> = ({ onStartInquiry, onExploreWork }) => {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-between pt-32 pb-12 px-6 sm:px-10 bg-[#04060A] text-white overflow-hidden select-none"
    >
      {/* Background Volumetric Glow & Grid Texture */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] rounded-full bg-[#0B104E]/30 blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[400px] rounded-full bg-[#139EF2]/15 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Hero Eyebrow Telemetry */}
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#139EF2] animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-white/90">
            COMMERCIAL FILM & DIGITAL GROWTH STUDIO
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[11px] font-mono text-[#139EF2] tracking-wider hidden sm:inline">
            AP • TS • SOUTH INDIA
          </span>
        </div>
      </div>

      {/* Main Monolithic Statement (BUNQ LABS Scale & Stance) */}
      <div className="max-w-7xl mx-auto w-full relative z-10 my-auto py-8 space-y-6">
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-[-0.035em] text-white font-sans leading-[0.92]">
          We Create Stories. <br />
          <span className="text-[#139EF2]">We Make Them Move.</span>
        </h1>

        <div className="max-w-2xl space-y-4">
          <p className="text-base sm:text-xl text-white/70 font-sans font-light leading-relaxed">
            A content-led brand growth partner for ambitious commercial enterprises. We combine cinema-grade physical production with high-velocity 9:16 vertical storytelling and systematic distribution.
          </p>

          <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-white/50">
            <span>[ CREATE ]</span>
            <span>•</span>
            <span>[ SHOOT ]</span>
            <span>•</span>
            <span>[ GROW ]</span>
          </div>
        </div>

        {/* Hero Actions */}
        <div className="pt-4 flex flex-wrap items-center gap-4">
          <button
            onClick={() => {
              soundSynth.playWhoosh(350, 150, 0.2);
              onExploreWork();
            }}
            className="px-8 py-4 rounded-full bg-white text-black font-bold text-xs font-mono uppercase tracking-widest hover:bg-[#139EF2] hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-2"
          >
            <span>Explore Work</span>
            <ArrowDown size={14} />
          </button>

          <button
            onClick={() => {
              soundSynth.playWhoosh(350, 150, 0.2);
              onStartInquiry('On-Location Technical Recce (₹2,000)');
            }}
            className="px-7 py-4 rounded-full border border-white/20 hover:border-[#139EF2] hover:bg-[#139EF2]/10 text-white text-xs font-mono uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Sparkles size={14} className="text-[#139EF2]" />
            <span>Book Recce (₹2,000)</span>
          </button>
        </div>
      </div>

      {/* Hero Bottom Telemetry & Scroll Indicator */}
      <div className="max-w-7xl mx-auto w-full relative z-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-white/50">
        <div className="flex items-center gap-6">
          <span>ANAMORPHIC GLASS</span>
          <span>•</span>
          <span>ROBOTIC TRACKING</span>
          <span>•</span>
          <span>DAVINCI COLOR FINISH</span>
        </div>

        <button
          onClick={onExploreWork}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <span>SCROLL TO EXPLORE ARCHIVE</span>
          <ArrowDown size={13} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
};
