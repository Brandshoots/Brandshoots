import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  FileText,
  Lightbulb,
  Scissors,
} from 'lucide-react';
import { MainNavbar } from '../components/navbar/MainNavbar';
import { BrandShootsFooter } from '../components/footer/BrandShootsFooter';
import {
  MONTHLY_PACKAGES,
  PACKAGE_ADD_ONS,
  PACKAGE_COMPARISON_ROWS,
  PACKAGE_FINE_PRINT,
  PACKAGE_WORKFLOW,
  MonthlyPackage,
} from '../data/packagesData';
import { useCMSContent } from '../lib/cms/useCMSContent';
import { INITIAL_CONTACT_PAGE, INITIAL_SITE_SETTINGS } from '../lib/cms/seedData';

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

const workflowIcons = [Lightbulb, FileText, Camera, Scissors, CalendarDays, BarChart3];

function ComparisonValue({ value }: { value: string }) {
  if (value === '\u2713') {
    return <span className="font-semibold text-[#1497F5]" aria-label="Included">{'\u2713'}</span>;
  }
  if (value === '\u2014') {
    return <span className="text-white/25" aria-label="Not included">{'\u2014'}</span>;
  }
  return <span>{value}</span>;
}

function PackageCard({ plan, whatsappPhone }: { plan: MonthlyPackage; whatsappPhone: string }) {
  return (
    <article
      id={plan.id}
      data-package-card
      className={`scroll-mt-28 flex h-full flex-col border bg-[#0b0e13] p-6 sm:p-8 lg:p-9 ${
        plan.id === 'growth'
          ? 'border-[#008CFF]/70 border-t-2'
          : 'border-white/15'
      }`}
    >
      <div className="flex min-h-6 items-start justify-between gap-4">
        <h2 className="text-base sm:text-lg font-sans font-bold uppercase tracking-wider text-white">{plan.name}</h2>
        {plan.label && (
          <span className={`text-xs font-mono uppercase tracking-[0.18em] font-semibold ${plan.id === 'growth' ? 'text-[#008CFF]' : 'text-white/60'}`}>
            {plan.label}
          </span>
        )}
      </div>

      <div className="mt-8 flex items-end gap-2">
        <span className="text-[clamp(2.5rem,4.2vw,3.75rem)] font-sans font-black leading-none tracking-tight text-white">
          {plan.price}
        </span>
        <span className="pb-1 text-base font-sans text-white/60">/ month</span>
      </div>
      <p className="mt-5 min-h-[56px] text-base font-sans leading-relaxed text-white/85">{plan.description}</p>

      <ul className="mt-8 mb-8 space-y-4 border-t border-white/10 pt-7">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-base font-sans leading-relaxed text-white/90">
            <Check className="mt-1 h-4 w-4 shrink-0 text-[#008CFF]" strokeWidth={2.2} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href={packageWhatsAppUrl(plan.whatsappUrl, whatsappPhone)}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-auto inline-flex min-h-12 items-center justify-between gap-4 border px-5 py-3.5 text-sm font-mono uppercase tracking-[0.18em] font-semibold transition-colors duration-200 ${
          plan.id === 'growth'
            ? 'border-[#008CFF] bg-[#008CFF] text-white hover:bg-white hover:text-[#08090C]'
            : 'border-white/35 text-white hover:border-[#008CFF] hover:text-[#008CFF]'
        }`}
      >
        GET STARTED <ArrowUpRight className="h-4 w-4" />
      </a>
    </article>
  );
}

export const PackagesPage: React.FC = () => {
  const { settings, contact } = useCMSContent();
  const whatsappPhone = sanitizeWhatsAppNumber(
    settings?.whatsappPhone,
    contact?.whatsappPhone,
    INITIAL_SITE_SETTINGS.whatsappPhone
  );
  const siteVisitPrice =
    !contact?.siteVisitPrice || contact.siteVisitPrice.includes('999')
      ? INITIAL_CONTACT_PAGE.siteVisitPrice
      : contact.siteVisitPrice;
  const pageRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLElement>(null);
  const workflowRef = useRef<HTMLElement>(null);
  const addOnsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (value) => Math.min(1, 1.001 - Math.pow(2, -10 * value)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.1,
    });
    lenis.on('scroll', ScrollTrigger.update);
    (window as any).__lenis = lenis;

    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(500, 33);

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    const hashTimer = window.setTimeout(() => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) lenis.scrollTo(target, { offset: -96, duration: 0.9 });
    }, 350);

    return () => {
      window.clearTimeout(refreshTimer);
      window.clearTimeout(hashTimer);
      delete (window as any).__lenis;
      gsap.ticker.remove(ticker);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = gsap.context(() => {
      if (introRef.current) {
        gsap.fromTo(
          introRef.current.children,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
        );
      }

      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 42 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.11,
            ease: 'power3.out',
            scrollTrigger: { trigger: cardsRef.current, start: 'top 88%', once: true },
          }
        );
      }

      [comparisonRef.current, addOnsRef.current].forEach((section) => {
        if (!section) return;
        gsap.fromTo(
          section,
          { opacity: 0, y: 34 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 84%', once: true },
          }
        );
      });

      if (workflowRef.current) {
        const steps = workflowRef.current.querySelectorAll('[data-workflow-step]');
        gsap.fromTo(
          steps,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: workflowRef.current, start: 'top 82%', once: true },
          }
        );
      }
    }, pageRef);

    return () => context.revert();
  }, []);

  return (
    <main ref={pageRef} className="min-h-screen overflow-x-hidden bg-[#08090C] text-white selection:bg-[#1497F5] selection:text-white">
      <MainNavbar />

      <header className="relative overflow-hidden px-5 pb-20 pt-36 sm:px-8 sm:pb-24 sm:pt-44 lg:px-12 lg:pb-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[80vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(0,140,255,0.15),transparent_68%)]" />
        <div ref={introRef} className="relative mx-auto w-full max-w-[1380px]">
          <p className="font-mono text-sm uppercase tracking-[0.24em] font-semibold text-[#008CFF]">MONTHLY PACKAGES</p>
          <h1 className="mt-5 max-w-5xl text-[clamp(2.8rem,6.5vw,6rem)] font-sans font-black uppercase leading-[0.95] tracking-[-0.025em] text-white">
            Monthly Content Packages
          </h1>
          <h2 className="mt-6 max-w-3xl text-xl sm:text-2xl font-sans font-medium text-[#008CFF] tracking-wide">
            Content that builds a brand, every month.
          </h2>
          <p className="mt-4 max-w-2xl text-base sm:text-lg font-sans text-white/85 leading-relaxed">
            Complete monthly content for Instagram, Facebook and YouTube: planned, shot, edited and posted by our team.
          </p>
        </div>
      </header>

      <section aria-label="Monthly package pricing" className="px-5 pb-24 sm:px-8 sm:pb-32 lg:px-12">
        <div ref={cardsRef} className="mx-auto grid w-full max-w-[1380px] grid-cols-1 gap-6 lg:grid-cols-3">
          {MONTHLY_PACKAGES.map((plan) => <PackageCard key={plan.id} plan={plan} whatsappPhone={whatsappPhone} />)}
        </div>
      </section>

      <section ref={comparisonRef} id="comparison" className="border-y border-white/10 bg-[#0a0d12] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto w-full max-w-[1380px]">
          <div className="mb-12 max-w-2xl">
            <p className="font-mono text-sm uppercase tracking-[0.24em] font-semibold text-[#008CFF]">COMPARE</p>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-sans font-black uppercase tracking-[-0.025em] text-white">Choose the right monthly plan.</h2>
          </div>

          <div className="hidden overflow-hidden border border-white/15 md:block">
            <table className="w-full table-fixed border-collapse text-left">
              <caption className="sr-only">Comparison of Starter, Growth and Premium monthly packages</caption>
              <thead className="bg-white/[0.035]">
                <tr>
                  <th scope="col" className="w-[31%] px-6 py-5 text-sm font-mono uppercase tracking-wider text-white/65">Feature</th>
                  {MONTHLY_PACKAGES.map((plan) => (
                    <th key={plan.id} scope="col" className={`px-5 py-5 text-sm font-mono uppercase tracking-wider ${plan.id === 'growth' ? 'text-[#008CFF] font-bold' : 'text-white'}`}>{plan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PACKAGE_COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="border-t border-white/10">
                    <th scope="row" className="px-6 py-4 text-base font-sans font-normal leading-6 text-white/90">{row.feature}</th>
                    <td className="px-5 py-4 text-base font-sans leading-6 text-white/75"><ComparisonValue value={row.starter} /></td>
                    <td className="bg-[#008CFF]/[0.04] px-5 py-4 text-base font-sans leading-6 text-white/90"><ComparisonValue value={row.growth} /></td>
                    <td className="px-5 py-4 text-base font-sans leading-6 text-white/75"><ComparisonValue value={row.premium} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {MONTHLY_PACKAGES.map((plan) => {
              const key = plan.id as 'starter' | 'growth' | 'premium';
              return (
                <details key={plan.id} open={plan.id === 'growth'} className="group border border-white/15 bg-[#08090C]">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-sans font-bold tracking-wide [&::-webkit-details-marker]:hidden">
                    <span className={plan.id === 'growth' ? 'text-[#008CFF]' : 'text-white'}>{plan.name}</span>
                    <ChevronDown className="h-5 w-5 text-white/55 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-white/10 px-5">
                    {PACKAGE_COMPARISON_ROWS.map((row) => (
                      <div key={row.feature} className="flex items-start justify-between gap-5 border-b border-white/10 py-4 last:border-b-0">
                        <span className="max-w-[64%] text-base font-sans leading-6 text-white/75">{row.feature}</span>
                        <span className="max-w-[36%] text-right text-base font-sans leading-6 text-white/95"><ComparisonValue value={row[key]} /></span>
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </section>

      <section ref={workflowRef} id="how-it-works" className="px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto w-full max-w-[1380px]">
          <div className="mb-14 max-w-2xl">
            <p className="font-mono text-sm uppercase tracking-[0.24em] font-semibold text-[#008CFF]">HOW IT WORKS</p>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-sans font-black uppercase tracking-[-0.025em] text-white">One team. One monthly rhythm.</h2>
          </div>
          <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-6">
            {PACKAGE_WORKFLOW.map((step, index) => {
              const Icon = workflowIcons[index];
              return (
                <article key={step.number} data-workflow-step className="border-t border-white/20 pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <Icon className="h-5 w-5 text-[#008CFF]" strokeWidth={1.75} />
                    <span className="font-mono text-sm tracking-wider text-[#008CFF] font-semibold">{step.number}</span>
                  </div>
                  <h3 className="mt-6 text-sm sm:text-base font-sans font-bold uppercase tracking-wider text-white">{step.title}</h3>
                  <p className="mt-2.5 text-base font-sans leading-relaxed text-white/80">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section ref={addOnsRef} id="add-ons" className="border-y border-white/10 bg-[#0a0d12] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto grid w-full max-w-[1380px] grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <p className="font-mono text-sm uppercase tracking-[0.24em] font-semibold text-[#008CFF]">ADD-ONS</p>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-sans font-black uppercase tracking-[-0.025em] text-white">NEED SOMETHING EXTRA?</h2>
            <p className="mt-4 text-lg font-sans leading-relaxed text-white/85">Anything outside your plan is quoted separately.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/contact#site-visit" className="inline-flex min-h-12 items-center gap-2 bg-[#008CFF] px-6 py-3 text-sm font-mono uppercase tracking-[0.18em] font-bold text-white transition-colors hover:bg-white hover:text-[#08090C]">
                BOOK A SITE VISIT — {siteVisitPrice}
              </Link>
              <a href={`https://wa.me/${whatsappPhone}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center border border-white/35 px-6 py-3 text-sm font-mono uppercase tracking-[0.18em] font-bold text-white transition-colors hover:border-white hover:bg-white hover:text-[#08090C]">
                CHAT ON WHATSAPP
              </a>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:col-span-7">
            {PACKAGE_ADD_ONS.map((item) => (
              <li key={item} className="border-t border-white/15 py-5 text-base font-sans leading-relaxed text-white/90">{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Package terms" className="px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto w-full max-w-[1380px]">
          <h2 className="text-sm font-mono uppercase tracking-[0.24em] font-semibold text-white/75">PACKAGE NOTES</h2>
          <ul className="mt-6 grid grid-cols-1 gap-x-12 gap-y-4 lg:grid-cols-2">
            {PACKAGE_FINE_PRINT.map((item) => (
              <li key={item} className="flex gap-3 text-sm sm:text-base font-sans leading-relaxed text-white/80">
                <span aria-hidden="true" className="text-[#008CFF]">{'\u2022'}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BrandShootsFooter />
    </main>
  );
};

export default PackagesPage;
