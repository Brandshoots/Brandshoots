import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCMSContent } from '../../lib/cms/useCMSContent';
import { getOptimizedImageUrl } from '../../utils/mediaAssets';

gsap.registerPlugin(ScrollTrigger);

export interface AnnouncementItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  imageUrl: string;
  date: string;
}

const DEFAULT_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-hiring-editors',
    tag: 'CAREERS // HIRING',
    title: 'WE ARE HIRING: SENIOR VIDEO EDITORS & COLORISTS',
    description: 'Join the BrandShoots studio core. We are scouting ambitious video editors, motion designers & DaVinci colorists skilled in high-retention commercial cuts.',
    buttonText: 'APPLY NOW',
    buttonUrl: '/contact',
    imageUrl: '/reels/thumbnails-webp/sbventures_official_2026-09-15_17-10-21_3986704799434897519_5720346010.webp',
    date: '21 OCTOBER 2026',
  },
  {
    id: 'ann-studio-expansion',
    tag: 'STUDIO EXPANSION',
    title: 'EXPANDING COMMERCIAL STUDIO & CINE SUITES',
    description: 'BrandShoots scales operations with state-of-the-art DaVinci color grading suites, custom anamorphic cine primes, and high-velocity vertical reel studios.',
    buttonText: 'EXPLORE MORE',
    buttonUrl: '/about',
    imageUrl: '/reels/thumbnails-webp/viswatuff.glass_rjy_2026-05-28_18-00-28_3907005057329571857_78432309239.webp',
    date: '18 OCTOBER 2026',
  },
  {
    id: 'ann-q4-campaigns',
    tag: 'Q4 CAMPAIGNS',
    title: 'NOW BOOKING Q4 BRAND CAMPAIGNS & STUDIO SHOOTS',
    description: 'Direct collaboration with our creative directors for high-retention social-first video campaigns, luxury brand films, and multi-platform launches.',
    buttonText: 'BOOK A SHOOT',
    buttonUrl: '/contact',
    imageUrl: '/reels/thumbnails-webp/aabharan_womens_accessories_2026-05-30_10-01-21_3908213461611903133_45301478774.webp',
    date: '12 OCTOBER 2026',
  },
];

export const AnnouncementsSection: React.FC = () => {
  const { announcements: cmsAnnouncements } = useCMSContent();
  const announcements = useMemo<AnnouncementItem[]>(() => {
    if (cmsAnnouncements && cmsAnnouncements.length >= 2) {
      const active = cmsAnnouncements
        .filter((announcement) => announcement.isActive !== false)
        .slice(0, 3)
        .map((announcement, index) => ({
          id: announcement.id || `cms-ann-${index}`,
          tag: announcement.title.toLowerCase().includes('hiring') ? 'CAREERS // HIRING' : 'LATEST HAPPENING',
          title: announcement.title.toUpperCase(),
          description: announcement.description,
          buttonText: announcement.title.toLowerCase().includes('hiring') ? 'APPLY NOW' : 'REGISTER NOW',
          buttonUrl: announcement.buttonUrl || '/contact',
          imageUrl: announcement.imageUrl || DEFAULT_ANNOUNCEMENTS[index % DEFAULT_ANNOUNCEMENTS.length].imageUrl,
          date: DEFAULT_ANNOUNCEMENTS[index % DEFAULT_ANNOUNCEMENTS.length].date,
        }));
      if (active.length > 0) return active;
    }
    return DEFAULT_ANNOUNCEMENTS;
  }, [cmsAnnouncements]);

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);
  const firstRenderRef = useRef(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const currentItem = announcements[currentIndex] || announcements[0];
  const reversed = currentIndex % 2 === 1;

  const goToSlide = useCallback((targetIndex: number) => {
    const nextIndex = (targetIndex + announcements.length) % announcements.length;
    if (nextIndex === currentIndex || isAnimatingRef.current) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !mediaRef.current || !copyRef.current) {
      setCurrentIndex(nextIndex);
      return;
    }

    isAnimatingRef.current = true;
    const exitTimeline = gsap.timeline({ onComplete: () => setCurrentIndex(nextIndex) });
    exitTimeline.to(copyRef.current.children, { opacity: 0, y: -14, duration: 0.24, stagger: 0.025, ease: 'power2.in' }, 0);
    exitTimeline.to(mediaRef.current, { opacity: 0, x: reversed ? 18 : -18, duration: 0.34, ease: 'power2.inOut' }, 0);
  }, [announcements.length, currentIndex, reversed]);

  const nextSlide = useCallback(() => goToSlide(currentIndex + 1), [currentIndex, goToSlide]);
  const previousSlide = useCallback(() => goToSlide(currentIndex - 1), [currentIndex, goToSlide]);

  useEffect(() => {
    setCurrentIndex((index) => Math.min(index, Math.max(announcements.length - 1, 0)));
  }, [announcements.length]);

  useEffect(() => {
    if (isPaused || announcements.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(nextSlide, 7000);
    return () => window.clearInterval(timer);
  }, [announcements.length, isPaused, nextSlide]);

  useEffect(() => {
    if (!sectionRef.current || !headingRef.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(headingRef.current!.children, { opacity: 0, y: 20 }, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true },
      });
    }, sectionRef);
    return () => context.revert();
  }, []);

  useEffect(() => {
    if (!mediaRef.current || !copyRef.current) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const firstRender = firstRenderRef.current;
    firstRenderRef.current = false;
    const context = gsap.context(() => {
      const timeline = gsap.timeline(firstRender
        ? { scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true } }
        : { onComplete: () => { isAnimatingRef.current = false; } });
      timeline.fromTo(mediaRef.current!, { opacity: 0, x: reversed ? 18 : -18, clipPath: reversed ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }, { opacity: 1, x: 0, clipPath: 'inset(0 0 0 0)', duration: reducedMotion ? 0 : 0.7, ease: 'power3.out' }, 0);
      timeline.fromTo(copyRef.current!.children, { opacity: 0, y: reducedMotion ? 0 : 16 }, { opacity: 1, y: 0, duration: reducedMotion ? 0 : 0.48, stagger: reducedMotion ? 0 : 0.06, ease: 'power2.out' }, reducedMotion ? 0 : 0.12);
    }, sectionRef);
    return () => {
      context.revert();
      isAnimatingRef.current = false;
    };
  }, [currentIndex, reversed]);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const difference = touchStartX.current - event.changedTouches[0].clientX;
      if (Math.abs(difference) > 40) difference > 0 ? nextSlide() : previousSlide();
    }
    touchStartX.current = null;
    setIsPaused(false);
  };

  const renderCTA = (item: AnnouncementItem) => {
    const content = <><span>{item.buttonText}</span><span aria-hidden="true">↗</span></>;
    const className = 'inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-white transition-colors hover:text-[#1497F5] uppercase';
    if (item.buttonUrl.startsWith('http') || item.buttonUrl.startsWith('//')) {
      return <a href={item.buttonUrl} target="_blank" rel="noopener noreferrer" className={className}>{content}</a>;
    }
    return <Link to={item.buttonUrl} className={className}>{content}</Link>;
  };

  return (
    <section ref={sectionRef} id="announcements" className="w-full bg-[#08090C] py-20 text-white sm:py-24">
      <div className="mx-auto w-full max-w-[1380px] px-5 sm:px-8 lg:px-12">
        <div ref={headingRef} className="mb-9 flex items-baseline justify-between gap-6 sm:mb-12">
          <h2 className="max-w-3xl text-[clamp(1.85rem,3vw,2.35rem)] font-medium leading-none tracking-[-0.035em] text-white">ANNOUNCEMENTS &amp; HAPPENINGS</h2>
          <span className="shrink-0 text-xs font-medium tracking-[0.12em] text-white/40">0{currentIndex + 1} / 0{announcements.length}</span>
        </div>

        <div className="relative" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <div className={`grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12 lg:gap-16 ${reversed ? 'md:[&>figure]:order-2 md:[&>article]:order-1' : ''}`}>
            <figure ref={mediaRef} className="relative order-1 col-span-1 aspect-[4/3] overflow-hidden bg-[#111419] md:col-span-7 md:aspect-[16/10]">
              <img src={getOptimizedImageUrl(currentItem.imageUrl)} alt={currentItem.title} width={720} height={1280} sizes="(min-width: 768px) 58vw, 100vw" fetchPriority="low" loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </figure>

            <article ref={copyRef} className="order-2 col-span-1 flex flex-col justify-center md:col-span-5 md:py-8 lg:py-12">
              <p className="mb-5 text-[10px] font-medium tracking-[0.1em] text-white/42">{currentItem.tag}</p>
              <h3 className="max-w-[20ch] text-[clamp(1.9rem,3vw,2.6rem)] font-medium leading-[1.08] tracking-[-0.04em] text-white">{currentItem.title}</h3>
              <p className="mt-5 max-w-[45ch] text-[15px] leading-7 text-white/62">{currentItem.description}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
                {renderCTA(currentItem)}
                <time className="text-[10px] font-medium tracking-[0.1em] text-white/38">{currentItem.date}</time>
              </div>
            </article>
          </div>

          <div className="mt-7 flex items-center justify-end gap-2">
            <button type="button" onClick={previousSlide} aria-label="Previous Announcement" className="p-1 text-white/45 transition-colors hover:text-white"><ChevronLeft className="h-4 w-4" /></button>
            <button type="button" onClick={nextSlide} aria-label="Next Announcement" className="p-1 text-white/45 transition-colors hover:text-white"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsSection;
