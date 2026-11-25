import { ref, get, set, update, remove, push, onValue } from 'firebase/database';
import { firebaseDb } from '../firebase';
import {
  CMSProject,
  CMSClientLogo,
  CMSHero,
  CMSHeroReel,
  CMSService,
  CMSTestimonial,
  CMSLeadership,
  CMSSiteSettings,
  CMSLead,
  CMSAnnouncement,
  CMSContactPage,
  CMSResult,
} from '../../types/cms';
import {
  INITIAL_PROJECTS,
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
import { parseResultVideoUrl } from '../results/video';

function cacheLocally<T>(storageKey: string, value: T): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Firebase is authoritative; local caching is best-effort only.
  }
}

function cacheAndDispatch<T>(storageKey: string, eventName: string, value: T): void {
  cacheLocally(storageKey, value);
  try {
    window.dispatchEvent(new CustomEvent(eventName, { detail: value }));
  } catch {
    // Firebase has already committed; browser notifications are best-effort only.
  }
}

// ----------------------------------------------------
// SEEDING DATABASE
// ----------------------------------------------------
export async function seedDatabase(forceOverwrite = false): Promise<{ success: boolean; message: string }> {
  try {
    const publishedRef = ref(firebaseDb, 'published');
    const snapshot = await get(publishedRef);
    
    if (snapshot.exists() && !forceOverwrite) {
      return { success: true, message: 'Database is already populated. (Use Force to overwrite)' };
    }

    const payload = {
      projects: INITIAL_PROJECTS,
      clients: INITIAL_CLIENTS,
      hero: INITIAL_HERO,
      heroReels: INITIAL_HERO_REELS,
      services: INITIAL_SERVICES,
      testimonials: INITIAL_TESTIMONIALS,
      leadership: INITIAL_LEADERSHIP,
      siteSettings: INITIAL_SITE_SETTINGS,
      announcements: INITIAL_ANNOUNCEMENTS,
      contact: INITIAL_CONTACT_PAGE,
    };

    // Seed only the known default branches. Never replace the complete `published`
    // node, because that would erase independently managed collections such as Results.
    const updates = Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [`published/${key}`, value])
    );
    await update(ref(firebaseDb), updates);
    return { success: true, message: 'Default production data successfully seeded to Firebase!' };
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return { success: false, message: error?.message || 'Failed to seed database' };
  }
}

// ----------------------------------------------------
// PROJECTS CRUD (CMS 1.7)
// ----------------------------------------------------
export async function fetchPublishedProjects(): Promise<CMSProject[]> {
  try {
    const snapshot = await get(ref(firebaseDb, 'published/projects'));
    const value = snapshot.exists() ? snapshot.val() : [];
    const list: CMSProject[] = Array.isArray(value) ? value.filter(Boolean) : Object.values(value);
    const sorted = list.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    return sorted;
  } catch (err) {
    console.warn('Firebase RTDB read note for projects:', err);
  }

  try {
    const cached = localStorage.getItem('brandshoots_projects');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        return parsed.sort(
          (a: CMSProject, b: CMSProject) => (Number(a.order) || 0) - (Number(b.order) || 0)
        );
      }
    }
  } catch {}

  const initialList = Object.values(INITIAL_PROJECTS).sort(
    (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
  );
  return initialList;
}

export async function saveAllProjects(projects: CMSProject[]): Promise<void> {
  const normalized = projects.map((p, idx) => ({
    ...p,
    order: idx,
    updatedAt: Date.now(),
  }));
  const record: Record<string, CMSProject> = {};
  normalized.forEach((p) => {
    record[p.id] = p;
  });

  await set(ref(firebaseDb, 'published/projects'), record);
  cacheAndDispatch('brandshoots_projects', 'brandshoots_projects_updated', normalized);
}

export async function saveProject(project: CMSProject): Promise<void> {
  const current = await fetchPublishedProjects();
  const cleanId = project.id || (project.slug || project.name).toLowerCase().replace(/[^a-zA-Z0-9-_]/g, '-');
  const index = current.findIndex((p) => p.id === cleanId);
  const updatedProject: CMSProject = {
    ...project,
    id: cleanId,
    updatedAt: Date.now(),
  };

  let updatedList: CMSProject[];
  if (index >= 0) {
    updatedList = [...current];
    updatedList[index] = updatedProject;
  } else {
    updatedList = [...current, updatedProject];
  }
  await saveAllProjects(updatedList);
}

export async function deleteProject(projectId: string): Promise<void> {
  const current = await fetchPublishedProjects();
  const updated = current.filter((p) => p.id !== projectId);
  await saveAllProjects(updated);
}

export async function resetProjectsToDefaults(): Promise<CMSProject[]> {
  const defaults = Object.values(INITIAL_PROJECTS).sort(
    (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
  );
  await saveAllProjects(defaults);
  return defaults;
}

export async function updateProjectsOrder(orderedIds: string[]): Promise<void> {
  const current = await fetchPublishedProjects();
  const map = new Map(current.map((p) => [p.id, p]));
  const reordered: CMSProject[] = [];
  orderedIds.forEach((id) => {
    const item = map.get(id);
    if (item) {
      reordered.push(item);
      map.delete(id);
    }
  });
  // append any remaining
  map.forEach((item) => reordered.push(item));
  await saveAllProjects(reordered);
}

// ----------------------------------------------------
// CLIENTELE LOGOS CRUD (CMS 1.3)
// ----------------------------------------------------
export async function fetchPublishedClients(): Promise<CMSClientLogo[]> {
  const enrichAndSort = (list: CMSClientLogo[]): CMSClientLogo[] => list.map((item) => {
    const initial = INITIAL_CLIENTS[item.id];
    return {
      ...item,
      views: item.views !== undefined ? item.views : initial?.views,
      likes: item.likes !== undefined ? item.likes : initial?.likes,
    };
  }).sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  try {
    const snapshot = await get(ref(firebaseDb, 'published/clients'));
    const value = snapshot.exists() ? snapshot.val() : [];
    const list: CMSClientLogo[] = Array.isArray(value) ? value.filter(Boolean) : Object.values(value);
    const sorted = enrichAndSort(list);
    return sorted;
  } catch (err) {
    console.warn('Firebase RTDB read note for clients:', err);
  }

  try {
    const cached = localStorage.getItem('brandshoots_clients');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) return enrichAndSort(parsed);
    }
  } catch {}

  const initialList = Object.values(INITIAL_CLIENTS).sort(
    (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
  );
  return initialList;
}

export async function saveAllClients(clients: CMSClientLogo[]): Promise<void> {
  const normalized = clients.map((c, idx) => ({
    ...c,
    order: idx,
    updatedAt: Date.now(),
  }));
  const record: Record<string, CMSClientLogo> = {};
  normalized.forEach((c) => {
    record[c.id] = c;
  });

  await set(ref(firebaseDb, 'published/clients'), record);
  cacheAndDispatch('brandshoots_clients', 'brandshoots_clients_updated', normalized);
}

export async function saveClient(client: CMSClientLogo): Promise<void> {
  const current = await fetchPublishedClients();
  const cleanId = client.id || client.name.toLowerCase().replace(/[^a-zA-Z0-9-_]/g, '-');
  const index = current.findIndex((c) => c.id === cleanId);
  const updatedClient: CMSClientLogo = {
    ...client,
    id: cleanId,
    updatedAt: Date.now(),
  };

  let updatedList: CMSClientLogo[];
  if (index >= 0) {
    updatedList = [...current];
    updatedList[index] = updatedClient;
  } else {
    updatedList = [...current, updatedClient];
  }
  await saveAllClients(updatedList);
}

export async function deleteClient(clientId: string): Promise<void> {
  const current = await fetchPublishedClients();
  const updated = current.filter((c) => c.id !== clientId);
  await saveAllClients(updated);
}

export async function resetClientsToDefaults(): Promise<CMSClientLogo[]> {
  const defaults = Object.values(INITIAL_CLIENTS).sort(
    (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
  );
  await saveAllClients(defaults);
  return defaults;
}

// ----------------------------------------------------
// HERO CRUD
// ----------------------------------------------------
export async function fetchPublishedHero(): Promise<CMSHero | null> {
  try {
    const snapshot = await get(ref(firebaseDb, 'published/hero'));
    if (snapshot.exists()) {
      const hero: CMSHero = { ...snapshot.val() };
      delete hero.reels;
      cacheLocally('brandshoots_hero', hero);
      return hero;
    }
  } catch (err) {
    console.warn('Firebase fetchPublishedHero offline, checking cache:', err);
  }
  try {
    const cached = localStorage.getItem('brandshoots_hero');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed === 'object') {
        const hero: CMSHero = { ...INITIAL_HERO, ...parsed };
        delete hero.reels;
        return hero;
      }
    }
  } catch {}
  return INITIAL_HERO;
}

export async function saveHero(hero: CMSHero): Promise<void> {
  const metadata: CMSHero = { ...hero };
  delete metadata.reels;
  const updated: CMSHero = {
    ...metadata,
    updatedAt: Date.now(),
  };

  await update(ref(firebaseDb, 'published/hero'), updated);
  cacheAndDispatch('brandshoots_hero', 'brandshoots_hero_updated', updated);
}

// ----------------------------------------------------
// HERO 3D REELS CRUD
// ----------------------------------------------------
export async function fetchPublishedHeroReels(): Promise<CMSHeroReel[]> {
  try {
    const snapshot = await get(ref(firebaseDb, 'published/heroReels'));
    const value = snapshot.exists() ? snapshot.val() : [];
    const list: CMSHeroReel[] = Array.isArray(value) ? value.filter(Boolean) : Object.values(value);
    const hasModernOrUploadedReel = list.some(
      (reel) =>
        typeof reel.src === 'string' &&
        (reel.src.startsWith('/reels/hero-final/') || reel.src.startsWith('https://'))
    );
    if (list.length > 0 && !hasModernOrUploadedReel) {
      return INITIAL_HERO_REELS;
    }
    const sorted = list
      .filter((reel) => typeof reel.src === 'string' && !reel.src.startsWith('blob:'))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return sorted.length > 0 ? sorted : INITIAL_HERO_REELS;
  } catch (err) {
    console.warn('Firebase RTDB read note for hero reels, checking local cache:', err);
  }

  try {
    const cached = localStorage.getItem('brandshoots_hero_reels');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        return parsed.sort((a: CMSHeroReel, b: CMSHeroReel) => (a.order ?? 0) - (b.order ?? 0));
      }
    }
  } catch {
    // ignore
  }

  return INITIAL_HERO_REELS;
}

export async function saveHeroReels(reels: CMSHeroReel[]): Promise<void> {
  const normalized = reels.map((r, idx) => ({
    ...r,
    order: idx,
    updatedAt: Date.now(),
  }));

  await update(ref(firebaseDb), {
    'published/heroReels': normalized,
    'published/hero/reels': normalized,
  });
  cacheAndDispatch('brandshoots_hero_reels', 'brandshoots_hero_reels_updated', normalized);
}

export async function deleteHeroReel(reelId: string): Promise<void> {
  const current = await fetchPublishedHeroReels();
  const updated = current.filter((r) => r.id !== reelId);
  await saveHeroReels(updated);
}

export async function resetHeroReelsToDefaults(): Promise<CMSHeroReel[]> {
  await saveHeroReels(INITIAL_HERO_REELS);
  return INITIAL_HERO_REELS;
}

// ----------------------------------------------------
// SERVICES CRUD (CMS 1.4 - 3 Core Pillars)
// ----------------------------------------------------
export function sanitizeServicesList(list: CMSService[]): CMSService[] {
  if (!Array.isArray(list)) {
    return Object.values(INITIAL_SERVICES).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }
  return list;
}

export async function fetchPublishedServices(): Promise<CMSService[]> {
  const sortServices = (list: CMSService[]): CMSService[] =>
    [...sanitizeServicesList(list)].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  try {
    const snapshot = await get(ref(firebaseDb, 'published/services'));
    const value = snapshot.exists() ? snapshot.val() : [];
    const list: CMSService[] = Array.isArray(value) ? value.filter(Boolean) : Object.values(value);
    const sorted = sortServices(list);
    return sorted;
  } catch (err) {
    console.warn('Firebase RTDB read note for services:', err);
  }

  try {
    const cached = localStorage.getItem('brandshoots_services');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) return sortServices(parsed);
    }
  } catch {}

  const defaults = Object.values(INITIAL_SERVICES).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return defaults;
}

export async function saveAllServices(services: CMSService[]): Promise<void> {
  const normalized = services.map((s, idx) => ({
    ...s,
    order: idx,
    updatedAt: Date.now(),
  }));
  const record: Record<string, CMSService> = {};
  normalized.forEach((s) => {
    record[s.id] = s;
  });

  await set(ref(firebaseDb, 'published/services'), record);
  cacheAndDispatch('brandshoots_services', 'brandshoots_services_updated', normalized);
}

export async function saveService(service: CMSService): Promise<void> {
  const current = await fetchPublishedServices();
  const index = current.findIndex((s) => s.id === service.id);
  let updated: CMSService[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = service;
  } else {
    updated = [...current, service];
  }
  await saveAllServices(updated);
}

export async function deleteService(serviceId: string): Promise<void> {
  const current = await fetchPublishedServices();
  const updated = current.filter((s) => s.id !== serviceId);
  await saveAllServices(updated);
}

export async function resetServicesToDefaults(): Promise<CMSService[]> {
  const defaults = Object.values(INITIAL_SERVICES).sort(
    (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
  );
  await saveAllServices(defaults);
  return defaults;
}

// ----------------------------------------------------
// TESTIMONIALS CRUD (CMS 1.5)
// ----------------------------------------------------
export async function fetchPublishedTestimonials(): Promise<CMSTestimonial[]> {
  try {
    const snapshot = await get(ref(firebaseDb, 'published/testimonials'));
    const value = snapshot.exists() ? snapshot.val() : [];
    const list: CMSTestimonial[] = Array.isArray(value) ? value.filter(Boolean) : Object.values(value);
    const sorted = list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return sorted;
  } catch (err) {
    console.warn('Firebase RTDB read note for testimonials:', err);
  }

  try {
    const cached = localStorage.getItem('brandshoots_testimonials');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        return parsed.sort((a: CMSTestimonial, b: CMSTestimonial) => (a.order ?? 0) - (b.order ?? 0));
      }
    }
  } catch {}

  const initialList = Object.values(INITIAL_TESTIMONIALS).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return initialList;
}

export async function saveAllTestimonials(testimonials: CMSTestimonial[]): Promise<void> {
  const normalized = testimonials.map((t, idx) => ({
    ...t,
    order: idx,
    updatedAt: Date.now(),
  }));
  const record: Record<string, CMSTestimonial> = {};
  normalized.forEach((t) => {
    record[t.id] = t;
  });

  await set(ref(firebaseDb, 'published/testimonials'), record);
  cacheAndDispatch('brandshoots_testimonials', 'brandshoots_testimonials_updated', normalized);
}

export async function saveTestimonial(testimonial: CMSTestimonial): Promise<void> {
  const current = await fetchPublishedTestimonials();
  const index = current.findIndex((t) => t.id === testimonial.id);
  let updated: CMSTestimonial[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = testimonial;
  } else {
    updated = [...current, testimonial];
  }
  await saveAllTestimonials(updated);
}

export async function deleteTestimonial(testimonialId: string): Promise<void> {
  const current = await fetchPublishedTestimonials();
  const updated = current.filter((t) => t.id !== testimonialId);
  await saveAllTestimonials(updated);
}

export async function resetTestimonialsToDefaults(): Promise<CMSTestimonial[]> {
  const initialList = Object.values(INITIAL_TESTIMONIALS).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  await saveAllTestimonials(initialList);
  return initialList;
}

const normalizeEmail = (email?: string): string => {
  if (!email || email.trim().toLowerCase() === 'contact@brandshoots.com') {
    return 'brandshoots.in@gmail.com';
  }
  return email.trim();
};

const normalizePrice = (price?: string): string => {
  if (!price || price.includes('999')) {
    return '₹2,000';
  }
  return price.trim();
};

// ----------------------------------------------------
// SITE SETTINGS CRUD
// ----------------------------------------------------
export async function fetchSiteSettings(): Promise<CMSSiteSettings | null> {
  const snapshot = await get(ref(firebaseDb, 'published/siteSettings'));
  if (snapshot.exists()) {
    const val = snapshot.val();
    if (val && typeof val === 'object') {
      return {
        ...INITIAL_SITE_SETTINGS,
        ...val,
        contactEmail: normalizeEmail(val.contactEmail),
      };
    }
  }
  return null;
}

export async function saveSiteSettings(settings: CMSSiteSettings): Promise<void> {
  const updated = {
    ...settings,
    updatedAt: Date.now(),
  };
  await set(ref(firebaseDb, 'published/siteSettings'), updated);
  cacheAndDispatch('brandshoots_site_settings', 'brandshoots_site_settings_updated', updated);
}

export async function saveGlobalSettings(
  settings: CMSSiteSettings,
  contact: CMSContactPage
): Promise<void> {
  const timestamp = Date.now();
  const updatedSettings: CMSSiteSettings = { ...settings, updatedAt: timestamp };
  const updatedContact: CMSContactPage = { ...contact, updatedAt: timestamp };

  await update(ref(firebaseDb), {
    'published/siteSettings': updatedSettings,
    'published/contact': updatedContact,
  });
  cacheAndDispatch(
    'brandshoots_site_settings',
    'brandshoots_site_settings_updated',
    updatedSettings
  );
  cacheAndDispatch('brandshoots_contact', 'brandshoots_contact_updated', updatedContact);
}

// ----------------------------------------------------
// LEADERSHIP & FOUNDER CRUD
// ----------------------------------------------------
export async function fetchPublishedLeadership(): Promise<CMSLeadership | null> {
  const snapshot = await get(ref(firebaseDb, 'published/leadership'));
  return snapshot.exists() ? snapshot.val() : null;
}

export async function saveLeadership(leadership: CMSLeadership): Promise<void> {
  await set(ref(firebaseDb, 'published/leadership'), {
    ...leadership,
    updatedAt: Date.now(),
  });
}

// ----------------------------------------------------
// LEADS / INQUIRIES CRUD
// ----------------------------------------------------
export async function createLead(leadData: Omit<CMSLead, 'id' | 'createdAt'>): Promise<string> {
  const leadsRef = ref(firebaseDb, 'leads');
  const newLeadRef = push(leadsRef);
  const newLead: CMSLead = {
    ...leadData,
    id: newLeadRef.key || Date.now().toString(),
    createdAt: Date.now(),
    status: leadData.status || 'new',
  };
  await set(newLeadRef, newLead);
  return newLead.id;
}

export async function fetchLeads(): Promise<CMSLead[]> {
  const snapshot = await get(ref(firebaseDb, 'leads'));
  if (!snapshot.exists()) return [];
  const list: CMSLead[] = Object.values(snapshot.val());
  return list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

export async function updateLeadStatus(
  leadId: string,
  status: CMSLead['status'],
  notes?: string
): Promise<void> {
  const updates: Record<string, any> = {
    [`leads/${leadId}/status`]: status,
  };
  if (notes !== undefined) {
    updates[`leads/${leadId}/notes`] = notes;
  }
  await update(ref(firebaseDb), updates);
}

export async function deleteLead(leadId: string): Promise<void> {
  await remove(ref(firebaseDb, `leads/${leadId}`));
}

// ----------------------------------------------------
// ANNOUNCEMENTS & UPDATES CRUD (CMS 1.3)
// ----------------------------------------------------
export async function getAnnouncements(): Promise<CMSAnnouncement[]> {
  const all = await fetchPublishedAnnouncements();
  return all.filter((a) => a && a.isActive !== false);
}

export async function fetchPublishedAnnouncements(): Promise<CMSAnnouncement[]> {
  try {
    const snapshot = await get(ref(firebaseDb, 'published/announcements'));
    const value = snapshot.exists() ? snapshot.val() : [];
    const list: CMSAnnouncement[] = Array.isArray(value) ? value.filter(Boolean) : Object.values(value);
    const sorted = list.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    return sorted;
  } catch (err) {
    console.warn('Firebase RTDB read note for announcements:', err);
  }

  try {
    const cached = localStorage.getItem('brandshoots_announcements');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        return parsed.sort(
          (a: CMSAnnouncement, b: CMSAnnouncement) => (Number(a.order) || 0) - (Number(b.order) || 0)
        );
      }
    }
  } catch {}

  const initialList = Object.values(INITIAL_ANNOUNCEMENTS).sort(
    (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
  );
  return initialList;
}

export async function saveAllAnnouncements(announcements: CMSAnnouncement[]): Promise<void> {
  const normalized = announcements.map((a, idx) => ({
    ...a,
    order: idx,
    updatedAt: new Date().toISOString(),
  }));
  const record: Record<string, CMSAnnouncement> = {};
  normalized.forEach((a) => {
    record[a.id] = a;
  });

  await set(ref(firebaseDb, 'published/announcements'), record);
  cacheAndDispatch('brandshoots_announcements', 'brandshoots_announcements_updated', normalized);
}

export async function saveAnnouncement(announcement: CMSAnnouncement): Promise<void> {
  const current = await fetchPublishedAnnouncements();
  const index = current.findIndex((a) => a.id === announcement.id);
  let updated: CMSAnnouncement[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = announcement;
  } else {
    updated = [...current, announcement];
  }
  await saveAllAnnouncements(updated);
}

export async function deleteAnnouncement(announcementId: string): Promise<void> {
  const current = await fetchPublishedAnnouncements();
  const updated = current.filter((a) => a.id !== announcementId);
  await saveAllAnnouncements(updated);
}

export async function resetAnnouncementsToDefaults(): Promise<CMSAnnouncement[]> {
  const defaults = Object.values(INITIAL_ANNOUNCEMENTS).sort(
    (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
  );
  await saveAllAnnouncements(defaults);
  return defaults;
}

export async function updateAnnouncementsOrder(orderedIds: string[]): Promise<void> {
  const current = await fetchPublishedAnnouncements();
  const map = new Map(current.map((a) => [a.id, a]));
  const ordered: CMSAnnouncement[] = [];
  orderedIds.forEach((id) => {
    const found = map.get(id);
    if (found) ordered.push(found);
  });
  current.forEach((a) => {
    if (!orderedIds.includes(a.id)) ordered.push(a);
  });
  await saveAllAnnouncements(ordered);
}

// ----------------------------------------------------
// CONTACT PAGE CRUD (CMS 1.8)
// ----------------------------------------------------
export async function fetchPublishedContactPage(): Promise<CMSContactPage> {
  try {
    const snapshot = await get(ref(firebaseDb, 'published/contact'));
    if (snapshot.exists()) {
      const val = snapshot.val();
      if (val && typeof val === 'object') {
        return {
          ...INITIAL_CONTACT_PAGE,
          ...val,
          email: normalizeEmail(val.email),
          siteVisitPrice: normalizePrice(val.siteVisitPrice),
        };
      }
    }
  } catch (err) {
    console.warn('Firebase RTDB read note for contact page:', err);
  }

  try {
    const cached = localStorage.getItem('brandshoots_contact');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed === 'object') {
        return {
          ...INITIAL_CONTACT_PAGE,
          ...parsed,
          email: normalizeEmail(parsed.email),
          siteVisitPrice: normalizePrice(parsed.siteVisitPrice),
        };
      }
    }
  } catch {}

  try {
    localStorage.setItem('brandshoots_contact', JSON.stringify(INITIAL_CONTACT_PAGE));
  } catch {}
  return INITIAL_CONTACT_PAGE;
}

export async function saveContactPage(contact: CMSContactPage): Promise<void> {
  const normalized: CMSContactPage = {
    ...contact,
    updatedAt: Date.now(),
  };

  await set(ref(firebaseDb, 'published/contact'), normalized);
  cacheAndDispatch('brandshoots_contact', 'brandshoots_contact_updated', normalized);
}

export async function resetContactPageToDefaults(): Promise<CMSContactPage> {
  await saveContactPage(INITIAL_CONTACT_PAGE);
  return INITIAL_CONTACT_PAGE;
}

// ----------------------------------------------------
// CLIENT RESULTS CRUD & PUBLISHING
// ----------------------------------------------------
const RESULTS_DRAFTS_PATH = 'drafts/results';
const RESULTS_PUBLISHED_PATH = 'published/results';
const NON_FEATURED_HOMEPAGE_OFFSET = 1_000_000_000;

function isDurableMediaUrl(value: string): boolean {
  if (typeof value !== 'string') return false;
  const candidate = value.trim();
  if (!candidate || /[\u0000-\u001F\u007F\s\\]/.test(candidate) || /%(?![0-9a-f]{2})/i.test(candidate)) {
    return false;
  }

  if (candidate.startsWith('/')) {
    if (candidate.startsWith('//')) return false;
    try {
      const parsed = new URL(candidate, 'https://brandshoots.local');
      return parsed.origin === 'https://brandshoots.local';
    } catch {
      return false;
    }
  }

  if (!/^https:\/\/[^/]/i.test(candidate)) return false;
  try {
    const parsed = new URL(candidate);
    return parsed.protocol === 'https:' &&
      Boolean(parsed.hostname) &&
      !parsed.username &&
      !parsed.password;
  } catch {
    return false;
  }
}

function isSafeNonNegativeInteger(value: number | null): boolean {
  return value === null || (Number.isSafeInteger(value) && value >= 0);
}

function resultSort(a: CMSResult, b: CMSResult): number {
  return (Number(a.order) || 0) - (Number(b.order) || 0) ||
    (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0) ||
    a.id.localeCompare(b.id);
}

function assertSafeResultId(id: string): void {
  if (!id || /[.#$\[\]/]/.test(id)) {
    throw new Error('The result record has an invalid identifier.');
  }
}

function assertResultCanBeSaved(result: CMSResult): void {
  assertSafeResultId(result.id);
  if (!result.clientName.trim()) throw new Error('Client name is required.');

  const numericFields: Array<[string, number | null]> = [
    ['Before followers', result.beforeFollowers],
    ['After followers', result.afterFollowers],
    ['Before views', result.beforeViews],
    ['After views', result.afterViews],
    ['Duration', result.durationMonths],
  ];
  for (const [label, value] of numericFields) {
    if (!isSafeNonNegativeInteger(value)) {
      throw new Error(`${label} must be a nonnegative whole number.`);
    }
  }

  if (result.videoUrl && !parseResultVideoUrl(result.videoUrl)) {
    throw new Error('Only YouTube and Instagram Reel URLs are supported.');
  }

  if (result.status !== 'published') return;
  if (!result.clientLogoUrl.trim()) throw new Error('A client logo is required before publishing.');
  if (!isDurableMediaUrl(result.clientLogoUrl)) {
    throw new Error('The client logo must use HTTPS or a site-relative path.');
  }
  if (result.beforeFollowers === null || result.afterFollowers === null) {
    throw new Error('Before and after follower counts are required before publishing.');
  }
  if (result.beforeViews === null || result.afterViews === null) {
    throw new Error('Before and after view counts are required before publishing.');
  }
  if (result.durationMonths === null || result.durationMonths < 1) {
    throw new Error('A duration of at least one month is required before publishing.');
  }
  if (!result.beforeScreenshotUrl.trim() || !result.afterScreenshotUrl.trim()) {
    throw new Error('Before and after screenshots are required before publishing.');
  }
  if (!isDurableMediaUrl(result.beforeScreenshotUrl) || !isDurableMediaUrl(result.afterScreenshotUrl)) {
    throw new Error('Result screenshots must use HTTPS or site-relative paths.');
  }
  if (!result.testimonial.trim()) {
    throw new Error('An approved one-line client testimonial is required before publishing.');
  }
  if (result.videoUrl && !isDurableMediaUrl(result.videoUrl)) {
    throw new Error('The result video URL must use HTTPS.');
  }
  if (result.videoUrl && !result.videoPosterUrl?.trim()) {
    throw new Error('Upload a video poster before publishing a result with video.');
  }
  if (result.videoPosterUrl && !isDurableMediaUrl(result.videoPosterUrl)) {
    throw new Error('The video poster must use HTTPS or a site-relative path.');
  }
}

function normalizeResult(result: CMSResult, now = Date.now()): CMSResult {
  const status = result.status === 'published' || result.status === 'archived'
    ? result.status
    : 'draft';
  const order = Number.isSafeInteger(result.order) && result.order >= 0 ? result.order : 0;
  const homepageOrder = Number.isSafeInteger(result.homepageOrder) && result.homepageOrder >= 0
    ? result.homepageOrder
    : order;
  const normalized: CMSResult = {
    ...result,
    id: result.id.trim(),
    clientId: result.clientId?.trim() || undefined,
    clientName: result.clientName.trim(),
    clientLogoUrl: result.clientLogoUrl.trim(),
    beforeScreenshotUrl: result.beforeScreenshotUrl.trim(),
    afterScreenshotUrl: result.afterScreenshotUrl.trim(),
    testimonial: result.testimonial.replace(/\s+/g, ' ').trim(),
    videoUrl: result.videoUrl?.trim() || undefined,
    videoPosterUrl: result.videoPosterUrl?.trim() || undefined,
    featured: status === 'archived' ? false : Boolean(result.featured),
    order,
    homepageOrder,
    status,
    createdAt: Number.isFinite(result.createdAt) ? result.createdAt : now,
    updatedAt: now,
    publishedAt: status === 'published' ? (result.publishedAt || now) : result.publishedAt,
    archivedAt: status === 'archived' ? (result.archivedAt || now) : undefined,
  };
  assertResultCanBeSaved(normalized);
  return normalized;
}

function serializableResult(result: CMSResult): CMSResult {
  return JSON.parse(JSON.stringify(result)) as CMSResult;
}

function publicResult(result: CMSResult): CMSResult {
  const published = serializableResult({
    ...result,
    status: 'published',
    homepageOrder: result.featured
      ? result.homepageOrder
      : NON_FEATURED_HOMEPAGE_OFFSET + result.order,
    archivedAt: undefined,
  });
  return published;
}

function addResultWrites(updates: Record<string, CMSResult | null>, result: CMSResult): void {
  updates[`${RESULTS_DRAFTS_PATH}/${result.id}`] = serializableResult(result);
  updates[`${RESULTS_PUBLISHED_PATH}/${result.id}`] =
    result.status === 'published' ? publicResult(result) : null;
}

export function subscribeAdminResults(
  onResults: (results: CMSResult[]) => void,
  onError?: (error: unknown) => void
): () => void {
  return onValue(
    ref(firebaseDb, RESULTS_DRAFTS_PATH),
    (snapshot) => {
      if (!snapshot.exists()) {
        onResults([]);
        return;
      }
      const value = snapshot.val();
      const results: CMSResult[] = Array.isArray(value) ? value.filter(Boolean) : Object.values(value);
      onResults(results.sort(resultSort));
    },
    (error) => onError?.(error)
  );
}

export async function fetchAdminResults(): Promise<CMSResult[]> {
  const snapshot = await get(ref(firebaseDb, RESULTS_DRAFTS_PATH));
  if (!snapshot.exists()) return [];
  const value = snapshot.val();
  const results: CMSResult[] = Array.isArray(value) ? value.filter(Boolean) : Object.values(value);
  return results.sort(resultSort);
}

export async function saveResult(result: CMSResult): Promise<CMSResult> {
  const normalized = normalizeResult(result);
  const updates: Record<string, CMSResult | null> = {};
  addResultWrites(updates, normalized);
  await update(ref(firebaseDb), updates);
  return normalized;
}

export async function reorderResults(results: CMSResult[]): Promise<CMSResult[]> {
  const now = Date.now();
  const normalized = results.map((result, index) => normalizeResult({ ...result, order: index }, now));
  const updates: Record<string, CMSResult | null> = {};
  normalized.forEach((result) => addResultWrites(updates, result));
  await update(ref(firebaseDb), updates);
  return normalized.sort(resultSort);
}

export async function replaceAllResults(results: CMSResult[]): Promise<CMSResult[]> {
  const current = await fetchAdminResults();
  const previousIds = new Set(results.map((result) => result.id));
  const now = Date.now();
  const normalized = results.map((result, index) => normalizeResult({ ...result, order: index }, now));
  const updates: Record<string, CMSResult | null> = {};

  current.forEach((result) => {
    if (!previousIds.has(result.id)) {
      updates[`${RESULTS_DRAFTS_PATH}/${result.id}`] = null;
      updates[`${RESULTS_PUBLISHED_PATH}/${result.id}`] = null;
    }
  });
  normalized.forEach((result) => addResultWrites(updates, result));
  await update(ref(firebaseDb), updates);
  return normalized.sort(resultSort);
}

export async function archiveResult(resultId: string): Promise<void> {
  assertSafeResultId(resultId);
  const snapshot = await get(ref(firebaseDb, `${RESULTS_DRAFTS_PATH}/${resultId}`));
  if (!snapshot.exists()) throw new Error('This result no longer exists.');
  const current = snapshot.val() as CMSResult;
  await saveResult({
    ...current,
    status: 'archived',
    featured: false,
    archivedAt: Date.now(),
  });
}

export async function deleteResultPermanently(resultId: string): Promise<void> {
  assertSafeResultId(resultId);
  await update(ref(firebaseDb), {
    [`${RESULTS_DRAFTS_PATH}/${resultId}`]: null,
    [`${RESULTS_PUBLISHED_PATH}/${resultId}`]: null,
  });
}

export async function syncClientMetadataToResults(
  clientId: string,
  clientName: string,
  clientLogoUrl: string
): Promise<void> {
  if (!clientId) return;
  const adminResults = await fetchAdminResults();
  const linked = adminResults.filter((result) => result.clientId === clientId);
  if (linked.length === 0) return;

  const now = Date.now();
  const updates: Record<string, unknown> = {};
  linked.forEach((result) => {
    updates[`${RESULTS_DRAFTS_PATH}/${result.id}/clientName`] = clientName;
    updates[`${RESULTS_DRAFTS_PATH}/${result.id}/clientLogoUrl`] = clientLogoUrl;
    updates[`${RESULTS_DRAFTS_PATH}/${result.id}/updatedAt`] = now;
    if (result.status === 'published') {
      updates[`${RESULTS_PUBLISHED_PATH}/${result.id}/clientName`] = clientName;
      updates[`${RESULTS_PUBLISHED_PATH}/${result.id}/clientLogoUrl`] = clientLogoUrl;
      updates[`${RESULTS_PUBLISHED_PATH}/${result.id}/updatedAt`] = now;
    }
  });
  await update(ref(firebaseDb), updates);
}
