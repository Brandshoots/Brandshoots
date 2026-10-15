import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';
import { CMSHeroReel } from '../../types/cms';
import {
  fetchPublishedHeroReels,
  saveHeroReels,
} from '../../lib/cms/cmsService';
import { INITIAL_HERO_REELS } from '../../lib/cms/seedData';
import { SimpleReelModal } from './SimpleReelModal';
import { pushUndoAction } from '../../lib/cms/cmsHistory';

export const HeroSectionCMS: React.FC = () => {
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

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Replace reel modal state
  const [replacingReel, setReplacingReel] = useState<CMSHeroReel | null>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

  // Fetch published reels on mount & listen for undo updates
  useEffect(() => {
    let isMounted = true;
    fetchPublishedHeroReels().then((data) => {
      if (isMounted && data && data.length > 0) {
        setReels(data);
      }
    });

    const handleReelsUpdated = (e: any) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setReels(e.detail);
      }
    };
    window.addEventListener('brandshoots_hero_reels_updated', handleReelsUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener('brandshoots_hero_reels_updated', handleReelsUpdated);
    };
  }, []);

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 2500);
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

  return (
    <div className="w-full space-y-6">
      {/* Top Bar: Title, Count, and Add Reel Action */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-display font-black uppercase tracking-wider text-white">
            Hero 3D Reels
          </h1>
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono font-bold text-white">
            {reels.length} Active
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-white/90 text-black font-sans font-bold text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Add Reel</span>
        </button>
      </div>

      {/* Instant Notification Toast */}
      {saveToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Generous Responsive Grid of all 3D Hero Reels */}
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

            {/* Bottom Info Bar: Bold, Clear, Perfectly Legible */}
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
