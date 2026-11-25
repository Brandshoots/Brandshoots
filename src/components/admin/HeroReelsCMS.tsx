import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Edit3,
  Eye,
  EyeOff,
  Film,
  GripVertical,
  Loader2,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { CMSHeroReel } from '../../types/cms';
import { fetchPublishedHeroReels, saveHeroReels } from '../../lib/cms/cmsService';
import { INITIAL_HERO_REELS } from '../../lib/cms/seedData';
import { pushUndoAction } from '../../lib/cms/cmsHistory';
import { SimpleReelModal } from './SimpleReelModal';
import { isDurableMediaUrl } from './CloudinaryUploader';

export const HeroReelsCMS: React.FC = () => {
  const [publishedReels, setPublishedReels] = useState<CMSHeroReel[]>(INITIAL_HERO_REELS);
  const [reels, setReels] = useState<CMSHeroReel[]>(INITIAL_HERO_REELS);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<{ reel: CMSHeroReel; index: number } | null>(null);
  const [replacingReel, setReplacingReel] = useState<{ reel: CMSHeroReel; index: number } | null>(null);
  const [previewReel, setPreviewReel] = useState<CMSHeroReel | null>(null);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchPublishedHeroReels()
      .then((data) => {
        if (!mounted) return;
        const resolved = Array.isArray(data) && data.length > 0 ? data : INITIAL_HERO_REELS;
        setPublishedReels(resolved);
        setReels(resolved);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Unable to load published hero reels.');
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    const handleExternalUpdate = (event: Event) => {
      const detail = (event as CustomEvent<CMSHeroReel[]>).detail;
      if (Array.isArray(detail)) {
        setPublishedReels(detail);
        setReels(detail);
        setHasUnsavedChanges(false);
      }
    };
    window.addEventListener('brandshoots_hero_reels_updated', handleExternalUpdate);
    return () => {
      mounted = false;
      window.removeEventListener('brandshoots_hero_reels_updated', handleExternalUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3500);
  };

  const activeCount = useMemo(
    () => reels.filter((reel) => reel.visible !== false).length,
    [reels]
  );

  const hasLegacyReels = useMemo(
    () =>
      reels.some(
        (r) =>
          r.src.startsWith('blob:') ||
          (!r.src.startsWith('/reels/hero-final/') && !r.src.startsWith('https://'))
      ),
    [reels]
  );

  const updateDraft = (next: CMSHeroReel[]) => {
    const normalized = next.map((reel, idx) => ({
      ...reel,
      order: idx,
    }));
    setReels(normalized);
    setHasUnsavedChanges(true);
    setError(null);
  };

  const handlePublishAll = async () => {
    if (isPublishing) return;
    setIsPublishing(true);
    setError(null);

    const timestamp = Date.now();
    const normalized = reels.map((reel, idx) => ({
      ...reel,
      lightSrc: reel.lightSrc || reel.src,
      order: idx,
      updatedAt: timestamp,
    }));

    try {
      await saveHeroReels(normalized);
      pushUndoAction(`Published ${normalized.length} Hero Reels`, publishedReels);
      setPublishedReels(normalized);
      setReels(normalized);
      setHasUnsavedChanges(false);
      showToast(`Published ${normalized.length} hero reels (${activeCount} active) to live site.`);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : 'Firebase could not publish hero reels.'
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDiscardChanges = () => {
    setReels(publishedReels);
    setHasUnsavedChanges(false);
    setError(null);
    showToast('Reverted unpublished edits.');
  };

  const handleLoadApprovedReels = () => {
    updateDraft(INITIAL_HERO_REELS);
    showToast('Loaded all 17 approved reels from Reels Hero Section. Click "Save & Publish Changes" to go live.');
  };

  const handleAddReel = (data: {
    src: string;
    title: string;
    client: string;
    description?: string;
    poster: string;
  }) => {
    if (!isDurableMediaUrl(data.src) || !isDurableMediaUrl(data.poster)) {
      throw new Error('Reel video and poster must use durable HTTPS or site-relative URLs.');
    }
    const newReel: CMSHeroReel = {
      id: `hero-reel-${Date.now()}`,
      title: data.title,
      client: data.client,
      description: data.description,
      src: data.src,
      lightSrc: data.src,
      poster: data.poster,
      order: reels.length,
      visible: true,
      updatedAt: Date.now(),
    };
    updateDraft([...reels, newReel]);
    setIsAddOpen(false);
    showToast(`Added "${data.title}". Click "Save & Publish Changes" to publish.`);
  };

  const handleEditReel = (data: {
    src: string;
    title: string;
    client: string;
    description?: string;
    poster: string;
  }) => {
    if (!editingReel) return;
    if (!isDurableMediaUrl(data.src) || !isDurableMediaUrl(data.poster)) {
      throw new Error('Reel video and poster must use durable HTTPS or site-relative URLs.');
    }
    const updated = reels.map((item) =>
      item.id === editingReel.reel.id
        ? {
            ...item,
            title: data.title,
            client: data.client,
            description: data.description,
            src: data.src,
            lightSrc: data.src,
            poster: data.poster,
            updatedAt: Date.now(),
          }
        : item
    );
    updateDraft(updated);
    setEditingReel(null);
    showToast(`Updated "${data.title}". Click "Save & Publish Changes" to publish.`);
  };

  const handleReplaceReel = (data: {
    src: string;
    title: string;
    client: string;
    description?: string;
    poster: string;
  }) => {
    if (!replacingReel) return;
    if (!isDurableMediaUrl(data.src) || !isDurableMediaUrl(data.poster)) {
      throw new Error('Reel video and poster must use durable HTTPS or site-relative URLs.');
    }
    const updated = reels.map((item) =>
      item.id === replacingReel.reel.id
        ? {
            ...item,
            title: data.title,
            client: data.client,
            description: data.description,
            src: data.src,
            lightSrc: data.src,
            poster: data.poster,
            updatedAt: Date.now(),
          }
        : item
    );
    updateDraft(updated);
    setReplacingReel(null);
    showToast(`Replaced Slot #${replacingReel.index + 1}. Click "Save & Publish Changes" to publish.`);
  };

  const handleDeleteReel = (id: string) => {
    const target = reels.find((r) => r.id === id);
    updateDraft(reels.filter((r) => r.id !== id));
    showToast(`Removed "${target?.title || 'Reel'}". Click "Save & Publish Changes" to publish.`);
  };

  const handleToggleVisible = (id: string) => {
    updateDraft(
      reels.map((r) => (r.id === id ? { ...r, visible: r.visible === false ? true : false } : r))
    );
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= reels.length) return;
    const copy = [...reels];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    updateDraft(copy);
  };

  const handleDropOnCard = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const copy = [...reels];
    const [moved] = copy.splice(draggedIndex, 1);
    copy.splice(dropIndex, 0, moved);
    setDraggedIndex(null);
    setDragOverIndex(null);
    updateDraft(copy);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white flex items-center gap-2.5">
              <Film className="w-6 h-6 text-[#008CFF]" />
              Hero Reels Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#008CFF]/15 border border-[#008CFF]/35 text-[11px] font-mono font-bold text-[#7CC4FF]">
              {activeCount} / {reels.length} Active
            </span>
            {hasUnsavedChanges && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-[11px] font-mono font-bold text-amber-300">
                Unpublished Changes
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm font-sans text-white/60 mt-1.5">
            Drag and drop to reorder reels, upload or replace videos, edit titles &amp; descriptions, manage posters, preview playback, and publish live to the homepage 3D carousel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleLoadApprovedReels}
            disabled={isPublishing}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/85 font-mono text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#008CFF]" />
            <span>Load Approved 17 Reels</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setError(null);
              setIsAddOpen(true);
            }}
            disabled={isPublishing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-white/90 text-black font-sans font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Reel</span>
          </button>

          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={handleDiscardChanges}
              disabled={isPublishing}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/70 font-mono text-xs transition-all cursor-pointer disabled:opacity-50"
            >
              Discard
            </button>
          )}

          <button
            type="button"
            onClick={handlePublishAll}
            disabled={isPublishing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50 ${
              hasUnsavedChanges
                ? 'bg-[#008CFF] hover:bg-[#0070CC] text-white shadow-[0_0_24px_rgba(0,140,255,0.45)]'
                : 'bg-[#008CFF]/20 hover:bg-[#008CFF]/30 border border-[#008CFF]/40 text-[#7CC4FF]'
            }`}
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save &amp; Publish Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Legacy Warning Banner */}
      {hasLegacyReels && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs font-mono text-amber-200">
            Legacy or broken reel URLs detected in the current list. Click <strong>Load Approved 17 Reels</strong> and then <strong>Save &amp; Publish Changes</strong> to sync all 17 approved reels from <code>Reels Hero Section</code>.
          </p>
          <button
            type="button"
            onClick={handleLoadApprovedReels}
            className="shrink-0 px-3.5 py-2 rounded-lg bg-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-amber-300"
          >
            Load Approved 17 Reels
          </button>
        </div>
      )}

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 font-mono text-sm flex items-start gap-2" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-white/10 bg-[#070B12]/80">
          <div className="flex items-center gap-3 text-sm text-white/55 font-mono">
            <Loader2 className="w-5 h-5 animate-spin text-[#008CFF]" />
            Loading published hero reels...
          </div>
        </div>
      ) : reels.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-[#070B12]/70 px-6 py-16 text-center">
          <Film className="mx-auto h-9 w-9 text-white/20" />
          <h2 className="mt-4 text-base font-bold text-white">No hero reels configured</h2>
          <p className="mx-auto mt-2 max-w-md text-xs font-mono text-white/50">
            Upload a new reel or load the 17 approved reels from Reels Hero Section.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          {reels.map((reel, index) => {
            const isDisabled = reel.visible === false;
            const isDropTarget = dragOverIndex === index && draggedIndex !== index;

            return (
              <div
                key={reel.id}
                draggable={!isPublishing}
                onDragStart={() => setDraggedIndex(index)}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (dragOverIndex !== index) setDragOverIndex(index);
                }}
                onDragLeave={() => {
                  if (dragOverIndex === index) setDragOverIndex(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDropOnCard(index);
                }}
                onDragEnd={() => {
                  setDraggedIndex(null);
                  setDragOverIndex(null);
                }}
                className={`group relative rounded-2xl overflow-hidden bg-[#0A0D14] border flex flex-col transition-all ${
                  isDropTarget
                    ? 'border-[#008CFF] ring-2 ring-[#008CFF]/50 scale-[1.01]'
                    : isDisabled
                    ? 'border-white/5 opacity-60'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                {/* 9:16 Poster & Video Preview */}
                <div className="relative w-full aspect-[9/16] bg-black overflow-hidden">
                  <img
                    src={reel.poster}
                    alt={reel.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />

                  {/* Top Left: Drag Handle + Slot Index */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                    <div
                      className="px-2 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-white flex items-center gap-1 cursor-grab active:cursor-grabbing"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-3.5 h-3.5 text-white/60" />
                      <span>#{index + 1}</span>
                    </div>
                  </div>

                  {/* Top Right: Action Buttons */}
                  <div className="absolute top-2.5 right-2.5 grid grid-cols-2 gap-1.5 z-10">
                    <button
                      type="button"
                      onClick={() => handleMove(index, -1)}
                      disabled={isPublishing || index === 0}
                      className="w-8 h-8 rounded-lg bg-black/85 hover:bg-white border border-white/20 text-white hover:text-black flex items-center justify-center transition-all cursor-pointer disabled:opacity-30"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, 1)}
                      disabled={isPublishing || index === reels.length - 1}
                      className="w-8 h-8 rounded-lg bg-black/85 hover:bg-white border border-white/20 text-white hover:text-black flex items-center justify-center transition-all cursor-pointer disabled:opacity-30"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleVisible(reel.id)}
                      disabled={isPublishing}
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                        isDisabled
                          ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                          : 'bg-black/85 hover:bg-[#008CFF] border-white/20 text-white'
                      }`}
                      title={isDisabled ? 'Enable reel' : 'Disable reel'}
                    >
                      {isDisabled ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewReel(reel)}
                      className="w-8 h-8 rounded-lg bg-black/85 hover:bg-[#008CFF] border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                      title="Preview video"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingReel({ reel, index })}
                      disabled={isPublishing}
                      className="w-8 h-8 rounded-lg bg-black/85 hover:bg-white border border-white/20 text-white hover:text-black flex items-center justify-center transition-all cursor-pointer"
                      title="Edit title, description & poster"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplacingReel({ reel, index })}
                      disabled={isPublishing}
                      className="w-8 h-8 rounded-lg bg-black/85 hover:bg-white border border-white/20 text-white hover:text-black flex items-center justify-center transition-all cursor-pointer"
                      title="Replace reel video"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteReel(reel.id)}
                      disabled={isPublishing}
                      className="col-span-2 w-full h-8 rounded-lg bg-black/85 hover:bg-red-600 border border-white/20 hover:border-red-600 text-white flex items-center justify-center gap-1.5 text-[11px] font-mono transition-all cursor-pointer"
                      title="Delete reel"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                  {isDisabled && (
                    <div className="absolute inset-x-0 bottom-0 bg-black/85 px-3 py-2 text-center text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
                      Disabled (Hidden on Homepage)
                    </div>
                  )}
                </div>

                {/* Card Details */}
                <div className="p-3.5 bg-black/85 border-t border-white/10 flex-1 flex flex-col justify-between gap-2">
                  <div>
                    <h3 className="font-sans text-sm font-bold text-white leading-snug line-clamp-1">
                      {reel.title || 'Untitled Reel'}
                    </h3>
                    <p className="mt-0.5 text-[11px] font-mono font-semibold text-[#008CFF] truncate">
                      {reel.client || 'BrandShoots'}
                    </p>
                    {reel.description && (
                      <p className="mt-1.5 text-xs font-sans text-white/55 line-clamp-2">
                        {reel.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload New Reel Modal */}
      <SimpleReelModal
        isOpen={isAddOpen}
        mode="add"
        onClose={() => setIsAddOpen(false)}
        onSave={handleAddReel}
      />

      {/* Edit Reel Metadata & Poster Modal */}
      <SimpleReelModal
        isOpen={editingReel !== null}
        mode="edit"
        slotNumber={editingReel ? editingReel.index + 1 : undefined}
        initialData={editingReel?.reel}
        onClose={() => setEditingReel(null)}
        onSave={handleEditReel}
      />

      {/* Replace Reel Modal */}
      <SimpleReelModal
        isOpen={replacingReel !== null}
        mode="replace"
        slotNumber={replacingReel ? replacingReel.index + 1 : undefined}
        initialData={replacingReel?.reel}
        onClose={() => setReplacingReel(null)}
        onSave={handleReplaceReel}
      />

      {/* Video Preview Modal */}
      {previewReel && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewReel(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-[#0A0E17] border border-white/15 p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-display font-bold text-base uppercase text-white">
                  {previewReel.title}
                </h3>
                <p className="text-xs font-mono text-[#008CFF]">{previewReel.client}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewReel(null)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/75"
                aria-label="Close preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mx-auto w-64 aspect-[9/16] overflow-hidden rounded-2xl border border-white/15 bg-black">
              <video
                src={previewReel.src}
                poster={previewReel.poster}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {previewReel.description && (
              <p className="text-xs font-sans text-white/70 text-center">
                {previewReel.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroReelsCMS;
