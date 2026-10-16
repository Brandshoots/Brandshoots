import React from 'react';
import { Eye, Heart } from 'lucide-react';
import { useCMSContent } from '../../lib/cms/useCMSContent';

interface ClientLogoItem {
  name: string;
  category?: string;
  logo: string;
  views?: string;
  likes?: string;
}

const ALL_CLIENTS: ClientLogoItem[] = [
  { name: 'Santhi Pipes', category: 'Industrial & Infrastructure', logo: '/clients/Shanti Pipes.png', views: '250K+', likes: '34K+' },
  { name: 'Viswatuff Glass', category: 'Architectural Glass', logo: '/clients/Viswatuff Glass Logo.png', views: '320K+', likes: '41K+' },
  { name: 'Bags World', category: 'Retail & Fashion', logo: '/clients/Bags World Logo.PNG', views: '480K+', likes: '62K+' },
  { name: 'Aabharan Jewellers', category: 'Luxury & Heritage', logo: '/clients/Aabharan Logo.png', views: '540K+', likes: '68K+' },
  { name: 'Fresh & Fresh', category: 'Supermarket & FMCG', logo: '/clients/Fresh and Fresh Logo.png', views: '190K+', likes: '26K+' },
  { name: 'Dayanidhi Creations', category: 'Textiles & Apparel', logo: '/clients/Dayanidhi Logo.png', views: '220K+', likes: '31K+' },
  { name: 'Jain Beauty Studio', category: 'Beauty & Lifestyle', logo: '/clients/Jain Beauty Logo.png', views: '360K+', likes: '47K+' },
  { name: 'RK Home Living', category: 'Architectural Furnishings', logo: '/clients/Rk home.png', views: '280K+', likes: '38K+' },
  { name: 'SB Ventures', category: 'Real Estate & Land', logo: '/clients/SB Ventures Logo.png', views: '310K+', likes: '42K+' },
  { name: 'KC Overseas', category: 'Global Education', logo: '/clients/KC Overseas Logo.PNG', views: '195K+', likes: '27K+' },
  { name: 'SRK Doors World', category: 'Industrial Materials', logo: '/clients/SRK Doors World Logo.png', views: '230K+', likes: '30K+' },
  { name: 'Jain Enterprises', category: 'Commercial Trade', logo: '/clients/Jain Enterprises Logo.png', views: '175K+', likes: '24K+' },
  { name: 'Nirmala', category: 'Consumer Brands', logo: '/clients/Nirmala logo.png', views: '210K+', likes: '28K+' },
  { name: 'Rudra', category: 'Hospitality & Dining', logo: '/clients/Rudra logo.png', views: '185K+', likes: '25K+' },
  { name: 'Sahana', category: 'Fine Silks', logo: '/clients/Sahana Logo.PNG', views: '290K+', likes: '39K+' },
  { name: 'T3 Studio', category: 'Creative Production', logo: '/clients/T3 Logo.png', views: '160K+', likes: '22K+' },
];

export const PortfolioClienteleSection: React.FC = () => {
  const { clients } = useCMSContent();

  const activeClients: ClientLogoItem[] =
    clients && clients.length > 0
      ? clients.map((c) => ({
          name: c.name,
          logo: c.logoUrl,
          views: c.views,
          likes: c.likes,
        }))
      : ALL_CLIENTS;

  const half = Math.ceil(activeClients.length / 2);
  const row1 = activeClients.slice(0, half);
  const row2 = activeClients.slice(half);

  // Repeat 4x for perfectly seamless 50% translation across all screens (from mobile to 4K ultrawide)
  const marqueeRow1 = [...row1, ...row1, ...row1, ...row1];
  const marqueeRow2 = [...row2, ...row2, ...row2, ...row2];

  const renderClientCard = (client: ClientLogoItem, key: string) => {
    const hasViews = Boolean(client.views && client.views.trim());
    const hasLikes = Boolean(client.likes && client.likes.trim());

    return (
      <div
        key={key}
        className="group/card w-56 sm:w-64 md:w-70 h-44 sm:h-48 p-3.5 sm:p-4 rounded-2xl bg-[#090E17]/90 hover:bg-[#0c1424] border border-white/12 hover:border-[#008CFF]/60 shadow-[0_8px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_12px_40px_rgba(0,140,255,0.22)] transition-all duration-300 flex flex-col items-center justify-between shrink-0 cursor-default select-none backdrop-blur-sm"
      >
        {/* White Optical Stage - Logo fills tile */}
        <div className="w-full flex-1 rounded-xl bg-white flex items-center justify-center p-1.5 sm:p-2 shadow-sm group-hover/card:scale-[1.02] transition-transform duration-300 overflow-hidden">
          <img
            src={encodeURI(client.logo)}
            alt={client.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain filter contrast-[1.03] transition-all duration-300 select-none"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.logo-fallback')) {
                const fallback = document.createElement('span');
                fallback.className =
                  'logo-fallback font-bold text-slate-800 text-xs sm:text-sm tracking-wide text-center px-1 uppercase select-none';
                fallback.innerText = client.name;
                parent.appendChild(fallback);
              }
            }}
          />
        </div>

        {/* Client Brand Title & Subtle Stats */}
        <div className="flex flex-col items-center text-center w-full mt-2 sm:mt-2.5 px-1">
          <span className="font-sans text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] text-white/90 group-hover/card:text-[#008CFF] transition-colors text-center truncate max-w-full">
            {client.name}
          </span>
          {(hasViews || hasLikes) && (
            <div className="flex items-center justify-center gap-1.5 mt-1">
              {hasViews && (
                <span
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[9.5px] font-mono text-white/75 group-hover/card:border-[#008CFF]/40 transition-colors shadow-sm"
                  title={`${client.views} Views`}
                >
                  <Eye className="w-2.5 h-2.5 text-[#008CFF] shrink-0" />
                  <span className="leading-none">{client.views}</span>
                </span>
              )}
              {hasLikes && (
                <span
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[9.5px] font-mono text-white/75 group-hover/card:border-rose-500/40 transition-colors shadow-sm"
                  title={`${client.likes} Likes`}
                >
                  <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400/30 shrink-0" />
                  <span className="leading-none">{client.likes}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

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
        className="relative w-full flex flex-col gap-6 sm:gap-7 pointer-events-auto"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
      >
        {/* Stream 1: Continuous Flow Left */}
        <div className="group/row1 w-full overflow-hidden flex select-none">
          <div className="flex shrink-0 items-center gap-6 sm:gap-7 animate-marquee-left group-hover/row1:[animation-play-state:paused] will-change-transform">
            {marqueeRow1.map((client, idx) => renderClientCard(client, `r1-${idx}`))}
          </div>
        </div>

        {/* Stream 2: Continuous Flow Right */}
        <div className="group/row2 w-full overflow-hidden flex select-none">
          <div className="flex shrink-0 items-center gap-6 sm:gap-7 animate-marquee-right group-hover/row2:[animation-play-state:paused] will-change-transform">
            {marqueeRow2.map((client, idx) => renderClientCard(client, `r2-${idx}`))}
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
          animation: marqueeScrollLeft 38s linear infinite;
        }
        .animate-marquee-right {
          animation: marqueeScrollRight 40s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default PortfolioClienteleSection;
