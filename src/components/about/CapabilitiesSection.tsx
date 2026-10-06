import React, { useState, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ServiceItem {
  id: string;
  number: string;
  name: string;
  tagline: string;
  deliverables: string;
  bgGradient: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'brand-creative',
    number: '01',
    name: 'BRAND & CREATIVE',
    tagline: 'Brand Architecture • Visual Identity • Creative Direction • Concept Development',
    deliverables: 'Transforming brand vision into iconic aesthetic systems.',
    bgGradient: 'radial-gradient(ellipse at 40% 50%, rgba(19, 158, 242, 0.22) 0%, rgba(11, 16, 78, 0.4) 50%, transparent 75%)',
  },
  {
    id: 'video-production',
    number: '02',
    name: 'VIDEO PRODUCTION',
    tagline: 'Commercial Films • Brand Documentaries • Product Shoots • Set Direction',
    deliverables: 'Cinema-grade storytelling designed to command attention.',
    bgGradient: 'radial-gradient(ellipse at 60% 45%, rgba(0, 110, 255, 0.24) 0%, rgba(7, 11, 51, 0.45) 50%, transparent 75%)',
  },
  {
    id: 'short-form',
    number: '03',
    name: 'SHORT-FORM CONTENT',
    tagline: 'Reels • TikTok • Shorts • Viral Social Campaigns',
    deliverables: 'Fast-paced, hook-driven vertical content built for feed velocity.',
    bgGradient: 'radial-gradient(ellipse at 50% 55%, rgba(19, 158, 242, 0.25) 0%, rgba(15, 23, 42, 0.5) 50%, transparent 75%)',
  },
  {
    id: 'editing-post',
    number: '04',
    name: 'EDITING & POST',
    tagline: 'Precision Edit • Color Grading • Sound Architecture • Visual FX',
    deliverables: 'Hollywood-level rhythm, color pacing, and sensory audio design.',
    bgGradient: 'radial-gradient(ellipse at 35% 60%, rgba(30, 130, 240, 0.2) 0%, rgba(10, 15, 30, 0.45) 50%, transparent 75%)',
  },
  {
    id: 'social-media',
    number: '05',
    name: 'SOCIAL MEDIA',
    tagline: 'Content Distribution • Channel Strategy • Community Engagement',
    deliverables: 'Sustained digital presence turning viewers into loyal advocates.',
    bgGradient: 'radial-gradient(ellipse at 65% 50%, rgba(19, 158, 242, 0.22) 0%, rgba(11, 16, 78, 0.4) 50%, transparent 75%)',
  },
  {
    id: 'digital-growth',
    number: '06',
    name: 'DIGITAL GROWTH',
    tagline: 'Performance Campaigns • Audience Scaling • Analytics • Brand Equity',
    deliverables: 'Engineering compound returns on creative assets.',
    bgGradient: 'radial-gradient(ellipse at 50% 40%, rgba(0, 180, 255, 0.24) 0%, rgba(8, 12, 45, 0.45) 50%, transparent 75%)',
  },
];

export const CapabilitiesSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);
  const containerRef = useRef<HTMLElement>(null);

  const activeService = hoveredIndex !== null ? SERVICES[hoveredIndex] : SERVICES[0];

  return (
    <section
      id="capabilities"
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#04060A] text-white py-24 sm:py-32 lg:py-36 px-6 sm:px-12 lg:px-16 select-none overflow-hidden transition-colors duration-700"
    >
      {/* Dynamic Background Atmosphere responding to active service */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-700">
        <div
          className="absolute inset-0 transition-all duration-700 opacity-90"
          style={{ background: activeService.bgGradient }}
        />
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:5rem_5rem]" />
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#04060A] to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#04060A] to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1720px] mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#139EF2] shadow-[0_0_10px_#139EF2]" />
            <span className="font-mono text-xs sm:text-[13px] tracking-[0.38em] uppercase text-[#139EF2] font-semibold">
              05 // CAPABILITIES & SERVICES
            </span>
          </div>
          <h2 className="font-display font-black uppercase text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#F7F9FF]">
            WHAT WE DO BEST.
          </h2>
        </div>

        {/* Massive Typographic Services List */}
        <div className="flex flex-col border-t border-white/10">
          {SERVICES.map((service, index) => {
            const isHovered = hoveredIndex === index;
            const isAnyHovered = hoveredIndex !== null;

            return (
              <div
                key={service.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onClick={() => setHoveredIndex(index)}
                className={`group relative py-7 sm:py-9 lg:py-11 border-b border-white/10 transition-all duration-300 cursor-pointer ${
                  isHovered ? 'pl-3 sm:pl-6' : isAnyHovered ? 'opacity-40' : 'opacity-85'
                }`}
              >
                {/* Active Left Indicator Bar */}
                {isHovered && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 sm:h-16 bg-[#139EF2] rounded-full shadow-[0_0_12px_#139EF2] animate-pulse" />
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Service Number & Name */}
                  <div className="flex items-center gap-4 sm:gap-7">
                    <span
                      className={`font-mono text-xs sm:text-sm tracking-[0.25em] transition-colors duration-200 ${
                        isHovered ? 'text-[#139EF2] font-bold' : 'text-white/40'
                      }`}
                    >
                      {service.number}
                    </span>

                    <h3
                      className={`font-display font-black uppercase tracking-tight transition-all duration-300 ${
                        isHovered
                          ? 'text-[#F7F9FF] text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl drop-shadow-[0_0_30px_rgba(19,158,242,0.4)]'
                          : 'text-white/70 text-2xl sm:text-4xl md:text-5xl lg:text-6xl'
                      }`}
                    >
                      {service.name}
                    </h3>
                  </div>

                  {/* Desktop Right Meta */}
                  <div className="flex items-center gap-6 lg:text-right">
                    <div
                      className={`transition-all duration-300 ${
                        isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 hidden lg:block'
                      }`}
                    >
                      <p className="font-mono text-xs sm:text-[13px] text-[#139EF2] tracking-[0.2em] uppercase font-semibold">
                        {service.deliverables}
                      </p>
                      <p className="font-editorial text-xs sm:text-sm text-white/60 mt-1 max-w-md hidden sm:block">
                        {service.tagline}
                      </p>
                    </div>

                    <div
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 shrink-0 ${
                        isHovered
                          ? 'bg-[#139EF2] border-[#139EF2] text-white shadow-[0_0_16px_rgba(19,158,242,0.6)]'
                          : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
