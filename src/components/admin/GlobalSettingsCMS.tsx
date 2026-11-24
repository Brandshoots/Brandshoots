import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Facebook,
  Globe2,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RotateCcw,
  Save,
  Youtube,
} from 'lucide-react';
import { CMSContactPage, CMSSiteSettings } from '../../types/cms';
import {
  fetchPublishedContactPage,
  fetchSiteSettings,
  saveGlobalSettings,
} from '../../lib/cms/cmsService';
import { INITIAL_CONTACT_PAGE, INITIAL_SITE_SETTINGS } from '../../lib/cms/seedData';
import { triggerNavFlash } from '../../lib/cms/cmsHistory';

type Notice = {
  type: 'success' | 'error';
  message: string;
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const sanitizeWhatsAppNumber = (value: string): string => value.replace(/\D/g, '');

const isSafeHttpsUrl = (value: string): boolean => {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
};

const normalizeSettings = (settings: CMSSiteSettings): CMSSiteSettings => ({
  ...settings,
  contactPhone: settings.contactPhone.trim(),
  contactEmail: settings.contactEmail.trim(),
  whatsappPhone: sanitizeWhatsAppNumber(settings.whatsappPhone),
  instagramUrl: settings.instagramUrl.trim(),
  youtubeUrl: settings.youtubeUrl.trim(),
});

const validateSettings = (
  settings: CMSSiteSettings,
  footerAddress: string,
  facebookUrl: string
): string | null => {
  if (!settings.contactPhone) return 'Enter the public contact phone number.';
  if (!/^\d{7,15}$/.test(settings.contactPhone.replace(/\D/g, ''))) {
    return 'Enter a valid public contact phone number.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.contactEmail)) {
    return 'Enter a valid contact email address.';
  }
  if (!/^\d{7,15}$/.test(settings.whatsappPhone)) {
    return 'Enter a WhatsApp number with 7–15 digits, including its country code.';
  }
  if (!isSafeHttpsUrl(settings.instagramUrl)) return 'Enter a valid HTTPS Instagram URL.';
  if (!isSafeHttpsUrl(settings.youtubeUrl)) return 'Enter a valid HTTPS YouTube URL.';
  if (!footerAddress.trim()) return 'Enter the footer studio address.';
  if (!isSafeHttpsUrl(facebookUrl)) return 'Enter a valid HTTPS Facebook URL.';
  return null;
};

export const GlobalSettingsCMS: React.FC = () => {
  const [settings, setSettings] = useState<CMSSiteSettings | null>(null);
  const [contactSnapshot, setContactSnapshot] = useState<CMSContactPage | null>(null);
  const [footerAddress, setFooterAddress] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setNotice(null);
    try {
      const [savedSettings, savedContact] = await Promise.all([
        fetchSiteSettings(),
        fetchPublishedContactPage(),
      ]);
      const nextSettings = {
        ...INITIAL_SITE_SETTINGS,
        ...(savedSettings || {}),
      };
      const nextContact = {
        ...INITIAL_CONTACT_PAGE,
        ...savedContact,
      };
      setSettings(clone(nextSettings));
      setContactSnapshot(clone(nextContact));
      setFooterAddress(nextContact.fullAddress);
      setFacebookUrl(nextContact.facebookUrl);
    } catch (error) {
      console.error('Failed to load global settings:', error);
      setNotice({
        type: 'error',
        message: 'Global settings could not be loaded. Check your connection and retry.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const persistSettings = async (
    nextSettings: CMSSiteSettings,
    nextFooterAddress: string,
    nextFacebookUrl: string
  ) => {
    const latestContact = await fetchPublishedContactPage();
    const nextContact: CMSContactPage = {
      ...INITIAL_CONTACT_PAGE,
      ...latestContact,
      displayPhone: nextSettings.contactPhone,
      email: nextSettings.contactEmail,
      whatsappPhone: nextSettings.whatsappPhone,
      instagramUrl: nextSettings.instagramUrl,
      youtubeUrl: nextSettings.youtubeUrl,
      fullAddress: nextFooterAddress,
      facebookUrl: nextFacebookUrl,
    };

    await saveGlobalSettings(nextSettings, nextContact);
    setSettings(clone(nextSettings));
    setContactSnapshot(clone(nextContact));
    setFooterAddress(nextContact.fullAddress);
    setFacebookUrl(nextContact.facebookUrl);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!settings || isSaving || isResetting) return;

    const nextSettings = normalizeSettings(settings);
    const nextFooterAddress = footerAddress.trim().replace(/\bCollage\b/gi, 'College');
    const nextFacebookUrl = facebookUrl.trim();
    const validationError = validateSettings(
      nextSettings,
      nextFooterAddress,
      nextFacebookUrl
    );
    if (validationError) {
      setNotice({ type: 'error', message: validationError });
      return;
    }

    setIsSaving(true);
    setNotice(null);
    try {
      await persistSettings(nextSettings, nextFooterAddress, nextFacebookUrl);
      setNotice({
        type: 'success',
        message: 'Global contact and footer settings were saved and published.',
      });
      triggerNavFlash('Global contact and footer settings published', 'action');
    } catch (error) {
      console.error('Failed to save global settings:', error);
      setNotice({
        type: 'error',
        message: 'Settings were not fully saved. Check your connection and try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!settings || isSaving || isResetting) return;
    if (!window.confirm('Reset global contact and footer settings to factory defaults?')) return;

    const defaultSettings = normalizeSettings(clone(INITIAL_SITE_SETTINGS));
    const defaultAddress = INITIAL_CONTACT_PAGE.fullAddress.replace(/\bCollage\b/gi, 'College');
    const defaultFacebookUrl = INITIAL_CONTACT_PAGE.facebookUrl;

    setIsResetting(true);
    setNotice(null);
    try {
      await persistSettings(defaultSettings, defaultAddress, defaultFacebookUrl);
      setNotice({
        type: 'success',
        message: 'Global contact and footer settings were reset and published.',
      });
      triggerNavFlash('Global contact and footer settings reset', 'action');
    } catch (error) {
      console.error('Failed to reset global settings:', error);
      setNotice({
        type: 'error',
        message: 'Settings could not be reset. No success was recorded; please retry.',
      });
    } finally {
      setIsResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full flex-col items-center justify-center py-24 text-white/50">
        <div className="mb-4 h-9 w-9 animate-spin rounded-full border-2 border-[#008CFF] border-t-transparent" />
        <span className="font-mono text-xs uppercase tracking-wider">Loading global settings...</span>
      </div>
    );
  }

  if (!settings || !contactSnapshot) {
    return (
      <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-center text-rose-100">
        <AlertCircle className="mx-auto mb-3 h-7 w-7 text-rose-400" />
        <p className="text-sm">{notice?.message || 'Global settings are unavailable.'}</p>
        <button
          type="button"
          onClick={() => void loadSettings()}
          className="mt-5 rounded-xl bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/15"
        >
          Retry loading
        </button>
      </div>
    );
  }

  const busy = isSaving || isResetting;

  return (
    <form onSubmit={handleSave} className="w-full space-y-8 animate-fadeIn">
      <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#008CFF]">
            <Globe2 className="h-4 w-4" />
            <span>Site-wide channels</span>
          </div>
          <h1 className="font-display text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
            Global Settings & Footer
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-light leading-relaxed text-white/60">
            These values power the public footer, contact page, final CTA, and floating actions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/[0.12]"
          >
            View live site <ExternalLink className="h-3.5 w-3.5 text-[#008CFF]" />
          </a>
          <button
            type="button"
            onClick={() => void handleReset()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white/80 transition-colors hover:bg-white/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            {isResetting ? 'Resetting...' : 'Reset defaults'}
          </button>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-[#008CFF] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(0,140,255,0.35)] transition-colors hover:bg-[#1a97ff] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? 'Saving...' : 'Save & publish'}
          </button>
        </div>
      </div>

      {notice && (
        <div
          role={notice.type === 'error' ? 'alert' : 'status'}
          aria-live={notice.type === 'error' ? 'assertive' : 'polite'}
          className={`flex items-center gap-3 rounded-xl border p-4 text-sm font-mono ${
            notice.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-100'
              : 'border-rose-500/40 bg-rose-500/15 text-rose-100'
          }`}
        >
          {notice.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          )}
          <span>{notice.message}</span>
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-[#070B14]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#008CFF]">
          <Phone className="h-4 w-4" />
          <span>Contact channels</span>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="block text-xs uppercase tracking-wider text-white/70">
            <span className="mb-2 flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> Display phone</span>
            <input
              type="text"
              required
              value={settings.contactPhone}
              onChange={(event) => setSettings({ ...settings, contactPhone: event.target.value })}
              placeholder="+91 70759 60672"
              className="w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:border-[#008CFF] focus:outline-none"
            />
          </label>

          <label className="block text-xs uppercase tracking-wider text-white/70">
            <span className="mb-2 flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> Contact email</span>
            <input
              type="email"
              required
              value={settings.contactEmail}
              onChange={(event) => setSettings({ ...settings, contactEmail: event.target.value })}
              placeholder="studio@example.com"
              className="w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#008CFF] focus:outline-none"
            />
          </label>

          <label className="block text-xs uppercase tracking-wider text-white/70 md:col-span-2">
            <span className="mb-2 flex items-center gap-2"><MessageCircle className="h-3.5 w-3.5" /> WhatsApp number with country code</span>
            <input
              type="tel"
              required
              inputMode="tel"
              value={settings.whatsappPhone}
              onChange={(event) => setSettings({ ...settings, whatsappPhone: event.target.value })}
              placeholder="917075960672"
              className="w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:border-[#008CFF] focus:outline-none"
            />
            <span className="mt-1.5 block text-[11px] normal-case text-white/40">
              Spaces and punctuation are removed before publishing.
            </span>
          </label>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#070B14]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#008CFF]">
          <Instagram className="h-4 w-4" />
          <span>Social profiles</span>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <label className="block text-xs uppercase tracking-wider text-white/70">
            <span className="mb-2 flex items-center gap-2"><Instagram className="h-3.5 w-3.5" /> Instagram URL</span>
            <input
              type="url"
              required
              value={settings.instagramUrl}
              onChange={(event) => setSettings({ ...settings, instagramUrl: event.target.value })}
              className="w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 font-mono text-xs text-white focus:border-[#008CFF] focus:outline-none"
            />
          </label>

          <label className="block text-xs uppercase tracking-wider text-white/70">
            <span className="mb-2 flex items-center gap-2"><Youtube className="h-3.5 w-3.5" /> YouTube URL</span>
            <input
              type="url"
              required
              value={settings.youtubeUrl}
              onChange={(event) => setSettings({ ...settings, youtubeUrl: event.target.value })}
              className="w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 font-mono text-xs text-white focus:border-[#008CFF] focus:outline-none"
            />
          </label>

          <label className="block text-xs uppercase tracking-wider text-white/70">
            <span className="mb-2 flex items-center gap-2"><Facebook className="h-3.5 w-3.5" /> Facebook URL</span>
            <input
              type="url"
              required
              value={facebookUrl}
              onChange={(event) => setFacebookUrl(event.target.value)}
              className="w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 font-mono text-xs text-white focus:border-[#008CFF] focus:outline-none"
            />
          </label>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#070B14]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#008CFF]">
          <MapPin className="h-4 w-4" />
          <span>Footer address</span>
        </div>
        <label className="block text-xs uppercase tracking-wider text-white/70">
          <span className="mb-2 block">Published studio address</span>
          <textarea
            rows={3}
            required
            value={footerAddress}
            onChange={(event) => setFooterAddress(event.target.value)}
            className="w-full resize-y rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-white focus:border-[#008CFF] focus:outline-none"
          />
          <span className="mt-1.5 block text-[11px] normal-case text-white/40">
            This shared address also appears in the Contact page location section.
          </span>
        </label>
      </div>
    </form>
  );
};

export default GlobalSettingsCMS;
