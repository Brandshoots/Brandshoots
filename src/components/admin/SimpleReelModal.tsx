import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Edit3, Loader2, Plus, RefreshCw, X } from 'lucide-react';
import { CloudinaryUploader, isDurableMediaUrl } from './CloudinaryUploader';

export interface SimpleReelModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit' | 'replace';
  slotNumber?: number;
  initialData?: {
    src?: string;
    title?: string;
    client?: string;
    description?: string;
    poster?: string;
  };
  onSave: (data: {
    src: string;
    title: string;
    client: string;
    description?: string;
    poster: string;
  }) => Promise<void> | void;
  onClose: () => void;
}

export const SimpleReelModal: React.FC<SimpleReelModalProps> = ({
  isOpen,
  mode,
  slotNumber,
  initialData,
  onSave,
  onClose,
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('/Logo Official.svg');
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [isPosterUploading, setIsPosterUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setVideoUrl(initialData?.src || '');
    setPosterUrl(initialData?.poster || '/Logo Official.svg');
    setTitle(initialData?.title || '');
    setClient(initialData?.client || '');
    setDescription(initialData?.description || '');
    setIsVideoUploading(false);
    setIsPosterUploading(false);
    setIsSaving(false);
    setError(null);
  }, [
    isOpen,
    initialData?.src,
    initialData?.poster,
    initialData?.title,
    initialData?.client,
    initialData?.description,
  ]);

  if (!isOpen) return null;

  const isUploading = isVideoUploading || isPosterUploading;
  const isBusy = isUploading || isSaving;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isBusy) return;

    const cleanVideoUrl = videoUrl.trim();
    const cleanPosterUrl = posterUrl.trim();
    if (!isDurableMediaUrl(cleanVideoUrl)) {
      setError('Add a durable HTTPS or site-relative video URL before saving.');
      return;
    }
    if (!isDurableMediaUrl(cleanPosterUrl)) {
      setError('Add a durable HTTPS or site-relative poster URL before saving.');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSave({
        src: cleanVideoUrl,
        title:
          title.trim() ||
          (mode !== 'add' ? initialData?.title || 'Brand Reel' : 'Brand Reel'),
        client:
          client.trim() ||
          (mode !== 'add' ? initialData?.client || 'BrandShoots' : 'BrandShoots'),
        description: description.trim() || undefined,
        poster: cleanPosterUrl,
      });
    } catch (saveError) {
      console.error('Reel save failed:', saveError);
      setError(
        saveError instanceof Error ? saveError.message : 'Firebase could not save this reel.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0A0E17] border border-white/15 rounded-3xl w-full max-w-2xl p-6 sm:p-7 space-y-4 shadow-2xl my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              {mode === 'replace' ? (
                <RefreshCw className="w-4 h-4 text-white" />
              ) : mode === 'edit' ? (
                <Edit3 className="w-4 h-4 text-white" />
              ) : (
                <Plus className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider font-display">
                {mode === 'replace'
                  ? `Replace Reel (Slot #${slotNumber})`
                  : mode === 'edit'
                  ? `Edit Reel (Slot #${slotNumber})`
                  : 'Add Reel'}
              </h3>
              {slotNumber && (
                <p className="text-xs font-mono text-white/50">
                  Target: Slot #{slotNumber} on 3D Cylinder
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Close reel editor"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CloudinaryUploader
            label="Reel video"
            value={videoUrl}
            onChange={(url) => {
              setVideoUrl(url);
              setError(null);
            }}
            accept="video"
            helpText="Device files are uploaded with an authenticated, signed Cloudinary request."
            requireCloudinary
            onUploadingChange={setIsVideoUploading}
          />

          <CloudinaryUploader
            label="Reel poster"
            value={posterUrl}
            onChange={(url) => {
              setPosterUrl(url);
              setError(null);
            }}
            accept="image"
            helpText="Upload or replace the still image displayed before the reel plays."
            requireCloudinary
            onUploadingChange={setIsPosterUploading}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-1 font-semibold">
                Reel Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Brand Commercial"
                disabled={isBusy}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white text-sm font-sans focus:outline-none focus:border-white/50 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-1 font-semibold">
                Client Name
              </label>
              <input
                type="text"
                value={client}
                onChange={(event) => setClient(event.target.value)}
                placeholder="e.g. BrandShoots"
                disabled={isBusy}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white text-sm font-sans focus:outline-none focus:border-white/50 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1 font-semibold">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Brief campaign or production context for this reel..."
              disabled={isBusy}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white text-sm font-sans focus:outline-none focus:border-white/50 disabled:opacity-50 resize-none"
            />
          </div>

          {isDurableMediaUrl(videoUrl) && (
            <div className="rounded-2xl border border-white/10 bg-black/50 p-3">
              <p className="mb-2 text-[11px] font-mono uppercase tracking-wider text-white/55">
                Live Video Preview
              </p>
              <div className="mx-auto w-36 aspect-[9/16] overflow-hidden rounded-xl border border-white/15 bg-black">
                <video
                  src={videoUrl}
                  poster={isDurableMediaUrl(posterUrl) ? posterUrl : undefined}
                  controls
                  muted
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          {error && (
            <div
              className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/15 p-3 text-xs font-mono text-red-300"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-mono text-xs cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="px-6 py-2.5 rounded-xl bg-white hover:bg-white/90 text-black font-sans font-bold text-sm cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </span>
              ) : isUploading ? (
                'Uploading...'
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Done
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
