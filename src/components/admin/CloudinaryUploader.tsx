import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Film,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader2,
  X,
  FileVideo,
  FileImage,
  RefreshCw,
  Sparkles,
  Link as LinkIcon,
  HardDrive,
} from 'lucide-react';

export interface CloudinaryUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: 'video' | 'image' | 'both';
  helpText?: string;
}

export const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({
  label,
  value,
  onChange,
  accept = 'both',
  helpText,
}) => {
  const [mode, setMode] = useState<'device' | 'url'>('device');
  const [manualUrl, setManualUrl] = useState(value || '');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [inlineCloudName, setInlineCloudName] = useState(() => {
    return (
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
      localStorage.getItem('bs_cloudinary_cloud_name') ||
      ''
    );
  });
  const [showCloudPrompt, setShowCloudPrompt] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setManualUrl(value || '');
  }, [value]);

  const isVideo =
    value?.startsWith('data:video') ||
    value?.endsWith('.mp4') ||
    value?.endsWith('.mov') ||
    value?.endsWith('.webm') ||
    value?.endsWith('.m4v') ||
    value?.includes('/video/') ||
    value?.includes('/reels/');

  const isImage = value && !isVideo;

  // Convert file to local Data URL (Base64) - Works 100% offline or direct
  const convertFileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file from device.'));
      reader.readAsDataURL(file);
    });
  };

  // Upload to Cloudinary CDN
  const uploadToCloudinary = async (file: File, cloudName: string): Promise<string> => {
    const isVideoFile = file.type.startsWith('video/');
    const resourceType = isVideoFile ? 'video' : 'image';
    const timestamp = Math.round(new Date().getTime() / 1000);

    const paramsToSign = {
      timestamp,
      folder: 'brandshoots',
    };

    let signatureData: { signature: string; apiKey: string; timestamp: number } | null = null;
    try {
      const signRes = await fetch('/api/cloudinary-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paramsToSign }),
      });
      if (signRes.ok) {
        signatureData = await signRes.json();
      }
    } catch {
      // fallback
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', timestamp.toString());
    formData.append('folder', 'brandshoots');

    if (signatureData?.signature) {
      formData.append('api_key', signatureData.apiKey);
      formData.append('signature', signatureData.signature);
    } else {
      formData.append('upload_preset', 'brandshoots_unsigned');
    }

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName.trim()}/${resourceType}/upload`);

      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const pct = Math.round((evt.loaded / evt.total) * 95);
          setProgress(pct);
          setStatusMessage(`Uploading to Cloudinary CDN (${pct}%)...`);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            setProgress(100);
            resolve(data.secure_url || data.url);
          } catch {
            reject(new Error('Invalid response from Cloudinary.'));
          }
        } else {
          try {
            const errData = JSON.parse(xhr.responseText);
            reject(new Error(errData?.error?.message || `Upload failed with status ${xhr.status}`));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Network connection error during file upload.'));
      xhr.send(formData);
    });
  };

  // Main file processing handler
  const processFile = async (file: File) => {
    setError(null);
    setShowCloudPrompt(false);
    setIsUploading(true);
    setProgress(5);
    setStatusMessage('Reading file from device...');

    const isVideoFile = file.type.startsWith('video/') || file.name.match(/\.(mp4|mov|webm|m4v)$/i);
    const isImageFile = file.type.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png|webp|svg|gif)$/i);

    const activeCloudName =
      inlineCloudName ||
      localStorage.getItem('bs_cloudinary_cloud_name') ||
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
      '';

    try {
      // 1. If Image File:
      if (isImageFile) {
        if (activeCloudName) {
          try {
            setStatusMessage('Uploading image to Cloudinary...');
            const cdnUrl = await uploadToCloudinary(file, activeCloudName);
            onChange(cdnUrl);
            setManualUrl(cdnUrl);
            setIsUploading(false);
            return;
          } catch (cloudErr: any) {
            console.warn('Cloudinary image upload failed, falling back to direct Data URL:', cloudErr);
          }
        }
        // Direct conversion fallback (Guaranteed to always work from device!)
        setStatusMessage('Embedding image from device...');
        setProgress(60);
        const dataUrl = await convertFileToDataUrl(file);
        setProgress(100);
        onChange(dataUrl);
        setManualUrl(dataUrl);
        setIsUploading(false);
        return;
      }

      // 2. If Video File (Reel):
      if (isVideoFile) {
        if (activeCloudName) {
          setStatusMessage('Uploading video reel to Cloudinary CDN...');
          const cdnUrl = await uploadToCloudinary(file, activeCloudName);
          onChange(cdnUrl);
          setManualUrl(cdnUrl);
          setIsUploading(false);
          return;
        }

        // If no cloud name set, check file size:
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB <= 12) {
          // If reel is under 12MB, can convert directly as data URL!
          setStatusMessage('Processing compact video from device...');
          setProgress(50);
          const dataUrl = await convertFileToDataUrl(file);
          setProgress(100);
          onChange(dataUrl);
          setManualUrl(dataUrl);
          setIsUploading(false);
          return;
        }

        // Otherwise prompt for Cloudinary Cloud Name for large video
        setPendingFile(file);
        setShowCloudPrompt(true);
        setIsUploading(false);
        return;
      }

      throw new Error(`Unsupported file type: ${file.type || file.name}`);
    } catch (err: any) {
      console.error('File process error:', err);
      setError(err?.message || 'Failed to process file from device.');
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSaveCloudNameAndUpload = async () => {
    if (!inlineCloudName.trim()) {
      setError('Please enter a Cloudinary Cloud Name (e.g., brandshoots or your account cloud name).');
      return;
    }
    localStorage.setItem('bs_cloudinary_cloud_name', inlineCloudName.trim());
    setShowCloudPrompt(false);
    if (pendingFile) {
      await processFile(pendingFile);
      setPendingFile(null);
    }
  };

  const handleManualApply = () => {
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      setError(null);
    }
  };

  const handleClear = () => {
    onChange('');
    setManualUrl('');
    setError(null);
    setShowCloudPrompt(false);
    setPendingFile(null);
  };

  return (
    <div className="w-full space-y-2.5 bg-black/30 p-3.5 rounded-2xl border border-white/10">
      {/* Label & Mode Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/80 flex items-center gap-2">
          {accept === 'video' ? (
            <FileVideo className="w-3.5 h-3.5 text-[#008CFF]" />
          ) : accept === 'image' ? (
            <FileImage className="w-3.5 h-3.5 text-[#008CFF]" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-[#008CFF]" />
          )}
          <span>{label}</span>
        </label>

        {/* Device vs URL Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-black/60 border border-white/10 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('device')}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'device'
                ? 'bg-[#008CFF] text-white shadow-[0_0_12px_rgba(0,140,255,0.4)]'
                : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <HardDrive className="w-3 h-3" />
            <span>Upload from Device</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'url'
                ? 'bg-[#008CFF] text-white shadow-[0_0_12px_rgba(0,140,255,0.4)]'
                : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Enter URL</span>
          </button>
        </div>
      </div>

      {/* 1. DEVICE UPLOAD MODE */}
      {mode === 'device' && (
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept={
              accept === 'video'
                ? 'video/mp4,video/quicktime,video/webm,video/x-m4v,video/*'
                : accept === 'image'
                ? 'image/jpeg,image/png,image/webp,image/svg+xml,image/gif,image/*'
                : 'video/*,image/*'
            }
            onChange={handleFileChange}
            className="hidden"
            id={`device-upload-${label.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
              isDragging
                ? 'border-[#008CFF] bg-[#008CFF]/15 scale-[1.01]'
                : isUploading
                ? 'border-[#008CFF]/80 bg-[#008CFF]/10'
                : 'border-white/15 hover:border-[#008CFF] bg-black/40 hover:bg-[#008CFF]/5'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-3 w-full max-w-sm py-2">
                <Loader2 className="w-6 h-6 text-[#008CFF] animate-spin" />
                <div className="text-center space-y-1">
                  <p className="text-xs font-mono font-bold text-white">{statusMessage}</p>
                  <p className="text-[10px] font-mono text-[#008CFF]">{progress}% Completed</p>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden border border-white/10">
                  <div
                    className="bg-gradient-to-r from-[#008CFF] to-cyan-400 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-[#008CFF]/10 border border-[#008CFF]/30 flex items-center justify-center text-[#008CFF] shadow-[0_0_20px_rgba(0,140,255,0.2)]">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs font-mono font-bold text-white tracking-wide">
                    Click to browse from your device or drag & drop here
                  </p>
                  <p className="text-[10px] font-mono text-white/50">
                    {accept === 'video'
                      ? 'Supports MP4, MOV, WEBM reels (Any size)'
                      : accept === 'image'
                      ? 'Supports PNG, JPG, WEBP, SVG images'
                      : 'Supports video reels (.mp4, .mov) and images (.png, .jpg, .webp)'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-[#008CFF] text-white font-mono text-[10px] uppercase font-bold tracking-wider transition-all"
                >
                  Browse Device Files
                </button>
              </>
            )}
          </div>

          {/* Inline Cloudinary Cloud Name Setup Prompt (if large video uploaded and cloud name missing) */}
          {showCloudPrompt && (
            <div className="p-4 rounded-xl bg-[#008CFF]/15 border border-[#008CFF]/40 space-y-3">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#008CFF] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase">
                    Cloudinary Video Hosting Setup
                  </h4>
                  <p className="text-[11px] font-mono text-white/70 mt-0.5 leading-relaxed">
                    To host high-resolution video reels from your device, enter your Cloudinary Cloud Name below (found in your Cloudinary Dashboard):
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={inlineCloudName}
                  onChange={(e) => setInlineCloudName(e.target.value)}
                  placeholder="e.g. brandshoots or dxxxx"
                  className="flex-1 px-3 py-2 rounded-lg bg-black/80 border border-white/20 text-white font-mono text-xs focus:border-[#008CFF] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveCloudNameAndUpload}
                  className="px-4 py-2 rounded-lg bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs uppercase font-bold tracking-wider shrink-0 cursor-pointer shadow-[0_0_15px_rgba(0,140,255,0.4)]"
                >
                  Save & Upload Reel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. DIRECT URL MODE */}
      {mode === 'url' && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="e.g. /reels/sample.mp4 or https://res.cloudinary.com/..."
              className="w-full px-3 py-2.5 bg-black/60 border border-white/15 rounded-xl text-xs font-mono text-white placeholder-white/30 focus:border-[#008CFF] focus:outline-none transition-colors"
            />
            {manualUrl && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                title="Clear"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleManualApply}
            className="px-4 py-2.5 bg-white/10 hover:bg-[#008CFF] text-white text-xs font-mono uppercase font-bold tracking-wider rounded-xl transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply URL</span>
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {helpText && <p className="text-[10px] text-white/40 font-mono">{helpText}</p>}

      {/* 3. ACTIVE MEDIA PREVIEW CARD */}
      {value && (
        <div className="p-3 bg-black/70 border border-white/15 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {isVideo ? (
              <div className="relative w-20 h-14 bg-black rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-md">
                <video
                  src={value}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  autoPlay
                  loop
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                <Film className="absolute bottom-1 right-1 w-3.5 h-3.5 text-[#008CFF]" />
              </div>
            ) : isImage ? (
              <div className="relative w-20 h-14 bg-[#0A0E17] rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-md flex items-center justify-center p-1">
                <img src={value} alt="Preview" className="w-full h-full object-contain" />
                <ImageIcon className="absolute bottom-1 right-1 w-3.5 h-3.5 text-[#008CFF]" />
              </div>
            ) : null}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-emerald-400">
                  {isVideo ? 'Active Reel Ready' : 'Active Image Ready'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-white/70 truncate mt-0.5 max-w-md" title={value}>
                {value.startsWith('data:') ? 'Embedded Media from Device (Base64)' : value}
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => {
                setMode('device');
                setTimeout(() => fileInputRef.current?.click(), 50);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#008CFF] text-white text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1 transition-all cursor-pointer"
              title="Replace this media with a new file from your device"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Replace</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Remove media"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
