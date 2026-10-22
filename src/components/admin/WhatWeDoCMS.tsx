import React, { useState, useEffect, useRef } from 'react';
import {
  Edit3,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  X,
  Upload,
  Link as LinkIcon,
  Video,
  FileText,
  Tag,
  Layers,
  Sparkles,
  ExternalLink,
  Film,
} from 'lucide-react';
import { CMSService } from '../../types/cms';
import { fetchPublishedServices, saveAllServices, resetServicesToDefaults } from '../../lib/cms/cmsService';
import { pushServicesUndoAction } from '../../lib/cms/cmsHistory';
import { CLIENT_PROJECTS } from '../../data/clientsData';

export const WhatWeDoCMS: React.FC = () => {
  const [services, setServices] = useState<CMSService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

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
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Reset to Defaults (Syncs frontend with canonical 3 pillars)
  const handleResetDefaults = async () => {
    const confirmed = window.confirm(
      'Reset What We Do to the 3 canonical pillars (CREATIVE CONTENT, DIGITAL GROWTH, EDITING & POSTING)?\n\nThis will sync with the live homepage. You can undo this anytime using the Undo button.'
    );
    if (!confirmed) return;

    setIsResetting(true);
    try {
      pushServicesUndoAction('Reset What We Do to 3 Core Pillars', services);
      const defaults = await resetServicesToDefaults();
      setServices(defaults);
      showToast('Successfully synced to the 3 canonical pillars!');
    } catch (err) {
      console.error('Error resetting services:', err);
      showToast('Error syncing to defaults. Please try again.');
    } finally {
      setIsResetting(false);
    }
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

  // Quick Preset Selection from portfolio clients
  const handleSelectPresetReel = (videoUrl: string, posterUrl: string) => {
    if (!videoUrl) return;
    setFormVideoUrl(videoUrl);
    if (posterUrl) {
      setFormImageUrl(posterUrl);
    }
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
    pushServicesUndoAction(`Updated Pillar #${editingService.number}: ${fullTitle}`, services);

    const updatedService: CMSService = {
      ...editingService,
      titleLines: [formTitleLine1.trim() || 'CREATIVE', formTitleLine2.trim() || 'CONTENT'],
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
    showToast(`Pillar #${editingService.number} (${fullTitle}) updated & live synced!`);
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
            Edit text, titles, matter narratives, badges, and 9:16 vertical video reels for the 3 homepage capabilities (01 / 03, 02 / 03, 03 / 03), ending with the Scene 04 3D Climax.
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
            disabled={isResetting}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-xs font-mono font-semibold text-white/80 hover:text-white flex items-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            title="Reset What We Do to canonical 3 pillars"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-[#008CFF] ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Syncing...' : 'Reset Defaults / Sync'}</span>
          </button>
        </div>
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-sm font-mono flex items-center gap-2.5 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{saveToast}</span>
        </div>
      )}

      {/* 3 Core Capability Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {services.slice(0, 3).map((service, index) => {
          const displayVideo = service.videoUrl || service.imageUrl.replace(/\.(jpg|png|jpeg)$/i, '.mp4');
          return (
            <div
              key={service.id || index}
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

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => openEditModal(service, index)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#008CFF] text-white border border-white/20 flex items-center gap-1.5 text-xs font-mono font-bold transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 shrink-0"
                  title={`Edit Pillar #${service.number}`}
                >
                  <Edit3 className="w-3.5 h-3.5 text-current" />
                  <span>Edit</span>
                </button>
              </div>

              {/* Card Body: 9:16 Video Reel + Content */}
              <div className="p-5 flex flex-col gap-4 flex-1">
                {/* 9:16 Video Reel Container */}
                <div className="relative w-full aspect-[9/16] max-h-[380px] bg-black rounded-xl overflow-hidden border border-white/10 group/video shadow-inner">
                  <video
                    src={displayVideo}
                    poster={service.imageUrl}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Reel Overlay Info */}
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Film className="w-3 h-3 text-[#008CFF]" />
                      <span>Chapter 0{index + 1} Reel</span>
                    </span>
                  </div>

                  {/* Quick Change Video Button */}
                  <button
                    type="button"
                    onClick={() => openEditModal(service, index)}
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/85 hover:bg-[#008CFF] text-white border border-white/30 flex items-center gap-1.5 text-xs font-mono font-semibold transition-all cursor-pointer shadow-xl backdrop-blur-md"
                    title="Change video reel"
                    aria-label="Change video reel"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-current" />
                    <span>Change Video</span>
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
                    onClick={() => openEditModal(service, index)}
                    className="w-full mt-2 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-xs font-mono font-bold text-white/90 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#008CFF]" />
                    <span>Edit Pillar 0{index + 1} Content & Video</span>
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
      {editingService && editingIndex !== null && (
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
                    Pillar {editingIndex + 1} of 03 inside What We Do Section
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

              {/* 5. Video Reel URL & Preset Selection */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <label className="block text-xs font-mono uppercase text-white/70 font-bold flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-[#008CFF]" />
                  <span>9:16 Vertical Reel Video</span>
                </label>

                {/* Preset Dropdown Selection */}
                <div>
                  <label className="block text-[11px] font-mono uppercase text-white/50 mb-1">
                    Quick Pick from BrandShoots Portfolio Projects
                  </label>
                  <select
                    onChange={(e) => {
                      const proj = CLIENT_PROJECTS.find((p) => p.videoUrl === e.target.value);
                      if (proj) {
                        handleSelectPresetReel(proj.videoUrl, proj.posterUrl);
                      }
                    }}
                    value={CLIENT_PROJECTS.some((p) => p.videoUrl === formVideoUrl) ? formVideoUrl : ''}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white text-xs font-mono focus:outline-none focus:border-[#008CFF] transition-colors cursor-pointer"
                  >
                    <option value="">-- Choose a Preset Client Reel (Optional) --</option>
                    {CLIENT_PROJECTS.map((proj) => (
                      <option key={proj.id} value={proj.videoUrl}>
                        {proj.name} — {proj.category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Direct Video URL Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={formVideoUrl}
                    onChange={(e) => setFormVideoUrl(e.target.value)}
                    placeholder="e.g. /reels/... or https://res.cloudinary.com/.../video.mp4"
                    required
                    className="w-full px-4 py-2.5 pl-10 rounded-xl bg-black/70 border border-white/20 text-white text-sm font-mono placeholder:text-white/30 focus:outline-none focus:border-[#008CFF] transition-colors"
                  />
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                </div>

                {/* Optional Poster Image URL */}
                <div className="relative">
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="Poster image URL (optional thumbnail): /reels/thumbnails/...jpg"
                    className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/15 text-white/80 text-xs font-mono placeholder:text-white/25 focus:outline-none focus:border-[#008CFF] transition-colors"
                  />
                </div>

                {/* File Upload / Drag Drop */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3.5 rounded-xl border border-dashed border-white/25 hover:border-[#008CFF] bg-white/[0.02] hover:bg-[#008CFF]/5 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs font-mono text-white/70 hover:text-white"
                >
                  <Upload className="w-4 h-4 text-[#008CFF]" />
                  <span>Or click to upload video file from device</span>
                </div>

                {uploadStatus && (
                  <p className="text-xs font-mono text-emerald-400">{uploadStatus}</p>
                )}

                {/* Video Preview */}
                {formVideoUrl && (
                  <div className="mt-2 p-3 bg-black/80 rounded-xl border border-white/15 flex items-center gap-4">
                    <div className="w-16 aspect-[9/16] rounded-lg overflow-hidden bg-black shrink-0 border border-white/20 shadow-md">
                      <video
                        src={formVideoUrl}
                        poster={formImageUrl}
                        muted
                        loop
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono uppercase text-[#008CFF] font-bold block">Live Reel Preview</span>
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
                  className="px-6 py-2.5 rounded-xl bg-[#008CFF] hover:bg-[#008CFF]/90 disabled:opacity-50 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,140,255,0.4)] active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Save Pillar Changes</span>
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
