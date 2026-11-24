import React, { useState } from 'react';
import { ArrowRight, Sparkles, TrendingUp, Layers, Check, Camera } from 'lucide-react';
import { soundSynth } from './BunqSoundSynth';

interface BunqServicesTrinityProps {
  onStartInquiry: (service: string) => void;
}

export const BunqServicesTrinity: React.FC<BunqServicesTrinityProps> = ({ onStartInquiry }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const pillars = [
    {
      id: 'create',
      number: '01',
      title: 'CREATE',
      subtitle: 'Concept Architecture & High-Retention Hooks',
      motto: 'Every frame begins with narrative conviction before cameras touch the set.',
      icon: Layers,
      accent: '#139EF2',
      deliverables: [
        'Algorithmic Hook Engineering (First 3-Second Grip)',
        'Full Narrative Arcs & Scriptwriting for Commercials',
        'Director’s Visual Treatment Decks & Storyboarding',
        'Brand Architecture & Digital Market Positioning',
      ],
      media: '/what-we-do/optimized/creative-content.webp',
      badge: 'STRATEGY & SCRIPTS',
    },
    {
      id: 'shoot',
      number: '02',
      title: 'SHOOT',
      subtitle: 'Physical Cinematography & Industrial Scale',
      motto: 'Real factories, real goldsmiths, real products captured with cinema-grade fidelity.',
      icon: Camera,
      accent: '#008CFF',
      deliverables: [
        'High-End Cinema Camera Packages with Anamorphic Glass',
        'Automated Motorized Robotic Slider Systems',
        'Directional Volumetric Lighting for Industrial Sets',
        'Specialized Macro Probe Lens & Texture Perspectives',
      ],
      media: '/what-we-do/optimized/digital-growth.webp',
      badge: 'ON-LOCATION PRODUCTION',
    },
    {
      id: 'grow',
      number: '03',
      title: 'GROW',
      subtitle: 'DaVinci Finishing & Social Algorithmic Velocity',
      motto: 'Transforming raw cinematic footage into compounding brand momentum.',
      icon: TrendingUp,
      accent: '#1497F5',
      deliverables: [
        'Hollywood-Grade DaVinci Resolve Color Grading',
        'Custom Multi-Layer Foley & Spatial Sound Design',
        'Scheduled Multi-Platform Publishing Cadence',
        'Performance Retention Curves & Conversion Pathways',
      ],
      media: '/what-we-do/optimized/editing-posting.webp',
      badge: 'POST-PRODUCTION & REACH',
    },
  ];

  return (
    <section id="services" className="relative w-full py-28 bg-[#030508] text-white overflow-hidden">
      {/* Structural ambient lighting */}
      <div className="absolute top-1/3 -left-48 w-96 h-96 rounded-full bg-[#139EF2]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-48 w-96 h-96 rounded-full bg-[#0B104E]/30 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10 space-y-16">
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#139EF2] mb-3">
              <span>[ 03 ]</span>
              <span>THE INTEGRATED CONTENT TRINITY</span>
              <span className="w-8 h-[1px] bg-[#139EF2]/40" />
              <span>END-TO-END OWNERSHIP</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-sans leading-[0.95]">
              Capabilities
            </h2>
          </div>
          <p className="text-sm sm:text-base text-white/60 max-w-md font-sans leading-relaxed">
            We reject fragmented agency models. BrandShoots owns every stage of production from original concept to daily distribution.
          </p>
        </div>

        {/* 3 Trinity Tabs / Interactive Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const isSelected = activeTab === idx;
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                onClick={() => {
                  soundSynth.playCardTick();
                  setActiveTab(idx);
                }}
                className={`relative rounded-2xl p-8 border transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                  isSelected
                    ? 'bg-white/[0.04] border-[#139EF2] shadow-[0_0_35px_rgba(19,158,242,0.2)]'
                    : 'bg-white/[0.015] border-white/10 hover:border-white/25 hover:bg-white/[0.03]'
                }`}
              >
                {/* Header: Number & Badge */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-[#139EF2]">
                      {pillar.number} //
                    </span>
                    <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/70">
                      {pillar.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-3xl font-extrabold text-white font-sans tracking-tight mb-2">
                      {pillar.title}
                    </h3>
                    <div className="text-xs font-semibold text-[#139EF2] uppercase tracking-wider font-sans mb-3">
                      {pillar.subtitle}
                    </div>
                    <p className="text-sm text-white/70 font-sans leading-relaxed">
                      {pillar.motto}
                    </p>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="space-y-2.5 pt-4 border-t border-white/10">
                    {pillar.deliverables.map((d, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2.5 text-xs text-white/80 font-sans">
                        <Check size={14} className="text-[#139EF2] shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-8 mt-6 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundSynth.playWhoosh(350, 150, 0.2);
                      onStartInquiry(pillar.title);
                    }}
                    className="text-xs font-mono uppercase tracking-wider text-[#139EF2] group-hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <span>Inquire About {pillar.title}</span>
                    <ArrowRight size={13} />
                  </button>
                  <Icon size={18} className="text-white/30 group-hover:text-[#139EF2] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Specialized Offering Banner: On-Location Technical Recce (₹2,000) */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-blue-950/40 via-blue-900/20 to-black border border-[#139EF2]/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_50px_rgba(19,158,242,0.15)]">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#139EF2]">
              <Sparkles size={14} />
              <span>SPECIALIZED ONBOARDING SERVICE</span>
              <span>•</span>
              <span className="text-white font-bold">₹2,000 FLAT RATE</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
              On-Location Technical Recce & Pre-Production Inspection
            </h3>
            <p className="text-sm text-white/70 font-sans leading-relaxed">
              Before committing to a multi-month campaign, our senior cinematographers visit your factory, showroom, or retail space in person. We evaluate ambient lighting, camera tracking feasibility, audio acoustics, and map preliminary angles.
            </p>
          </div>

          <button
            onClick={() => {
              soundSynth.playWhoosh(350, 150, 0.2);
              onStartInquiry('On-Location Technical Recce (₹2,000)');
            }}
            className="shrink-0 px-8 py-4 rounded-full bg-[#139EF2] hover:bg-[#008CFF] text-white font-semibold text-xs font-mono uppercase tracking-widest flex items-center gap-2 shadow-[0_0_30px_rgba(19,158,242,0.4)] transition-all"
          >
            <span>Book Recce Visit</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
};
