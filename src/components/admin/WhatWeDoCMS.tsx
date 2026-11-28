import React, { useState, useEffect } from 'react';
import {
  Edit3,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  X,
  FileText,
  Tag,
  Layers,
  Sparkles,
  ExternalLink,
  Image as ImageIcon,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  AlertCircle,
} from 'lucide-react';
import { get, ref } from 'firebase/database';
import { CMSService } from '../../types/cms';
import { saveAllServices, sanitizeServicesList } from '../../lib/cms/cmsService';
import { pushServicesUndoAction } from '../../lib/cms/cmsHistory';
import { INITIAL_SERVICES } from '../../lib/cms/seedData';
import { firebaseDb } from '../../lib/firebase';
import { CloudinaryUploader } from './CloudinaryUploader';

type UploadingAwareUploaderProps = React.ComponentProps<typeof CloudinaryUploader> & {
  onUploadingChange?: (isUploading: boolean) => void;
};

const resolveCleanServiceImage = (id: string, imageUrl?: string): string => {
  const trimmed = (imageUrl || '').trim();
  const isOldReelThumbnail =
    !trimmed ||
    trimmed.includes('/reels/') ||
    trimmed.includes('/reels_new/') ||
    trimmed.includes('/reels_light/');
  if (!isOldReelThumbnail) return trimmed;
  if (id === 'creative-content') return '/what-we-do/creative-content.jpg';
  if (id === 'digital-growth') return '/what-we-do/digital-growth.jpg';
  if (id === 'editing-posting') return '/what-we-do/editing-posting.jpg';
  return '/what-we-do/creative-content.jpg';
};

const UploadingAwareCloudinaryUploader = CloudinaryUploader as React.ComponentType<UploadingAwareUploaderProps>;

const isAllowedMediaUrl = (value: string, optional = false): boolean => {
  const clean = value.trim();
  if (!clean) return optional;
  return /^https:\/\//i.test(clean) || /^\/(?!\/)/.test(clean);
};

const loadServicesWithoutRepair = async (): Promise<CMSService[]> => {
  let remoteError: unknown = null;
  try {
    const snapshot = await get(ref(firebaseDb, 'published/services'));
    if (snapshot.exists()) {
      const value = snapshot.val();
      const list: CMSService[] = Array.isArray(value) ? value : Object.values(value);
      return sanitizeServicesList([...list]).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
  } catch (error) {
    remoteError = error;
  }

  try {
    const cached = localStorage.getItem('brandshoots_services');
    if (cached) {
      const parsed: unknown = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        return sanitizeServicesList([...(parsed as CMSService[])]).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      }
    }
  } catch (error) {
    console.warn('Failed to read cached services:', error);
  }

  if (remoteError) throw remoteError;
  return [];
};

const normalizeServices = (items: CMSService[]): CMSService[] =>
  items.map((item, index) => ({
    ...item,
    number: String(index + 1).padStart(2, '0'),
    order: index,
    visible: item.visible !== false,
    updatedAt: Date.now(),
  }));

const persistServices = async (items: CMSService[]): Promise<CMSService[]> => {
  const normalized = normalizeServices(items);
  await saveAllServices(normalized);
  return normalized;
};

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'The change could not be saved.';

export const WhatWeDoCMS: React.FC = () => {
  const [services, setServices] = useState<CMSService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [toastIsError, setToastIsError] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  // Edit Modal State
  const [editingService, setEditingService] = useState<CMSService | null>(null);

  // Modal Form Inputs
  const [formTitleLine1, setFormTitleLine1] = useState('');
  const [formTitleLine2, setFormTitleLine2] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTag, setFormTag] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const isUploading = isImageUploading || isVideoUploading;

  // Fetch published services on mount & listen for undo updates
  useEffect(() => {
    let isMounted = true;
    loadServicesWithoutRepair()
      .then((data) => {
        if (isMounted) {
          setServices(data);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Failed to load services:', error);
        if (isMounted) {
          setToastIsError(true);
          setSaveToast(`Could not load services: ${errorMessage(error)}`);
          setIsLoading(false);
        }
      });

    const handleServicesUpdated = (e: any) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setServices(e.detail);
      }
    };

    window.addEventListener('brandshoots_services_updated', handleServicesUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener('brandshoots_services_updated', handleServicesUpdated);
    };
  }, []);

  const showToast = (msg: string, isError = false) => {
    setToastIsError(isError);
    setSaveToast(msg);
    window.setTimeout(() => setSaveToast(null), 3500);
  };

  // Reset to Defaults (Syncs frontend with canonical 3 pillars)
  const handleResetDefaults = async () => {
    if (isMutating) return;
    const confirmed = window.confirm(
      'Reset What We Do to the 3 canonical pillars (CREATIVE CONTENT, DIGITAL GROWTH, EDITING & POSTING)?\n\nThis will sync with the live homepage. You can undo this anytime using the Undo button.'
    );
    if (!confirmed) return;

    const previousState = [...services];
    const defaults = Object.values(INITIAL_SERVICES)
      .sort((a, b) => a.order - b.order)
      .map((service) => ({ ...service, titleLines: [...service.titleLines] }));

    setIsMutating(true);
    try {
      const persisted = await persistServices(defaults);
      setServices(persisted);
      pushServicesUndoAction('Reset What We Do to 3 Core Pillars', previousState);
      showToast('Successfully synced to the 3 canonical pillars!');
    } catch (error) {
      console.error('Error resetting services:', error);
      showToast(`Could not reset pillars: ${errorMessage(error)}`, true);
    } finally {
      setIsMutating(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (service: CMSService) => {
    setEditingService(service);
    setFormTitleLine1(service.titleLines?.[0] || '');
    setFormTitleLine2(service.titleLines?.[1] || '');
    setFormCategory(service.category || '');
    setFormDescription(service.description || '');
    setFormTag(service.tag || '');
    setFormVideoUrl(service.videoUrl || '');
    setFormImageUrl(resolveCleanServiceImage(service.id, service.imageUrl));
    setIsImageUploading(false);
    setIsVideoUploading(false);
  };

  // Close Edit Modal
  const closeEditModal = () => {
    if (isMutating) return;
    setEditingService(null);
    setIsImageUploading(false);
    setIsVideoUploading(false);
  };

  const handleMoveService = async (id: string, direction: -1 | 1) => {
    if (isMutating) return;
    const fromIndex = services.findIndex((service) => service.id === id);
    const toIndex = fromIndex + direction;
    if (fromIndex < 0 || toIndex < 0 || toIndex >= services.length) return;

    const previousState = [...services];
    const updated = [...services];
    [updated[fromIndex], updated[toIndex]] = [updated[toIndex], updated[fromIndex]];
    const moved = updated[toIndex];

    setIsMutating(true);
    try {
      const persisted = await persistServices(updated);
      setServices(persisted);
      pushServicesUndoAction(`Moved ${moved.category} to position ${toIndex + 1}`, previousState);
      showToast(`${moved.category} moved to position ${toIndex + 1}.`);
    } catch (error) {
      console.error('Error reordering services:', error);
      showToast(`Could not reorder pillars: ${errorMessage(error)}`, true);
    } finally {
      setIsMutating(false);
    }
  };

  const handleToggleVisibility = async (id: string) => {
    if (isMutating) return;
    const target = services.find((service) => service.id === id);
    if (!target) return;

    const previousState = [...services];
    const nextVisible = !(target.visible !== false);
    const updated = services.map((service) =>
      service.id === id ? { ...service, visible: nextVisible, updatedAt: Date.now() } : service
    );

    setIsMutating(true);
    try {
      const persisted = await persistServices(updated);
      setServices(persisted);
      pushServicesUndoAction(
        `${nextVisible ? 'Showed' : 'Hid'} pillar: ${target.category}`,
        previousState
      );
      showToast(`${target.category} is now ${nextVisible ? 'VISIBLE' : 'HIDDEN'}.`);
    } catch (error) {
      console.error('Error changing service visibility:', error);
      showToast(`Could not change visibility: ${errorMessage(error)}`, true);
    } finally {
      setIsMutating(false);
    }
  };

  // Save Service Changes
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || isUploading || isMutating) return;

    const currentService = services.find((service) => service.id === editingService.id);
    if (!currentService) {
      showToast('This pillar no longer exists. Close the editor and try again.', true);
      return;
    }

    const imageUrl = formImageUrl.trim();
    const videoUrl = formVideoUrl.trim();
    if (!isAllowedMediaUrl(imageUrl)) {
      showToast('Use a secure HTTPS image URL or a site-relative image path.', true);
      return;
    }
    if (!isAllowedMediaUrl(videoUrl, true)) {
      showToast('Use a secure HTTPS video URL, a site-relative video path, or leave it empty.', true);
      return;
    }

    const fullTitle = `${formTitleLine1.trim()} ${formTitleLine2.trim()}`.trim();
    const { videoUrl: _existingVideoUrl, ...serviceWithoutVideo } = currentService;
    const updatedService: CMSService = {
      ...serviceWithoutVideo,
      titleLines: [formTitleLine1.trim(), formTitleLine2.trim()],
      category: formCategory.trim(),
      description: formDescription.trim(),
      tag: formTag.trim(),
      imageUrl,
      ...(videoUrl ? { videoUrl } : {}),
      visible: currentService.visible !== false,
      updatedAt: Date.now(),
    };

    const previousState = [...services];
    const updatedList = services.map((service) =>
      service.id === currentService.id ? updatedService : service
    );

    setIsMutating(true);
    try {
      const persisted = await persistServices(updatedList);
      setServices(persisted);
      pushServicesUndoAction(`Updated Pillar #${currentService.number}: ${fullTitle}`, previousState);
      showToast(`Pillar #${currentService.number} (${fullTitle}) updated & live synced!`);
      setEditingService(null);
    } catch (error) {
      console.error('Error saving service:', error);
      showToast(`Could not save pillar: ${errorMessage(error)}`, true);
    } finally {
      setIsMutating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white font-mono text-sm">
          <RefreshCw className="w-5 h-5 animate-spin text-[#008CFF]" />
          <span>Loading What We Do Capabilities...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-display font-black uppercase tracking-wider text-white">
              What We Do — 3 Core Pillars
            </h1>
            <span className="px-3 py-1 rounded-full bg-[#008CFF]/15 border border-[#008CFF]/30 text-xs font-mono font-bold text-[#008CFF]">
              3 Capabilities + Scene 04 Climax
            </span>
          </div>
          <p className="text-sm font-sans text-white/60 mt-1 max-w-3xl">
            Edit text, titles, matter narratives, badges, and 9:16 vertical slide images for the 3 homepage capabilities (01 / 03, 02 / 03, 03 / 03), ending with the Scene 04 3D Climax.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Live Synced Indicator */}
          <div className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white/70 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Synced</span>
          </div>

          {/* Reset Defaults / Sync Frontend Button */}
          <button
            type="button"
            onClick={handleResetDefaults}
            disabled={isMutating}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-xs font-mono font-semibold text-white/80 hover:text-white flex items-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            title="Reset What We Do to canonical 3 pillars"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-[#008CFF] ${isMutating ? 'animate-spin' : ''}`} />
            <span>{isMutating ? 'Saving...' : 'Reset Defaults / Sync'}</span>
          </button>
        </div>
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className={`p-4 rounded-xl border text-sm font-mono flex items-center gap-2.5 animate-fadeIn shadow-lg ${
          toastIsError
            ? 'bg-red-500/15 border-red-500/40 text-red-200'
            : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
        }`}>
          {toastIsError ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="font-semibold">{saveToast}</span>
        </div>
      )}

      {/* 3 Core Capability Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {services.map((service, index) => {
          const displayMedia = service.imageUrl || service.videoUrl;
          return (
            <div
              key={service.id}
              className="group relative rounded-2xl overflow-hidden bg-[#0A0D14] border border-white/15 flex flex-col transition-all duration-300 hover:border-[#008CFF]/50 hover:shadow-[0_16px_50px_rgba(0,140,255,0.15)]"
            >
              {/* Card Header: Chapter Number & Category Pill */}
              <div className="px-5 py-3.5 bg-black/60 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-2.5 py-1 rounded-md bg-[#008CFF]/15 border border-[#008CFF]/30 text-xs font-mono font-bold text-[#008CFF] shrink-0">
                    {service.number || `0${index + 1}`} / 03
                  </span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/70 truncate">
                    {service.category}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveService(service.id, -1)}
                    disabled={isMutating || index === 0}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move pillar up"
                    aria-label={`Move ${service.category} up`}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveService(service.id, 1)}
                    disabled={isMutating || index === services.length - 1}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move pillar down"
                    aria-label={`Move ${service.category} down`}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(service.id)}
                    disabled={isMutating}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer disabled:opacity-40 ${
                      service.visible !== false
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : 'bg-white/5 border-white/15 text-white/40'
                    }`}
                    title={service.visible !== false ? 'Hide pillar' : 'Show pillar'}
                    aria-label={`${service.visible !== false ? 'Hide' : 'Show'} ${service.category}`}
                  >
                    {service.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(service)}
                    disabled={isMutating}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#008CFF] text-white border border-white/20 flex items-center gap-1.5 text-xs font-mono font-bold transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 disabled:opacity-40"
                    title={`Edit Pillar #${service.number}`}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-current" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              {/* Card Body: 9:16 Slide Image + Content */}
              <div className="p-5 flex flex-col gap-4 flex-1">
                {/* 9:16 Slide Image Container */}
                <div className="relative w-full aspect-[9/16] max-h-[380px] bg-black rounded-xl overflow-hidden border border-white/10 group/img shadow-inner">
                  {service.imageUrl ? (
                    <img
                      src={resolveCleanServiceImage(service.id, service.imageUrl)}
                      alt={service.category}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                    />
                  ) : (
                    <video
                      src={displayMedia}
                      poster={service.imageUrl}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Image Overlay Info */}
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3 h-3 text-[#008CFF]" />
                      <span>Chapter 0{index + 1} Image</span>
                    </span>
                  </div>

                  {/* Quick Change Image Button */}
                  <button
                    type="button"
                    onClick={() => openEditModal(service)}
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/85 hover:bg-[#008CFF] text-white border border-white/30 flex items-center gap-1.5 text-xs font-mono font-semibold transition-all cursor-pointer shadow-xl backdrop-blur-md"
                    title="Change slide image"
                    aria-label="Change slide image"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-current" />
                    <span>Change Image</span>
                  </button>
                </div>

                {/* Content: Title, Description, Tag */}
                <div className="flex flex-col justify-between flex-1 space-y-3 pt-2">
                  <div>
                    {/* 2-Line Headline */}
                    <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-white leading-tight">
                      <div>{service.titleLines?.[0] || 'CAPABILITY'}</div>
                      <div className="text-[#008CFF]">{service.titleLines?.[1] || 'PILLAR'}</div>
                    </h3>

                    {/* Narrative Description */}
                    <p className="mt-2 text-xs sm:text-sm font-sans text-white/70 leading-relaxed line-clamp-4">
                      {service.description}
                    </p>
                  </div>

                  {/* Tag Pill */}
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/15 text-xs font-mono font-medium text-white/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
                      <span className="truncate">{service.tag}</span>
                    </span>
                  </div>

                  {/* Edit Card Button Footer */}
                  <button
                    type="button"
                    onClick={() => openEditModal(service)}
                    className="w-full mt-2 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-xs font-mono font-bold text-white/90 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#008CFF]" />
                    <span>Edit Pillar 0{index + 1} Content & Image</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* SCENE 04 CLIMAX OVERVIEW BANNER                                     */}
      {/* =================================================================== */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#070B14] via-[#0C1424] to-[#070B14] border border-[#008CFF]/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-[#008CFF]/20 border border-[#008CFF]/40 text-xs font-mono font-bold text-[#008CFF] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#008CFF]" />
                <span>04 / 04 CLIMAX</span>
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-white/50 font-bold">
                Dynamic 3D Typography Explosion
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-white">
              CREATE. <span className="text-[#008CFF]">SHOOT.</span> GROW.
            </h3>

            <p className="text-xs sm:text-sm font-sans text-white/70 leading-relaxed">
              Directly after viewers scroll past Pillar 03 (EDITING & POSTING), the homepage transitions smoothly into the full-screen 3D typography climax with spatial audio and high-conversion booking CTAs.
            </p>
          </div>

          <div className="shrink-0">
            <a
              href="/#what-we-do"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-white hover:bg-white/90 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>View On Live Website</span>
              <ExternalLink className="w-4 h-4 text-black" />
            </a>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* EDIT PILLAR MODAL                                                   */}
      {/* =================================================================== */}
      {editingService && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0A0E17] border border-white/15 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-5 shadow-2xl my-auto max-h-[94vh] overflow-y-auto custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#008CFF]/15 border border-[#008CFF]/30 flex items-center justify-center text-[#008CFF]">
                  <Edit3 className="w-5 h-5 text-[#008CFF]" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider font-display">
                    Edit Capability Pillar #{editingService.number}
                  </h2>
                  <p className="text-xs font-mono text-white/50">
                    Pillar {services.findIndex((service) => service.id === editingService.id) + 1} of {String(services.length).padStart(2, '0')} inside What We Do Section
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close edit modal"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveService} className="space-y-5">
              {/* 1. Category / Pre-heading */}
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5 font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#008CFF]" />
                  <span>Category (Pre-heading: {editingService.number} / 03 &bull; Category)</span>
                </label>
                <input
                  type="text"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g. CREATIVE CONTENT"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white text-sm font-mono placeholder:text-white/30 focus:outline-none focus:border-[#008CFF] transition-colors"
                />
              </div>

              {/* 2. Title Line 1 & Line 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1.5 font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#008CFF]" />
                    <span>Title — Line 1</span>
                  </label>
                  <input
                    type="text"
                    value={formTitleLine1}
                    onChange={(e) => setFormTitleLine1(e.target.value)}
                    placeholder="e.g. CREATIVE"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white text-sm font-display font-bold uppercase placeholder:text-white/30 focus:outline-none focus:border-[#008CFF] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1.5 font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#008CFF]" />
                    <span>Title — Line 2</span>
                  </label>
                  <input
                    type="text"
                    value={formTitleLine2}
                    onChange={(e) => setFormTitleLine2(e.target.value)}
                    placeholder="e.g. CONTENT"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white text-sm font-display font-bold uppercase placeholder:text-white/30 focus:outline-none focus:border-[#008CFF] transition-colors"
                  />
                </div>
              </div>

              {/* 3. Matter / Description */}
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5 font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#008CFF]" />
                  <span>Matter / Detailed Narrative</span>
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  placeholder="Enter the capability matter and detailed service narrative..."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-black/70 border border-white/20 text-white text-sm font-sans placeholder:text-white/30 focus:outline-none focus:border-[#008CFF] transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* 4. Tag Pill Text */}
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5 font-bold flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#008CFF]" />
                  <span>Tag / Bottom Badge</span>
                </label>
                <input
                  type="text"
                  value={formTag}
                  onChange={(e) => setFormTag(e.target.value)}
                  placeholder="e.g. CREATIVE DIRECTION & HOOKS"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white text-sm font-mono placeholder:text-white/30 focus:outline-none focus:border-[#008CFF] transition-colors"
                />
              </div>

              {/* 5. 9:16 Vertical Slide Image & Optional Video */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <UploadingAwareCloudinaryUploader
                  label="9:16 Vertical Slide Image"
                  value={formImageUrl}
                  onChange={setFormImageUrl}
                  onUploadingChange={setIsImageUploading}
                  accept="image"
                  requireCloudinary
                  helpText="Upload a signed Cloudinary image, or enter a secure HTTPS/site-relative image URL."
                />

                <UploadingAwareCloudinaryUploader
                  label="Optional Video Reel"
                  value={formVideoUrl}
                  onChange={setFormVideoUrl}
                  onUploadingChange={setIsVideoUploading}
                  accept="video"
                  requireCloudinary
                  helpText="Optional. Upload a signed Cloudinary video, enter a secure HTTPS/site-relative URL, or clear it."
                />

                {/* Media Preview */}
                {(formImageUrl || formVideoUrl) && (
                  <div className="mt-2 p-3 bg-black/80 rounded-xl border border-white/15 flex items-center gap-4">
                    <div className="w-16 aspect-[9/16] rounded-lg overflow-hidden bg-black shrink-0 border border-white/20 shadow-md">
                      {formImageUrl ? (
                        <img
                          src={formImageUrl}
                          alt="Slide preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={formVideoUrl}
                          poster={formImageUrl}
                          muted
                          loop
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono uppercase text-[#008CFF] font-bold block">Live Slide Visual Preview</span>
                      <p className="text-xs font-mono text-white truncate">{formImageUrl || formVideoUrl}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="sticky -bottom-6 sm:-bottom-8 pt-4 pb-1 bg-[#0A0E17]/95 backdrop-blur-md border-t border-white/10 flex items-center justify-end gap-3 z-10">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || isMutating}
                  className="px-6 py-2.5 rounded-xl bg-[#008CFF] hover:bg-[#008CFF]/90 disabled:opacity-50 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,140,255,0.4)] active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>{isUploading ? 'Uploading Media...' : isMutating ? 'Saving...' : 'Save Pillar Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatWeDoCMS;
