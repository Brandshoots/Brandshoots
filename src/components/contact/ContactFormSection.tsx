import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  ArrowUpRight,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Copy,
  Check,
  CheckCircle2
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PROJECT_TYPES = [
  'Commercial Production',
  'Brand Film & TVC',
  'Social Media Content & Reels',
  'Industrial & Factory Showcase',
  'Product Video & Visual Campaign',
  'Fashion & Luxury Lifestyle',
  'Corporate & Executive Showcase',
  'Full-Service Creative Campaign',
  'Other / Custom Scope'
];

const WHATSAPP_PHONE = '917075960672';
const DISPLAY_PHONE = '+91 70759 60672';
const STUDIO_EMAIL = 'contact@brandshoots.com';
const STUDIO_LOCATION = 'Rajahmundry & Hyderabad, India';

export const ContactFormSection: React.FC = () => {
  // Inquiry form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: 'Commercial Production',
    message: ''
  });

  // Site visit state (simple & fast to fill)
  const [siteVisitData, setSiteVisitData] = useState({
    location: '',
    date: '',
    name: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [siteVisitSubmitted, setSiteVisitSubmitted] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // GSAP animation refs
  const sectionRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement>(null);
  const headlineLine3Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statusStripRef = useRef<HTMLDivElement>(null);
  const contactCompositionRef = useRef<HTMLDivElement>(null);
  const siteVisitSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Initial states
      gsap.set(badgeRef.current, { y: 15, opacity: 0 });
      gsap.set(
        [
          headlineLine1Ref.current,
          headlineLine2Ref.current,
          headlineLine3Ref.current
        ],
        { yPercent: 105, opacity: 0 }
      );
      gsap.set(subtitleRef.current, { y: 20, opacity: 0 });
      gsap.set(statusStripRef.current, { y: 20, opacity: 0 });
      gsap.set(contactCompositionRef.current, { y: 30, opacity: 0 });
      gsap.set(siteVisitSectionRef.current, { y: 30, opacity: 0 });

      // Cinematic staggered entrance
      tl.to(badgeRef.current, { y: 0, opacity: 1, duration: 0.5 }, 0.05)
        .to(
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
          0.12
        )
        .to(
          subtitleRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
          },
          '-=0.45'
        )
        .to(
          statusStripRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
          },
          '-=0.35'
        )
        .to(
          contactCompositionRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
          },
          '-=0.3'
        )
        .to(
          siteVisitSectionRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
          },
          '-=0.25'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCopy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    }
  };

  // Primary form submission
  const handlePrimarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  // Site visit submission: generates WhatsApp message and redirects to official number
  const handleSiteVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSiteVisitSubmitted(true);

    const messageLines = [
      'Hi BRANDSHOOTS,',
      '',
      'I would like to book a Site Visit & On-Location Recce (₹2,000) for my project.',
      '',
      `• Location / City: ${siteVisitData.location || 'Not provided'}`,
      `• Preferred Date: ${siteVisitData.date || 'Flexible'}`,
      `• Contact Name / Phone: ${siteVisitData.name || 'Client'}`,
      '',
      'Please confirm availability for the site visit. Thank you!'
    ];

    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(messageLines.join('\n'))}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="contact-form"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#030508] text-white pt-32 sm:pt-40 md:pt-44 lg:pt-48 pb-24 sm:pb-32 px-5 sm:px-8 md:px-12 lg:px-16 overflow-hidden selection:bg-[#008CFF] selection:text-white"
    >
      {/* ============================================================== */}
      {/* 0. ATMOSPHERIC LIGHTING & TECHNICAL GRID (MATCHES HOME/PORTFOLIO) */}
      {/* ============================================================== */}
      {/* Top Hero Electric Blue Horizon Radial Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1100px] h-[520px] pointer-events-none select-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(0, 140, 255, 0.16) 0%, rgba(0, 80, 180, 0.05) 50%, transparent 80%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Mid-canvas Depth Glow */}
      <div
        className="absolute top-[45%] right-[-10%] w-[55vw] max-w-[700px] h-[600px] pointer-events-none select-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.07) 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
      />

      {/* Lower Site Visit Glow */}
      <div
        className="absolute bottom-[5%] left-[-10%] w-[55vw] max-w-[700px] h-[600px] pointer-events-none select-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.08) 0%, transparent 70%)',
          filter: 'blur(110px)',
        }}
      />

      {/* Subtle Engineering Blueprint Grid */}
      <div className="absolute inset-0 opacity-[0.028] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] pointer-events-none" />

      {/* Subtle Cinema Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,140,255,0.08),rgba(3,5,8,0))] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* ============================================================== */}
        {/* 1. HERO / OPENING (EDITORIAL, INDEXED & ACCENTED)               */}
        {/* ============================================================== */}
        <div className="mb-14 sm:mb-20 md:mb-24 text-left">
          {/* Section Index Pill Badge */}
          <div ref={badgeRef} className="inline-flex items-center gap-2.5 font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#008CFF] font-semibold mb-6 px-4 py-1.5 rounded-full bg-[#008CFF]/10 border border-[#008CFF]/25 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF] animate-pulse" />
            <span>• 01 // CONTACT & COMMISSIONS</span>
          </div>

          <h1 className="font-editorial font-black uppercase text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[104px] tracking-tight leading-[0.92] text-white select-none">
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
              <span ref={headlineLine3Ref} className="block text-[#008CFF] drop-shadow-[0_0_40px_rgba(0,140,255,0.45)]">
                WORTH WATCHING.
              </span>
            </div>
          </h1>

          <p
            ref={subtitleRef}
            className="mt-6 sm:mt-8 max-w-2xl text-white/70 text-sm sm:text-base md:text-lg font-light leading-relaxed"
          >
            Have a project, campaign, product, or visual story that deserves more than ordinary content? Tell us what you're building and let's craft something monumental together.
          </p>

          {/* Technical Status Strip */}
          <div ref={statusStripRef} className="mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3.5 font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-white/60">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_6px_#008CFF]" />
              <span className="text-white/80 font-medium">STATUS: ACCEPTING SELECT COMMISSIONS</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-sm">
              <Clock className="w-3 h-3 text-[#008CFF]" />
              <span>AVG. RESPONSE &lt; 2 HOURS</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-sm">
              <MapPin className="w-3 h-3 text-[#008CFF]" />
              <span>RAJAHMUNDRY & HYDERABAD</span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. MAIN COMPOSITION: DIRECT REACH (LEFT) + INQUIRY CHASSIS (RIGHT) */}
        {/* ============================================================== */}
        <div
          ref={contactCompositionRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-start pb-20 sm:pb-28 border-b border-white/[0.08]"
        >
          {/* ============================================================ */}
          {/* LEFT: DIRECT STUDIO REACH (ARCHITECTURAL GLASS TILES)        */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 font-mono text-xs sm:text-[13px] tracking-[0.24em] uppercase text-[#008CFF] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
                <span>DIRECT STUDIO REACH</span>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                [ 04 CHANNELS ]
              </span>
            </div>

            {/* CHANNEL 1: WHATSAPP DIRECT DISPATCH */}
            <div className="group relative rounded-2xl bg-white/[0.025] hover:bg-white/[0.045] border border-white/10 hover:border-[#008CFF]/50 p-5 sm:p-6 transition-all duration-300 backdrop-blur-xl overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
              {/* Subtle top laser rim */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#008CFF]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#008CFF]/15 border border-[#008CFF]/30 flex items-center justify-center text-[#008CFF] group-hover:scale-105 group-hover:bg-[#008CFF] group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(0,140,255,0.25)] shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] tracking-[0.22em] uppercase text-white/50 mb-0.5">
                      WHATSAPP DIRECT
                    </span>
                    <a
                      href={`https://wa.me/${WHATSAPP_PHONE}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg sm:text-xl font-medium tracking-wide text-white group-hover:text-[#008CFF] transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>{DISPLAY_PHONE}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </a>
                  </div>
                </div>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={() => handleCopy(DISPLAY_PHONE, 'phone')}
                  aria-label="Copy phone number"
                  className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-white/60 hover:text-white text-[10px] font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center gap-1 shrink-0"
                >
                  {copiedKey === 'phone' ? (
                    <>
                      <Check className="w-3 h-3 text-[#008CFF]" />
                      <span className="text-[#008CFF]">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-white/50 tracking-wider">
                <span className="flex items-center gap-1.5 text-white/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Instant Direct Dispatch
                </span>
                <span className="text-white/40">Active Daily</span>
              </div>
            </div>

            {/* CHANNEL 2: STUDIO EMAIL */}
            <div className="group relative rounded-2xl bg-white/[0.025] hover:bg-white/[0.045] border border-white/10 hover:border-[#008CFF]/50 p-5 sm:p-6 transition-all duration-300 backdrop-blur-xl overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#008CFF]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#008CFF]/15 border border-[#008CFF]/30 flex items-center justify-center text-[#008CFF] group-hover:scale-105 group-hover:bg-[#008CFF] group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(0,140,255,0.25)] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] tracking-[0.22em] uppercase text-white/50 mb-0.5">
                      OFFICIAL STUDIO DESK
                    </span>
                    <a
                      href={`mailto:${STUDIO_EMAIL}`}
                      className="text-[14px] xs:text-[15px] sm:text-xl font-medium tracking-wide text-white group-hover:text-[#008CFF] transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>{STUDIO_EMAIL}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                    </a>
                  </div>
                </div>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={() => handleCopy(STUDIO_EMAIL, 'email')}
                  aria-label="Copy studio email"
                  className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-white/60 hover:text-white text-[10px] font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center gap-1 shrink-0"
                >
                  {copiedKey === 'email' ? (
                    <>
                      <Check className="w-3 h-3 text-[#008CFF]" />
                      <span className="text-[#008CFF]">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-white/50 tracking-wider">
                <span>Director Treatments & Briefs</span>
                <span className="text-[#008CFF]/80">24h SLA</span>
              </div>
            </div>

            {/* CHANNEL 3: PRODUCTION BASES */}
            <div className="relative rounded-2xl bg-white/[0.025] border border-white/10 p-5 sm:p-6 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/70 shrink-0">
                  <MapPin className="w-4 h-4 text-[#008CFF]" />
                </div>
                <div>
                  <span className="block font-mono text-[10px] tracking-[0.22em] uppercase text-white/50 mb-0.5">
                    PRODUCTION HUBS
                  </span>
                  <span className="text-base sm:text-lg font-medium text-white block">
                    {STUDIO_LOCATION}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs text-white/60 font-light leading-relaxed">
                Full-scale camera packages, aerial cinematography, and lighting teams ready to deploy across India and international sets.
              </p>
            </div>

            {/* CHANNEL 4: OPERATING HOURS & AVAILABILITY */}
            <div className="relative rounded-2xl bg-white/[0.025] border border-white/10 p-5 sm:p-6 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/70 shrink-0">
                  <Clock className="w-4 h-4 text-[#008CFF]" />
                </div>
                <div>
                  <span className="block font-mono text-[10px] tracking-[0.22em] uppercase text-white/50 mb-0.5">
                    STUDIO HOURS
                  </span>
                  <span className="text-base sm:text-lg font-medium text-white block font-mono">
                    MON — SAT // 09:00 — 20:00 IST
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center gap-2 text-xs font-mono text-white/50">
                <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF]" />
                <span>On-call 24/7 during active shoot schedules</span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT: PROJECT INQUIRY CHASSIS (ELEVATED CINEMA PANEL)       */}
          {/* ============================================================ */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl bg-gradient-to-b from-[#080B12]/95 via-[#06080E]/90 to-[#04060A]/95 border border-white/12 p-6 sm:p-9 md:p-11 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.85)] overflow-hidden">
              {/* Top Electric Blue Laser Rim Line */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#008CFF]/80 to-transparent pointer-events-none" />

              {/* Technical Corner Registration Marks (Signature BrandShoots Cinema Chassis) */}
              <div className="absolute top-3.5 left-3.5 w-2.5 h-2.5 border-t border-l border-white/25 pointer-events-none" />
              <div className="absolute top-3.5 right-3.5 w-2.5 h-2.5 border-t border-r border-white/25 pointer-events-none" />
              <div className="absolute bottom-3.5 left-3.5 w-2.5 h-2.5 border-b border-l border-white/25 pointer-events-none" />
              <div className="absolute bottom-3.5 right-3.5 w-2.5 h-2.5 border-b border-r border-white/25 pointer-events-none" />

              {/* Chassis Internal Header */}
              <div className="mb-8 pb-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <span className="block font-mono text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-[#008CFF] font-semibold mb-1">
                    PROJECT INQUIRY FORM
                  </span>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                    START A CONVERSATION
                  </h2>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono tracking-widest text-white/50 uppercase">
                  <span className="w-1 h-1 rounded-full bg-[#008CFF]" />
                  <span>CONFIDENTIAL</span>
                </div>
              </div>

              {formSubmitted ? (
                <div className="py-16 px-6 sm:px-10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-[#008CFF]/15 border border-[#008CFF]/40 flex items-center justify-center text-[#008CFF] mb-6 shadow-[0_0_30px_rgba(0,140,255,0.4)] animate-pulse">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-editorial text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white mb-2">
                    BRIEF RECEIVED.
                  </h3>
                  <p className="font-mono text-xs sm:text-sm tracking-wider uppercase text-[#008CFF] mb-4">
                    WE WILL BE IN TOUCH WITHIN 2 HOURS.
                  </p>
                  <p className="max-w-md text-white/70 text-sm font-light leading-relaxed mb-8">
                    Thank you, {formData.name || 'Friend'}. Our executive creative producers will review your requirements and reach out with director treatments and scheduling options.
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
                        message: ''
                      });
                    }}
                    className="font-mono text-xs uppercase tracking-[0.2em] px-6 py-3 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-white/70 hover:text-white transition-all cursor-pointer"
                  >
                    Send another message →
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePrimarySubmit} className="space-y-5 sm:space-y-6">
                  {/* 1. Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-[11px] font-mono tracking-[0.18em] uppercase text-white/70 mb-2">
                        NAME <span className="text-[#008CFF]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4.5 py-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/12 focus:border-[#008CFF] focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(0,140,255,0.25)] text-white placeholder-white/30 text-sm transition-all duration-200 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono tracking-[0.18em] uppercase text-white/70 mb-2">
                        WORK EMAIL <span className="text-[#008CFF]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="your@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4.5 py-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/12 focus:border-[#008CFF] focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(0,140,255,0.25)] text-white placeholder-white/30 text-sm transition-all duration-200 outline-none"
                      />
                    </div>
                  </div>

                  {/* 2. Phone / WhatsApp & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-[11px] font-mono tracking-[0.18em] uppercase text-white/70 mb-2">
                        PHONE / WHATSAPP <span className="text-[#008CFF]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 00000 00000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4.5 py-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/12 focus:border-[#008CFF] focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(0,140,255,0.25)] text-white placeholder-white/30 text-sm transition-all duration-200 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono tracking-[0.18em] uppercase text-white/70 mb-2">
                        COMPANY / BRAND
                      </label>
                      <input
                        type="text"
                        placeholder="Brand or studio name"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4.5 py-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/12 focus:border-[#008CFF] focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(0,140,255,0.25)] text-white placeholder-white/30 text-sm transition-all duration-200 outline-none"
                      />
                    </div>
                  </div>

                  {/* 3. Project Type Dropdown */}
                  <div>
                    <label className="block text-[11px] font-mono tracking-[0.18em] uppercase text-white/70 mb-2">
                      PROJECT CATEGORY
                    </label>
                    <div className="relative">
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full px-4.5 py-3.5 rounded-xl bg-[#080B12] hover:bg-[#0A0E18] border border-white/12 text-white text-sm focus:outline-none focus:border-[#008CFF] focus:shadow-[0_0_20px_rgba(0,140,255,0.25)] transition-all duration-200 appearance-none cursor-pointer pr-10"
                      >
                        {PROJECT_TYPES.map((type) => (
                          <option key={type} value={type} className="bg-[#080B12] text-white py-2">
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

                  {/* 4. Message */}
                  <div>
                    <label className="block text-[11px] font-mono tracking-[0.18em] uppercase text-white/70 mb-2">
                      PROJECT BRIEF & VISION
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us what you're building, target platforms, timeline, and where you want to take your brand."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4.5 py-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/12 focus:border-[#008CFF] focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(0,140,255,0.25)] text-white placeholder-white/30 text-sm transition-all duration-200 resize-none leading-relaxed outline-none"
                    />
                  </div>

                  {/* 5. Actions: Primary Brand Button + WhatsApp Link */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    {/* Primary Submit */}
                    <button
                      type="submit"
                      className="relative group overflow-hidden py-4 px-8 rounded-full bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs uppercase tracking-[0.22em] font-bold shadow-[0_0_28px_rgba(0,140,255,0.45)] hover:shadow-[0_0_40px_rgba(0,140,255,0.7)] flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-98 cursor-pointer"
                    >
                      <span>START A CONVERSATION</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Secondary WhatsApp Inquire Link */}
                    <a
                      href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hi BRANDSHOOTS, I would like to discuss a project.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-white/[0.03] hover:bg-white/[0.07] border border-white/10"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#008CFF]" />
                      <span>INQUIRE ON WHATSAPP</span>
                      <span>→</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. SITE VISIT — SEPARATE ARCHITECTURAL PRICE TILE CARD         */}
        {/* ============================================================== */}
        <div ref={siteVisitSectionRef} className="pt-16 sm:pt-24">
          {/* Section Pill Badge */}
          <div className="inline-flex items-center gap-2.5 font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-[#008CFF] font-semibold mb-6 px-4 py-1.5 rounded-full bg-[#008CFF]/10 border border-[#008CFF]/25 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
            <span>• 02 // ON-LOCATION AUDIT & RECCE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Context: Editorial Introduction */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <h2 className="font-editorial font-bold uppercase text-3xl sm:text-4xl md:text-5xl tracking-tight text-white mb-4 leading-tight">
                LET'S MEET WHERE THE WORK HAPPENS.
              </h2>
              <p className="text-white/70 text-sm sm:text-base font-light leading-relaxed mb-8">
                Need us to inspect your factory, showroom, outdoor estate, or shoot location in person? 
                Our team conducts comprehensive on-location spatial recces, camera framing tests, and lighting assessments before production begins.
              </p>

              {/* High-value Points */}
              <div className="space-y-3.5 pt-1 text-xs sm:text-sm text-white/80 font-mono tracking-wide">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#008CFF]/15 border border-[#008CFF]/30 flex items-center justify-center text-[#008CFF] text-xs font-bold shrink-0 shadow-[0_0_8px_rgba(0,140,255,0.3)]">✓</span>
                  <span>Director & Cinematographer on-site spatial recce</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#008CFF]/15 border border-[#008CFF]/30 flex items-center justify-center text-[#008CFF] text-xs font-bold shrink-0 shadow-[0_0_8px_rgba(0,140,255,0.3)]">✓</span>
                  <span>Lighting angles, acoustics & 3-phase power audit</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#008CFF]/15 border border-[#008CFF]/30 flex items-center justify-center text-[#008CFF] text-xs font-bold shrink-0 shadow-[0_0_8px_rgba(0,140,255,0.3)]">✓</span>
                  <span>Shot feasibility & production schedule planning</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#008CFF]/15 border border-[#008CFF]/30 flex items-center justify-center text-[#008CFF] text-xs font-bold shrink-0 shadow-[0_0_8px_rgba(0,140,255,0.3)]">✓</span>
                  <span>Aerial drone clearance & camera flight path test</span>
                </div>
              </div>
            </div>

            {/* Right: The Separate Vertical Rectangle Price Tile Card */}
            <div className="lg:col-span-6 flex justify-start lg:justify-end">
              <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#080B12]/95 via-[#06080E]/90 to-[#04060A]/95 border border-white/15 hover:border-[#008CFF]/50 transition-all duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.85)] flex flex-col justify-between relative overflow-hidden backdrop-blur-2xl">
                
                {/* Top laser rim light */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#008CFF]/70 to-transparent pointer-events-none" />

                {/* Corner registration marks */}
                <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-white/20 pointer-events-none" />
                <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-white/20 pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-white/20 pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-white/20 pointer-events-none" />

                {/* Card Header & Price Tag */}
                <div className="pb-6 border-b border-white/10 mb-6">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-white/50 font-semibold">
                      LOCATION VISIT TILE
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#008CFF]/15 border border-[#008CFF]/30 text-[10px] font-mono tracking-widest text-[#008CFF] uppercase font-bold shadow-[0_0_8px_rgba(0,140,255,0.3)]">
                      FIXED FEE
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-editorial text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                      ₹2,000
                    </span>
                    <span className="font-mono text-xs text-[#008CFF] tracking-widest uppercase font-semibold">
                      / PER RECCE
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-white/60 font-light leading-relaxed">
                    Direct on-site spatial consultation & cinema camera recce by BrandShoots core team.
                  </p>
                </div>

                {/* Quick & Simple Booking Form */}
                {siteVisitSubmitted ? (
                  <div className="py-8 px-4 border border-[#008CFF]/30 rounded-2xl bg-[#008CFF]/10 text-center animate-fadeIn">
                    <div className="w-12 h-12 rounded-full bg-[#008CFF]/20 border border-[#008CFF]/40 flex items-center justify-center text-[#008CFF] mx-auto mb-3 shadow-[0_0_20px_rgba(0,140,255,0.4)]">
                      <Check className="w-6 h-6" />
                    </div>
                    <p className="font-mono text-xs tracking-wider uppercase text-white font-semibold">
                      INQUIRY OPENED IN WHATSAPP
                    </p>
                    <p className="text-xs text-white/70 mt-1 max-w-xs mx-auto">
                      Connecting with +91 70759 60672 to confirm shoot dates.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSiteVisitSubmitted(false)}
                      className="mt-5 font-mono text-xs uppercase tracking-widest text-[#008CFF] hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
                    >
                      Book Another Site Visit
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSiteVisitSubmit} className="space-y-4">
                    {/* Location / City */}
                    <div>
                      <label className="block text-[11px] font-mono tracking-wider uppercase text-white/70 mb-1.5">
                        LOCATION / CITY <span className="text-[#008CFF]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hyderabad, Factory, Studio..."
                        value={siteVisitData.location}
                        onChange={(e) => setSiteVisitData({ ...siteVisitData, location: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 text-white placeholder-white/25 text-xs sm:text-sm focus:outline-none focus:border-[#008CFF] focus:shadow-[0_0_15px_rgba(0,140,255,0.25)] transition-all duration-200"
                      />
                    </div>

                    {/* Preferred Date & Name/Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-mono tracking-wider uppercase text-white/70 mb-1.5">
                          PREFERRED DATE
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Next week, Oct 25"
                          value={siteVisitData.date}
                          onChange={(e) => setSiteVisitData({ ...siteVisitData, date: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 text-white placeholder-white/25 text-xs sm:text-sm focus:outline-none focus:border-[#008CFF] focus:shadow-[0_0_15px_rgba(0,140,255,0.25)] transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono tracking-wider uppercase text-white/70 mb-1.5">
                          NAME / PHONE
                        </label>
                        <input
                          type="text"
                          placeholder="Your name or phone"
                          value={siteVisitData.name}
                          onChange={(e) => setSiteVisitData({ ...siteVisitData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 text-white placeholder-white/25 text-xs sm:text-sm focus:outline-none focus:border-[#008CFF] focus:shadow-[0_0_15px_rgba(0,140,255,0.25)] transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* CTA Button: Redirects to WhatsApp 7075960672 */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-4 px-5 rounded-full bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer shadow-[0_0_24px_rgba(0,140,255,0.4)] hover:shadow-[0_0_36px_rgba(0,140,255,0.65)] active:scale-98"
                      >
                        <span>BOOK SITE VISIT (₹2,000)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Direct One-Click WhatsApp Link */}
                    <div className="text-center pt-2">
                      <a
                        href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hi BRANDSHOOTS, I would like to book a Site Visit (₹2,000) for my project. Please share available dates.")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-white/60 hover:text-[#008CFF] transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#008CFF]" />
                        <span>Or Inquire directly on WhatsApp (7075960672) →</span>
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
