import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { useCMSContent } from '../../lib/cms/useCMSContent';
import { getOptimizedImageUrl } from '../../utils/mediaAssets';

gsap.registerPlugin(ScrollTrigger);

interface ClientItem {
  id: string;
  name: string;
  category?: string;
  logo: string;
  slug: string;
  views?: string;
  likes?: string;
}

const CLIENTS_LIST: ClientItem[] = [
  { id: 'santhi-pipes', name: 'Santhi Pipes', category: 'Heavy Infrastructure', logo: '/clients/optimized/Shanti Pipes.webp', slug: 'santhi-pipes', views: '250K+', likes: '34K+' },
  { id: 'viswatuff-glass', name: 'Viswatuff Glass', category: 'Architectural Glass', logo: '/clients/optimized/Viswatuff Glass Logo.webp', slug: 'viswatuff-glass', views: '320K+', likes: '41K+' },
  { id: 'bags-world', name: 'Bags World', category: 'Retail & Fashion', logo: '/clients/optimized/Bags World Logo.webp', slug: 'bags-world', views: '480K+', likes: '62K+' },
  { id: 'aabharan-jewellers', name: 'Aabharan Jewellers', category: 'Luxury & Heritage', logo: '/clients/optimized/Aabharan Logo.webp', slug: 'aabharan-jewellers', views: '540K+', likes: '68K+' },
  { id: 'fresh-fresh', name: 'Fresh & Fresh', category: 'Supermarket & FMCG', logo: '/clients/optimized/Fresh and Fresh Logo.webp', slug: 'fresh-and-fresh', views: '190K+', likes: '26K+' },
  { id: 'dayanidhi', name: 'Dayanidhi Creations', category: 'Textiles & Apparel', logo: '/clients/optimized/Dayanidhi Logo.webp', slug: 'dayanidhi-creations', views: '220K+', likes: '31K+' },
  { id: 'jain-beauty', name: 'Jain Beauty Studio', category: 'Beauty & Lifestyle', logo: '/clients/optimized/Jain Beauty Logo.webp', slug: 'jain-beauty', views: '360K+', likes: '47K+' },
  { id: 'rk-home', name: 'RK Home Living', category: 'Architectural Furnishings', logo: '/clients/optimized/Rk home.webp', slug: 'rk-home-living', views: '280K+', likes: '38K+' },
  { id: 'sb-ventures', name: 'SB Ventures', category: 'Real Estate & Land', logo: '/clients/optimized/SB Ventures Logo.webp', slug: 'sb-ventures', views: '310K+', likes: '42K+' },
  { id: 'kc-overseas', name: 'KC Overseas', category: 'Global Education', logo: '/clients/optimized/KC Overseas Logo.webp', slug: 'kc-overseas', views: '195K+', likes: '27K+' },
  { id: 'srk-doors', name: 'SRK Doors World', category: 'Industrial Materials', logo: '/clients/optimized/SRK Doors World Logo.webp', slug: 'srk-doors-world', views: '230K+', likes: '30K+' },
  { id: 'jain-enterprises', name: 'Jain Enterprises', category: 'Commercial Trade', logo: '/clients/optimized/Jain Enterprises Logo.webp', slug: 'jain-enterprises', views: '175K+', likes: '24K+' },
  { id: 'nirmala', name: 'Nirmala', category: 'Consumer Brands', logo: '/clients/optimized/Nirmala logo.webp', slug: 'nirmala', views: '210K+', likes: '28K+' },
  { id: 'rudra', name: 'Rudra', category: 'Hospitality & Dining', logo: '/clients/optimized/Rudra logo.webp', slug: 'rudra', views: '185K+', likes: '25K+' },
  { id: 'sahana', name: 'Sahana', category: 'Fine Silks', logo: '/clients/optimized/Sahana Logo.webp', slug: 'sahana', views: '290K+', likes: '39K+' },
  { id: 't3', name: 'T3 Studio', category: 'Creative Production', logo: '/clients/optimized/T3 Logo.webp', slug: 't3', views: '160K+', likes: '22K+' },
];

export const OurClientsSection: React.FC = () => {
  const navigate = useNavigate();
  const { clients } = useCMSContent();
  const headerRef = useRef<HTMLDivElement>(null);
  const rowOneRef = useRef<HTMLDivElement>(null);
  const rowTwoRef = useRef<HTMLDivElement>(null);
  const firstTweenRef = useRef<gsap.core.Tween | null>(null);
  const secondTweenRef = useRef<gsap.core.Tween | null>(null);
  const activeClientsList = useMemo<ClientItem[]>(() => {
    const source = clients
      .filter((client) => client.visible !== false)
      .map((client) => {
        const matchingClient = CLIENTS_LIST.find((item) =>
          item.id === client.id || item.slug === client.slug || item.name.toLowerCase() === client.name.toLowerCase()
        );
        return {
          id: client.id,
          name: client.name,
          category: matchingClient?.category,
          logo: client.logoUrl,
          slug: client.slug || client.id,
          views: client.views,
          likes: client.likes,
        };
      });
    return source.filter((client) => {
      const key = `${client.id} ${client.name}`.toLowerCase();
      return !key.includes('araneaden');
    });
  }, [clients]);

  const rowOne = activeClientsList.slice(0, Math.ceil(activeClientsList.length / 2));
  const rowTwo = activeClientsList.slice(Math.ceil(activeClientsList.length / 2));
  const repeatedRowOne = [...rowOne, ...rowOne];
  const repeatedRowTwo = [...rowTwo, ...rowTwo];

  useEffect(() => {
    const context = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(headerRef.current.children, { opacity: 0, y: 24 }, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 82%', once: true },
        });
      }

      const first = rowOneRef.current;
      const second = rowTwoRef.current;
      if (first) {
        const firstTween = gsap.to(first, { xPercent: -50, duration: 42, repeat: -1, ease: 'none' });
        firstTweenRef.current = firstTween;
      }
      if (second) {
        gsap.set(second, { xPercent: -50 });
        const secondTween = gsap.to(second, { xPercent: 0, duration: 46, repeat: -1, ease: 'none' });
        secondTweenRef.current = secondTween;
      }
    });
    return () => {
      context.revert();
      firstTweenRef.current = null;
      secondTweenRef.current = null;
    };
  }, [activeClientsList.length]);

  if (activeClientsList.length === 0) return null;

  const renderLogo = (client: ClientItem, index: number) => (
    <button
      type="button"
      key={`${client.id}-${index}`}
      onClick={() => navigate('/portfolio')}
      className="group mr-5 flex w-[190px] shrink-0 flex-col border-t border-white/20 pt-3 text-left sm:mr-7 sm:w-[230px]"
    >
      <div className="flex h-24 items-center bg-white px-4 py-3 sm:h-28">
        <img src={encodeURI(getOptimizedImageUrl(client.logo))} alt={client.name} width={960} height={640} sizes="230px" loading="lazy" decoding="async" className="max-h-full w-full object-contain filter-none transition-transform duration-300 group-hover:scale-[1.02]" />
      </div>
      <span className="mt-3 text-sm font-medium text-white group-hover:text-[#1497F5]">{client.name}</span>
      <span className="mt-1 text-[10px] tracking-[0.1em] text-white/40 uppercase">{client.category}</span>
      {(client.views || client.likes) && <span className="mt-2 text-[10px] text-white/35">{client.views && `${client.views} views`}{client.views && client.likes && ' · '}{client.likes && `${client.likes} likes`}</span>}
    </button>
  );

  return (
    <section id="clients" className="w-full overflow-hidden border-b border-white/10 bg-[#08090C] py-24 text-white sm:py-32">
      <div ref={headerRef} className="mx-auto mb-14 flex w-full max-w-[1380px] flex-col gap-6 border-b border-white/20 px-5 pb-8 sm:flex-row sm:items-end sm:justify-between sm:px-8 lg:px-12">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-black uppercase tracking-[-0.025em] text-white">OUR CLIENTS<span className="text-[#008CFF]">.</span></h2>
        <button type="button" onClick={() => navigate('/portfolio')} className="inline-flex items-center gap-2 self-start border border-white/35 px-5 py-2.5 font-mono text-xs font-semibold tracking-[0.2em] text-white transition-colors hover:border-[#008CFF] hover:bg-[#008CFF] uppercase sm:self-auto">
          EXPLORE ALL PROJECTS <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-10 overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
        <div className="overflow-hidden" onMouseEnter={() => { firstTweenRef.current?.pause(); secondTweenRef.current?.pause(); }} onMouseLeave={() => { firstTweenRef.current?.resume(); secondTweenRef.current?.resume(); }}>
          <div ref={rowOneRef} className="flex w-max items-start will-change-transform">{repeatedRowOne.map(renderLogo)}</div>
        </div>
        {rowTwo.length > 0 && (
          <div className="overflow-hidden" onMouseEnter={() => { firstTweenRef.current?.pause(); secondTweenRef.current?.pause(); }} onMouseLeave={() => { firstTweenRef.current?.resume(); secondTweenRef.current?.resume(); }}>
            <div ref={rowTwoRef} className="flex w-max items-start will-change-transform">{repeatedRowTwo.map(renderLogo)}</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OurClientsSection;
