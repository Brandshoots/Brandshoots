import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Archive,
  AlertCircle,
  Plus,
  X,
  Building,
  Compass,
  ExternalLink,
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

const normalizeCollegeSpelling = (data: CMSContactPage): CMSContactPage => {
  const rawPrice = (data.siteVisitPrice || '').trim();
  const siteVisitPrice = (!rawPrice || rawPrice === '₹2,000' || rawPrice === '2000')
    ? '₹999'
    : rawPrice;
  return {
    ...data,
    email: data.email?.trim() || 'brandshoots.in@gmail.com',
    siteVisitPrice,
    fullAddress: data.fullAddress.replace(/Collage/gi, 'College'),
    googleMapsEmbedUrl: data.googleMapsEmbedUrl.replace(/Collage/gi, 'College'),
    googleMapsSearchUrl: data.googleMapsSearchUrl.replace(/Collage/gi, 'College'),
  };
};

const sanitizeWhatsAppNumber = (value: string): string => value.replace(/\D/g, '');

const isSafeHttpsUrl = (value: string): boolean => {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
};

const validateContactData = (data: CMSContactPage): string | null => {
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    return 'Enter a valid contact email address.';
  }
  const whatsappNumber = sanitizeWhatsAppNumber(data.whatsappPhone);
  if (data.whatsappPhone && !/^\d{7,15}$/.test(whatsappNumber)) {
    return 'Enter a WhatsApp number with 7–15 digits, including its country code.';
  }

  const urls: Array<[string, string]> = [
    ['Google Maps directions', data.googleMapsSearchUrl],
    ['Google Maps embed', data.googleMapsEmbedUrl],
    ['Instagram', data.instagramUrl],
    ['YouTube', data.youtubeUrl],
    ['Facebook', data.facebookUrl],
  ];
  const invalidUrl = urls.find(([, value]) => value.trim() && !isSafeHttpsUrl(value));
  return invalidUrl ? `${invalidUrl[0]} must be a valid HTTPS URL.` : null;
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const ContactCMS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'leads'>('content');

  // Contact page form state
  const [contactData, setContactData] = useState<CMSContactPage | null>(null);
  const [originalData, setOriginalData] = useState<CMSContactPage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [saveNoticeType, setSaveNoticeType] = useState<'success' | 'error'>('success');
  const [contactError, setContactError] = useState<string | null>(null);

  // New project type input state
  const [newProjectType, setNewProjectType] = useState<string>('');

  // Leads state
  const [leads, setLeads] = useState<CMSLead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState<boolean>(false);
  const [leadFilter, setLeadFilter] = useState<'all' | CMSLead['status']>('all');
  const [leadError, setLeadError] = useState<string | null>(null);
  const [leadNotes, setLeadNotes] = useState<Record<string, string>>({});
  const [leadActions, setLeadActions] = useState<Record<string, string>>({});

  // Load contact page data
  const loadContactData = async () => {
    setLoading(true);
    setContactError(null);
    try {
      const data = normalizeCollegeSpelling(await fetchPublishedContactPage());
      setContactData(clone(data));
      setOriginalData(clone(data));
    } catch (err) {
      console.error('Failed to load contact settings:', err);
      setContactData(null);
      setOriginalData(null);
      setContactError('Contact settings could not be loaded. Check your connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  // Load leads
  const loadLeadsData = async () => {
    setLoadingLeads(true);
    setLeadError(null);
    try {
      const list = await fetchLeads();
      setLeads(list);
      setLeadNotes(
        Object.fromEntries(list.map((lead) => [lead.id, lead.notes || '']))
      );
    } catch (err) {
      console.error('Failed to fetch leads:', err);
      setLeadError('Leads could not be loaded. Check your connection and use Refresh Leads to retry.');
    } finally {
      setLoadingLeads(false);
    }
  };

  const isDirty = useMemo(() => {
    if (!contactData || !originalData) return false;
    return JSON.stringify(contactData) !== JSON.stringify(originalData);
  }, [contactData, originalData]);
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  useEffect(() => {
    loadContactData();
    loadLeadsData();

    // Listen to local & storage updates for instant 2-way sync (only when not actively editing)
    const handleUpdate = (e: any) => {
      if (isDirtyRef.current) return;
      if (e?.detail && typeof e.detail === 'object') {
        const normalized = normalizeCollegeSpelling(e.detail);
        setContactData(JSON.parse(JSON.stringify(normalized)));
        setOriginalData(JSON.parse(JSON.stringify(normalized)));
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
    if (!contactData || isSaving || isResetting) return;

    const normalized = normalizeCollegeSpelling({
      ...contactData,
      email: contactData.email.trim(),
      whatsappPhone: sanitizeWhatsAppNumber(contactData.whatsappPhone),
      instagramUrl: contactData.instagramUrl.trim(),
      youtubeUrl: contactData.youtubeUrl.trim(),
      facebookUrl: contactData.facebookUrl.trim(),
      googleMapsEmbedUrl: contactData.googleMapsEmbedUrl.trim(),
      googleMapsSearchUrl: contactData.googleMapsSearchUrl.trim(),
    });
    const validationError = validateContactData(normalized);
    if (validationError) {
      setSaveSuccess(false);
      setSaveNoticeType('error');
      setSaveToast(validationError);
      return;
    }

    const previousData = originalData ? clone(originalData) : null;
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveToast(null);

    try {
      await saveContactPage(normalized);
      if (previousData) {
        pushContactUndoAction('Updated Contact Page & Channels', previousData);
      }
      setContactData(clone(normalized));
      setOriginalData(clone(normalized));
      setSaveSuccess(true);
      setSaveNoticeType('success');
      setSaveToast('Contact page settings saved and published live to the website.');
      triggerNavFlash('Contact settings saved & published to live site', 'action');
    } catch (err) {
      console.error('Failed to save contact settings:', err);
      setSaveNoticeType('error');
      setSaveToast('Contact settings were not saved. Check your connection and try again.');
    } finally {
      setIsSaving(false);
      window.setTimeout(() => {
        setSaveSuccess(false);
        setSaveToast(null);
      }, 4000);
    }
  };

  // Reset to defaults
  const handleReset = async () => {
    if (isSaving || isResetting) return;
    if (!window.confirm('Reset all Contact page fields to factory defaults? Any unsaved edits will be discarded.')) {
      return;
    }

    const previousData = originalData ? clone(originalData) : null;
    setIsResetting(true);
    setSaveSuccess(false);
    setSaveToast(null);
    try {
      const defaults = normalizeCollegeSpelling(await resetContactPageToDefaults());
      if (previousData) {
        pushContactUndoAction('Reset Contact Page to Defaults', previousData);
      }
      setContactData(clone(defaults));
      setOriginalData(clone(defaults));
      setSaveSuccess(true);
      setSaveNoticeType('success');
      setSaveToast('Contact page reset to factory defaults and synced to the live website.');
      triggerNavFlash('Contact page reset to factory defaults', 'undo');
    } catch (err) {
      console.error('Failed to reset contact settings:', err);
      setSaveNoticeType('error');
      setSaveToast('Contact settings could not be reset. Check your connection and try again.');
    } finally {
      setIsResetting(false);
      window.setTimeout(() => {
        setSaveSuccess(false);
        setSaveToast(null);
      }, 4000);
    }
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

  const setLeadAction = (leadId: string, action?: string) => {
    setLeadActions((previous) => {
      const next = { ...previous };
      if (action) next[leadId] = action;
      else delete next[leadId];
      return next;
    });
  };

  // Lead status update
  const handleStatusChange = async (leadId: string, newStatus: CMSLead['status']) => {
    if (leadActions[leadId]) return;
    setLeadError(null);
    setLeadAction(leadId, 'status');
    try {
      await updateLeadStatus(leadId, newStatus);
      setLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead))
      );
      triggerNavFlash(`Lead status updated to ${newStatus}`, 'action');
    } catch (err) {
      console.error('Failed to update lead status:', err);
      setLeadError('The lead status was not updated. Check your connection and try again.');
    } finally {
      setLeadAction(leadId);
    }
  };

  const handleSaveNotes = async (lead: CMSLead) => {
    if (leadActions[lead.id]) return;
    const notes = (leadNotes[lead.id] || '').trim();
    setLeadError(null);
    setLeadAction(lead.id, 'notes');
    try {
      await updateLeadStatus(lead.id, lead.status, notes);
      setLeads((previous) =>
        previous.map((item) => (item.id === lead.id ? { ...item, notes } : item))
      );
      setLeadNotes((previous) => ({ ...previous, [lead.id]: notes }));
      triggerNavFlash('Lead notes saved', 'action');
    } catch (err) {
      console.error('Failed to save lead notes:', err);
      setLeadError('Lead notes were not saved. Check your connection and try again.');
    } finally {
      setLeadAction(lead.id);
    }
  };

  const handleArchiveLead = async (lead: CMSLead) => {
    if (leadActions[lead.id] || lead.status === 'archived') return;
    setLeadError(null);
    setLeadAction(lead.id, 'archive');
    try {
      await updateLeadStatus(lead.id, 'archived');
      setLeads((previous) =>
        previous.map((item) =>
          item.id === lead.id ? { ...item, status: 'archived' } : item
        )
      );
      triggerNavFlash('Lead archived', 'action');
    } catch (err) {
      console.error('Failed to archive lead:', err);
      setLeadError('The lead was not archived. Check your connection and try again.');
    } finally {
      setLeadAction(lead.id);
    }
  };

  // Delete lead
  const handleDeleteLead = async (leadId: string) => {
    if (leadActions[leadId]) return;
    if (!window.confirm('Permanently delete this lead? This action cannot be undone.')) return;
    setLeadError(null);
    setLeadAction(leadId, 'delete');
    try {
      await deleteLead(leadId);
      setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
      setLeadNotes((previous) => {
        const next = { ...previous };
        delete next[leadId];
        return next;
      });
      triggerNavFlash('Lead deleted successfully', 'action');
    } catch (err) {
      console.error('Failed to delete lead:', err);
      setLeadError('The lead was not deleted. Check your connection and try again.');
    } finally {
      setLeadAction(leadId);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 text-white/50">
        <div className="w-9 h-9 border-2 border-[#008CFF] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-mono text-xs tracking-wider uppercase">Loading Contact CMS...</span>
      </div>
    );
  }

  if (!contactData) {
    return (
      <div className="w-full rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-center text-rose-100">
        <AlertCircle className="mx-auto mb-3 h-7 w-7 text-rose-400" />
        <p className="text-sm">{contactError || 'Contact settings are unavailable.'}</p>
        <button
          type="button"
          onClick={() => void loadContactData()}
          className="mt-5 rounded-xl bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/15"
        >
          Retry loading
        </button>
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
            Manage contact-page copy, studio location, site-visit pricing, social display handles, and incoming client leads. Site-wide phone and social links live under Global Settings / Footer.
          </p>
        </div>

        {/* Action Controls & Tabs */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Live Synced Indicator */}
          <div className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white/70 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Synced</span>
          </div>

          {/* View Live Contact Page Link */}
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-mono text-xs font-semibold transition-all shadow-sm active:scale-95"
            title="Preview Live Contact Page"
          >
            <span>View Live Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#008CFF]" />
          </a>

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
                onClick={() => void handleReset()}
                disabled={isSaving || isResetting}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/80 hover:text-white font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                <span>{isResetting ? 'Resetting...' : 'Reset Defaults'}</span>
              </button>

              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={isSaving || isResetting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#008CFF] hover:bg-[#1a97ff] text-white font-sans text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(0,140,255,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save & Publish'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Save Notification Toast Banner */}
      {saveToast && (
        <div
          role={saveNoticeType === 'error' ? 'alert' : 'status'}
          aria-live={saveNoticeType === 'error' ? 'assertive' : 'polite'}
          className={`p-4 rounded-xl border text-sm font-mono flex items-center justify-between gap-3 animate-fadeIn shadow-lg ${
            saveNoticeType === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {saveNoticeType === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span className="font-semibold">{saveToast}</span>
          </div>
          {saveNoticeType === 'success' && (
            <a
              href="/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500/25 hover:bg-emerald-500/40 border border-emerald-400/40 text-emerald-100 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            >
              <span>View Live Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}

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
            <h2 className="font-display font-black text-xl uppercase tracking-tight text-white mb-2">
              Contact-page Channel Fallbacks
            </h2>
            <p className="mb-6 text-xs leading-relaxed text-amber-200/75">
              Public phone, email, WhatsApp, Instagram, and YouTube links are controlled by Global Settings / Footer. These values remain as contact-page fallbacks for older or incomplete settings records.
            </p>

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
                  placeholder="brandshoots.in@gmail.com"
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
                    placeholder="₹999"
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
            <h2 className="font-display font-black text-xl uppercase tracking-tight text-white mb-2">
              Official Social Media Handles & Profiles
            </h2>
            <p className="mb-6 text-xs leading-relaxed text-amber-200/75">
              Global Settings / Footer controls the public Instagram and YouTube URLs. Contact CMS keeps display handles and fallback URLs; Facebook remains shared contact/footer content.
            </p>

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

          {/* Bottom Save Button & Live View */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-4">
            <a
              href="/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-sans text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span>View Live Contact Page</span>
              <ExternalLink className="w-4 h-4 text-[#008CFF]" />
            </a>
            <button
              type="submit"
              disabled={isSaving || isResetting}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#008CFF] hover:bg-[#1a97ff] text-white font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.16em] transition-all duration-200 active:scale-95 cursor-pointer shadow-[0_0_30px_rgba(0,140,255,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
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
              {(['all', 'new', 'contacted', 'in_discussion', 'closed', 'archived'] as const).map((filter) => {
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

          {leadError && (
            <div
              role="alert"
              aria-live="assertive"
              className="flex items-center justify-between gap-4 rounded-xl border border-rose-500/40 bg-rose-500/15 p-4 text-sm text-rose-100"
            >
              <span className="flex items-center gap-2.5">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                {leadError}
              </span>
              <button
                type="button"
                onClick={() => setLeadError(null)}
                className="shrink-0 text-xs font-bold uppercase tracking-wider text-rose-200 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Leads List */}
          {loadingLeads ? (
            <div className="flex items-center justify-center gap-3 rounded-3xl border border-white/8 bg-[#070B14]/60 p-12 text-white/50">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#008CFF] border-t-transparent" />
              <span className="font-mono text-xs uppercase tracking-wider">Loading leads...</span>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#070B14]/60 border border-white/8 text-center flex flex-col items-center">
              <Inbox className="w-12 h-12 text-white/20 mb-3" />
              <h3 className="font-display font-black text-lg uppercase text-white/80">No Leads Found</h3>
              <p className="text-xs text-white/40 mt-1 max-w-sm">
                No inquiries match the selected filter. New submissions appear after you refresh this inbox.
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
                const leadWhatsappNumber = sanitizeWhatsAppNumber(lead.phone || '');
                const leadBusy = Boolean(leadActions[lead.id]);

                return (
                  <div
                    key={lead.id}
                    className="p-5 sm:p-6 rounded-2xl bg-[#070B14]/90 border border-white/10 hover:border-white/20 transition-all grid grid-cols-1 gap-6 shadow-xl xl:grid-cols-[minmax(0,1fr)_auto]"
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
                          {lead.type === 'site_visit'
                            ? `Site Visit (${contactData.siteVisitPrice})`
                            : 'General Inquiry'}
                        </span>

                        {lead.serviceType && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[11px] border border-emerald-500/20">
                            {lead.serviceType}
                          </span>
                        )}

                        {lead.budget && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono text-[11px] border border-amber-500/20">
                            Budget: {lead.budget}
                          </span>
                        )}

                        {lead.timeline && (
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-mono text-[11px] border border-purple-500/20">
                            Timeline: {lead.timeline}
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

                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <label
                            htmlFor={`lead-notes-${lead.id}`}
                            className="font-mono text-[11px] font-bold uppercase tracking-wider text-white/60"
                          >
                            Internal notes
                          </label>
                          {lead.notes && leadNotes[lead.id] === lead.notes && (
                            <span className="font-mono text-[10px] text-emerald-400/80">Saved</span>
                          )}
                        </div>
                        <textarea
                          id={`lead-notes-${lead.id}`}
                          rows={3}
                          value={leadNotes[lead.id] || ''}
                          onChange={(event) =>
                            setLeadNotes((previous) => ({
                              ...previous,
                              [lead.id]: event.target.value,
                            }))
                          }
                          disabled={leadBusy}
                          placeholder="Add follow-up context, requirements, or next steps..."
                          className="w-full resize-y rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs leading-relaxed text-white placeholder:text-white/25 focus:border-[#008CFF] focus:outline-none disabled:opacity-60"
                        />
                        <div className="mt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => void handleSaveNotes(lead)}
                            disabled={leadBusy || (leadNotes[lead.id] || '').trim() === (lead.notes || '').trim()}
                            className="rounded-lg bg-[#008CFF]/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#45aaff] transition-colors hover:bg-[#008CFF]/30 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {leadActions[lead.id] === 'notes' ? 'Saving...' : 'Save notes'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions & Status */}
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      {/* WhatsApp Quick Connect */}
                      {leadWhatsappNumber && (
                        <a
                          href={`https://wa.me/${leadWhatsappNumber}?text=${encodeURIComponent(
                            `Hi ${lead.name}, thank you for contacting BrandShoots!`
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
                        disabled={leadBusy}
                        onChange={(e) =>
                          void handleStatusChange(lead.id, e.target.value as CMSLead['status'])
                        }
                        aria-label={`Status for ${lead.name}`}
                        className={`px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border cursor-pointer focus:outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                          lead.status === 'new'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : lead.status === 'contacted'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : lead.status === 'in_discussion'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : lead.status === 'archived'
                            ? 'bg-slate-500/20 text-slate-300 border-slate-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        <option value="new" className="bg-[#070B14] text-white">New</option>
                        <option value="contacted" className="bg-[#070B14] text-white">Contacted</option>
                        <option value="in_discussion" className="bg-[#070B14] text-white">In Discussion</option>
                        <option value="closed" className="bg-[#070B14] text-white">Closed</option>
                        <option value="archived" className="bg-[#070B14] text-white">Archived</option>
                      </select>

                      {lead.status !== 'archived' && (
                        <button
                          type="button"
                          onClick={() => void handleArchiveLead(lead)}
                          disabled={leadBusy}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold uppercase tracking-wider text-white/60 transition-colors hover:border-slate-400/40 hover:bg-slate-500/20 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Archive Lead"
                        >
                          <Archive className="w-3.5 h-3.5" />
                          <span>{leadActions[lead.id] === 'archive' ? 'Archiving...' : 'Archive'}</span>
                        </button>
                      )}

                      {/* Delete Lead */}
                      <button
                        type="button"
                        onClick={() => void handleDeleteLead(lead.id)}
                        disabled={leadBusy}
                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-white/50 hover:text-rose-400 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        title="Permanently delete lead"
                        aria-label={`Permanently delete lead from ${lead.name}`}
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
