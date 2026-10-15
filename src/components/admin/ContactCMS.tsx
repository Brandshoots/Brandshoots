import React, { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  CheckCircle2,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Instagram,
  Youtube,
  Facebook,
  Sparkles,
  Inbox,
  Clock,
  Trash2,
  Plus,
  X,
  Building,
  Compass,
} from 'lucide-react';
import { CMSContactPage, CMSLead } from '../../types/cms';
import {
  fetchPublishedContactPage,
  saveContactPage,
  resetContactPageToDefaults,
  fetchLeads,
  updateLeadStatus,
  deleteLead,
} from '../../lib/cms/cmsService';
import { pushContactUndoAction, triggerNavFlash } from '../../lib/cms/cmsHistory';

export const ContactCMS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'leads'>('content');

  // Contact page form state
  const [contactData, setContactData] = useState<CMSContactPage | null>(null);
  const [originalData, setOriginalData] = useState<CMSContactPage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // New project type input state
  const [newProjectType, setNewProjectType] = useState<string>('');

  // Leads state
  const [leads, setLeads] = useState<CMSLead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState<boolean>(false);
  const [leadFilter, setLeadFilter] = useState<'all' | 'new' | 'contacted' | 'in_discussion' | 'closed'>('all');

  // Load contact page data
  const loadContactData = async () => {
    setLoading(true);
    const data = await fetchPublishedContactPage();
    setContactData(JSON.parse(JSON.stringify(data)));
    setOriginalData(JSON.parse(JSON.stringify(data)));
    setLoading(false);
  };

  // Load leads
  const loadLeadsData = async () => {
    setLoadingLeads(true);
    try {
      const list = await fetchLeads();
      setLeads(list);
    } catch (err) {
      console.warn('Failed to fetch leads:', err);
    } finally {
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    loadContactData();
    loadLeadsData();

    // Listen to local & storage updates for instant 2-way sync
    const handleUpdate = (e: any) => {
      if (e?.detail && typeof e.detail === 'object') {
        setContactData(JSON.parse(JSON.stringify(e.detail)));
        setOriginalData(JSON.parse(JSON.stringify(e.detail)));
      } else {
        loadContactData();
      }
    };

    window.addEventListener('brandshoots_contact_updated', handleUpdate);
    return () => {
      window.removeEventListener('brandshoots_contact_updated', handleUpdate);
    };
  }, []);

  // Save changes
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!contactData) return;

    setIsSaving(true);
    const desc = 'Updated Contact Page & Channels';
    if (originalData) {
      pushContactUndoAction(desc, originalData);
    }

    await saveContactPage(contactData);
    setOriginalData(JSON.parse(JSON.stringify(contactData)));
    setIsSaving(false);
    setSaveSuccess(true);
    triggerNavFlash('Contact settings saved & published to live site', 'action');

    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Reset to defaults
  const handleReset = async () => {
    if (!window.confirm('Reset all Contact page fields to factory defaults? Any unsaved edits will be discarded.')) {
      return;
    }
    setLoading(true);
    if (originalData) {
      pushContactUndoAction('Reset Contact Page to Defaults', originalData);
    }
    const defaults = await resetContactPageToDefaults();
    setContactData(JSON.parse(JSON.stringify(defaults)));
    setOriginalData(JSON.parse(JSON.stringify(defaults)));
    setLoading(false);
    triggerNavFlash('Contact page reset to factory defaults', 'undo');
  };

  // Add project type chip
  const handleAddProjectType = () => {
    if (!newProjectType.trim() || !contactData) return;
    const trimmed = newProjectType.trim();
    if (!contactData.projectTypes.includes(trimmed)) {
      setContactData({
        ...contactData,
        projectTypes: [...contactData.projectTypes, trimmed],
      });
    }
    setNewProjectType('');
  };

  // Remove project type chip
  const handleRemoveProjectType = (typeToRemove: string) => {
    if (!contactData) return;
    setContactData({
      ...contactData,
      projectTypes: contactData.projectTypes.filter((t) => t !== typeToRemove),
    });
  };

  // Lead status update
  const handleStatusChange = async (leadId: string, newStatus: CMSLead['status']) => {
    try {
      await updateLeadStatus(leadId, newStatus);
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
      triggerNavFlash(`Lead status updated to ${newStatus}`, 'action');
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  // Delete lead
  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await deleteLead(leadId);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      triggerNavFlash('Lead deleted successfully', 'action');
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  if (loading || !contactData) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 text-white/50">
        <div className="w-9 h-9 border-2 border-[#008CFF] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-mono text-xs tracking-wider uppercase">Loading Contact CMS...</span>
      </div>
    );
  }

  const filteredLeads = leads.filter((l) => {
    if (leadFilter === 'all') return true;
    return l.status === leadFilter;
  });

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="w-full flex flex-col space-y-8 animate-fadeIn">
      {/* =================================================================== */}
      {/* 1. HEADER BAR                                                       */}
      {/* =================================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#008CFF] mb-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
            <span>CONTACT & LEAD CHANNELS</span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white flex items-center gap-3">
            <span>CONTACT PAGE & CHANNELS</span>
            {saveSuccess && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-semibold lowercase animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>saved live!</span>
              </span>
            )}
          </h1>

          <p className="mt-1.5 text-xs sm:text-sm text-white/60 max-w-2xl font-light leading-relaxed">
            Manage inquiry channels, phone numbers, WhatsApp, physical studio location, Google Maps embeds, site visit pricing, and inspect client leads.
          </p>
        </div>

        {/* Action Controls & Tabs */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Tab Switcher */}
          <div className="flex items-center bg-[#070B14] border border-white/12 rounded-xl p-1 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-sans uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-[#008CFF] text-white shadow-[0_0_15px_rgba(0,140,255,0.4)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Channels & Content</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('leads')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-sans uppercase tracking-wider transition-all cursor-pointer relative ${
                activeTab === 'leads'
                  ? 'bg-[#008CFF] text-white shadow-[0_0_15px_rgba(0,140,255,0.4)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Inquiries & Leads</span>
              {newLeadsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                  {newLeadsCount}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'content' && (
            <>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/80 hover:text-white font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={() => handleSave()}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#008CFF] hover:bg-[#1a97ff] text-white font-sans text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(0,140,255,0.35)] disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save & Publish'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. TAB 1: CHANNELS & CONTENT EDITOR                                */}
      {/* =================================================================== */}
      {activeTab === 'content' && (
        <form onSubmit={handleSave} className="space-y-8">
          {/* --------------------------------------------------------------- */}
          {/* BLOCK 1: HERO & STATEMENT                                       */}
          {/* --------------------------------------------------------------- */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#070B14]/90 border border-white/10 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-wider text-[#008CFF] font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Section 01</span>
            </div>
            <h2 className="font-display font-black text-xl uppercase tracking-tight text-white mb-6">
              Hero & Opening Statement
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-white/70 mb-2">
                  Hero Headline Prefix
                </label>
                <input
                  type="text"
                  value={contactData.heroTitle}
                  onChange={(e) =>
                    setContactData({ ...contactData, heroTitle: e.target.value })
                  }
                  placeholder="e.g. LET'S MAKE SOMETHING"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#008CFF] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-white/70 mb-2">
                  Headline Electric Blue Accent
                </label>
                <input
                  type="text"
                  value={contactData.heroHighlight}
                  onChange={(e) =>
                    setContactData({ ...contactData, heroHighlight: e.target.value })
                  }
                  placeholder="e.g. WORTH WATCHING."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#008CFF] transition-all font-semibold text-[#008CFF]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider font-mono text-white/70 mb-2">
                  Hero Subtitle / Value Proposition
                </label>
                <textarea
                  rows={2}
                  value={contactData.heroSubtitle}
                  onChange={(e) =>
                    setContactData({ ...contactData, heroSubtitle: e.target.value })
                  }
                  placeholder="Tell us what you're building, what you need, and where you want to take it."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#008CFF] transition-all resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-white/70 mb-2">
                  Hero CTA Button Label
                </label>
                <input
                  type="text"
                  value={contactData.heroCtaText}
                  onChange={(e) =>
                    setContactData({ ...contactData, heroCtaText: e.target.value })
                  }
                  placeholder="START A CONVERSATION"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#008CFF] transition-all"
                />
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* BLOCK 2: DIRECT CONTACT CHANNELS                                */}
          {/* --------------------------------------------------------------- */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#070B14]/90 border border-white/10 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-wider text-[#008CFF] font-bold mb-1">
              <Phone className="w-4 h-4" />
              <span>Section 02</span>
            </div>
            <h2 className="font-display font-black text-xl uppercase tracking-tight text-white mb-6">
              Direct Phone, WhatsApp & Email
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-white/70 mb-2">
                  Display Phone / WhatsApp (Formatted)
                </label>
                <input
                  type="text"
                  value={contactData.displayPhone}
                  onChange={(e) =>
                    setContactData({ ...contactData, displayPhone: e.target.value })
                  }
                  placeholder="+91 70759 60672"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#008CFF] transition-all font-mono"
                />
                <span className="block text-[11px] font-mono text-white/40 mt-1.5">
                  Visible text shown to users on web cards and phone links.
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-white/70 mb-2">
                  WhatsApp Direct Number (Digits with Country Code)
                </label>
                <input
                  type="text"
                  value={contactData.whatsappPhone}
                  onChange={(e) =>
                    setContactData({ ...contactData, whatsappPhone: e.target.value })
                  }
                  placeholder="917075960672"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#008CFF] transition-all font-mono"
                />
                <span className="block text-[11px] font-mono text-white/40 mt-1.5">
                  Used directly in <code className="text-[#008CFF]">https://wa.me/[number]</code> deep-links.
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-white/70 mb-2">
                  Studio Email Address
                </label>
                <input
                  type="email"
                  value={contactData.email}
                  onChange={(e) =>
                    setContactData({ ...contactData, email: e.target.value })
                  }
                  placeholder="contact@brandshoots.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#008CFF] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-white/70 mb-2">
                  City, State & Region
                </label>
                <input
                  type="text"
                  value={contactData.cityState}
                  onChange={(e) =>
                    setContactData({ ...contactData, cityState: e.target.value })
                  }
                  placeholder="Rajamahendravaram, Andhra Pradesh, India"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#008CFF] transition-all"
                />
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* BLOCK 3: STUDIO LOCATION & MAP                                  */}
          {/* --------------------------------------------------------------- */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#070B14]/90 border border-white/10 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-wider text-[#008CFF] font-bold mb-1">
              <MapPin className="w-4 h-4" />
              <span>Section 03</span>
            </div>
            <h2 className="font-display font-black text-xl uppercase tracking-tight text-white mb-6">
              Physical Studio Address & Google Maps
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-white/70 mb-2">
                  Full Physical Studio Address
                </label>
                <textarea
                  rows={2}
                  value={contactData.fullAddress}
                  onChange={(e) =>
                    setContactData({ ...contactData, fullAddress: e.target.value })
                  }
                  placeholder="26-2-7/2, Jayakrishnapuram, near Kambala Cheruvu, Rajamahendravaram, Andhra Pradesh, India"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#008CFF] transition-all leading-relaxed"
                />
                <span className="block text-[11px] font-mono text-white/40 mt-1.5">
                  Copied when users click "Copy Address" on the contact page.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-white/70 mb-2">
                    Google Maps Search / Directions Link
                  </label>
                  <input
                    type="url"
                    value={contactData.googleMapsSearchUrl}
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        googleMapsSearchUrl: e.target.value,
                      })
                    }
                    placeholder="https://www.google.com/maps/search/?api=1&query=..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/20 text-xs focus:outline-none focus:border-[#008CFF] transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-white/70 mb-2">
                    Google Maps Iframe Embed URL
                  </label>
                  <input
                    type="url"
                    value={contactData.googleMapsEmbedUrl}
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        googleMapsEmbedUrl: e.target.value,
                      })
                    }
                    placeholder="https://maps.google.com/maps?q=...&output=embed"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/20 text-xs focus:outline-none focus:border-[#008CFF] transition-all font-mono"
                  />
                </div>
              </div>

              {/* Map Embed Live Preview */}
              {contactData.googleMapsEmbedUrl && (
                <div className="mt-4">
                  <span className="block text-xs uppercase tracking-wider font-mono text-white/50 mb-2">
                    Live Map Preview
                  </span>
                  <div className="w-full h-44 rounded-2xl border border-white/10 overflow-hidden bg-black/40">
                    <iframe
                      title="Google Maps Preview"
                      src={contactData.googleMapsEmbedUrl}
                      className="w-full h-full border-0 filter contrast-[1.05]"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* BLOCK 4: ON-LOCATION SITE VISIT (RECCE)                         */}
          {/* --------------------------------------------------------------- */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#070B14]/90 border border-white/10 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-wider text-[#008CFF] font-bold mb-1">
              <Compass className="w-4 h-4" />
              <span>Section 04</span>
            </div>
            <h2 className="font-display font-black text-xl uppercase tracking-tight text-white mb-6">
              On-Location Site Visit (Recce) Card
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-white/70 mb-2">
                  Tag / Pill Label
                </label>
                <input
                  type="text"
                  value={contactData.siteVisitTag}
                  onChange={(e) =>
                    setContactData({ ...contactData, siteVisitTag: e.target.value })
                  }
                  placeholder="ON-LOCATION RECCE"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#008CFF] transition-all font-mono text-[#008CFF]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-white/70 mb-2">
                  Section Headline
                </label>
                <input
                  type="text"
                  value={contactData.siteVisitTitle}
                  onChange={(e) =>
                    setContactData({ ...contactData, siteVisitTitle: e.target.value })
                  }
                  placeholder="SITE VISIT."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#008CFF] transition-all font-bold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-white/70 mb-2">
                  Fixed Fee & Unit
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={contactData.siteVisitPrice}
                    onChange={(e) =>
                      setContactData({ ...contactData, siteVisitPrice: e.target.value })
                    }
                    placeholder="₹2,000"
                    className="w-2/3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#008CFF] transition-all font-bold"
                  />
                  <input
                    type="text"
                    value={contactData.siteVisitPriceUnit}
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        siteVisitPriceUnit: e.target.value,
                      })
                    }
                    placeholder="/ visit"
                    className="w-1/3 px-3 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/20 text-xs focus:outline-none focus:border-[#008CFF] transition-all text-white/60 font-mono"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider font-mono text-white/70 mb-2">
                  Service Recce Description
                </label>
                <textarea
                  rows={2}
                  value={contactData.siteVisitDescription}
                  onChange={(e) =>
                    setContactData({
                      ...contactData,
                      siteVisitDescription: e.target.value,
                    })
                  }
                  placeholder="Need our team to inspect your factory, showroom, outdoor estate..."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#008CFF] transition-all resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-white/70 mb-2">
                  Button Label
                </label>
                <input
                  type="text"
                  value={contactData.siteVisitCtaText}
                  onChange={(e) =>
                    setContactData({
                      ...contactData,
                      siteVisitCtaText: e.target.value,
                    })
                  }
                  placeholder="BOOK A SITE VISIT"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#008CFF] transition-all"
                />
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* BLOCK 5: SOCIAL MEDIA CHANNELS & HANDLES                        */}
          {/* --------------------------------------------------------------- */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#070B14]/90 border border-white/10 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-wider text-[#008CFF] font-bold mb-1">
              <Instagram className="w-4 h-4" />
              <span>Section 05</span>
            </div>
            <h2 className="font-display font-black text-xl uppercase tracking-tight text-white mb-6">
              Official Social Media Handles & Profiles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Instagram */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/8 space-y-3">
                <div className="flex items-center gap-2 text-pink-400 font-bold text-xs uppercase tracking-wider">
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-white/50 mb-1">Handle</label>
                  <input
                    type="text"
                    value={contactData.instagramHandle}
                    onChange={(e) =>
                      setContactData({ ...contactData, instagramHandle: e.target.value })
                    }
                    placeholder="@wearebrandshoots"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/12 text-white text-xs font-mono focus:outline-none focus:border-[#008CFF]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-white/50 mb-1">Full URL</label>
                  <input
                    type="url"
                    value={contactData.instagramUrl}
                    onChange={(e) =>
                      setContactData({ ...contactData, instagramUrl: e.target.value })
                    }
                    placeholder="https://instagram.com/wearebrandshoots"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/12 text-white text-xs font-mono focus:outline-none focus:border-[#008CFF]"
                  />
                </div>
              </div>

              {/* YouTube */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/8 space-y-3">
                <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider">
                  <Youtube className="w-4 h-4" />
                  <span>YouTube</span>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-white/50 mb-1">Handle</label>
                  <input
                    type="text"
                    value={contactData.youtubeHandle}
                    onChange={(e) =>
                      setContactData({ ...contactData, youtubeHandle: e.target.value })
                    }
                    placeholder="@wearebrandshoots"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/12 text-white text-xs font-mono focus:outline-none focus:border-[#008CFF]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-white/50 mb-1">Full Channel URL</label>
                  <input
                    type="url"
                    value={contactData.youtubeUrl}
                    onChange={(e) =>
                      setContactData({ ...contactData, youtubeUrl: e.target.value })
                    }
                    placeholder="https://youtube.com/@wearebrandshoots"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/12 text-white text-xs font-mono focus:outline-none focus:border-[#008CFF]"
                  />
                </div>
              </div>

              {/* Facebook */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/8 space-y-3">
                <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-wider">
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-white/50 mb-1">Handle / Page</label>
                  <input
                    type="text"
                    value={contactData.facebookHandle}
                    onChange={(e) =>
                      setContactData({ ...contactData, facebookHandle: e.target.value })
                    }
                    placeholder="@wearebrandshoots"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/12 text-white text-xs font-mono focus:outline-none focus:border-[#008CFF]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-white/50 mb-1">Full Page URL</label>
                  <input
                    type="url"
                    value={contactData.facebookUrl}
                    onChange={(e) =>
                      setContactData({ ...contactData, facebookUrl: e.target.value })
                    }
                    placeholder="https://facebook.com/wearebrandshoots"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/12 text-white text-xs font-mono focus:outline-none focus:border-[#008CFF]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* BLOCK 6: PROJECT TYPES (INQUIRY FORM DROPDOWN)                  */}
          {/* --------------------------------------------------------------- */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#070B14]/90 border border-white/10 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-wider text-[#008CFF] font-bold mb-1">
              <Building className="w-4 h-4" />
              <span>Section 06</span>
            </div>
            <h2 className="font-display font-black text-xl uppercase tracking-tight text-white mb-2">
              Inquiry Form Project Types
            </h2>
            <p className="text-xs text-white/60 mb-5">
              These options appear in the "Project Type" dropdown on the public contact form.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              {contactData.projectTypes.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white text-xs font-semibold font-sans tracking-wide"
                >
                  <span>{type}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveProjectType(type)}
                    className="text-white/40 hover:text-rose-400 transition-colors cursor-pointer"
                    aria-label={`Remove ${type}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 max-w-md">
              <input
                type="text"
                value={newProjectType}
                onChange={(e) => setNewProjectType(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddProjectType();
                  }
                }}
                placeholder="Add new project type..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/20 text-xs focus:outline-none focus:border-[#008CFF] transition-all"
              />
              <button
                type="button"
                onClick={handleAddProjectType}
                className="px-4 py-2.5 rounded-xl bg-[#008CFF] hover:bg-[#1a97ff] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Bottom Save Button */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#008CFF] hover:bg-[#1a97ff] text-white font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.16em] transition-all duration-200 active:scale-95 cursor-pointer shadow-[0_0_30px_rgba(0,140,255,0.4)] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'SAVING CHANGES...' : 'SAVE & PUBLISH ALL CHANGES'}</span>
            </button>
          </div>
        </form>
      )}

      {/* =================================================================== */}
      {/* 3. TAB 2: INCOMING INQUIRIES & LEADS INBOX                         */}
      {/* =================================================================== */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#070B14]/80 border border-white/10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono uppercase tracking-wider text-white/50 mr-2">Filter:</span>
              {(['all', 'new', 'contacted', 'in_discussion', 'closed'] as const).map((filter) => {
                const count =
                  filter === 'all'
                    ? leads.length
                    : leads.filter((l) => l.status === filter).length;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setLeadFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                      leadFilter === filter
                        ? 'bg-[#008CFF] text-white shadow-sm'
                        : 'bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <span className="capitalize">{filter.replace('_', ' ')}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/40">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={loadLeadsData}
              disabled={loadingLeads}
              className="text-xs font-mono uppercase text-[#008CFF] hover:underline cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${loadingLeads ? 'animate-spin' : ''}`} />
              <span>Refresh Leads</span>
            </button>
          </div>

          {/* Leads List */}
          {filteredLeads.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#070B14]/60 border border-white/8 text-center flex flex-col items-center">
              <Inbox className="w-12 h-12 text-white/20 mb-3" />
              <h3 className="font-display font-black text-lg uppercase text-white/80">No Leads Found</h3>
              <p className="text-xs text-white/40 mt-1 max-w-sm">
                No inquiries matching the selected filter. Leads submitted via the contact form or site visit booking will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLeads.map((lead) => {
                const createdDate = lead.createdAt
                  ? new Date(lead.createdAt).toLocaleString([], {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : 'Recent';

                return (
                  <div
                    key={lead.id}
                    className="p-5 sm:p-6 rounded-2xl bg-[#070B14]/90 border border-white/10 hover:border-white/20 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl"
                  >
                    {/* Left: Client info & message */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-sans font-black text-lg text-white">
                          {lead.name}
                        </span>

                        {lead.brandName && (
                          <span className="px-2.5 py-0.5 rounded-full bg-white/[0.08] text-white/80 font-mono text-xs font-semibold">
                            {lead.brandName}
                          </span>
                        )}

                        <span
                          className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider ${
                            lead.type === 'site_visit'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-[#008CFF]/20 text-[#008CFF] border border-[#008CFF]/30'
                          }`}
                        >
                          {lead.type === 'site_visit' ? 'Site Visit (₹2,000)' : 'General Inquiry'}
                        </span>

                        {lead.serviceType && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[11px] border border-emerald-500/20">
                            {lead.serviceType}
                          </span>
                        )}
                      </div>

                      {lead.message && (
                        <p className="text-xs sm:text-sm text-white/75 bg-white/[0.02] p-3 rounded-xl border border-white/5 leading-relaxed font-light">
                          "{lead.message}"
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/50">
                        {lead.phone && (
                          <span className="flex items-center gap-1.5 text-white/80">
                            <Phone className="w-3.5 h-3.5 text-[#008CFF]" />
                            <span>{lead.phone}</span>
                          </span>
                        )}

                        {lead.email && (
                          <span className="flex items-center gap-1.5 text-white/80">
                            <Mail className="w-3.5 h-3.5 text-[#008CFF]" />
                            <span>{lead.email}</span>
                          </span>
                        )}

                        <span className="flex items-center gap-1 text-white/40">
                          <Clock className="w-3 h-3" />
                          <span>{createdDate}</span>
                        </span>
                      </div>
                    </div>

                    {/* Right: Actions & Status */}
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      {/* WhatsApp Quick Connect */}
                      {lead.phone && (
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hi ${lead.name}, thank you for contacting BRANDSHOOTS!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      {/* Status Dropdown */}
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(lead.id, e.target.value as CMSLead['status'])
                        }
                        className={`px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border cursor-pointer focus:outline-none transition-all ${
                          lead.status === 'new'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : lead.status === 'contacted'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : lead.status === 'in_discussion'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        <option value="new" className="bg-[#070B14] text-white">New</option>
                        <option value="contacted" className="bg-[#070B14] text-white">Contacted</option>
                        <option value="in_discussion" className="bg-[#070B14] text-white">In Discussion</option>
                        <option value="closed" className="bg-[#070B14] text-white">Closed</option>
                      </select>

                      {/* Delete Lead */}
                      <button
                        type="button"
                        onClick={() => handleDeleteLead(lead.id)}
                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-white/50 hover:text-rose-400 transition-all cursor-pointer"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactCMS;
