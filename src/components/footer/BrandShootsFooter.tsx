import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Instagram, Youtube, Facebook, MessageCircle, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCMSContent } from '../../lib/cms/useCMSContent';
import { INITIAL_CONTACT_PAGE, INITIAL_SITE_SETTINGS } from '../../lib/cms/seedData';

gsap.registerPlugin(ScrollTrigger);

const safeHttpsUrl = (value: string | undefined, fallback: string): string => {
  try {
    const url = new URL((value || '').trim());
    if (url.protocol === 'https:' && url.hostname && !url.username && !url.password) {
      return url.toString();
    }
  } catch {}
  return fallback;
};

const sanitizeWhatsAppNumber = (...values: Array<string | undefined>): string => {
  for (const value of values) {
    const digits = (value || '').replace(/\D/g, '');
    if (/^\d{7,15}$/.test(digits)) return digits;
  }
  return INITIAL_SITE_SETTINGS.whatsappPhone;
};

interface BrandShootsFooterProps {
  onOpenContact?: () => void;
}

export const BrandShootsFooter: React.FC<BrandShootsFooterProps> = () => {
  const footerRef = useRef<HTMLElement>(null);
  const { settings, contact } = useCMSContent();
  const fullAddress = (contact?.fullAddress || INITIAL_CONTACT_PAGE.fullAddress).replace(
    /\bCollage\b/gi,
    'College'
  );
  const instagramUrl = safeHttpsUrl(
    settings?.instagramUrl,
    safeHttpsUrl(contact?.instagramUrl, INITIAL_SITE_SETTINGS.instagramUrl)
  );
  const youtubeUrl = safeHttpsUrl(
    settings?.youtubeUrl,
    safeHttpsUrl(contact?.youtubeUrl, INITIAL_SITE_SETTINGS.youtubeUrl)
  );
  const facebookUrl = safeHttpsUrl(contact?.facebookUrl, INITIAL_CONTACT_PAGE.facebookUrl);
  const whatsappPhone = sanitizeWhatsAppNumber(
    settings?.whatsappPhone,
    contact?.whatsappPhone,
    INITIAL_SITE_SETTINGS.whatsappPhone
  );
  const whatsappUrl = `https://wa.me/${whatsappPhone}`;

  const scrollToTop = () => {
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 0.9 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleServicesClick = (event: React.MouseEvent) => {
    if (window.location.pathname !== '/') return;
    const section = document.getElementById('what-we-do');
    if (!section) return;
    event.preventDefault();
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(section, { duration: 0.9 });
    else section.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const footerEl = footerRef.current;
    if (!footerEl) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const context = gsap.context(() => {
      const blocks = footerEl.querySelectorAll('[data-footer-block]');
      gsap.fromTo(
        blocks,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: footerEl, start: 'top 88%', once: true },
        }
      );
    }, footerRef);
    return () => context.revert();
  }, []);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Portfolio', to: '/portfolio' },
    { label: 'Results', to: '/results' },
    { label: 'Packages', to: '/packages' },
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/#what-we-do', onClick: handleServicesClick },
    { label: 'Contact', to: '/contact', accent: true },
  ];

  const socialLinks = [
    { label: 'Instagram', href: instagramUrl, icon: Instagram },
    { label: 'YouTube', href: youtubeUrl, icon: Youtube },
    { label: 'Facebook', href: facebookUrl, icon: Facebook },
    { label: 'WhatsApp', href: whatsappUrl, icon: MessageCircle },
  ];

  return (
    <footer
      ref={footerRef}
      id="footer"
      className="relative w-full overflow-hidden border-t border-white/10 bg-[#05070B] text-white"
    >
      {/* Subtle Top Rim Glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(0, 140, 255, 0.45) 50%, transparent 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 h-56 w-[70vw] max-w-[900px] rounded-full opacity-25"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 140, 255, 0.22) 0%, transparent 72%)',
          filter: 'blur(70px)',
        }}
      />

      <div className="relative mx-auto w-full max-w-[1380px] px-5 pt-16 pb-10 sm:px-8 sm:pt-20 lg:px-12 lg:pt-24">
        {/* Main Structured Agency Grid */}
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Brand Identity Column */}
          <div data-footer-block className="lg:col-span-5 flex flex-col items-start">
            <Link
              to="/"
              onClick={() => window.location.pathname === '/' && scrollToTop()}
              className="inline-block transition-opacity duration-200 hover:opacity-90"
            >
              <img
                src="/Logo Official.svg"
                alt="BrandShoots Official Logo"
                width={1600}
                height={365}
                loading="lazy"
                decoding="async"
                className="h-14 w-auto sm:h-16"
              />
            </Link>

            <p className="mt-4 font-mono text-xs sm:text-sm font-semibold tracking-[0.28em] text-white/75 uppercase">
              Create. <span className="text-[#008CFF]">Shoot.</span> Grow.
            </p>

            <p className="mt-5 max-w-md font-sans text-sm sm:text-base font-normal leading-relaxed text-white/65">
              A high-end creative agency engineering commercial films, visual architecture, and high-retention content systems for ambitious brands.
            </p>
          </div>

          {/* Navigation Column */}
          <div data-footer-block className="lg:col-span-3">
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#008CFF]">
              Navigation
            </h2>
            <nav aria-label="Footer navigation" className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3.5 sm:grid-cols-1">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={item.onClick}
                  className={`group inline-flex items-center gap-2 font-mono text-xs sm:text-[13px] font-semibold uppercase tracking-[0.18em] transition-all duration-200 hover:translate-x-1 ${
                    item.accent
                      ? 'text-[#008CFF] hover:text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 text-[#008CFF]" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect & Studio Address Column */}
          <div data-footer-block className="md:col-span-2 lg:col-span-4 flex flex-col justify-between gap-8">
            <div>
              <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#008CFF]">
                Connect
              </h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm font-sans font-medium text-white/75 transition-all duration-200 hover:border-[#008CFF]/45 hover:bg-[#008CFF]/[0.08] hover:text-white"
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-[#008CFF] transition-transform duration-200 group-hover:scale-110" />
                      <span>{label}</span>
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/35 transition-all duration-200 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
              <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                <MapPin className="h-3.5 w-3.5 text-[#008CFF]" />
                <span>Studio</span>
              </div>
              <address className="mt-2.5 font-sans text-sm font-normal not-italic leading-relaxed text-white/75 [overflow-wrap:anywhere]">
                {fullAddress}
              </address>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar (with clean clearance for bottom-right floating controls) */}
        <div
          data-footer-block
          className="flex flex-col gap-3 pt-7 pb-14 sm:flex-row sm:items-center sm:justify-between md:pb-10 lg:pr-44 font-mono text-[11px] tracking-[0.14em] text-white/50 uppercase"
        >
          <span>© {new Date().getFullYear()} BrandShoots. All Rights Reserved.</span>
          <span className="text-white/40">Commercial Film &amp; Digital Growth Studio</span>
        </div>
      </div>
    </footer>
  );
};

export default BrandShootsFooter;
