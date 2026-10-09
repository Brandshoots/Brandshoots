import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { firebaseDb } from '../firebase';
import {
  CMSProject,
  CMSClientLogo,
  CMSHero,
  CMSService,
  CMSTestimonial,
  CMSSiteSettings,
  CMSLeadership,
} from '../../types/cms';
import { CLIENT_PROJECTS, ALL_CLIENT_LOGOS } from '../../data/clientsData';
import {
  INITIAL_HERO,
  INITIAL_SERVICES,
  INITIAL_TESTIMONIALS,
  INITIAL_LEADERSHIP,
  INITIAL_SITE_SETTINGS,
} from './seedData';

// Fallback initial data structures
const fallbackProjects: CMSProject[] = CLIENT_PROJECTS.map((p, idx) => ({
  ...p,
  order: idx,
  visible: true,
}));

const fallbackClients: CMSClientLogo[] = ALL_CLIENT_LOGOS.map((c, idx) => ({
  ...c,
  order: idx,
  visible: true,
}));

const fallbackServices: CMSService[] = Object.values(INITIAL_SERVICES);
const fallbackTestimonials: CMSTestimonial[] = Object.values(INITIAL_TESTIMONIALS);

export function useCMSContent() {
  const [projects, setProjects] = useState<CMSProject[]>(fallbackProjects);
  const [clients, setClients] = useState<CMSClientLogo[]>(fallbackClients);
  const [hero, setHero] = useState<CMSHero>(INITIAL_HERO);
  const [services, setServices] = useState<CMSService[]>(fallbackServices);
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>(fallbackTestimonials);
  const [leadership, setLeadership] = useState<CMSLeadership>(INITIAL_LEADERSHIP);
  const [settings, setSettings] = useState<CMSSiteSettings>(INITIAL_SITE_SETTINGS);
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
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
              if (visibleSorted.length > 0) {
                setProjects(visibleSorted);
              }
            }

            // Clients
            if (data.clients) {
              const clientList: CMSClientLogo[] = Object.values(data.clients);
              const visibleSorted = clientList
                .filter((c) => c.visible !== false)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
              if (visibleSorted.length > 0) {
                setClients(visibleSorted);
              }
            }

            // Hero
            if (data.hero) {
              setHero((prev) => ({ ...prev, ...data.hero }));
            }

            // Services
            if (data.services) {
              const sList: CMSService[] = Object.values(data.services);
              const visibleSorted = sList
                .filter((s) => s.visible !== false)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
              if (visibleSorted.length > 0) {
                setServices(visibleSorted);
              }
            }

            // Testimonials
            if (data.testimonials) {
              const tList: CMSTestimonial[] = Object.values(data.testimonials);
              const visibleSorted = tList
                .filter((t) => t.visible !== false)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
              if (visibleSorted.length > 0) {
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

            setIsLive(true);
          }
        },
        (error) => {
          console.warn('Firebase RTDB listener note (falling back to static content):', error.message);
          setIsLive(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase offline, using static defaults:', err);
    }
  }, []);

  return {
    projects,
    clients,
    hero,
    services,
    testimonials,
    leadership,
    settings,
    isLive,
  };
}
