import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  CheckCircle2,
  X,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  ExternalLink,
  FileText,
  Eye,
  EyeOff,
  Megaphone,
} from 'lucide-react';
import { CMSAnnouncement } from '../../types/cms';
import {
  fetchPublishedAnnouncements,
  saveAllAnnouncements,
  resetAnnouncementsToDefaults,
} from '../../lib/cms/cmsService';
import { pushAnnouncementsUndoAction } from '../../lib/cms/cmsHistory';

export const AnnouncementsCMS: React.FC = () => {
  const [announcements, setAnnouncements] = useState<CMSAnnouncement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CMSAnnouncement | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form Inputs
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formButtonUrl, setFormButtonUrl] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  // File Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Open Edit Modal
  const openEditModal = (item: CMSAnnouncement, index: number) => {
    setEditingItem(item);
    setEditingIndex(index);
    setFormTitle(item.title || '');
    setFormDescription(item.description || '');
    setFormImageUrl(item.imageUrl || '');
    setFormButtonUrl(item.buttonUrl || '');
    setFormIsActive(item.isActive !== false);
    setUploadError(null);
    setIsModalOpen(true);
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingItem(null);
    setEditingIndex(null);
    setFormTitle('');
    setFormDescription('');
    setFormImageUrl('/Reels Folder/thumbnails/santhi.pipes_rjy_2026-09-06_10-01-41_3979966688738161477_48644092133.jpg');
    setFormButtonUrl('/contact');
    setFormIsActive(true);
    setUploadError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setEditingIndex(null);
  };

  // Handle Image File Select
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    // Instant local object URL preview
    const localUrl = URL.createObjectURL(file);
    setFormImageUrl(localUrl);

    // Save image locally via FileReader for offline / local-first persistence
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormImageUrl(reader.result);
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Save Announcement (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const titleClean = formTitle.trim();
    if (!titleClean) return;

    const previousState = [...announcements];

    let updatedList: CMSAnnouncement[];
    const now = new Date().toISOString();

    if (editingItem && editingIndex !== null) {
      // Update existing
      pushAnnouncementsUndoAction(`Updated: ${titleClean}`, previousState);

      const updatedItem: CMSAnnouncement = {
        ...editingItem,
        title: titleClean,
        description: formDescription.trim(),
        imageUrl: formImageUrl.trim(),
        buttonUrl: formButtonUrl.trim() || '/contact',
        isActive: formIsActive,
        updatedAt: now,
      };

      updatedList = announcements.map((item, idx) => (idx === editingIndex ? updatedItem : item));
      showToast(`Announcement "${titleClean}" updated & live synced!`);
    } else {
      // Create new
      pushAnnouncementsUndoAction(`Added announcement: ${titleClean}`, previousState);

      const newItem: CMSAnnouncement = {
        id: `ann_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: titleClean,
        description: formDescription.trim(),
        imageUrl: formImageUrl.trim(),
        buttonUrl: formButtonUrl.trim() || '/contact',
        isActive: formIsActive,
        order: announcements.length,
        createdAt: now,
        updatedAt: now,
      };

      updatedList = [...announcements, newItem];
      showToast(`Announcement "${titleClean}" published & live synced!`);
    }

    setAnnouncements(updatedList);
    await saveAllAnnouncements(updatedList);
    closeModal();
  };

  // Delete Announcement
  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete announcement "${title}"? This can be undone using the navbar Undo button.`)) {
      return;
    }

    const previousState = [...announcements];
    pushAnnouncementsUndoAction(`Deleted announcement: ${title}`, previousState);

    const updatedList = announcements.filter((a) => a.id !== id);
    setAnnouncements(updatedList);
    await saveAllAnnouncements(updatedList);
    showToast(`Announcement deleted. Click Undo in navbar to restore.`);
  };

  // Toggle Active / Inactive
  const handleToggleActive = async (item: CMSAnnouncement, index: number) => {
    const previousState = [...announcements];
    const newStatus = !item.isActive;
    pushAnnouncementsUndoAction(
      `${newStatus ? 'Activated' : 'Paused'}: ${item.title}`,
      previousState
    );

    const updated = announcements.map((a, idx) =>
      idx === index ? { ...a, isActive: newStatus, updatedAt: new Date().toISOString() } : a
    );

    setAnnouncements(updated);
    await saveAllAnnouncements(updated);
    showToast(`Announcement "${item.title}" is now ${newStatus ? 'ACTIVE' : 'PAUSED'}.`);
  };

  // Reset to Defaults
  const handleResetDefaults = async () => {
    if (!window.confirm('Reset announcements to BrandShoots defaults? This can be undone with the navbar Undo button.')) {
      return;
    }
    const previousState = [...announcements];
    pushAnnouncementsUndoAction('Reset announcements to default cards', previousState);

    const defaults = await resetAnnouncementsToDefaults();
    setAnnouncements(defaults);
    showToast('Announcements reset to defaults!');
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#008CFF] text-white font-mono text-xs font-bold shadow-[0_10px_40px_rgba(0,140,255,0.4)] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-white" />
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
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/15 flex items-center gap-2 text-xs font-mono font-bold transition-all cursor-pointer"
            title="Reset to default announcement cards"
          >
            <RefreshCw className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-white hover:bg-white/90 text-black flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer"
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
                    onClick={() => handleToggleActive(item, index)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold cursor-pointer transition-colors ${
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

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(item, index)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 transition-all cursor-pointer shadow-md"
                    title={`Edit Announcement #${itemNum}`}
                    aria-label={`Edit Announcement #${itemNum}`}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-current" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500 text-white hover:text-white border border-white/20 transition-all cursor-pointer shadow-md"
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
                    onClick={() => openEditModal(item, index)}
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

              {/* 3. More Info Destination URL */}
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
                  Takes visitors to this URL when clicking the "MORE INFO &rarr;" button.
                </span>
              </div>

              {/* 4. Image Upload & Preview */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <label className="block text-xs font-mono uppercase text-white/70 font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-white" />
                  <span>Announcement Cover Image</span>
                </label>

                {/* Paste URL Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="e.g. /Reels Folder/thumbnails/... or https://res.cloudinary.com/.../image.jpg"
                    required
                    className="w-full px-4 py-2.5 pl-10 rounded-xl bg-black/70 border border-white/20 text-white text-sm font-mono placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors"
                  />
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                </div>

                {/* File Upload Trigger */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/15 hover:border-white/40 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-white/[0.02] flex items-center justify-center gap-3"
                >
                  <Upload className="w-4 h-4 text-white" />
                  <span className="text-xs font-mono text-white/70">
                    {isUploading ? 'Processing image...' : 'Click or drop image file to upload directly'}
                  </span>
                </div>

                {uploadError && (
                  <p className="text-xs font-mono text-red-400">{uploadError}</p>
                )}

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
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-white/90 disabled:opacity-50 text-black text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>{editingItem ? 'Save Announcement' : 'Publish Announcement'}</span>
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
