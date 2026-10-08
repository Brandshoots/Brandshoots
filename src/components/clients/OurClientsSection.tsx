import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ClientItem {
  id: string;
  name: string;
  category: string;
  logo: string;
  slug: string;
  scale?: string;
}

const CLIENTS_LIST: ClientItem[] = [
  { id: 'santhi-pipes', name: 'Santhi Pipes', category: 'Heavy Infrastructure', logo: '/clients/trimmed/Shanti Pipes.png', slug: 'santhi-pipes', scale: 'scale-105' },
  { id: 'bags-world', name: 'Bags World', category: 'Retail & Fashion', logo: '/clients/trimmed/Bags World Logo.PNG', slug: 'bags-world', scale: 'scale-115' },
  { id: 'aabharan-jewellers', name: 'Aabharan Jewellers', category: 'Luxury & Heritage', logo: '/clients/trimmed/Aabharan Logo.png', slug: 'aabharan-jewellers', scale: 'scale-105' },
  { id: 'fresh-fresh', name: 'Fresh & Fresh', category: 'Supermarket & FMCG', logo: '/clients/trimmed/Fresh and Fresh Logo.png', slug: 'fresh-and-fresh', scale: 'scale-95' },
  { id: 'dayanidhi', name: 'Dayanidhi Creations', category: 'Textiles & Apparel', logo: '/clients/trimmed/Dayanidhi Logo.png', slug: 'dayanidhi-creations', scale: 'scale-105' },
  { id: 'jain-beauty', name: 'Jain Beauty Studio', category: 'Beauty & Lifestyle', logo: '/clients/trimmed/Jain Beauty Logo.png', slug: 'jain-beauty', scale: 'scale-110' },
  { id: 'rk-home', name: 'RK Home Living', category: 'Architectural Furnishings', logo: '/clients/trimmed/Rk home.png', slug: 'rk-home-living', scale: 'scale-90' },
  { id: 'sb-ventures', name: 'SB Ventures', category: 'Real Estate & Land', logo: '/clients/trimmed/SB Ventures Logo.png', slug: 'sb-ventures', scale: 'scale-115' },
  { id: 'kc-overseas', name: 'KC Overseas', category: 'Global Education', logo: '/clients/trimmed/KC Overseas Logo.PNG', slug: 'kc-overseas', scale: 'scale-115' },
  { id: 'srk-doors', name: 'SRK Doors World', category: 'Industrial Materials', logo: '/clients/trimmed/SRK Doors World Logo.png', slug: 'srk-doors-world', scale: 'scale-90' },
  { id: 'jain-enterprises', name: 'Jain Enterprises', category: 'Commercial Trade', logo: '/clients/trimmed/Jain Enterprises Logo.png', slug: 'jain-enterprises', scale: 'scale-115' },
  { id: 'nirmala', name: 'Nirmala', category: 'Consumer Brands', logo: '/clients/trimmed/Nirmala logo.png', slug: 'nirmala', scale: 'scale-105' },
  { id: 'rudra', name: 'Rudra', category: 'Hospitality & Dining', logo: '/clients/trimmed/Rudra logo.png', slug: 'rudra', scale: 'scale-100' },
  { id: 'sahana', name: 'Sahana', category: 'Fine Silks', logo: '/clients/trimmed/Sahana Logo.PNG', slug: 'sahana', scale: 'scale-110' },
  { id: 't3', name: 'T3 Studio', category: 'Creative Production', logo: '/clients/trimmed/T3 Logo.png', slug: 't3', scale: 'scale-100' },
];

export const OurClientsSection: React.FC = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  // Split clients into two continuous flowing rows
  const row1Clients = CLIENTS_LIST.slice(0, 8);
  const row2Clients = CLIENTS_LIST.slice(8).concat(CLIENTS_LIST.slice(0, 1));

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Scrubbed parallax linked to continuous scroll progression
      if (row1Ref.current && row2Ref.current) {
        gsap.to(row1Ref.current, {
          x: -180,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });

        gsap.to(row2Ref.current, {
          x: 180,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      if (watermarkRef.current) {
        gsap.to(watermarkRef.current, {
          x: -120,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2.0,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderClientCard = (item: ClientItem, key: string) => (
    <div
      key={key}
      onClick={() => navigate(`/portfolio/${item.slug}`)}
      className="group relative flex flex-col items-center gap-3 shrink-0 cursor-pointer select-none active:scale-95 transition-all duration-300"
    >
      {/* Premium Dark Glass Frame with Luminous Core */}
      <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 p-4 rounded-2xl bg-[#090E17]/85 backdrop-blur-xl border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.85)] flex items-center justify-center transition-all duration-400 group-hover:scale-105 group-hover:border-[#008CFF]/60 group-hover:shadow-[0_20px_50px_rgba(0,140,255,0.25)] overflow-hidden">
        {/* Subtle top sheen */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#008CFF]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Clean white optical backdrop for client emblems */}
        <div className="w-full h-full rounded-xl bg-white flex items-center justify-center p-3.5 shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
          <img
            src={encodeURI(item.logo)}
            alt={item.name}
            className={`w-full h-full object-contain select-none transition-transform duration-300 group-hover:scale-110 ${item.scale || 'scale-100'}`}
            draggable={false}
            loading="lazy"
          />
        </div>
      </div>

      {/* Editorial Name & Category Metadata */}
      <div className="flex flex-col items-center text-center max-w-[180px]">
        <span className="text-xs sm:text-sm font-bold text-white/90 group-hover:text-[#008CFF] transition-colors duration-200 tracking-wide truncate w-full">
          {item.name}
        </span>
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/45 group-hover:text-white/70 transition-colors duration-200">
          {item.category}
        </span>
      </div>
    </div>
  );

  return (
    <section
      id="clients"
      ref={sectionRef}
      className="relative w-full py-20 sm:py-28 lg:py-36 bg-[#04060A] text-white overflow-hidden select-none"
    >
      {/* Background Architectural Atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-[1300px] h-[550px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.10) 0%, rgba(0, 50, 140, 0.02) 50%, transparent 75%)',
            filter: 'blur(100px)',
          }}
        />
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Depth Watermark Background Layer */}
      <div
        ref={watermarkRef}
        className="absolute top-1/3 left-0 w-full whitespace-nowrap pointer-events-none select-none z-0 opacity-[0.035]"
      >
        <span className="font-display font-black text-[14vw] tracking-[-0.04em] uppercase text-white">
          TRUSTED BY INDUSTRY LEADERS • CATEGORY DEFINING BRANDS •
        </span>
      </div>

      {/* ======================================================== */}
      {/* TOP: EDITORIAL HEADER                                    */}
      {/* ======================================================== */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center px-6 sm:px-12 mb-14 sm:mb-20">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
          <span className="font-mono text-[10px] xs:text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#008CFF] font-semibold">
            02 // CLIENTS & COMMERCIAL PARTNERS
          </span>
        </div>
        <h2 className="font-sans font-black uppercase tracking-[-0.038em] text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.92] text-white">
          OUR CLIENTS<span className="text-[#008CFF]">.</span>
        </h2>
        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-white/60 max-w-xl font-normal leading-relaxed">
          Architecting visual authority and market command for category leaders across infrastructure, retail, luxury, and digital commerce.
        </p>

        {/* Dedicated "EXPLORE ALL PROJECTS" CTA */}
        <button
          type="button"
          onClick={() => navigate('/portfolio')}
          className="mt-7 inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/[0.08] hover:bg-[#008CFF] border border-white/20 hover:border-[#008CFF] text-white font-mono text-xs tracking-[0.24em] uppercase font-semibold transition-all duration-300 shadow-sm active:scale-95 group cursor-pointer"
        >
          <span>EXPLORE ALL PROJECTS</span>
          <ArrowUpRight className="w-4 h-4 text-[#008CFF] group-hover:text-white transition-colors duration-200" />
        </button>
      </div>

      {/* ======================================================== */}
      {/* CONTINUOUS PARALLAX CLIENT SHOWCASE STREAM               */}
      {/* ======================================================== */}
      <div className="relative z-10 w-full flex flex-col gap-8 sm:gap-10 overflow-hidden">
        {/* Row 1: Leftward Parallax Flow */}
        <div
          ref={row1Ref}
          className="flex items-center gap-6 sm:gap-8 will-change-transform pl-4"
        >
          {row1Clients.map((client, idx) =>
            renderClientCard(client, `r1-a-${client.id}-${idx}`)
          )}
          {row1Clients.map((client, idx) =>
            renderClientCard(client, `r1-b-${client.id}-${idx}`)
          )}
        </div>

        {/* Row 2: Rightward Parallax Flow */}
        <div
          ref={row2Ref}
          className="flex items-center gap-6 sm:gap-8 will-change-transform pr-4"
          style={{ transform: 'translateX(-120px)' }}
        >
          {row2Clients.map((client, idx) =>
            renderClientCard(client, `r2-a-${client.id}-${idx}`)
          )}
          {row2Clients.map((client, idx) =>
            renderClientCard(client, `r2-b-${client.id}-${idx}`)
          )}
        </div>
      </div>
    </section>
  );
};

export default OurClientsSection;
