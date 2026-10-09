import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  ArrowUpRight,
  MessageSquare,
  MapPin,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Instagram,
  Youtube,
  Facebook,
} from 'lucide-react';
import { createLead } from '../../lib/cms/cmsService';
import { BrandShootsLogo3D } from './BrandShootsLogo3D';

gsap.registerPlugin(ScrollTrigger);

const PROJECT_TYPES = [
  'Commercial Production',
  'Brand Film',
  'Social Media Content',
  'Product Video',
  'Event / Corporate',
  'Other',
];

const WHATSAPP_PHONE = '917075960672';
const DISPLAY_PHONE = '+91 70759 60672';
const STUDIO_EMAIL = 'contact@brandshoots.com';
const STUDIO_FULL_ADDRESS =
  '26-2-7/2, Jayakrishnapuram, near kambala cheruvu, Rajamahendravaram 533105, Andhra Pradesh, India';
const GOOGLE_MAPS_EMBED_URL =
  'https://maps.google.com/maps?q=26-2-7%2F2%2C%20Jayakrishnapuram%2C%20near%20kambala%20cheruvu%2C%20Rajamahendravaram%20533105%2C%20Andhra%20Pradesh%2C%20India&t=&z=16&ie=UTF8&iwloc=&output=embed';
const GOOGLE_MAPS_SEARCH_URL =
  'https://www.google.com/maps/search/?api=1&query=26-2-7%2F2%2C+Jayakrishnapuram%2C+near+kambala+cheruvu%2C+Rajamahendravaram+533105%2C+Andhra+Pradesh%2C+India';

// Custom Crisp WhatsApp Vector Icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const SOCIAL_TILES = [
  {
    id: 'whatsapp',
    name: 'WHATSAPP',
    handle: '+91 70759 60672',
    tag: 'DIRECT LINE // FASTEST REPLIES',
    headline: 'Instant Studio Chat',
    description:
      'Direct real-time WhatsApp line for project consultations, shoot estimates, and rapid site visit bookings.',
    url: `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hi BRANDSHOOTS, I would like to discuss a commercial project.')}`,
    cta: 'Chat on WhatsApp',
    brandColor: '#25D366',
    icon: WhatsAppIcon,
  },
  {
    id: 'instagram',
    name: 'INSTAGRAM',
    handle: '@wearebrandshoots',
    tag: 'VISUAL REELS // BEHIND THE SCENES',
    headline: 'Daily Sets & Color Grades',
    description:
      'High-framerate cinema reels, lighting setups, color grading breakdowns, and production stills from our latest film shoots.',
    url: 'https://instagram.com/wearebrandshoots',
    cta: 'Follow on Instagram',
    brandColor: '#E1306C',
    icon: Instagram,
  },
  {
    id: 'youtube',
    name: 'YOUTUBE',
    handle: '@wearebrandshoots',
    tag: '4K COMMERCIALS // MASTER EDITS',
    headline: 'Commercial Films & Edits',
    description:
      'Full 4K/24FPS brand films, high-retention commercials, documentary narratives, and sound design masters.',
    url: 'https://youtube.com/@wearebrandshoots',
    cta: 'Watch on YouTube',
    brandColor: '#FF0000',
    icon: Youtube,
  },
  {
    id: 'facebook',
    name: 'FACEBOOK',
    handle: 'BrandShoots Creative Agency',
    tag: 'OFFICIAL PAGE // COMMUNITY',
    headline: 'Agency News & Case Studies',
    description:
      'Official brand campaign releases, production announcements, client partnership highlights, and agency milestones.',
    url: 'https://facebook.com/wearebrandshoots',
    cta: 'Connect on Facebook',
    brandColor: '#1877F2',
    icon: Facebook,
  },
];

export const ContactFormSection: React.FC = () => {
  // Inquiry form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: 'Commercial Production',
    message: '',
  });

  // Site visit state (simple & fast to fill)
  const [siteVisitData, setSiteVisitData] = useState({
    location: '',
    date: '',
    name: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [siteVisitSubmitted, setSiteVisitSubmitted] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // GSAP animation refs
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement>(null);
  const headlineLine3Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const siteVisitSectionRef = useRef<HTMLDivElement>(null);
  const contactCompositionRef = useRef<HTMLDivElement>(null);
  const mapsSectionRef = useRef<HTMLDivElement>(null);
  const socialTilesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Initial states
      gsap.set(
        [
          headlineLine1Ref.current,
          headlineLine2Ref.current,
          headlineLine3Ref.current,
        ],
        { yPercent: 100, opacity: 0 }
      );
      gsap.set(subtitleRef.current, { y: 20, opacity: 0 });
      gsap.set(siteVisitSectionRef.current, { y: 25, opacity: 0 });
      gsap.set(contactCompositionRef.current, { y: 25, opacity: 0 });

      // Cinematic staggered entrance
      tl.to(
        [
          headlineLine1Ref.current,
          headlineLine2Ref.current,
          headlineLine3Ref.current,
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
          siteVisitSectionRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
          },
          '-=0.35'
        )
        .to(
          contactCompositionRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
          },
          '-=0.25'
        );

      // ScrollTrigger for Maps & Social sections
      if (mapsSectionRef.current) {
        gsap.fromTo(
          mapsSectionRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: mapsSectionRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      if (socialTilesRef.current) {
        gsap.fromTo(
          socialTilesRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: socialTilesRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Primary form submission: saves to Firebase RTDB leads
  const handlePrimarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

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
      console.error('Firebase lead push note:', err);
    }
  };

  // Site visit submission: saves to Firebase RTDB and redirects to WhatsApp 7075960672
  const handleSiteVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSiteVisitSubmitted(true);

    try {
      await createLead({
        name: siteVisitData.name || 'Client Site Visit',
        phone: siteVisitData.name || '',
        message: `Booked Site Visit (₹2,000) for Location: ${siteVisitData.location || 'N/A'}, Preferred Date: ${siteVisitData.date || 'Flexible'}`,
        type: 'site_visit',
        status: 'new',
      });
    } catch (err) {
      console.error('Firebase site visit lead push note:', err);
    }

    const messageLines = [
      'Hi BRANDSHOOTS,',
      '',
      'I would like to book a Site Visit (₹2,000) for my project.',
      '',
      `Location / City: ${siteVisitData.location || 'Not provided'}`,
      `Preferred Date: ${siteVisitData.date || 'Flexible'}`,
      `Name / Phone: ${siteVisitData.name || 'Client'}`,
      '',
      'Please confirm availability for the site visit. Thank you!',
    ];

    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(messageLines.join('\n'))}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Copy address to clipboard
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(STUDIO_FULL_ADDRESS);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <section
      id="contact-form"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#04060A] text-white pt-28 sm:pt-36 md:pt-40 lg:pt-44 pb-20 sm:pb-28 px-5 sm:px-8 md:px-12 lg:px-16"
    >
      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* ============================================================== */}
        {/* 1. HERO / OPENING (REDUCED HEADING + INTERACTIVE 3D LOGO)      */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-14 sm:mb-20 md:mb-24">
          {/* Left Column: Refined, Scaled-Down Editorial Heading */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 mb-3.5 font-mono text-[11px] tracking-[0.24em] text-[#008CFF] uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
              <span>START YOUR PRODUCTION // CONTACT</span>
            </div>

            <h1 className="font-editorial font-black uppercase text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[62px] xl:text-[68px] tracking-tight leading-[0.95] text-white select-none">
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

            {/* User's explicitly preserved one-line sentence */}
            <p
              ref={subtitleRef}
              className="mt-5 sm:mt-6 max-w-xl text-white/70 text-sm sm:text-base md:text-lg font-light leading-relaxed"
            >
              Have a project, campaign, product, or story that deserves more than ordinary content? Tell us what you're building.
            </p>
          </div>

          {/* Right Column: Interactive 3D BrandShoots Logo (Extruded .svg) */}
          <div className="lg:col-span-5 flex items-center justify-center relative w-full h-[280px] xs:h-[320px] sm:h-[360px] md:h-[400px] lg:h-[420px]">
            <BrandShootsLogo3D />
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. SITE VISIT // ON-LOCATION (BROUGHT TO THE TOP!)             */}
        {/* ============================================================== */}
        <div
          ref={siteVisitSectionRef}
          id="site-visit"
          className="pb-16 sm:pb-24 border-b border-white/[0.08]"
        >
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

              {/* High-value Checkpoints */}
              <div className="space-y-3 pt-2 text-xs sm:text-sm text-white/80 font-mono tracking-wide">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#008CFF]/15 border border-[#008CFF]/30 flex items-center justify-center text-[#008CFF] text-xs font-bold shrink-0">
                    ✓
                  </span>
                  <span>Director & Cinematographer on-site recce</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#008CFF]/15 border border-[#008CFF]/30 flex items-center justify-center text-[#008CFF] text-xs font-bold shrink-0">
                    ✓
                  </span>
                  <span>Lighting angles, acoustics & power check</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#008CFF]/15 border border-[#008CFF]/30 flex items-center justify-center text-[#008CFF] text-xs font-bold shrink-0">
                    ✓
                  </span>
                  <span>Shot feasibility & production schedule planning</span>
                </div>
              </div>
            </div>

            {/* Right: The Vertical Rectangle Price Tile Card */}
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
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hyderabad, Factory, Studio..."
                        value={siteVisitData.location}
                        onChange={(e) =>
                          setSiteVisitData({ ...siteVisitData, location: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/15 text-white placeholder-white/25 text-xs sm:text-sm focus:outline-none focus:border-[#008CFF] transition-colors"
                      />
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
                          onChange={(e) =>
                            setSiteVisitData({ ...siteVisitData, date: e.target.value })
                          }
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
                          onChange={(e) =>
                            setSiteVisitData({ ...siteVisitData, name: e.target.value })
                          }
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
                        href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
                          'Hi BRANDSHOOTS, I would like to book a Site Visit (₹2,000) for my project. Please share available dates.'
                        )}`}
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

        {/* ============================================================== */}
        {/* 3. START A CONVERSATION + DIRECT STUDIO REACH (PLACED BELOW)    */}
        {/* ============================================================== */}
        <div
          ref={contactCompositionRef}
          className="pt-16 sm:pt-24 pb-16 sm:pb-24 border-b border-white/[0.08]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 items-start">
            {/* ============================================================ */}
            {/* LEFT: DIRECT STUDIO REACH                                    */}
            {/* ============================================================ */}
            <div className="lg:col-span-5 flex flex-col gap-10">
              <div>
                <span className="block font-mono text-xs tracking-[0.24em] uppercase text-[#008CFF] mb-2 font-semibold">
                  CONNECT DIRECTLY
                </span>
                <h2 className="font-editorial font-bold uppercase text-2xl sm:text-3xl md:text-4xl tracking-tight text-white mb-6">
                  DIRECT STUDIO REACH
                </h2>

                <div className="flex flex-col gap-8">
                  {/* WHATSAPP */}
                  <div>
                    <span className="block font-mono text-[11px] tracking-[0.2em] uppercase text-white/40 mb-1.5 flex items-center gap-1.5">
                      <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>WHATSAPP (DIRECT)</span>
                    </span>
                    <a
                      href={`https://wa.me/${WHATSAPP_PHONE}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-white hover:text-[#25D366] text-lg sm:text-xl md:text-2xl font-medium tracking-wide transition-colors"
                    >
                      {DISPLAY_PHONE}
                    </a>
                  </div>

                  {/* EMAIL */}
                  <div>
                    <span className="block font-mono text-[11px] tracking-[0.2em] uppercase text-white/40 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#008CFF]" />
                      <span>EMAIL</span>
                    </span>
                    <a
                      href={`mailto:${STUDIO_EMAIL}`}
                      className="inline-block text-white hover:text-[#008CFF] text-lg sm:text-xl md:text-2xl font-medium tracking-wide transition-colors"
                    >
                      {STUDIO_EMAIL}
                    </a>
                  </div>

                  {/* PHYSICAL ADDRESS */}
                  <div>
                    <span className="block font-mono text-[11px] tracking-[0.2em] uppercase text-white/40 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#008CFF]" />
                      <span>STUDIO ADDRESS</span>
                    </span>
                    <span className="block text-white text-sm sm:text-base font-medium leading-relaxed max-w-sm">
                      {STUDIO_FULL_ADDRESS}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* RIGHT: PROJECT INQUIRY FORM                                  */}
            {/* ============================================================ */}
            <div className="lg:col-span-7">
              <span className="block font-mono text-xs tracking-[0.24em] uppercase text-[#008CFF] mb-2 font-semibold">
                PROJECT INQUIRY
              </span>
              <h2 className="font-editorial font-bold uppercase text-2xl sm:text-3xl md:text-4xl tracking-tight text-white mb-6">
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
                        message: '',
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
                        onChange={(e) =>
                          setFormData({ ...formData, projectType: e.target.value })
                        }
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

                  {/* 5. Two Clear Actions: Primary + Secondary WhatsApp */}
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
                      href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
                        'Hi BRANDSHOOTS, I would like to discuss a project.'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs uppercase tracking-widest text-white/60 hover:text-[#25D366] transition-colors flex items-center justify-center gap-1.5 py-2"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
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
        {/* 4. GOOGLE MAPS EMBED IFRAME SECTION                            */}
        {/* ============================================================== */}
        <div
          ref={mapsSectionRef}
          id="studio-map"
          className="pt-16 sm:pt-24 pb-16 sm:pb-24 border-b border-white/[0.08]"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10">
            <div>
              <span className="block font-mono text-xs tracking-[0.24em] uppercase text-[#008CFF] mb-2 font-semibold">
                • LOCATION // PHYSICAL STUDIO RECCE
              </span>
              <h2 className="font-editorial font-bold uppercase text-3xl sm:text-4xl md:text-5xl tracking-tight text-white leading-tight">
                VISIT OUR PHYSICAL STUDIO.
              </h2>
              <p className="mt-3 text-white/70 text-sm sm:text-base font-light max-w-2xl leading-relaxed">
                {STUDIO_FULL_ADDRESS}
              </p>
            </div>

            {/* Direct Directions & Copy Address Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={GOOGLE_MAPS_SEARCH_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-full bg-[#008CFF] hover:bg-[#209CFF] text-white font-mono text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>GET DIRECTIONS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleCopyAddress}
                className="py-3 px-5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-mono text-xs uppercase tracking-wider font-semibold inline-flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                {copiedAddress ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#25D366]" />
                    <span className="text-[#25D366]">COPIED TO CLIPBOARD</span>
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

          {/* Responsive Google Maps Iframe Container */}
          <div className="w-full h-[380px] sm:h-[450px] md:h-[500px] rounded-2xl sm:rounded-3xl border border-white/15 bg-[#070A0F] overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            {/* Top ambient blue light rim */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#008CFF]/60 to-transparent z-10 pointer-events-none" />

            <iframe
              title="BrandShoots Studio Location Map"
              src={GOOGLE_MAPS_EMBED_URL}
              className="w-full h-full border-0 filter contrast-[1.05]"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* 5. BEAUTIFUL BIG SOCIAL MEDIA TILES (COLOR / HOVER B&W)        */}
        {/* ============================================================== */}
        <div ref={socialTilesRef} className="pt-16 sm:pt-24">
          <div className="mb-10 sm:mb-12 text-left">
            <span className="block font-mono text-xs tracking-[0.24em] uppercase text-[#008CFF] mb-2 font-semibold">
              • OFFICIAL CHANNELS // STAY CONNECTED
            </span>
            <h2 className="font-editorial font-bold uppercase text-3xl sm:text-4xl md:text-5xl tracking-tight text-white leading-tight">
              CONNECT ACROSS OUR NETWORK.
            </h2>
            <p className="mt-3 text-white/70 text-sm sm:text-base font-light max-w-2xl leading-relaxed">
              Explore our latest production reels, watch commercial drops, or reach our creative leads directly on WhatsApp.
            </p>
          </div>

          {/* 4 Big Tiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {SOCIAL_TILES.map((tile) => {
              const IconComponent = tile.icon;
              return (
                <a
                  key={tile.id}
                  href={tile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#070A0F] border border-white/12 hover:border-white/30 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.6)] hover:-translate-y-1.5 cursor-pointer"
                >
                  {/* Subtle top rim light in brand color */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: tile.brandColor }}
                  />

                  {/* Atmospheric brand background glow */}
                  <div
                    className="absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity"
                    style={{ backgroundColor: tile.brandColor }}
                  />

                  <div>
                    {/* Top Row: Icon + Arrow */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                      {/* Icon with Color -> Hover B&W effect */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:grayscale group-hover:contrast-125"
                        style={{
                          backgroundColor: `${tile.brandColor}20`,
                          color: tile.brandColor,
                          border: `1px solid ${tile.brandColor}40`,
                        }}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>

                      {/* External Link Arrow */}
                      <div className="w-8 h-8 rounded-full border border-white/10 group-hover:border-white/30 flex items-center justify-center text-white/50 group-hover:text-white transition-all duration-200">
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>

                    {/* Tag badge with Color -> Hover B&W */}
                    <div className="mb-3">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-wider uppercase font-semibold transition-all duration-300 group-hover:grayscale"
                        style={{
                          backgroundColor: `${tile.brandColor}15`,
                          color: tile.brandColor,
                          border: `1px solid ${tile.brandColor}30`,
                        }}
                      >
                        {tile.tag}
                      </span>
                    </div>

                    {/* Platform Handle */}
                    <h3 className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 group-hover:text-white transition-colors">
                      {tile.handle}
                    </h3>

                    {/* Editorial Description */}
                    <p className="text-xs text-white/60 font-light leading-relaxed">
                      {tile.description}
                    </p>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono tracking-wider uppercase text-white/70 group-hover:text-white transition-colors">
                    <span>{tile.cta}</span>
                    <span className="text-sm font-bold transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
