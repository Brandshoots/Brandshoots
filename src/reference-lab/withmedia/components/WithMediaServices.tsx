import React, { useState } from 'react';

interface WithMediaServicesProps {
  onStartInquiry: (serviceName?: string) => void;
  onOpenRecce: () => void;
}

export const WithMediaServices: React.FC<WithMediaServicesProps> = ({
  onStartInquiry,
  onOpenRecce,
}) => {
  const [activeCategory, setActiveCategory] = useState<'video' | 'shortform' | 'post' | 'strategy'>('video');

  const categories = [
    { id: 'video', label: 'Commercial Film', count: '01' },
    { id: 'shortform', label: '9:16 Social Velocity', count: '02' },
    { id: 'post', label: 'DaVinci Post & Color', count: '03' },
    { id: 'strategy', label: 'Strategy & Direction', count: '04' },
  ];

  return (
    <section id="services" className="relative w-full py-24 sm:py-32 bg-[#05070B] overflow-hidden border-t border-white/[0.06]">
      {/* Background Watermark Typography */}
      <div className="absolute top-12 right-6 sm:right-12 select-none pointer-events-none text-[120px] sm:text-[200px] font-black text-white/[0.015] font-mono leading-none">
        SV
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-widest mb-4">
            <span>Capabilities & Deliverables</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-200">Services.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Four specialized disciplines, one unified production house. We handle commercial storytelling from the initial technical recce to final DaVinci Resolve color delivery.
          </p>

          {/* Interactive Category Selector Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-8 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span className="text-[10px] font-mono opacity-70">{cat.count}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Commercial Video Production */}
        {activeCategory === 'video' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fadeIn">
            <div className="lg:col-span-7 flex flex-col justify-between p-8 sm:p-10 rounded-2xl bg-[#090D16] border border-blue-500/20 shadow-2xl">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400">Core Craft // 01</span>
                <h3 className="text-2xl sm:text-4xl font-extrabold uppercase text-white tracking-tight mt-2 mb-4">
                  Commercial Video Production
                </h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Engineered commercial filmmaking designed for industrial manufacturers, architectural leaders, and flagship retail brands. We operate high-speed cinema camera packages with specialized lighting rigs to capture physical craftsmanship, engineering tolerance, and scale.
                </p>

                <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                  <div className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="text-blue-400 font-bold">✦</span>
                    <span><strong>High-Speed Robotics & Tracking:</strong> Automated sliders through active factory lines and retail showrooms.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="text-blue-400 font-bold">✦</span>
                    <span><strong>Industrial Lighting Rigs:</strong> 1200W HMI and Aputure high-output daylight arrays to cut through reflective surfaces.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="text-blue-400 font-bold">✦</span>
                    <span><strong>Anamorphic Cinema Glass:</strong> Wide panoramic aspect ratios and cinematic flare rendition.</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-8 mt-6 border-t border-white/[0.08]">
                <button
                  onClick={() => onStartInquiry('Commercial Video Production')}
                  className="px-6 py-3 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                >
                  Commission Commercial Shoot →
                </button>
                <button
                  onClick={onOpenRecce}
                  className="px-5 py-3 rounded-full bg-white/[0.04] border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider hover:bg-blue-500/10 transition-all"
                >
                  Schedule Recce (₹2,000)
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400">Proven Deliverables</span>
                <h4 className="text-xl font-bold uppercase text-white mt-2 mb-4">What You Receive</h4>
                <ul className="space-y-3.5 text-sm text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>4K Cinema Master (16:9 3840×2160 ProRes)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Director's Cut & High-Velocity Social Cut</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>On-Location Audio & Environmental Foley Master</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>B-Roll Library for Future Multi-Platform Ads</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Full Commercial Rights & Redundant Raw Archive</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 mt-6">
                <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 block mb-1">
                  Verified Case Benchmark
                </span>
                <span className="text-sm font-bold text-white block">Santhi Pipes & Viswatuff Glass</span>
                <span className="text-xs text-slate-400">Generated over 630K+ organic views across B2B distributors.</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 9:16 Social Velocity */}
        {activeCategory === 'shortform' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fadeIn">
            <div className="lg:col-span-7 flex flex-col justify-between p-8 sm:p-10 rounded-2xl bg-[#090D16] border border-blue-500/20 shadow-2xl">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400">Audience Engine // 02</span>
                <h3 className="text-2xl sm:text-4xl font-extrabold uppercase text-white tracking-tight mt-2 mb-4">
                  Short-Form Content & 9:16 Velocity
                </h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Engineered mobile retention for Instagram Reels and YouTube Shorts. We reject cookie-cutter trending audio templates, building narrative hooks that stop the scroll in under 1.8 seconds and convert passive viewers into commercial prospects.
                </p>

                <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                  <div className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="text-blue-400 font-bold">✦</span>
                    <span><strong>1.8s Hook Architecture:</strong> Immediate kinetic visual contrast and dialogue entry before drop-off occurs.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="text-blue-400 font-bold">✦</span>
                    <span><strong>Dynamic Audio Isolation:</strong> Dialogue denoising, precision riser SFX, and beat-matched percussion.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="text-blue-400 font-bold">✦</span>
                    <span><strong>Batch Retainer Production:</strong> 8 to 16 high-velocity deliverables captured in a single planned shoot day.</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-8 mt-6 border-t border-white/[0.08]">
                <button
                  onClick={() => onStartInquiry('Short-Form Content Retainer')}
                  className="px-6 py-3 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                >
                  Start Monthly Velocity Retainer →
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400">Monthly Rhythm</span>
                <h4 className="text-xl font-bold uppercase text-white mt-2 mb-4">Retainer Structure</h4>
                <ul className="space-y-3.5 text-sm text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>8 – 16 Bespoke Vertical Reels per month</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>1 Dedicated Studio Shoot Day on-location</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Custom Graphic Lower-Thirds & Captions</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Strategic Publishing Schedule & Hashtag Blueprint</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 mt-6">
                <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 block mb-1">
                  Retail Growth Benchmark
                </span>
                <span className="text-sm font-bold text-white block">Bags World & Sahana Dry Fruits</span>
                <span className="text-xs text-slate-400">18K+ new Instagram followers grown directly from 9:16 reels.</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Precision Editing & DaVinci Post */}
        {activeCategory === 'post' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fadeIn">
            <div className="lg:col-span-7 flex flex-col justify-between p-8 sm:p-10 rounded-2xl bg-[#090D16] border border-blue-500/20 shadow-2xl">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400">Technical Post // 03</span>
                <h3 className="text-2xl sm:text-4xl font-extrabold uppercase text-white tracking-tight mt-2 mb-4">
                  Precision Editing & DaVinci Post-Production
                </h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Every project flows through our dedicated DaVinci Resolve Studio color suite. We utilize ACES color space management to translate raw cinema camera sensors into authentic film emulation, high-dynamic-range tonality, and pristine skin tone vectors.
                </p>

                <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                  <div className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="text-blue-400 font-bold">✦</span>
                    <span><strong>ACES Color Space Management:</strong> Standardized logarithmic color pipeline with 10-bit color accuracy.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="text-blue-400 font-bold">✦</span>
                    <span><strong>Film Halation & Custom Grain:</strong> Emulating Kodak 2383 35mm optical print density for organic warmth.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="text-blue-400 font-bold">✦</span>
                    <span><strong>Multi-Stem Sound Design:</strong> Foley integration, room tone subtraction, and dialogue normalization to -14 LUFS.</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-8 mt-6 border-t border-white/[0.08]">
                <button
                  onClick={() => onStartInquiry('Post-Production & Color Grading')}
                  className="px-6 py-3 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                >
                  Book Post-Production Suite →
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400">Suite Specifications</span>
                <h4 className="text-xl font-bold uppercase text-white mt-2 mb-4">Post Capabilities</h4>
                <ul className="space-y-3.5 text-sm text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>DaVinci Resolve Studio 19 Advanced Color Nodes</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>10-Bit 4:2:2 Broadcast & Digital Mastering</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Custom Typography Match-Move & Graphic Tracking</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Fairlight Audio Dialogue Cleanup & Normalization</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 mt-6">
                <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 block mb-1">
                  Color Verification
                </span>
                <span className="text-sm font-bold text-white block">Aabharan Jewellers</span>
                <span className="text-xs text-slate-400">Accurate gold wavelength balance without chromatic oversaturation.</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Strategy & Growth */}
        {activeCategory === 'strategy' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fadeIn">
            <div className="lg:col-span-7 flex flex-col justify-between p-8 sm:p-10 rounded-2xl bg-[#090D16] border border-blue-500/20 shadow-2xl">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400">Direction // 04</span>
                <h3 className="text-2xl sm:text-4xl font-extrabold uppercase text-white tracking-tight mt-2 mb-4">
                  Brand & Creative Strategy
                </h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Video without positioning is wasted production budget. We partner with founders and business owners to define their narrative differentiator, competitive moat, and digital distribution cadence before stepping on set.
                </p>

                <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                  <div className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="text-blue-400 font-bold">✦</span>
                    <span><strong>Anti-Template Creative Direction:</strong> Developing bespoke visual aesthetics unique to each brand.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="text-blue-400 font-bold">✦</span>
                    <span><strong>Distribution Strategy:</strong> Matching content types to high-conversion organic social algorithms.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="text-blue-400 font-bold">✦</span>
                    <span><strong>Executive Portraiture & Authority:</strong> Building founder visibility that commands industry respect.</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-8 mt-6 border-t border-white/[0.08]">
                <button
                  onClick={() => onStartInquiry('Creative Strategy Consultation')}
                  className="px-6 py-3 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                >
                  Book Strategy Consultation →
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400">Strategic Roadmap</span>
                <h4 className="text-xl font-bold uppercase text-white mt-2 mb-4">The Growth Blueprint</h4>
                <ul className="space-y-3.5 text-sm text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Quarterly Content Architecture & Shot Plans</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Audience Retention & Demographics Audit</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Competitor Visual Deconstruction</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Founder Voice & Storyboarding Sessions</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 mt-6">
                <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 block mb-1">
                  Legal Authority Benchmark
                </span>
                <span className="text-sm font-bold text-white block">Adv. Leela Srinivas</span>
                <span className="text-xs text-slate-400">Positioned legal authority through cinematic, authoritative interviews.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
