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
  buttonText?: string;
  buttonUrl: string;
  imageUrl: string;
  date: string;
  dateTime?: string;
}

function formatStoredTimestamp(createdAt: string, updatedAt: string): Pick<AnnouncementItem, 'date' | 'dateTime'> {
  const storedTimestamp = createdAt || updatedAt;
  if (!storedTimestamp) return { date: '' };

  const parsed = new Date(storedTimestamp);
  if (Number.isNaN(parsed.getTime())) return { date: storedTimestamp };

  return {
    date: parsed.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).toUpperCase(),
    dateTime: parsed.toISOString(),
  };
}

const SAMPLE_ANNOUNCEMENT_IMAGES = [
  '/announcements/hiring-editor-colorist.jpg',
  '/announcements/usa-enterprise-client.jpg',
  '/announcements/q4-brand-campaigns.jpg',
  '/announcements/studio-cine-expansion.jpg',
];

function resolveAnnouncementImage(imageUrl: string | undefined, title: string, index: number): string {
  const trimmed = (imageUrl || '').trim();
  const isOldReelThumbnail =
    !trimmed ||
    trimmed.includes('/reels/') ||
    trimmed.includes('/reels_new/') ||
    trimmed.includes('/reels_light/');

  if (!isOldReelThumbnail) return trimmed;

  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('hiring') || lowerTitle.includes('editor') || lowerTitle.includes('colorist')) return SAMPLE_ANNOUNCEMENT_IMAGES[0];
  if (lowerTitle.includes('usa') || lowerTitle.includes('enterprise')) return SAMPLE_ANNOUNCEMENT_IMAGES[1];
  if (lowerTitle.includes('campaign') || lowerTitle.includes('q4') || lowerTitle.includes('booking')) return SAMPLE_ANNOUNCEMENT_IMAGES[2];
  if (lowerTitle.includes('expand') || lowerTitle.includes('cine') || lowerTitle.includes('studio')) return SAMPLE_ANNOUNCEMENT_IMAGES[3];
  return SAMPLE_ANNOUNCEMENT_IMAGES[index % SAMPLE_ANNOUNCEMENT_IMAGES.length];
}

export const AnnouncementsSection: React.FC = () => {
  const { announcements: cmsAnnouncements } = useCMSContent();
  const announcements = useMemo<AnnouncementItem[]>(() => {
    return cmsAnnouncements
      .filter((announcement) => announcement.isActive !== false)
      .slice(0, 3)
      .map((announcement, index) => ({
        id: announcement.id || `cms-ann-${index}`,
        tag: announcement.title.toLowerCase().includes('hiring') ? 'CAREERS · HIRING' : 'LATEST HAPPENING',
        title: announcement.title.toUpperCase(),
        description: announcement.description,
        buttonText:
          announcement.buttonText?.trim() ||
          (announcement.title.toLowerCase().includes('hiring') ? 'APPLY NOW' : 'MORE INFO'),
        buttonUrl: announcement.buttonUrl?.trim() || '/contact',
        imageUrl: resolveAnnouncementImage(announcement.imageUrl, announcement.title, index),
        ...formatStoredTimestamp(announcement.createdAt, announcement.updatedAt),
      }));
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
    if (announcements.length === 0) return;
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

  if (!currentItem) return null;

  const renderCTA = (item: AnnouncementItem) => {
    const buttonUrl = item.buttonUrl?.trim() || '/contact';
    const buttonText =
      item.buttonText?.trim() ||
      (item.title.toLowerCase().includes('hiring') ? 'APPLY NOW' : 'MORE INFO');

    const content = (
      <>
        <span>{buttonText}</span>
        <span aria-hidden="true" className="text-sm leading-none transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          ↗
        </span>
      </>
    );
    const className =
      'group inline-flex items-center gap-2.5 rounded-full bg-[#008CFF] px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_24px_rgba(0,140,255,0.35)] transition-all duration-200 hover:bg-[#1a97ff] hover:shadow-[0_0_32px_rgba(0,140,255,0.55)] active:scale-95';
    if (buttonUrl.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(buttonUrl)) {
      return <a href={buttonUrl} target="_blank" rel="noopener noreferrer" className={className}>{content}</a>;
    }
    return <Link to={buttonUrl} className={className}>{content}</Link>;
  };

  return (
    <section ref={sectionRef} id="announcements" className="relative w-full bg-[#08090C] py-20 text-white sm:py-24">
      <div className="mx-auto w-full max-w-[1380px] px-5 sm:px-8 md:px-16 lg:px-20">
        <div ref={headingRef} className="mb-9 flex items-baseline justify-between gap-6 sm:mb-12">
          <h2 className="max-w-3xl text-[clamp(1.85rem,3vw,2.35rem)] font-sans font-black uppercase leading-none tracking-[-0.025em] text-white">ANNOUNCEMENTS &amp; HAPPENINGS</h2>
          <span className="shrink-0 font-mono text-xs font-semibold tracking-[0.2em] text-[#008CFF]">0{currentIndex + 1} / 0{announcements.length}</span>
        </div>

        <div className="relative" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <div className={`grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12 lg:gap-16 ${reversed ? 'md:[&>figure]:order-2 md:[&>article]:order-1' : ''}`}>
            <figure ref={mediaRef} className="relative order-1 col-span-1 aspect-[4/3] overflow-hidden bg-[#111419] md:col-span-7 md:aspect-[16/10]">
              <img src={getOptimizedImageUrl(currentItem.imageUrl)} alt={currentItem.title} width={720} height={1280} sizes="(min-width: 768px) 58vw, 100vw" loading="lazy" decoding="async" className="h-full w-full object-cover" />

              {announcements.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={previousSlide}
                    aria-label="Previous Announcement"
                    className="md:hidden absolute left-2.5 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#070A10]/85 backdrop-blur-md border border-white/25 text-white shadow-lg active:scale-90 transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next Announcement"
                    className="md:hidden absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#070A10]/85 backdrop-blur-md border border-white/25 text-white shadow-lg active:scale-90 transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </figure>

            <article ref={copyRef} className="order-2 col-span-1 flex flex-col justify-center md:col-span-5 md:py-8 lg:py-12">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] font-semibold text-[#008CFF]">{currentItem.tag}</p>
              <h3 className="max-w-[20ch] text-[clamp(1.8rem,3vw,2.5rem)] font-sans font-black uppercase leading-[1.05] tracking-[-0.025em] text-white">{currentItem.title}</h3>
              <p className="mt-4 max-w-[45ch] font-sans font-light text-sm sm:text-base leading-relaxed text-white/75">{currentItem.description}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
                {renderCTA(currentItem)}
                {currentItem.date && (
                  <time dateTime={currentItem.dateTime} className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                    {currentItem.date}
                  </time>
                )}
              </div>
            </article>
          </div>

          {announcements.length > 1 && (
            <>
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous Announcement"
                className="hidden md:flex absolute -left-12 lg:-left-14 top-1/2 -translate-y-1/2 z-20 h-11 w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-[#0B0F17]/90 backdrop-blur-xl border border-white/25 text-white shadow-[0_8px_24px_rgba(0,0,0,0.65)] transition-all duration-200 hover:border-[#008CFF] hover:bg-[#008CFF]/20 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next Announcement"
                className="hidden md:flex absolute -right-12 lg:-right-14 top-1/2 -translate-y-1/2 z-20 h-11 w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-[#0B0F17]/90 backdrop-blur-xl border border-white/25 text-white shadow-[0_8px_24px_rgba(0,0,0,0.65)] transition-all duration-200 hover:border-[#008CFF] hover:bg-[#008CFF]/20 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsSection;
