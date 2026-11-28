import React from 'react';
import { ArrowRight, ExternalLink, Play } from 'lucide-react';
import { CMSResult } from '../../types/cms';
import { formatDurationMonths, formatMetricValue } from '../../lib/results/format';
import { parseResultVideoUrl } from '../../lib/results/video';

interface ResultCardProps {
  result: CMSResult;
  onViewCaseStudy: (result: CMSResult) => void;
  onPlayVideo?: (result: CMSResult) => void;
  layout?: 'card' | 'spotlight';
}

interface MetricComparisonProps {
  label: string;
  before: number | null;
  after: number | null;
}

const formatGrowthBadge = (before: number | null, after: number | null): string | null => {
  if (before === null || after === null || before <= 0 || after <= before) return null;
  const multiplier = after / before;
  if (multiplier >= 2) {
    return `${multiplier >= 10 ? multiplier.toFixed(0) : multiplier.toFixed(1)}x`;
  }
  const pct = Math.round(((after - before) / before) * 100);
  return pct > 0 ? `+${pct}%` : null;
};

const MetricComparison: React.FC<MetricComparisonProps> = ({ label, before, after }) => {
  const badge = formatGrowthBadge(before, after);
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
          {label}
        </span>
        {badge && (
          <span className="rounded-full bg-[#008CFF]/15 px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-[0.12em] text-[#38A8FF]">
            {badge} GROWTH
          </span>
        )}
      </div>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <div className="min-w-0">
          <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
            Before
          </span>
          <strong className="mt-0.5 block truncate text-xl font-black tracking-[-0.03em] text-white/75 sm:text-2xl">
            {formatMetricValue(before)}
          </strong>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-[#008CFF]" aria-hidden="true" />
        <div className="min-w-0 text-right">
          <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#008CFF]">
            After
          </span>
          <strong className="mt-0.5 block truncate text-xl font-black tracking-[-0.03em] text-white sm:text-2xl">
            {formatMetricValue(after)}
          </strong>
        </div>
      </div>
    </div>
  );
};

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  onViewCaseStudy,
  onPlayVideo,
  layout = 'card',
}) => {
  const video = parseResultVideoUrl(result.videoUrl);
  const showVideoPreview = Boolean(video && result.videoPosterUrl);

  const posterContent = showVideoPreview ? (
    <>
      <img
        src={result.videoPosterUrl}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/video:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
      />
      <span className="absolute inset-0 bg-black/30 transition-colors group-hover/video:bg-black/20" />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-[#08090C]/75 text-white">
        {video?.type === 'youtube' ? (
          <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
        ) : (
          <ExternalLink className="h-5 w-5" aria-hidden="true" />
        )}
      </span>
      <span className="absolute bottom-4 left-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
        {video?.type === 'youtube' ? 'Play result film' : 'Open on Instagram'}
      </span>
    </>
  ) : null;

  const headerBlock = (
    <header className="flex min-w-0 items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white p-2">
          <img
            src={result.clientLogoUrl}
            alt={`${result.clientName} logo`}
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#008CFF]">
            Client result
          </p>
          <h3 className="mt-1 truncate text-xl font-black uppercase tracking-[-0.025em] text-white sm:text-2xl">
            {result.clientName}
          </h3>
        </div>
      </div>
      <div className="shrink-0 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-right">
        <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
          Duration
        </span>
        <strong className="text-xs font-bold text-white">
          {formatDurationMonths(result.durationMonths)}
        </strong>
      </div>
    </header>
  );

  const comparisonVisuals = (
    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
      <figure className="min-w-0 overflow-hidden rounded-xl border border-white/12 bg-[#06080D]">
        <div className="aspect-[16/10] overflow-hidden bg-[#06080D]">
          <img
            src={result.beforeScreenshotUrl}
            alt={`${result.clientName} before BrandShoots`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <figcaption className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
          <span>Before</span>
          <span className="font-mono text-white/35">Baseline</span>
        </figcaption>
      </figure>
      <figure className="min-w-0 overflow-hidden rounded-xl border border-[#008CFF]/35 bg-[#06080D] shadow-[0_0_24px_rgba(0,140,255,0.1)]">
        <div className="aspect-[16/10] overflow-hidden bg-[#06080D]">
          <img
            src={result.afterScreenshotUrl}
            alt={`${result.clientName} after BrandShoots`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <figcaption className="flex items-center justify-between border-t border-[#008CFF]/25 bg-[#008CFF]/[0.06] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#38A8FF]">
          <span>After</span>
          <span className="font-mono text-[#38A8FF]/80">With BrandShoots</span>
        </figcaption>
      </figure>
    </div>
  );

  const videoBlock = showVideoPreview ? (
    video?.type === 'youtube' ? (
      <button
        type="button"
        data-result-video-placeholder
        data-result-video-type="youtube"
        onClick={() => (onPlayVideo ?? onViewCaseStudy)(result)}
        aria-label={`Play ${result.clientName} result film`}
        className="group/video relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-black text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008CFF]"
      >
        {posterContent}
      </button>
    ) : video ? (
      <a
        href={video.originalUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-result-video-placeholder
        data-result-video-type={video.type}
        aria-label={`Open ${result.clientName} result video on its original site`}
        className="group/video relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-black text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008CFF]"
      >
        {posterContent}
      </a>
    ) : null
  ) : null;

  const ctaButton = (
    <button
      type="button"
      onClick={() => onViewCaseStudy(result)}
      aria-label={`View ${result.clientName} case study`}
      className="group inline-flex items-center gap-3 rounded-full bg-[#008CFF] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_24px_rgba(0,140,255,0.28)] transition-all hover:bg-[#1a97ff] hover:shadow-[0_0_32px_rgba(0,140,255,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008CFF]"
    >
      View Case Study
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true" />
    </button>
  );

  if (layout === 'spotlight') {
    return (
      <article
        data-result-card
        data-result-id={result.id}
        className="grid min-w-0 grid-cols-1 gap-7 rounded-2xl border border-white/12 bg-[#0D1017]/90 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-7 lg:grid-cols-12 lg:items-center lg:gap-8"
      >
        <div className="min-w-0 space-y-4 lg:col-span-7">
          {comparisonVisuals}
          {result.testimonial && (
            <p className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-light italic leading-relaxed text-white/70">
              “{result.testimonial}”
            </p>
          )}
        </div>

        <div className="min-w-0 space-y-4 lg:col-span-5">
          {headerBlock}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <MetricComparison label="Followers" before={result.beforeFollowers} after={result.afterFollowers} />
            <MetricComparison label="Views" before={result.beforeViews} after={result.afterViews} />
          </div>
          {videoBlock}
          <div className="pt-1">{ctaButton}</div>
        </div>
      </article>
    );
  }

  return (
    <article
      data-result-card
      data-result-id={result.id}
      className="flex min-w-0 flex-col justify-between gap-5 rounded-2xl border border-white/12 bg-[#0D1017]/85 p-5 text-white sm:p-6"
    >
      <div className="space-y-5">
        {headerBlock}
        {comparisonVisuals}
        <div className="space-y-3">
          <MetricComparison label="Followers" before={result.beforeFollowers} after={result.afterFollowers} />
          <MetricComparison label="Views" before={result.beforeViews} after={result.afterViews} />
        </div>
        {videoBlock}
      </div>
      <div className="pt-1">{ctaButton}</div>
    </article>
  );
};

export default ResultCard;
