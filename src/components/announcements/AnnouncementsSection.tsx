import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useCMSContent } from '../../lib/cms/useCMSContent';

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
    description:
      'Join the BrandShoots studio core. We are scouting ambitious video editors, motion designers & DaVinci colorists skilled in high-retention commercial cuts.',
    buttonText: 'APPLY NOW',
    buttonUrl: '/contact',
    imageUrl:
      '/reels/thumbnails/sbventures_official_2026-09-15_17-10-21_3986704799434897519_5720346010.jpg',
    date: '21 OCTOBER 2026',
  },
  {
    id: 'ann-studio-expansion',
    tag: 'STUDIO EXPANSION',
    title: 'EXPANDING COMMERCIAL STUDIO & CINE SUITES',
    description:
      'BrandShoots scales operations with state-of-the-art DaVinci color grading suites, custom anamorphic cine primes, and high-velocity vertical reel studios.',
    buttonText: 'EXPLORE MORE',
    buttonUrl: '/about',
    imageUrl:
      '/reels/thumbnails/viswatuff.glass_rjy_2026-05-28_18-00-28_3907005057329571857_78432309239.jpg',
    date: '18 OCTOBER 2026',
  },
  {
    id: 'ann-q4-campaigns',
    tag: 'Q4 CAMPAIGNS',
    title: 'NOW BOOKING Q4 BRAND CAMPAIGNS & STUDIO SHOOTS',
    description:
      'Direct collaboration with our creative directors for high-retention social-first video campaigns, luxury brand films, and multi-platform launches.',
    buttonText: 'BOOK A SHOOT',
    buttonUrl: '/contact',
    imageUrl:
      '/reels/thumbnails/aabharan_womens_accessories_2026-05-30_10-01-21_3908213461611903133_45301478774.jpg',
    date: '12 OCTOBER 2026',
  },
];

export const AnnouncementsSection: React.FC = () => {
  const { announcements: cmsAnnouncements } = useCMSContent();

  const announcements: AnnouncementItem[] = React.useMemo(() => {
    if (cmsAnnouncements && cmsAnnouncements.length >= 2) {
      const active = cmsAnnouncements
        .filter((a) => a.isActive !== false)
        .slice(0, 3)
        .map((a, i) => ({
          id: a.id || `cms-ann-${i}`,
          tag: a.title.toLowerCase().includes('hiring')
            ? 'CAREERS // HIRING'
            : 'LATEST HAPPENING',
          title: a.title.toUpperCase(),
          description: a.description,
          buttonText: a.title.toLowerCase().includes('hiring')
            ? 'APPLY NOW'
            : 'REGISTER NOW',
          buttonUrl: a.buttonUrl || '/contact',
          imageUrl: a.imageUrl || DEFAULT_ANNOUNCEMENTS[i % DEFAULT_ANNOUNCEMENTS.length].imageUrl,
          date: DEFAULT_ANNOUNCEMENTS[i % DEFAULT_ANNOUNCEMENTS.length].date,
        }));
      if (active.length > 0) return active;
    }
    return DEFAULT_ANNOUNCEMENTS;
  }, [cmsAnnouncements]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1));
  };

  // Auto rotate every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const currentItem = announcements[currentIndex] || announcements[0];
  const prevIndex = (currentIndex - 1 + announcements.length) % announcements.length;
  const nextIndex = (currentIndex + 1) % announcements.length;

  const prevItem = announcements[prevIndex];
  const nextItem = announcements[nextIndex];

  // Mobile swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    setTouchStartX(null);
  };

  const renderButton = (item: AnnouncementItem) => {
    const isExternal =
      item.buttonUrl.startsWith('http') || item.buttonUrl.startsWith('//');

    const content = (
      <>
        <span>{item.buttonText}</span>
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </>
    );

    const buttonClass =
      'inline-flex items-center gap-1.5 sm:gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#008CFF] to-[#0066CC] hover:from-[#33A3FF] hover:to-[#008CFF] text-white font-mono font-bold text-xs sm:text-[13px] tracking-wider uppercase shadow-[0_4px_20px_rgba(0,140,255,0.45)] transition-all active:scale-95 cursor-pointer';

    if (isExternal) {
      return (
        <a
          href={item.buttonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          {content}
        </a>
      );
    }

    return (
      <Link to={item.buttonUrl} className={buttonClass}>
        {content}
      </Link>
    );
  };

  return (
    <section
      id="announcements"
      className="relative w-full py-16 sm:py-20 md:py-24 bg-[#04060A] text-white overflow-hidden select-none border-b border-white/5"
    >
      {/* Background Soft Electric Blue / Obsidian Aura */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1100px] h-[450px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.09) 0%, rgba(0, 50, 150, 0.02) 45%, transparent 75%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* ======================================================== */}
        {/* 1. HEADER (LATEST UPDATES // 2026 + ANNOUNCEMENTS + COUNTER) */}
        {/* ======================================================== */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            {/* Top Cyan Subtitle */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
              <span className="font-mono text-[11px] sm:text-xs tracking-[0.28em] text-[#008CFF] uppercase font-bold">
                LATEST UPDATES // 2026
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="font-sans font-black uppercase text-2xl xs:text-3xl sm:text-4xl md:text-5xl tracking-[-0.03em] text-white">
              ANNOUNCEMENTS &amp; HAPPENINGS
            </h2>
          </div>

          {/* Right Counter Badge: 01 / 03 */}
          <div className="hidden sm:inline-flex items-center px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.04] text-xs font-mono tracking-widest text-white/80">
            <span>0{currentIndex + 1}</span>
            <span className="mx-1 text-white/30">/</span>
            <span className="text-white/40">0{announcements.length}</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. SHOWCASE CAROUSEL (Center active card + peeking sides) */}
        {/* ======================================================== */}
        <div
          className="relative w-full flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left Arrow (Electric Blue Chevron) */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Announcement"
            className="absolute left-0 sm:left-2 md:left-4 lg:left-8 z-30 p-2 text-[#008CFF] hover:text-white transition-all duration-200 hover:scale-125 active:scale-95 focus:outline-none"
          >
            <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
          </button>

          {/* Carousel Stage */}
          <div className="relative w-full max-w-[920px] mx-auto overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.9)] bg-[#07090E]">
            <div className="relative w-full aspect-[16/11] sm:aspect-[16/9] md:aspect-[16/8.5] max-h-[520px] overflow-hidden flex items-center justify-center">
              {/* Peeking Left Slide Ghost (Desktop only) */}
              <div
                className="hidden lg:block absolute -left-[72%] top-0 bottom-0 w-[80%] rounded-2xl overflow-hidden pointer-events-none opacity-25 filter blur-[2px] transition-all duration-500"
                style={{ transform: 'scale(0.88)' }}
              >
                <img
                  src={prevItem.imageUrl}
                  alt={prevItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/70" />
              </div>

              {/* Main Active Card */}
              <div className="relative w-full h-full overflow-hidden">
                {/* Background Image */}
                <img
                  src={currentItem.imageUrl}
                  alt={currentItem.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out"
                />

                {/* Film Vignette & Dark Bottom Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#04060A] via-[#04060A]/70 to-transparent" />
                <div className="absolute inset-0 bg-radial-vignette opacity-40 pointer-events-none" />

                {/* Overlaid Announcement Content */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 md:p-10 flex flex-col items-start justify-end z-20">
                  {/* Category Pill Tag */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] border border-white/15 text-[10px] sm:text-[11px] font-mono font-semibold tracking-wider uppercase text-white/90 mb-2.5 sm:mb-3 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_6px_#008CFF]" />
                    <span>{currentItem.tag}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-sans font-black uppercase text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-[34px] leading-tight tracking-[-0.03em] text-white max-w-2xl text-left drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                    {currentItem.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs sm:text-sm md:text-base text-white/70 max-w-xl line-clamp-2 text-left leading-relaxed font-sans">
                    {currentItem.description}
                  </p>

                  {/* Electric Blue Action Button */}
                  <div className="mt-4 sm:mt-5">
                    {renderButton(currentItem)}
                  </div>
                </div>
              </div>

              {/* Peeking Right Slide Ghost (Desktop only) */}
              <div
                className="hidden lg:block absolute -right-[72%] top-0 bottom-0 w-[80%] rounded-2xl overflow-hidden pointer-events-none opacity-25 filter blur-[2px] transition-all duration-500"
                style={{ transform: 'scale(0.88)' }}
              >
                <img
                  src={nextItem.imageUrl}
                  alt={nextItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/70" />
              </div>
            </div>
          </div>

          {/* Right Arrow (Electric Blue Chevron) */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Announcement"
            className="absolute right-0 sm:left-auto sm:right-2 md:right-4 lg:right-8 z-30 p-2 text-[#008CFF] hover:text-white transition-all duration-200 hover:scale-125 active:scale-95 focus:outline-none"
          >
            <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* 3. FOOTER (Pill dots + Date)                            */}
        {/* ======================================================== */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center justify-center gap-2.5">
          {/* Dot Indicators */}
          <div className="flex items-center gap-2">
            {announcements.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to announcement ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-6 h-1.5 bg-[#008CFF] shadow-[0_0_8px_#008CFF]'
                    : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Formatted Date */}
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.26em] uppercase text-white/50">
            {currentItem.date}
          </span>
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsSection;
