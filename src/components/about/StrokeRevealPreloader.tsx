import React, { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';

interface StrokeRevealPreloaderProps {
  onComplete: () => void;
  readyToExit?: boolean;
  minimumDurationMs?: number;
  maximumDurationMs?: number;
}

export const StrokeRevealPreloader: React.FC<StrokeRevealPreloaderProps> = ({
  onComplete,
  readyToExit = true,
  minimumDurationMs = 0,
  maximumDurationMs = 3000,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const onCompleteRef = useRef(onComplete);
  const readyRef = useRef(readyToExit);
  const minimumElapsedRef = useRef(minimumDurationMs <= 0);
  const holdReachedRef = useRef(false);
  const completedRef = useRef(false);
  const exitStartedRef = useRef(false);
  onCompleteRef.current = onComplete;
  readyRef.current = readyToExit;

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current();
  }, []);

  const startExit = useCallback(() => {
    if (
      exitStartedRef.current ||
      !minimumElapsedRef.current ||
      !readyRef.current ||
      !holdReachedRef.current
    ) {
      return;
    }
    const timeline = timelineRef.current;
    if (!timeline) return;
    exitStartedRef.current = true;
    if (containerRef.current) {
      containerRef.current.style.pointerEvents = 'none';
    }
    timeline.play('exit');
  }, []);

  useEffect(() => {
    if (readyToExit) startExit();
  }, [readyToExit, startExit]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minDelay = reducedMotion ? Math.min(minimumDurationMs, 100) : minimumDurationMs;
    const minimumTimer = minDelay > 0
      ? window.setTimeout(() => {
          minimumElapsedRef.current = true;
          startExit();
        }, minDelay)
      : undefined;
    if (minDelay <= 0) {
      minimumElapsedRef.current = true;
    }
    let forceFinishTimer: number | undefined;
    const maximumTimer = window.setTimeout(() => {
      minimumElapsedRef.current = true;
      readyRef.current = true;
      holdReachedRef.current = true;
      startExit();
      forceFinishTimer = window.setTimeout(finish, 350);
    }, maximumDurationMs);

    let context: gsap.Context | undefined;
    try {
      context = gsap.context(() => {
        gsap.set(containerRef.current, { opacity: 1, scale: 1 });
        gsap.set(glowRef.current, { scale: 0.85, opacity: 0.25 });
        gsap.set(logoRef.current, { scale: 0.96, opacity: 0.85 });

        const timeline = gsap.timeline({ paused: true, onComplete: finish });
        timelineRef.current = timeline;
        timeline
          .to(glowRef.current, {
            scale: 1.1,
            opacity: reducedMotion ? 0.25 : 0.45,
            duration: reducedMotion ? 0.08 : 0.16,
            ease: 'power2.out',
          }, 0)
          .to(logoRef.current, {
            opacity: 1,
            scale: 1,
            duration: reducedMotion ? 0.08 : 0.16,
            ease: 'power2.out',
          }, 0)
          .addLabel('hold')
          .addPause('hold', () => {
            holdReachedRef.current = true;
            if (minimumElapsedRef.current && readyRef.current) {
              window.requestAnimationFrame(startExit);
            }
          })
          .addLabel('exit')
          .to(containerRef.current, {
            opacity: 0,
            scale: reducedMotion ? 1 : 1.015,
            duration: reducedMotion ? 0.1 : 0.2,
            ease: 'power2.out',
          }, 'exit');
        timeline.play();
      }, containerRef);
    } catch (error) {
      console.error('Route preloader setup failed', error);
      minimumElapsedRef.current = true;
      readyRef.current = true;
      finish();
    }

    return () => {
      if (minimumTimer !== undefined) window.clearTimeout(minimumTimer);
      if (forceFinishTimer !== undefined) window.clearTimeout(forceFinishTimer);
      window.clearTimeout(maximumTimer);
      holdReachedRef.current = false;
      exitStartedRef.current = false;
      timelineRef.current?.kill();
      timelineRef.current = null;
      context?.revert();
    };
  }, [finish, maximumDurationMs, minimumDurationMs, startExit]);

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Loading BrandShoots page"
      className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-[#04060A] select-none will-change-[opacity,transform]"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute h-[420px] w-[620px] rounded-full will-change-[opacity,transform]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 140, 255, 0.18) 0%, rgba(0, 140, 255, 0.05) 45%, transparent 72%)',
        }}
      />
      <div className="pointer-events-none relative z-10 flex w-[76vw] max-w-[460px] items-center justify-center px-6">
        <img
          ref={logoRef}
          src="/Logo Official.svg"
          alt="BrandShoots Official Logo"
          width={1600}
          height={365}
          className="h-auto max-h-[28vh] w-full object-contain will-change-[opacity,transform]"
        />
      </div>
    </div>
  );
};

export default StrokeRevealPreloader;
