export interface HeroReelVideo {
  id: string;
  title: string;
  client: string;
  description?: string;
  src: string;
  lightSrc: string;
  poster: string;
}

export const HERO_REEL_VIDEOS: HeroReelVideo[] = [
  // ----------------------------------------------------
  // PRIMARY 4 HERO CAROUSEL REELS (User requested layout)
  // Index 0: Left Left Reel (left of left reel)
  // Index 1: Left Reel (left of middle)
  // Index 2: Middle Reel (centered focal reel)
  // Index 3: Right Reel (right of middle)
  // ----------------------------------------------------
  {
    id: 'hero-left-left',
    title: 'Left Left Reel',
    client: 'BrandShoots Visuals',
    description: 'High-impact dynamic commercial storytelling and viral hook reel.',
    src: '/reels/hero-carousel/left-left-reel.mp4',
    lightSrc: '/reels/hero-carousel/left-left-reel.mp4',
    poster: '/reels/hero-carousel/posters/left-left-reel.webp',
  },
  {
    id: 'hero-left',
    title: 'Left Reel',
    client: 'BrandShoots Production',
    description: 'Cinematic brand commercial and creative visual production.',
    src: '/reels/hero-carousel/left-reel.mp4',
    lightSrc: '/reels/hero-carousel/left-reel.mp4',
    poster: '/reels/hero-carousel/posters/left-reel.webp',
  },
  {
    id: 'hero-middle',
    title: 'Middle Reel (Featured)',
    client: 'BrandShoots Studios',
    description: 'Flagship brand showcase and high-retention social media reel.',
    src: '/reels/hero-carousel/middle-reel.mp4',
    lightSrc: '/reels/hero-carousel/middle-reel.mp4',
    poster: '/reels/hero-carousel/posters/middle-reel.webp',
  },
  {
    id: 'hero-right',
    title: 'Right Reel',
    client: 'BrandShoots Scale',
    description: 'Full-funnel digital growth, visual systems, and brand engagement.',
    src: '/reels/hero-carousel/right-reel.mp4',
    lightSrc: '/reels/hero-carousel/right-reel.mp4',
    poster: '/reels/hero-carousel/posters/right-reel.webp',
  },

  // ----------------------------------------------------
  // BRANDSHOOTS CLIENT REELS ARCHIVE (Preserved)
  // ----------------------------------------------------
  {
    id: 'hero-final-aabharan',
    title: 'Aabharan Fine Jewellery',
    client: 'Aabharan Jewellers',
    description: 'Luxury bridal and heritage jewellery showcase reel.',
    src: '/reels/hero-final/instagram-aabharan_womens_accessories-DW1KGuDkXf6.mp4',
    lightSrc: '/reels/hero-final/instagram-aabharan_womens_accessories-DW1KGuDkXf6.mp4',
    poster: '/reels/hero-final/posters/instagram-aabharan_womens_accessories-DW1KGuDkXf6.webp',
  },
  {
    id: 'hero-final-bags-world',
    title: 'Bags World Showcase',
    client: 'Bags World',
    description: 'Retail storytelling and festive collection reel for Bags World.',
    src: '/reels/hero-final/instagram-bags.world_rjy-DeQ925lpHXR.mp4',
    lightSrc: '/reels/hero-final/instagram-bags.world_rjy-DeQ925lpHXR.mp4',
    poster: '/reels/hero-final/posters/instagram-bags.world_rjy-DeQ925lpHXR.webp',
  },
  {
    id: 'hero-final-dayanidhi',
    title: 'Dayanidhi Interiors',
    client: 'Dayanidhi Interiors',
    description: 'Architectural and luxury bathware showroom feature.',
    src: '/reels/hero-final/instagram-dayanidhi.interiors_rjy-DRHjyE4kyY1.mp4',
    lightSrc: '/reels/hero-final/instagram-dayanidhi.interiors_rjy-DRHjyE4kyY1.mp4',
    poster: '/reels/hero-final/posters/instagram-dayanidhi.interiors_rjy-DRHjyE4kyY1.webp',
  },
  {
    id: 'hero-final-freshandfresh-1',
    title: 'Fresh & Fresh Campaign I',
    client: 'Fresh & Fresh',
    description: 'High-retention product and store storytelling reel.',
    src: '/reels/hero-final/instagram-freshandfresh_official-Ddsiv4hSx3a.mp4',
    lightSrc: '/reels/hero-final/instagram-freshandfresh_official-Ddsiv4hSx3a.mp4',
    poster: '/reels/hero-final/posters/instagram-freshandfresh_official-Ddsiv4hSx3a.webp',
  },
  {
    id: 'hero-final-freshandfresh-2',
    title: 'Fresh & Fresh Campaign II',
    client: 'Fresh & Fresh',
    description: 'Dynamic retail hook and customer engagement reel.',
    src: '/reels/hero-final/instagram-freshandfresh_official-DfGpfzCyhFv.mp4',
    lightSrc: '/reels/hero-final/instagram-freshandfresh_official-DfGpfzCyhFv.mp4',
    poster: '/reels/hero-final/posters/instagram-freshandfresh_official-DfGpfzCyhFv.webp',
  },
  {
    id: 'hero-final-jain-beauty',
    title: 'Jain Beauty Concepts',
    client: 'Jain Beauty Concepts',
    description: 'Beauty retail and studio product showcase.',
    src: '/reels/hero-final/instagram-jain_beauty_concepts-DcxaehTxSCx.mp4',
    lightSrc: '/reels/hero-final/instagram-jain_beauty_concepts-DcxaehTxSCx.mp4',
    poster: '/reels/hero-final/posters/instagram-jain_beauty_concepts-DcxaehTxSCx.webp',
  },
  {
    id: 'hero-final-kc-overseas',
    title: 'KC Overseas Education',
    client: 'KC Overseas',
    description: 'Global study abroad consultancy campaign reel.',
    src: '/reels/hero-final/instagram-kc_overseas_rjy-DTDHx1REsW0.mp4',
    lightSrc: '/reels/hero-final/instagram-kc_overseas_rjy-DTDHx1REsW0.mp4',
    poster: '/reels/hero-final/posters/instagram-kc_overseas_rjy-DTDHx1REsW0.webp',
  },
  {
    id: 'hero-final-nirmala-1',
    title: 'Nirmala Group Showcase I',
    client: 'Nirmala Group',
    description: 'Commercial brand film and real-world customer narrative.',
    src: '/reels/hero-final/instagram-nirmala.group_bvrm-DbiXfcgoXxB.mp4',
    lightSrc: '/reels/hero-final/instagram-nirmala.group_bvrm-DbiXfcgoXxB.mp4',
    poster: '/reels/hero-final/posters/instagram-nirmala.group_bvrm-DbiXfcgoXxB.webp',
  },
  {
    id: 'hero-final-nirmala-2',
    title: 'Nirmala Group Showcase II',
    client: 'Nirmala Group',
    description: 'High-impact regional brand storytelling reel.',
    src: '/reels/hero-final/instagram-nirmala.group_bvrm-DdIjh8VInS2.mp4',
    lightSrc: '/reels/hero-final/instagram-nirmala.group_bvrm-DdIjh8VInS2.mp4',
    poster: '/reels/hero-final/posters/instagram-nirmala.group_bvrm-DdIjh8VInS2.webp',
  },
  {
    id: 'hero-final-rudra-silver',
    title: 'Rudra Sterling Silver',
    client: 'Rudra Sterling Silver',
    description: 'Fine sterling silver craftsmanship and collection reel.',
    src: '/reels/hero-final/instagram-rudra.sterlingsilver_rjy-De8baNYx0AT.mp4',
    lightSrc: '/reels/hero-final/instagram-rudra.sterlingsilver_rjy-De8baNYx0AT.mp4',
    poster: '/reels/hero-final/posters/instagram-rudra.sterlingsilver_rjy-De8baNYx0AT.webp',
  },
  {
    id: 'hero-final-sahana-dryfruits',
    title: 'Sahana Dryfruits',
    client: 'Sahana Dryfruits',
    description: 'FMCG packaging and brand growth video campaign.',
    src: '/reels/hero-final/instagram-sahana.dryfruits_rjy-DWtbi7_CTZa.mp4',
    lightSrc: '/reels/hero-final/instagram-sahana.dryfruits_rjy-DWtbi7_CTZa.mp4',
    poster: '/reels/hero-final/posters/instagram-sahana.dryfruits_rjy-DWtbi7_CTZa.webp',
  },
  {
    id: 'hero-final-saileela',
    title: 'Saileela Corporation',
    client: 'Saileela Corporation',
    description: 'Industrial and enterprise brand presentation reel.',
    src: '/reels/hero-final/instagram-saileela.corporation_rjy-DfroKUNqXsW.mp4',
    lightSrc: '/reels/hero-final/instagram-saileela.corporation_rjy-DfroKUNqXsW.mp4',
    poster: '/reels/hero-final/posters/instagram-saileela.corporation_rjy-DfroKUNqXsW.webp',
  },
  {
    id: 'hero-final-santhi-pipes-1',
    title: 'Santhi Pipes Showcase I',
    client: 'Santhi Pipes',
    description: 'High-velocity industrial cinematography and product feature.',
    src: '/reels/hero-final/instagram-santhi.pipes_rjy-Dcixda7oj6N.mp4',
    lightSrc: '/reels/hero-final/instagram-santhi.pipes_rjy-Dcixda7oj6N.mp4',
    poster: '/reels/hero-final/posters/instagram-santhi.pipes_rjy-Dcixda7oj6N.webp',
  },
  {
    id: 'hero-final-santhi-pipes-2',
    title: 'Santhi Pipes Showcase II',
    client: 'Santhi Pipes',
    description: 'Dealer-focused industrial brand film and vertical reel.',
    src: '/reels/hero-final/instagram-santhi.pipes_rjy-DdDZPGxoTy9.mp4',
    lightSrc: '/reels/hero-final/instagram-santhi.pipes_rjy-DdDZPGxoTy9.mp4',
    poster: '/reels/hero-final/posters/instagram-santhi.pipes_rjy-DdDZPGxoTy9.webp',
  },
  {
    id: 'hero-final-sb-ventures',
    title: 'SB Ventures',
    client: 'SB Ventures',
    description: 'Real estate and commercial development showcase.',
    src: '/reels/hero-final/instagram-sbventures_official-De37jSli5r3.mp4',
    lightSrc: '/reels/hero-final/instagram-sbventures_official-De37jSli5r3.mp4',
    poster: '/reels/hero-final/posters/instagram-sbventures_official-De37jSli5r3.webp',
  },
  {
    id: 'hero-final-srk-doors',
    title: 'SRK Doors World',
    client: 'SRK Doors World',
    description: 'Architectural doors and interior craftsmanship reel.',
    src: '/reels/hero-final/instagram-srk.doorsworld_rjy-Db4vJMYRkwe.mp4',
    lightSrc: '/reels/hero-final/instagram-srk.doorsworld_rjy-Db4vJMYRkwe.mp4',
    poster: '/reels/hero-final/posters/instagram-srk.doorsworld_rjy-Db4vJMYRkwe.webp',
  },
  {
    id: 'hero-final-tea3',
    title: 'Tea3 Official',
    client: 'Tea3 Official',
    description: 'Hospitality, café culture, and culinary storytelling reel.',
    src: '/reels/hero-final/instagram-tea3_official-DUPeMSJEZ6N.mp4',
    lightSrc: '/reels/hero-final/instagram-tea3_official-DUPeMSJEZ6N.mp4',
    poster: '/reels/hero-final/posters/instagram-tea3_official-DUPeMSJEZ6N.webp',
  },
];

/**
 * Warm the hero carousel poster frames and middle video stream while the preloader is visible.
 */
export function preloadAllHeroReels(): void {
  if (typeof window === 'undefined') return;

  const initialReels = HERO_REEL_VIDEOS.slice(0, 4);
  initialReels.forEach((reel, idx) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = reel.poster;

    // Preload metadata for the featured middle reel (index 2) or first reel
    if (idx === 2 || idx === 0) {
      try {
        const v = document.createElement('video');
        v.preload = 'metadata';
        v.muted = true;
        v.playsInline = true;
        v.src = reel.lightSrc || reel.src;
        v.load();
      } catch {
        // Ignore background warmup exceptions
      }
    }
  });
}
