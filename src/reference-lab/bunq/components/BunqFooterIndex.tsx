import React from 'react';
import { ArrowUp, Instagram, Youtube, Phone, Mail, MessageCircle, MapPin, Sparkles } from 'lucide-react';
import { CLIENT_PROJECTS, ClientProject } from '../../../data/clientsData';
import { soundSynth } from './BunqSoundSynth';

interface BunqFooterIndexProps {
  onSelectProject: (p: ClientProject) => void;
  onStartInquiry: (service?: string) => void;
}

export const BunqFooterIndex: React.FC<BunqFooterIndexProps> = ({
  onSelectProject,
  onStartInquiry,
}) => {
  const scrollToTop = () => {
    soundSynth.playWhoosh(250, 450, 0.25);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full bg-[#020306] text-white pt-24 pb-12 border-t border-white/10 select-none overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-[#0B104E]/20 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10 space-y-20">
        {/* Big CTA Banner (BUNQ LABS "Let's Start With Your Idea" Stance) */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 pb-16 border-b border-white/10">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#139EF2]">
              <Sparkles size={14} />
              <span>LET'S CREATE SOMETHING WORTH REMEMBERING</span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white font-sans leading-[0.95]">
              Ready To Make Your Story Move?
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <button
              onClick={() => {
                soundSynth.playWhoosh(350, 150, 0.2);
                onStartInquiry('Commercial Retainer');
              }}
              className="px-8 py-4 rounded-full bg-[#139EF2] hover:bg-[#008CFF] text-white font-bold text-xs font-mono uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(19,158,242,0.4)]"
            >
              Start A Project
            </button>
            <button
              onClick={() => {
                soundSynth.playWhoosh(350, 150, 0.2);
                onStartInquiry('On-Location Technical Recce (₹2,000)');
              }}
              className="px-7 py-4 rounded-full border border-white/20 hover:border-white/40 text-white text-xs font-mono uppercase tracking-widest transition-all"
            >
              Book Recce (₹2,000)
            </button>
          </div>
        </div>

        {/* 4-Column Editorial Site Index (BUNQ LABS Signature) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 font-sans">
          {/* Col 1: Pages */}
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-white/40">
              01 // INDEX
            </div>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <button
                  onClick={() => navigateTo('hero')}
                  className="hover:text-[#139EF2] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('work')}
                  className="hover:text-[#139EF2] transition-colors"
                >
                  Work (12 Films)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('services')}
                  className="hover:text-[#139EF2] transition-colors"
                >
                  The Content Trinity
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-[#139EF2] transition-colors"
                >
                  The Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('clientele')}
                  className="hover:text-[#139EF2] transition-colors"
                >
                  Clientele & Partners
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Selected Client Case Studies */}
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-white/40">
              02 // CLIENT ARCHIVE
            </div>
            <ul className="space-y-2.5 text-sm text-white/70">
              {CLIENT_PROJECTS.slice(0, 6).map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => {
                      soundSynth.playCardTick();
                      onSelectProject(p);
                    }}
                    className="hover:text-[#139EF2] transition-colors text-left"
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Capabilities */}
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-white/40">
              03 // TRINITY
            </div>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <button
                  onClick={() => onStartInquiry('Brand & Creative Strategy')}
                  className="hover:text-[#139EF2] transition-colors text-left"
                >
                  01 // Strategy & Hooks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onStartInquiry('Commercial Video Production')}
                  className="hover:text-[#139EF2] transition-colors text-left"
                >
                  02 // Commercial Cinematography
                </button>
              </li>
              <li>
                <button
                  onClick={() => onStartInquiry('9:16 Social Velocity / Reels')}
                  className="hover:text-[#139EF2] transition-colors text-left"
                >
                  03 // 9:16 Vertical Velocity
                </button>
              </li>
              <li>
                <button
                  onClick={() => onStartInquiry('DaVinci Resolve Color & Post')}
                  className="hover:text-[#139EF2] transition-colors text-left"
                >
                  04 // DaVinci Finishing & Audio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onStartInquiry('On-Location Technical Recce (₹2,000)')}
                  className="hover:text-[#139EF2] transition-colors text-left text-[#139EF2]"
                >
                  07 // Technical Recce (₹2,000)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio Direct & Social */}
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-white/40">
              04 // DIRECT STUDIO
            </div>
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#139EF2] shrink-0" />
                <a href="tel:+917075960672" className="hover:text-white transition-colors">
                  +91 70759 60672
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle size={14} className="text-[#139EF2] shrink-0" />
                <a
                  href="https://wa.me/917075960672"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp Studio Line
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#139EF2] shrink-0" />
                <a href="mailto:brandshoots.in@gmail.com" className="hover:text-white transition-colors">
                  brandshoots.in@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/50 pt-2 border-t border-white/10">
                <MapPin size={14} className="text-[#139EF2] shrink-0" />
                <span>Rajamahendravaram AP 533105</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monolithic Dual-Tone BrandShoots Wordmark at Bottom */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tighter text-[#139EF2] font-sans">
              BRAND
            </span>
            <span className="text-3xl sm:text-4xl font-black tracking-tighter text-white font-sans">
              SHOOTS
            </span>
            <span className="text-xs font-mono text-white/40 ml-4 hidden sm:inline">
              CREATE • SHOOT • GROW
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com/wearebrandshoots"
              target="_blank"
              rel="noreferrer"
              className="text-white/60 hover:text-[#139EF2] transition-colors"
              aria-label="BrandShoots on Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://youtube.com/@wearebrandshoots"
              target="_blank"
              rel="noreferrer"
              className="text-white/60 hover:text-[#139EF2] transition-colors"
              aria-label="BrandShoots on YouTube"
            >
              <Youtube size={18} />
            </a>

            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full border border-white/20 hover:border-[#139EF2] hover:bg-[#139EF2] text-white flex items-center justify-center transition-all ml-2"
              aria-label="Scroll back to top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        {/* Copyright Telemetry */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-white/30 gap-2 border-t border-white/5">
          <div>© {new Date().getFullYear()} BrandShoots. All Rights Reserved.</div>
          <div>Reference Lab // Bunq Labs Architecture Interpretation</div>
        </div>
      </div>
    </footer>
  );
};
