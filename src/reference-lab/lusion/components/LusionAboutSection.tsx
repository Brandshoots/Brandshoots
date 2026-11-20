import React from 'react';
import { Camera, Film, Layers, CheckCircle2 } from 'lucide-react';

interface LusionAboutSectionProps {
  onStartInquiry: () => void;
}

export const LusionAboutSection: React.FC<LusionAboutSectionProps> = ({ onStartInquiry }) => {
  return (
    <section id="about" className="relative w-full py-28 px-6 md:px-14 z-10 border-t border-white/5">
      <div className="max-w-[1500px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#139EF2] tracking-[0.25em] uppercase mb-3">
              <span>// 03</span>
              <span>•</span>
              <span>PHILOSOPHY & PRODUCTION ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase">
              REJECT THE TEMPLATE.
              <br />
              <span className="text-white/40">DEMAND CINEMATIC DOMINANCE.</span>
            </h2>
          </div>

          <p className="max-w-md text-white/60 font-light text-base leading-relaxed">
            Standard agencies treat video as a social media chore. We engineer each frame 
            as a commercial cinema asset engineered to hold retention, establish prestige, 
            and command market authority.
          </p>
        </div>

        {/* 3 Cinema Pillars Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 rounded-2xl bg-[#0a0d14]/70 border border-white/10 hover:border-[#139EF2]/40 transition-colors relative">
            <span className="absolute top-4 right-4 font-mono text-[11px] text-[#139EF2]">01 // SENSOR</span>
            <Camera className="w-8 h-8 text-[#139EF2] mb-6" />
            <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-3">
              Large-Format 8K Precision
            </h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
              Shot on large-format digital cinema sensors with true 16+ stops of dynamic range, 
              preserving highlight roll-off and rich shadow depth in every environment.
            </p>
            <div className="pt-4 border-t border-white/5 font-mono text-[11px] text-white/40 tracking-wider">
              RED V-RAPTOR XL • ARRI LOGC4 WORKFLOW
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#0a0d14]/70 border border-white/10 hover:border-[#139EF2]/40 transition-colors relative">
            <span className="absolute top-4 right-4 font-mono text-[11px] text-[#139EF2]">02 // GLASS</span>
            <Film className="w-8 h-8 text-[#139EF2] mb-6" />
            <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-3">
              True Anamorphic Optics
            </h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
              We employ authentic 2x squeeze anamorphic prime lenses, creating signature 
              oval bokeh, streak flares, and cinematic field depth that smartphone video 
              can never replicate.
            </p>
            <div className="pt-4 border-t border-white/5 font-mono text-[11px] text-white/40 tracking-wider">
              ATLAS ORION ANAMORPHIC • T1.5 COATINGS
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#0a0d14]/70 border border-white/10 hover:border-[#139EF2]/40 transition-colors relative">
            <span className="absolute top-4 right-4 font-mono text-[11px] text-[#139EF2]">03 // MOTION</span>
            <Layers className="w-8 h-8 text-[#139EF2] mb-6" />
            <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-3">
              Robotic Precision Tracking
            </h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
              Automated high-speed motion control sliders and multi-axis gimbals deliver 
              flawless tracking shots, sweeping factory reveals, and macro product passes.
            </p>
            <div className="pt-4 border-t border-white/5 font-mono text-[11px] text-white/40 tracking-wider">
              DJI RONIN 4D • MOTION CONTROL ROBOTICS
            </div>
          </div>
        </div>

        {/* Founder & Creative Director Callout Banner */}
        <div className="rounded-2xl p-8 md:p-12 bg-gradient-to-r from-[#0d131f] via-[#090d16] to-[#05070b] border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="font-mono text-xs text-[#139EF2] tracking-widest uppercase mb-2">
              FOUNDER MANIFESTO // SURYA RAJA
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase mb-4">
              “Commercial film isn’t decoration. It is your brand’s highest-leverage sales asset.”
            </h3>
            <p className="text-white/60 font-light text-sm leading-relaxed">
              We started BrandShoots to eliminate the sea of mediocre, cookie-cutter digital agency 
              video in South India. Every brand we partner with receives uncompromising cinematic 
              storytelling, world-class camera operation, and rapid commercial deployment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={onStartInquiry}
              className="px-6 py-3.5 rounded-full bg-[#139EF2] hover:bg-[#0d82ca] text-white font-mono text-xs tracking-widest uppercase font-semibold transition-all shadow-[0_0_25px_rgba(19,158,242,0.3)] whitespace-nowrap"
            >
              COMMISSION A SHOOT
            </button>
            <div className="flex items-center gap-2 font-mono text-xs text-white/40">
              <CheckCircle2 className="w-4 h-4 text-[#139EF2]" />
              <span>BOOKING Q4 2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
