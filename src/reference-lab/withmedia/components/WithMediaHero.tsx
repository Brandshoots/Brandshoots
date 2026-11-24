import React, { useRef, useState } from 'react';

interface WithMediaHeroProps {
  onExploreWork: () => void;
  onOpenRecce: () => void;
  onOpenInquiry: () => void;
}

export const WithMediaHero: React.FC<WithMediaHeroProps> = ({
  onExploreWork,
  onOpenRecce,
  onOpenInquiry: _onOpenInquiry,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const clientMarqueeRow1 = [
    'Santhi Pipes',
    'Viswatuff Glass',
    'Bags World',
    'Aabharan Jewellers',
    'Sahana Dry Fruits',
    'Tea3 Café',
    'Dayanidhi Interiors',
    'Jain Beauty Concepts',
  ];

  const clientMarqueeRow2 = [
    'SB Ventures',
    'KC Overseas',
    'New PlayZone Entertainment',
    'Adv. Leela Srinivas',
    'Born Pretty Studios',
    'AI by Nikhil',
    'SRK Doors World',
    'Fresh & Fresh',
  ];

  return (
    <section className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-12 overflow-hidden bg-[#05070B]">
      {/* Background Video Layer with Obsidian Cinematic Grain & Gradient Masks */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20 sm:opacity-25 filter contrast-125 saturate-110"
          src="/reels/wearebrandshoots/wearebrandshoots_2025-10-16_15-04-28_3744567634965812934_77785749886.mp4"
        />
        {/* Obsidian Vignette & Radial Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/70 to-[#05070B]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(37,99,235,0.15),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Hero Core Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        {/* Eyebrow & Status Telemetry */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/40 border border-blue-500/30 text-blue-400 text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] mb-6 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          <span>Rajamahendravaram & Hyderabad · Commercial Studio</span>
        </div>

        {/* Monolithic Dual-Row Headline (With Media inspired scale, Source Sans 3 craft) */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tight text-white leading-[0.92] mb-6">
          <span className="block hover:text-slate-100 transition-colors">
            Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-white">Cinema</span>
          </span>
          <span className="block mt-1 sm:mt-2">
            Meets <span className="italic font-serif font-normal text-blue-500 underline decoration-blue-500/40 decoration-wavy decoration-2">Commerce.</span>
          </span>
        </h1>

        {/* Studio Positioning Statement */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed mb-8">
          BrandShoots is an anti-template commercial filmmaking studio. We discard generic stock footage, replacing social noise with precision cinematography, high-retention 9:16 engineering, and DaVinci color mastery that commands category leadership.
        </p>

        {/* Hero Interactive Actions */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-5 mb-10">
          <button
            onClick={onExploreWork}
            className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-blue-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-blue-500 shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2 group"
          >
            <span>Explore Selected Work</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <button
            onClick={onOpenRecce}
            className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white/[0.04] border border-blue-500/30 text-white font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-blue-500/10 hover:border-blue-400 transition-all flex items-center gap-2.5 shadow-[0_0_15px_rgba(37,99,235,0.1)]"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Book On-Location Recce (₹2,000)</span>
          </button>

          {/* Sound Toggle for Background Reel */}
          <button
            onClick={toggleSound}
            className="p-3 sm:p-3.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white hover:border-blue-500/40 transition-all"
            title={isMuted ? 'Unmute Ambient Reel' : 'Mute Reel'}
            aria-label="Toggle audio"
          >
            {isMuted ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>

        {/* Verified Performance Telemetry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/[0.08]">
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">50M+</span>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Organic Views Generated</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">16+</span>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Enterprise Retainers</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">100%</span>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">DaVinci ACES Pipeline</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">₹2,000</span>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">On-Location Recce</span>
          </div>
        </div>
      </div>

      {/* Dual Direction Ticker Marquee */}
      <div className="relative z-10 w-full overflow-hidden mt-12 pt-4 border-t border-white/[0.06] bg-[#05070B]/50">
        {/* Track 1 - Left to Right */}
        <div className="flex whitespace-nowrap gap-8 animate-[marquee_30s_linear_infinite] mb-2 text-xs sm:text-sm font-semibold tracking-widest uppercase text-slate-400">
          {[...clientMarqueeRow1, ...clientMarqueeRow1].map((client, idx) => (
            <span key={idx} className="flex items-center gap-3">
              <span>{client}</span>
              <span className="text-blue-500">✦</span>
            </span>
          ))}
        </div>

        {/* Track 2 - Right to Left */}
        <div className="flex whitespace-nowrap gap-8 animate-[marquee-reverse_30s_linear_infinite] text-[11px] sm:text-xs font-mono tracking-widest uppercase text-slate-500">
          {[...clientMarqueeRow2, ...clientMarqueeRow2].map((client, idx) => (
            <span key={idx} className="flex items-center gap-3">
              <span>{client}</span>
              <span className="text-slate-600">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
