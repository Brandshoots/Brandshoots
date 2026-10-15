import { ref, get, set, update, remove, push } from 'firebase/database';
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
      services: INITIAL_SERVICES,
      testimonials: INITIAL_TESTIMONIALS,
      leadership: INITIAL_LEADERSHIP,
      siteSettings: INITIAL_SITE_SETTINGS,
      announcements: INITIAL_ANNOUNCEMENTS,
      contact: INITIAL_CONTACT_PAGE,
    };

    await set(publishedRef, payload);
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
    if (snapshot.exists()) {
      const val = snapshot.val();
      const list: CMSProject[] = Array.isArray(val) ? val : Object.values(val);
      if (list.length > 0) {
        return list.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
      }
    }
  } catch (err) {
    console.warn('Firebase RTDB read note for projects:', err);
  }

  try {
    const cached = localStorage.getItem('brandshoots_projects');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort(
          (a: CMSProject, b: CMSProject) => (Number(a.order) || 0) - (Number(b.order) || 0)
        );
      }
    }
  } catch {}

  const initialList = Object.values(INITIAL_PROJECTS).sort(
    (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
  );
  try {
    localStorage.setItem('brandshoots_projects', JSON.stringify(initialList));
  } catch {}
  return initialList;
}

export async function saveAllProjects(projects: CMSProject[]): Promise<void> {
  const normalized = projects.map((p, idx) => ({
    ...p,
    order: idx,
    updatedAt: Date.now(),
  }));

  try {
    localStorage.setItem('brandshoots_projects', JSON.stringify(normalized));
    window.dispatchEvent(
      new CustomEvent('brandshoots_projects_updated', { detail: normalized })
    );
  } catch {}

  try {
    const record: Record<string, CMSProject> = {};
    normalized.forEach((p) => {
      record[p.id] = p;
    });
    await set(ref(firebaseDb, 'published/projects'), record);
  } catch (err) {
    console.warn('Firebase RTDB save note for projects (persisted locally):', err);
  }
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
  try {
    const snapshot = await get(ref(firebaseDb, 'published/clients'));
    if (snapshot.exists()) {
      const val = snapshot.val();
      const list: CMSClientLogo[] = Array.isArray(val) ? val : Object.values(val);
      if (list.length > 0) {
        const enriched = list.map((item) => {
          const init = INITIAL_CLIENTS[item.id];
          return {
            ...item,
            views: item.views !== undefined ? item.views : init?.views,
            likes: item.likes !== undefined ? item.likes : init?.likes,
          };
        });
        return enriched.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
      }
    }
  } catch (err) {
    console.warn('Firebase RTDB read note for clients:', err);
  }

  try {
    const cached = localStorage.getItem('brandshoots_clients');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const enriched = parsed.map((item: CMSClientLogo) => {
          const init = INITIAL_CLIENTS[item.id];
          return {
            ...item,
            views: item.views !== undefined ? item.views : init?.views,
            likes: item.likes !== undefined ? item.likes : init?.likes,
          };
        });
        return enriched.sort(
          (a: CMSClientLogo, b: CMSClientLogo) => (Number(a.order) || 0) - (Number(b.order) || 0)
        );
      }
    }
  } catch {}

  const initialList = Object.values(INITIAL_CLIENTS).sort(
    (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
  );
  try {
    localStorage.setItem('brandshoots_clients', JSON.stringify(initialList));
  } catch {}
  return initialList;
}

export async function saveAllClients(clients: CMSClientLogo[]): Promise<void> {
  const normalized = clients.map((c, idx) => ({
    ...c,
    order: idx,
    updatedAt: Date.now(),
  }));

  try {
    localStorage.setItem('brandshoots_clients', JSON.stringify(normalized));
    window.dispatchEvent(
      new CustomEvent('brandshoots_clients_updated', { detail: normalized })
    );
  } catch {}

  try {
    const record: Record<string, CMSClientLogo> = {};
    normalized.forEach((c) => {
      record[c.id] = c;
    });
    await set(ref(firebaseDb, 'published/clients'), record);
  } catch (err) {
    console.warn('Firebase RTDB save note for clients (persisted locally):', err);
  }
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
  const snapshot = await get(ref(firebaseDb, 'published/hero'));
  return snapshot.exists() ? snapshot.val() : null;
}

export async function saveHero(hero: CMSHero): Promise<void> {
  await set(ref(firebaseDb, 'published/hero'), {
    ...hero,
    updatedAt: Date.now(),
  });
}

// ----------------------------------------------------
// HERO 3D REELS CRUD
// ----------------------------------------------------
export async function fetchPublishedHeroReels(): Promise<CMSHeroReel[]> {
  try {
    const snap = await get(ref(firebaseDb, 'published/heroReels'));
    if (snap.exists()) {
      const val = snap.val();
      const list: CMSHeroReel[] = Array.isArray(val) ? val : Object.values(val);
      if (list.length > 0) {
        return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      }
    }
    const heroSnap = await get(ref(firebaseDb, 'published/hero/reels'));
    if (heroSnap.exists()) {
      const val = heroSnap.val();
      const list: CMSHeroReel[] = Array.isArray(val) ? val : Object.values(val);
      if (list.length > 0) {
        return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      }
    }
  } catch (err) {
    console.warn('Firebase RTDB read note, checking local cache:', err);
  }

  try {
    const cached = localStorage.getItem('brandshoots_hero_reels');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
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

  try {
    localStorage.setItem('brandshoots_hero_reels', JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent('brandshoots_hero_reels_updated', { detail: normalized }));
  } catch {
    // ignore
  }

  try {
    await set(ref(firebaseDb, 'published/heroReels'), normalized);
    await set(ref(firebaseDb, 'published/hero/reels'), normalized);
  } catch (err) {
    console.warn('Firebase RTDB save note (persisted locally):', err);
  }
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
// SERVICES CRUD
// ----------------------------------------------------
export async function fetchPublishedServices(): Promise<CMSService[]> {
  try {
    const snapshot = await get(ref(firebaseDb, 'published/services'));
    if (snapshot.exists()) {
      const val = snapshot.val();
      const list: CMSService[] = Array.isArray(val) ? val : Object.values(val);
      if (list.length > 0) {
        return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      }
    }
  } catch (err) {
    console.warn('Firebase RTDB read note for services:', err);
  }

  try {
    const cached = localStorage.getItem('brandshoots_services');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a: CMSService, b: CMSService) => (a.order ?? 0) - (b.order ?? 0));
      }
    }
  } catch {}

  const initialList = Object.values(INITIAL_SERVICES).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  try {
    localStorage.setItem('brandshoots_services', JSON.stringify(initialList));
  } catch {}
  return initialList;
}

export async function saveAllServices(services: CMSService[]): Promise<void> {
  const normalized = services.map((s, idx) => ({
    ...s,
    order: idx,
    updatedAt: Date.now(),
  }));

  try {
    localStorage.setItem('brandshoots_services', JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent('brandshoots_services_updated', { detail: normalized }));
  } catch {}

  try {
    const record: Record<string, CMSService> = {};
    normalized.forEach((s) => {
      record[s.id] = s;
    });
    await set(ref(firebaseDb, 'published/services'), record);
  } catch (err) {
    console.warn('Firebase RTDB save note for services (persisted locally):', err);
  }
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

// ----------------------------------------------------
// TESTIMONIALS CRUD (CMS 1.5)
// ----------------------------------------------------
export async function fetchPublishedTestimonials(): Promise<CMSTestimonial[]> {
  try {
    const snapshot = await get(ref(firebaseDb, 'published/testimonials'));
    if (snapshot.exists()) {
      const val = snapshot.val();
      const list: CMSTestimonial[] = Array.isArray(val) ? val : Object.values(val);
      if (list.length > 0) {
        return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      }
    }
  } catch (err) {
    console.warn('Firebase RTDB read note for testimonials:', err);
  }

  try {
    const cached = localStorage.getItem('brandshoots_testimonials');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a: CMSTestimonial, b: CMSTestimonial) => (a.order ?? 0) - (b.order ?? 0));
      }
    }
  } catch {}

  const initialList = Object.values(INITIAL_TESTIMONIALS).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  try {
    localStorage.setItem('brandshoots_testimonials', JSON.stringify(initialList));
  } catch {}
  return initialList;
}

export async function saveAllTestimonials(testimonials: CMSTestimonial[]): Promise<void> {
  const normalized = testimonials.map((t, idx) => ({
    ...t,
    order: idx,
    updatedAt: Date.now(),
  }));

  try {
    localStorage.setItem('brandshoots_testimonials', JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent('brandshoots_testimonials_updated', { detail: normalized }));
  } catch {}

  try {
    const record: Record<string, CMSTestimonial> = {};
    normalized.forEach((t) => {
      record[t.id] = t;
    });
    await set(ref(firebaseDb, 'published/testimonials'), record);
  } catch (err) {
    console.warn('Firebase RTDB save note for testimonials (persisted locally):', err);
  }
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

// ----------------------------------------------------
// SITE SETTINGS CRUD
// ----------------------------------------------------
export async function fetchSiteSettings(): Promise<CMSSiteSettings | null> {
  const snapshot = await get(ref(firebaseDb, 'published/siteSettings'));
  return snapshot.exists() ? snapshot.val() : null;
}

export async function saveSiteSettings(settings: CMSSiteSettings): Promise<void> {
  await set(ref(firebaseDb, 'published/siteSettings'), {
    ...settings,
    updatedAt: Date.now(),
  });
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
    if (snapshot.exists()) {
      const val = snapshot.val();
      const list: CMSAnnouncement[] = Array.isArray(val) ? val : Object.values(val);
      if (list.length > 0) {
        return list.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
      }
    }
  } catch (err) {
    console.warn('Firebase RTDB read note for announcements:', err);
  }

  try {
    const cached = localStorage.getItem('brandshoots_announcements');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort(
          (a: CMSAnnouncement, b: CMSAnnouncement) => (Number(a.order) || 0) - (Number(b.order) || 0)
        );
      }
    }
  } catch {}

  const initialList = Object.values(INITIAL_ANNOUNCEMENTS).sort(
    (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
  );
  try {
    localStorage.setItem('brandshoots_announcements', JSON.stringify(initialList));
  } catch {}
  return initialList;
}

export async function saveAllAnnouncements(announcements: CMSAnnouncement[]): Promise<void> {
  const normalized = announcements.map((a, idx) => ({
    ...a,
    order: idx,
    updatedAt: new Date().toISOString(),
  }));

  try {
    localStorage.setItem('brandshoots_announcements', JSON.stringify(normalized));
    window.dispatchEvent(
      new CustomEvent('brandshoots_announcements_updated', { detail: normalized })
    );
  } catch {}

  try {
    const record: Record<string, CMSAnnouncement> = {};
    normalized.forEach((a) => {
      record[a.id] = a;
    });
    await set(ref(firebaseDb, 'published/announcements'), record);
  } catch (err) {
    console.warn('Firebase RTDB save note for announcements (persisted locally):', err);
  }
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

  try {
    localStorage.setItem('brandshoots_contact', JSON.stringify(normalized));
    window.dispatchEvent(
      new CustomEvent('brandshoots_contact_updated', { detail: normalized })
    );
  } catch {}

  try {
    await set(ref(firebaseDb, 'published/contact'), normalized);
  } catch (err) {
    console.warn('Firebase RTDB save note for contact page (persisted locally):', err);
  }
}

export async function resetContactPageToDefaults(): Promise<CMSContactPage> {
  await saveContactPage(INITIAL_CONTACT_PAGE);
  return INITIAL_CONTACT_PAGE;
}
