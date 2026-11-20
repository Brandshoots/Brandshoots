import React, { useState } from 'react';

interface WithMediaSystemsProps {
  onOpenRecce: () => void;
  onStartInquiry: (serviceName?: string) => void;
}

export const WithMediaSystems: React.FC<WithMediaSystemsProps> = ({
  onOpenRecce,
  onStartInquiry,
}) => {
  const [activeHoverSystem, setActiveHoverSystem] = useState<number | null>(null);

  const systems = [
    {
      num: '01',
      title: 'DaVinci Resolve Studio',
      titleItalic: 'ACES Color Suite',
      status: 'In-House Studio Engine · Active',
      tagline: 'ACES Color Management. 10-Bit Broadcast Masters. Zero generic LUT presets.',
      desc: 'Every BrandShoots production runs through our dedicated DaVinci Resolve Studio color-grading pipeline. We standardize raw camera logs (Sony S-Log3, Blackmagic BRAW) through Academy Color Encoding System (ACES) color science. This ensures exact brand color replication, high-dynamic-range highlights, and organic Kodak 2383 35mm optical print density.',
      builtFor: 'Manufacturers, architectural glazing firms, and luxury jewelers where color accuracy and premium tonal depth cannot be compromised.',
      tags: ['DaVinci Resolve Studio 19', 'ACEScc Color Science', '10-Bit 4:2:2 Masters', 'Kodak 2383 Emulation', 'Fairlight Audio Suite', 'HDR Tone Mapping'],
      mockTitle: 'DaVinci Resolve Studio · ACES Color Pipeline',
      mockLines: [
        { type: 'comment', text: '# Initializing ACEScc Color Pipeline' },
        { type: 'step', text: '› Input: Sony S-Log3 / S-Gamut3.Cine (10-bit 4:2:2)' },
        { type: 'step', text: '› Color Space Transform: Log -> ACEScc AP1' },
        { type: 'prompt', text: '› Node 01: Exposure & Contrast Curve (Pivot: 0.435)' },
        { type: 'prompt', text: '› Node 02: Primary Balance (Lift/Gamma/Gain wheels)' },
        { type: 'prompt', text: '› Node 03: Skin Tone Vector (Vectorscope isolation)' },
        { type: 'prompt', text: '› Node 04: Halation & 35mm Film Grain Emulation' },
        { type: 'ok', text: '✓ Output CST: ACEScc -> Rec.709 Gamma 2.4' },
        { type: 'pill', text: 'Master Deliverable', value: '4K ProRes 422 HQ · 10-Bit Color' },
      ],
      ctaText: 'Explore Post Capabilities',
      ctaAction: () => onStartInquiry('DaVinci Color Grading & Post-Production'),
    },
    {
      num: '02',
      title: 'On-Location Technical Recce',
      titleItalic: 'Facility Audit Engine',
      status: 'Verified Commercial Service · ₹2,000',
      tagline: 'Pre-production engineering before a single camera rolls on your factory or showroom floor.',
      desc: 'We never walk onto a client set unprepared. Our technical recce is a structured physical inspection of your facility. We measure electrical loads for high-output 1200W HMI lighting, run acoustic reverberation tests (RT60) for clear dialogue capture, identify 15-meter automated camera tracking paths, and verify plant safety clearances.',
      builtFor: 'Industrial plant heads, showroom owners, and commercial enterprise founders who demand zero disruption to daily business operations during shoots.',
      tags: ['Physical Site Audit', 'Acoustic RT60 Testing', '32A 3-Phase Electrical Audit', 'Automated Tracking Clearance', 'Shot List Blueprint', '₹2,000 Retainer Credit'],
      mockTitle: 'BrandShoots Recce Engine · Facility Audit Manifest',
      mockLines: [
        { type: 'comment', text: '# Site Inspection: Industrial Manufacturing Plant' },
        { type: 'step', text: '› Target Facility: Santhi Pipes Extrusion Plant #2' },
        { type: 'ok', text: '✓ Acoustic RT60: 0.42s (Approved for boom mics)' },
        { type: 'ok', text: '✓ Power Draw: 32A 3-Phase available (2x Aputure 600d)' },
        { type: 'ok', text: '✓ Slider Tracking: 18m automated dolly path identified' },
        { type: 'prompt', text: '› Lighting Hazard: Reflective PVC surfaces detected' },
        { type: 'ok', text: '✓ Solution: Polarized diffusion frames deployed' },
        { type: 'comment', text: '# Audit Complete: 14 shots mapped in blueprint' },
        { type: 'pill', text: 'Recce Fee', value: '₹2,000 (Adjusted against retainer)' },
      ],
      ctaText: 'Book On-Location Recce (₹2,000)',
      ctaAction: () => onOpenRecce(),
    },
    {
      num: '03',
      title: 'Social Velocity',
      titleItalic: '9:16 Batch Engine',
      status: 'Proprietary Workflow · Retainer Powered',
      tagline: 'Engineered mobile short-form for the 18–35 demographic. 8–16 Reels per monthly cycle.',
      desc: 'A systematic script-to-screen production pipeline designed specifically for high-velocity Instagram Reels. We engineer visual retention curves, cutting dialogue entry within the first 1.8 seconds, synchronizing kinetic typography, and matching foley risers to eliminate drop-off. One shoot day yields an entire month of commercial authority.',
      builtFor: 'High-end retailers, hospitality brands, and modern clinics that require relentless, high-conversion organic social visibility without draining internal staff.',
      tags: ['1.8s Hook Architecture', '8–16 Reels / Shoot Day', 'Dialogue Isolation (-14 LUFS)', 'Kinetic Typography', 'Audio Foley Riser Sync', 'Algorithmic Distribution'],
      mockTitle: 'Social Velocity Pipeline · Batch Manifest',
      mockLines: [
        { type: 'comment', text: '# Processing Monthly Retainer Batch: October 2026' },
        { type: 'step', text: '› Client Account: Bags World Luxury Retail' },
        { type: 'ok', text: '✓ 3-Second Retention Hook Score: 9.4 / 10' },
        { type: 'ok', text: '✓ Average Cut Frequency: 1.8s per shot (Zero drag)' },
        { type: 'ok', text: '✓ Audio Normalization: -14.0 LUFS Dialogue Master' },
        { type: 'ok', text: '✓ Custom Subtitles: 2-line high-contrast kinetic font' },
        { type: 'comment', text: '# Exporting Batch Master Archive...' },
        { type: 'pill', text: 'Deliverables Ready', value: '12 Master 9:16 Reels (1080×1920 H.265)' },
      ],
      ctaText: 'Start Velocity Retainer',
      ctaAction: () => onStartInquiry('Social Velocity 9:16 Retainer'),
    },
    {
      num: '04',
      title: 'Studio Asset &',
      titleItalic: 'Delivery Hub',
      status: 'Cloud & LTO Archive · Client Portal',
      tagline: 'Lossless ProRes masters, multi-aspect ratio social crops, and organized textless archives.',
      desc: 'Say goodbye to compressed WhatsApp video links and lost Google Drive folders. Our client delivery hub provides instant, permanent access to full 4K ProRes masters, 9:16 mobile cuts, 1:1 square crops, clean feeds (without titles for future repurposing), and isolated audio stems. All assets are preserved on redundant on-site LTO cold storage.',
      builtFor: 'Marketing directors, agency partners, and enterprise founders who need structured, lossless assets ready for broadcast, paid ads, and print collateral.',
      tags: ['Lossless ProRes 422 HQ', 'Multi-Aspect Ratio Exports', 'Textless Clean Feeds', 'Audio Stems (DX/FX/MX)', 'Redundant LTO Archive', 'Direct Client Portal'],
      mockTitle: 'BrandShoots Delivery Hub · Master Package',
      mockLines: [
        { type: 'comment', text: '# Final Client Asset Manifest Generation' },
        { type: 'step', text: '› Client: Viswatuff Glass Architectural Glazing' },
        { type: 'ok', text: '✓ Master-16x9-4K-ProRes422HQ.mov (4.8 GB)' },
        { type: 'ok', text: '✓ Social-9x16-1080p-H265.mp4 (145 MB)' },
        { type: 'ok', text: '✓ Social-1x1-Square-H265.mp4 (112 MB)' },
        { type: 'ok', text: '✓ Textless-Clean-Feed-Master.mov (4.8 GB)' },
        { type: 'ok', text: '✓ Audio-Stems-Dialogue-Foley-Score.wav (320 MB)' },
        { type: 'pill', text: 'Archive Status', value: 'LTO Redundant Tape Backup Verified' },
      ],
      ctaText: 'Access Client Portal',
      ctaAction: () => onStartInquiry('Commercial Asset Delivery Hub'),
    },
  ];

  return (
    <section id="systems" className="relative w-full py-24 sm:py-32 bg-[#05070B] overflow-hidden border-t border-white/[0.06]">
      {/* Background Watermark Typography */}
      <div className="absolute top-12 right-6 sm:right-12 select-none pointer-events-none text-[120px] sm:text-[200px] font-black text-white/[0.015] font-mono leading-none">
        TL
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span>Studio Systems & Production Engines</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            How We <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-200">Engineers.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            We don't sell vaporware or pretend to be an AI software company. These are the four genuine, battle-tested production systems and technical engines that power every commercial shoot at BrandShoots.
          </p>
        </div>

        {/* Systems Cards List with Alternating (Flip) Layout */}
        <div className="space-y-12 sm:space-y-16">
          {systems.map((sys, idx) => {
            const isFlipped = idx % 2 === 1;
            const isHovered = activeHoverSystem === idx;

            return (
              <article
                key={sys.num}
                onMouseEnter={() => setActiveHoverSystem(idx)}
                onMouseLeave={() => setActiveHoverSystem(null)}
                className={`relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-12 rounded-2xl bg-white/[0.015] border transition-all duration-300 items-center overflow-hidden ${
                  isHovered
                    ? 'border-blue-500/50 bg-blue-950/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_30px_rgba(37,99,235,0.15)] -translate-y-1'
                    : 'border-white/[0.07] hover:border-white/[0.15]'
                }`}
              >
                {/* Radial Glow on Hover */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-500 bg-[radial-gradient(600px_circle_at_center,rgba(37,99,235,0.12),transparent_70%)] ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Left/Right Text Narrative Block */}
                <div
                  className={`lg:col-span-7 flex flex-col justify-between relative z-10 ${
                    isFlipped ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div>
                    {/* Status Pill Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] sm:text-xs font-mono uppercase tracking-wider mb-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      <span>{sys.status}</span>
                    </div>

                    <div className="text-xs font-mono tracking-[0.25em] text-blue-500 font-bold mb-1">
                      SYSTEM // {sys.num}
                    </div>

                    <h3 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight mb-2">
                      {sys.title} <span className="text-blue-400 italic font-serif font-normal">{sys.titleItalic}</span>
                    </h3>

                    <p className="text-sm sm:text-base text-slate-300 font-medium italic mb-4">
                      "{sys.tagline}"
                    </p>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-5">
                      {sys.desc}
                    </p>

                    {/* Dedicated ICP Targeting Box */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border-l-2 border-blue-500 mb-6">
                      <span className="text-xs text-slate-300 leading-relaxed block">
                        <strong className="text-white font-semibold uppercase tracking-wider text-[11px] block mb-1">
                          Built specifically for:
                        </strong>
                        {sys.builtFor}
                      </span>
                    </div>

                    {/* System Tech & Spec Pills */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {sys.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-slate-300 bg-white/[0.04] border border-white/[0.08] rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Direct Action */}
                  <div className="pt-4 border-t border-white/[0.08] flex items-center gap-4">
                    <button
                      onClick={sys.ctaAction}
                      className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center gap-2 group"
                    >
                      <span>{sys.ctaText}</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>

                {/* Right/Left Interactive Terminal / Studio Chassis Mock */}
                <div
                  className={`lg:col-span-5 relative z-10 ${
                    isFlipped ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="w-full rounded-xl bg-[#030508] border border-white/[0.12] overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-blue-500/40">
                    {/* Window Title Bar with macOS Window Dots */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#0A0E17] border-b border-white/[0.08]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 tracking-wider truncate max-w-[200px]">
                        {sys.mockTitle}
                      </span>
                      <div className="w-6" />
                    </div>

                    {/* Window Code/Execution Body */}
                    <div className="p-4 sm:p-5 font-mono text-xs leading-relaxed space-y-2 text-slate-300 min-h-[220px] flex flex-col justify-center bg-black/40">
                      {sys.mockLines.map((line, lIdx) => {
                        if (line.type === 'comment') {
                          return (
                            <div key={lIdx} className="text-slate-500 text-[11px]">
                              {line.text}
                            </div>
                          );
                        }
                        if (line.type === 'ok') {
                          return (
                            <div key={lIdx} className="text-emerald-400 text-[11px] flex items-center gap-1">
                              {line.text}
                            </div>
                          );
                        }
                        if (line.type === 'prompt') {
                          return (
                            <div key={lIdx} className="text-blue-300 text-[11px]">
                              {line.text}
                            </div>
                          );
                        }
                        if (line.type === 'pill') {
                          return (
                            <div key={lIdx} className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px]">
                              <span className="text-slate-400">{line.text}:</span>
                              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                                {line.value}
                              </span>
                            </div>
                          );
                        }
                        return (
                          <div key={lIdx} className="text-slate-300 text-[11px]">
                            {line.text}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Shared Bottom CTA Band (With Media inspired) */}
        <div className="mt-16 sm:mt-24 p-8 sm:p-14 rounded-2xl bg-gradient-to-br from-[#0A1020] to-[#05070B] border border-blue-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.2),transparent_70%)] pointer-events-none" />
          <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight mb-4 relative z-10">
            Want to Deploy Our <span className="text-blue-400 italic font-serif font-normal">Production Suite?</span>
          </h3>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 mb-8 relative z-10 leading-relaxed">
            Every pipeline above is active in our studio right now. Whether you need a commercial film, an ongoing monthly short-form retainer, or a facility recce, we engineer the complete narrative.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <button
              onClick={() => onStartInquiry('Commercial Retainer Partnership')}
              className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-blue-500 shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2 group"
            >
              <span>Initiate Studio Partnership</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button
              onClick={onOpenRecce}
              className="px-6 py-4 rounded-full bg-white/[0.04] border border-blue-500/30 text-blue-400 font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-blue-500/10 transition-all"
            >
              Schedule On-Location Recce (₹2,000)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
