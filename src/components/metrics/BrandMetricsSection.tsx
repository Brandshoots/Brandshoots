import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface MetricItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
}

export const BRAND_METRICS: MetricItem[] = [
  { id: 'meta-ads', value: 20, suffix: 'L+', label: 'Meta Ads', sublabel: 'Ad Spend & Scale' },
  { id: 'brands-experience', value: 30, suffix: '+', label: 'Brands Experience', sublabel: 'Industry Leaders Scaled' },
  { id: 'views', value: 100, suffix: 'M+', label: 'Organic Views', sublabel: 'High-Retention Reach' },
  { id: 'followers', value: 500, suffix: 'K+', label: 'Followers', sublabel: 'Audience Community Built' },
];

interface MetricCardProps {
  metric: MetricItem;
  index: number;
  isTriggered: boolean;
  compact?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, index, isTriggered, compact = false }) => {
  const numberRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isTriggered || !numberRef.current) return;
    const counter = { value: 0 };
    const animation = gsap.to(counter, {
      value: metric.value,
      duration: 1.1,
      delay: index * 0.08,
      ease: 'power2.out',
      onUpdate: () => {
        if (numberRef.current) numberRef.current.textContent = Math.round(counter.value).toString();
      },
    });
    let cardAnimation: gsap.core.Tween | undefined;
    if (cardRef.current) {
      cardAnimation = gsap.fromTo(cardRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.65, delay: index * 0.08, ease: 'power2.out' });
    }
    return () => {
      animation.kill();
      cardAnimation?.kill();
    };
  }, [index, isTriggered, metric.value]);

  return (
    <article ref={cardRef} className={`border-t border-white/25 ${compact ? 'py-5' : 'py-7 sm:py-9'}`}>
      <div className="flex items-baseline gap-1">
        <span ref={numberRef} className="text-5xl sm:text-6xl lg:text-7xl font-sans font-black leading-none tracking-tight text-white">0</span>
        <span className="text-2xl sm:text-3xl font-sans font-black leading-none text-[#008CFF]">{metric.suffix}</span>
      </div>
      <h3 className="mt-4 font-mono text-xs uppercase tracking-[0.2em] font-semibold text-white/90">{metric.label}</h3>
      <p className="mt-1.5 font-sans font-light text-sm text-white/60 leading-relaxed">{metric.sublabel}</p>
    </article>
  );
};

export const BrandMetricsGrid: React.FC<{
  isTriggered?: boolean;
  compact?: boolean;
  className?: string;
}> = ({ isTriggered = true, compact = false, className = '' }) => (
  <div className={`grid w-full grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 lg:gap-x-10 ${className}`}>
    {BRAND_METRICS.map((metric, index) => (
      <MetricCard key={metric.id} metric={metric} index={index} isTriggered={isTriggered} compact={compact} />
    ))}
  </div>
);

export const BrandMetricsSection: React.FC<{ className?: string; id?: string }> = ({ className = '', id = 'metrics' }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isTriggered, setIsTriggered] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 82%',
      once: true,
      onEnter: () => setIsTriggered(true),
    });
    return () => trigger.kill();
  }, []);

  return (
    <section id={id} ref={sectionRef} aria-label="PROVEN TRACK RECORD" className={`w-full border-b border-white/10 bg-[#08090C] py-24 text-white sm:py-32 ${className}`}>
      <div className="mx-auto w-full max-w-[1380px] px-5 sm:px-8 lg:px-12">
        <div className="mb-14 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-black uppercase leading-[0.92] tracking-[-0.025em]">
            DATA &amp; <span className="text-[#008CFF]">SCALE</span> THAT MATTERS.
          </h2>
          <p className="max-w-xl font-sans font-light text-sm sm:text-base text-white/75 leading-relaxed lg:justify-self-end">
            From high-stakes commercial films to algorithmic viral retention systems, our productions translate directly into measurable audience growth and ROI.
          </p>
        </div>
        <BrandMetricsGrid isTriggered={isTriggered} compact={false} />
      </div>
    </section>
  );
};

export default BrandMetricsSection;
