import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowRight, 
  MessageSquare, 
  MapPin, 
  Mail, 
  CheckCircle2, 
  Compass
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PROJECT_TYPES = [
  'Commercial Production',
  'Social Media Content',
  'Brand Film',
  'Product Shoot',
  'Corporate Film',
  'Photography',
  'Reel / Short-Form Content',
  'Other'
];

const WHATSAPP_PHONE = '917075960672';
const DISPLAY_PHONE = '+91 70759 60672';
const STUDIO_EMAIL = 'contact@brandshoots.com';
const STUDIO_LOCATION = 'Rajahmundry & Hyderabad, India • Available Worldwide & On Location';

export const ContactFormSection: React.FC = () => {
  // Main form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: 'Commercial Production',
    message: ''
  });

  // Site visit state
  const [siteVisitData, setSiteVisitData] = useState({
    location: '',
    date: '',
    company: '',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [siteVisitSubmitted, setSiteVisitSubmitted] = useState(false);

  // GSAP animation refs
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement>(null);
  const headlineLine3Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const blueDotRef = useRef<HTMLSpanElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const siteVisitCardRef = useRef<HTMLDivElement>(null);
  const contactDetailsRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Initial state
      gsap.set(
        [
          headlineLine1Ref.current,
          headlineLine2Ref.current,
          headlineLine3Ref.current
        ],
        { yPercent: 100, opacity: 0 }
      );
      gsap.set(subtitleRef.current, { y: 24, opacity: 0 });
      gsap.set(blueDotRef.current, { scale: 0, opacity: 0 });
      gsap.set(formCardRef.current, { y: 35, opacity: 0 });
      gsap.set(siteVisitCardRef.current, { y: 35, opacity: 0 });
      gsap.set(contactDetailsRef.current, { y: 20, opacity: 0 });

      // Staggered cinematic entrance
      tl.to(
        [
          headlineLine1Ref.current,
          headlineLine2Ref.current,
          headlineLine3Ref.current
        ],
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.12,
        },
        0.1
      )
        .to(
          subtitleRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
          },
          '-=0.45'
        )
        .to(
          blueDotRef.current,
          {
            scale: 1,
            opacity: 1,
            duration: 0.45,
            ease: 'back.out(2)',
          },
          '-=0.3'
        )
        .to(
          formCardRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
          },
          '-=0.4'
        )
        .to(
          [siteVisitCardRef.current, contactDetailsRef.current],
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.15,
          },
          '-=0.3'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Construct WhatsApp URL with pre-filled message
  const createWhatsAppInquiryUrl = () => {
    const text = [
      "Hi BRANDSHOOTS, I'm interested in working with you.",
      '',
      `Name: ${formData.name || 'Not provided'}`,
      `Company: ${formData.company || 'Not provided'}`,
      `Phone: ${formData.phone || 'Not provided'}`,
      `Email: ${formData.email || 'Not provided'}`,
      `Project Type: ${formData.projectType || 'Commercial Production'}`,
      `Project Details: ${formData.message || 'I would like to discuss a production shoot.'}`,
    ].join('\n');

    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
  };

  // Construct Site Visit WhatsApp URL
  const createSiteVisitWhatsAppUrl = () => {
    const text = [
      "Hi BRANDSHOOTS, I'd like to request a site visit.",
      '',
      `Name: ${formData.name || 'Client'}`,
      `Company: ${siteVisitData.company || formData.company || 'Not provided'}`,
      `Location: ${siteVisitData.location || 'On Location'}`,
      `Preferred Date: ${siteVisitData.date || 'Flexible'}`,
      `Project Details: ${siteVisitData.message || formData.message || 'Location scout & production discussion.'}`,
    ].join('\n');

    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
  };

  // Primary form submit
  const handlePrimarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    // Also launch pre-filled WhatsApp conversation for instant response
    const waUrl = createWhatsAppInquiryUrl();
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Direct WhatsApp inquiry button click
  const handleDirectWhatsAppClick = () => {
    const waUrl = createWhatsAppInquiryUrl();
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Site visit submit
  const handleSiteVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSiteVisitSubmitted(true);
    const waUrl = createSiteVisitWhatsAppUrl();
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen pt-32 sm:pt-40 md:pt-48 pb-24 sm:pb-32 px-5 sm:px-8 md:px-12 lg:px-16 overflow-hidden select-none"
    >
      {/* Background Architectural Ambient Haze */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft Electric Blue Core Glow */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1100px] h-[550px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.08) 0%, rgba(0, 80, 200, 0.02) 50%, transparent 75%)',
            filter: 'blur(90px)',
          }}
        />
        {/* Subtle Architectural Grid */}
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4.5rem_4.5rem]" />
      </div>

      <div className="relative z-10 max-w-[1580px] mx-auto">
        {/* ============================================================== */}
        {/* 1. TOP INTRO: EDITORIAL HEADLINE + STATEMENT                   */}
        {/* ============================================================== */}
        <div className="mb-14 sm:mb-20 md:mb-24 text-left">
          {/* Studio Chapter Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-6 sm:mb-8">
            <span
              ref={blueDotRef}
              className="w-2 h-2 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]"
            />
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.28em] uppercase text-white/75 font-medium">
              04 — INITIATE PRODUCTION
            </span>
          </div>

          {/* Master Headline (Line-by-line Reveal) */}
          <h1 className="font-editorial font-black uppercase text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[104px] tracking-tight leading-[0.92] text-white overflow-hidden">
            <div className="overflow-hidden">
              <span ref={headlineLine1Ref} className="block">
                LET'S MAKE
              </span>
            </div>
            <div className="overflow-hidden">
              <span ref={headlineLine2Ref} className="block text-white/95">
                SOMETHING
              </span>
            </div>
            <div className="overflow-hidden">
              <span
                ref={headlineLine3Ref}
                className="block text-[#008CFF] drop-shadow-[0_4px_30px_rgba(0,140,255,0.35)]"
              >
                WORTH WATCHING.
              </span>
            </div>
          </h1>

          {/* Supporting Statement */}
          <p
            ref={subtitleRef}
            className="mt-6 sm:mt-8 max-w-2xl text-white/70 text-sm sm:text-base md:text-lg font-light leading-relaxed"
          >
            Have a project, campaign, product, or story that deserves more than ordinary content? Tell us what you're building.
          </p>
        </div>

        {/* ============================================================== */}
        {/* 2. TWO-COLUMN EDITORIAL SYSTEM: DESKTOP GRID / MOBILE STACK   */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-start">
          
          {/* ============================================================ */}
          {/* LEFT COLUMN: STUDIO CREDENTIALS & DIRECT REACH                */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 flex flex-col gap-8 sm:gap-10 order-2 lg:order-1">
            
            {/* Direct Studio Channels */}
            <div
              ref={contactDetailsRef}
              className="p-6 sm:p-8 rounded-2xl md:rounded-3xl bg-[#070A10]/80 border border-white/10 shadow-[0_15px_45px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col gap-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-[#008CFF] font-semibold">
                  Direct Studio Reach
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
              </div>

              {/* WhatsApp Item */}
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-white/[0.04] transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] group-hover:scale-105 transition-transform shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/45 block mb-0.5">
                    WhatsApp (Fastest Response)
                  </span>
                  <span className="text-white text-sm sm:text-base font-semibold group-hover:text-[#008CFF] transition-colors flex items-center gap-1.5">
                    {DISPLAY_PHONE}
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#008CFF]" />
                  </span>
                </div>
              </a>

              {/* Email Item */}
              <a
                href={`mailto:${STUDIO_EMAIL}`}
                className="group flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-white/[0.04] transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-[#008CFF]/10 border border-[#008CFF]/20 flex items-center justify-center text-[#008CFF] group-hover:scale-105 transition-transform shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/45 block mb-0.5">
                    Production Inquiries
                  </span>
                  <span className="text-white text-sm sm:text-base font-semibold group-hover:text-[#008CFF] transition-colors flex items-center gap-1.5">
                    {STUDIO_EMAIL}
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#008CFF]" />
                  </span>
                </div>
              </a>

              {/* Location Item */}
              <div className="flex items-start gap-4 p-3 -mx-3 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/70 shrink-0">
                  <MapPin className="w-4 h-4 text-[#008CFF]" />
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/45 block mb-0.5">
                    Studio Locations
                  </span>
                  <span className="text-white text-xs sm:text-sm font-medium leading-relaxed block text-white/80">
                    {STUDIO_LOCATION}
                  </span>
                </div>
              </div>

              {/* Direct Producer Guarantee */}
              <div className="pt-4 border-t border-white/10 text-xs text-white/50 leading-relaxed font-mono">
                <span className="text-white/80 font-medium">No account managers.</span> Direct communication with directors, cinematographers & producers from day one.
              </div>
            </div>

            {/* ======================================================== */}
            {/* 3. SITE VISIT CARD (DEDICATED PREMIUM TILE)              */}
            {/* ======================================================== */}
            <div
              ref={siteVisitCardRef}
              className="relative p-6 sm:p-8 rounded-2xl md:rounded-3xl bg-[#080C14]/90 border border-white/15 hover:border-[#008CFF]/40 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300 group/site overflow-hidden"
            >
              {/* Subtle Ambient Hover Sheen */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#008CFF]/10 rounded-full blur-3xl pointer-events-none group-hover/site:bg-[#008CFF]/20 transition-all duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Compass className="w-4 h-4 text-[#008CFF]" />
                  <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#008CFF] font-semibold">
                    SITE VISIT
                  </span>
                </div>

                <h3 className="font-editorial font-black uppercase text-2xl sm:text-3xl tracking-tight text-white mb-2 leading-tight">
                  LET'S MEET WHERE THE WORK HAPPENS.
                </h3>

                <p className="text-white/65 text-xs sm:text-sm leading-relaxed mb-6">
                  Need us on location? Request a site visit and tell us where the project is happening.
                </p>

                {siteVisitSubmitted ? (
                  <div className="p-4 rounded-xl bg-[#008CFF]/10 border border-[#008CFF]/30 text-center animate-fadeIn">
                    <CheckCircle2 className="w-8 h-8 text-[#008CFF] mx-auto mb-2" />
                    <span className="font-mono text-xs uppercase tracking-wider text-white font-semibold block">
                      Site Visit Request Prepared
                    </span>
                    <span className="text-xs text-white/70 mt-1 block">
                      WhatsApp conversation has been opened. Our producer will coordinate dates with you.
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleSiteVisitSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono tracking-wider uppercase text-white/55 mb-1">
                          Location / City
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Factory, Showroom, City"
                          value={siteVisitData.location}
                          onChange={(e) => setSiteVisitData({ ...siteVisitData, location: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#008CFF] focus:ring-1 focus:ring-[#008CFF] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono tracking-wider uppercase text-white/55 mb-1">
                          Preferred Date
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Next week, Oct 15"
                          value={siteVisitData.date}
                          onChange={(e) => setSiteVisitData({ ...siteVisitData, date: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#008CFF] focus:ring-1 focus:ring-[#008CFF] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-white/55 mb-1">
                        Project / Company
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. New Factory Launch / Santhi Pipes"
                        value={siteVisitData.company}
                        onChange={(e) => setSiteVisitData({ ...siteVisitData, company: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#008CFF] focus:ring-1 focus:ring-[#008CFF] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-white/55 mb-1">
                        Short Message / Location Details
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Site walk-through, lighting check, outdoor recce..."
                        value={siteVisitData.message}
                        onChange={(e) => setSiteVisitData({ ...siteVisitData, message: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#008CFF] focus:ring-1 focus:ring-[#008CFF] transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3 px-5 rounded-full bg-white/10 hover:bg-[#008CFF] border border-white/15 hover:border-[#008CFF] text-white text-xs font-mono uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] group/btn cursor-pointer"
                    >
                      <span>REQUEST SITE VISIT</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: PRIMARY INQUIRY FORM                           */}
          {/* ============================================================ */}
          <div
            id="contact-form"
            ref={formCardRef}
            className="lg:col-span-7 p-6 sm:p-10 md:p-12 rounded-2xl md:rounded-3xl bg-[#070A10]/90 border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-left order-1 lg:order-2"
          >
            <div className="mb-8 pb-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-[#008CFF] font-semibold block mb-1">
                  Step 01 • Project Details
                </span>
                <h2 className="font-editorial font-black uppercase text-2xl sm:text-3xl md:text-4xl tracking-tight text-white">
                  START A CONVERSATION
                </h2>
              </div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-white/40">
                Responses in &lt; 2 hours
              </span>
            </div>

            {formSubmitted ? (
              <div className="py-12 flex flex-col items-center text-center animate-fadeIn">
                <CheckCircle2 className="w-14 h-14 text-[#008CFF] mb-4 drop-shadow-[0_0_16px_rgba(0,140,255,0.6)]" />
                <h3 className="text-2xl sm:text-3xl font-editorial font-bold uppercase text-white mb-2">
                  Conversation Initiated
                </h3>
                <p className="text-white/70 text-sm max-w-md mb-8 leading-relaxed">
                  Thank you, <span className="text-white font-semibold">{formData.name}</span>. Your project brief has been compiled and direct WhatsApp dispatch was launched.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-md">
                  <a
                    href={createWhatsAppInquiryUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20BE5B] text-black font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(37,211,102,0.4)]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open in WhatsApp</span>
                  </a>

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
                        message: ''
                      });
                    }}
                    className="w-full py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePrimarySubmit} className="space-y-5">
                {/* 1. Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs font-mono tracking-wider uppercase text-white/70 mb-2">
                      NAME <span className="text-[#008CFF]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#008CFF] focus:ring-1 focus:ring-[#008CFF] transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono tracking-wider uppercase text-white/70 mb-2">
                      EMAIL <span className="text-[#008CFF]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@brand.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#008CFF] focus:ring-1 focus:ring-[#008CFF] transition-all duration-200"
                    />
                  </div>
                </div>

                {/* 2. Phone / WhatsApp & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs font-mono tracking-wider uppercase text-white/70 mb-2">
                      PHONE / WHATSAPP <span className="text-[#008CFF]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#008CFF] focus:ring-1 focus:ring-[#008CFF] transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono tracking-wider uppercase text-white/70 mb-2">
                      COMPANY / BRAND
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Santhi Pipes, Aabharan"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#008CFF] focus:ring-1 focus:ring-[#008CFF] transition-all duration-200"
                    />
                  </div>
                </div>

                {/* 3. Project Type Dropdown */}
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-white/70 mb-2">
                    PROJECT TYPE <span className="text-[#008CFF]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-[#090D14] border border-white/15 text-white text-sm focus:outline-none focus:border-[#008CFF] focus:ring-1 focus:ring-[#008CFF] transition-all duration-200 appearance-none cursor-pointer"
                    >
                      {PROJECT_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-[#090D14] text-white">
                          {type}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/60">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 4. Tell us about your project */}
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-white/70 mb-2">
                    TELL US ABOUT YOUR PROJECT <span className="text-[#008CFF]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Briefly describe your goals, timeline, deliverable formats, budget range, or any reference vision..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#008CFF] focus:ring-1 focus:ring-[#008CFF] transition-all duration-200 resize-none leading-relaxed"
                  />
                </div>

                {/* 5. CTAs: Primary + WhatsApp Secondary */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3.5">
                  {/* Primary CTA */}
                  <button
                    type="submit"
                    className="w-full sm:flex-1 py-4 px-8 rounded-full bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs sm:text-[13px] uppercase tracking-[0.22em] font-bold flex items-center justify-center gap-2 shadow-[0_0_28px_rgba(0,140,255,0.45)] hover:shadow-[0_0_36px_rgba(0,140,255,0.6)] transition-all duration-300 group/submit cursor-pointer active:scale-98"
                  >
                    <span>START A CONVERSATION</span>
                    <ArrowRight className="w-4 h-4 group-hover/submit:translate-x-1.5 transition-transform duration-200" />
                  </button>

                  {/* Secondary Prominent WhatsApp CTA */}
                  <button
                    type="button"
                    onClick={handleDirectWhatsAppClick}
                    className="w-full sm:w-auto py-4 px-6 rounded-full bg-white/[0.06] hover:bg-[#25D366]/15 border border-white/15 hover:border-[#25D366]/60 text-white hover:text-[#25D366] font-mono text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-sm cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-[#25D366]" />
                    <span>INQUIRE ON WHATSAPP →</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
