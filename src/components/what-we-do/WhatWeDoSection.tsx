import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCMSContent } from '../../lib/cms/useCMSContent';
import { getOptimizedImageUrl } from '../../utils/mediaAssets';

gsap.registerPlugin(ScrollTrigger);

interface MissionData {
  id: string;
  number: string;
  titleLines: string[];
  category: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  aspectRatio: 'portrait';
  tag: string;
}

const MISSIONS: MissionData[] = [
  {
    id: 'creative-content',
    number: '01',
    titleLines: ['CREATIVE', 'CONTENT'],
    category: 'CREATIVE CONTENT',
    description: 'High-impact social films, vertical storytelling, viral hooks, and creative campaign direction engineered to captivate algorithmic feeds.',
    imageUrl: '/what-we-do/optimized/creative-content.webp',
    videoUrl: '/reels/aabharan_womens_accessories/aabharan_womens_accessories_2026-05-30_10-01-21_3908213461611903133_45301478774.mp4',
    aspectRatio: 'portrait',
    tag: 'CREATIVE DIRECTION & HOOKS',
  },
  {
    id: 'digital-growth',
    number: '02',
    titleLines: ['DIGITAL', 'GROWTH'],
    category: 'DIGITAL GROWTH',
    description: 'Full-funnel digital creative systems, visual campaigns, and scalable brand momentum engineered to convert viewers into lifelong advocates.',
    imageUrl: '/what-we-do/optimized/digital-growth.webp',
    videoUrl: '/reels/viswatuff.glass_rjy/viswatuff.glass_rjy_2026-05-28_18-00-28_3907005057329571857_78432309239.mp4',
    aspectRatio: 'portrait',
    tag: 'CATEGORY LEADERSHIP & SCALE',
  },
  {
    id: 'editing-posting',
    number: '03',
    titleLines: ['EDITING &', 'POSTING'],
    category: 'EDITING & POSTING',
    description: 'Precision cinematic editing, luxury Hollywood color grading, immersive spatial sound design, and scheduled high-impact posting across platforms.',
    imageUrl: '/what-we-do/optimized/editing-posting.webp',
    videoUrl: '/reels/sbventures_official/sbventures_official_2026-09-15_17-10-21_3986704799434897519_5720346010.mp4',
    aspectRatio: 'portrait',
    tag: 'PRECISION FINISHING & DISTRIBUTION',
  },
];

export const WhatWeDoSection: React.FC = () => {
  const { services } = useCMSContent();
  const activeMissions: MissionData[] =
    services && services.length === 3
      ? services.map((service, index) => {
          const isLegacyThumb = !service.imageUrl || service.imageUrl.includes('/reels/thumbnails-webp/');
          return {
            id: service.id,
            number: service.number || `0${index + 1}`,
            titleLines: service.titleLines,
            category: service.category,
            description: service.description,
            imageUrl: isLegacyThumb ? MISSIONS[index].imageUrl : service.imageUrl,
            videoUrl: service.videoUrl || MISSIONS[index].videoUrl,
            aspectRatio: 'portrait',
            tag: service.tag,
          };
        })
      : MISSIONS;
  const sectionRef = useRef<HTMLElement>(null);
  const articleRefs = useRef<(HTMLElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const context = gsap.context(() => {
      articleRefs.current.forEach((article, index) => {
        if (!article) return;
        gsap.fromTo(article, { opacity: 0, y: 42 }, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: article, start: 'top 78%', once: true },
        });
        const image = imageRefs.current[index];
        if (image) {
          gsap.fromTo(image, { y: 24 }, {
            y: -24,
            ease: 'none',
            scrollTrigger: { trigger: article, start: 'top bottom', end: 'bottom top', scrub: 1 },
          });
        }
      });
    }, sectionRef);
    return () => context.revert();
  }, [activeMissions.length]);

  return (
    <section ref={sectionRef} id="what-we-do" className="w-full border-b border-white/10 bg-[#08090C] text-white">
      <div className="mx-auto w-full max-w-[1380px] px-5 sm:px-8 lg:px-12">
        {activeMissions.map((mission, index) => {
          const reverse = index % 2 === 1;
          return (
            <article ref={(element) => (articleRefs.current[index] = element)} key={mission.id} className="grid grid-cols-1 gap-10 border-t border-white/20 py-20 sm:py-28 lg:grid-cols-12 lg:items-center lg:gap-16 lg:py-36">
              <div className={`lg:col-span-5 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="mb-8 flex items-center gap-4 text-[11px] tracking-[0.16em] text-white/45 uppercase">
                  <span className="text-[#1497F5]">{mission.number} / 03</span>
                  <span>{mission.category}</span>
                </div>
                <h2 className="text-4xl font-semibold uppercase leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                  {mission.titleLines.map((line) => <span key={line} className="block">{line}</span>)}
                </h2>
                <p className="mt-8 max-w-lg text-base leading-8 text-white/65 sm:text-lg">
                  {mission.description}
                </p>
                <p className="mt-8 border-l border-[#1497F5] pl-4 text-[11px] font-medium tracking-[0.16em] text-white/55 uppercase">
                  {mission.tag}
                </p>
              </div>

              <figure className={`lg:col-span-7 ${reverse ? 'lg:order-1' : 'lg:order-2'}`}>
                <div ref={(element) => (imageRefs.current[index] = element)} className="mx-auto aspect-[4/5] w-full max-w-[560px] overflow-hidden bg-[#111419] lg:mx-0">
                  <img
                    src={getOptimizedImageUrl(mission.imageUrl || MISSIONS[index].imageUrl)}
                    alt={`${mission.category} - ${mission.titleLines.join(' ')}`}
                    width={960}
                    height={1280}
                    sizes="(min-width: 1024px) 44vw, 100vw"
                    loading="lazy"
                    fetchPriority="low"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.025]"
                  />
                </div>
              </figure>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default WhatWeDoSection;
