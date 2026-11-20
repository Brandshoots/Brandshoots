import React from 'react';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { soundSynth } from './BunqSoundSynth';

interface BunqAboutStudioProps {
  onStartInquiry: (service: string) => void;
}

export const BunqAboutStudio: React.FC<BunqAboutStudioProps> = ({ onStartInquiry }) => {
  return (
    <section id="about" className="relative w-full py-28 bg-[#04060A] text-white overflow-hidden border-t border-white/5">
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full bg-[#0B104E]/20 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10 space-y-20">
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#139EF2]">
            <span>[ ABOUT THE STUDIO ]</span>
            <span className="w-8 h-[1px] bg-[#139EF2]/40" />
            <span>ORIGINAL CREATIVE DIRECTION</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-['Figtree'] leading-[0.95]">
            We Build Tasteful Content For Ambitious Brands
          </h2>
          <p className="text-lg text-white/70 font-['Figtree'] leading-relaxed pt-2">
            BrandShoots is a specialized creative branding and commercial video production house headquartered in Rajamahendravaram with production operations spanning Hyderabad and South India.
          </p>
        </div>

        {/* Dual Column: Manifesto & Founder Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Anti-Template Philosophy & Pillars (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#139EF2] block">
                OUR ANTI-TEMPLATE PHILOSOPHY
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Figtree'] leading-snug">
                Moving Beyond Generic Marketing Templates & Shaky Smartphone Footage
              </h3>
              <p className="text-sm sm:text-base text-white/70 font-['Figtree'] leading-relaxed">
                Conventional digital marketing agencies rely on Canva templates, static stock graphics, or generic AI video snippets that fail to hold audience attention. BrandShoots takes the opposite stance: real factories, real goldsmiths, real products, and real architecture captured with cinema-grade cameras, motorized tracking sliders, and Hollywood-standard DaVinci color grading.
              </p>
            </div>

            {/* Core Architectural Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {[
                {
                  title: 'Vertical-First 9:16',
                  desc: 'Vertical video engineered natively for Instagram Reels and YouTube Shorts, not an awkward crop of widescreen horizontal footage.',
                },
                {
                  title: 'First-2-Second Hook Discipline',
                  desc: 'Every commercial is planned around immediate visual grip, kinetic camera motion, and auditory alignment to halt scrolling.',
                },
                {
                  title: 'Cine Glass & Calibrated Illumination',
                  desc: 'Anamorphic and prime cine lenses paired with directional volumetric studio lighting to create undeniable visual authority.',
                },
                {
                  title: 'Monthly Production Retainers',
                  desc: 'Full-cycle monthly execution where BrandShoots manages strategy, shooting, editing, and distribution systematically.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2 hover:border-[#139EF2]/40 transition-colors"
                >
                  <div className="text-xs font-bold text-white font-['Figtree'] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#139EF2]" />
                    {item.title}
                  </div>
                  <p className="text-xs text-white/60 font-['Figtree'] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Geographical Footprint */}
            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-white/60">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#139EF2] shrink-0" />
                <span>HQ: Rajamahendravaram, AP 533105</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#139EF2] shrink-0" />
                <span>Metro Hub: Hyderabad, Telangana</span>
              </div>
            </div>
          </div>

          {/* Right Column: Founder Spotlight & Creative Leadership (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-white/[0.03] p-6 sm:p-8 space-y-6 shadow-2xl">
              {/* Founder Image */}
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-black/60 border border-white/10">
                <img
                  src="/founder.webp"
                  alt="Durgarao Vallepu — Founder & Creative Director"
                  className="w-full h-full object-cover object-top filter grayscale contrast-110 hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 inset-x-4">
                  <span className="text-[10px] font-mono tracking-widest text-[#139EF2] uppercase px-2 py-0.5 rounded bg-black/70 border border-white/10">
                    CREATIVE DIRECTION
                  </span>
                </div>
              </div>

              {/* Bio & Leadership Role */}
              <div className="space-y-3">
                <h4 className="text-2xl font-bold text-white font-['Figtree']">
                  Durgarao Vallepu
                </h4>
                <div className="text-xs font-mono text-[#139EF2] uppercase tracking-wider">
                  Founder & Creative Director // BrandShoots
                </div>
                <p className="text-xs text-white/70 font-['Figtree'] leading-relaxed">
                  "Storytelling is not static; it lives in movement, visual rhythm, emotional resonance, and audience action. Our mission is to build commercial films that genuinely move people and compound enterprise value."
                </p>
              </div>

              <button
                onClick={() => {
                  soundSynth.playWhoosh(350, 150, 0.2);
                  onStartInquiry('Commercial Retainer / Direct Leadership');
                }}
                className="w-full py-3 rounded-lg border border-white/20 hover:border-[#139EF2] hover:bg-[#139EF2]/10 text-white text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
              >
                <span>Initiate Direct Consultation</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
