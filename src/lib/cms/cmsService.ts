import { ref, get, set, update, remove, push } from 'firebase/database';
import { firebaseDb } from '../firebase';
import {
  CMSProject,
  CMSClientLogo,
  CMSHero,
  CMSService,
  CMSTestimonial,
  CMSSiteSettings,
  CMSLead,
} from '../../types/cms';
import {
  INITIAL_PROJECTS,
  INITIAL_CLIENTS,
  INITIAL_HERO,
  INITIAL_SERVICES,
  INITIAL_TESTIMONIALS,
  INITIAL_LEADERSHIP,
  INITIAL_SITE_SETTINGS,
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
    };

    await set(publishedRef, payload);
    return { success: true, message: 'Default production data successfully seeded to Firebase!' };
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return { success: false, message: error?.message || 'Failed to seed database' };
  }
}

// ----------------------------------------------------
// PROJECTS CRUD
// ----------------------------------------------------
export async function fetchPublishedProjects(): Promise<CMSProject[]> {
  const snapshot = await get(ref(firebaseDb, 'published/projects'));
  if (!snapshot.exists()) return [];
  const val = snapshot.val();
  const list: CMSProject[] = Object.values(val);
  return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function saveProject(project: CMSProject): Promise<void> {
  const cleanId = project.id || project.slug.replace(/[^a-zA-Z0-9-_]/g, '');
  const projectToSave = {
    ...project,
    id: cleanId,
    updatedAt: Date.now(),
  };
  await set(ref(firebaseDb, `published/projects/${cleanId}`), projectToSave);
}

export async function deleteProject(projectId: string): Promise<void> {
  await remove(ref(firebaseDb, `published/projects/${projectId}`));
}

export async function updateProjectsOrder(orderedIds: string[]): Promise<void> {
  const updates: Record<string, number> = {};
  orderedIds.forEach((id, index) => {
    updates[`published/projects/${id}/order`] = index;
  });
  await update(ref(firebaseDb), updates);
}

// ----------------------------------------------------
// CLIENTELE LOGOS CRUD
// ----------------------------------------------------
export async function fetchPublishedClients(): Promise<CMSClientLogo[]> {
  const snapshot = await get(ref(firebaseDb, 'published/clients'));
  if (!snapshot.exists()) return [];
  const val = snapshot.val();
  const list: CMSClientLogo[] = Object.values(val);
  return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function saveClient(client: CMSClientLogo): Promise<void> {
  const cleanId = client.id || client.name.toLowerCase().replace(/[^a-zA-Z0-9-_]/g, '-');
  const clientToSave = {
    ...client,
    id: cleanId,
    updatedAt: Date.now(),
  };
  await set(ref(firebaseDb, `published/clients/${cleanId}`), clientToSave);
}

export async function deleteClient(clientId: string): Promise<void> {
  await remove(ref(firebaseDb, `published/clients/${clientId}`));
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
// SERVICES CRUD
// ----------------------------------------------------
export async function fetchPublishedServices(): Promise<CMSService[]> {
  const snapshot = await get(ref(firebaseDb, 'published/services'));
  if (!snapshot.exists()) return [];
  const list: CMSService[] = Object.values(snapshot.val());
  return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function saveService(service: CMSService): Promise<void> {
  await set(ref(firebaseDb, `published/services/${service.id}`), {
    ...service,
    updatedAt: Date.now(),
  });
}

export async function deleteService(serviceId: string): Promise<void> {
  await remove(ref(firebaseDb, `published/services/${serviceId}`));
}

// ----------------------------------------------------
// TESTIMONIALS CRUD
// ----------------------------------------------------
export async function fetchPublishedTestimonials(): Promise<CMSTestimonial[]> {
  const snapshot = await get(ref(firebaseDb, 'published/testimonials'));
  if (!snapshot.exists()) return [];
  const list: CMSTestimonial[] = Object.values(snapshot.val());
  return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function saveTestimonial(testimonial: CMSTestimonial): Promise<void> {
  await set(ref(firebaseDb, `published/testimonials/${testimonial.id}`), {
    ...testimonial,
    updatedAt: Date.now(),
  });
}

export async function deleteTestimonial(testimonialId: string): Promise<void> {
  await remove(ref(firebaseDb, `published/testimonials/${testimonialId}`));
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
