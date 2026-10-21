import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useCMSContent } from '../../lib/cms/useCMSContent';

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
  {
    id: 'bags-world',
    client: 'Bags World',
    author: 'Rajesh Jain',
    role: 'Founder & CEO',
    quote:
      'The energy, pacing, and visual command they brought to our commercial films was electric. They gave our retail presence a nationwide luxury aura.',
    imageUrl:
      '/reels/thumbnails/bags.world_rjy_2025-09-09_09-40-28_3717579195573459823_54511918250.jpg',
    buttonUrl: '/portfolio',
  },
  {
    id: 'viswatuff',
    client: 'Viswatuff Glass',
    author: 'Visweswara Rao',
    role: 'Managing Director',
    quote:
      'BrandShoots completely elevated our industrial products. The film didn’t just showcase glass — it felt like an international luxury architectural showcase.',
    imageUrl:
      '/reels/thumbnails/viswatuff.glass_rjy_2026-05-28_18-00-28_3907005057329571857_78432309239.jpg',
    buttonUrl: '/portfolio',
  },
  {
    id: 'aabharan',
    client: 'Aabharan Jewellers',
    author: 'Kiran Kumar',
    role: 'Creative Director',
    quote:
      'Their visual direction captured the heritage and intricate craftsmanship of our temple jewelry with breathtaking nuance. Pure luxury in every frame.',
    imageUrl:
      '/reels/thumbnails/aabharan_womens_accessories_2026-05-30_10-01-21_3908213461611903133_45301478774.jpg',
    buttonUrl: '/portfolio',
  },
  {
    id: 'shanti-pipes',
    client: 'Shanti Pipes',
    author: 'Santhi Ramudu',
    role: 'Executive Director',
    quote:
      'A masterclass in industrial visual storytelling. Heavy infrastructure manufacturing looked dynamic, futuristic, and commanding.',
    imageUrl:
      '/reels/thumbnails/santhi.pipes_rjy_2026-09-06_10-01-41_3979966688738161477_48644092133.jpg',
    buttonUrl: '/portfolio',
  },
  {
    id: 'jain-beauty',
    client: 'Jain Beauty Studio',
    author: 'Pooja Jain',
    role: 'Brand Lead',
    quote:
      'Every single frame was high-fashion editorial art. BrandShoots architects an entire visual culture for your brand that resonates deeply.',
    imageUrl:
      '/reels/thumbnails/jain_beauty_concepts_2026-09-04_17-58-58_3978756534484922098_48808965364.jpg',
    buttonUrl: '/portfolio',
  },
  {
    id: 'sb-ventures',
    client: 'SB Ventures',
    author: 'Siva Balaji',
    role: 'Founder',
    quote:
      'BrandShoots brought cinematic firepower to our brand campaigns. The viral pacing and Hollywood-grade color work created an immediate commercial breakthrough.',
    imageUrl:
      '/reels/thumbnails/sbventures_official_2026-09-15_17-10-21_3986704799434897519_5720346010.jpg',
    buttonUrl: '/portfolio',
  },
  {
    id: 'sahana-dryfruits',
    client: 'Sahana Dry Fruits',
    author: 'Sahana Reddy',
    role: 'Managing Partner',
    quote:
      'The crisp vertical reel storytelling gave our premium packaging the luxury spotlight it needed. Transformed our seasonal commercial rollouts.',
    imageUrl:
      '/reels/thumbnails/sahana.dryfruits_rjy_2026-07-05_17-57-04_3934543118156154206_38485858909.jpg',
    buttonUrl: '/portfolio',
  },
  {
    id: 'tea3-official',
    client: 'Tea3 Official',
    author: 'Vikram Varma',
    role: 'Operations Head',
    quote:
      'The visual energy BrandShoots brings to retail beverages is unmatched. High tempo, vibrant color grading, and organic content that converts viewers.',
    imageUrl:
      '/reels/thumbnails/tea3_official_2025-10-29_09-54-59_3753833688871293700_76713485685.jpg',
    buttonUrl: '/portfolio',
  },
];

export const TestimonialsSection3D: React.FC = () => {
  const { testimonials: cmsTestimonials } = useCMSContent();

  const activeTestimonials: TestimonialItem[] = useMemo(() => {
    if (cmsTestimonials && cmsTestimonials.length >= 3) {
      return cmsTestimonials
        .filter((t) => t.visible !== false)
        .map((t, idx) => {
          const defaultMatch =
            DEFAULT_TESTIMONIALS.find(
              (d) =>
                d.client.toLowerCase().includes(t.client.toLowerCase()) ||
                t.client.toLowerCase().includes(d.client.toLowerCase())
            ) || DEFAULT_TESTIMONIALS[idx % DEFAULT_TESTIMONIALS.length];

          return {
            id: t.id || `cms-t-${idx}`,
            client: t.client || defaultMatch.client,
            author: t.author || defaultMatch.author,
            role: t.role || defaultMatch.role,
            quote: t.quote || defaultMatch.quote,
            imageUrl: defaultMatch.imageUrl,
            buttonUrl: '/portfolio',
          };
        });
    }
    return DEFAULT_TESTIMONIALS;
  }, [cmsTestimonials]);

  // Seamless continuous 50% translation marquee duplication
  const repeatCount = Math.max(2, Math.ceil(8 / activeTestimonials.length));
  const oneSet: TestimonialItem[] = [];
  for (let i = 0; i < repeatCount; i++) {
    oneSet.push(...activeTestimonials);
  }
  const marqueeList = [...oneSet, ...oneSet];

  const durationSeconds = Math.max(60, activeTestimonials.length * 11);

  return (
    <section
      id="testimonials"
      className="relative w-full py-8 sm:py-10 bg-[#04060A] text-white overflow-hidden select-none border-y border-white/5"
    >
      {/* Compact Section Header */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 mb-5 sm:mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#008CFF] shadow-[0_0_8px_#008CFF]" />
          <h2 className="font-sans font-black uppercase text-lg sm:text-xl tracking-wider text-white">
            TESTIMONIALS<span className="text-[#008CFF]">.</span>
          </h2>
        </div>
        <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.22em] text-white/50 font-medium">
          WHAT LEADERS SAY
        </span>
      </div>

      {/* Auto-scroll Continuous Stream with Edge Gradient Masks */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
        }}
      >
        <div className="w-full overflow-hidden flex select-none py-1">
          <div
            className="flex shrink-0 items-stretch animate-testimonials-marquee will-change-transform hover:[animation-play-state:paused]"
            style={{ animationDuration: `${durationSeconds}s` }}
          >
            {marqueeList.map((item, idx) => (
              <Link
                key={`${item.id}-${idx}`}
                to={item.buttonUrl || '/portfolio'}
                className="w-[330px] sm:w-[380px] md:w-[420px] shrink-0 mr-6 sm:mr-8 p-5 sm:p-6 rounded-2xl bg-[#070B12]/95 border border-white/10 hover:border-[#008CFF]/50 hover:bg-[#0A101C] transition-all duration-300 flex flex-col justify-between group/card shadow-[0_8px_24px_rgba(0,0,0,0.6)] cursor-pointer"
              >
                {/* Header Row: Small Supporting Avatar + Author & Company + 5 Stars */}
                <div className="flex items-center justify-between gap-3 mb-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Small Supporting Thumbnail Avatar */}
                    <img
                      src={item.imageUrl}
                      alt={item.author}
                      loading="lazy"
                      decoding="async"
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border border-white/15 shrink-0 group-hover/card:border-[#008CFF]/60 transition-colors shadow-sm"
                    />

                    {/* Person Details */}
                    <div className="min-w-0">
                      <h3 className="font-sans font-bold text-sm sm:text-base text-white tracking-tight truncate group-hover/card:text-[#008CFF] transition-colors">
                        {item.author}
                      </h3>
                      <p className="text-[11px] sm:text-xs font-mono tracking-wider uppercase text-white/50 truncate mt-0.5">
                        <span>{item.role}</span>
                        <span className="mx-1 text-white/30">•</span>
                        <span className="text-[#008CFF] font-semibold">{item.client}</span>
                      </p>
                    </div>
                  </div>

                  {/* 5 Compact Electric Blue Stars */}
                  <div className="flex items-center gap-0.5 shrink-0 opacity-90 group-hover/card:opacity-100 transition-opacity">
                    {[...Array(5)].map((_, sIdx) => (
                      <Star
                        key={sIdx}
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#008CFF] text-[#008CFF]"
                      />
                    ))}
                  </div>
                </div>

                {/* Authentic Quote with Higher Readability */}
                <p className="text-[13px] sm:text-[14.5px] text-white/80 font-sans leading-relaxed line-clamp-3 sm:line-clamp-4">
                  "{item.quote}"
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded High-Performance Infinite Auto-Scroll Keyframes */}
      <style>{`
        @keyframes testimonialsStreamLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-testimonials-marquee {
          animation: testimonialsStreamLeft 60s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection3D;
