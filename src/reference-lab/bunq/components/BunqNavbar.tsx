import React, { useState, useEffect } from 'react';
import { VolumeX, ArrowRight } from 'lucide-react';
import { soundSynth } from './BunqSoundSynth';

interface BunqNavbarProps {
  onOpenInquiry: (service?: string) => void;
  activeSection?: string;
}

export const BunqNavbar: React.FC<BunqNavbarProps> = ({ onOpenInquiry, activeSection: _activeSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [hoveredService, setHoveredService] = useState<number>(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    soundSynth.playWhoosh(300, 100, 0.25);
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSound = () => {
    const isNowPlaying = soundSynth.toggleMute();
    setIsAudioActive(isNowPlaying);
  };

  const servicesPreview = [
    {
      title: '01 // CREATE',
      name: 'Brand & Creative Strategy',
      desc: 'Developing original narrative arcs, scripting high-retention first-3-second hooks, and establishing lighting aesthetic before cameras arrive on set.',
      tag: 'STRATEGY & HOOKS',
      image: '/what-we-do/optimized/creative-content.webp',
    },
    {
      title: '02 // SHOOT',
      name: 'Commercial Video Production',
      desc: 'Deploying cinema camera packages, specialized macro probe lenses, motorized tracking sliders, and volumetric lighting on-location.',
      tag: 'CINEMATOGRAPHY & SETS',
      image: '/what-we-do/optimized/digital-growth.webp',
    },
    {
      title: '03 // GROW',
      name: 'DaVinci Post & Feed Velocity',
      desc: 'Hollywood-standard DaVinci Resolve color grading, custom sound design, rapid rhythmic match-cutting, and synchronized platform distribution.',
      tag: 'POST-PRODUCTION & GROWTH',
      image: '/what-we-do/optimized/editing-posting.webp',
    },
  ];

  const navigateTo = (id: string) => {
    setIsMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Floating Header Pill */}
      <header
        className={`fixed top-4 inset-x-0 z-40 max-w-7xl mx-auto px-4 sm:px-8 transition-all duration-300 pointer-events-none`}
      >
        <div
          className={`w-full py-3 px-5 sm:px-6 rounded-full flex items-center justify-between border transition-all duration-300 pointer-events-auto ${
            scrolled
              ? 'bg-[#05070B]/90 backdrop-blur-xl border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
              : 'bg-[#05070B]/50 backdrop-blur-md border-white/10'
          }`}
        >
          {/* Logo Mark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('hero');
            }}
            className="flex items-center gap-1.5 cursor-pointer select-none"
          >
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-[#139EF2] font-['Figtree']">
              BRAND
            </span>
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-white font-['Figtree']">
              SHOOTS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#139EF2] mb-2 ml-0.5 animate-pulse" />
          </a>

          {/* Center Navigation Shortcuts (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-widest uppercase text-white/70">
            <button
              onClick={() => navigateTo('work')}
              className="hover:text-white transition-colors"
            >
              Work
            </button>
            <button
              onClick={() => navigateTo('services')}
              className="hover:text-white transition-colors"
            >
              Trinity
            </button>
            <button
              onClick={() => navigateTo('about')}
              className="hover:text-white transition-colors"
            >
              Studio
            </button>
            <button
              onClick={() => navigateTo('clientele')}
              className="hover:text-white transition-colors"
            >
              Clients
            </button>
          </nav>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Audio Waveform Synthesizer Button */}
            <button
              type="button"
              onClick={toggleSound}
              aria-label={isAudioActive ? 'Mute Studio Ambient' : 'Enable Studio Ambient'}
              className={`p-2.5 rounded-full border transition-all flex items-center justify-center ${
                isAudioActive
                  ? 'border-[#139EF2] bg-[#139EF2]/20 text-[#139EF2]'
                  : 'border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/20'
              }`}
            >
              {isAudioActive ? (
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-3 bg-[#139EF2] animate-pulse" />
                  <span className="w-0.5 h-2 bg-[#139EF2] animate-pulse delay-75" />
                  <span className="w-0.5 h-3.5 bg-[#139EF2] animate-pulse delay-150" />
                </div>
              ) : (
                <VolumeX size={14} />
              )}
            </button>

            {/* "Let's Talk" CTA */}
            <button
              onClick={() => {
                soundSynth.playWhoosh(350, 150, 0.2);
                onOpenInquiry();
              }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#139EF2] hover:bg-[#008CFF] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(19,158,242,0.35)]"
            >
              <span>Let's Talk</span>
              <ArrowRight size={13} />
            </button>

            {/* Menu Toggle Button */}
            <button
              type="button"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
              className="px-3.5 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center gap-2 text-xs font-mono uppercase tracking-wider transition-all"
            >
              <div className="w-4 flex flex-col gap-1 items-end">
                <span
                  className={`h-0.5 bg-white transition-all duration-300 ${
                    isMenuOpen ? 'w-4 rotate-45 translate-y-1.5' : 'w-4'
                  }`}
                />
                <span
                  className={`h-0.5 bg-[#139EF2] transition-all duration-300 ${
                    isMenuOpen ? 'w-4 -rotate-45 -translate-y-0' : 'w-2.5'
                  }`}
                />
              </div>
              <span className="hidden xs:inline">{isMenuOpen ? 'Close' : 'Menu'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Full Two-Column Navigation Menu Overlay (BUNQ LABS Signature) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#05070B]/95 backdrop-blur-2xl text-white flex flex-col justify-between p-6 sm:p-12 md:p-16 animate-in fade-in duration-300 overflow-y-auto">
          {/* Top Spacing to account for header */}
          <div className="h-16" />

          {/* Two-Column Body */}
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 my-auto">
            {/* Left Column: Primary Navigation Links */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#139EF2] block">
                01 // INDEX NAVIGATION
              </span>

              <nav className="flex flex-col space-y-3">
                {[
                  { label: 'Work', target: 'work', sub: '12 Commercial Films' },
                  { label: 'Trinity', target: 'services', sub: 'Create • Shoot • Grow' },
                  { label: 'Studio', target: 'about', sub: 'Vision & Leadership' },
                  { label: 'Clients', target: 'clientele', sub: 'Verified Partners' },
                ].map((item) => (
                  <button
                    key={item.target}
                    onClick={() => {
                      soundSynth.playCardTick();
                      navigateTo(item.target);
                    }}
                    className="group text-left py-2 flex items-baseline justify-between border-b border-white/5 hover:border-[#139EF2]/40 transition-colors"
                  >
                    <span className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white group-hover:text-[#139EF2] transition-colors font-['Figtree']">
                      {item.label}
                    </span>
                    <span className="text-xs font-mono text-white/40 group-hover:text-white transition-colors">
                      {item.sub}
                    </span>
                  </button>
                ))}
              </nav>

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenInquiry('Commercial Retainer');
                  }}
                  className="px-6 py-3 rounded-full bg-[#139EF2] text-white text-xs font-mono uppercase tracking-widest flex items-center gap-2"
                >
                  <span>Start A Project</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenInquiry('On-Location Technical Recce (₹2,000)');
                  }}
                  className="px-5 py-3 rounded-full border border-white/20 text-white text-xs font-mono uppercase tracking-widest hover:border-[#139EF2]"
                >
                  Book Recce (₹2,000)
                </button>
              </div>
            </div>

            {/* Right Column: Live Services Hover Preview Card (BUNQ LABS Pattern) */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-white/40 block">
                02 // CAPABILITIES PREVIEW
              </span>

              {/* Service List with Hover Triggers */}
              <div className="space-y-2">
                {servicesPreview.map((s, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => {
                      soundSynth.playCardTick();
                      setHoveredService(idx);
                    }}
                    onClick={() => {
                      navigateTo('services');
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      hoveredService === idx
                        ? 'border-[#139EF2] bg-[#139EF2]/10'
                        : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-[#139EF2]">{s.title}</span>
                      <span className="text-[10px] font-mono text-white/40">{s.tag}</span>
                    </div>
                    <div className="text-lg font-bold text-white font-['Figtree']">{s.name}</div>
                    <p className="text-xs text-white/60 mt-1 line-clamp-2">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Bottom Bar */}
          <div className="max-w-7xl mx-auto w-full pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/50">
            <div>Rajamahendravaram AP • Hyderabad TS</div>
            <div className="flex items-center gap-6">
              <a
                href="https://instagram.com/wearebrandshoots"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#139EF2] transition-colors"
              >
                @wearebrandshoots
              </a>
              <a
                href="https://wa.me/917075960672"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#139EF2] transition-colors"
              >
                +91 70759 60672
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
