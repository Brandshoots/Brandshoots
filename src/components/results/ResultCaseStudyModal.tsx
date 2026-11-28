import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowRight, ExternalLink, Play, X } from 'lucide-react';
import { CMSResult } from '../../types/cms';
import {
  formatDurationMonths,
  formatMetricDelta,
  formatMetricValue,
} from '../../lib/results/format';
import { isYouTubeResultVideo, parseResultVideoUrl } from '../../lib/results/video';

interface ResultCaseStudyModalProps {
  isOpen: boolean;
  result: CMSResult | null;
  onClose: () => void;
  initialVideoPlayback?: boolean;
}

interface LenisController {
  isStopped?: boolean;
  start: () => void;
  stop: () => void;
}

interface DetailedMetricProps {
  label: string;
  before: number | null;
  after: number | null;
}

const DetailedMetric: React.FC<DetailedMetricProps> = ({ label, before, after }) => {
  const delta = formatMetricDelta(before, after);

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-4 border-t border-white/15 py-5">
      <div className="min-w-0">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
          Before {label}
        </span>
        <strong className="mt-1 block break-words text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
          {formatMetricValue(before)}
        </strong>
      </div>
      <ArrowRight className="mt-8 h-5 w-5 shrink-0 text-[#008CFF]" aria-hidden="true" />
      <div className="min-w-0 text-right">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
          After {label}
        </span>
        <strong className="mt-1 block break-words text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
          {formatMetricValue(after)}
        </strong>
        {delta && (
          <span className="mt-1 block text-xs font-semibold text-[#008CFF]">
            {delta}
          </span>
        )}
      </div>
    </div>
  );
};

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'iframe',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (element) => element.getAttribute('aria-hidden') !== 'true' && element.getClientRects().length > 0
  );
}

export const ResultCaseStudyModal: React.FC<ResultCaseStudyModalProps> = ({
  isOpen,
  result,
  onClose,
  initialVideoPlayback = false,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  const descriptionId = useId();
  const video = useMemo(() => parseResultVideoUrl(result?.videoUrl), [result?.videoUrl]);
  const [isYouTubeActive, setIsYouTubeActive] = useState(false);

  onCloseRef.current = onClose;

  const handleClose = useCallback(() => {
    setIsYouTubeActive(false);
    onCloseRef.current();
  }, []);

  useEffect(() => {
    if (!isOpen || !result) {
      setIsYouTubeActive(false);
      return;
    }

    setIsYouTubeActive(initialVideoPlayback && isYouTubeResultVideo(video));
  }, [initialVideoPlayback, isOpen, result, video]);

  useEffect(() => {
    if (!isOpen || !result) return;

    restoreFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const lenis = (window as Window & { __lenis?: LenisController }).__lenis;
    const lenisWasStopped = Boolean(lenis?.isStopped);
    lenis?.stop();

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusableElements = getFocusableElements(dialogRef.current);
      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      } else if (!dialogRef.current.contains(document.activeElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      if (lenis && !lenisWasStopped) lenis.start();

      const restoreTarget = restoreFocusRef.current;
      if (restoreTarget?.isConnected) {
        window.requestAnimationFrame(() => restoreTarget.focus());
      }
    };
  }, [handleClose, isOpen, result]);

  if (!isOpen || !result) return null;

  return (
    <div
      data-result-modal
      className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 lg:p-10"
      onWheel={(event) => event.stopPropagation()}
      onTouchMove={(event) => event.stopPropagation()}
    >
      <div
        aria-hidden="true"
        onClick={handleClose}
        className="absolute inset-0 bg-black/90"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="custom-scrollbar relative z-10 max-h-[92vh] w-full max-w-[1180px] overflow-y-auto border border-white/15 bg-[#08090C] text-white outline-none"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/15 bg-[#08090C]/95 px-5 py-4 backdrop-blur-md sm:px-8">
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#008CFF]">
            Result case study
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="Close case study"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/65 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008CFF]"
          >
            Close
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
          <header className="grid min-w-0 gap-7 border-b border-white/15 pb-9 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-end">
            <div className="flex h-20 w-28 items-center justify-center border border-white/15 bg-white p-3">
              <img
                src={result.clientLogoUrl}
                alt={`${result.clientName} logo`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <h2
                id={titleId}
                className="break-words text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] text-white sm:text-6xl"
              >
                {result.clientName}
              </h2>
              <p id={descriptionId} className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-white/60">
                A detailed before-and-after view of the audience and content performance recorded for this engagement.
              </p>
            </div>
            <div className="border-l border-white/20 pl-5 md:text-right">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                Duration
              </span>
              <strong className="mt-1 block text-lg text-white">
                {formatDurationMonths(result.durationMonths)}
              </strong>
            </div>
          </header>

          <section aria-labelledby={`${titleId}-comparison`} className="pt-10">
            <div className="flex items-end justify-between gap-4">
              <h3 id={`${titleId}-comparison`} className="text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
                Before <span className="text-[#008CFF]">→ After</span>
              </h3>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35 sm:block">
                Recorded performance
              </span>
            </div>

            <div className="mt-6 grid min-w-0 grid-cols-1 gap-px overflow-hidden border border-white/15 bg-white/15 sm:grid-cols-2">
              <figure className="min-w-0 bg-[#08090C]">
                <div className="aspect-[16/10] bg-black">
                  <img
                    src={result.beforeScreenshotUrl}
                    alt={`${result.clientName} performance before BrandShoots`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <figcaption className="border-t border-white/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
                  Before
                </figcaption>
              </figure>
              <figure className="min-w-0 bg-[#08090C]">
                <div className="aspect-[16/10] bg-black">
                  <img
                    src={result.afterScreenshotUrl}
                    alt={`${result.clientName} performance after BrandShoots`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <figcaption className="border-t border-white/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#008CFF]">
                  After
                </figcaption>
              </figure>
            </div>

            <div className="mt-7 grid min-w-0 gap-x-10 lg:grid-cols-2">
              <DetailedMetric label="followers" before={result.beforeFollowers} after={result.afterFollowers} />
              <DetailedMetric label="views" before={result.beforeViews} after={result.afterViews} />
            </div>
          </section>

          {result.testimonial && (
            <blockquote className="mt-12 border-y border-white/15 py-9 sm:py-12">
              <p className="max-w-4xl text-2xl font-light leading-tight tracking-[-0.025em] text-white sm:text-4xl">
                “{result.testimonial}”
              </p>
              <footer className="mt-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#008CFF]">
                {result.clientName}
              </footer>
            </blockquote>
          )}

          {video && (
            <section aria-labelledby={`${titleId}-video`} className="mt-12">
              <div className="flex items-end justify-between gap-4 border-b border-white/15 pb-4">
                <h3 id={`${titleId}-video`} className="text-2xl font-black uppercase tracking-[-0.03em] sm:text-3xl">
                  Result film
                </h3>
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                  Original source
                </span>
              </div>

              {isYouTubeResultVideo(video) && !isYouTubeActive && (
                <button
                  type="button"
                  data-result-video-placeholder
                  data-result-video-type="youtube"
                  onClick={() => setIsYouTubeActive(true)}
                  aria-label={`Play ${result.clientName} result film`}
                  className="group relative mt-6 flex aspect-video w-full items-center justify-center overflow-hidden border border-white/15 bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008CFF]"
                >
                  {result.videoPosterUrl && (
                    <img
                      src={result.videoPosterUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
                    />
                  )}
                  <span className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/25" />
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/60 bg-[#08090C]/80">
                    <Play className="ml-1 h-6 w-6 fill-current" aria-hidden="true" />
                  </span>
                </button>
              )}

              {isYouTubeResultVideo(video) && isYouTubeActive && (
                <div className="mt-6 aspect-video overflow-hidden border border-white/15 bg-black">
                  <iframe
                    data-result-video-iframe
                    data-result-video-type="youtube"
                    src={video.embedUrl}
                    title={`${result.clientName} result film`}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                    className="h-full w-full"
                  />
                </div>
              )}

              {video.type !== 'youtube' && (
                <a
                  href={video.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-result-video-placeholder
                  data-result-video-type={video.type}
                  className="mt-6 inline-flex items-center gap-3 border-b border-[#008CFF] pb-1 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:text-[#008CFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008CFF]"
                >
                  View original on Instagram
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultCaseStudyModal;
