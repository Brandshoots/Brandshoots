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
import { CLIENT_PROJECTS, ALL_CLIENT_LOGOS } from '../../data/clientsData';
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

// Fallback initial data structures
const fallbackProjects: CMSProject[] = CLIENT_PROJECTS.map((p, idx) => ({
  ...p,
  order: idx,
  visible: true,
}));

export function sanitizeProjectList(list: CMSProject[]): CMSProject[] {
  if (
    !list ||
    list.length < 12 ||
    list.some((p) => p.id === 'fresh-and-fresh' || p.id === 'rk-home-living' || p.id === 'dayanidhi-creations')
  ) {
    return fallbackProjects;
  }
  return list.map((proj) => {
    const canonical = CLIENT_PROJECTS.find((cp) => cp.id === proj.id || cp.slug === proj.slug);
    if (!canonical) return proj;
    return {
      ...canonical,
      ...proj,
      name: canonical.name,
      videoUrl: canonical.videoUrl,
      posterUrl: canonical.posterUrl,
      logoUrl: canonical.logoUrl || proj.logoUrl,
      headline: canonical.headline,
      metrics: canonical.metrics,
      reels: canonical.reels,
      visible: proj.visible !== false,
      order: typeof proj.order === 'number' ? proj.order : (canonical as any).order ?? 0,
    };
  });
}

const fallbackClients: CMSClientLogo[] = Object.values(INITIAL_CLIENTS);

export function sanitizeClientList(list: CMSClientLogo[]): CMSClientLogo[] {
  if (!list || !Array.isArray(list)) return fallbackClients;
  return list.map((item) => {
    const canonical = ALL_CLIENT_LOGOS.find(
      (c) => c.id === item.id || c.name.toLowerCase().trim() === item.name.toLowerCase().trim()
    );
    const init = INITIAL_CLIENTS[item.id];
    return {
      ...item,
      logoUrl: canonical?.logoUrl || item.logoUrl,
      views: item.views !== undefined ? item.views : init?.views,
      likes: item.likes !== undefined ? item.likes : init?.likes,
    };
  });
}

const fallbackServices: CMSService[] = Object.values(INITIAL_SERVICES).sort(
  (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
);

export function sanitizeServicesList(list: CMSService[]): CMSService[] {
  if (!list || !Array.isArray(list) || list.length !== 3) return fallbackServices;
  const hasLegacy = list.some(
    (s) => s.id === 'video-production' || s.id === 'brand-creative' || s.id === 'motion-graphics'
  );
  if (hasLegacy) return fallbackServices;
  return list;
}

const fallbackTestimonials: CMSTestimonial[] = Object.values(INITIAL_TESTIMONIALS);
const fallbackAnnouncements: CMSAnnouncement[] = Object.values(INITIAL_ANNOUNCEMENTS);

export function useCMSContent() {
  const [projects, setProjects] = useState<CMSProject[]>(() => {
    try {
      localStorage.removeItem('brandshoots_projects');
      localStorage.removeItem('brandshoots_projects_v2026');
    } catch {}
    return fallbackProjects;
  });
  const [clients, setClients] = useState<CMSClientLogo[]>(() => {
    try {
      const cached = localStorage.getItem('brandshoots_clients');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sanitizeClientList(parsed);
        }
      }
    } catch {}
    return fallbackClients;
  });
  const [hero, setHero] = useState<CMSHero>(INITIAL_HERO);
  const [heroReels, setHeroReels] = useState<CMSHeroReel[]>(() => {
    try {
      const cached = localStorage.getItem('brandshoots_hero_reels');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_HERO_REELS;
  });
  const [services, setServices] = useState<CMSService[]>(() => {
    try {
      const cached = localStorage.getItem('brandshoots_services');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return sanitizeServicesList(parsed);
      }
    } catch {}
    return fallbackServices;
  });
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>(() => {
    try {
      const cached = localStorage.getItem('brandshoots_testimonials');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return fallbackTestimonials;
  });
  const [leadership, setLeadership] = useState<CMSLeadership>(INITIAL_LEADERSHIP);
  const [settings, setSettings] = useState<CMSSiteSettings>(INITIAL_SITE_SETTINGS);
  const [announcements, setAnnouncements] = useState<CMSAnnouncement[]>(() => {
    try {
      const cached = localStorage.getItem('brandshoots_announcements');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return fallbackAnnouncements;
  });
  const [contact, setContact] = useState<CMSContactPage>(() => {
    try {
      const cached = localStorage.getItem('brandshoots_contact');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') return { ...INITIAL_CONTACT_PAGE, ...parsed };
      }
    } catch {}
    return INITIAL_CONTACT_PAGE;
  });
  const [isLive, setIsLive] = useState<boolean>(false);

  useEffect(() => {
    try {
      const publishedRef = ref(firebaseDb, 'published');
      const unsubscribe = onValue(
        publishedRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();

            // Projects
            if (data.projects) {
              const projList: CMSProject[] = Object.values(data.projects);
              const visibleSorted = projList
                .filter((p) => p.visible !== false)
                .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
              if (visibleSorted.length > 0) {
                const cleanRemote = sanitizeProjectList(visibleSorted);
                try {
                  const cached = localStorage.getItem('brandshoots_projects_v2026');
                  if (cached) {
                    const parsed = JSON.parse(cached);
                    if (Array.isArray(parsed) && parsed.length >= 12) {
                      const cleanLocal = sanitizeProjectList(parsed);
                      const localMax = Math.max(...cleanLocal.map((x: any) => x.updatedAt || 0));
                      const remoteMax = Math.max(...cleanRemote.map((x: any) => x.updatedAt || 0));
                      if (localMax > remoteMax) {
                        setProjects(cleanLocal.filter((p: any) => p.visible !== false));
                        return;
                      }
                    }
                  }
                  localStorage.setItem('brandshoots_projects_v2026', JSON.stringify(cleanRemote));
                } catch {}
                setProjects(cleanRemote);
              }
            }

            // Clients
            if (data.clients) {
              const clientList: CMSClientLogo[] = Object.values(data.clients);
              const visibleSorted = clientList
                .filter((c) => c.visible !== false)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
              if (visibleSorted.length > 0) {
                try {
                  const cached = localStorage.getItem('brandshoots_clients');
                  if (cached) {
                    const parsed = JSON.parse(cached);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                      const localMax = Math.max(...parsed.map((x: any) => x.updatedAt || 0));
                      const remoteMax = Math.max(...visibleSorted.map((x: any) => x.updatedAt || 0));
                      if (localMax > remoteMax) {
                        setClients(sanitizeClientList(parsed.filter((c: any) => c.visible !== false)));
                        return;
                      }
                    }
                  }
                } catch {}

                const enriched = visibleSorted.map((item) => {
                  const init = INITIAL_CLIENTS[item.id];
                  return {
                    ...item,
                    views: item.views !== undefined ? item.views : init?.views,
                    likes: item.likes !== undefined ? item.likes : init?.likes,
                  };
                });
                setClients(sanitizeClientList(enriched));
              }
            }

            // Hero
            if (data.hero) {
              setHero((prev) => ({ ...prev, ...data.hero }));
            }

            // Hero 3D Reels (CMS 1.2)
            if (data.heroReels || data.hero?.reels) {
              const rList: CMSHeroReel[] = Array.isArray(data.heroReels || data.hero?.reels)
                ? (data.heroReels || data.hero?.reels)
                : Object.values(data.heroReels || data.hero?.reels || {});
              const activeSorted = rList.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
              if (activeSorted.length > 0) {
                setHeroReels(activeSorted);
              }
            }

            // Services (3 Core Pillars)
            if (data.services) {
              const sList: CMSService[] = Object.values(data.services);
              const visibleSorted = sList
                .filter((s) => s.visible !== false)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
              if (visibleSorted.length > 0) {
                setServices(sanitizeServicesList(visibleSorted));
              }
            }

            // Testimonials
            if (data.testimonials) {
              const tList: CMSTestimonial[] = Object.values(data.testimonials);
              const visibleSorted = tList
                .filter((t) => t.visible !== false)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
              if (visibleSorted.length > 0) {
                try {
                  const cached = localStorage.getItem('brandshoots_testimonials');
                  if (cached) {
                    const parsed = JSON.parse(cached);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                      const localMax = Math.max(...parsed.map((x: any) => x.updatedAt || 0));
                      const remoteMax = Math.max(...visibleSorted.map((x: any) => x.updatedAt || 0));
                      if (localMax > remoteMax) {
                        setTestimonials(parsed.filter((t: any) => t.visible !== false));
                        return;
                      }
                    }
                  }
                } catch {}
                setTestimonials(visibleSorted);
              }
            }

            // Leadership
            if (data.leadership) {
              setLeadership((prev) => ({ ...prev, ...data.leadership }));
            }

            // Site Settings
            if (data.siteSettings) {
              setSettings((prev) => ({ ...prev, ...data.siteSettings }));
            }

            // Announcements & Updates
            if (data.announcements !== undefined) {
              const aList: CMSAnnouncement[] = Object.values(data.announcements || {});
              const activeSorted = aList
                .filter((a) => a && a.isActive !== false)
                .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
              setAnnouncements(activeSorted);
            } else {
              setAnnouncements(fallbackAnnouncements);
            }

            // Contact Page (CMS 1.8)
            if (data.contact) {
              const mergedContact = { ...INITIAL_CONTACT_PAGE, ...data.contact };
              setContact(mergedContact);
              try {
                localStorage.setItem('brandshoots_contact', JSON.stringify(mergedContact));
              } catch {}
            }

            setIsLive(true);
          }
        },
        (error) => {
          console.warn('Firebase RTDB listener note (falling back to static content):', error.message);
          setIsLive(false);
        }
      );

      // Local custom event listener for immediate zero-latency tab updates
      const handleLocalReelsUpdate = (e: Event) => {
        const customEvent = e as CustomEvent<CMSHeroReel[]>;
        if (customEvent.detail && Array.isArray(customEvent.detail)) {
          setHeroReels(customEvent.detail);
        }
      };

      // Services local update listener
      const handleLocalServicesUpdate = (e: Event) => {
        const customEvent = e as CustomEvent<CMSService[]>;
        if (customEvent.detail && Array.isArray(customEvent.detail)) {
          setServices(customEvent.detail);
        }
      };

      // Announcements local update listener
      const handleLocalAnnouncementsUpdate = (e: Event) => {
        const customEvent = e as CustomEvent<CMSAnnouncement[]>;
        if (customEvent.detail && Array.isArray(customEvent.detail)) {
          setAnnouncements(customEvent.detail);
        }
      };

      // Clients local update listener
      const handleLocalClientsUpdate = (e: Event) => {
        const customEvent = e as CustomEvent<CMSClientLogo[]>;
        if (customEvent.detail && Array.isArray(customEvent.detail)) {
          setClients(sanitizeClientList(customEvent.detail.filter((c) => c.visible !== false)));
        }
      };

      // Testimonials local update listener (CMS 1.5)
      const handleLocalTestimonialsUpdate = (e: Event) => {
        const customEvent = e as CustomEvent<CMSTestimonial[]>;
        if (customEvent.detail && Array.isArray(customEvent.detail)) {
          setTestimonials(customEvent.detail);
        }
      };

      // Projects local update listener (CMS 1.7)
      const handleLocalProjectsUpdate = (e: Event) => {
        const customEvent = e as CustomEvent<CMSProject[]>;
        if (customEvent.detail && Array.isArray(customEvent.detail)) {
          setProjects(customEvent.detail.filter((p) => p.visible !== false));
        }
      };

      // Contact local update listener (CMS 1.8)
      const handleLocalContactUpdate = (e: Event) => {
        const customEvent = e as CustomEvent<CMSContactPage>;
        if (customEvent.detail && typeof customEvent.detail === 'object') {
          setContact(customEvent.detail);
        }
      };

      // Cross-tab storage listener so live site updates immediately when admin edits in another tab
      const handleStorageUpdate = (e: StorageEvent) => {
        if (e.key === 'brandshoots_projects' && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setProjects(parsed.filter((p: any) => p.visible !== false));
            }
          } catch {}
        }
        if (e.key === 'brandshoots_contact' && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (parsed && typeof parsed === 'object') {
              setContact({ ...INITIAL_CONTACT_PAGE, ...parsed });
            }
          } catch {}
        }
        if (e.key === 'brandshoots_hero_reels' && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setHeroReels(parsed);
            }
          } catch {}
        }
        if (e.key === 'brandshoots_services' && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setServices(parsed);
            }
          } catch {}
        }
        if (e.key === 'brandshoots_announcements' && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setAnnouncements(parsed);
            }
          } catch {}
        }
        if (e.key === 'brandshoots_clients' && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setClients(sanitizeClientList(parsed.filter((c: any) => c.visible !== false)));
            }
          } catch {}
        }
        if (e.key === 'brandshoots_testimonials' && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setTestimonials(parsed);
            }
          } catch {}
        }
      };

      window.addEventListener('brandshoots_hero_reels_updated', handleLocalReelsUpdate);
      window.addEventListener('brandshoots_services_updated', handleLocalServicesUpdate);
      window.addEventListener('brandshoots_announcements_updated', handleLocalAnnouncementsUpdate);
      window.addEventListener('brandshoots_clients_updated', handleLocalClientsUpdate);
      window.addEventListener('brandshoots_testimonials_updated', handleLocalTestimonialsUpdate);
      window.addEventListener('brandshoots_projects_updated', handleLocalProjectsUpdate);
      window.addEventListener('brandshoots_contact_updated', handleLocalContactUpdate);
      window.addEventListener('storage', handleStorageUpdate);

      return () => {
        unsubscribe();
        window.removeEventListener('brandshoots_hero_reels_updated', handleLocalReelsUpdate);
        window.removeEventListener('brandshoots_services_updated', handleLocalServicesUpdate);
        window.removeEventListener('brandshoots_announcements_updated', handleLocalAnnouncementsUpdate);
        window.removeEventListener('brandshoots_clients_updated', handleLocalClientsUpdate);
        window.removeEventListener('brandshoots_testimonials_updated', handleLocalTestimonialsUpdate);
        window.removeEventListener('brandshoots_projects_updated', handleLocalProjectsUpdate);
        window.removeEventListener('brandshoots_contact_updated', handleLocalContactUpdate);
        window.removeEventListener('storage', handleStorageUpdate);
      };
    } catch (err) {
      console.warn('Firebase offline, using static defaults:', err);
    }
  }, []);

  return {
    projects,
    clients,
    hero,
    heroReels,
    services,
    testimonials,
    leadership,
    settings,
    announcements,
    contact,
    isLive,
  };
}
