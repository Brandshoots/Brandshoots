import { saveHeroReels, saveAllServices, saveAllAnnouncements, saveAllClients, saveAllTestimonials, saveAllProjects, saveContactPage } from './cmsService';
import { CMSHeroReel, CMSService, CMSAnnouncement, CMSClientLogo, CMSTestimonial, CMSProject, CMSContactPage } from '../../types/cms';

export type CMSHistoryType = 'heroReels' | 'services' | 'announcements' | 'clients' | 'testimonials' | 'projects' | 'contact';

export interface CMSHistoryEntry {
  id: string;
  timestamp: number;
  description: string;
  type: CMSHistoryType;
  previousState: any;
}

const STORAGE_KEY = 'bs_cms_undo_stack';
const MAX_HISTORY_STEPS = 20;

// Read stack from localStorage
export function getUndoStack(): CMSHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Save stack to localStorage and notify listeners
function saveUndoStack(stack: CMSHistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stack.slice(-MAX_HISTORY_STEPS)));
    window.dispatchEvent(new CustomEvent('brandshoots_cms_history_change', { detail: { count: stack.length } }));
  } catch (err) {
    console.warn('Failed to save undo stack to localStorage:', err);
  }
}

// Push a new undoable action for Hero Reels
export function pushUndoAction(description: string, previousState: CMSHeroReel[]): void {
  const stack = getUndoStack();
  const entry: CMSHistoryEntry = {
    id: `undo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    description,
    type: 'heroReels',
    previousState: JSON.parse(JSON.stringify(previousState)),
  };
  stack.push(entry);
  saveUndoStack(stack);

  // Trigger navbar flash for the change made
  triggerNavFlash(description, 'action');
}

// Push a new undoable action for What We Do Services
export function pushServicesUndoAction(description: string, previousState: CMSService[]): void {
  const stack = getUndoStack();
  const entry: CMSHistoryEntry = {
    id: `undo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    description,
    type: 'services',
    previousState: JSON.parse(JSON.stringify(previousState)),
  };
  stack.push(entry);
  saveUndoStack(stack);

  // Trigger navbar flash for the change made
  triggerNavFlash(description, 'action');
}

// Push a new undoable action for Announcements (CMS 1.3)
export function pushAnnouncementsUndoAction(description: string, previousState: CMSAnnouncement[]): void {
  const stack = getUndoStack();
  const entry: CMSHistoryEntry = {
    id: `undo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    description,
    type: 'announcements',
    previousState: JSON.parse(JSON.stringify(previousState)),
  };
  stack.push(entry);
  saveUndoStack(stack);

  // Trigger navbar flash for the change made
  triggerNavFlash(description, 'action');
}

// Push a new undoable action for Clientele Logos (CMS 1.3)
export function pushClientsUndoAction(description: string, previousState: CMSClientLogo[]): void {
  const stack = getUndoStack();
  const entry: CMSHistoryEntry = {
    id: `undo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    description,
    type: 'clients',
    previousState: JSON.parse(JSON.stringify(previousState)),
  };
  stack.push(entry);
  saveUndoStack(stack);

  // Trigger navbar flash for the change made
  triggerNavFlash(description, 'action');
}

// Push a new undoable action for Testimonials (CMS 1.5)
export function pushTestimonialsUndoAction(description: string, previousState: CMSTestimonial[]): void {
  const stack = getUndoStack();
  const entry: CMSHistoryEntry = {
    id: `undo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    description,
    type: 'testimonials',
    previousState: JSON.parse(JSON.stringify(previousState)),
  };
  stack.push(entry);
  saveUndoStack(stack);

  // Trigger navbar flash for the change made
  triggerNavFlash(description, 'action');
}

// Push a new undoable action for Projects (CMS 1.7)
export function pushProjectsUndoAction(description: string, previousState: CMSProject[]): void {
  const stack = getUndoStack();
  const entry: CMSHistoryEntry = {
    id: `undo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    description,
    type: 'projects',
    previousState: JSON.parse(JSON.stringify(previousState)),
  };
  stack.push(entry);
  saveUndoStack(stack);

  // Trigger navbar flash for the change made
  triggerNavFlash(description, 'action');
}

// Push a new undoable action for Contact Page (CMS 1.8)
export function pushContactUndoAction(description: string, previousState: CMSContactPage): void {
  const stack = getUndoStack();
  const entry: CMSHistoryEntry = {
    id: `undo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    description,
    type: 'contact',
    previousState: JSON.parse(JSON.stringify(previousState)),
  };
  stack.push(entry);
  saveUndoStack(stack);

  // Trigger navbar flash for the change made
  triggerNavFlash(description, 'action');
}

// Check if undo is available
export function canUndo(): boolean {
  return getUndoStack().length > 0;
}

// Get description of the last action that can be undone
export function getLastActionDescription(): string | null {
  const stack = getUndoStack();
  if (stack.length === 0) return null;
  return stack[stack.length - 1].description;
}

// Perform undo: pop the last entry, restore previous state, and flash navbar
export async function undoLastAction(): Promise<{
  success: boolean;
  message: string;
  restoredReels?: CMSHeroReel[];
  restoredServices?: CMSService[];
  restoredAnnouncements?: CMSAnnouncement[];
  restoredClients?: CMSClientLogo[];
  restoredTestimonials?: CMSTestimonial[];
  restoredProjects?: CMSProject[];
  restoredContact?: CMSContactPage;
}> {
  const stack = getUndoStack();
  if (stack.length === 0) {
    return { success: false, message: 'No actions to undo.' };
  }

  const lastEntry = stack.pop()!;
  saveUndoStack(stack);

  if (lastEntry.type === 'heroReels' && Array.isArray(lastEntry.previousState)) {
    // Restore the previous state directly to storage & Firebase
    await saveHeroReels(lastEntry.previousState);

    const restoreMsg = `Restored: ${lastEntry.description}`;
    triggerNavFlash(restoreMsg, 'undo');

    return {
      success: true,
      message: restoreMsg,
      restoredReels: lastEntry.previousState,
    };
  }

  if (lastEntry.type === 'services' && Array.isArray(lastEntry.previousState)) {
    // Restore the previous services state directly to storage & Firebase
    await saveAllServices(lastEntry.previousState);

    const restoreMsg = `Restored: ${lastEntry.description}`;
    triggerNavFlash(restoreMsg, 'undo');

    return {
      success: true,
      message: restoreMsg,
      restoredServices: lastEntry.previousState,
    };
  }

  if (lastEntry.type === 'announcements' && Array.isArray(lastEntry.previousState)) {
    // Restore the previous announcements state directly to storage & Firebase
    await saveAllAnnouncements(lastEntry.previousState);

    const restoreMsg = `Restored: ${lastEntry.description}`;
    triggerNavFlash(restoreMsg, 'undo');

    return {
      success: true,
      message: restoreMsg,
      restoredAnnouncements: lastEntry.previousState,
    };
  }

  if (lastEntry.type === 'clients' && Array.isArray(lastEntry.previousState)) {
    // Restore the previous clients state directly to storage & Firebase
    await saveAllClients(lastEntry.previousState);

    const restoreMsg = `Restored: ${lastEntry.description}`;
    triggerNavFlash(restoreMsg, 'undo');

    return {
      success: true,
      message: restoreMsg,
      restoredClients: lastEntry.previousState,
    };
  }

  if (lastEntry.type === 'testimonials' && Array.isArray(lastEntry.previousState)) {
    // Restore the previous testimonials state directly to storage & Firebase
    await saveAllTestimonials(lastEntry.previousState);

    const restoreMsg = `Restored: ${lastEntry.description}`;
    triggerNavFlash(restoreMsg, 'undo');

    return {
      success: true,
      message: restoreMsg,
      restoredTestimonials: lastEntry.previousState,
    };
  }

  if (lastEntry.type === 'projects' && Array.isArray(lastEntry.previousState)) {
    // Restore the previous projects state directly to storage & Firebase
    await saveAllProjects(lastEntry.previousState);

    const restoreMsg = `Restored: ${lastEntry.description}`;
    triggerNavFlash(restoreMsg, 'undo');

    return {
      success: true,
      message: restoreMsg,
      restoredProjects: lastEntry.previousState,
    };
  }

  if (lastEntry.type === 'contact' && lastEntry.previousState) {
    // Restore the previous contact page state directly to storage & Firebase
    await saveContactPage(lastEntry.previousState);

    const restoreMsg = `Restored: ${lastEntry.description}`;
    triggerNavFlash(restoreMsg, 'undo');

    return {
      success: true,
      message: restoreMsg,
      restoredContact: lastEntry.previousState,
    };
  }

  return { success: false, message: 'Unknown action type.' };
}

// Trigger flash scroll notification on the navbar
export function triggerNavFlash(message: string, type: 'action' | 'undo' | 'info' = 'action'): void {
  try {
    window.dispatchEvent(
      new CustomEvent('brandshoots_nav_flash', {
        detail: {
          message,
          type,
          timestamp: Date.now(),
        },
      })
    );
  } catch (err) {
    console.warn('Failed to dispatch nav flash event:', err);
  }
}
