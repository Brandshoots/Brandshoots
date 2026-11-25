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
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  AlertCircle,
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
import { isDurableMediaUrl } from './CloudinaryUploader';
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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [isSavingReels, setIsSavingReels] = useState(false);

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

  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error && error.message ? error.message : fallback;

  const persistHeroReels = async (nextReels: CMSHeroReel[]) => {
    const timestamp = Date.now();
    const normalized = nextReels.map((reel, index) => ({
      ...reel,
      lightSrc: reel.lightSrc || reel.src,
      order: index,
      updatedAt: timestamp,
    }));

    await saveHeroReels(normalized);
    return normalized;
  };

  const persistHeroData = async (nextHero: CMSHero) => {
    const normalized = { ...nextHero, updatedAt: Date.now() };
    await saveHero(normalized);
    return normalized;
  };

  const handleRemoveReel = async (id: string) => {
    if (isSavingReels) return;
    const target = reels.find((reel) => reel.id === id);
    const previous = reels;
    const updated = reels.filter((reel) => reel.id !== id);

    setIsSavingReels(true);
    setSaveError(null);
    try {
      const saved = await persistHeroReels(updated);
      pushUndoAction(`Removed Reel: ${target?.title || 'Slot'}`, previous);
      setReels(saved);
      showToast('Reel removed from 3D cylinder!');
    } catch (error) {
      setSaveError(getErrorMessage(error, 'Firebase could not remove this reel.'));
    } finally {
      setIsSavingReels(false);
    }
  };

  const openReplaceModal = (reel: CMSHeroReel, index: number) => {
    setReplacingReel(reel);
    setReplacingIndex(index);
  };

  const handleSaveNewReel = async (data: {
    src: string;
    title: string;
    client: string;
    poster: string;
  }) => {
    if (isSavingReels) throw new Error('Another reel change is still being saved.');
    if (!isDurableMediaUrl(data.src) || !isDurableMediaUrl(data.poster)) {
      throw new Error('Reel video and poster must use durable HTTPS or site-relative URLs.');
    }

    const previous = reels;
    const newReel: CMSHeroReel = {
      id: `hero-reel-${Date.now()}`,
      title: data.title,
      client: data.client,
      src: data.src,
      lightSrc: data.src,
      poster: data.poster,
      order: reels.length,
      visible: true,
      updatedAt: Date.now(),
    };

    setIsSavingReels(true);
    setSaveError(null);
    try {
      const saved = await persistHeroReels([...reels, newReel]);
      pushUndoAction(`Added New Reel: ${data.title}`, previous);
      setReels(saved);
      setIsAddModalOpen(false);
      showToast('New reel added to 3D cylinder!');
    } catch (error) {
      const message = getErrorMessage(error, 'Firebase could not add this reel.');
      setSaveError(message);
      throw new Error(message);
    } finally {
      setIsSavingReels(false);
    }
  };

  const handleSaveReplacedReel = async (data: {
    src: string;
    title: string;
    client: string;
    poster: string;
  }) => {
    if (!replacingReel) return;
    if (isSavingReels) throw new Error('Another reel change is still being saved.');
    if (!isDurableMediaUrl(data.src) || !isDurableMediaUrl(data.poster)) {
      throw new Error('Reel video and poster must use durable HTTPS or site-relative URLs.');
    }

    const previous = reels;
    const slotNum = replacingIndex !== null ? replacingIndex + 1 : '';
    const updated = reels.map((reel) =>
      reel.id === replacingReel.id
        ? {
            ...reel,
            title: data.title,
            client: data.client,
            src: data.src,
            lightSrc: data.src,
            poster: data.poster,
            updatedAt: Date.now(),
          }
        : reel
    );

    setIsSavingReels(true);
    setSaveError(null);
    try {
      const saved = await persistHeroReels(updated);
      pushUndoAction(`Replaced Slot #${slotNum}: ${data.title}`, previous);
      setReels(saved);
      setReplacingReel(null);
      showToast(`Slot #${slotNum} replaced successfully!`);
    } catch (error) {
      const message = getErrorMessage(error, 'Firebase could not replace this reel.');
      setSaveError(message);
      throw new Error(message);
    } finally {
      setIsSavingReels(false);
    }
  };

  const moveReel = async (index: number, direction: -1 | 1) => {
    if (isSavingReels) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= reels.length) return;

    const previous = reels;
    const updated = [...reels];
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];

    setIsSavingReels(true);
    setSaveError(null);
    try {
      const saved = await persistHeroReels(updated);
      pushUndoAction(`Moved Reel: ${reels[index].title}`, previous);
      setReels(saved);
      showToast('Reel order saved to Firebase.');
    } catch (error) {
      setSaveError(getErrorMessage(error, 'Firebase could not update the reel order.'));
    } finally {
      setIsSavingReels(false);
    }
  };

  const toggleReelVisibility = async (id: string) => {
    if (isSavingReels) return;
    const target = reels.find((reel) => reel.id === id);
    if (!target) return;

    const previous = reels;
    const updated = reels.map((reel) =>
      reel.id === id ? { ...reel, visible: !reel.visible } : reel
    );

    setIsSavingReels(true);
    setSaveError(null);
    try {
      const saved = await persistHeroReels(updated);
      pushUndoAction(`${target.visible ? 'Hidden' : 'Shown'} Reel: ${target.title}`, previous);
      setReels(saved);
      showToast(`Reel ${target.visible ? 'hidden' : 'shown'} successfully.`);
    } catch (error) {
      setSaveError(getErrorMessage(error, 'Firebase could not update reel visibility.'));
    } finally {
      setIsSavingReels(false);
    }
  };

  const handleSaveMobileHero = async () => {
    const mediaUrls = [heroData.mobileVideoUrl, heroData.mobilePosterUrl].filter(
      (url): url is string => Boolean(url?.trim())
    );
    if (mediaUrls.some((url) => !isDurableMediaUrl(url))) {
      setSaveError('Mobile video and poster must use durable HTTPS or site-relative URLs.');
      return;
    }

    try {
      setIsSavingHero(true);
      setSaveError(null);
      const saved = await persistHeroData(heroData);
      setHeroData(saved);
      showToast('Mobile Hero View & Brand Typography saved successfully!');
    } catch (error) {
      setSaveError(getErrorMessage(error, 'Firebase could not save the Mobile Hero view.'));
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

      {saveError && (
        <div
          className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 font-mono text-sm flex items-start gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{saveError}</span>
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
              onClick={() => {
                setSaveError(null);
                setIsAddModalOpen(true);
              }}
              disabled={isSavingReels}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-white/90 text-black font-sans font-bold text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
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

                  {/* Reel management controls */}
                  <div className="absolute top-2.5 right-2.5 grid grid-cols-2 gap-1.5 z-10">
                    <button
                      type="button"
                      onClick={() => void moveReel(index, -1)}
                      disabled={isSavingReels || index === 0}
                      className="w-8 h-8 rounded-lg bg-black/90 hover:bg-white border border-white/25 hover:border-white text-white hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-lg disabled:cursor-not-allowed disabled:opacity-35"
                      title="Move reel up"
                      aria-label={`Move ${reel.title} up`}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void moveReel(index, 1)}
                      disabled={isSavingReels || index === reels.length - 1}
                      className="w-8 h-8 rounded-lg bg-black/90 hover:bg-white border border-white/25 hover:border-white text-white hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-lg disabled:cursor-not-allowed disabled:opacity-35"
                      title="Move reel down"
                      aria-label={`Move ${reel.title} down`}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void toggleReelVisibility(reel.id)}
                      disabled={isSavingReels}
                      className="w-8 h-8 rounded-lg bg-black/90 hover:bg-[#008CFF] border border-white/25 hover:border-[#008CFF] text-white flex items-center justify-center transition-all cursor-pointer shadow-lg disabled:cursor-not-allowed disabled:opacity-35"
                      title={reel.visible ? 'Hide reel' : 'Show reel'}
                      aria-label={`${reel.visible ? 'Hide' : 'Show'} ${reel.title}`}
                      aria-pressed={!reel.visible}
                    >
                      {reel.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSaveError(null);
                        openReplaceModal(reel, index);
                      }}
                      disabled={isSavingReels}
                      className="group/replace w-8 h-8 rounded-lg bg-black/90 hover:bg-white border border-white/25 hover:border-white text-white hover:text-black flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg disabled:cursor-not-allowed disabled:opacity-35"
                      title="Replace this reel"
                      aria-label="Replace reel"
                    >
                      <RefreshCw className="w-3.5 h-3.5 transition-transform duration-300 group-hover/replace:rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleRemoveReel(reel.id)}
                      disabled={isSavingReels}
                      className="group/remove col-span-2 w-full h-8 rounded-lg bg-black/90 hover:bg-red-600 border border-white/25 hover:border-red-600 text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg disabled:cursor-not-allowed disabled:opacity-35"
                      title="Remove reel"
                      aria-label="Remove reel"
                    >
                      <Trash2 className="w-3.5 h-3.5 transition-transform duration-200 group-hover/remove:scale-110" />
                    </button>
                  </div>

                  {!reel.visible && (
                    <div className="absolute inset-x-0 bottom-0 bg-black/85 px-3 py-2 text-center text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
                      Hidden from public view
                    </div>
                  )}
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
                    <span className="block mt-1 text-xs font-mono font-semibold text-white/60 tracking-wider truncate">
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
                    Mobile Hero Reels (Synced with Desktop 3D Carousel)
                  </h2>
                  <p className="text-xs text-white/60">
                    Mobile view now plays the exact same visible reels from the Desktop 3D Hero Reels list ({reels.filter((r) => r.visible !== false).length} active).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#008CFF]/10 border border-[#008CFF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-white/75 leading-relaxed">
                  Add, reorder, or hide reels in the <strong>Desktop 3D Reel Carousel</strong> tab to update both desktop and mobile hero videos simultaneously.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('desktop-reels')}
                  className="shrink-0 px-4 py-2 rounded-lg bg-[#008CFF] hover:bg-[#0070CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Manage Shared Reels
                </button>
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
                className="flex items-center gap-2.5 px-7 py-3 rounded-xl bg-[#008CFF] hover:bg-[#0070CC] text-white font-sans font-bold text-sm transition-all shadow-[0_0_25px_rgba(0,140,255,0.4)] cursor-pointer active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-white" />
                <span>
                  {isSavingHero ? 'Saving Changes...' : 'Save Hero Copy Changes'}
                </span>
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
                      <p className="text-[8px] font-mono text-white/60 tracking-wider truncate">
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
