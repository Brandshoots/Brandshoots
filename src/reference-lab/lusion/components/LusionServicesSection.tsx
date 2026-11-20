import React from 'react';
import { Video, Zap, TrendingUp, Check } from 'lucide-react';

interface LusionServicesSectionProps {
  onStartInquiry: (service: string) => void;
}

export const LusionServicesSection: React.FC<LusionServicesSectionProps> = ({ onStartInquiry }) => {
  const services = [
    {
      id: 'commercial',
      number: '01',
      title: 'Commercial Film Production',
      subtitle: 'Industrial, Architectural & High-Impact Brand Anthems',
      description: 'End-to-end commercial filmmaking tailored for manufacturing, architectural spaces, luxury lifestyle, and retail giants.',
      icon: Video,
      specs: [
        '8K Large-Format Cinema Capture',
        'Directional Set Lighting & Fog Architecture',
        'Robotic Sliders & Drone Aerial Cinematography',
        'DaVinci Resolve ACES Color Mastering'
      ],
      idealFor: 'Industrial Manufacturing, Real Estate, Luxury Jewelry, Corporate Anthems'
    },
    {
      id: 'reels-engine',
      number: '02',
      title: 'Social-First Content Engine',
      subtitle: 'High-Retention 9:16 Commercial Reel Systems',
      description: 'A continuous, high-volume production pipeline delivering cinema-grade short-form reels optimized for algorithmic retention and consumer conversion.',
      icon: Zap,
      specs: [
        '9:16 Native Vertical Anamorphic Composition',
        'Psychological Hook & Retention Pacing',
        'Turnkey Sound Design & Dynamic Subtitles',
        'Batch Production Days (4-12 Reels / Month)'
      ],
      idealFor: 'Retail Chains, F&B Franchises, Modern D2C Brands, Salons & Studios'
    },
    {
      id: 'creative-growth',
      number: '03',
      title: 'Creative Direction & Ad Scaling',
      subtitle: 'High-Converting Visual Campaigns',
      description: 'Strategic creative direction designed to bridge the gap between aesthetic beauty and concrete return on investment.',
      icon: TrendingUp,
      specs: [
        'Concept Storyboarding & Narrative Scripting',
        'Meta & YouTube Ad Campaign Creative Direction',
        'Organic Engagement & Follower Acquisition Playbooks',
        'Complete Visual Identity Consultation'
      ],
      idealFor: 'Brands looking to scale customer acquisition with high-retention video ads'
    }
  ];

  return (
    <section id="services" className="relative w-full py-28 px-6 md:px-14 z-10 border-t border-white/5">
      <div className="max-w-[1500px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#139EF2] tracking-[0.25em] uppercase mb-3">
              <span>// 04</span>
              <span>•</span>
              <span>PRODUCTION CAPABILITIES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase">
              THE THREE PILLARS.
              <br />
              <span className="text-white/40">INTEGRATED CREATIVE ENGINE.</span>
            </h2>
          </div>

          <p className="max-w-md text-white/60 font-light text-base leading-relaxed">
            From single hero commercials to automated monthly social reels, we deliver 
            consistent cinematic excellence that commands attention.
          </p>
        </div>

        {/* 3 Pillar Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                className="group relative rounded-2xl p-8 md:p-10 bg-[#0a0d14]/80 border border-white/10 hover:border-[#139EF2]/50 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
              >
                <div>
                  {/* Top Line: Number & Icon */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-sm text-[#139EF2] tracking-widest font-semibold">
                      // {svc.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white group-hover:bg-[#139EF2] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-2">
                    {svc.title}
                  </h3>
                  <div className="font-mono text-xs text-white/50 tracking-wider mb-6">
                    {svc.subtitle}
                  </div>

                  <p className="text-sm text-white/70 font-light leading-relaxed mb-8">
                    {svc.description}
                  </p>

                  {/* Bullet Specs */}
                  <div className="space-y-3 mb-8">
                    {svc.specs.map((spec, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-white/80">
                        <Check className="w-4 h-4 text-[#139EF2] shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <div className="font-mono text-[11px] text-white/40 tracking-wider mb-4">
                    BEST FOR: {svc.idealFor}
                  </div>
                  <button
                    onClick={() => onStartInquiry(svc.title)}
                    className="w-full py-3 rounded-xl bg-white/[0.05] hover:bg-[#139EF2] text-white font-mono text-xs tracking-widest uppercase font-semibold transition-all duration-300 border border-white/10 hover:border-[#139EF2]"
                  >
                    SELECT THIS SERVICE
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
