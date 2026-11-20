import React from 'react';

interface WithMediaAboutProps {
  onStartInquiry: () => void;
  onOpenRecce: () => void;
}

export const WithMediaAbout: React.FC<WithMediaAboutProps> = ({
  onStartInquiry,
  onOpenRecce: _onOpenRecce,
}) => {
  return (
    <section id="about" className="relative w-full py-24 sm:py-32 bg-[#05070B] overflow-hidden border-t border-white/[0.06]">
      {/* Background Watermark Typography */}
      <div className="absolute top-12 right-6 sm:right-12 select-none pointer-events-none text-[120px] sm:text-[200px] font-black text-white/[0.015] font-mono leading-none">
        AB
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-widest mb-4">
            <span>Studio Manifesto & Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-200">BrandShoots.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            We are not a social media management agency that happens to own a camera. We are commercial filmmakers who understand digital commercial velocity.
          </p>
        </div>

        {/* 2-Column Split: Founder & Studio Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Col 1: Studio Creed & Anti-Template Philosophy */}
          <div className="lg:col-span-7 space-y-8">
            <div className="p-8 sm:p-10 rounded-2xl bg-[#090D16] border border-white/[0.08] shadow-2xl">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400 block mb-2">
                // The Brand Creed
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight mb-4">
                CREATE · SHOOT · GROW
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                Most digital marketing agencies rely on cookie-cutter Canva templates, generic AI scripts, and uncalibrated phone videos. The result is visual noise that destroys brand prestige. BrandShoots was created on a singular counter-cultural premise: <strong>treat commercial brands with the respect of cinematic storytelling.</strong>
              </p>

              <div className="space-y-4 pt-6 border-t border-white/[0.08]">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 text-xs font-mono flex items-center justify-center shrink-0 mt-0.5">
                    01
                  </span>
                  <div>
                    <h4 className="text-sm font-bold uppercase text-white">No Speculative Stock Footage</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Every frame in our deliverables is shot on your premises with real machinery, real products, and real staff.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 text-xs font-mono flex items-center justify-center shrink-0 mt-0.5">
                    02
                  </span>
                  <div>
                    <h4 className="text-sm font-bold uppercase text-white">Full-Spectrum In-House Pipeline</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      We never outsource color grading or sound design to unvetted freelancers. Everything is finished inside our studio suite.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 text-xs font-mono flex items-center justify-center shrink-0 mt-0.5">
                    03
                  </span>
                  <div>
                    <h4 className="text-sm font-bold uppercase text-white">Dual-Region Footprint</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Active operational crews based in Rajamahendravaram for industrial corridors and Hyderabad for metropolitan commercial shoots.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Studio Technical Inventory */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 block mb-3">
                In-House Technical Rigs
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-300">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  Sony Cinema FX Packages
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  Anamorphic Prime Glass
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  DJI Ronin RS Stabilization
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  Aputure Daylight Arrays
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  DaVinci Resolve Studio 19
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  Sennheiser / Rode Audio Rigs
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Leadership Profile & Contact Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#0E1526] to-[#060912] border border-blue-500/30 shadow-2xl relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 p-3 mb-6 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                <img src="/logo.svg" alt="BrandShoots" className="w-full h-full object-contain" />
              </div>

              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-blue-400 block mb-1">
                Founder & Creative Director
              </span>
              <h3 className="text-2xl font-black uppercase text-white tracking-tight mb-3">
                Durgarao Vallepu
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                "Our clients don't come to us for viral gimmicks that vanish in 24 hours. They come to us because they spent twenty years building an industrial plant, a jewelry heritage, or a premier hospital, and they refuse to let low-grade marketing misrepresent their life's work."
              </p>

              <div className="space-y-2 pt-4 border-t border-white/[0.08] text-xs font-mono text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Direct WhatsApp:</span>
                  <a href="https://wa.me/917075960672" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                    +91 70759 60672
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span>Instagram:</span>
                  <a href="https://instagram.com/wearebrandshoots" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                    @wearebrandshoots
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span>Official Email:</span>
                  <span className="text-slate-200">contact@brandshoots.com</span>
                </div>
              </div>
            </div>

            {/* Direct Booking Trigger */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col gap-4">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                Ready to elevate your production?
              </span>
              <button
                onClick={onStartInquiry}
                className="w-full py-3.5 rounded-full bg-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all"
              >
                Inquire for Production Retainer →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
