import React, { useEffect, useRef, useState } from 'react';
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
import { firebaseAuth } from '../../lib/firebase';

const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
]);
const VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-m4v',
]);
const IMAGE_MAX_BYTES = 15 * 1024 * 1024;
const VIDEO_MAX_BYTES = 250 * 1024 * 1024;
const UPLOAD_TIMEOUT_MS = 10 * 60 * 1000;

type UploadKind = 'image' | 'video';

type SignedUploadDescriptor = {
  cloudName: string;
  apiKey: string;
  signature: string;
  timestamp: number;
  folder: string;
};

export interface CloudinaryUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: 'video' | 'image' | 'both';
  helpText?: string;
  /** @deprecated Device uploads are always signed and Cloudinary-hosted. */
  requireCloudinary?: boolean;
  onUploadingChange?: (isUploading: boolean) => void;
}

export function isDurableMediaUrl(candidate: string): boolean {
  const value = candidate.trim();
  if (!value || /^(?:data:|blob:|http:)/i.test(value) || value.startsWith('//')) return false;
  if (value.startsWith('/')) return true;

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && Boolean(parsed.hostname) && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}

function isExpectedCloudinaryUrl(candidate: unknown, cloudName: string): candidate is string {
  if (typeof candidate !== 'string') return false;

  try {
    const parsed = new URL(candidate);
    return (
      parsed.origin === 'https://res.cloudinary.com' &&
      !parsed.username &&
      !parsed.password &&
      parsed.pathname.startsWith(`/${cloudName}/`)
    );
  } catch {
    return false;
  }
}

function parseUploadDescriptor(value: unknown): SignedUploadDescriptor {
  if (!value || typeof value !== 'object') {
    throw new Error('The upload service returned an invalid signing response.');
  }

  const descriptor = value as Partial<SignedUploadDescriptor>;
  if (
    typeof descriptor.cloudName !== 'string' ||
    !/^[a-zA-Z0-9_-]+$/.test(descriptor.cloudName) ||
    typeof descriptor.apiKey !== 'string' ||
    !descriptor.apiKey.trim() ||
    typeof descriptor.signature !== 'string' ||
    !/^[a-f0-9]{40}$/i.test(descriptor.signature) ||
    typeof descriptor.timestamp !== 'number' ||
    !Number.isInteger(descriptor.timestamp) ||
    descriptor.timestamp <= 0 ||
    descriptor.folder !== 'brandshoots'
  ) {
    throw new Error('The upload service returned an incomplete signing response.');
  }

  return descriptor as SignedUploadDescriptor;
}

function getFileKind(file: File): UploadKind | null {
  const mimeType = file.type.toLowerCase();
  if (IMAGE_MIME_TYPES.has(mimeType)) return 'image';
  if (VIDEO_MIME_TYPES.has(mimeType)) return 'video';
  return null;
}

function mediaValueIsVideo(value: string): boolean {
  if (!value) return false;

  try {
    const pathname = value.startsWith('/') ? value : new URL(value).pathname;
    return /\.(?:mp4|mov|webm|m4v)$/i.test(pathname) || pathname.includes('/video/');
  } catch {
    return false;
  }
}

export const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({
  label,
  value,
  onChange,
  accept = 'both',
  helpText,
  onUploadingChange,
}) => {
  const [mode, setMode] = useState<'device' | 'url'>('device');
  const [manualUrl, setManualUrl] = useState(value || '');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeRequestRef = useRef<XMLHttpRequest | null>(null);
  const uploadLockRef = useRef(false);
  const onUploadingChangeRef = useRef(onUploadingChange);

  useEffect(() => {
    onUploadingChangeRef.current = onUploadingChange;
  }, [onUploadingChange]);

  useEffect(() => {
    setManualUrl(value || '');
  }, [value]);

  useEffect(() => {
    return () => {
      uploadLockRef.current = false;
      activeRequestRef.current?.abort();
      onUploadingChangeRef.current?.(false);
    };
  }, []);

  const updateUploading = (nextValue: boolean) => {
    setIsUploading(nextValue);
    onUploadingChangeRef.current?.(nextValue);
  };

  const requestUploadDescriptor = async (): Promise<SignedUploadDescriptor> => {
    const user = firebaseAuth.currentUser;
    if (!user) {
      throw new Error('Your administrator session expired. Sign in again before uploading.');
    }

    const idToken = await user.getIdToken();
    const response = await fetch('/api/cloudinary-sign', {
      method: 'POST',
      headers: { Authorization: `Bearer ${idToken}` },
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.error || 'The signed upload request failed.');
    }

    return parseUploadDescriptor(payload);
  };

  const uploadToCloudinary = (
    file: File,
    kind: UploadKind,
    descriptor: SignedUploadDescriptor
  ): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', descriptor.apiKey);
    formData.append('signature', descriptor.signature);
    formData.append('timestamp', descriptor.timestamp.toString());
    formData.append('folder', descriptor.folder);

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      let settled = false;
      activeRequestRef.current = xhr;

      const finish = (callback: () => void) => {
        if (settled) return;
        settled = true;
        if (activeRequestRef.current === xhr) activeRequestRef.current = null;
        callback();
      };

      xhr.open(
        'POST',
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(descriptor.cloudName)}/${kind}/upload`
      );
      xhr.timeout = UPLOAD_TIMEOUT_MS;

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const percentage = Math.min(95, Math.round((event.loaded / event.total) * 95));
        setProgress(percentage);
        setStatusMessage(`Uploading to Cloudinary CDN (${percentage}%)...`);
      };

      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          finish(() => {
            try {
              const response = JSON.parse(xhr.responseText);
              reject(new Error(response?.error?.message || `Upload failed with status ${xhr.status}.`));
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}.`));
            }
          });
          return;
        }

        finish(() => {
          try {
            const response = JSON.parse(xhr.responseText);
            if (!isExpectedCloudinaryUrl(response?.secure_url, descriptor.cloudName)) {
              reject(new Error('Cloudinary returned an unexpected or insecure media URL.'));
              return;
            }
            setProgress(100);
            resolve(response.secure_url);
          } catch (uploadError) {
            reject(
              uploadError instanceof Error
                ? uploadError
                : new Error('Cloudinary returned an invalid response.')
            );
          }
        });
      };

      xhr.onerror = () => finish(() => reject(new Error('A network error interrupted the upload.')));
      xhr.ontimeout = () =>
        finish(() => reject(new Error('The upload timed out. Check your connection and try again.')));
      xhr.onabort = () => finish(() => reject(new Error('The upload was cancelled.')));
      xhr.send(formData);
    });
  };

  const processFile = async (file: File) => {
    if (uploadLockRef.current) return;

    setError(null);
    setProgress(0);
    setStatusMessage('Validating file...');

    const kind = getFileKind(file);
    if (!kind || (accept !== 'both' && kind !== accept)) {
      setError(`Choose a supported ${accept === 'both' ? 'image or video' : accept} file.`);
      return;
    }

    if (file.size <= 0) {
      setError('The selected file is empty.');
      return;
    }

    const maximumBytes = kind === 'image' ? IMAGE_MAX_BYTES : VIDEO_MAX_BYTES;
    if (file.size > maximumBytes) {
      setError(`${kind === 'image' ? 'Images' : 'Videos'} must be smaller than ${kind === 'image' ? '15 MB' : '250 MB'}.`);
      return;
    }

    uploadLockRef.current = true;
    updateUploading(true);
    setProgress(5);

    try {
      setStatusMessage('Authorizing signed upload...');
      const descriptor = await requestUploadDescriptor();
      setStatusMessage(`Uploading ${kind} to Cloudinary CDN...`);
      const secureUrl = await uploadToCloudinary(file, kind, descriptor);
      onChange(secureUrl);
      setManualUrl(secureUrl);
      setStatusMessage('Upload complete.');
    } catch (uploadError) {
      console.error('Cloudinary upload failed:', uploadError);
      setError(
        uploadError instanceof Error ? uploadError.message : 'The file could not be uploaded.'
      );
    } finally {
      uploadLockRef.current = false;
      updateUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void processFile(file);
    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void processFile(file);
  };

  const handleManualApply = () => {
    const nextUrl = manualUrl.trim();
    if (!isDurableMediaUrl(nextUrl)) {
      setError('Enter a durable HTTPS URL or site-relative path. data:, blob:, and http:// URLs are not allowed.');
      return;
    }
    onChange(nextUrl);
    setError(null);
  };

  const handleClear = () => {
    onChange('');
    setManualUrl('');
    setError(null);
  };

  const isVideo = mediaValueIsVideo(value);
  const isImage = Boolean(value) && !isVideo;

  return (
    <div className="w-full space-y-2.5 bg-black/30 p-3.5 rounded-2xl border border-white/10">
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

        <div className="flex items-center gap-1.5 p-1 bg-black/60 border border-white/10 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('device')}
            disabled={isUploading}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
              mode === 'device'
                ? 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <HardDrive className={`w-3 h-3 ${mode === 'device' ? 'text-black' : 'text-white'}`} />
            <span>Upload from Device</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('url')}
            disabled={isUploading}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
              mode === 'url'
                ? 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <LinkIcon className={`w-3 h-3 ${mode === 'url' ? 'text-black' : 'text-white'}`} />
            <span>Enter URL</span>
          </button>
        </div>
      </div>

      {mode === 'device' && (
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept={
              accept === 'video'
                ? 'video/mp4,video/quicktime,video/webm,video/x-m4v'
                : accept === 'image'
                  ? 'image/jpeg,image/png,image/webp,image/svg+xml,image/gif'
                  : 'video/mp4,video/quicktime,video/webm,video/x-m4v,image/jpeg,image/png,image/webp,image/svg+xml,image/gif'
            }
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
            id={`device-upload-${label.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
          />

          <div
            onDragOver={(event) => {
              event.preventDefault();
              if (!isUploading) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => {
              if (!isUploading) fileInputRef.current?.click();
            }}
            className={`relative w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all ${
              isDragging
                ? 'border-white bg-white/15 scale-[1.01] cursor-pointer'
                : isUploading
                  ? 'border-white/60 bg-white/10 cursor-not-allowed'
                  : 'border-white/15 hover:border-white/40 bg-black/40 hover:bg-white/[0.03] cursor-pointer'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-3 w-full max-w-sm py-2">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
                <div className="text-center space-y-1">
                  <p className="text-xs font-mono font-bold text-white">{statusMessage}</p>
                  <p className="text-[10px] font-mono text-white/70">{progress}% Completed</p>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden border border-white/10">
                  <div
                    className="bg-white h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs font-mono font-bold text-white tracking-wide">
                    Click to browse from your device or drag & drop here
                  </p>
                  <p className="text-[10px] font-mono text-white/50">
                    {accept === 'video'
                      ? 'MP4, MOV, WEBM, or M4V up to 250 MB'
                      : accept === 'image'
                        ? 'PNG, JPG, WEBP, SVG, or GIF up to 15 MB'
                        : 'Supported images up to 15 MB and videos up to 250 MB'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black font-mono text-[10px] uppercase font-bold tracking-wider transition-all"
                >
                  Browse Device Files
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {mode === 'url' && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={manualUrl}
              onChange={(event) => setManualUrl(event.target.value)}
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

      {error && (
        <div
          className="flex items-start gap-2 p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-mono"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {helpText && <p className="text-[10px] text-white/40 font-mono">{helpText}</p>}

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
                  preload="metadata"
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
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-emerald-400">
                  {isVideo ? 'Active Reel Ready' : 'Active Image Ready'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-white/70 truncate mt-0.5 max-w-md" title={value}>
                {value}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => {
                setMode('device');
                setTimeout(() => fileInputRef.current?.click(), 50);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#008CFF] text-white text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              title="Replace this media with a signed Cloudinary upload"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Replace</span>
            </button>

            <button
              type="button"
              disabled={isUploading}
              onClick={handleClear}
              className="p-1.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
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
