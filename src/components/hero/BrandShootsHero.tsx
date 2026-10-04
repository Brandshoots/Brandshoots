import { useState } from 'react';
import { Play, Sparkles, ArrowUpRight, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { setAudioEnabled } from '../../utils/audioFX';

interface BrandShootsHeroProps {
  onReplayPreloader?: () => void;
}

export const BrandShootsHero: React.FC<BrandShootsHeroProps> = ({ onReplayPreloader }) => {
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  const toggleAudio = () => {
    const nextState = !isAudioMuted;
    setIsAudioMuted(nextState);
    setAudioEnabled(!nextState);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#08090C] text-white flex flex-col justify-between overflow-hidden selection:bg-[#1497F5]">
      {/* Dynamic Background Studio Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#1497F5]/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-[#070B33]/60 rounded-full blur-[120px]" />
        <div className="absolute inset-0 cinema-grain opacity-25" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-20 w-full px-6 md:px-12 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-black/20">
        <div className="flex items-center gap-4">
          <img
            src="/Logo.png"
            alt="Brand Shoots"
            className="h-9 md:h-11 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(20,151,245,0.3)]"
          />
          <span className="hidden lg:inline-block text-[11px] font-mono text-[#B9BEC9] tracking-widest uppercase pl-4 border-l border-white/10">
            Creative Branding & Content Production
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest uppercase text-white/70">
          <a href="#work" className="hover:text-brand-blue transition-colors">Work</a>
          <a href="#capabilities" className="hover:text-brand-blue transition-colors">Capabilities</a>
          <a href="#studio" className="hover:text-brand-blue transition-colors">Studio</a>
          <a href="#about" className="hover:text-brand-blue transition-colors">About</a>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Replay Preloader Button for Quality Testing (Section 49) */}
          {onReplayPreloader && (
            <button
              onClick={onReplayPreloader}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 transition-all hover:border-brand-blue/50"
              title="Replay Opening Film Sequence"
            >
              <RotateCcw className="w-3.5 h-3.5 text-brand-blue" />
              <span className="hidden sm:inline">Replay Film</span>
            </button>
          )}

          {/* Audio Mute/Unmute toggle */}
          <button
            onClick={toggleAudio}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition-all"
            title={isAudioMuted ? 'Unmute Audio (Camera Click FX)' : 'Mute Audio'}
          >
            {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-brand-blue" />}
          </button>

          <a
            href="#contact"
            className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full bg-brand-blue text-white font-medium text-xs tracking-wider uppercase shadow-glow-blue hover:bg-[#139EF2] transition-all hover:scale-105"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Main Hero Showcase Center */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16 flex flex-col items-center text-center">
        {/* Production Stage Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono tracking-widest text-[#B9BEC9] uppercase mb-6 backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-brand-blue" />
          <span>Rajamahendravaram Creative Agency</span>
          <span className="text-white/40">•</span>
          <span className="text-brand-blue">2026 Production Slate</span>
        </div>

        {/* Master Cinema Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight leading-[1.05] max-w-5xl text-white">
          WE ENGINEER BRANDS THROUGH <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-brand-blue">CINEMATIC VISION.</span>
        </h1>

        {/* Tagline Three Pillars */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-white/80">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            CREATE IDEAS
          </span>
          <span className="text-brand-blue/60">/</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            SHOOT CONTENT
          </span>
          <span className="text-brand-blue/60">/</span>
          <span className="flex items-center gap-2 text-brand-blue font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shadow-glow-blue" />
            GROW BRANDS
          </span>
        </div>

        <p className="mt-6 max-w-2xl text-sm sm:text-base text-[#B9BEC9] font-normal leading-relaxed">
          More than isolated posts or one-off shoots. We combine conceptual thinking, high-end commercial video production, and social execution into an engine of compounding digital visibility.
        </p>

        {/* Hero Interactive Video Showcase Card (Visual Continuity from Preloader Device) */}
        <div className="mt-12 relative w-full max-w-4xl rounded-2xl p-1 bg-gradient-to-b from-white/15 via-white/5 to-transparent shadow-2xl">
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden bg-black border border-white/10 group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80"
              alt="Brand Shoots Master Showreel"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Play Button Centerpiece */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-brand-blue/90 hover:bg-brand-blue text-white flex items-center justify-center shadow-glow-blue transition-transform duration-300 group-hover:scale-110">
                <Play className="w-6 h-6 fill-white translate-x-0.5" />
              </div>
            </div>

            {/* Bottom Title Bar */}
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs font-mono text-white/90">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
                <span className="font-semibold tracking-wider uppercase">BRAND SHOOTS MASTER SHOWREEL 2026</span>
              </div>
              <span className="text-[#B9BEC9]">01:45 • 4K CINEMA</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Strip */}
      <footer className="relative z-10 w-full px-6 md:px-12 py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-white/50 gap-4">
        <div>
          <span>© 2026 BRAND SHOOTS. ALL RIGHTS RESERVED.</span>
        </div>
        <div className="flex items-center gap-6">
          <span>RAJMAHENDRAVARAM, AP</span>
          <span>•</span>
          <span className="text-white/80">@wearebrandshoots</span>
        </div>
      </footer>
    </div>
  );
};
