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

  const renderClientCard = (item: ClientItem, key: string, isMobile = false) => (
    <div
      key={key}
      onClick={() => navigate(`/portfolio/${item.slug}`)}
      className="group flex flex-col items-center gap-2.5 cursor-pointer shrink-0 select-none active:scale-95 transition-transform"
    >
      {/* 1:1 Crisp White Card with optical fit */}
      <div
        className={`${
          isMobile
            ? 'w-40 h-40 p-4'
            : 'w-48 h-48 md:w-56 md:h-56 p-4 md:p-5'
        } aspect-square rounded-2xl bg-white flex items-center justify-center shadow-[0_12px_28px_rgba(0,0,0,0.4)] border border-white/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_16px_40px_rgba(0,140,255,0.3)] group-hover:border-[#008CFF]/60 overflow-hidden`}
      >
        <img
          src={encodeURI(item.logo)}
          alt={item.name}
          className={`w-full h-full object-contain select-none transition-transform duration-300 group-hover:scale-110 ${item.scale || 'scale-100'}`}
          draggable={false}
        />
      </div>

      {/* Discrete Client Name Label */}
      <span className="text-xs font-semibold text-neutral-300 group-hover:text-[#008CFF] transition-colors duration-200 truncate max-w-[150px] text-center tracking-wide">
        {item.name}
      </span>
    </div>
  );

  return (
    <section
      id="clients"
      className="relative w-full py-16 sm:py-24 lg:py-28 bg-[#05070B] text-white overflow-hidden select-none"
    >
      {/* Background Architectural Atmosphere */}
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
      <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center text-center px-5 sm:px-10 lg:px-12 mb-10 sm:mb-14 z-20">
        <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_6px_#008CFF]" />
          <span className="font-mono text-[10px] xs:text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#008CFF] font-semibold">
            02 // CLIENTS & PARTNERS
          </span>
        </div>
        <h2 className="font-sans font-black uppercase tracking-[-0.035em] text-3xl xs:text-4xl sm:text-5xl md:text-6xl leading-[0.92] text-white">
          OUR CLIENTS<span className="text-[#008CFF]">.</span>
        </h2>
        <p className="mt-3 sm:mt-4 text-xs xs:text-sm sm:text-base text-white/60 max-w-md font-normal leading-relaxed">
          Trusted by industry pioneers and category-defining brands.
        </p>

        {/* Dedicated "OUR PORTFOLIO" Pill CTA */}
        <button
          type="button"
          onClick={() => navigate('/portfolio')}
          className="mt-5 sm:mt-7 inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-white/[0.06] hover:bg-[#008CFF]/20 border border-white/15 hover:border-[#008CFF]/50 text-white font-mono text-xs sm:text-sm uppercase tracking-[0.22em] font-semibold transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] group/cta cursor-pointer active:scale-95"
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
      {/* MOBILE: SMOOTH TOUCH-SWIPEABLE CLIENT STRIP              */}
      {/* Visible on mobile (< 768px), large readable 1:1 cards    */}
      {/* ======================================================== */}
      <div className="block md:hidden relative w-full z-10">
        <div className="flex overflow-x-auto touch-pan-x gap-3.5 px-5 py-2 snap-x snap-mandatory scrollbar-none">
          {CLIENTS_LIST.map((item, index) => (
            <div key={`mob-${item.id}-${index}`} className="snap-start shrink-0">
              {renderClientCard(item, `mob-${item.id}-${index}`, true)}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-4 text-white/40 font-mono text-[9px] tracking-[0.2em] uppercase">
          <span>← SWIPE TO VIEW CLIENTS →</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DESKTOP: INFINITE AUTO-SCROLLING MARQUEE (>= 768px)      */}
      {/* ======================================================== */}
      <div className="hidden md:block relative w-full overflow-hidden py-4 z-10">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-[#05070B] via-[#05070B]/85 to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-[#05070B] via-[#05070B]/85 to-transparent z-20" />

        <div className="flex animate-client-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused]">
          <div className="flex items-center gap-6 shrink-0 pr-6">
            {CLIENTS_LIST.map((item, index) => renderClientCard(item, `t1-${item.id}-${index}`))}
          </div>
          <div className="flex items-center gap-6 shrink-0 pr-6" aria-hidden="true">
            {CLIENTS_LIST.map((item, index) => renderClientCard(item, `t2-${item.id}-${index}`))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurClientsSection;
