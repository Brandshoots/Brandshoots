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
  videoUrl?: string;
  aspectRatio: 'portrait' | 'cinematic';
  tag: string;
}

export const WhatWeDoSection: React.FC = () => {
  const { services } = useCMSContent();
  const activeMissions: MissionData[] = services
    .filter((service) => service.visible !== false)
    .map((service, index) => ({
      id: service.id,
      number: service.number || String(index + 1).padStart(2, '0'),
      titleLines: service.titleLines,
      category: service.category,
      description: service.description,
      imageUrl: service.imageUrl,
      videoUrl: service.videoUrl,
      aspectRatio: service.aspectRatio || 'portrait',
      tag: service.tag,
    }));
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
                <div className="mb-6 flex items-center gap-4 font-mono text-xs tracking-[0.24em] text-white/50 uppercase">
                  <span className="text-[#008CFF] font-bold">{mission.number} / {String(activeMissions.length).padStart(2, '0')}</span>
                  <span>{mission.category}</span>
                </div>
                <h2 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-black uppercase leading-[0.92] tracking-[-0.025em] text-white">
                  {mission.titleLines.map((line) => <span key={line} className="block">{line}</span>)}
                </h2>
                <p className="mt-6 max-w-lg font-sans font-light text-base leading-relaxed text-white/75 sm:text-lg">
                  {mission.description}
                </p>
                <p className="mt-6 border-l-2 border-[#008CFF] pl-4 font-mono text-xs font-semibold tracking-[0.2em] text-white/60 uppercase">
                  {mission.tag}
                </p>
              </div>

              <figure className={`lg:col-span-7 ${reverse ? 'lg:order-1' : 'lg:order-2'}`}>
                <div
                  ref={(element) => (imageRefs.current[index] = element)}
                  className={`mx-auto w-full max-w-[560px] overflow-hidden bg-[#111419] lg:mx-0 ${
                    mission.aspectRatio === 'cinematic' ? 'aspect-video' : 'aspect-[4/5]'
                  }`}
                >
                  {mission.videoUrl ? (
                    <video
                      src={mission.videoUrl}
                      poster={mission.imageUrl ? getOptimizedImageUrl(mission.imageUrl) : undefined}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      aria-label={`${mission.category} - ${mission.titleLines.join(' ')}`}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.025]"
                    />
                  ) : mission.imageUrl ? (
                    <img
                      src={getOptimizedImageUrl(mission.imageUrl)}
                      alt={`${mission.category} - ${mission.titleLines.join(' ')}`}
                      width={mission.aspectRatio === 'cinematic' ? 1280 : 960}
                      height={mission.aspectRatio === 'cinematic' ? 720 : 1280}
                      sizes="(min-width: 1024px) 44vw, 100vw"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.025]"
                    />
                  ) : null}
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
