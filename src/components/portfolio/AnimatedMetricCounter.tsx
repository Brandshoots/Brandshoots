import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';

interface ParsedMetric {
  isNumeric: boolean;
  prefix: string;
  target: number;
  decimals: number;
  hasCommas: boolean;
  suffix: string;
}

function parseMetricValue(raw: string): ParsedMetric {
  const trimmed = (raw || '').trim();
  const match = /^([+-]?)\s*([0-9]+(?:,[0-9]{3})*(?:\.[0-9]+)?|[0-9]*\.[0-9]+)\s*(.*)$/.exec(trimmed);
  if (!match) {
    return {
      isNumeric: false,
      prefix: '',
      target: 0,
      decimals: 0,
      hasCommas: false,
      suffix: trimmed,
    };
  }

  const [, prefix, numStr, suffix] = match;
  const hasCommas = numStr.includes(',');
  const cleanNum = numStr.replace(/,/g, '');
  const dotIndex = cleanNum.indexOf('.');
  const decimals = dotIndex >= 0 ? cleanNum.length - dotIndex - 1 : 0;
  const target = Number.parseFloat(cleanNum);

  if (Number.isNaN(target)) {
    return {
      isNumeric: false,
      prefix: '',
      target: 0,
      decimals: 0,
      hasCommas: false,
      suffix: trimmed,
    };
  }

  return {
    isNumeric: true,
    prefix,
    target,
    decimals,
    hasCommas,
    suffix,
  };
}

function formatMetricNumber(val: number, parsed: ParsedMetric): string {
  const fixed = parsed.decimals > 0 ? val.toFixed(parsed.decimals) : Math.round(val).toString();
  if (!parsed.hasCommas) {
    return `${parsed.prefix}${fixed}${parsed.suffix}`;
  }
  const [intPart, decPart] = fixed.split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${parsed.prefix}${decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt}${parsed.suffix}`;
}

export interface AnimatedMetricCounterProps {
  value: string;
  triggerKey?: string | number;
  active?: boolean;
  delay?: number;
  duration?: number;
  className?: string;
}

export const AnimatedMetricCounter: React.FC<AnimatedMetricCounterProps> = ({
  value,
  triggerKey,
  active = true,
  delay = 0,
  duration = 1.35,
  className = '',
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const parsed = useMemo(() => parseMetricValue(value), [value]);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    tweenRef.current?.kill();
    tweenRef.current = null;

    if (!parsed.isNumeric) {
      el.textContent = value;
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!active) {
      el.textContent = formatMetricNumber(0, parsed);
      return;
    }

    if (reducedMotion) {
      el.textContent = formatMetricNumber(parsed.target, parsed);
      return;
    }

    const counter = { current: 0 };
    el.textContent = formatMetricNumber(0, parsed);

    tweenRef.current = gsap.to(counter, {
      current: parsed.target,
      duration,
      delay,
      ease: 'power3.out',
      onUpdate: () => {
        if (spanRef.current) {
          spanRef.current.textContent = formatMetricNumber(counter.current, parsed);
        }
      },
      onComplete: () => {
        if (spanRef.current) {
          spanRef.current.textContent = formatMetricNumber(parsed.target, parsed);
        }
      },
    });

    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, [active, delay, duration, parsed, triggerKey, value]);

  return (
    <span ref={spanRef} className={`tabular-nums ${className}`}>
      {value}
    </span>
  );
};

export default AnimatedMetricCounter;
