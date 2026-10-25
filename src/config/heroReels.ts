export interface HeroReelVideo {
  id: string;
  title: string;
  client: string;
  src: string;         // Full 1080p high-resolution stream (for center/focal reels)
  lightSrc: string;    // Lightweight 540p stream (for visible peripheral reels)
  poster: string;      // Crystal-clear HD poster
}

export const HERO_REEL_VIDEOS: HeroReelVideo[] = [
  // 1. BrandShoots Team in Studio
  {
    id: 'hero-bs-team',
    title: 'BrandShoots Creative Studio',
    client: 'BrandShoots',
    src: '/reels/wearebrandshoots/wearebrandshoots_2026-04-02_19-52-00_3866474098000140140_77785749886_2.mp4',
    lightSrc: '/reels_light/wearebrandshoots_2026-04-02.mp4',
    poster: '/reels/thumbnails/wearebrandshoots_2026-04-02_19-52-00_3866474098000140140_77785749886_2.jpg'
  },
  // 2. CERA / Dayanidhi Interiors
  {
    id: 'hero-dayanidhi',
    title: 'Dayanidhi Creations',
    client: 'Dayanidhi Interiors',
    src: '/reels/dayanidhi.interiors_rjy/dayanidhi.interiors_rjy_2025-10-07_12-00-25_3737951699329041277_72884206961.mp4',
    lightSrc: '/reels_light/dayanidhi.interiors_rjy_2025-10-07.mp4',
    poster: '/reels/thumbnails/dayanidhi.interiors_rjy_2025-10-07_12-00-25_3737951699329041277_72884206961.jpg'
  },
  // 3. Aabharan Jewellers - Temple Garland Heritage
  {
    id: 'hero-aabharan',
    title: 'Aabharan Fine Jewellery',
    client: 'Aabharan Jewellers',
    src: '/reels/aabharan_womens_accessories/aabharan_womens_accessories_2025-10-17_10-00-00_3745139393318603226_45301478774.mp4',
    lightSrc: '/reels_light/aabharan_womens_accessories_2025-10-17.mp4',
    poster: '/reels/thumbnails/aabharan_womens_accessories_2025-10-17_10-00-00_3745139393318603226_45301478774.jpg'
  },
  // 4. Santhi Pipes - Factory & Phone
  {
    id: 'hero-santhi',
    title: 'Santhi Pipes Engineering',
    client: 'Santhi Pipes',
    src: '/reels/santhi.pipes_rjy/santhi.pipes_rjy_2026-09-06_10-01-41_3979966688738161477_48644092133.mp4',
    lightSrc: '/reels_light/santhi.pipes_rjy_2026-09-06.mp4',
    poster: '/reels/thumbnails/santhi.pipes_rjy_2026-09-06_10-01-41_3979966688738161477_48644092133.jpg'
  },
  // 5. Bags World - Red Train Journey
  {
    id: 'hero-bags',
    title: 'Bags World Travel',
    client: 'Bags World',
    src: '/reels/bags.world_rjy/bags.world_rjy_2025-09-09_09-40-28_3717579195573459823_54511918250.mp4',
    lightSrc: '/reels_light/bags.world_rjy_2025-09-09.mp4',
    poster: '/reels/thumbnails/bags.world_rjy_2025-09-09_09-40-28_3717579195573459823_54511918250.jpg'
  },
  // 6. BrandShoots Team Polo Walk
  {
    id: 'hero-bs-walk',
    title: 'BrandShoots Direction',
    client: 'BrandShoots',
    src: '/reels/wearebrandshoots/wearebrandshoots_2025-10-16_15-04-28_3744567634965812934_77785749886.mp4',
    lightSrc: '/reels_light/wearebrandshoots_2025-10-16.mp4',
    poster: '/reels/thumbnails/wearebrandshoots_2025-10-16_15-04-28_3744567634965812934_77785749886.jpg'
  },
  // 7. New Playzone - Festival Gathering
  {
    id: 'hero-playzone',
    title: 'New Playzone Entertainment',
    client: 'New Playzone',
    src: '/reels/newplayzone_rjy/newplayzone_rjy_2025-09-23_09-49-41_3727739247089824309_76443365829.mp4',
    lightSrc: '/reels_light/newplayzone_rjy_2025-09-23.mp4',
    poster: '/reels/thumbnails/newplayzone_rjy_2025-09-23_09-49-41_3727739247089824309_76443365829.jpg'
  },
  // 8. Viswatuff Glass - Architectural Glass Factory
  {
    id: 'hero-viswatuff',
    title: 'Viswatuff Architectural Glass',
    client: 'Viswatuff Glass',
    src: '/reels/viswatuff.glass_rjy/viswatuff.glass_rjy_2026-05-28_18-00-28_3907005057329571857_78432309239.mp4',
    lightSrc: '/reels_light/viswatuff.glass_rjy_2026-05-28.mp4',
    poster: '/reels/thumbnails/viswatuff.glass_rjy_2026-05-28_18-00-28_3907005057329571857_78432309239.jpg'
  },
  // 9. Jain Beauty Studio
  {
    id: 'hero-jain',
    title: 'Jain Beauty Studio',
    client: 'Jain Beauty Concepts',
    src: '/reels/jain_beauty_concepts/jain_beauty_concepts_2025-10-16_09-55-09_3744410345428741931_48808965364.mp4',
    lightSrc: '/reels_light/jain_beauty_concepts_2025-10-16.mp4',
    poster: '/reels/thumbnails/jain_beauty_concepts_2025-10-16_09-55-09_3744410345428741931_48808965364.jpg'
  },
  // 10. KC Overseas Global Education
  {
    id: 'hero-kc',
    title: 'KC Overseas Education',
    client: 'KC Overseas',
    src: '/reels/kc_overseas_rjy/kc_overseas_rjy_2025-10-28_11-56-25_3753167479003838060_46988266664.mp4',
    lightSrc: '/reels_light/kc_overseas_rjy_2025-10-28.mp4',
    poster: '/reels/thumbnails/kc_overseas_rjy_2025-10-28_11-56-25_3753167479003838060_46988266664.jpg'
  },
  // 11. SB Ventures Real Estate
  {
    id: 'hero-sb',
    title: 'SB Ventures Development',
    client: 'SB Ventures',
    src: '/reels/sbventures_official/sbventures_official_2026-09-15_17-10-21_3986704799434897519_5720346010.mp4',
    lightSrc: '/reels_light/sbventures_official_2026-09-15.mp4',
    poster: '/reels/thumbnails/sbventures_official_2026-09-15_17-10-21_3986704799434897519_5720346010.jpg'
  },
  // 12. Tea3 Official Hospitality
  {
    id: 'hero-tea3',
    title: 'Tea3 Hospitality & Food',
    client: 'Tea3 Official',
    src: '/reels/tea3_official/tea3_official_2025-10-29_09-54-59_3753833688871293700_76713485685.mp4',
    lightSrc: '/reels_light/tea3_official_2025-10-29.mp4',
    poster: '/reels/thumbnails/tea3_official_2025-10-29_09-54-59_3753833688871293700_76713485685.jpg'
  },
  // 13. Sahana Dryfruits FMCG
  {
    id: 'hero-sahana',
    title: 'Sahana Dryfruits Brand',
    client: 'Sahana Dryfruits',
    src: '/reels/sahana.dryfruits_rjy/sahana.dryfruits_rjy_2026-07-05_17-57-04_3934543118156154206_38485858909.mp4',
    lightSrc: '/reels_light/sahana.dryfruits_rjy_2026-07-05.mp4',
    poster: '/reels/thumbnails/sahana.dryfruits_rjy_2026-07-05_17-57-04_3934543118156154206_38485858909.jpg'
  },
  // 14. Born Pretty Studios
  {
    id: 'hero-bornpretty',
    title: 'Born Pretty Styling',
    client: 'Born Pretty Studios',
    src: '/reels/bornprettystudios_by_ranjita/bornprettystudios_by_ranjita_2025-10-26_10-10-05_3751666692112642806_67162035256.mp4',
    lightSrc: '/reels_light/bornprettystudios_by_ranjita_2025-10-26.mp4',
    poster: '/reels/thumbnails/bornprettystudios_by_ranjita_2025-10-26_10-10-05_3751666692112642806_67162035256.jpg'
  }
];

/**
 * Intelligently warm up only the immediately visible hero posters,
 * preventing network socket saturation during critical initial bundle execution.
 */
export function preloadAllHeroReels(): void {
  if (typeof window === 'undefined') return;

  // Warm up ONLY the immediately visible hero reel posters (first 3 slots)
  HERO_REEL_VIDEOS.slice(0, 3).forEach((reel) => {
    const img = new Image();
    img.src = reel.poster;
  });
}
