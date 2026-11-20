import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MONTHLY_PACKAGES } from '../../data/packagesData';

gsap.registerPlugin(ScrollTrigger);

export const PackagesTeaser: React.FC = () => {
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
            <p className="text-[11px] font-medium tracking-[0.16em] text-[#1497F5]">MONTHLY PACKAGES</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
              Content that builds a brand, every month.
            </h2>
          </div>
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 self-start text-xs font-semibold tracking-[0.12em] text-white transition-colors hover:text-[#1497F5] sm:self-auto"
          >
            VIEW ALL PACKAGES <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {MONTHLY_PACKAGES.map((plan) => (
            <article
              key={plan.id}
              className={`flex min-h-[440px] flex-col border border-white/15 bg-[#0b0e13] p-6 sm:p-8 ${plan.id === 'growth' ? 'border-t-2 border-t-[#1497F5]' : ''}`}
            >
              <div className="flex min-h-6 items-start justify-between gap-4">
                <h3 className="text-sm font-semibold tracking-[0.13em] text-white">{plan.name}</h3>
                {plan.label && <span className="text-[10px] font-medium tracking-[0.12em] text-[#1497F5]">{plan.label}</span>}
              </div>

              <div className="mt-7 flex items-end gap-2">
                <span className="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">{plan.price}</span>
                <span className="pb-1 text-sm text-white/45">/ month</span>
              </div>
              <p className="mt-5 min-h-[48px] text-[15px] leading-6 text-white/60">{plan.description}</p>

              <ul className="mt-8 space-y-3.5 text-sm text-white/70">
                {plan.features.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1497F5]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-9">
                <Link to={`/packages#${plan.id}`} className="text-xs font-semibold tracking-[0.11em] text-white transition-colors hover:text-[#1497F5]">
                  VIEW PACKAGE
                </Link>
                <a href={plan.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold tracking-[0.11em] text-[#1497F5] transition-colors hover:text-white">
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
