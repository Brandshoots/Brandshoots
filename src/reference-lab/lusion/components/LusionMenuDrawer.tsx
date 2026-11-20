import React from 'react';
import { ArrowUpRight, X } from 'lucide-react';

interface LusionMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenContact: () => void;
}

export const LusionMenuDrawer: React.FC<LusionMenuDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenContact,
}) => {
  if (!isOpen) return null;

  const links = [
    { id: 'home', label: '01 // HOME & VIEWPORT', tag: 'Hero Experience' },
    { id: 'showreel', label: '02 // CINEMA SHOWREEL', tag: '4K ProRes Master' },
    { id: 'portfolio', label: '03 // PORTFOLIO ARCHITECTURE', tag: 'Case Studies' },
    { id: 'about', label: '04 // PRODUCTION PHILOSOPHY', tag: 'Cinema Optics' },
    { id: 'services', label: '05 // THE THREE PILLARS', tag: 'Commercial Capabilities' },
    { id: 'clientele', label: '06 // VERIFIED CLIENT MATRIX', tag: '12+ Partners' },
    { id: 'contact', label: '07 // COMMISSION A SHOOT', tag: 'Direct Inquiry' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-3xl flex flex-col justify-between p-6 md:p-14 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <img src="/Logo Official.svg" alt="BrandShoots" className="h-7 w-auto brightness-200" />
          <span className="font-mono text-xs text-white/40 tracking-widest uppercase pl-3 border-l border-white/10">
            CINEMATOGRAPHIC NAVIGATION
          </span>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 font-mono text-xs font-semibold tracking-widest uppercase transition-colors"
        >
          <X className="w-4 h-4" />
          <span>CLOSE</span>
        </button>
      </div>

      {/* Main Links List (Lusion #header-menu-links) */}
      <div className="max-w-4xl mx-auto w-full my-auto py-8">
        <div className="space-y-4 md:space-y-6">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onClose();
                onNavigate(link.id);
              }}
              className="group w-full flex items-center justify-between text-left py-2 hover:pl-4 transition-all duration-300 border-b border-white/5 hover:border-[#139EF2]/40"
            >
              <div>
                <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white group-hover:text-[#139EF2] transition-colors uppercase tracking-tight">
                  {link.label}
                </span>
                <span className="font-mono text-[10px] md:text-xs text-white/40 ml-4 tracking-widest uppercase">
                  [{link.tag}]
                </span>
              </div>
              <ArrowUpRight className="w-6 h-6 text-white/20 group-hover:text-[#139EF2] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* Drawer Bottom Bar */}
      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6 font-mono text-xs text-white/40">
          <span>LOCATION: RAJAHMUNDRY, AP</span>
          <span>•</span>
          <span>EST. 2024</span>
        </div>

        <button
          onClick={() => {
            onClose();
            onOpenContact();
          }}
          className="px-6 py-3 rounded-full bg-[#139EF2] hover:bg-[#0d82ca] text-white font-mono text-xs tracking-widest uppercase font-semibold transition-all shadow-lg"
        >
          START DIRECT INQUIRY
        </button>
      </div>
    </div>
  );
};
