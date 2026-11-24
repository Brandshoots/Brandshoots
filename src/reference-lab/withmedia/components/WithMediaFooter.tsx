import React from 'react';

interface WithMediaFooterProps {
  onNavigate: (tabId: string) => void;
  onOpenRecce: () => void;
  onStartInquiry: () => void;
}

export const WithMediaFooter: React.FC<WithMediaFooterProps> = ({
  onNavigate,
  onOpenRecce,
  onStartInquiry,
}) => {
  return (
    <footer className="relative w-full bg-[#030508] border-t border-white/[0.08] pt-16 sm:pt-20 pb-12 overflow-hidden text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-white/[0.08]">
          {/* Col 1: Brand & Creed */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0A0F1D] border border-blue-500/30 flex items-center justify-center p-2 shadow-[0_0_15px_rgba(37,99,235,0.25)]">
                <img src="/logo.svg" alt="BrandShoots" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-[0.18em] uppercase text-white">
                  BRAND<span className="text-blue-500">SHOOTS</span>
                </span>
                <span className="text-[9px] tracking-[0.24em] uppercase text-slate-400 font-mono">
                  CREATE · SHOOT · GROW
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Anti-template commercial filmmaking studio headquartered in Rajamahendravaram with metropolitan operations in Hyderabad. Commercial cinema, 9:16 velocity, and DaVinci post mastery.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onOpenRecce}
                className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono uppercase tracking-wider hover:bg-blue-500/20 transition-all"
              >
                Recce (₹2,000)
              </button>
              <button
                onClick={onStartInquiry}
                className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-500 transition-all shadow-[0_0_12px_rgba(37,99,235,0.3)]"
              >
                Start Retainer →
              </button>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400 block mb-1">
              Index
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-blue-400 transition-colors uppercase">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-blue-400 transition-colors uppercase">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('systems')} className="hover:text-blue-400 transition-colors uppercase">
                  Studio Systems
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portfolio')} className="hover:text-blue-400 transition-colors uppercase">
                  Portfolio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('clientele')} className="hover:text-blue-400 transition-colors uppercase">
                  Clientele
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-blue-400 transition-colors uppercase">
                  About Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-blue-400 transition-colors uppercase">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Disciplines */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400 block mb-1">
              Disciplines
            </span>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li>Commercial Video Production</li>
              <li>9:16 Short-Form Social Velocity</li>
              <li>DaVinci Resolve Studio Color</li>
              <li>ACES Color Management Suite</li>
              <li>On-Location Technical Recce</li>
              <li>Brand & Creative Strategy</li>
            </ul>
          </div>

          {/* Col 4: Physical Studio Footprint */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400 block mb-1">
              Locations
            </span>
            <div className="text-xs text-slate-300 space-y-3">
              <div>
                <strong className="block text-white uppercase text-[11px]">Rajamahendravaram</strong>
                <span className="text-slate-400 text-[11px] leading-tight block">Studio & Industrial Corridor Base</span>
              </div>
              <div>
                <strong className="block text-white uppercase text-[11px]">Hyderabad</strong>
                <span className="text-slate-400 text-[11px] leading-tight block">Metropolitan Commercial Hub</span>
              </div>
              <div className="pt-2 text-blue-400 font-mono text-[11px]">
                <a href="https://instagram.com/wearebrandshoots" target="_blank" rel="noreferrer" className="hover:underline">
                  @wearebrandshoots
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
          <div>
            © {new Date().getFullYear()} BrandShoots. All Rights Reserved. Create · Shoot · Grow.
          </div>
          <div className="flex items-center gap-6">
            <span>Reference Lab: With Media Reverse Engineering Prototype</span>
            <span className="text-blue-500">BS-REF-WM-2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
