import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  CheckCircle2,
  X,
  Link as LinkIcon,
  Image as ImageIcon,
  ExternalLink,
  FileText,
  Eye,
  EyeOff,
  Megaphone,
  ArrowUp,
  ArrowDown,
  AlertCircle,
} from 'lucide-react';
import { ref, set } from 'firebase/database';
import { CMSAnnouncement } from '../../types/cms';
import {
  fetchPublishedAnnouncements,
  saveAllAnnouncements,
} from '../../lib/cms/cmsService';
import { pushAnnouncementsUndoAction } from '../../lib/cms/cmsHistory';
import { INITIAL_ANNOUNCEMENTS } from '../../lib/cms/seedData';
import { firebaseDb } from '../../lib/firebase';
import { CloudinaryUploader } from './CloudinaryUploader';

type UploadingAwareUploaderProps = React.ComponentProps<typeof CloudinaryUploader> & {
  onUploadingChange?: (isUploading: boolean) => void;
};

const UploadingAwareCloudinaryUploader = CloudinaryUploader as React.ComponentType<UploadingAwareUploaderProps>;

const isAllowedMediaUrl = (value: string): boolean => {
  const clean = value.trim();
  return /^https:\/\//i.test(clean) || /^\/(?!\/)/.test(clean);
};

const normalizeAnnouncements = (items: CMSAnnouncement[]): CMSAnnouncement[] => {
  const now = new Date().toISOString();
  return items.map((item, index) => ({ ...item, order: index, updatedAt: now }));
};

const persistAnnouncements = async (items: CMSAnnouncement[]): Promise<CMSAnnouncement[]> => {
  const normalized = normalizeAnnouncements(items);
  const record = Object.fromEntries(normalized.map((item) => [item.id, item]));
  await set(ref(firebaseDb, 'published/announcements'), record);
  await saveAllAnnouncements(normalized);
  return normalized;
};

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'The change could not be saved.';

export const AnnouncementsCMS: React.FC = () => {
  const [announcements, setAnnouncements] = useState<CMSAnnouncement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [toastIsError, setToastIsError] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CMSAnnouncement | null>(null);

  // Form Inputs
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formButtonText, setFormButtonText] = useState('MORE INFO');
  const [formButtonUrl, setFormButtonUrl] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Load announcements on mount
  useEffect(() => {
    let mounted = true;
    fetchPublishedAnnouncements()
      .then((items) => {
        if (mounted) {
          setAnnouncements(items);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Failed to load announcements:', err);
        if (mounted) setIsLoading(false);
      });

    // Listen for storage or undo restore events
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<CMSAnnouncement[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setAnnouncements(customEvent.detail);
      }
    };

    window.addEventListener('brandshoots_announcements_updated', handleSync);
    return () => {
      mounted = false;
      window.removeEventListener('brandshoots_announcements_updated', handleSync);
    };
  }, []);

  const showToast = (msg: string, isError = false) => {
    setToastIsError(isError);
    setSaveToast(msg);
    window.setTimeout(() => setSaveToast(null), 3500);
  };

  // Open Edit Modal
  const openEditModal = (item: CMSAnnouncement) => {
    setEditingItem(item);
    setFormTitle(item.title || '');
    setFormDescription(item.description || '');
    setFormImageUrl(item.imageUrl || '');
    setFormButtonText(item.buttonText || 'MORE INFO');
    setFormButtonUrl(item.buttonUrl || '');
    setFormIsActive(item.isActive !== false);
    setIsUploading(false);
    setIsModalOpen(true);
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormDescription('');
    setFormImageUrl('/reels/thumbnails-webp/santhi.pipes_rjy_2026-09-06_10-01-41_3979966688738161477_48644092133.webp');
    setFormButtonText('MORE INFO');
    setFormButtonUrl('/contact');
    setFormIsActive(true);
    setIsUploading(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isMutating) return;
    setIsModalOpen(false);
    setEditingItem(null);
    setIsUploading(false);
  };

  // Save Announcement (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading || isMutating) return;

    const titleClean = formTitle.trim();
    const imageUrl = formImageUrl.trim();
    if (!titleClean) return;
    if (!isAllowedMediaUrl(imageUrl)) {
      showToast('Use a secure HTTPS image URL or a site-relative image path.', true);
      return;
    }

    const previousState = [...announcements];
    const now = new Date().toISOString();
    let updatedList: CMSAnnouncement[];
    let description: string;
    let successMessage: string;

    if (editingItem) {
      const currentItem = announcements.find((item) => item.id === editingItem.id);
      if (!currentItem) {
        showToast('This announcement no longer exists. Close the editor and try again.', true);
        return;
      }

      const updatedItem: CMSAnnouncement = {
        ...currentItem,
        title: titleClean,
        description: formDescription.trim(),
        imageUrl,
        buttonText: formButtonText.trim() || 'MORE INFO',
        buttonUrl: formButtonUrl.trim() || '/contact',
        isActive: formIsActive,
        updatedAt: now,
      };
      updatedList = announcements.map((item) =>
        item.id === currentItem.id ? updatedItem : item
      );
      description = `Updated: ${titleClean}`;
      successMessage = `Announcement "${titleClean}" updated & live synced!`;
    } else {
      const newItem: CMSAnnouncement = {
        id: `ann_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: titleClean,
        description: formDescription.trim(),
        imageUrl,
        buttonText: formButtonText.trim() || 'MORE INFO',
        buttonUrl: formButtonUrl.trim() || '/contact',
        isActive: formIsActive,
        order: announcements.length,
        createdAt: now,
        updatedAt: now,
      };
      updatedList = [...announcements, newItem];
      description = `Added announcement: ${titleClean}`;
      successMessage = `Announcement "${titleClean}" published & live synced!`;
    }

    setIsMutating(true);
    try {
      const persisted = await persistAnnouncements(updatedList);
      setAnnouncements(persisted);
      pushAnnouncementsUndoAction(description, previousState);
      showToast(successMessage);
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save announcement:', error);
      showToast(`Could not save announcement: ${errorMessage(error)}`, true);
    } finally {
      setIsMutating(false);
    }
  };

  // Delete Announcement
  const handleDelete = async (id: string, title: string) => {
    if (isMutating) return;
    if (!window.confirm(`Delete announcement "${title}"? This can be undone using the navbar Undo button.`)) {
      return;
    }

    const previousState = [...announcements];
    const updatedList = announcements.filter((item) => item.id !== id);
    setIsMutating(true);
    try {
      const persisted = await persistAnnouncements(updatedList);
      setAnnouncements(persisted);
      pushAnnouncementsUndoAction(`Deleted announcement: ${title}`, previousState);
      showToast('Announcement deleted. Click Undo in navbar to restore.');
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      showToast(`Could not delete announcement: ${errorMessage(error)}`, true);
    } finally {
      setIsMutating(false);
    }
  };

  // Toggle Active / Inactive
  const handleToggleActive = async (id: string) => {
    if (isMutating) return;
    const item = announcements.find((announcement) => announcement.id === id);
    if (!item) return;

    const previousState = [...announcements];
    const newStatus = !(item.isActive !== false);
    const updated = announcements.map((announcement) =>
      announcement.id === id
        ? { ...announcement, isActive: newStatus, updatedAt: new Date().toISOString() }
        : announcement
    );

    setIsMutating(true);
    try {
      const persisted = await persistAnnouncements(updated);
      setAnnouncements(persisted);
      pushAnnouncementsUndoAction(
        `${newStatus ? 'Activated' : 'Paused'}: ${item.title}`,
        previousState
      );
      showToast(`Announcement "${item.title}" is now ${newStatus ? 'ACTIVE' : 'PAUSED'}.`);
    } catch (error) {
      console.error('Failed to change announcement status:', error);
      showToast(`Could not change announcement status: ${errorMessage(error)}`, true);
    } finally {
      setIsMutating(false);
    }
  };

  const handleMove = async (id: string, direction: -1 | 1) => {
    if (isMutating) return;
    const fromIndex = announcements.findIndex((item) => item.id === id);
    const toIndex = fromIndex + direction;
    if (fromIndex < 0 || toIndex < 0 || toIndex >= announcements.length) return;

    const previousState = [...announcements];
    const updated = [...announcements];
    [updated[fromIndex], updated[toIndex]] = [updated[toIndex], updated[fromIndex]];
    const moved = updated[toIndex];

    setIsMutating(true);
    try {
      const persisted = await persistAnnouncements(updated);
      setAnnouncements(persisted);
      pushAnnouncementsUndoAction(`Moved announcement: ${moved.title}`, previousState);
      showToast(`Announcement moved to position ${toIndex + 1}.`);
    } catch (error) {
      console.error('Failed to reorder announcements:', error);
      showToast(`Could not reorder announcements: ${errorMessage(error)}`, true);
    } finally {
      setIsMutating(false);
    }
  };

  // Reset to Defaults
  const handleResetDefaults = async () => {
    if (isMutating) return;
    if (!window.confirm('Reset announcements to BrandShoots defaults? This can be undone with the navbar Undo button.')) {
      return;
    }

    const previousState = [...announcements];
    const defaults = Object.values(INITIAL_ANNOUNCEMENTS)
      .sort((a, b) => a.order - b.order)
      .map((item) => ({ ...item }));

    setIsMutating(true);
    try {
      const persisted = await persistAnnouncements(defaults);
      setAnnouncements(persisted);
      pushAnnouncementsUndoAction('Reset announcements to default cards', previousState);
      showToast('Announcements reset to defaults!');
    } catch (error) {
      console.error('Failed to reset announcements:', error);
      showToast(`Could not reset announcements: ${errorMessage(error)}`, true);
    } finally {
      setIsMutating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white font-mono text-sm">
          <RefreshCw className="w-5 h-5 animate-spin text-white" />
          <span>Loading Announcements & Updates...</span>
        </div>
      </div>
    );
  }

  const activeCount = announcements.filter((a) => a.isActive !== false).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveToast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl text-white font-mono text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-200 ${
          toastIsError
            ? 'bg-red-600 shadow-[0_10px_40px_rgba(220,38,38,0.35)]'
            : 'bg-[#008CFF] shadow-[0_10px_40px_rgba(0,140,255,0.4)]'
        }`}>
          {toastIsError ? <AlertCircle className="w-4 h-4 text-white" /> : <CheckCircle2 className="w-4 h-4 text-white" />}
          <span>{saveToast}</span>
        </div>
      )}

      {/* Clean Top Header Bar */}
      <div className="bg-[#070B12]/95 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-white">
              ANNOUNCEMENTS & UPDATES
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white font-mono text-xs font-bold">
              {activeCount} Active / {announcements.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-white/60 font-sans mt-1">
            Broadcast hiring notices, studio wins, new clients, and press updates to the homepage ticker.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-stretch md:self-auto shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            disabled={isMutating}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/15 flex items-center gap-2 text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-40"
            title="Reset to default announcement cards"
          >
            <RefreshCw className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            disabled={isMutating}
            className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-white hover:bg-white/90 disabled:opacity-40 text-black flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Add Announcement</span>
          </button>
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {announcements.map((item, index) => {
          const itemNum = String(index + 1).padStart(2, '0');
          const isActive = item.isActive !== false;

          return (
            <article
              key={item.id}
              className={`group relative bg-[#070B12]/95 border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl ${
                isActive
                  ? 'border-white/15 hover:border-white/40 shadow-black/60'
                  : 'border-white/5 opacity-60 bg-black/40'
              }`}
            >
              {/* Card Top Strip */}
              <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded-md border border-white/15">
                    #{itemNum}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(item.id)}
                    disabled={isMutating}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold cursor-pointer transition-colors disabled:opacity-40 ${
                      isActive
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                        : 'bg-white/5 border border-white/15 text-white/40'
                    }`}
                    title={isActive ? 'Click to Pause announcement' : 'Click to Activate announcement'}
                  >
                    {isActive ? (
                      <>
                        <Eye className="w-3 h-3 text-emerald-300" />
                        <span>ACTIVE</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 text-white/40" />
                        <span>PAUSED</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Ordering, Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMove(item.id, -1)}
                    disabled={isMutating || index === 0}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move announcement up"
                    aria-label={`Move announcement #${itemNum} up`}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(item.id, 1)}
                    disabled={isMutating || index === announcements.length - 1}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move announcement down"
                    aria-label={`Move announcement #${itemNum} down`}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    disabled={isMutating}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 transition-all cursor-pointer shadow-md disabled:opacity-40"
                    title={`Edit Announcement #${itemNum}`}
                    aria-label={`Edit Announcement #${itemNum}`}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-current" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.title)}
                    disabled={isMutating}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500 text-white hover:text-white border border-white/20 transition-all cursor-pointer shadow-md disabled:opacity-40"
                    title={`Delete Announcement #${itemNum}`}
                    aria-label={`Delete Announcement #${itemNum}`}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-current" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 flex-1">
                {/* Image Preview Container */}
                <div className="relative w-full sm:w-44 h-32 sm:h-36 rounded-xl overflow-hidden bg-black/80 border border-white/10 shrink-0 group/img">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/30 text-xs font-mono gap-1">
                      <ImageIcon className="w-6 h-6 text-white/30" />
                      <span>No Image</span>
                    </div>
                  )}

                  {/* Quick Replace Image Button */}
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="absolute bottom-2 right-2 w-7 h-7 rounded-lg bg-black/80 hover:bg-white text-white hover:text-black border border-white/30 flex items-center justify-center transition-all cursor-pointer shadow-lg"
                    title="Change announcement image"
                    aria-label="Change announcement image"
                  >
                    <RefreshCw className="w-3 h-3 text-current" />
                  </button>
                </div>

                {/* Title, Matter, and URL */}
                <div className="flex flex-col justify-between flex-1 min-w-0 space-y-2.5">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-sans text-white tracking-tight leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-white/70 font-sans leading-relaxed line-clamp-3">
                      {item.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* More Info URL Button Preview */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 font-semibold">
                      Destination Link
                    </span>
                    <a
                      href={item.buttonUrl || '#'}
                      target={item.buttonUrl?.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black font-mono text-xs font-bold transition-all truncate max-w-[200px]"
                    >
                      <span className="truncate">{item.buttonUrl || '/contact'}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 text-current" />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* EDIT / CREATE ANNOUNCEMENT MODAL                                    */}
      {/* =================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0A0E17] border border-white/15 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-5 shadow-2xl my-auto max-h-[94vh] overflow-y-auto custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider font-display">
                    {editingItem ? 'Edit Announcement' : 'Create New Announcement'}
                  </h2>
                  <p className="text-xs font-mono text-white/50">
                    Live broadcast card for homepage announcements stream
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="space-y-5">
              {/* 1. Title */}
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5 font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-white" />
                  <span>Announcement Title</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. We Are Hiring: Senior Video Editor & Colorist"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white text-sm font-sans font-bold placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors"
                />
              </div>

              {/* 2. Matter / Description */}
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5 font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-white" />
                  <span>Matter / Narrative Description</span>
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  placeholder="Enter the announcement story, event date, hiring specifics, or campaign briefing..."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-black/70 border border-white/20 text-white text-sm font-sans placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* 3. CTA Label */}
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5 font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-white" />
                  <span>Button Text</span>
                </label>
                <input
                  type="text"
                  value={formButtonText}
                  onChange={(e) => setFormButtonText(e.target.value)}
                  placeholder="e.g. MORE INFO, APPLY NOW, REGISTER NOW"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white text-sm font-mono placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors"
                />
              </div>

              {/* 4. More Info Destination URL */}
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5 font-bold flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-white" />
                  <span>More Info (Target URL destination)</span>
                </label>
                <input
                  type="text"
                  value={formButtonUrl}
                  onChange={(e) => setFormButtonUrl(e.target.value)}
                  placeholder="e.g. /contact, /portfolio, or https://company.com/job-post"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white text-sm font-mono placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors"
                />
                <span className="text-[10px] font-mono text-white/40 mt-1 block">
                  Takes visitors to this URL when clicking the "{formButtonText.trim() || 'MORE INFO'} →" button.
                </span>
              </div>

              {/* 5. Image Upload & Preview */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <UploadingAwareCloudinaryUploader
                  label="Announcement Cover Image"
                  value={formImageUrl}
                  onChange={setFormImageUrl}
                  onUploadingChange={setIsUploading}
                  accept="image"
                  requireCloudinary
                  helpText="Upload a signed Cloudinary image, or enter a secure HTTPS/site-relative image URL."
                />

                {/* Live Preview Container */}
                {formImageUrl && (
                  <div className="p-3 bg-black/50 border border-white/10 rounded-2xl flex items-center gap-4">
                    <div className="w-32 h-20 rounded-xl overflow-hidden bg-black shrink-0 border border-white/20">
                      <img
                        src={formImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono uppercase text-white/50 block">Live Preview</span>
                      <p className="text-xs font-mono text-white truncate">{formImageUrl}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Active Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-black/50 border border-white/10 rounded-xl">
                <div>
                  <span className="text-xs font-mono font-bold text-white uppercase block">
                    Broadcast Status
                  </span>
                  <span className="text-[11px] font-sans text-white/50">
                    Visible immediately in the homepage announcement stream
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormIsActive(!formIsActive)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    formIsActive
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                      : 'bg-white/10 border border-white/20 text-white/50'
                  }`}
                >
                  {formIsActive ? 'ACTIVE' : 'PAUSED'}
                </button>
              </div>

              {/* Action Buttons: Sticky Bottom */}
              <div className="sticky -bottom-6 sm:-bottom-8 pt-4 pb-1 bg-[#0A0E17]/95 backdrop-blur-md border-t border-white/10 flex items-center justify-end gap-3 z-10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || isMutating}
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-white/90 disabled:opacity-50 text-black text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>{isUploading ? 'Uploading Image...' : isMutating ? 'Saving...' : editingItem ? 'Save Announcement' : 'Publish Announcement'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsCMS;
