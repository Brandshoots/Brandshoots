import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MessageSquare } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PROJECT_TYPES = [
  'Commercial Production',
  'Brand Film',
  'Social Media Content',
  'Product Video',
  'Event / Corporate',
  'Other'
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

  // GSAP animation refs
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement>(null);
  const headlineLine3Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const contactCompositionRef = useRef<HTMLDivElement>(null);
  const siteVisitSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Initial states
      gsap.set(
        [
          headlineLine1Ref.current,
          headlineLine2Ref.current,
          headlineLine3Ref.current
        ],
        { yPercent: 100, opacity: 0 }
      );
      gsap.set(subtitleRef.current, { y: 20, opacity: 0 });
      gsap.set(contactCompositionRef.current, { y: 25, opacity: 0 });
      gsap.set(siteVisitSectionRef.current, { y: 25, opacity: 0 });

      // Cinematic staggered entrance
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
          contactCompositionRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
          },
          '-=0.35'
        )
        .to(
          siteVisitSectionRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
          },
          '-=0.25'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Primary form submission
  const handlePrimarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  // Site visit submission: generates WhatsApp message and redirects to 7075960672
  const handleSiteVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSiteVisitSubmitted(true);

    const messageLines = [
      'Hi BRANDSHOOTS,',
      '',
      'I would like to book a Site Visit (₹2,000) for my project.',
      '',
      `Location / City: ${siteVisitData.location || 'Not provided'}`,
      `Preferred Date: ${siteVisitData.date || 'Flexible'}`,
      `Name / Phone: ${siteVisitData.name || 'Client'}`,
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
      className="relative w-full min-h-screen bg-[#04060A] text-white pt-28 sm:pt-36 md:pt-40 lg:pt-44 pb-20 sm:pb-28 px-5 sm:px-8 md:px-12 lg:px-16"
    >
      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* ============================================================== */}
        {/* 1. HERO / OPENING (EDITORIAL & CLEAN)                          */}
        {/* ============================================================== */}
        <div className="mb-14 sm:mb-20 md:mb-24 text-left">
          <h1 className="font-editorial font-black uppercase text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[100px] tracking-tight leading-[0.92] text-white select-none">
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
              <span ref={headlineLine3Ref} className="block text-[#008CFF]">
                WORTH WATCHING.
              </span>
            </div>
          </h1>

          <p
            ref={subtitleRef}
            className="mt-6 sm:mt-8 max-w-2xl text-white/70 text-sm sm:text-base md:text-lg font-light leading-relaxed"
          >
            Have a project, campaign, product, or story that deserves more than ordinary content? Tell us what you're building.
          </p>
        </div>

        {/* ============================================================== */}
        {/* 2. ONE CLEAN CONTACT COMPOSITION (DESKTOP GRID / MOBILE ORDER)  */}
        {/* Order on mobile: DIRECT CONTACT -> PROJECT INQUIRY             */}
        {/* ============================================================== */}
        <div
          ref={contactCompositionRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 items-start pb-16 sm:pb-24 border-b border-white/[0.08]"
        >
          {/* ============================================================ */}
          {/* LEFT: DIRECT STUDIO REACH (NO DASHBOARD, PURE EDITORIAL)     */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div>
              <h2 className="font-mono text-xs sm:text-[13px] tracking-[0.24em] uppercase text-white/50 mb-8 font-semibold">
                DIRECT STUDIO REACH
              </h2>

              <div className="flex flex-col gap-8">
                {/* WHATSAPP */}
                <div>
                  <span className="block font-mono text-[11px] tracking-[0.2em] uppercase text-white/40 mb-1.5">
                    WHATSAPP
                  </span>
                  <a
                    href={`https://wa.me/${WHATSAPP_PHONE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-white hover:text-[#008CFF] text-lg sm:text-xl md:text-2xl font-medium tracking-wide transition-colors"
                  >
                    {DISPLAY_PHONE}
                  </a>
                </div>

                {/* EMAIL */}
                <div>
                  <span className="block font-mono text-[11px] tracking-[0.2em] uppercase text-white/40 mb-1.5">
                    EMAIL
                  </span>
                  <a
                    href={`mailto:${STUDIO_EMAIL}`}
                    className="inline-block text-white hover:text-[#008CFF] text-lg sm:text-xl md:text-2xl font-medium tracking-wide transition-colors"
                  >
                    {STUDIO_EMAIL}
                  </a>
                </div>

                {/* LOCATION */}
                <div>
                  <span className="block font-mono text-[11px] tracking-[0.2em] uppercase text-white/40 mb-1.5">
                    LOCATION
                  </span>
                  <span className="block text-white text-base sm:text-lg font-medium leading-relaxed">
                    {STUDIO_LOCATION}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT: PROJECT INQUIRY FORM (EASY & SIMPLE TO FILL)          */}
          {/* ============================================================ */}
          <div className="lg:col-span-7">
            <h2 className="font-mono text-xs sm:text-[13px] tracking-[0.24em] uppercase text-white/50 mb-8 font-semibold">
              START A CONVERSATION
            </h2>

            {formSubmitted ? (
              <div className="py-12 px-6 sm:px-8 border border-white/[0.08] rounded-xl bg-white/[0.02] text-left">
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mb-2">
                  THANK YOU.
                </h3>
                <p className="font-mono text-xs sm:text-sm tracking-wider uppercase text-white/70">
                  WE'LL BE IN TOUCH.
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
                  className="mt-8 font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handlePrimarySubmit} className="space-y-5 sm:space-y-6">
                {/* 1. Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs font-mono tracking-wider uppercase text-white/60 mb-2">
                      NAME <span className="text-[#008CFF]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-lg bg-white/[0.03] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#008CFF] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono tracking-wider uppercase text-white/60 mb-2">
                      EMAIL <span className="text-[#008CFF]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-lg bg-white/[0.03] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#008CFF] transition-colors"
                    />
                  </div>
                </div>

                {/* 2. Phone / WhatsApp & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs font-mono tracking-wider uppercase text-white/60 mb-2">
                      PHONE / WHATSAPP <span className="text-[#008CFF]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 00000 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-lg bg-white/[0.03] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#008CFF] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono tracking-wider uppercase text-white/60 mb-2">
                      COMPANY / BRAND
                    </label>
                    <input
                      type="text"
                      placeholder="Company or brand name"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-lg bg-white/[0.03] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#008CFF] transition-colors"
                    />
                  </div>
                </div>

                {/* 3. Project Type Dropdown */}
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-white/60 mb-2">
                    PROJECT TYPE
                  </label>
                  <div className="relative">
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-lg bg-[#070A0F] border border-white/10 text-white text-sm focus:outline-none focus:border-[#008CFF] transition-colors appearance-none cursor-pointer"
                    >
                      {PROJECT_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-[#070A0F] text-white">
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
                  <label className="block text-xs font-mono tracking-wider uppercase text-white/60 mb-2">
                    TELL US ABOUT YOUR PROJECT
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us what you're building, what you need, and where you want to take it."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 sm:py-3.5 rounded-lg bg-white/[0.03] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#008CFF] transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* 5. Two Clear Actions: Primary + Understated Secondary WhatsApp */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  {/* Primary Submit */}
                  <button
                    type="submit"
                    className="py-3.5 px-8 rounded-full bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-98"
                  >
                    <span>START A CONVERSATION</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Secondary Understated WhatsApp Action */}
                  <a
                    href="https://wa.me/917075960672?text=Hi%20BRANDSHOOTS,%20I%20would%20like%20to%20discuss%20a%20project."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors flex items-center justify-center gap-1.5 py-2"
                  >
                    <span>INQUIRE ON WHATSAPP</span>
                    <span>→</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. SITE VISIT — SEPARATE VERTICAL RECTANGLE PRICE TILE CARD    */}
        {/* ============================================================== */}
        <div ref={siteVisitSectionRef} className="pt-16 sm:pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Context: Editorial Introduction */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="block font-mono text-xs tracking-[0.24em] uppercase text-[#008CFF] mb-2 font-semibold">
                SITE VISIT // ON-LOCATION
              </span>
              <h2 className="font-editorial font-bold uppercase text-3xl sm:text-4xl md:text-5xl tracking-tight text-white mb-4 leading-tight">
                LET'S MEET WHERE THE WORK HAPPENS.
              </h2>
              <p className="text-white/70 text-sm sm:text-base font-light leading-relaxed mb-6">
                Need us to inspect your factory, showroom, outdoor estate, or shoot location in person? 
                Our team conducts comprehensive on-location spatial recces, camera framing tests, and lighting assessments before shooting begins.
              </p>

              {/* High-value Points */}
              <div className="space-y-3 pt-2 text-xs sm:text-sm text-white/80 font-mono tracking-wide">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#008CFF]/15 border border-[#008CFF]/30 flex items-center justify-center text-[#008CFF] text-xs font-bold shrink-0">✓</span>
                  <span>Director & Cinematographer on-site recce</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#008CFF]/15 border border-[#008CFF]/30 flex items-center justify-center text-[#008CFF] text-xs font-bold shrink-0">✓</span>
                  <span>Lighting angles, acoustics & power check</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#008CFF]/15 border border-[#008CFF]/30 flex items-center justify-center text-[#008CFF] text-xs font-bold shrink-0">✓</span>
                  <span>Shot feasibility & production schedule planning</span>
                </div>
              </div>
            </div>

            {/* Right: The Separate Vertical Rectangle Price Tile Card */}
            <div className="lg:col-span-6 flex justify-start lg:justify-end">
              <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#070A0F] border border-white/15 hover:border-[#008CFF]/40 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col justify-between relative overflow-hidden">
                
                {/* Subtle top rim light */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#008CFF]/50 to-transparent" />

                {/* Card Header & Price Tag */}
                <div className="pb-5 border-b border-white/10 mb-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-white/50 font-semibold">
                      LOCATION VISIT TILE
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#008CFF]/15 border border-[#008CFF]/30 text-[10px] font-mono tracking-widest text-[#008CFF] uppercase font-bold">
                      FIXED FEE
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-editorial text-4xl sm:text-5xl font-black text-white tracking-tight">
                      ₹2,000
                    </span>
                    <span className="font-mono text-xs text-white/50 tracking-widest uppercase">
                      / VISIT
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-white/60 font-light leading-relaxed">
                    Direct on-site consultation & camera recce by BrandShoots core team.
                  </p>
                </div>

                {/* Quick & Simple Booking Form */}
                {siteVisitSubmitted ? (
                  <div className="py-6 px-4 border border-[#008CFF]/30 rounded-xl bg-[#008CFF]/10 text-center animate-fadeIn">
                    <p className="font-mono text-xs tracking-wider uppercase text-white font-semibold">
                      INQUIRY OPENED IN WHATSAPP
                    </p>
                    <p className="text-xs text-white/70 mt-1">
                      Target: +91 70759 60672. Confirming schedule with our team.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSiteVisitSubmitted(false)}
                      className="mt-4 font-mono text-xs uppercase tracking-widest text-[#008CFF] hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
                    >
                      Book Another Site Visit
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSiteVisitSubmit} className="space-y-3.5">
                    {/* Location / City */}
                    <div>
                      <label className="block text-[11px] font-mono tracking-wider uppercase text-white/70 mb-1.5">
                        LOCATION / CITY <span className="text-[#008CFF]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="e.g. Hyderabad, Factory, Studio..."
                          value={siteVisitData.location}
                          onChange={(e) => setSiteVisitData({ ...siteVisitData, location: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/15 text-white placeholder-white/25 text-xs sm:text-sm focus:outline-none focus:border-[#008CFF] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Preferred Date & Name/Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono tracking-wider uppercase text-white/70 mb-1.5">
                          PREFERRED DATE
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Next week, Oct 20"
                          value={siteVisitData.date}
                          onChange={(e) => setSiteVisitData({ ...siteVisitData, date: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/15 text-white placeholder-white/25 text-xs sm:text-sm focus:outline-none focus:border-[#008CFF] transition-colors"
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
                          className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/15 text-white placeholder-white/25 text-xs sm:text-sm focus:outline-none focus:border-[#008CFF] transition-colors"
                        />
                      </div>
                    </div>

                    {/* CTA Button: Redirects to WhatsApp 7075960672 */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3.5 px-5 rounded-full bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-[0_0_24px_rgba(0,140,255,0.4)] active:scale-98"
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
                        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-white/50 hover:text-[#25D366] transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
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
