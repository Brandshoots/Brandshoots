import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CMSAnnouncement } from '../../types/cms';
import { useCMSContent } from '../../lib/cms/useCMSContent';
import { getAnnouncements } from '../../lib/cms/cmsService';

interface AnnouncementsSectionProps {
  announcements?: CMSAnnouncement[];
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({
  announcements: propAnnouncements,
}) => {
  const { announcements: cmsAnnouncements } = useCMSContent();
  const [asyncAnnouncements, setAsyncAnnouncements] = useState<CMSAnnouncement[] | null>(null);

  // Fallback to getAnnouncements() if realtime hook doesn't provide them initially
  useEffect(() => {
    if (propAnnouncements) return;
    if (cmsAnnouncements && cmsAnnouncements.length > 0) return;

    let mounted = true;
    getAnnouncements()
      .then((items) => {
        if (mounted && items && items.length > 0) {
          setAsyncAnnouncements(items);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [propAnnouncements, cmsAnnouncements]);

  const rawList =
    propAnnouncements ??
    (cmsAnnouncements && cmsAnnouncements.length > 0
      ? cmsAnnouncements
      : asyncAnnouncements ?? []);

  // Filter ONLY active announcements and sort by display order
  const activeAnnouncements = rawList
    .filter((item) => item && item.isActive === true)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  // If there are no active announcements: Hide the entire section
  if (activeAnnouncements.length === 0) {
    return null;
  }

  // Helper to parse and classify the More Info URL
  const resolveButtonLink = (rawUrl?: string) => {
    if (!rawUrl) return null;
    const trimmed = rawUrl.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
      return { isExternal: false, href: trimmed };
    }

    if (/^(https?:|mailto:|tel:|\/\/)/i.test(trimmed)) {
      return { isExternal: true, href: trimmed };
    }

    if (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/i.test(trimmed)) {
      return { isExternal: true, href: `https://${trimmed}` };
    }

    return { isExternal: false, href: `/${trimmed}` };
  };

  // Build repeated items for a continuous seamless 50% translation marquee
  const repeatCount = Math.max(2, Math.ceil(8 / activeAnnouncements.length));
  const oneSet: CMSAnnouncement[] = [];
  for (let i = 0; i < repeatCount; i++) {
    oneSet.push(...activeAnnouncements);
  }
  const marqueeList = [...oneSet, ...oneSet];

  const durationSeconds = Math.max(55, activeAnnouncements.length * 20);

  return (
    <section
      id="announcements"
      className="relative w-full py-8 sm:py-10 bg-[#04060A] text-white overflow-hidden select-none border-y border-white/5"
    >
      {/* Compact Section Header */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 mb-4 sm:mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
          <h2 className="font-sans font-black uppercase text-base sm:text-lg tracking-wider text-white">
            ANNOUNCEMENTS<span className="text-[#008CFF]">.</span>
          </h2>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
          Latest Updates
        </span>
      </div>

      {/* Auto-scroll Continuous Stream with Edge Gradient Masks */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
        }}
      >
        <div className="w-full overflow-hidden flex select-none py-1">
          <div
            className="flex shrink-0 items-stretch animate-announcements-marquee will-change-transform hover:[animation-play-state:paused]"
            style={{ animationDuration: `${durationSeconds}s` }}
          >
            {marqueeList.map((item, idx) => {
              const link = resolveButtonLink(item.buttonUrl);

              return (
                <article
                  key={`${item.id}-${idx}`}
                  className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0 mr-4 sm:mr-5 p-3.5 rounded-2xl bg-[#070B12] border border-white/10 hover:border-[#008CFF]/50 transition-all duration-300 flex flex-col justify-between group/card shadow-md"
                >
                  {/* [ IMAGE ]: Compact height, aspect preserved */}
                  {item.imageUrl && (
                    <div className="relative w-full h-32 sm:h-36 rounded-xl overflow-hidden bg-black/60 shrink-0 mb-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                      />
                    </div>
                  )}

                  {/* Body: TITLE + Short Description */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-figtree font-bold text-sm sm:text-base text-white tracking-tight leading-snug line-clamp-1 group-hover/card:text-[#008CFF] transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-white/60 font-sans line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* [ MORE INFO → ] Button: Always displays "MORE INFO →" */}
                  {link && (
                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
                      {link.isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] uppercase font-bold text-[#008CFF] hover:text-white transition-colors cursor-pointer"
                        >
                          <span>MORE INFO &rarr;</span>
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] uppercase font-bold text-[#008CFF] hover:text-white transition-colors cursor-pointer"
                        >
                          <span>MORE INFO &rarr;</span>
                        </Link>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* Embedded High-Performance Infinite Auto-Scroll Keyframes */}
      <style>{`
        @keyframes announcementsStreamLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-announcements-marquee {
          animation: announcementsStreamLeft 55s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default AnnouncementsSection;
