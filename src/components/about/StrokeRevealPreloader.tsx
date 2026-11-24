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
  minimumDurationMs = 850,
  maximumDurationMs = 8000,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const onCompleteRef = useRef(onComplete);
  const readyRef = useRef(readyToExit);
  const minimumElapsedRef = useRef(false);
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
    if (exitStartedRef.current || !minimumElapsedRef.current || !readyRef.current) return;
    exitStartedRef.current = true;
    timelineRef.current?.play('exit');
  }, []);

  useEffect(() => {
    if (readyToExit) startExit();
  }, [readyToExit, startExit]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minimumTimer = window.setTimeout(() => {
      minimumElapsedRef.current = true;
      startExit();
    }, reducedMotion ? 250 : minimumDurationMs);
    const maximumTimer = window.setTimeout(() => {
      minimumElapsedRef.current = true;
      readyRef.current = true;
      startExit();
    }, maximumDurationMs);

    let context: gsap.Context | undefined;
    try {
      context = gsap.context(() => {
        gsap.set(containerRef.current, { opacity: 1, scale: 1 });
        gsap.set(glowRef.current, { scale: 0.6, opacity: 0 });
        gsap.set(logoRef.current, { scale: 0.94, opacity: 0 });

        const timeline = gsap.timeline({ paused: true, onComplete: finish });
        timelineRef.current = timeline;
        timeline
          .to(glowRef.current, {
            scale: 1.25,
            opacity: reducedMotion ? 0.3 : 0.6,
            duration: reducedMotion ? 0.1 : 0.35,
            ease: 'power2.out',
          }, 0)
          .to(logoRef.current, {
            opacity: 1,
            scale: 1,
            duration: reducedMotion ? 0.1 : 0.35,
            ease: 'power2.out',
          }, 0.03)
          .to(logoRef.current, {
            scale: reducedMotion ? 1 : 1.015,
            duration: reducedMotion ? 0.05 : 0.2,
            ease: 'sine.inOut',
          }, reducedMotion ? 0.12 : 0.4)
          .addLabel('hold')
          .addPause('hold')
          .addLabel('exit')
          .to(containerRef.current, {
            opacity: 0,
            scale: reducedMotion ? 1 : 1.02,
            duration: reducedMotion ? 0.15 : 0.25,
            ease: 'power2.inOut',
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
      window.clearTimeout(minimumTimer);
      window.clearTimeout(maximumTimer);
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
      className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-[#04060A] select-none"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute h-[320px] w-[520px] rounded-full bg-[#008CFF]/25 blur-[120px]"
      />
      <div className="pointer-events-none relative z-10 flex w-[84vw] max-w-[620px] items-center justify-center px-6">
        <img
          ref={logoRef}
          src="/Logo Official.svg"
          alt="BrandShoots Official Logo"
          width={1600}
          height={365}
          className="h-auto max-h-[35vh] w-full object-contain drop-shadow-[0_12px_45px_rgba(0,140,255,0.45)]"
        />
      </div>
    </div>
  );
};

export default StrokeRevealPreloader;
