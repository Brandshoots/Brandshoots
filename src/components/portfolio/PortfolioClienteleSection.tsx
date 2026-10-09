import React from 'react';
import { useCMSContent } from '../../lib/cms/useCMSContent';

interface ClientLogoItem {
  name: string;
  category: string;
  logo: string;
}

const ALL_CLIENTS: ClientLogoItem[] = [
  { name: 'Santhi Pipes', category: 'Industrial & Infrastructure', logo: '/clients/trimmed/Shanti Pipes.png' },
  { name: 'Viswatuff Glass', category: 'Architectural Glass', logo: '/clients/trimmed/IMG_4537.PNG' },
  { name: 'Bags World', category: 'Retail & Fashion', logo: '/clients/trimmed/Bags World Logo.PNG' },
  { name: 'Aabharan Jewellers', category: 'Luxury & Heritage', logo: '/clients/trimmed/Aabharan Logo.png' },
  { name: 'Fresh & Fresh', category: 'Supermarket & FMCG', logo: '/clients/trimmed/Fresh and Fresh Logo.png' },
  { name: 'Dayanidhi Creations', category: 'Textiles & Apparel', logo: '/clients/trimmed/Dayanidhi Logo.png' },
  { name: 'Jain Beauty Studio', category: 'Beauty & Lifestyle', logo: '/clients/trimmed/Jain Beauty Logo.png' },
  { name: 'RK Home Living', category: 'Architectural Furnishings', logo: '/clients/trimmed/Rk home.png' },
  { name: 'SB Ventures', category: 'Real Estate & Land', logo: '/clients/trimmed/SB Ventures Logo.png' },
  { name: 'KC Overseas', category: 'Global Education', logo: '/clients/trimmed/KC Overseas Logo.PNG' },
  { name: 'SRK Doors World', category: 'Industrial Materials', logo: '/clients/trimmed/SRK Doors World Logo.png' },
  { name: 'Jain Enterprises', category: 'Commercial Trade', logo: '/clients/trimmed/Jain Enterprises Logo.png' },
  { name: 'Nirmala', category: 'Consumer Brands', logo: '/clients/trimmed/Nirmala logo.png' },
  { name: 'Rudra', category: 'Hospitality & Dining', logo: '/clients/trimmed/Rudra logo.png' },
  { name: 'Sahana', category: 'Fine Silks', logo: '/clients/trimmed/Sahana Logo.PNG' },
  { name: 'T3 Studio', category: 'Creative Production', logo: '/clients/trimmed/T3 Logo.png' },
];

export const PortfolioClienteleSection: React.FC = () => {
  const { clients } = useCMSContent();

  const activeClients: ClientLogoItem[] =
    clients && clients.length > 0
      ? clients.map((c) => ({
          name: c.name,
          category: 'BrandShoots Client',
          logo: c.logoUrl,
        }))
      : ALL_CLIENTS;

  const half = Math.ceil(activeClients.length / 2);
  const row1 = activeClients.slice(0, half);
  const row2 = activeClients.slice(half);

  // Duplicate each list for seamless infinite marquee loop (50% translate)
  const marqueeRow1 = [...row1, ...row1];
  const marqueeRow2 = [...row2, ...row2];

  return (
    <section className="relative w-full bg-[#020306] text-white py-28 sm:py-36 border-t border-white/[0.08] select-none overflow-hidden">
      {/* Subtle Electric Blue Horizon Ambient Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[85vw] max-w-[1000px] h-[340px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(0, 140, 255, 0.08) 0%, rgba(2, 3, 6, 0.6) 60%, transparent 100%)',
          filter: 'blur(90px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center mb-16 sm:mb-20 px-6 sm:px-12 text-center">
        {/* ========================================================= */}
        {/* 1. EDITORIAL SECTION HEADER                                */}
        {/* ========================================================= */}
        <div className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#008CFF] font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
          <span>OUR CLIENTS</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black uppercase tracking-[-0.035em] text-white leading-[0.96]">
          CLIENTELE
        </h2>

        <p className="mt-5 text-sm sm:text-base text-white/55 font-sans font-normal leading-relaxed max-w-lg mx-auto">
          From industrial manufacturing leaders and architectural visionaries to luxury retail houses and high-growth consumer brands.
        </p>
      </div>

      {/* ========================================================= */}
      {/* 2. DUAL-TRACK CONTINUOUS LOOPED MARQUEE STREAMS            */}
      {/* ========================================================= */}
      <div
        className="relative w-full flex flex-col gap-5 sm:gap-6 pointer-events-auto"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
      >
        {/* Stream 1: Continuous Flow Left */}
        <div className="group/row1 w-full overflow-hidden flex select-none">
          <div className="flex shrink-0 items-center gap-5 sm:gap-6 animate-marquee-left group-hover/row1:[animation-play-state:paused] will-change-transform">
            {marqueeRow1.map((client, idx) => (
              <div
                key={`r1-${idx}`}
                className="group/card w-52 sm:w-60 md:w-68 h-38 sm:h-42 p-5 sm:p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/25 transition-all duration-500 flex flex-col items-center justify-center shrink-0 cursor-default shadow-sm backdrop-blur-sm"
              >
                <div className="h-12 sm:h-14 w-full flex items-center justify-center">
                  <img
                    src={client.logo}
                    alt={client.name}
                    loading="lazy"
                    className="max-h-11 sm:max-h-12 max-w-[130px] sm:max-w-[150px] object-contain filter grayscale-0 contrast-100 opacity-95 group-hover/card:grayscale group-hover/card:contrast-125 group-hover/card:opacity-60 group-hover/card:scale-95 transition-all duration-500 ease-out"
                  />
                </div>
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-white/75 group-hover/card:text-white transition-colors mt-3">
                  {client.name}
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-white/35 group-hover/card:text-[#008CFF]/80 transition-colors mt-0.5">
                  {client.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stream 2: Continuous Flow Right */}
        <div className="group/row2 w-full overflow-hidden flex select-none">
          <div className="flex shrink-0 items-center gap-5 sm:gap-6 animate-marquee-right group-hover/row2:[animation-play-state:paused] will-change-transform">
            {marqueeRow2.map((client, idx) => (
              <div
                key={`r2-${idx}`}
                className="group/card w-52 sm:w-60 md:w-68 h-38 sm:h-42 p-5 sm:p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/25 transition-all duration-500 flex flex-col items-center justify-center shrink-0 cursor-default shadow-sm backdrop-blur-sm"
              >
                <div className="h-12 sm:h-14 w-full flex items-center justify-center">
                  <img
                    src={client.logo}
                    alt={client.name}
                    loading="lazy"
                    className="max-h-11 sm:max-h-12 max-w-[130px] sm:max-w-[150px] object-contain filter grayscale-0 contrast-100 opacity-95 group-hover/card:grayscale group-hover/card:contrast-125 group-hover/card:opacity-60 group-hover/card:scale-95 transition-all duration-500 ease-out"
                  />
                </div>
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-white/75 group-hover/card:text-white transition-colors mt-3">
                  {client.name}
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-white/35 group-hover/card:text-[#008CFF]/80 transition-colors mt-0.5">
                  {client.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded High-Performance Infinite Marquee Keyframes */}
      <style>{`
        @keyframes marqueeScrollLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes marqueeScrollRight {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .animate-marquee-left {
          animation: marqueeScrollLeft 32s linear infinite;
        }
        .animate-marquee-right {
          animation: marqueeScrollRight 34s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default PortfolioClienteleSection;
