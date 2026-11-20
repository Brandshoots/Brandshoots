import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const BrandStatementSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        lineRefs.current,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 82%', once: true },
        }
      );
    }, containerRef);
    return () => context.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full border-b border-white/10 bg-[#08090C] py-24 text-white sm:py-32 lg:py-40">
      <div className="mx-auto w-full max-w-[1380px] px-5 sm:px-8 lg:px-12">
        <h2 className="max-w-6xl text-left text-[clamp(2.9rem,8vw,8.5rem)] font-semibold uppercase leading-[0.86] tracking-[-0.065em]">
          <span ref={(element) => (lineRefs.current[0] = element)} className="block text-white/90">WE CRAFT</span>
          <span ref={(element) => (lineRefs.current[1] = element)} className="mt-2 block text-white">FILMS THAT</span>
          <span ref={(element) => (lineRefs.current[2] = element)} className="mt-2 block text-[#1497F5]">DEFINE BRANDS<span className="text-white">.</span></span>
        </h2>
      </div>
    </section>
  );
};

export default BrandStatementSection;
