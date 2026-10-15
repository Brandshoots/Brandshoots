import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  RotateCcw,
  Save,
  X,
  Eye,
  EyeOff,
  Quote,
  Star,
  MessageSquare,
  Building2,
  User,
  Briefcase,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { CMSTestimonial } from '../../types/cms';
import {
  fetchPublishedTestimonials,
  saveAllTestimonials,
  resetTestimonialsToDefaults,
} from '../../lib/cms/cmsService';
import { pushTestimonialsUndoAction, triggerNavFlash } from '../../lib/cms/cmsHistory';

export const TestimonialsCMS: React.FC = () => {
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingItem, setEditingItem] = useState<CMSTestimonial | null>(null);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Load testimonials
  const loadTestimonials = async () => {
    setLoading(true);
    const list = await fetchPublishedTestimonials();
    setTestimonials(list);
    setLoading(false);
  };

  useEffect(() => {
    loadTestimonials();

    // Listen to local & storage updates for instant 2-way sync
    const handleUpdate = (e: any) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setTestimonials(e.detail);
      } else {
        loadTestimonials();
      }
    };

    window.addEventListener('brandshoots_testimonials_updated', handleUpdate);
    return () => {
      window.removeEventListener('brandshoots_testimonials_updated', handleUpdate);
    };
  }, []);

  // Open modal for new testimonial
  const handleAddNew = () => {
    const nextOrder = testimonials.length;
    const newItem: CMSTestimonial = {
      id: `testimonial-${Date.now()}`,
      client: '',
      quote: '',
      author: '',
      role: '',
      order: nextOrder,
      visible: true,
      updatedAt: Date.now(),
    };
    setEditingItem(newItem);
    setIsNew(true);
  };

  // Open modal for editing
  const handleEdit = (item: CMSTestimonial) => {
    setEditingItem(JSON.parse(JSON.stringify(item)));
    setIsNew(false);
  };

  // Quick visibility toggle
  const handleToggleVisibility = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const prev = JSON.parse(JSON.stringify(testimonials));
    const target = testimonials.find((t) => t.id === id);
    if (!target) return;

    const newVisibility = target.visible === false ? true : false;
    const updated = testimonials.map((t) =>
      t.id === id ? { ...t, visible: newVisibility, updatedAt: Date.now() } : t
    );

    const desc = `${newVisibility ? 'Showed' : 'Hidden'} testimonial for "${target.client || target.author}"`;
    pushTestimonialsUndoAction(desc, prev);
    await saveAllTestimonials(updated);
    setTestimonials(updated);
    triggerNavFlash(desc, 'action');
  };

  // Delete testimonial
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = testimonials.find((t) => t.id === id);
    const name = target?.client || target?.author || 'Testimonial';

    if (!window.confirm(`Are you sure you want to delete the testimonial for "${name}"? You can undo this action via the navbar.`)) {
      return;
    }

    const prev = JSON.parse(JSON.stringify(testimonials));
    const updated = testimonials.filter((t) => t.id !== id);

    const desc = `Deleted testimonial for "${name}"`;
    pushTestimonialsUndoAction(desc, prev);
    await saveAllTestimonials(updated);
    setTestimonials(updated);
    triggerNavFlash(desc, 'action');
  };

  // Reset to original defaults
  const handleResetDefaults = async () => {
    if (!window.confirm('Reset all testimonials to original default reviews? You can undo this action via the navbar.')) {
      return;
    }

    const prev = JSON.parse(JSON.stringify(testimonials));
    const desc = 'Reset all testimonials to factory defaults';
    pushTestimonialsUndoAction(desc, prev);

    const defaults = await resetTestimonialsToDefaults();
    setTestimonials(defaults);
    triggerNavFlash(desc, 'action');
  };

  // Save item from modal
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.client.trim() && !editingItem.author.trim()) {
      alert('Please provide either a Client Name or Author Name.');
      return;
    }

    if (!editingItem.quote.trim()) {
      alert('Please provide the testimonial quote text.');
      return;
    }

    const prev = JSON.parse(JSON.stringify(testimonials));
    let updated: CMSTestimonial[];

    if (isNew) {
      updated = [...testimonials, { ...editingItem, updatedAt: Date.now() }];
    } else {
      updated = testimonials.map((t) =>
        t.id === editingItem.id ? { ...editingItem, updatedAt: Date.now() } : t
      );
    }

    const desc = isNew
      ? `Added new testimonial for "${editingItem.client || editingItem.author}"`
      : `Updated testimonial for "${editingItem.client || editingItem.author}"`;

    pushTestimonialsUndoAction(desc, prev);
    await saveAllTestimonials(updated);
    setTestimonials(updated);
    setSaveSuccess(true);
    triggerNavFlash(desc, 'action');

    setTimeout(() => {
      setSaveSuccess(false);
      setEditingItem(null);
    }, 400);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Header Card */}
      <div className="bg-[#070B12]/95 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_20px_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#008CFF]/15 border border-[#008CFF]/30 flex items-center justify-center text-[#008CFF] shadow-[0_0_20px_rgba(0,140,255,0.25)] shrink-0">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-mono uppercase text-white/60 font-semibold tracking-wider">
                  {testimonials.length} Reviews Active
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-sans uppercase tracking-tight text-white mt-0.5">
                Testimonials Section CMS
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-white font-mono text-xs uppercase font-semibold transition-all cursor-pointer active:scale-95"
              title="Reset all reviews to original defaults"
            >
              <RotateCcw className="w-4 h-4 text-white" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-[0_0_25px_rgba(0,140,255,0.4)] cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Add Testimonial</span>
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials List Grid */}
      {loading ? (
        <div className="p-12 text-center text-white/60 font-mono text-sm bg-[#070B12]/60 rounded-2xl border border-white/10">
          Loading testimonials...
        </div>
      ) : testimonials.length === 0 ? (
        <div className="p-12 text-center text-white/60 font-mono text-sm bg-[#070B12]/60 rounded-2xl border border-white/10 flex flex-col items-center gap-3">
          <Quote className="w-8 h-8 text-white/30" />
          <p>No testimonials found. Add your first client review or click Reset Defaults.</p>
          <button
            type="button"
            onClick={handleAddNew}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#008CFF] text-white font-mono text-xs uppercase font-bold"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Testimonial</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {testimonials.map((item, index) => {
            const isVisible = item.visible !== false;
            return (
              <div
                key={item.id}
                className={`group relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between border ${
                  isVisible
                    ? 'bg-[#070B12]/90 border-white/12 hover:border-[#008CFF]/50 hover:shadow-[0_15px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(0,140,255,0.15)]'
                    : 'bg-[#070B12]/50 border-white/5 opacity-60'
                }`}
              >
                {/* Top Header inside Card */}
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#008CFF] px-2 py-0.5 rounded bg-[#008CFF]/15 border border-[#008CFF]/30">
                      #{String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-sans font-bold text-sm text-white truncate max-w-[170px]">
                      {item.client || 'Untitled Brand'}
                    </span>
                  </div>

                  {/* Visibility Pill Badge */}
                  <span
                    className={`font-mono text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full border ${
                      isVisible
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-white/5 text-white/40 border-white/10'
                    }`}
                  >
                    {isVisible ? 'Visible' : 'Hidden'}
                  </span>
                </div>

                {/* Rating & Quote Excerpt */}
                <div className="flex flex-col gap-2.5 mb-5 flex-1">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-[#008CFF] text-[#008CFF]" />
                    ))}
                  </div>

                  <p className="font-sans text-sm text-white/85 leading-relaxed line-clamp-4 italic">
                    "{item.quote}"
                  </p>
                </div>

                {/* Author Info & Actions Footer */}
                <div className="pt-3.5 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="flex flex-col min-w-0">
                    <span className="font-sans font-bold text-xs sm:text-sm text-white truncate">
                      {item.author || 'Anonymous'}
                    </span>
                    <span className="font-mono text-[11px] text-white/50 truncate">
                      {item.role || 'Client'}
                    </span>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Toggle Visibility */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleVisibility(item.id, e)}
                      title={isVisible ? 'Hide review on website' : 'Make review visible on website'}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        isVisible
                          ? 'bg-white/5 hover:bg-white/15 text-white'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {isVisible ? (
                        <Eye className="w-4 h-4 text-white" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-white" />
                      )}
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      title="Edit this review"
                      className="w-8 h-8 rounded-xl bg-white/5 hover:bg-[#008CFF] hover:text-white flex items-center justify-center text-white transition-all cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4 text-white" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id, e)}
                      title="Delete review"
                      className="w-8 h-8 rounded-xl bg-white/5 hover:bg-red-500/20 hover:border-red-500/40 border border-transparent text-white/70 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =================================================================== */}
      {/* EDIT / ADD TESTIMONIAL MODAL                                        */}
      {/* =================================================================== */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#070B13] border border-white/15 rounded-3xl shadow-[0_25px_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh] my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 sm:px-8 sm:py-5 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#008CFF]/20 border border-[#008CFF]/40 flex items-center justify-center text-[#008CFF]">
                  <Quote className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-base sm:text-lg text-white">
                    {isNew ? 'Add New Testimonial' : 'Edit Testimonial'}
                  </h3>
                  <p className="font-mono text-xs text-white/50">
                    {isNew ? 'Create a new client review' : `Editing review for ${editingItem.client || 'Client'}`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              {/* Client & Author Fields (2 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Client Company Name */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-2 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-white" />
                    <span>Client Company / Brand *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.client}
                    onChange={(e) => setEditingItem({ ...editingItem, client: e.target.value })}
                    placeholder="e.g. Bags World"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/20 text-sm font-sans focus:outline-none focus:border-[#008CFF] focus:shadow-[0_0_15px_rgba(0,140,255,0.25)] transition-all"
                  />
                </div>

                {/* Author Full Name */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-white" />
                    <span>Author / Spokesperson *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.author}
                    onChange={(e) => setEditingItem({ ...editingItem, author: e.target.value })}
                    placeholder="e.g. Rajesh Jain"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/20 text-sm font-sans focus:outline-none focus:border-[#008CFF] focus:shadow-[0_0_15px_rgba(0,140,255,0.25)] transition-all"
                  />
                </div>
              </div>

              {/* Author Designation / Role */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-white" />
                  <span>Designation / Role</span>
                </label>
                <input
                  type="text"
                  value={editingItem.role}
                  onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                  placeholder="e.g. Founder & CEO"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/20 text-sm font-sans focus:outline-none focus:border-[#008CFF] focus:shadow-[0_0_15px_rgba(0,140,255,0.25)] transition-all"
                />
              </div>

              {/* Testimonial Quote Matter */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-white" />
                    <span>Testimonial Quote Matter *</span>
                  </label>
                  <span className="text-[11px] font-mono text-white/40">
                    {editingItem.quote.length} characters
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={editingItem.quote}
                  onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                  placeholder="Enter the client's quote and review narrative..."
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/20 text-sm font-sans focus:outline-none focus:border-[#008CFF] focus:shadow-[0_0_15px_rgba(0,140,255,0.25)] transition-all resize-none"
                />
              </div>

              {/* Visibility and Order Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                {/* Visibility Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <span className="font-mono text-xs uppercase tracking-wider text-white/80 font-semibold">
                    Live Visibility
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.visible !== false}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, visible: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008CFF]"></div>
                  </label>
                </div>

                {/* Display Order Position */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <span className="font-mono text-xs uppercase tracking-wider text-white/80 font-semibold">
                    Display Order
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={editingItem.order ?? 0}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 0 })
                    }
                    className="w-20 px-3 py-1 rounded-lg bg-black/60 border border-white/20 text-white font-mono text-xs text-center focus:outline-none focus:border-[#008CFF]"
                  />
                </div>
              </div>

              {/* LIVE CARD PREVIEW SECTION */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span className="font-mono text-xs uppercase tracking-wider text-[#008CFF] font-semibold">
                    Live Homepage Card Preview
                  </span>
                </div>

                {/* 1:1 Live Preview Box */}
                <div className="p-6 rounded-2xl bg-[#04060A] border border-white/12 shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex flex-col items-center text-center">
                  <div className="flex items-center justify-between w-full max-w-md mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="w-3 h-3 fill-[#008CFF] text-[#008CFF]" />
                      ))}
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#008CFF]/10 border border-[#008CFF]/30 flex items-center justify-center text-[#008CFF]">
                      <Quote className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>

                  <p className="font-sans font-medium text-sm sm:text-base leading-relaxed text-white/90 max-w-md">
                    "{editingItem.quote || 'Your testimonial quote will appear here...'}"
                  </p>

                  <div className="mt-4 flex flex-col items-center gap-1">
                    <span className="text-sm font-bold text-white tracking-wide font-sans">
                      {editingItem.author || 'Author Name'}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase text-white/60">
                      <span>{editingItem.role || 'Role'}</span>
                      <span className="w-1 h-1 rounded-full bg-[#008CFF]" />
                      <span className="text-[#008CFF] font-semibold">
                        {editingItem.client || 'Client Brand'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 sticky bottom-0 bg-[#070B13] pb-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/15 text-white/80 hover:text-white font-mono text-xs uppercase font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-[0_0_20px_rgba(0,140,255,0.4)] active:scale-95 cursor-pointer"
                >
                  {saveSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-white" />
                      <span>Save Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsCMS;
