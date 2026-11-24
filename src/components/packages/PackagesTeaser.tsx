import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MONTHLY_PACKAGES } from '../../data/packagesData';
import { useCMSContent } from '../../lib/cms/useCMSContent';
import { INITIAL_SITE_SETTINGS } from '../../lib/cms/seedData';

gsap.registerPlugin(ScrollTrigger);

const sanitizeWhatsAppNumber = (...values: Array<string | undefined>): string => {
  for (const value of values) {
    const digits = (value || '').replace(/\D/g, '');
    if (/^\d{7,15}$/.test(digits)) return digits;
  }
  return INITIAL_SITE_SETTINGS.whatsappPhone;
};

const packageWhatsAppUrl = (configuredUrl: string, phone: string): string => {
  try {
    const message = new URL(configuredUrl).searchParams.get('text') || 'Hi BrandShoots, I am interested in a monthly package.';
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  } catch {
    return `https://wa.me/${phone}`;
  }
};

export const PackagesTeaser: React.FC = () => {
  const { settings, contact } = useCMSContent();
  const whatsappPhone = sanitizeWhatsAppNumber(
    settings?.whatsappPhone,
    contact?.whatsappPhone,
    INITIAL_SITE_SETTINGS.whatsappPhone
  );
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current.children,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.09,
            ease: 'power2.out',
            scrollTrigger: { trigger: headingRef.current, start: 'top 84%', once: true },
          }
        );
      }

      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: cardsRef.current, start: 'top 84%', once: true },
          }
        );
      }
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} id="packages" className="w-full border-b border-white/10 bg-[#08090C] py-24 text-white sm:py-32">
      <div className="mx-auto w-full max-w-[1380px] px-5 sm:px-8 lg:px-12">
        <div ref={headingRef} className="mb-12 flex flex-col gap-7 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] font-semibold text-[#008CFF]">MONTHLY PACKAGES</p>
            <h2 className="mt-4 max-w-2xl text-3xl sm:text-4xl lg:text-5xl font-sans font-black uppercase tracking-[-0.025em] text-white">
              Content that builds a brand, every month.
            </h2>
          </div>
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-[0.2em] font-bold text-white transition-colors hover:text-[#008CFF] sm:self-auto"
          >
            VIEW ALL PACKAGES <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {MONTHLY_PACKAGES.map((plan) => (
            <article
              key={plan.id}
              className={`flex min-h-[440px] flex-col border border-white/15 bg-[#0b0e13] p-6 sm:p-8 ${plan.id === 'growth' ? 'border-t-2 border-t-[#008CFF]' : ''}`}
            >
              <div className="flex min-h-6 items-start justify-between gap-4">
                <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-white">{plan.name}</h3>
                {plan.label && <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-semibold text-[#008CFF]">{plan.label}</span>}
              </div>

              <div className="mt-7 flex items-end gap-2">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black tracking-tight text-white">{plan.price}</span>
                <span className="pb-1 text-sm font-sans font-light text-white/50">/ month</span>
              </div>
              <p className="mt-4 min-h-[48px] text-sm font-sans font-light leading-relaxed text-white/75">{plan.description}</p>

              <ul className="mt-8 space-y-3.5 text-sm font-sans leading-relaxed text-white/80">
                {plan.features.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#008CFF]" strokeWidth={2} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-9">
                <Link to={`/packages#${plan.id}`} className="font-mono text-xs uppercase tracking-[0.16em] font-semibold text-white transition-colors hover:text-[#008CFF]">
                  VIEW PACKAGE
                </Link>
                <a href={packageWhatsAppUrl(plan.whatsappUrl, whatsappPhone)} target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-[0.16em] font-bold text-[#008CFF] transition-colors hover:text-white">
                  GET STARTED
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesTeaser;
