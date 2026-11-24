import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCMSContent } from '../../lib/cms/useCMSContent';

gsap.registerPlugin(ScrollTrigger);

export interface TestimonialItem {
  id: string;
  client: string;
  author: string;
  role: string;
  quote: string;
  imageUrl: string;
  buttonUrl?: string;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  { id: 'bags-world', client: 'Bags World', author: 'Rajesh Jain', role: 'Founder & CEO', quote: 'The energy, pacing, and visual command they brought to our commercial films was electric. They gave our retail presence a nationwide luxury aura.', imageUrl: '/reels/thumbnails-webp/bags.world_rjy_2025-09-09_09-40-28_3717579195573459823_54511918250.webp', buttonUrl: '/portfolio' },
  { id: 'viswatuff', client: 'Viswatuff Glass', author: 'Visweswara Rao', role: 'Managing Director', quote: 'BrandShoots completely elevated our industrial products. The film didn’t just showcase glass — it felt like an international luxury architectural showcase.', imageUrl: '/reels/thumbnails-webp/viswatuff.glass_rjy_2026-05-28_18-00-28_3907005057329571857_78432309239.webp', buttonUrl: '/portfolio' },
  { id: 'aabharan', client: 'Aabharan Jewellers', author: 'Kiran Kumar', role: 'Creative Director', quote: 'Their visual direction captured the heritage and intricate craftsmanship of our temple jewelry with breathtaking nuance. Pure luxury in every frame.', imageUrl: '/reels/thumbnails-webp/aabharan_womens_accessories_2026-05-30_10-01-21_3908213461611903133_45301478774.webp', buttonUrl: '/portfolio' },
  { id: 'shanti-pipes', client: 'Shanti Pipes', author: 'Santhi Ramudu', role: 'Executive Director', quote: 'A masterclass in industrial visual storytelling. Heavy infrastructure manufacturing looked dynamic, futuristic, and commanding.', imageUrl: '/reels/thumbnails-webp/santhi.pipes_rjy_2026-09-06_10-01-41_3979966688738161477_48644092133.webp', buttonUrl: '/portfolio' },
  { id: 'jain-beauty', client: 'Jain Beauty Studio', author: 'Pooja Jain', role: 'Brand Lead', quote: 'Every single frame was high-fashion editorial art. BrandShoots architects an entire visual culture for your brand that resonates deeply.', imageUrl: '/reels/thumbnails-webp/jain_beauty_concepts_2026-09-04_17-58-58_3978756534484922098_48808965364.webp', buttonUrl: '/portfolio' },
  { id: 'sb-ventures', client: 'SB Ventures', author: 'Siva Balaji', role: 'Founder', quote: 'BrandShoots brought cinematic firepower to our brand campaigns. The viral pacing and Hollywood-grade color work created an immediate commercial breakthrough.', imageUrl: '/reels/thumbnails-webp/sbventures_official_2026-09-15_17-10-21_3986704799434897519_5720346010.webp', buttonUrl: '/portfolio' },
  { id: 'sahana-dryfruits', client: 'Sahana Dry Fruits', author: 'Sahana Reddy', role: 'Managing Partner', quote: 'The crisp vertical reel storytelling gave our premium packaging the luxury spotlight it needed. Transformed our seasonal commercial rollouts.', imageUrl: '/reels/thumbnails-webp/sahana.dryfruits_rjy_2026-07-05_17-57-04_3934543118156154206_38485858909.webp', buttonUrl: '/portfolio' },
  { id: 'tea3-official', client: 'Tea3 Official', author: 'Vikram Varma', role: 'Operations Head', quote: 'The visual energy BrandShoots brings to retail beverages is unmatched. High tempo, vibrant color grading, and organic content that converts viewers.', imageUrl: '/reels/thumbnails-webp/tea3_official_2025-10-29_09-54-59_3753833688871293700_76713485685.webp', buttonUrl: '/portfolio' },
];

export const TestimonialsSection3D: React.FC = () => {
  const { testimonials: cmsTestimonials } = useCMSContent();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  const activeTestimonials = useMemo<TestimonialItem[]>(() => {
    return cmsTestimonials
      .filter((testimonial) => testimonial.visible !== false)
      .map((testimonial, index) => {
        const fallback = DEFAULT_TESTIMONIALS.find((item) =>
          item.client.toLowerCase().includes(testimonial.client.toLowerCase()) ||
          testimonial.client.toLowerCase().includes(item.client.toLowerCase())
        ) || DEFAULT_TESTIMONIALS[index % DEFAULT_TESTIMONIALS.length];

        return {
          id: testimonial.id || `cms-t-${index}`,
          client: testimonial.client || fallback.client,
          author: testimonial.author || fallback.author,
          role: testimonial.role || fallback.role,
          quote: testimonial.quote || fallback.quote,
          imageUrl: fallback.imageUrl,
          buttonUrl: '/portfolio',
        };
      });
  }, [cmsTestimonials]);

  const updateCardsToShow = useCallback(() => {
    setCardsToShow(window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3);
  }, []);

  useEffect(() => {
    updateCardsToShow();
    window.addEventListener('resize', updateCardsToShow);
    return () => window.removeEventListener('resize', updateCardsToShow);
  }, [updateCardsToShow]);

  useEffect(() => {
    setCurrentIndex((index) => index % Math.max(activeTestimonials.length, 1));
  }, [activeTestimonials.length]);

  const visibleTestimonials = useMemo(() => {
    return Array.from({ length: Math.min(cardsToShow, activeTestimonials.length) }, (_, offset) =>
      activeTestimonials[(currentIndex + offset) % activeTestimonials.length]
    );
  }, [activeTestimonials, cardsToShow, currentIndex]);

  const goToNext = useCallback(() => {
    if (activeTestimonials.length < 2) return;
    setCurrentIndex((index) => (index + 1) % activeTestimonials.length);
  }, [activeTestimonials.length]);

  const goToPrevious = useCallback(() => {
    if (activeTestimonials.length < 2) return;
    setCurrentIndex((index) => (index - 1 + activeTestimonials.length) % activeTestimonials.length);
  }, [activeTestimonials.length]);

  useEffect(() => {
    if (isPaused || activeTestimonials.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(goToNext, 7500);
    return () => window.clearInterval(timer);
  }, [activeTestimonials.length, goToNext, isPaused]);

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(headerRef.current!.children, { opacity: 0, y: 22 }, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true },
      });
    }, sectionRef);
    return () => context.revert();
  }, []);

  useEffect(() => {
    if (!cardsRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context = gsap.context(() => {
      gsap.fromTo(cardsRef.current!.children, { opacity: 0, y: 20 }, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      });
    }, sectionRef);
    return () => context.revert();
  }, [currentIndex, cardsToShow]);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const difference = touchStartX.current - event.changedTouches[0].clientX;
      if (Math.abs(difference) > 40) difference > 0 ? goToNext() : goToPrevious();
    }
    touchStartX.current = null;
    setIsPaused(false);
  };

  if (activeTestimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="w-full border-b border-white/10 bg-[#08090C] py-24 text-white sm:py-32"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto w-full max-w-[1380px] px-5 sm:px-8 lg:px-12">
        <div ref={headerRef} className="mb-12 flex items-end justify-between gap-6 border-b border-white/20 pb-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-black uppercase tracking-[-0.025em]">TESTIMONIALS<span className="text-[#008CFF]">.</span></h2>
          <span className="hidden font-mono text-xs uppercase tracking-[0.24em] font-semibold text-white/50 sm:block">WHAT LEADERS SAY</span>
        </div>

        <div className="relative overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div ref={cardsRef} className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibleTestimonials.map((testimonial, index) => (
              <article
                key={`${testimonial.id}-${currentIndex}-${index}`}
                className={`flex min-h-[310px] flex-col justify-between border border-white/15 bg-[#0d1015] p-6 transition-colors duration-300 sm:p-7 ${index === 0 ? 'border-t-2 border-t-[#008CFF]' : ''}`}
              >
                <div>
                  <p className="font-sans font-light text-base sm:text-lg leading-relaxed text-white/85">“{testimonial.quote}”</p>
                </div>
                <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-5">
                  <img src={testimonial.imageUrl} alt={testimonial.author} width={48} height={48} loading="lazy" decoding="async" className="h-12 w-12 shrink-0 rounded-full object-cover grayscale-[0.15]" />
                  <div className="min-w-0">
                    <p className="truncate font-sans text-sm font-bold text-white">{testimonial.author}</p>
                    <p className="mt-0.5 truncate font-mono text-[10px] tracking-[0.16em] text-white/50 uppercase">{testimonial.role}</p>
                    <p className="mt-0.5 truncate font-mono text-xs tracking-wider text-[#008CFF] font-semibold">{testimonial.client}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between gap-5">
          <div className="flex items-center gap-2" aria-label="Testimonial pagination">
            {activeTestimonials.map((testimonial, index) => (
              <button key={testimonial.id} type="button" aria-label={`Show testimonial ${index + 1}`} onClick={() => setCurrentIndex(index)} className={`h-px transition-all duration-300 ${index === currentIndex ? 'w-10 bg-[#1497F5]' : 'w-5 bg-white/25 hover:bg-white/65'}`} />
            ))}
          </div>
          {activeTestimonials.length > 1 && (
            <div className="flex items-center gap-2">
              <button type="button" onClick={goToPrevious} aria-label="Previous testimonial" className="border border-white/30 p-2 text-white transition-colors hover:border-white hover:bg-white hover:text-black"><ChevronLeft className="h-4 w-4" /></button>
              <button type="button" onClick={goToNext} aria-label="Next testimonial" className="border border-white/30 p-2 text-white transition-colors hover:border-white hover:bg-white hover:text-black"><ChevronRight className="h-4 w-4" /></button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection3D;
