import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCMSContent } from '../../lib/cms/useCMSContent';
import { INITIAL_CONTACT_PAGE, INITIAL_SITE_SETTINGS } from '../../lib/cms/seedData';

const InstagramLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <linearGradient id="footerIgGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="25%" stopColor="#e6683c" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="75%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <path
      fill="url(#footerIgGradient)"
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
    />
  </svg>
);

const YouTubeLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <linearGradient id="footerYtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF2E2E" />
        <stop offset="100%" stopColor="#C40000" />
      </linearGradient>
    </defs>
    <path
      fill="url(#footerYtGradient)"
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
    />
    <path fill="#FFFFFF" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const FacebookLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <linearGradient id="footerFbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B9BFF" />
        <stop offset="100%" stopColor="#1464D2" />
      </linearGradient>
    </defs>
    <path
      fill="url(#footerFbGradient)"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </svg>
);

const WhatsAppLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <linearGradient id="footerWaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3EE87A" />
        <stop offset="100%" stopColor="#128C7E" />
      </linearGradient>
    </defs>
    <path
      fill="url(#footerWaGradient)"
      d="M20.52 3.48A11.82 11.82 0 0 0 12.1 0C5.56 0 .24 5.32.24 11.86c0 2.09.55 4.13 1.59 5.93L.14 24l6.36-1.67a11.86 11.86 0 0 0 5.6 1.42h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.14-3.45-8.41Zm-8.42 18.27h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.78.99 1.01-3.68-.23-.38a9.85 9.85 0 0 1-1.51-5.23C2.19 6.43 6.63 2 12.1 2c2.65 0 5.14 1.03 7.01 2.9A9.84 9.84 0 0 1 22 11.89c0 5.44-4.43 9.86-9.9 9.86Zm5.41-7.39c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z"
    />
  </svg>
);

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
    {
      label: 'Instagram',
      href: instagramUrl,
      icon: InstagramLogo,
      cardClass:
        'bg-gradient-to-br from-[#f09433]/[0.08] via-[#dc2743]/[0.05] to-[#bc1888]/[0.08] border-[#dc2743]/20 hover:border-[#E1306C]/50 hover:from-[#f09433]/[0.15] hover:via-[#dc2743]/[0.1] hover:to-[#bc1888]/[0.15]',
    },
    {
      label: 'YouTube',
      href: youtubeUrl,
      icon: YouTubeLogo,
      cardClass:
        'bg-gradient-to-br from-[#FF2E2E]/[0.08] via-[#C40000]/[0.04] to-white/[0.02] border-[#FF2E2E]/20 hover:border-[#FF2E2E]/50 hover:from-[#FF2E2E]/[0.15] hover:via-[#C40000]/[0.09] hover:to-white/[0.04]',
    },
    {
      label: 'Facebook',
      href: facebookUrl,
      icon: FacebookLogo,
      cardClass:
        'bg-gradient-to-br from-[#3B9BFF]/[0.08] via-[#1464D2]/[0.05] to-white/[0.02] border-[#1877F2]/20 hover:border-[#3B9BFF]/50 hover:from-[#3B9BFF]/[0.15] hover:via-[#1464D2]/[0.1] hover:to-white/[0.04]',
    },
    {
      label: 'WhatsApp',
      href: whatsappUrl,
      icon: WhatsAppLogo,
      cardClass:
        'bg-gradient-to-br from-[#3EE87A]/[0.08] via-[#128C7E]/[0.05] to-white/[0.02] border-[#25D366]/20 hover:border-[#25D366]/50 hover:from-[#3EE87A]/[0.15] hover:via-[#128C7E]/[0.1] hover:to-white/[0.04]',
    },
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
                {socialLinks.map(({ label, href, icon: Icon, cardClass }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm font-sans font-medium text-white/85 transition-all duration-200 hover:text-white ${cardClass}`}
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <Icon className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110" />
                      <span>{label}</span>
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/40 transition-all duration-200 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
