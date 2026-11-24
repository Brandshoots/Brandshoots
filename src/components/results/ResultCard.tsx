import React from 'react';
import { ArrowRight, ExternalLink, Play } from 'lucide-react';
import { CMSResult } from '../../types/cms';
import { formatDurationMonths, formatMetricValue } from '../../lib/results/format';
import { parseResultVideoUrl } from '../../lib/results/video';

interface ResultCardProps {
  result: CMSResult;
  onViewCaseStudy: (result: CMSResult) => void;
  onPlayVideo?: (result: CMSResult) => void;
}

interface MetricComparisonProps {
  label: string;
  before: number | null;
  after: number | null;
}

const MetricComparison: React.FC<MetricComparisonProps> = ({ label, before, after }) => (
  <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-3 border-b border-white/10 py-4">
    <div className="min-w-0">
      <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
        Before {label}
      </span>
      <strong className="mt-1 block truncate text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
        {formatMetricValue(before)}
      </strong>
    </div>
    <ArrowRight className="mb-2 h-4 w-4 shrink-0 text-[#008CFF]" aria-hidden="true" />
    <div className="min-w-0 text-right">
      <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
        After {label}
      </span>
      <strong className="mt-1 block truncate text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
        {formatMetricValue(after)}
      </strong>
    </div>
  </div>
);

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  onViewCaseStudy,
  onPlayVideo,
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

  return (
    <article
      data-result-card
      data-result-id={result.id}
      className="min-w-0 border-t border-white/20 pt-5 text-white"
    >
      <header className="flex min-w-0 items-center gap-4">
        <div className="flex h-14 w-20 shrink-0 items-center justify-center border border-white/15 bg-white p-2">
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
      </header>

      <div className="mt-5 grid min-w-0 grid-cols-1 gap-px overflow-hidden border border-white/15 bg-white/15 sm:grid-cols-2">
        <figure className="min-w-0 bg-[#08090C]">
          <div className="aspect-[4/5] overflow-hidden bg-black">
            <img
              src={result.beforeScreenshotUrl}
              alt={`${result.clientName} before BrandShoots`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain"
            />
          </div>
          <figcaption className="border-t border-white/15 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
            Before
          </figcaption>
        </figure>
        <figure className="min-w-0 bg-[#08090C]">
          <div className="aspect-[4/5] overflow-hidden bg-black">
            <img
              src={result.afterScreenshotUrl}
              alt={`${result.clientName} after BrandShoots`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain"
            />
          </div>
          <figcaption className="border-t border-white/15 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#008CFF]">
            After
          </figcaption>
        </figure>
      </div>

      <div className="mt-2">
        <MetricComparison label="followers" before={result.beforeFollowers} after={result.afterFollowers} />
        <MetricComparison label="views" before={result.beforeViews} after={result.afterViews} />
      </div>

      <div className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
          Duration
        </span>
        <strong className="text-sm font-semibold text-white">
          {formatDurationMonths(result.durationMonths)}
        </strong>
      </div>

      {showVideoPreview && video?.type === 'youtube' && (
        <button
          type="button"
          data-result-video-placeholder
          data-result-video-type="youtube"
          onClick={() => (onPlayVideo ?? onViewCaseStudy)(result)}
          aria-label={`Play ${result.clientName} result film`}
          className="group/video relative mt-5 flex aspect-video w-full items-center justify-center overflow-hidden border border-white/15 bg-black text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008CFF]"
        >
          {posterContent}
        </button>
      )}

      {showVideoPreview && video && video.type !== 'youtube' && (
        <a
          href={video.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-result-video-placeholder
          data-result-video-type={video.type}
          aria-label={`Open ${result.clientName} result video on its original site`}
          className="group/video relative mt-5 flex aspect-video w-full items-center justify-center overflow-hidden border border-white/15 bg-black text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008CFF]"
        >
          {posterContent}
        </a>
      )}

      <button
        type="button"
        onClick={() => onViewCaseStudy(result)}
        aria-label={`View ${result.clientName} case study`}
        className="group mt-5 inline-flex items-center gap-3 border-b border-[#008CFF] pb-1 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:text-[#008CFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008CFF]"
      >
        View Case Study
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true" />
      </button>
    </article>
  );
};

export default ResultCard;
