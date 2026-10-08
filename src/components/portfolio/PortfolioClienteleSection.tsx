import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ClientLogoItem {
  name: string;
  category: string;
  logo: string;
}

const CLIENTS_LIST: ClientLogoItem[] = [
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
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header smooth reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // Editorial logo items subtle stagger reveal
      if (gridRef.current) {
        const items = gridRef.current.querySelectorAll('.client-item');
        gsap.fromTo(
          items,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.04,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#020306] text-white py-28 sm:py-36 md:py-44 px-6 sm:px-12 md:px-16 border-t border-white/[0.08] select-none overflow-hidden"
    >
      {/* Subtle Electric Blue Horizon Ambient Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[85vw] max-w-[1000px] h-[340px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(0, 140, 255, 0.08) 0%, rgba(2, 3, 6, 0.6) 60%, transparent 100%)',
          filter: 'blur(90px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* ========================================================= */}
        {/* 1. EDITORIAL SECTION HEADER                                */}
        {/* ========================================================= */}
        <div ref={headerRef} className="text-center max-w-2xl mb-20 sm:mb-24 md:mb-28">
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
        {/* 2. CLEAN EDITORIAL LOGO GRID (No SaaS Cards, Pure Space)   */}
        {/* ========================================================= */}
        <div
          ref={gridRef}
          className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 sm:gap-x-12 md:gap-x-16 gap-y-12 sm:gap-y-16 md:gap-y-20 items-center justify-items-center"
        >
          {CLIENTS_LIST.map((client, idx) => (
            <div
              key={idx}
              className="client-item group flex flex-col items-center text-center cursor-default transition-all duration-300 w-full max-w-[200px]"
            >
              {/* Logo Stage */}
              <div className="h-14 sm:h-16 md:h-18 w-full flex items-center justify-center">
                <img
                  src={client.logo}
                  alt={client.name}
                  loading="lazy"
                  className="max-h-11 sm:max-h-13 md:max-h-14 max-w-[130px] sm:max-w-[150px] object-contain filter grayscale contrast-125 opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 pointer-events-auto"
                />
              </div>

              {/* Minimal Client Info */}
              <div className="mt-3.5 flex flex-col items-center">
                <span className="font-sans text-xs sm:text-[13px] font-semibold uppercase tracking-[0.14em] text-white/75 group-hover:text-white transition-colors">
                  {client.name}
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-white/35 mt-0.5">
                  {client.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioClienteleSection;
