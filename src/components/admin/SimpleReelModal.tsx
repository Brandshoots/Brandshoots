import React, { useState, useRef, useEffect } from 'react';
import { Upload, Link as LinkIcon, CheckCircle2, X, RefreshCw, Plus, Loader2 } from 'lucide-react';

export interface SimpleReelModalProps {
  isOpen: boolean;
  mode: 'add' | 'replace';
  slotNumber?: number;
  initialData?: {
    src?: string;
    title?: string;
    client?: string;
    poster?: string;
  };
  onSave: (data: {
    src: string;
    title: string;
    client: string;
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
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize or reset when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      setVideoUrl(initialData?.src || '');
      setTitle(initialData?.title || '');
      setClient(initialData?.client || '');
      setIsDragging(false);
      setIsUploading(false);
      setUploadStatus('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  // Handle local file selection or drop
  const handleFile = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file (MP4, MOV, WEBM).');
      return;
    }

    // 1. Instant local preview
    const previewUrl = URL.createObjectURL(file);
    setVideoUrl(previewUrl);

    // If title is empty, prefill with filename
    if (!title.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName);
    }

    // 2. Upload to Cloudinary if cloud name is available
    const cloudName =
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
      localStorage.getItem('bs_cloudinary_cloud_name') ||
      '';

    if (cloudName.trim()) {
      setIsUploading(true);
      setUploadStatus('Uploading to Cloudinary CDN...');

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'brandshoots_unsigned');
        formData.append('folder', 'brandshoots');

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName.trim()}/video/upload`);

        xhr.onload = () => {
          setIsUploading(false);
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              const hostedUrl = res.secure_url || res.url;
              if (hostedUrl) {
                setVideoUrl(hostedUrl);
                setUploadStatus('Uploaded to Cloudinary CDN!');
              }
            } catch {
              // keep local previewUrl
            }
          }
        };

        xhr.onerror = () => {
          setIsUploading(false);
          // Keep local previewUrl as fallback
        };

        xhr.send(formData);
      } catch {
        setIsUploading(false);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) {
      alert('Please paste a video URL or upload a video file.');
      return;
    }

    onSave({
      src: videoUrl.trim(),
      title: title.trim() || (mode === 'replace' ? initialData?.title || 'Brand Reel' : 'Brand Reel'),
      client: client.trim() || (mode === 'replace' ? initialData?.client || 'BrandShoots' : 'BrandShoots'),
      poster: initialData?.poster || '/Logo Official.svg',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0A0E17] border border-white/15 rounded-3xl w-full max-w-lg p-6 sm:p-7 space-y-4 shadow-2xl my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              {mode === 'replace' ? (
                <RefreshCw className="w-4 h-4 text-white" />
              ) : (
                <Plus className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider font-display">
                {mode === 'replace' ? `Replace Reel (Slot #${slotNumber})` : 'Add Reel'}
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
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Paste Video URL / Link */}
          <div>
            <label className="block text-xs font-mono uppercase text-white/70 mb-1.5 font-semibold flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-white/70" />
              <span>Paste Video URL or Link</span>
            </label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="e.g. /reels/... or https://res.cloudinary.com/.../video.mp4"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white text-sm font-sans placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider">or upload file</span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          {/* 2. Drag & Drop or Click to Browse */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
              isDragging
                ? 'border-white bg-white/15 scale-[1.01]'
                : isUploading
                ? 'border-white/60 bg-white/10'
                : 'border-white/15 hover:border-white/40 bg-black/40 hover:bg-white/[0.03]'
            }`}
          >
            {isUploading ? (
              <div className="flex items-center gap-2 text-xs font-mono text-white py-1">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
                <span>{uploadStatus}</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-sans font-semibold text-white">
                    Click to browse or drag & drop video here
                  </p>
                  <p className="text-[10px] font-mono text-white/40 mt-0.5">
                    Supports MP4, MOV, WEBM reels
                  </p>
                </div>
              </>
            )}
          </div>

          {/* 3. Live Video Preview (As requested: "after pasting preview must also come") */}
          {videoUrl.trim() && (
            <div className="rounded-2xl overflow-hidden border border-white/15 bg-black/90 p-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Live Video Preview
                </span>
                <button
                  type="button"
                  onClick={() => setVideoUrl('')}
                  className="text-white/40 hover:text-white transition-colors text-[11px] cursor-pointer"
                >
                  Clear Video
                </button>
              </div>

              {/* Video Player Preview */}
              <div className="relative w-full aspect-video max-h-48 rounded-xl overflow-hidden bg-black flex items-center justify-center">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  muted
                  playsInline
                  loop
                  className="w-full h-full object-contain bg-black"
                />
              </div>
            </div>
          )}

          {/* 4. Title and Client Inputs */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-1 font-semibold">
                Reel Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Brand Commercial"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white text-sm font-sans focus:outline-none focus:border-white/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-white/70 mb-1 font-semibold">
                Client Name
              </label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="e.g. BrandShoots"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white text-sm font-sans focus:outline-none focus:border-white/50"
              />
            </div>
          </div>

          {/* 5. Modal Footer: Cancel and Done button ("then done buccont") */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-mono text-xs cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-white hover:bg-white/90 text-black font-sans font-bold text-sm cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
