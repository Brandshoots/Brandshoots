import React, { useState, useEffect, useRef } from 'react';
import {
  Edit3,
  RefreshCw,
  CheckCircle2,
  X,
  Upload,
  Link as LinkIcon,
  Video,
  FileText,
  Tag,
  Layers,
} from 'lucide-react';
import { CMSService } from '../../types/cms';
import { fetchPublishedServices, saveAllServices } from '../../lib/cms/cmsService';
import { pushServicesUndoAction } from '../../lib/cms/cmsHistory';

export const WhatWeDoCMS: React.FC = () => {
  const [services, setServices] = useState<CMSService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Edit Modal State
  const [editingService, setEditingService] = useState<CMSService | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Modal Form Inputs
  const [formTitleLine1, setFormTitleLine1] = useState('');
  const [formTitleLine2, setFormTitleLine2] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTag, setFormTag] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch published services on mount & listen for undo updates
  useEffect(() => {
    let isMounted = true;
    fetchPublishedServices().then((data) => {
      if (isMounted) {
        setServices(data);
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

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Open Edit Modal
  const openEditModal = (service: CMSService, index: number) => {
    setEditingService(service);
    setEditingIndex(index);
    setFormTitleLine1(service.titleLines?.[0] || '');
    setFormTitleLine2(service.titleLines?.[1] || '');
    setFormCategory(service.category || '');
    setFormDescription(service.description || '');
    setFormTag(service.tag || '');
    setFormVideoUrl(service.videoUrl || service.imageUrl.replace(/\.(jpg|png|jpeg)$/i, '.mp4'));
    setFormImageUrl(service.imageUrl || '');
    setIsUploading(false);
    setUploadStatus('');
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setEditingService(null);
    setEditingIndex(null);
    setIsUploading(false);
    setUploadStatus('');
  };

  // Handle local video file upload / drop
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file (MP4, MOV, WEBM).');
      return;
    }

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setFormVideoUrl(localUrl);

    // Optional Cloudinary upload
    const cloudName =
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
      localStorage.getItem('bs_cloudinary_cloud_name') ||
      '';

    if (cloudName.trim()) {
      setIsUploading(true);
      setUploadStatus('Uploading video to Cloudinary CDN...');

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'brandshoots_unsigned');
        formData.append('folder', 'brandshoots/what-we-do');

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName.trim()}/video/upload`);

        xhr.onload = () => {
          setIsUploading(false);
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              const hostedUrl = res.secure_url || res.url;
              if (hostedUrl) {
                setFormVideoUrl(hostedUrl);
                setUploadStatus('Uploaded to Cloudinary CDN!');
              }
            } catch {}
          }
        };

        xhr.onerror = () => {
          setIsUploading(false);
        };

        xhr.send(formData);
      } catch {
        setIsUploading(false);
      }
    }
  };

  // Save Service Changes
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || editingIndex === null) return;

    const fullTitle = `${formTitleLine1.trim()} ${formTitleLine2.trim()}`.trim() || 'Capability';
    pushServicesUndoAction(`Updated Section #${editingService.number}: ${fullTitle}`, services);

    const updatedService: CMSService = {
      ...editingService,
      titleLines: [formTitleLine1.trim() || 'VIDEO', formTitleLine2.trim() || 'PRODUCTION'],
      category: formCategory.trim() || editingService.category,
      description: formDescription.trim() || editingService.description,
      tag: formTag.trim() || editingService.tag,
      videoUrl: formVideoUrl.trim() || editingService.videoUrl,
      imageUrl: formImageUrl.trim() || editingService.imageUrl,
      updatedAt: Date.now(),
    };

    const updatedList = services.map((s, idx) => (idx === editingIndex ? updatedService : s));
    setServices(updatedList);
    await saveAllServices(updatedList);
    closeEditModal();
    showToast(`Section #${editingService.number} updated & live synced!`);
  };

  if (isLoading) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white font-mono text-sm">
          <RefreshCw className="w-5 h-5 animate-spin text-white" />
          <span>Loading What We Do Capabilities...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-display font-black uppercase tracking-wider text-white">
              What We Do — 6 Capabilities
            </h1>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono font-bold text-white">
              {services.length} Sections Active
            </span>
          </div>
          <p className="text-sm font-sans text-white/60 mt-1">
            Edit text, titles, matter descriptions, and vertical video reels for all 6 chapters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-white/70 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Synced</span>
          </div>
        </div>
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-sm font-mono flex items-center gap-2.5 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{saveToast}</span>
        </div>
      )}

      {/* 6 Mini Sections Grid (Responsive 2-column or 3-column layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.slice(0, 6).map((service, index) => {
          const displayVideo = service.videoUrl || service.imageUrl.replace(/\.(jpg|png|jpeg)$/i, '.mp4');
          return (
            <div
              key={service.id || index}
              className="group relative rounded-2xl overflow-hidden bg-[#0A0D14] border border-white/15 flex flex-col transition-all duration-200 hover:border-white/35 hover:shadow-[0_16px_50px_rgba(0,0,0,0.85)]"
            >
              {/* Card Header: Chapter Number & Category Pill */}
              <div className="px-5 py-3.5 bg-black/60 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-xs font-mono font-bold text-white">
                    {service.number || `0${index + 1}`} / 06
                  </span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/70 truncate max-w-[170px]">
                    {service.category}
                  </span>
                </div>

                {/* Edit Section Action Button (Pure White Icon) */}
                <button
                  type="button"
                  onClick={() => openEditModal(service, index)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 flex items-center gap-1.5 text-xs font-mono font-bold transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                  title={`Edit Section #${service.number}`}
                >
                  <Edit3 className="w-3.5 h-3.5 text-current" />
                  <span>Edit</span>
                </button>
              </div>

              {/* Card Body: Video Reel on Left, Content on Right */}
              <div className="p-5 flex flex-col sm:flex-row gap-5 flex-1">
                {/* 9:16 Video Reel Container */}
                <div className="relative w-full sm:w-36 aspect-[9/16] bg-black rounded-xl overflow-hidden border border-white/10 shrink-0 group/video">
                  <video
                    src={displayVideo}
                    poster={service.imageUrl}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                  {/* Quick Replace Video Button */}
                  <button
                    type="button"
                    onClick={() => openEditModal(service, index)}
                    className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-lg bg-black/80 hover:bg-white text-white hover:text-black border border-white/30 flex items-center justify-center transition-all cursor-pointer shadow-lg"
                    title="Change video reel"
                    aria-label="Change video reel"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-current" />
                  </button>
                </div>

                {/* Content: Title, Matter Description, Tag */}
                <div className="flex flex-col justify-between flex-1 min-w-0 space-y-3">
                  <div>
                    {/* 2-Line Headline */}
                    <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-white leading-tight">
                      <div>{service.titleLines?.[0] || 'SECTION'}</div>
                      <div className="text-white/80">{service.titleLines?.[1] || 'TITLE'}</div>
                    </h3>

                    {/* Matter / Description */}
                    <p className="mt-2 text-sm font-sans text-white/70 leading-relaxed line-clamp-4">
                      {service.description}
                    </p>
                  </div>

                  {/* Bottom Tag Pill */}
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-xs font-mono font-semibold text-white/85">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span className="truncate max-w-[200px]">{service.tag}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* EDIT MINI SECTION MODAL                                             */}
      {/* =================================================================== */}
      {editingService && editingIndex !== null && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0A0E17] border border-white/15 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-5 shadow-2xl my-auto max-h-[94vh] overflow-y-auto custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider font-display">
                    Edit Mini Section #{editingService.number}
                  </h2>
                  <p className="text-xs font-mono text-white/50">
                    Chapter {editingIndex + 1} of 06 inside What We Do Section
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
                  <Layers className="w-3.5 h-3.5 text-white" />
                  <span>Category (Pre-heading: {editingService.number} / 06 &bull; Category)</span>
                </label>
                <input
                  type="text"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g. CINEMATIC PRODUCTION"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white text-sm font-mono placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors"
                />
              </div>

              {/* 2. Title Line 1 & Line 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1.5 font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-white" />
                    <span>Title — Line 1</span>
                  </label>
                  <input
                    type="text"
                    value={formTitleLine1}
                    onChange={(e) => setFormTitleLine1(e.target.value)}
                    placeholder="e.g. VIDEO"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white text-sm font-display font-bold uppercase placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1.5 font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-white" />
                    <span>Title — Line 2</span>
                  </label>
                  <input
                    type="text"
                    value={formTitleLine2}
                    onChange={(e) => setFormTitleLine2(e.target.value)}
                    placeholder="e.g. PRODUCTION"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white text-sm font-display font-bold uppercase placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors"
                  />
                </div>
              </div>

              {/* 3. Matter / Description */}
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5 font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-white" />
                  <span>Matter / Detailed Description</span>
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  placeholder="Enter the capability matter and detailed service narrative..."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-black/70 border border-white/20 text-white text-sm font-sans placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* 4. Tag Pill Text */}
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5 font-bold flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-white" />
                  <span>Tag / Bottom Badge</span>
                </label>
                <input
                  type="text"
                  value={formTag}
                  onChange={(e) => setFormTag(e.target.value)}
                  placeholder="e.g. CINEMATOGRAPHY & DIRECTION"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white text-sm font-mono placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors"
                />
              </div>

              {/* 5. Video Reel URL & Upload */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <label className="block text-xs font-mono uppercase text-white/70 font-bold flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-white" />
                  <span>9:16 Vertical Reel Video</span>
                </label>

                {/* Paste URL Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={formVideoUrl}
                    onChange={(e) => setFormVideoUrl(e.target.value)}
                    placeholder="e.g. /Reels Folder/... or https://res.cloudinary.com/.../video.mp4"
                    required
                    className="w-full px-4 py-2.5 pl-10 rounded-xl bg-black/70 border border-white/20 text-white text-sm font-mono placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors"
                  />
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                </div>

                {/* Or File Upload / Drag Drop */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3.5 rounded-xl border border-dashed border-white/25 hover:border-white/60 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center justify-center gap-2 cursor-pointer text-xs font-mono text-white/70 hover:text-white"
                >
                  <Upload className="w-4 h-4 text-white" />
                  <span>Or click to browse video file from device</span>
                </div>

                {uploadStatus && (
                  <p className="text-xs font-mono text-emerald-400">{uploadStatus}</p>
                )}

                {/* Video Preview */}
                {formVideoUrl && (
                  <div className="mt-2 p-3 bg-black/80 rounded-xl border border-white/15 flex items-center gap-4">
                    <div className="w-16 aspect-[9/16] rounded-lg overflow-hidden bg-black shrink-0 border border-white/20">
                      <video
                        src={formVideoUrl}
                        muted
                        loop
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono uppercase text-white/50 block">Live Preview</span>
                      <p className="text-xs font-mono text-white truncate">{formVideoUrl}</p>
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
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-white/90 disabled:opacity-50 text-black text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Save Section Changes</span>
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
