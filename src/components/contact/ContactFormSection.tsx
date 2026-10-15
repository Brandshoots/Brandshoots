import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Copy,
  Check,
  X,
} from 'lucide-react';
import { createLead } from '../../lib/cms/cmsService';
import { useCMSContent } from '../../lib/cms/useCMSContent';

const DEFAULT_PROJECT_TYPES = [
  'Commercial Production',
  'Brand Film',
  'Social Media Content',
  'Product Video',
  'Event / Corporate',
  'Other',
];

export const ContactFormSection: React.FC = () => {
  const { contact } = useCMSContent();

  const whatsappPhone = contact?.whatsappPhone || '917075960672';
  const displayPhone = contact?.displayPhone || '+91 70759 60672';
  const studioEmail = contact?.email || 'contact@brandshoots.com';
  const studioCityState = contact?.cityState || 'Rajamahendravaram, Andhra Pradesh, India';
  const studioFullAddress =
    contact?.fullAddress ||
    '26-2-7/2, Jayakrishnapuram, near Kambala Cheruvu, Rajamahendravaram, Andhra Pradesh, India';
  const googleMapsEmbedUrl =
    contact?.googleMapsEmbedUrl ||
    'https://maps.google.com/maps?q=26-2-7%2F2%2C%20Jayakrishnapuram%2C%20near%20kambala%20cheruvu%2C%20Rajamahendravaram%20533105%2C%20Andhra%20Pradesh%2C%20India&t=&z=16&ie=UTF8&iwloc=&output=embed';
  const googleMapsSearchUrl =
    contact?.googleMapsSearchUrl ||
    'https://www.google.com/maps/search/?api=1&query=26-2-7%2F2%2C+Jayakrishnapuram%2C+near+kambala+cheruvu%2C+Rajamahendravaram+533105%2C+Andhra+Pradesh%2C+India';

  const heroTitle = contact?.heroTitle || "LET'S MAKE SOMETHING";
  const heroHighlight = contact?.heroHighlight || 'WORTH WATCHING.';
  const heroSubtitle =
    contact?.heroSubtitle ||
    "Tell us what you're building, what you need, and where you want to take it.";
  const heroCtaText = contact?.heroCtaText || 'START A CONVERSATION';

  const siteVisitTag = contact?.siteVisitTag || 'ON-LOCATION RECCE';
  const siteVisitTitle = contact?.siteVisitTitle || 'SITE VISIT.';
  const siteVisitDescription =
    contact?.siteVisitDescription ||
    'Need our team to inspect your factory, showroom, outdoor estate, or shoot location in person? We conduct comprehensive spatial recces, camera framing tests, and lighting assessments before production begins.';
  const siteVisitPrice = contact?.siteVisitPrice || '₹2,000';
  const siteVisitPriceUnit = contact?.siteVisitPriceUnit || '/ visit';
  const siteVisitCtaText = contact?.siteVisitCtaText || 'BOOK A SITE VISIT';

  const instagramHandle = contact?.instagramHandle || '@wearebrandshoots';
  const instagramUrl = contact?.instagramUrl || 'https://instagram.com/wearebrandshoots';
  const youtubeHandle = contact?.youtubeHandle || '@wearebrandshoots';
  const youtubeUrl = contact?.youtubeUrl || 'https://youtube.com/@wearebrandshoots';
  const facebookHandle = contact?.facebookHandle || '@wearebrandshoots';
  const facebookUrl = contact?.facebookUrl || 'https://facebook.com/wearebrandshoots';

  const projectTypes =
    contact?.projectTypes && contact.projectTypes.length > 0
      ? contact.projectTypes
      : DEFAULT_PROJECT_TYPES;

  // Inquiry form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: 'Commercial Production',
    message: '',
  });

  // Site visit modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [siteVisitData, setSiteVisitData] = useState({
    name: '',
    phone: '',
    location: '',
    date: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [siteVisitSubmitted, setSiteVisitSubmitted] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Smooth scroll helper
  const handleScrollToForm = () => {
    const el = document.getElementById('contact-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Primary form submission -> Firebase RTDB leads
  const handlePrimarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createLead({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        brandName: formData.company,
        serviceType: formData.projectType,
        message: formData.message,
        type: 'general_inquiry',
        status: 'new',
      });
    } catch (err) {
      console.error('Lead submission note:', err);
    } finally {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }
  };

  // Site visit submission -> Firebase RTDB lead + WhatsApp redirect
  const handleSiteVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createLead({
        name: siteVisitData.name || 'Site Visit Client',
        phone: siteVisitData.phone || '',
        message: `Booked On-Location Site Visit (₹2,000). Site/Factory: ${
          siteVisitData.location || 'Location'
        }, Preferred Date: ${siteVisitData.date || 'Flexible'}`,
        type: 'site_visit',
        status: 'new',
      });
    } catch (err) {
      console.error('Site visit lead note:', err);
    }

    const messageLines = [
      'Hi BRANDSHOOTS,',
      '',
      'I would like to book an On-Location Site Visit (₹2,000) for our project.',
      '',
      `Name: ${siteVisitData.name || 'Client'}`,
      `Phone: ${siteVisitData.phone || 'Provided via form'}`,
      `Shoot Location / Site: ${siteVisitData.location || 'Location'}`,
      `Preferred Date: ${siteVisitData.date || 'Flexible'}`,
      '',
      'Please let us know your availability. Thank you!',
    ];

    const waUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
      messageLines.join('\n')
    )}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    setSiteVisitSubmitted(true);
  };

  // Copy address to clipboard
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(studioFullAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <div className="w-full bg-[#04060A] text-white">
      {/* ============================================================== */}
      {/* 1. HERO — COMPACT, CONFIDENT, REFINED SCALE (OBSIDIAN DARK)     */}
      {/* ============================================================== */}
      <section className="relative w-full pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16 px-6 sm:px-10 md:px-14 lg:px-20 border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="font-sans font-black uppercase text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] tracking-[-0.03em] leading-[1.02] text-white">
              {heroTitle}<br />
              <span className="text-[#008CFF]">{heroHighlight}</span>
            </h1>

            <p className="mt-4 sm:mt-5 text-white/70 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-xl">
              {heroSubtitle}
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={handleScrollToForm}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#008CFF] hover:bg-[#1a97ff] text-white font-sans text-xs sm:text-sm font-bold tracking-[0.16em] uppercase transition-all duration-200 active:scale-95 cursor-pointer shadow-lg shadow-[#008CFF]/25"
            >
              <span>{heroCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. CONTACT DETAILS & INQUIRY FORM (UNIFIED DARK THEME)         */}
      {/* ============================================================== */}
      <section
        id="contact-form"
        className="relative w-full py-16 sm:py-20 md:py-24 px-6 sm:px-10 md:px-14 lg:px-20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* ========================================================== */}
            {/* LEFT: DIRECT CONTACT DETAILS                               */}
            {/* ========================================================== */}
            <div className="lg:col-span-5 flex flex-col">
              <h2 className="font-sans font-black uppercase text-2xl sm:text-3xl text-white tracking-tight mb-8 sm:mb-10">
                CONTACT
              </h2>

              <div className="space-y-8 sm:space-y-10">
                {/* WhatsApp */}
                <div>
                  <span className="block text-xs uppercase tracking-wider text-white/50 font-semibold mb-1.5">
                    WhatsApp
                  </span>
                  <a
                    href={`https://wa.me/${whatsappPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl sm:text-3xl font-bold text-white hover:text-[#008CFF] transition-colors tracking-tight inline-block"
                  >
                    {displayPhone}
                  </a>
                </div>

                {/* Email */}
                <div>
                  <span className="block text-xs uppercase tracking-wider text-white/50 font-semibold mb-1.5">
                    Email
                  </span>
                  <a
                    href={`mailto:${studioEmail}`}
                    className="text-xl sm:text-2xl font-bold text-white hover:text-[#008CFF] transition-colors tracking-tight inline-block break-all"
                  >
                    {studioEmail}
                  </a>
                </div>

                {/* Location */}
                <div>
                  <span className="block text-xs uppercase tracking-wider text-white/50 font-semibold mb-1.5">
                    Location
                  </span>
                  <p className="text-lg sm:text-xl font-bold text-white/90 tracking-tight leading-snug">
                    {studioCityState}
                  </p>
                </div>
              </div>
            </div>

            {/* ========================================================== */}
            {/* RIGHT: CONTACT INQUIRY FORM (DARK THEME)                   */}
            {/* ========================================================== */}
            <div className="lg:col-span-7">
              <h2 className="font-sans font-black uppercase text-2xl sm:text-3xl text-white tracking-tight mb-8 sm:mb-10">
                START A CONVERSATION
              </h2>

              {formSubmitted ? (
                <div className="p-8 sm:p-10 rounded-2xl bg-[#080D17] border border-white/10 text-left">
                  <h3 className="font-sans font-black text-2xl uppercase tracking-tight text-white mb-2">
                    THANK YOU.
                  </h3>
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">
                    We've received your inquiry and our team will get in touch with you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        company: '',
                        projectType: 'Commercial Production',
                        message: '',
                      });
                    }}
                    className="font-sans text-xs uppercase tracking-wider font-bold text-[#008CFF] hover:underline cursor-pointer"
                  >
                    Send another message →
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handlePrimarySubmit}
                  className="p-6 sm:p-9 rounded-2xl bg-[#070B13] border border-white/10 space-y-5 shadow-2xl"
                >
                  {/* Name */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-white/70 mb-1.5">
                      Name <span className="text-[#008CFF]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/25 text-sm focus:outline-none focus:bg-white/[0.07] focus:border-[#008CFF] focus:ring-1 focus:ring-[#008CFF] transition-all"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white/70 mb-1.5">
                        Email <span className="text-[#008CFF]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/25 text-sm focus:outline-none focus:bg-white/[0.07] focus:border-[#008CFF] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white/70 mb-1.5">
                        Phone / WhatsApp <span className="text-[#008CFF]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 00000 00000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/25 text-sm focus:outline-none focus:bg-white/[0.07] focus:border-[#008CFF] transition-all"
                      />
                    </div>
                  </div>

                  {/* Company / Brand & Project Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white/70 mb-1.5">
                        Company / Brand
                      </label>
                      <input
                        type="text"
                        placeholder="Your company or brand"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/25 text-sm focus:outline-none focus:bg-white/[0.07] focus:border-[#008CFF] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-white/70 mb-1.5">
                        Project Type
                      </label>
                      <div className="relative">
                        <select
                          value={formData.projectType}
                          onChange={(e) =>
                            setFormData({ ...formData, projectType: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-[#080D17] border border-white/12 text-white text-sm focus:outline-none focus:border-[#008CFF] focus:ring-1 focus:ring-[#008CFF] transition-all appearance-none cursor-pointer"
                        >
                          {projectTypes.map((type) => (
                            <option key={type} value={type} className="bg-[#080D17] text-white">
                              {type}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-white/70 mb-1.5">
                      Tell us about your project
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us what you're building, what you need, and where you want to take it."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/25 text-sm focus:outline-none focus:bg-white/[0.07] focus:border-[#008CFF] transition-all resize-none leading-relaxed"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#008CFF] hover:bg-[#1a97ff] text-white font-sans text-xs sm:text-sm font-bold tracking-[0.16em] uppercase transition-all duration-200 active:scale-95 cursor-pointer shadow-lg shadow-[#008CFF]/25 disabled:opacity-50"
                    >
                      <span>{isSubmitting ? 'SENDING...' : 'START A CONVERSATION'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <a
                      href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                        'Hi BRANDSHOOTS, I would like to discuss a project.'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs uppercase tracking-wider font-bold text-white/60 hover:text-[#008CFF] transition-colors inline-flex items-center justify-center gap-1.5 py-2"
                    >
                      <span>Or chat on WhatsApp</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. SITE VISIT — DEDICATED SEPARATE SECTION                     */}
      {/* ============================================================== */}
      <section
        id="site-visit"
        className="relative w-full py-16 sm:py-20 px-6 sm:px-10 md:px-14 lg:px-20 border-t border-white/[0.08]"
      >
        <div className="max-w-6xl mx-auto">
          <div className="p-7 sm:p-10 md:p-12 rounded-3xl bg-[#070B13] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
            {/* Ambient subtle blue backlight glow */}
            <div
              className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none opacity-25"
              style={{
                background: 'radial-gradient(circle, rgba(0, 140, 255, 0.25) 0%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />

            <div className="relative z-10 max-w-2xl">
              <span className="block text-xs uppercase tracking-[0.2em] font-mono text-[#008CFF] font-semibold mb-2">
                {siteVisitTag}
              </span>
              <h2 className="font-sans font-black uppercase text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-tight">
                {siteVisitTitle}
              </h2>
              <p className="mt-3 text-white/70 text-sm sm:text-base leading-relaxed font-light">
                {siteVisitDescription}
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-4 shrink-0">
              <div className="text-left md:text-right">
                <span className="block text-xs text-white/50 uppercase tracking-wider font-mono">Fixed Fee</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-sans font-black text-white">{siteVisitPrice}</span>
                  <span className="text-sm text-white/50 font-medium">{siteVisitPriceUnit}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSiteVisitSubmitted(false);
                  setIsBookingModalOpen(true);
                }}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#008CFF] hover:bg-[#1a97ff] text-white font-sans text-xs sm:text-sm font-bold tracking-[0.16em] uppercase transition-all duration-200 active:scale-95 cursor-pointer shadow-lg shadow-[#008CFF]/25"
              >
                <span>{siteVisitCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. STUDIO LOCATION & MAP (DARK STUDIO SECTION)                 */}
      {/* ============================================================== */}
      <section className="relative w-full py-16 sm:py-20 px-6 sm:px-10 md:px-14 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          {/* Header & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-7 sm:mb-8">
            <div>
              <h2 className="font-sans font-black uppercase text-2xl sm:text-3xl text-white tracking-tight">
                STUDIO LOCATION
              </h2>

              <p className="mt-2 text-white/70 text-sm sm:text-base max-w-xl leading-relaxed whitespace-pre-line">
                {studioFullAddress}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={googleMapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#008CFF] hover:bg-[#1a97ff] text-white font-sans text-xs font-bold tracking-[0.16em] uppercase transition-all duration-200 active:scale-95 shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>GET DIRECTIONS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleCopyAddress}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-sans text-xs font-bold tracking-[0.16em] uppercase transition-all duration-200 active:scale-95 cursor-pointer"
              >
                {copiedAddress ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">COPIED ADDRESS</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-white/60" />
                    <span>COPY ADDRESS</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Clean Google Maps Embed */}
          <div className="w-full h-[320px] sm:h-[400px] md:h-[450px] rounded-2xl sm:rounded-3xl border border-white/12 overflow-hidden shadow-2xl bg-[#070B13]">
            <iframe
              title="BrandShoots Studio Location Map"
              src={googleMapsEmbedUrl}
              className="w-full h-full border-0 filter contrast-[1.05]"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. SOCIAL / DIRECT CHANNELS (DARK GLASS TILES)                  */}
      {/* ============================================================== */}
      <section className="relative w-full py-12 sm:py-16 px-6 sm:px-10 md:px-14 lg:px-20 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 rounded-2xl bg-[#070B13] border border-white/10 hover:border-[#008CFF]/50 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-white/50 group-hover:text-[#008CFF] transition-colors mb-2">
                <span className="text-xs uppercase tracking-wider font-bold">
                  WhatsApp
                </span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <span className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-[#008CFF] transition-colors">
                {displayPhone}
              </span>
            </a>

            {/* Instagram */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 rounded-2xl bg-[#070B13] border border-white/10 hover:border-[#008CFF]/50 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-white/50 group-hover:text-[#008CFF] transition-colors mb-2">
                <span className="text-xs uppercase tracking-wider font-bold">
                  Instagram
                </span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <span className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-[#008CFF] transition-colors">
                {instagramHandle}
              </span>
            </a>

            {/* YouTube */}
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 rounded-2xl bg-[#070B13] border border-white/10 hover:border-[#008CFF]/50 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-white/50 group-hover:text-[#008CFF] transition-colors mb-2">
                <span className="text-xs uppercase tracking-wider font-bold">
                  YouTube
                </span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <span className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-[#008CFF] transition-colors">
                {youtubeHandle}
              </span>
            </a>

            {/* Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 rounded-2xl bg-[#070B13] border border-white/10 hover:border-[#008CFF]/50 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-white/50 group-hover:text-[#008CFF] transition-colors mb-2">
                <span className="text-xs uppercase tracking-wider font-bold">
                  Facebook
                </span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <span className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-[#008CFF] transition-colors">
                {facebookHandle}
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. SITE VISIT BOOKING MODAL (DARK THEME)                       */}
      {/* ============================================================== */}
      {isBookingModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsBookingModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#070B14] rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="font-sans font-black uppercase text-2xl text-white tracking-tight">
                  BOOK A SITE VISIT
                </h3>
                <p className="text-sm text-white/60 mt-1">
                  On-location spatial recce & camera framing check. ₹2,000 / visit.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.16] text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            {siteVisitSubmitted ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-sans font-bold text-lg text-white">
                  Inquiry Sent via WhatsApp
                </h4>
                <p className="text-sm text-white/60 mt-2 max-w-xs mx-auto">
                  We've initiated the conversation on WhatsApp ({displayPhone}) to confirm schedule availability for your site visit.
                </p>
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#008CFF] text-white font-sans text-xs font-bold uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSiteVisitSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-white/80 mb-1.5">
                    Your Name <span className="text-[#008CFF]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={siteVisitData.name}
                    onChange={(e) =>
                      setSiteVisitData({ ...siteVisitData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/25 text-sm focus:outline-none focus:bg-white/[0.07] focus:border-[#008CFF] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-white/80 mb-1.5">
                    Phone / WhatsApp <span className="text-[#008CFF]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 00000 00000"
                    value={siteVisitData.phone}
                    onChange={(e) =>
                      setSiteVisitData({ ...siteVisitData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/25 text-sm focus:outline-none focus:bg-white/[0.07] focus:border-[#008CFF] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-white/80 mb-1.5">
                      Shoot Location / Site
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Factory, Showroom, Estate"
                      value={siteVisitData.location}
                      onChange={(e) =>
                        setSiteVisitData({ ...siteVisitData, location: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/25 text-sm focus:outline-none focus:bg-white/[0.07] focus:border-[#008CFF] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-white/80 mb-1.5">
                      Preferred Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Next week, Oct 25"
                      value={siteVisitData.date}
                      onChange={(e) =>
                        setSiteVisitData({ ...siteVisitData, date: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-white placeholder:text-white/25 text-sm focus:outline-none focus:bg-white/[0.07] focus:border-[#008CFF] transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#008CFF] hover:bg-[#1a97ff] text-white font-sans text-xs sm:text-sm font-bold tracking-[0.16em] uppercase flex items-center justify-center gap-2 transition-all duration-200 active:scale-98 cursor-pointer shadow-lg shadow-[#008CFF]/25"
                  >
                    <span>CONFIRM & BOOK ON WHATSAPP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactFormSection;
