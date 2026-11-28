import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { firebaseDb } from '../firebase';
import {
  CMSProject,
  CMSClientLogo,
  CMSHero,
  CMSHeroReel,
  CMSService,
  CMSTestimonial,
  CMSSiteSettings,
  CMSLeadership,
  CMSAnnouncement,
  CMSContactPage,
} from '../../types/cms';
import { CLIENT_PROJECTS } from '../../data/clientsData';
import {
  INITIAL_CLIENTS,
  INITIAL_HERO,
  INITIAL_HERO_REELS,
  INITIAL_SERVICES,
  INITIAL_TESTIMONIALS,
  INITIAL_LEADERSHIP,
  INITIAL_SITE_SETTINGS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_CONTACT_PAGE,
} from './seedData';

// Static content is used only while the first live snapshot is pending or when the listener fails.
const fallbackProjects: CMSProject[] = CLIENT_PROJECTS.map((project, index) => ({
  ...project,
  order: index,
  visible: true,
}));
const fallbackClients: CMSClientLogo[] = Object.values(INITIAL_CLIENTS);
const fallbackServices: CMSService[] = Object.values(INITIAL_SERVICES).sort(
  (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
);
const fallbackTestimonials: CMSTestimonial[] = Object.values(INITIAL_TESTIMONIALS);
const fallbackAnnouncements: CMSAnnouncement[] = Object.values(INITIAL_ANNOUNCEMENTS);

type OrderedVisibleItem = {
  order?: number;
  visible?: boolean;
};

function collectionValues<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value.filter(Boolean) as T[];
  if (value && typeof value === 'object') return Object.values(value as Record<string, T>).filter(Boolean);
  return [];
}

function normalizeVisibleList<T extends OrderedVisibleItem>(value: unknown): T[] {
  return collectionValues<T>(value)
    .filter((item) => item.visible !== false)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
}

const DEFAULT_SERVICE_FALLBACKS: Record<string, string> = {
  'creative-content': '/what-we-do/creative-content.jpg',
  'digital-growth': '/what-we-do/digital-growth.jpg',
  'editing-posting': '/what-we-do/editing-posting.jpg',
};

const DEFAULT_ANNOUNCEMENT_FALLBACKS = [
  '/announcements/hiring-editor-colorist.jpg',
  '/announcements/usa-enterprise-client.jpg',
  '/announcements/q4-brand-campaigns.jpg',
  '/announcements/studio-cine-expansion.jpg',
];

export function sanitizeProjectList(list: CMSProject[]): CMSProject[] {
  return Array.isArray(list) ? list : [];
}

export function sanitizeClientList(list: CMSClientLogo[]): CMSClientLogo[] {
  return Array.isArray(list) ? list : [];
}

export function sanitizeServicesList(list: CMSService[]): CMSService[] {
  if (!Array.isArray(list)) return [];
  return list.map((service) => {
    const rawUrl = (service.imageUrl || '').trim();
    const isOldReelThumbnail =
      !rawUrl ||
      rawUrl.includes('/reels/') ||
      rawUrl.includes('/reels_new/') ||
      rawUrl.includes('/reels_light/');
    if (isOldReelThumbnail && DEFAULT_SERVICE_FALLBACKS[service.id]) {
      return { ...service, imageUrl: DEFAULT_SERVICE_FALLBACKS[service.id] };
    }
    return service;
  });
}

export function sanitizeAnnouncementsList(list: CMSAnnouncement[]): CMSAnnouncement[] {
  if (!Array.isArray(list)) return [];
  return list.map((item, index) => {
    const rawUrl = (item.imageUrl || '').trim();
    const isOldReelThumbnail =
      !rawUrl ||
      rawUrl.includes('/reels/') ||
      rawUrl.includes('/reels_new/') ||
      rawUrl.includes('/reels_light/');
    if (isOldReelThumbnail) {
      const lower = item.title.toLowerCase();
      let cleanUrl = DEFAULT_ANNOUNCEMENT_FALLBACKS[0];
      if (lower.includes('hiring') || lower.includes('editor') || lower.includes('colorist')) {
        cleanUrl = DEFAULT_ANNOUNCEMENT_FALLBACKS[0];
      } else if (lower.includes('usa') || lower.includes('enterprise')) {
        cleanUrl = DEFAULT_ANNOUNCEMENT_FALLBACKS[1];
      } else if (lower.includes('campaign') || lower.includes('q4') || lower.includes('booking')) {
        cleanUrl = DEFAULT_ANNOUNCEMENT_FALLBACKS[2];
      } else if (lower.includes('expand') || lower.includes('cine') || lower.includes('studio')) {
        cleanUrl = DEFAULT_ANNOUNCEMENT_FALLBACKS[3];
      } else {
        cleanUrl = DEFAULT_ANNOUNCEMENT_FALLBACKS[index % DEFAULT_ANNOUNCEMENT_FALLBACKS.length];
      }
      return { ...item, imageUrl: cleanUrl };
    }
    return item;
  });
}

function normalizeAnnouncements(value: unknown): CMSAnnouncement[] {
  const filtered = collectionValues<CMSAnnouncement>(value)
    .filter((announcement) => announcement.isActive !== false)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  return sanitizeAnnouncementsList(filtered);
}

export function sanitizeEmail(email?: string): string {
  if (!email || !email.trim()) {
    return INITIAL_SITE_SETTINGS.contactEmail;
  }
  return email.trim();
}

export function sanitizeSiteVisitPrice(price?: string): string {
  const clean = (price || '').trim();
  if (!clean || clean === '₹2,000' || clean === '2000') {
    return INITIAL_CONTACT_PAGE.siteVisitPrice;
  }
  return clean;
}

export function sanitizeLeadership(leadership?: Partial<CMSLeadership> | null): CMSLeadership {
  if (!leadership || typeof leadership !== 'object') return INITIAL_LEADERSHIP;
  const rawBio = (leadership.founderBio || '').trim();
  const isOldBio =
    !rawBio ||
    rawBio.includes('dedicated to elevating Indian and global brands into cinematic legends') ||
    rawBio === 'We offer affordable digital marketing and high-impact visual production built for real brand growth — helping businesses scale their presence, reach the right audience, and turn attention into measurable revenue.';
  return {
    ...INITIAL_LEADERSHIP,
    ...leadership,
    founderBio: isOldBio ? INITIAL_LEADERSHIP.founderBio : rawBio,
    founderImage: leadership.founderImage?.trim() || INITIAL_LEADERSHIP.founderImage,
  };
}

export function useCMSContent() {
  const [projects, setProjects] = useState<CMSProject[]>(() => {
    try {
      const cached = localStorage.getItem('brandshoots_projects');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return sanitizeProjectList(normalizeVisibleList<CMSProject>(parsed));
      }
    } catch {}
    return fallbackProjects;
  });
  const [clients, setClients] = useState<CMSClientLogo[]>(() => {
    try {
      const cached = localStorage.getItem('brandshoots_clients');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return sanitizeClientList(normalizeVisibleList<CMSClientLogo>(parsed));
      }
    } catch {}
    return fallbackClients;
  });
  const [hero, setHero] = useState<CMSHero>(() => {
    try {
      const cached = localStorage.getItem('brandshoots_hero');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') return { ...INITIAL_HERO, ...parsed };
      }
    } catch {}
    return INITIAL_HERO;
  });
  const [heroReels, setHeroReels] = useState<CMSHeroReel[]>(() => {
    try {
      const cached = localStorage.getItem('brandshoots_hero_reels');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return normalizeVisibleList<CMSHeroReel>(parsed);
      }
    } catch {}
    return INITIAL_HERO_REELS;
  });
  const [services, setServices] = useState<CMSService[]>(() => {
    try {
      const cached = localStorage.getItem('brandshoots_services');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return sanitizeServicesList(normalizeVisibleList<CMSService>(parsed));
      }
    } catch {}
    return fallbackServices;
  });
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>(() => {
    try {
      const cached = localStorage.getItem('brandshoots_testimonials');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return normalizeVisibleList<CMSTestimonial>(parsed);
      }
    } catch {}
    return fallbackTestimonials;
  });
  const [leadership, setLeadership] = useState<CMSLeadership>(() => {
    try {
      const cached = localStorage.getItem('brandshoots_leadership');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') return sanitizeLeadership(parsed);
      }
    } catch {}
    return INITIAL_LEADERSHIP;
  });
  const [settings, setSettings] = useState<CMSSiteSettings>(() => {
    try {
      const cached = localStorage.getItem('brandshoots_site_settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          return {
            ...INITIAL_SITE_SETTINGS,
            ...parsed,
            contactEmail: sanitizeEmail(parsed.contactEmail),
          };
        }
      }
    } catch {}
    return INITIAL_SITE_SETTINGS;
  });
  const [announcements, setAnnouncements] = useState<CMSAnnouncement[]>(() => {
    try {
      const cached = localStorage.getItem('brandshoots_announcements');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return normalizeAnnouncements(parsed);
      }
    } catch {}
    return fallbackAnnouncements;
  });
  const [contact, setContact] = useState<CMSContactPage>(() => {
    try {
      const cached = localStorage.getItem('brandshoots_contact');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          return {
            ...INITIAL_CONTACT_PAGE,
            ...parsed,
            email: sanitizeEmail(parsed.email),
            siteVisitPrice: sanitizeSiteVisitPrice(parsed.siteVisitPrice),
          };
        }
      }
    } catch {}
    return INITIAL_CONTACT_PAGE;
  });
  const [isLive, setIsLive] = useState<boolean>(false);
  const [heroReelsLoading, setHeroReelsLoading] = useState<boolean>(true);
  const [heroReelsError, setHeroReelsError] = useState<string | null>(null);

  useEffect(() => {
    const applyStaticFallback = (errorMessage?: string) => {
      setProjects(fallbackProjects);
      setClients(fallbackClients);
      setHero(INITIAL_HERO);
      setHeroReels(INITIAL_HERO_REELS);
      setServices(fallbackServices);
      setTestimonials(fallbackTestimonials);
      setLeadership(INITIAL_LEADERSHIP);
      setSettings(INITIAL_SITE_SETTINGS);
      setAnnouncements(fallbackAnnouncements);
      setContact(INITIAL_CONTACT_PAGE);
      setIsLive(false);
      setHeroReelsLoading(false);
      setHeroReelsError(errorMessage || null);
    };

    try {
      const publishedRef = ref(firebaseDb, 'published');
      const unsubscribe = onValue(
        publishedRef,
        (snapshot) => {
          const snapshotValue = snapshot.exists() ? snapshot.val() : null;
          const data = snapshotValue && typeof snapshotValue === 'object'
            ? snapshotValue as Record<string, unknown>
            : {};
          const heroData = data.hero && typeof data.hero === 'object'
            ? data.hero as Record<string, unknown>
            : undefined;

          // Every successful snapshot is authoritative, including absent or empty collections.
          const liveProjects = sanitizeProjectList(normalizeVisibleList<CMSProject>(data.projects));
          const liveClients = sanitizeClientList(normalizeVisibleList<CMSClientLogo>(data.clients));
          const liveHero = (heroData || {}) as unknown as CMSHero;
          setProjects(liveProjects);
          setClients(liveClients);
          setHero(liveHero);

          const rawHeroReels = data.heroReels ?? heroData?.reels;
          let liveHeroReels: CMSHeroReel[];
          if (rawHeroReels === undefined || rawHeroReels === null) {
            liveHeroReels = INITIAL_HERO_REELS;
          } else {
            const allCollectionReels = collectionValues<CMSHeroReel>(rawHeroReels);
            const hasCarouselOrUploadedReel = allCollectionReels.some(
              (reel) =>
                typeof reel.src === 'string' &&
                (reel.src.startsWith('/reels/hero-carousel/') || reel.src.startsWith('https://'))
            );
            if (allCollectionReels.length > 0 && !hasCarouselOrUploadedReel) {
              // Legacy pre-migration Firebase list -> serve approved 4 Hero Carousel videos
              liveHeroReels = INITIAL_HERO_REELS;
            } else {
              liveHeroReels = normalizeVisibleList<CMSHeroReel>(rawHeroReels).filter(
                (reel) =>
                  typeof reel.src === 'string' &&
                  reel.src.trim().length > 0 &&
                  !reel.src.startsWith('blob:')
              );
            }
          }
          setHeroReels(liveHeroReels);
          setHeroReelsLoading(false);
          setHeroReelsError(null);

          const liveServices = sanitizeServicesList(normalizeVisibleList<CMSService>(data.services));
          const liveTestimonials = normalizeVisibleList<CMSTestimonial>(data.testimonials);
          const liveAnnouncements = normalizeAnnouncements(data.announcements);
          const liveLeadership = sanitizeLeadership(
            data.leadership && typeof data.leadership === 'object'
              ? (data.leadership as CMSLeadership)
              : INITIAL_LEADERSHIP
          );

          setServices(liveServices);
          setTestimonials(liveTestimonials);
          setAnnouncements(liveAnnouncements);
          setLeadership(liveLeadership);

          const rawSettings = data.siteSettings && typeof data.siteSettings === 'object'
            ? data.siteSettings as CMSSiteSettings
            : INITIAL_SITE_SETTINGS;
          const liveSettings = {
            ...rawSettings,
            contactEmail: sanitizeEmail(rawSettings.contactEmail),
          };
          setSettings(liveSettings);

          const rawContact = data.contact && typeof data.contact === 'object'
            ? data.contact as CMSContactPage
            : INITIAL_CONTACT_PAGE;
          const liveContact = {
            ...rawContact,
            email: sanitizeEmail(rawContact.email),
            siteVisitPrice: sanitizeSiteVisitPrice(rawContact.siteVisitPrice),
          };
          setContact(liveContact);
          try {
            localStorage.setItem('brandshoots_projects', JSON.stringify(liveProjects));
            localStorage.setItem('brandshoots_clients', JSON.stringify(liveClients));
            localStorage.setItem('brandshoots_hero', JSON.stringify(liveHero));
            localStorage.setItem('brandshoots_hero_reels', JSON.stringify(liveHeroReels));
            localStorage.setItem('brandshoots_services', JSON.stringify(liveServices));
            localStorage.setItem('brandshoots_testimonials', JSON.stringify(liveTestimonials));
            localStorage.setItem('brandshoots_announcements', JSON.stringify(liveAnnouncements));
            localStorage.setItem('brandshoots_leadership', JSON.stringify(liveLeadership));
            localStorage.setItem('brandshoots_contact', JSON.stringify(liveContact));
            localStorage.setItem('brandshoots_site_settings', JSON.stringify(liveSettings));
          } catch {}

          setIsLive(true);
        },
        (error) => {
          console.warn('Firebase RTDB listener failed; using static content:', error.message);
          applyStaticFallback(error.message);
        }
      );

      // Local custom events provide an optimistic same-tab update until Firebase confirms it.
      const handleLocalReelsUpdate = (event: Event) => {
        const detail = (event as CustomEvent<CMSHeroReel[]>).detail;
        if (Array.isArray(detail)) setHeroReels(normalizeVisibleList<CMSHeroReel>(detail));
      };

      const handleLocalServicesUpdate = (event: Event) => {
        const detail = (event as CustomEvent<CMSService[]>).detail;
        if (Array.isArray(detail)) setServices(sanitizeServicesList(normalizeVisibleList<CMSService>(detail)));
      };

      const handleLocalAnnouncementsUpdate = (event: Event) => {
        const detail = (event as CustomEvent<CMSAnnouncement[]>).detail;
        if (Array.isArray(detail)) setAnnouncements(normalizeAnnouncements(detail));
      };

      const handleLocalClientsUpdate = (event: Event) => {
        const detail = (event as CustomEvent<CMSClientLogo[]>).detail;
        if (Array.isArray(detail)) setClients(sanitizeClientList(normalizeVisibleList<CMSClientLogo>(detail)));
      };

      const handleLocalTestimonialsUpdate = (event: Event) => {
        const detail = (event as CustomEvent<CMSTestimonial[]>).detail;
        if (Array.isArray(detail)) setTestimonials(normalizeVisibleList<CMSTestimonial>(detail));
      };

      const handleLocalHeroUpdate = (event: Event) => {
        const detail = (event as CustomEvent<CMSHero>).detail;
        if (detail && typeof detail === 'object') setHero(detail);
      };

      const handleLocalProjectsUpdate = (event: Event) => {
        const detail = (event as CustomEvent<CMSProject[]>).detail;
        if (Array.isArray(detail)) setProjects(sanitizeProjectList(normalizeVisibleList<CMSProject>(detail)));
      };

      const handleLocalContactUpdate = (event: Event) => {
        const detail = (event as CustomEvent<CMSContactPage>).detail;
        if (detail && typeof detail === 'object') {
          setContact({
            ...detail,
            email: sanitizeEmail(detail.email),
            siteVisitPrice: sanitizeSiteVisitPrice(detail.siteVisitPrice),
          });
        }
      };

      const handleLocalSettingsUpdate = (event: Event) => {
        const detail = (event as CustomEvent<CMSSiteSettings>).detail;
        if (detail && typeof detail === 'object') {
          setSettings({
            ...detail,
            contactEmail: sanitizeEmail(detail.contactEmail),
          });
        }
      };

      // Storage events mirror confirmed updates from another tab, including deliberate empty arrays.
      const handleStorageUpdate = (event: StorageEvent) => {
        if (event.key === 'brandshoots_site_settings') {
          if (event.newValue === null) {
            setSettings(INITIAL_SITE_SETTINGS);
          } else {
            try {
              const parsed = JSON.parse(event.newValue);
              if (parsed && typeof parsed === 'object') {
                setSettings({
                  ...parsed,
                  contactEmail: sanitizeEmail(parsed.contactEmail),
                } as CMSSiteSettings);
              }
            } catch {}
          }
        }
        if (event.key === 'brandshoots_hero') {
          if (event.newValue === null) {
            setHero({} as CMSHero);
          } else {
            try {
              const parsed = JSON.parse(event.newValue);
              if (parsed && typeof parsed === 'object') setHero(parsed as CMSHero);
            } catch {}
          }
        }
        if (event.key === 'brandshoots_projects') {
          if (event.newValue === null) {
            setProjects([]);
          } else {
            try {
              const parsed = JSON.parse(event.newValue);
              if (Array.isArray(parsed)) setProjects(sanitizeProjectList(normalizeVisibleList<CMSProject>(parsed)));
            } catch {}
          }
        }
        if (event.key === 'brandshoots_contact' && event.newValue) {
          try {
            const parsed = JSON.parse(event.newValue);
            if (parsed && typeof parsed === 'object') {
              setContact({
                ...parsed,
                email: sanitizeEmail(parsed.email),
                siteVisitPrice: sanitizeSiteVisitPrice(parsed.siteVisitPrice),
              } as CMSContactPage);
            }
          } catch {}
        }
        if (event.key === 'brandshoots_hero_reels') {
          if (event.newValue === null) {
            setHeroReels([]);
          } else {
            try {
              const parsed = JSON.parse(event.newValue);
              if (Array.isArray(parsed)) setHeroReels(normalizeVisibleList<CMSHeroReel>(parsed));
            } catch {}
          }
        }
        if (event.key === 'brandshoots_services') {
          if (event.newValue === null) {
            setServices([]);
          } else {
            try {
              const parsed = JSON.parse(event.newValue);
              if (Array.isArray(parsed)) setServices(sanitizeServicesList(normalizeVisibleList<CMSService>(parsed)));
            } catch {}
          }
        }
        if (event.key === 'brandshoots_announcements') {
          if (event.newValue === null) {
            setAnnouncements([]);
          } else {
            try {
              const parsed = JSON.parse(event.newValue);
              if (Array.isArray(parsed)) setAnnouncements(normalizeAnnouncements(parsed));
            } catch {}
          }
        }
        if (event.key === 'brandshoots_clients') {
          if (event.newValue === null) {
            setClients([]);
          } else {
            try {
              const parsed = JSON.parse(event.newValue);
              if (Array.isArray(parsed)) setClients(sanitizeClientList(normalizeVisibleList<CMSClientLogo>(parsed)));
            } catch {}
          }
        }
        if (event.key === 'brandshoots_testimonials') {
          if (event.newValue === null) {
            setTestimonials([]);
          } else {
            try {
              const parsed = JSON.parse(event.newValue);
              if (Array.isArray(parsed)) setTestimonials(normalizeVisibleList<CMSTestimonial>(parsed));
            } catch {}
          }
        }
      };

      window.addEventListener('brandshoots_hero_updated', handleLocalHeroUpdate);
      window.addEventListener('brandshoots_hero_reels_updated', handleLocalReelsUpdate);
      window.addEventListener('brandshoots_services_updated', handleLocalServicesUpdate);
      window.addEventListener('brandshoots_announcements_updated', handleLocalAnnouncementsUpdate);
      window.addEventListener('brandshoots_clients_updated', handleLocalClientsUpdate);
      window.addEventListener('brandshoots_testimonials_updated', handleLocalTestimonialsUpdate);
      window.addEventListener('brandshoots_projects_updated', handleLocalProjectsUpdate);
      window.addEventListener('brandshoots_contact_updated', handleLocalContactUpdate);
      window.addEventListener('brandshoots_site_settings_updated', handleLocalSettingsUpdate);
      window.addEventListener('storage', handleStorageUpdate);

      return () => {
        unsubscribe();
        window.removeEventListener('brandshoots_hero_updated', handleLocalHeroUpdate);
        window.removeEventListener('brandshoots_hero_reels_updated', handleLocalReelsUpdate);
        window.removeEventListener('brandshoots_services_updated', handleLocalServicesUpdate);
        window.removeEventListener('brandshoots_announcements_updated', handleLocalAnnouncementsUpdate);
        window.removeEventListener('brandshoots_clients_updated', handleLocalClientsUpdate);
        window.removeEventListener('brandshoots_testimonials_updated', handleLocalTestimonialsUpdate);
        window.removeEventListener('brandshoots_projects_updated', handleLocalProjectsUpdate);
        window.removeEventListener('brandshoots_contact_updated', handleLocalContactUpdate);
        window.removeEventListener('brandshoots_site_settings_updated', handleLocalSettingsUpdate);
        window.removeEventListener('storage', handleStorageUpdate);
      };
    } catch (error) {
      console.warn('Firebase RTDB listener setup failed; using static content:', error);
      applyStaticFallback();
    }
  }, []);

  return {
    projects,
    clients,
    hero,
    heroReels,
    heroReelsLoading,
    heroReelsError,
    services,
    testimonials,
    leadership,
    settings,
    announcements,
    contact,
    isLive,
  };
}
