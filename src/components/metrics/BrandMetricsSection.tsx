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
  {
    id: 'meta-ads',
    value: 20,
    suffix: 'L+',
    label: 'Meta Ads',
    sublabel: 'Ad Spend & Scale',
  },
  {
    id: 'brands-experience',
    value: 30,
    suffix: '+',
    label: 'Brands Experience',
    sublabel: 'Industry Leaders Scaled',
  },
  {
    id: 'views',
    value: 100,
    suffix: 'M+',
    label: 'Organic Views',
    sublabel: 'High-Retention Reach',
  },
  {
    id: 'followers',
    value: 500,
    suffix: 'K+',
    label: 'Followers',
    sublabel: 'Audience Community Built',
  },
];

interface MetricCardProps {
  metric: MetricItem;
  index: number;
  isTriggered: boolean;
  compact?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  index,
  isTriggered,
  compact = false,
}) => {
  const numRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isTriggered || hasAnimated.current) return;
    hasAnimated.current = true;

    const el = numRef.current;
    if (!el) return;

    const counterObj = { val: 0 };

    // GSAP auto-counter with smooth power2 deceleration
    gsap.to(counterObj, {
      val: metric.value,
      duration: 2.2,
      delay: 0.15 + index * 0.12,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = Math.round(counterObj.val).toString();
      },
    });

    // Staggered card entrance with depth scaling
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 28, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          delay: index * 0.1,
          ease: 'power3.out',
        }
      );
    }
  }, [isTriggered, metric.value, index]);

  return (
    <div
      ref={cardRef}
      className={`relative group rounded-xl sm:rounded-2xl border border-white/10 bg-[#080B11]/80 backdrop-blur-md transition-all duration-300 hover:border-[#008CFF]/50 hover:bg-[#0B101A]/90 hover:shadow-[0_8px_30px_rgba(0,140,255,0.18)] overflow-hidden flex flex-col items-center justify-center text-center ${
        compact
          ? 'py-3.5 px-3 sm:py-4 sm:px-4'
          : 'py-6 px-4 sm:py-8 sm:px-6 shadow-[0_12px_40px_rgba(0,0,0,0.8)]'
      }`}
    >
      {/* Top subtle electric-blue specular accent */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#008CFF]/60 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

      {/* Number with vibrant cyan suffix */}
      <div className="flex items-baseline justify-center">
        <span
          ref={numRef}
          className={`font-sans font-black tracking-[-0.035em] text-white leading-none ${
            compact
              ? 'text-2xl xs:text-3xl sm:text-4xl md:text-5xl'
              : 'text-3xl xs:text-4xl sm:text-5xl lg:text-6xl'
          }`}
        >
          0
        </span>
        <span
          className={`font-sans font-black text-[#008CFF] drop-shadow-[0_0_14px_rgba(0,140,255,0.75)] leading-none ml-0.5 sm:ml-1 ${
            compact
              ? 'text-lg xs:text-xl sm:text-2xl md:text-3xl'
              : 'text-2xl xs:text-3xl sm:text-4xl lg:text-5xl'
          }`}
        >
          {metric.suffix}
        </span>
      </div>

      {/* Primary Label */}
      <div
        className={`font-mono uppercase font-bold text-white/90 tracking-[0.2em] sm:tracking-[0.24em] mt-2 sm:mt-2.5 ${
          compact
            ? 'text-[10px] sm:text-[11px] md:text-xs'
            : 'text-xs sm:text-[13px] md:text-sm'
        }`}
      >
        {metric.label}
      </div>

      {/* Secondary Description */}
      <div
        className={`font-sans text-white/45 tracking-wider truncate mt-0.5 ${
          compact ? 'text-[9px] sm:text-[10px]' : 'text-[11px] sm:text-xs'
        }`}
      >
        {metric.sublabel}
      </div>
    </div>
  );
};

export const BrandMetricsGrid: React.FC<{
  isTriggered?: boolean;
  compact?: boolean;
  className?: string;
}> = ({ isTriggered = true, compact = false, className = '' }) => {
  return (
    <div
      className={`grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 w-full ${className}`}
    >
      {BRAND_METRICS.map((metric, idx) => (
        <MetricCard
          key={metric.id}
          metric={metric}
          index={idx}
          isTriggered={isTriggered}
          compact={compact}
        />
      ))}
    </div>
  );
};

export const BrandMetricsSection: React.FC<{
  className?: string;
  id?: string;
}> = ({ className = '', id = 'metrics' }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isTriggered, setIsTriggered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 82%',
      onEnter: () => setIsTriggered(true),
      once: true,
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative w-full py-20 sm:py-28 md:py-32 bg-[#04060A] text-white overflow-hidden select-none ${className}`}
    >
      {/* Atmospheric Background Electric Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1200px] h-[500px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(0, 140, 255, 0.12) 0%, rgba(0, 60, 160, 0.03) 50%, transparent 75%)',
            filter: 'blur(90px)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Section Eyebrow Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-[10px] sm:text-xs font-mono tracking-[0.24em] text-[#008CFF] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
            <span>PROVEN TRACK RECORD</span>
          </div>

          <h2 className="font-sans font-black uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[-0.035em] text-white">
            DATA &amp; <span className="text-[#008CFF]">SCALE</span> THAT MATTERS.
          </h2>
          <p className="mt-3 sm:mt-4 max-w-lg mx-auto font-sans text-xs sm:text-sm md:text-base text-white/60 leading-relaxed">
            From high-stakes commercial films to algorithmic viral retention systems, our productions translate directly into measurable audience growth and ROI.
          </p>
        </div>

        {/* 4 Metrics Grid */}
        <BrandMetricsGrid
          isTriggered={isTriggered}
          compact={false}
          className="max-w-5xl"
        />
      </div>
    </section>
  );
};

export default BrandMetricsSection;
