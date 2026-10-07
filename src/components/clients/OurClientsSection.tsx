import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ClientItem {
  id: string;
  name: string;
  logo: string;
  slug: string;
  scale?: string;
}

const CLIENTS_LIST: ClientItem[] = [
  { id: 'santhi-pipes', name: 'Santhi Pipes', logo: '/clients/trimmed/Shanti Pipes.png', slug: 'santhi-pipes', scale: 'scale-105' },
  { id: 'bags-world', name: 'Bags World', logo: '/clients/trimmed/Bags World Logo.PNG', slug: 'bags-world', scale: 'scale-115' },
  { id: 'aabharan-jewellers', name: 'Aabharan Jewellers', logo: '/clients/trimmed/Aabharan Logo.png', slug: 'aabharan-jewellers', scale: 'scale-105' },
  { id: 'fresh-fresh', name: 'Fresh & Fresh', logo: '/clients/trimmed/Fresh and Fresh Logo.png', slug: 'fresh-and-fresh', scale: 'scale-95' },
  { id: 'dayanidhi', name: 'Dayanidhi Creations', logo: '/clients/trimmed/Dayanidhi Logo.png', slug: 'dayanidhi-creations', scale: 'scale-105' },
  { id: 'jain-beauty', name: 'Jain Beauty Studio', logo: '/clients/trimmed/Jain Beauty Logo.png', slug: 'jain-beauty', scale: 'scale-110' },
  { id: 'rk-home', name: 'RK Home Living', logo: '/clients/trimmed/Rk home.png', slug: 'rk-home-living', scale: 'scale-90' },
  { id: 'sb-ventures', name: 'SB Ventures', logo: '/clients/trimmed/SB Ventures Logo.png', slug: 'sb-ventures', scale: 'scale-115' },
  { id: 'kc-overseas', name: 'KC Overseas', logo: '/clients/trimmed/KC Overseas Logo.PNG', slug: 'kc-overseas', scale: 'scale-115' },
  { id: 'srk-doors', name: 'SRK Doors World', logo: '/clients/trimmed/SRK Doors World Logo.png', slug: 'srk-doors-world', scale: 'scale-90' },
  { id: 'jain-enterprises', name: 'Jain Enterprises', logo: '/clients/trimmed/Jain Enterprises Logo.png', slug: 'jain-enterprises', scale: 'scale-115' },
  { id: 'nirmala', name: 'Nirmala', logo: '/clients/trimmed/Nirmala logo.png', slug: 'nirmala', scale: 'scale-105' },
  { id: 'rudra', name: 'Rudra', logo: '/clients/trimmed/Rudra logo.png', slug: 'rudra', scale: 'scale-100' },
  { id: 'sahana', name: 'Sahana', logo: '/clients/trimmed/Sahana Logo.PNG', slug: 'sahana', scale: 'scale-110' },
  { id: 't3', name: 'T3 Studio', logo: '/clients/trimmed/T3 Logo.png', slug: 't3', scale: 'scale-100' },
];

export const OurClientsSection: React.FC = () => {
  const navigate = useNavigate();

  const renderClientCard = (item: ClientItem, key: string) => (
    <div
      key={key}
      onClick={() => navigate(`/portfolio/${item.slug}`)}
      className="group flex flex-col items-center gap-3 cursor-pointer shrink-0 select-none"
    >
      {/* 1:1 Crisp White Card with perfectly calibrated optical fit */}
      <div className="w-36 h-36 xs:w-44 xs:h-44 sm:w-48 sm:h-48 md:w-56 md:h-56 aspect-square rounded-2xl bg-white p-3.5 sm:p-4 md:p-5 flex items-center justify-center shadow-[0_10px_28px_rgba(0,0,0,0.35)] border border-white/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_16px_40px_rgba(0,140,255,0.3)] group-hover:border-[#008CFF]/60 overflow-hidden">
        <img
          src={item.logo}
          alt={item.name}
          className={`w-full h-full object-contain select-none transition-transform duration-300 group-hover:scale-110 ${item.scale || 'scale-100'}`}
          draggable={false}
        />
      </div>

      {/* Discrete Client Name Label */}
      <span className="text-xs sm:text-sm font-medium text-neutral-300 group-hover:text-[#008CFF] transition-colors duration-200 truncate max-w-[140px] sm:max-w-[190px] text-center tracking-wide">
        {item.name}
      </span>
    </div>
  );

  return (
    <section
      id="clients"
      className="relative w-full py-20 sm:py-28 lg:py-32 bg-[#05070B] text-white overflow-hidden select-none"
    >
      {/* Background Architectural Atmosphere & Radial Subtle Aura */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1200px] h-[500px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.08) 0%, rgba(0, 80, 200, 0.02) 45%, transparent 75%)',
            filter: 'blur(90px)',
          }}
        />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* ======================================================== */}
      {/* TOP: EDITORIAL HEADING + DEDICATED PORTFOLIO CTA BUTTON  */}
      {/* ======================================================== */}
      <div className="relative w-full max-w-[1720px] mx-auto flex flex-col items-center text-center px-4 sm:px-8 mb-12 sm:mb-16 z-20">
        <span className="text-[#008CFF] text-xs sm:text-sm font-mono uppercase tracking-[0.25em] mb-2 font-semibold">
          OUR CLIENTS & PARTNERS
        </span>
        <h2 className="font-editorial font-black uppercase text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none text-white">
          OUR CLIENTS
        </h2>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-neutral-400 max-w-xl font-light">
          Trusted by industry pioneers and category-defining brands.
        </p>

        {/* Dedicated "OUR PORTFOLIO" Pill CTA */}
        <button
          type="button"
          onClick={() => navigate('/portfolio')}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 hover:bg-[#008CFF]/15 border border-white/15 hover:border-[#008CFF]/50 text-white/90 hover:text-white text-xs sm:text-sm font-mono uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] group/cta cursor-pointer"
        >
          <span>OUR PORTFOLIO</span>
          <svg
            className="w-3.5 h-3.5 text-[#008CFF] group-hover/cta:translate-x-1 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      {/* ======================================================== */}
      {/* CENTER: INFINITE AUTO-SCROLLING 1:1 WHITE LOGO CARDS     */}
      {/* ======================================================== */}
      <div className="relative w-full overflow-hidden py-4 z-10">
        {/* Soft Left & Right Edge Vignette Fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 md:w-48 bg-gradient-to-r from-[#05070B] via-[#05070B]/85 to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 md:w-48 bg-gradient-to-l from-[#05070B] via-[#05070B]/85 to-transparent z-20" />

        {/* Auto-scrolling Track (Seamless Duplicated Track for 100% infinite loop) */}
        <div className="flex animate-client-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused]">
          {/* Primary Track */}
          <div className="flex items-center gap-5 sm:gap-7 shrink-0 pr-5 sm:pr-7">
            {CLIENTS_LIST.map((item, index) => renderClientCard(item, `t1-${item.id}-${index}`))}
          </div>

          {/* Seamless Duplicate Track */}
          <div className="flex items-center gap-5 sm:gap-7 shrink-0 pr-5 sm:pr-7" aria-hidden="true">
            {CLIENTS_LIST.map((item, index) => renderClientCard(item, `t2-${item.id}-${index}`))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurClientsSection;
