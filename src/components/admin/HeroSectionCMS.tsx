import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Smartphone,
  Monitor,
  Save,
  Play,
  Volume2,
  Type,
  Film,
  Layers,
} from 'lucide-react';
import { CMSHero, CMSHeroReel } from '../../types/cms';
import {
  fetchPublishedHeroReels,
  saveHeroReels,
  fetchPublishedHero,
  saveHero,
} from '../../lib/cms/cmsService';
import { INITIAL_HERO, INITIAL_HERO_REELS } from '../../lib/cms/seedData';
import { SimpleReelModal } from './SimpleReelModal';
import { CloudinaryUploader } from './CloudinaryUploader';
import { pushUndoAction } from '../../lib/cms/cmsHistory';

export const HeroSectionCMS: React.FC = () => {
  // Navigation Tabs: 'desktop-reels' vs 'mobile-view'
  const [activeTab, setActiveTab] = useState<'desktop-reels' | 'mobile-view'>('desktop-reels');

  // Reels State
  const [reels, setReels] = useState<CMSHeroReel[]>(() => {
    try {
      const cached = localStorage.getItem('brandshoots_hero_reels');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_HERO_REELS;
  });

  // Hero Metadata & Mobile View State
  const [heroData, setHeroData] = useState<CMSHero>(() => {
    try {
      const cached = localStorage.getItem('brandshoots_hero');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') return { ...INITIAL_HERO, ...parsed };
      }
    } catch {}
    return INITIAL_HERO;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isSavingHero, setIsSavingHero] = useState(false);

  // Replace reel modal state
  const [replacingReel, setReplacingReel] = useState<CMSHeroReel | null>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

  // Fetch published reels & hero on mount
  useEffect(() => {
    let isMounted = true;
    fetchPublishedHeroReels().then((data) => {
      if (isMounted && data && data.length > 0) {
        setReels(data);
      }
    });

    fetchPublishedHero().then((data) => {
      if (isMounted && data) {
        setHeroData((prev) => ({ ...prev, ...data }));
      }
    });

    const handleReelsUpdated = (e: any) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setReels(e.detail);
      }
    };

    const handleHeroUpdated = (e: any) => {
      if (e?.detail && typeof e.detail === 'object') {
        setHeroData((prev) => ({ ...prev, ...e.detail }));
      }
    };

    window.addEventListener('brandshoots_hero_reels_updated', handleReelsUpdated);
    window.addEventListener('brandshoots_hero_updated', handleHeroUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener('brandshoots_hero_reels_updated', handleReelsUpdated);
      window.removeEventListener('brandshoots_hero_updated', handleHeroUpdated);
    };
  }, []);

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Remove a reel from the 3D cylinder grid
  const handleRemoveReel = async (id: string) => {
    const target = reels.find((r) => r.id === id);
    pushUndoAction(`Removed Reel: ${target?.title || 'Slot'}`, reels);

    const updated = reels.filter((r) => r.id !== id).map((r, i) => ({ ...r, order: i }));
    setReels(updated);
    await saveHeroReels(updated);
    showToast('Reel removed from 3D cylinder!');
  };

  // Open Replace Modal
  const openReplaceModal = (reel: CMSHeroReel, index: number) => {
    setReplacingReel(reel);
    setReplacingIndex(index);
  };

  // Save New Reel
  const handleSaveNewReel = async (data: { src: string; title: string; client: string; poster: string }) => {
    pushUndoAction(`Added New Reel: ${data.title}`, reels);

    const newReel: CMSHeroReel = {
      id: `hero-reel-${Date.now()}`,
      title: data.title,
      client: data.client,
      src: data.src,
      lightSrc: data.src,
      poster: data.poster || '/Logo Official.svg',
      order: reels.length,
      visible: true,
      updatedAt: Date.now(),
    };
    const updated = [...reels, newReel];
    setReels(updated);
    await saveHeroReels(updated);
    setIsAddModalOpen(false);
    showToast('New reel added to 3D cylinder!');
  };

  // Save Replaced Reel
  const handleSaveReplacedReel = async (data: { src: string; title: string; client: string; poster: string }) => {
    if (!replacingReel) return;
    const slotNum = replacingIndex !== null ? replacingIndex + 1 : '';
    pushUndoAction(`Replaced Slot #${slotNum}: ${data.title}`, reels);

    const updated = reels.map((r) => {
      if (r.id === replacingReel.id) {
        return {
          ...r,
          title: data.title,
          client: data.client,
          src: data.src,
          lightSrc: data.src,
          poster: data.poster || r.poster,
          updatedAt: Date.now(),
        };
      }
      return r;
    });
    setReels(updated);
    await saveHeroReels(updated);
    setReplacingReel(null);
    showToast(`Slot #${slotNum} replaced successfully!`);
  };

  // Save Mobile View & Hero Content
  const handleSaveMobileHero = async () => {
    try {
      setIsSavingHero(true);
      await saveHero(heroData);
      showToast('Mobile Hero View & Brand Typography saved successfully!');
    } catch (err) {
      console.error(err);
      showToast('Error saving Mobile Hero view');
    } finally {
      setIsSavingHero(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header: Title, Tab Switcher & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-black uppercase tracking-wider text-white">
            Hero Section CMS
          </h1>
          <p className="text-xs sm:text-sm font-sans text-white/60 mt-1">
            Manage Desktop 3D Cylinder installation & dedicated Mobile View experience.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.06] border border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('desktop-reels')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-sans font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'desktop-reels'
                ? 'bg-[#008CFF] text-white shadow-[0_0_15px_rgba(0,140,255,0.4)]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Desktop 3D Reels ({reels.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mobile-view')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-sans font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'mobile-view'
                ? 'bg-[#008CFF] text-white shadow-[0_0_15px_rgba(0,140,255,0.4)]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile View CMS</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/20 text-white font-bold">
              1 Reel
            </span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {saveToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* =============================================================== */}
      {/* TAB 1: DESKTOP 3D REELS GRID                                    */}
      {/* =============================================================== */}
      {activeTab === 'desktop-reels' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-white/50 uppercase tracking-wider">
              <span>Slots Arranged in 360° Amphitheater Cylinder</span>
            </div>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-white/90 text-black font-sans font-bold text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Add Reel Slot</span>
            </button>
          </div>

          {/* Grid of all 3D Hero Reels */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
            {reels.map((reel, index) => (
              <div
                key={reel.id}
                className="group relative rounded-2xl overflow-hidden bg-[#0A0D14] border border-white/10 flex flex-col transition-all hover:border-white/35 hover:shadow-[0_16px_40px_rgba(0,0,0,0.9)]"
              >
                {/* 9:16 Video / Poster Container */}
                <div className="relative w-full aspect-[9/16] bg-black overflow-hidden">
                  <video
                    src={reel.src}
                    poster={reel.poster}
                    muted
                    playsInline
                    loop
                    onMouseEnter={(e) => {
                      try {
                        e.currentTarget.play();
                      } catch {}
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                    className="w-full h-full object-cover"
                  />

                  {/* Slot Index Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-white shadow-md">
                    #{index + 1}
                  </div>

                  {/* Floating Action Buttons (Top Right: Replace & Remove) */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                    <button
                      type="button"
                      onClick={() => openReplaceModal(reel, index)}
                      className="group/replace w-8 h-8 rounded-lg bg-black/90 hover:bg-white border border-white/25 hover:border-white text-white hover:text-black flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                      title="Replace this reel"
                      aria-label="Replace reel"
                    >
                      <RefreshCw className="w-3.5 h-3.5 transition-transform duration-300 group-hover/replace:rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveReel(reel.id)}
                      className="group/remove w-8 h-8 rounded-lg bg-black/90 hover:bg-red-600 border border-white/25 hover:border-red-600 text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                      title="Remove reel"
                      aria-label="Remove reel"
                    >
                      <Trash2 className="w-3.5 h-3.5 transition-transform duration-200 group-hover/remove:scale-110" />
                    </button>
                  </div>
                </div>

                {/* Bottom Info Bar */}
                <div className="p-3.5 bg-black/85 border-t border-white/10 flex flex-col gap-2.5 flex-1 justify-between">
                  <div>
                    <h3
                      className="font-sans text-sm sm:text-base font-bold text-white leading-snug line-clamp-2"
                      title={reel.title}
                    >
                      {reel.title || 'Untitled Reel'}
                    </h3>
                    <span className="block mt-1 text-xs font-mono font-semibold text-white/60 uppercase tracking-wider truncate">
                      {reel.client || 'BrandShoots'}
                    </span>
                  </div>

                  <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/40">
                    <span className="font-semibold text-white/60">Slot #{index + 1}</span>
                    <span className="text-[11px] text-white/30 uppercase tracking-wider">3D Cylinder</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* TAB 2: MOBILE VIEW HERO CMS                                      */}
      {/* =============================================================== */}
      {activeTab === 'mobile-view' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Configuration Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Mobile Display Strategy Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#090C12] border border-white/10 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#008CFF]/15 border border-[#008CFF]/30 flex items-center justify-center text-[#008CFF]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-display font-bold uppercase text-white">
                    Mobile Reel Display Strategy
                  </h2>
                  <p className="text-xs text-white/60">
                    Controls how the hero reels are showcased on smartphone screens (&lt; 768px).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label
                  onClick={() =>
                    setHeroData((prev) => ({ ...prev, mobileDisplayMode: 'single-reel-carousel' }))
                  }
                  className={`p-4 rounded-xl border flex flex-col gap-2 cursor-pointer transition-all ${
                    (heroData.mobileDisplayMode || 'single-reel-carousel') === 'single-reel-carousel'
                      ? 'bg-[#008CFF]/15 border-[#008CFF] shadow-[0_0_20px_rgba(0,140,255,0.25)]'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-bold text-sm text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#008CFF]" />
                      Single Reel Carousel
                    </span>
                    {(heroData.mobileDisplayMode || 'single-reel-carousel') === 'single-reel-carousel' && (
                      <CheckCircle2 className="w-4 h-4 text-[#008CFF]" />
                    )}
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Shows <strong>strictly 1 reel at once</strong> centered. Users can touch-swipe or tap chevrons to snap between all {reels.length} reels.
                  </p>
                  <span className="text-[11px] font-mono text-[#008CFF] font-semibold mt-auto">
                    Recommended (F1 Optimized)
                  </span>
                </label>

                <label
                  onClick={() =>
                    setHeroData((prev) => ({ ...prev, mobileDisplayMode: 'featured-single-reel' }))
                  }
                  className={`p-4 rounded-xl border flex flex-col gap-2 cursor-pointer transition-all ${
                    heroData.mobileDisplayMode === 'featured-single-reel'
                      ? 'bg-[#008CFF]/15 border-[#008CFF] shadow-[0_0_20px_rgba(0,140,255,0.25)]'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-bold text-sm text-white flex items-center gap-2">
                      <Film className="w-4 h-4 text-[#008CFF]" />
                      Dedicated Featured Reel
                    </span>
                    {heroData.mobileDisplayMode === 'featured-single-reel' && (
                      <CheckCircle2 className="w-4 h-4 text-[#008CFF]" />
                    )}
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Locks mobile view to a single high-definition flagship reel with dedicated video and poster URLs.
                  </p>
                  <span className="text-[11px] font-mono text-white/40 mt-auto">
                    Custom Single Spotlight
                  </span>
                </label>
              </div>
            </div>

            {/* 2. Featured Reel Settings (Active when Featured Single Reel is chosen or for mobile fallback) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#090C12] border border-white/10 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-display font-bold uppercase text-white">
                    Mobile Hero Video & Poster Asset
                  </h2>
                  <p className="text-xs text-white/60">
                    High-performance vertical 9:16 video stream and instant poster.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <CloudinaryUploader
                  label="Mobile Hero Video URL (.mp4)"
                  accept="video"
                  value={heroData.mobileVideoUrl || ''}
                  onChange={(url) => setHeroData((prev) => ({ ...prev, mobileVideoUrl: url }))}
                  helpText="Upload a crisp 9:16 vertical video optimized for mobile devices."
                />

                <CloudinaryUploader
                  label="Mobile Instant Poster Image (.jpg / .png)"
                  accept="image"
                  value={heroData.mobilePosterUrl || ''}
                  onChange={(url) => setHeroData((prev) => ({ ...prev, mobilePosterUrl: url }))}
                  helpText="Displayed immediately while video is decoding to prevent black flash."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-white/70 mb-1.5">
                      Reel Title (Display Overlay)
                    </label>
                    <input
                      type="text"
                      value={heroData.mobileFeaturedTitle || ''}
                      onChange={(e) =>
                        setHeroData((prev) => ({ ...prev, mobileFeaturedTitle: e.target.value }))
                      }
                      placeholder="e.g. BrandShoots Creative Studio"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-[#008CFF] font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-white/70 mb-1.5">
                      Client / Brand Subtitle
                    </label>
                    <input
                      type="text"
                      value={heroData.mobileFeaturedClient || ''}
                      onChange={(e) =>
                        setHeroData((prev) => ({ ...prev, mobileFeaturedClient: e.target.value }))
                      }
                      placeholder="e.g. BrandShoots Official"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-[#008CFF] font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Hero Brand Typography & Tagline */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#090C12] border border-white/10 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Type className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-display font-bold uppercase text-white">
                    Hero Typography & Header Copy
                  </h2>
                  <p className="text-xs text-white/60">
                    Live editable headline and tagline shown above and below the reel.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-white/70 mb-1.5">
                    Brand Title Prefix (Electric Blue)
                  </label>
                  <input
                    type="text"
                    value={heroData.brandTitle || 'BRAND'}
                    onChange={(e) => setHeroData((prev) => ({ ...prev, brandTitle: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-[#008CFF] font-black text-sm focus:outline-none focus:border-[#008CFF] font-display uppercase tracking-wider"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-white/70 mb-1.5">
                    Shoots Title Suffix (White)
                  </label>
                  <input
                    type="text"
                    value={heroData.shootsTitle || 'SHOOTS'}
                    onChange={(e) => setHeroData((prev) => ({ ...prev, shootsTitle: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-black text-sm focus:outline-none focus:border-[#008CFF] font-display uppercase tracking-wider"
                  />
                </div>
              </div>

              {/* Tagline Configuration */}
              <div className="pt-2">
                <label className="block text-xs font-mono font-semibold uppercase text-white/70 mb-1.5">
                  Tagline (Prefix • Accent • Suffix)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={heroData.taglinePrefix || 'CREATE. '}
                    onChange={(e) => setHeroData((prev) => ({ ...prev, taglinePrefix: e.target.value }))}
                    placeholder="CREATE. "
                    className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#008CFF] text-center"
                  />
                  <input
                    type="text"
                    value={heroData.taglineAccent || 'SHOOT.'}
                    onChange={(e) => setHeroData((prev) => ({ ...prev, taglineAccent: e.target.value }))}
                    placeholder="SHOOT."
                    className="px-3 py-2 rounded-xl bg-black/60 border border-[#008CFF]/50 text-[#008CFF] text-xs font-mono font-bold focus:outline-none focus:border-[#008CFF] text-center"
                  />
                  <input
                    type="text"
                    value={heroData.taglineSuffix || ' GROW.'}
                    onChange={(e) => setHeroData((prev) => ({ ...prev, taglineSuffix: e.target.value }))}
                    placeholder=" GROW."
                    className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#008CFF] text-center"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={handleSaveMobileHero}
                disabled={isSavingHero}
                className="flex items-center gap-2.5 px-7 py-3 rounded-xl bg-[#008CFF] hover:bg-[#0070CC] text-white font-sans font-bold text-sm transition-all shadow-[0_0_25px_rgba(0,140,255,0.4)] cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-white" />
                <span>{isSavingHero ? 'Saving Changes...' : 'Save Mobile Hero Changes'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Mobile View Simulator */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="sticky top-6 w-full max-w-[340px] flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-3 text-xs font-mono text-white/50 px-1">
                <span className="uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#008CFF]" />
                  Live Mobile Simulator
                </span>
                <span className="text-[#008CFF] font-semibold">1 Reel at Once</span>
              </div>

              {/* iPhone Frame Mockup */}
              <div className="relative w-full aspect-[9/19] rounded-[44px] p-3.5 bg-[#12151D] border-[4px] border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col justify-between">
                {/* Dynamic Island / Notch */}
                <div className="absolute top-3 inset-x-0 flex justify-center z-40 pointer-events-none">
                  <div className="w-24 h-4 rounded-full bg-black border border-white/10" />
                </div>

                {/* Mobile Screen Inside */}
                <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-[#05070A] text-white flex flex-col justify-between p-4 pt-8">
                  {/* Mock Navbar */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-display font-black text-xs tracking-tight text-white">
                      BRAND<span className="text-[#008CFF]">SHOOTS</span>
                    </span>
                    <div className="w-6 h-6 rounded-md bg-white/10 flex flex-col items-center justify-center gap-1">
                      <span className="w-3.5 h-[1.5px] bg-white rounded-full" />
                      <span className="w-3.5 h-[1.5px] bg-white rounded-full" />
                    </div>
                  </div>

                  {/* Mock Tagline */}
                  <div className="text-center font-mono text-[8px] font-bold tracking-[0.25em] uppercase text-white/90">
                    <span>{heroData.taglinePrefix || 'CREATE. '}</span>
                    <span className="text-[#008CFF]">{heroData.taglineAccent || 'SHOOT.'}</span>
                    <span>{heroData.taglineSuffix || ' GROW.'}</span>
                  </div>

                  {/* Centered Single Reel Card (1 Reel at once!) */}
                  <div className="relative w-[180px] aspect-[9/16] mx-auto rounded-2xl overflow-hidden bg-[#0A0D14] border border-[#008CFF]/50 shadow-[0_12px_32px_rgba(0,140,255,0.25)] flex items-center justify-center">
                    <img
                      src={heroData.mobilePosterUrl || reels[0]?.poster || '/Logo-Official-Tight.png'}
                      alt="Mobile Reel"
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Play Badge Overlay */}
                    <div className="relative z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>

                    {/* Audio Pill */}
                    <div className="absolute top-2 right-2 z-10 p-1 rounded-full bg-black/60 text-white/80">
                      <Volume2 className="w-3 h-3 text-[#008CFF]" />
                    </div>

                    {/* Reel Title Overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10">
                      <p className="text-[10px] font-sans font-bold text-white leading-tight truncate">
                        {heroData.mobileFeaturedTitle || reels[0]?.title || 'Creative Reel'}
                      </p>
                      <p className="text-[8px] font-mono text-white/60 uppercase tracking-wider truncate">
                        {heroData.mobileFeaturedClient || reels[0]?.client || 'BrandShoots'}
                      </p>
                    </div>
                  </div>

                  {/* Pagination Dots (Cue for single reel swiping) */}
                  <div className="flex items-center justify-center gap-1">
                    <span className="w-3 h-1 rounded-full bg-[#008CFF]" />
                    <span className="w-1 h-1 rounded-full bg-white/25" />
                    <span className="w-1 h-1 rounded-full bg-white/25" />
                  </div>

                  {/* Mock BrandShoots Headline (Clean & Unblocked) */}
                  <div className="text-center">
                    <h2 className="font-display font-black text-xl tracking-tight uppercase leading-none">
                      <span className="text-[#008CFF]">{heroData.brandTitle || 'BRAND'}</span>
                      <span className="text-white ml-1">{heroData.shootsTitle || 'SHOOTS'}</span>
                    </h2>
                    <span className="block mt-1 font-mono text-[7px] font-semibold text-white/50 uppercase tracking-widest">
                      ↓ SCROLL DOWN
                    </span>
                  </div>

                  {/* Clean Clearance Note */}
                  <div className="mt-1 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <p className="text-[8.5px] font-mono text-emerald-300 font-semibold">
                      ✓ Social icons clear on Hero
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Reel Simple Modal */}
      <SimpleReelModal
        isOpen={isAddModalOpen}
        mode="add"
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewReel}
      />

      {/* Replace Reel Simple Modal */}
      <SimpleReelModal
        isOpen={replacingReel !== null}
        mode="replace"
        slotNumber={replacingIndex !== null ? replacingIndex + 1 : undefined}
        initialData={
          replacingReel
            ? {
                src: replacingReel.src,
                title: replacingReel.title,
                client: replacingReel.client,
                poster: replacingReel.poster,
              }
            : undefined
        }
        onClose={() => setReplacingReel(null)}
        onSave={handleSaveReplacedReel}
      />
    </div>
  );
};

export default HeroSectionCMS;
