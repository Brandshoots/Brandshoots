import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCMSContent } from '../../lib/cms/useCMSContent';
import { getOptimizedImageUrl } from '../../utils/mediaAssets';

gsap.registerPlugin(ScrollTrigger);

export const TheLeadershipSection: React.FC = () => {
  const { leadership } = useCMSContent();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const nameParts = (leadership?.founderName || 'DURGARAO VALLEPU').trim().split(/\s+/);
  const firstName = nameParts[0] || 'DURGARAO';
  const lastName = nameParts.slice(1).join(' ') || 'VALLEPU';

  useEffect(() => {
    if (!sectionRef.current) return;
    const context = gsap.context(() => {
      gsap.fromTo([portraitRef.current, contentRef.current], { opacity: 0, y: 24 }, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
      });
      if (portraitRef.current) {
        gsap.to(portraitRef.current, {
          y: -28,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      }
    }, sectionRef);
    return () => context.revert();
  }, []);

  return (
    <section id="leadership" ref={sectionRef} className="w-full border-b border-white/10 bg-[#08090C] py-24 text-white sm:py-32 lg:py-40">
      <div className="mx-auto grid w-full max-w-[1380px] grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-20 lg:px-12">
        <figure ref={portraitRef} className="lg:col-span-5">
          <div className="aspect-[4/5] w-full max-w-[520px] overflow-hidden bg-[#111419]">
            <img
              src={getOptimizedImageUrl(leadership?.founderImage || '/founder.webp')}
              alt={`${leadership?.founderName || 'Durgarao Vallepu'} — ${leadership?.founderRole || 'Founder'}`}
              width={960}
              height={960}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-[center_20%]"
              draggable={false}
            />
          </div>
        </figure>

        <div ref={contentRef} className="flex flex-col justify-center lg:col-span-7 lg:border-l lg:border-white/20 lg:pl-16">
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-sans font-black uppercase leading-[0.88] tracking-[-0.025em]">
            <span className="block">{firstName.toUpperCase()}</span>
            <span className="block text-[#008CFF]">{lastName.toUpperCase()}<span className="text-white">.</span></span>
          </h2>
          <p className="mt-6 font-mono text-xs sm:text-sm tracking-[0.24em] uppercase text-white/75 font-semibold">
            {leadership?.founderRole || 'FOUNDER & CREATIVE DIRECTOR'}
          </p>
          <div className="my-7 h-[2px] w-24 bg-gradient-to-r from-[#008CFF] to-transparent" />
          <p className="max-w-2xl font-sans font-light text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed">
            {leadership?.founderBio ||
              '"Every frame is calculated. Every cut has intent. We don’t just capture visuals — we architect cultural presence and commercial momentum for brands that refuse to be ignored."'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TheLeadershipSection;
