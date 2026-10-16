import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Eye, Heart } from 'lucide-react';
import { useCMSContent } from '../../lib/cms/useCMSContent';

gsap.registerPlugin(ScrollTrigger);

interface ClientItem {
  id: string;
  name: string;
  category?: string;
  logo: string;
  slug: string;
  views?: string;
  likes?: string;
  scale?: string;
}

const CLIENTS_LIST: ClientItem[] = [
  { id: 'santhi-pipes', name: 'Santhi Pipes', category: 'Heavy Infrastructure', logo: '/clients/trimmed/Shanti Pipes.png', slug: 'santhi-pipes', views: '250K+', likes: '34K+', scale: 'scale-105' },
  { id: 'viswatuff-glass', name: 'Viswatuff Glass', category: 'Architectural Glass', logo: '/clients/trimmed/Viswatuff Glass Logo.png', slug: 'viswatuff-glass', views: '320K+', likes: '41K+', scale: 'scale-105' },
  { id: 'bags-world', name: 'Bags World', category: 'Retail & Fashion', logo: '/clients/trimmed/Bags World Logo.PNG', slug: 'bags-world', views: '480K+', likes: '62K+', scale: 'scale-115' },
  { id: 'aabharan-jewellers', name: 'Aabharan Jewellers', category: 'Luxury & Heritage', logo: '/clients/trimmed/Aabharan Logo.png', slug: 'aabharan-jewellers', views: '540K+', likes: '68K+', scale: 'scale-105' },
  { id: 'fresh-fresh', name: 'Fresh & Fresh', category: 'Supermarket & FMCG', logo: '/clients/trimmed/Fresh and Fresh Logo.png', slug: 'fresh-and-fresh', views: '190K+', likes: '26K+', scale: 'scale-95' },
  { id: 'dayanidhi', name: 'Dayanidhi Creations', category: 'Textiles & Apparel', logo: '/clients/trimmed/Dayanidhi Logo.png', slug: 'dayanidhi-creations', views: '220K+', likes: '31K+', scale: 'scale-105' },
  { id: 'jain-beauty', name: 'Jain Beauty Studio', category: 'Beauty & Lifestyle', logo: '/clients/trimmed/Jain Beauty Logo.png', slug: 'jain-beauty', views: '360K+', likes: '47K+', scale: 'scale-110' },
  { id: 'rk-home', name: 'RK Home Living', category: 'Architectural Furnishings', logo: '/clients/trimmed/Rk home.png', slug: 'rk-home-living', views: '280K+', likes: '38K+', scale: 'scale-90' },
  { id: 'sb-ventures', name: 'SB Ventures', category: 'Real Estate & Land', logo: '/clients/trimmed/SB Ventures Logo.png', slug: 'sb-ventures', views: '310K+', likes: '42K+', scale: 'scale-115' },
  { id: 'kc-overseas', name: 'KC Overseas', category: 'Global Education', logo: '/clients/trimmed/KC Overseas Logo.PNG', slug: 'kc-overseas', views: '195K+', likes: '27K+', scale: 'scale-115' },
  { id: 'srk-doors', name: 'SRK Doors World', category: 'Industrial Materials', logo: '/clients/trimmed/SRK Doors World Logo.png', slug: 'srk-doors-world', views: '230K+', likes: '30K+', scale: 'scale-90' },
  { id: 'jain-enterprises', name: 'Jain Enterprises', category: 'Commercial Trade', logo: '/clients/trimmed/Jain Enterprises Logo.png', slug: 'jain-enterprises', views: '175K+', likes: '24K+', scale: 'scale-115' },
  { id: 'nirmala', name: 'Nirmala', category: 'Consumer Brands', logo: '/clients/trimmed/Nirmala logo.png', slug: 'nirmala', views: '210K+', likes: '28K+', scale: 'scale-105' },
  { id: 'rudra', name: 'Rudra', category: 'Hospitality & Dining', logo: '/clients/trimmed/Rudra logo.png', slug: 'rudra', views: '185K+', likes: '25K+', scale: 'scale-100' },
  { id: 'sahana', name: 'Sahana', category: 'Fine Silks', logo: '/clients/trimmed/Sahana Logo.PNG', slug: 'sahana', views: '290K+', likes: '39K+', scale: 'scale-110' },
  { id: 't3', name: 'T3 Studio', category: 'Creative Production', logo: '/clients/trimmed/T3 Logo.png', slug: 't3', views: '160K+', likes: '22K+', scale: 'scale-100' },
];

export const OurClientsSection: React.FC = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);

  const { clients } = useCMSContent();

  const activeClientsList: ClientItem[] =
    clients && clients.length > 0
      ? clients.map((c) => ({
          id: c.id,
          name: c.name,
          logo: c.logoUrl,
          slug: c.slug || c.id,
          views: c.views,
          likes: c.likes,
          scale: 'scale-105',
        }))
      : CLIENTS_LIST;

  // Split 16 clients evenly into two 8-client sets
  const half = Math.ceil(activeClientsList.length / 2);
  const row1Clients = activeClientsList.slice(0, half);
  const row2Clients = activeClientsList.slice(half);

  // Repeat for seamless 50% translation across all screen resolutions
  const marqueeRow1 = [...row1Clients, ...row1Clients, ...row1Clients, ...row1Clients];
  const marqueeRow2 = [...row2Clients, ...row2Clients, ...row2Clients, ...row2Clients];

  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderClientCard = (item: ClientItem, key: string) => {
    const hasViews = Boolean(item.views && item.views.trim());
    const hasLikes = Boolean(item.likes && item.likes.trim());

    return (
      <div
        key={key}
        onClick={() => navigate('/portfolio')}
        className="group relative flex flex-col items-center gap-3 shrink-0 cursor-pointer select-none active:scale-95 transition-all duration-300 mr-5 sm:mr-7 hover:-translate-y-1"
      >
        {/* Premium Dark Glass Frame with Luminous Core */}
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 p-3 sm:p-3.5 rounded-2xl bg-[#090E17]/85 backdrop-blur-xl border border-white/15 shadow-[0_12px_32px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-[#008CFF]/60 group-hover:shadow-[0_16px_40px_rgba(0,140,255,0.22)] overflow-hidden">
          {/* Subtle top sheen */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#008CFF]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Clean white optical backdrop for client emblems */}
          <div className="w-full h-full rounded-xl bg-white flex items-center justify-center p-1.5 sm:p-2 shadow-sm transition-transform duration-300 group-hover:scale-[1.02] overflow-hidden">
            <img
              src={encodeURI(item.logo)}
              alt={item.name}
              className="w-full h-full object-contain select-none transition-all duration-300 filter grayscale-0 group-hover:grayscale group-hover:opacity-75"
              draggable={false}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.logo-fallback')) {
                  const fallback = document.createElement('span');
                  fallback.className = 'logo-fallback font-bold text-slate-800 text-xs sm:text-sm tracking-wide text-center px-1 uppercase select-none';
                  fallback.innerText = item.name;
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
        </div>

        {/* Editorial Client Name & Subtle Stats */}
        <div className="flex flex-col items-center text-center max-w-[170px] px-1">
          <span className="text-xs sm:text-[13px] font-bold text-white/90 group-hover:text-[#008CFF] transition-colors duration-200 tracking-wide truncate w-full">
            {item.name}
          </span>
          {(hasViews || hasLikes) && (
            <div className="flex items-center justify-center gap-1.5 mt-1">
              {hasViews && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10px] sm:text-[10.5px] font-mono text-white/75 group-hover:border-[#008CFF]/40 transition-colors shadow-sm"
                  title={`${item.views} Views`}
                >
                  <Eye className="w-2.5 h-2.5 text-[#008CFF] shrink-0" />
                  <span className="leading-none">{item.views}</span>
                </span>
              )}
              {hasLikes && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10px] sm:text-[10.5px] font-mono text-white/75 group-hover:border-rose-500/40 transition-colors shadow-sm"
                  title={`${item.likes} Likes`}
                >
                  <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400/30 shrink-0" />
                  <span className="leading-none">{item.likes}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section
      id="clients"
      ref={sectionRef}
      className="relative w-full pt-10 sm:pt-14 lg:pt-16 pb-14 sm:pb-18 lg:pb-20 bg-[#04060A] text-white overflow-hidden select-none"
    >
      {/* Background Architectural Atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-[1200px] h-[450px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.08) 0%, rgba(0, 50, 140, 0.02) 50%, transparent 75%)',
            filter: 'blur(90px)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          }}
        />
      </div>


      {/* ======================================================== */}
      {/* TOP: EDITORIAL HEADER                                    */}
      {/* ======================================================== */}
      <div
        ref={headerRef}
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center px-6 sm:px-12 mb-7 sm:mb-9"
      >
        <h2 className="font-sans font-black uppercase tracking-[-0.038em] text-3xl xs:text-4xl sm:text-5xl md:text-6xl leading-[0.92] text-white">
          OUR CLIENTS<span className="text-[#008CFF]">.</span>
        </h2>

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
      {/* 24/7 CONTINUOUS AUTO-SCROLLING CLIENT SHOWCASE STREAMS   */}
      {/* ======================================================== */}
      <div
        className="relative z-10 w-full flex flex-col gap-6 sm:gap-8 overflow-hidden py-2"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        }}
      >
        {/* Row 1: Continuous Stream Left */}
        <div className="w-full overflow-hidden flex select-none">
          <div className="flex shrink-0 items-center animate-clients-marquee-left will-change-transform py-2 hover:[animation-play-state:paused]">
            {marqueeRow1.map((client, idx) =>
              renderClientCard(client, `r1-${client.id}-${idx}`)
            )}
          </div>
        </div>

        {/* Row 2: Continuous Stream Right */}
        <div className="w-full overflow-hidden flex select-none">
          <div className="flex shrink-0 items-center animate-clients-marquee-right will-change-transform py-2 hover:[animation-play-state:paused]">
            {marqueeRow2.map((client, idx) =>
              renderClientCard(client, `r2-${client.id}-${idx}`)
            )}
          </div>
        </div>
      </div>

      {/* Embedded High-Performance GPU Infinite Marquee Keyframes */}
      <style>{`
        @keyframes clientsStreamLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes clientsStreamRight {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .animate-clients-marquee-left {
          animation: clientsStreamLeft 40s linear infinite;
        }
        .animate-clients-marquee-right {
          animation: clientsStreamRight 44s linear infinite;
        }
        .animate-clients-marquee-left:hover,
        .animate-clients-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default OurClientsSection;
