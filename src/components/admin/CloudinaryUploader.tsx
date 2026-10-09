import React, { useState, useRef } from 'react';
import { Upload, Film, Image as ImageIcon, Check, AlertCircle, Loader2, X } from 'lucide-react';

interface CloudinaryUploaderProps {
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
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'url'>('url');
  const [manualUrl, setManualUrl] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo = value?.endsWith('.mp4') || value?.endsWith('.mov') || value?.endsWith('.webm') || value?.includes('/video/');
  const isImage = value && !isVideo;

  const handleManualApply = () => {
    onChange(manualUrl.trim());
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    setProgress(10);

    const isVideoFile = file.type.startsWith('video/');
    const resourceType = isVideoFile ? 'video' : 'image';

    try {
      // 1. Get Cloud Name from env or localStorage
      const cloudName =
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
        localStorage.getItem('bs_cloudinary_cloud_name') ||
        '';

      if (!cloudName) {
        throw new Error(
          'Cloudinary Cloud Name is required. Set it in Settings tab or paste direct media URL.'
        );
      }

      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = {
        timestamp,
        folder: 'brandshoots',
      };

      // 2. Try fetching signature from serverless endpoint /api/cloudinary-sign
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
        // Fallback to client-side unsigned if unsigned upload preset exists
      }

      // 3. Prepare FormData for Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('timestamp', timestamp.toString());
      formData.append('folder', 'brandshoots');

      if (signatureData?.signature) {
        formData.append('api_key', signatureData.apiKey);
        formData.append('signature', signatureData.signature);
      } else {
        // Fallback preset if available
        formData.append('upload_preset', 'brandshoots_unsigned');
      }

      setProgress(40);

      // 4. Upload with XMLHttpRequest for real progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`);

        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            const pct = Math.round((evt.loaded / evt.total) * 90);
            setProgress(pct);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            setProgress(100);
            onChange(data.secure_url || data.url);
            setManualUrl(data.secure_url || data.url);
            resolve();
          } else {
            try {
              const errData = JSON.parse(xhr.responseText);
              reject(new Error(errData?.error?.message || `Upload failed with status ${xhr.status}`));
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          }
        };

        xhr.onerror = () => reject(new Error('Network error during upload to Cloudinary.'));
        xhr.send(formData);
      });
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err?.message || 'Media upload failed. You can paste the direct URL below instead.');
      setMode('url');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono uppercase tracking-wider text-white/70 flex items-center gap-2">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-colors ${
              mode === 'url' ? 'bg-[#008CFF]/20 text-[#008CFF] border border-[#008CFF]/40' : 'text-white/40 hover:text-white/70'
            }`}
          >
            URL Input
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-colors ${
              mode === 'upload' ? 'bg-[#008CFF]/20 text-[#008CFF] border border-[#008CFF]/40' : 'text-white/40 hover:text-white/70'
            }`}
          >
            Cloudinary Upload
          </button>
        </div>
      </div>

      {mode === 'url' ? (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="e.g. /reels/sample.mp4 or https://res.cloudinary.com/..."
              className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-lg text-xs font-mono text-white placeholder-white/30 focus:border-[#008CFF] focus:outline-none transition-colors"
            />
            {manualUrl && (
              <button
                type="button"
                onClick={() => {
                  setManualUrl('');
                  onChange('');
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleManualApply}
            className="px-3 py-2 bg-white/10 hover:bg-[#008CFF] text-white text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply</span>
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept={
              accept === 'video'
                ? 'video/mp4,video/quicktime,video/webm'
                : accept === 'image'
                ? 'image/jpeg,image/png,image/webp,image/svg+xml'
                : 'video/*,image/*'
            }
            onChange={handleFileSelect}
            className="hidden"
            id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
          />
          <label
            htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className={`w-full border border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
              isUploading
                ? 'border-[#008CFF] bg-[#008CFF]/5'
                : 'border-white/20 hover:border-[#008CFF]/60 hover:bg-white/[0.02]'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 w-full max-w-xs">
                <Loader2 className="w-5 h-5 text-[#008CFF] animate-spin" />
                <span className="text-xs font-mono text-[#008CFF]">Uploading to Cloudinary ({progress}%)</span>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#008CFF] h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-5 h-5 text-white/50" />
                <div className="text-center">
                  <p className="text-xs text-white/80 font-mono">
                    Click to select {accept === 'video' ? 'MP4 / Video' : accept === 'image' ? 'Image' : 'Media file'}
                  </p>
                  <p className="text-[10px] text-white/40">Direct upload to Cloudinary storage</p>
                </div>
              </>
            )}
          </label>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-1.5 p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-mono">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {helpText && <p className="text-[10px] text-white/40 font-mono">{helpText}</p>}

      {/* Media Preview Box */}
      {value && (
        <div className="mt-2 p-2 bg-black/40 border border-white/10 rounded-lg flex items-center gap-3">
          {isVideo ? (
            <div className="relative w-16 h-12 bg-black rounded overflow-hidden shrink-0 border border-white/15">
              <video
                src={value}
                className="w-full h-full object-cover"
                muted
                playsInline
                autoPlay
                loop
              />
              <Film className="absolute bottom-1 right-1 w-3 h-3 text-[#008CFF]" />
            </div>
          ) : isImage ? (
            <div className="relative w-16 h-12 bg-black/60 rounded overflow-hidden shrink-0 border border-white/15 flex items-center justify-center">
              <img src={value} alt="Preview" className="w-full h-full object-contain" />
              <ImageIcon className="absolute bottom-1 right-1 w-3 h-3 text-[#008CFF]" />
            </div>
          ) : null}

          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-mono text-white/90 truncate">{value}</p>
            <span className="text-[9px] font-mono uppercase tracking-wider text-green-400 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Media Ready
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
