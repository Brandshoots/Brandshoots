export interface ProjectReelItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  videoUrl: string;
  posterUrl: string;
}

export interface ClientProject {
  id: string;
  slug: string;
  name: string;
  category: string;
  year: string;
  videoUrl: string;
  posterUrl: string;
  logoUrl?: string;
  instagram?: string;
  instagramUrl?: string;
  headline: string;
  story: string;
  challenge?: string;
  solution?: string;
  deliverables: string[];
  metrics?: { label: string; value: string }[];
  reels: ProjectReelItem[];
}

export const CLIENT_PROJECTS: ClientProject[] = [
  {
    id: 'santhi-pipes',
    slug: 'santhi-pipes',
    name: 'Santhi Pipes',
    category: 'Commercial Production',
    year: '2026',
    videoUrl: '/reels/santhi.pipes_rjy/santhi.pipes_rjy_2026-05-31_18-02-19_3909180466433077679_48644092133.mp4',
    posterUrl: '/reels/thumbnails/santhi.pipes_rjy_2026-05-31_18-02-19_3909180466433077679_48644092133.jpg',
    logoUrl: '/clients/Shanti Pipes.png',
    instagram: '@santhi.pipes_rjy',
    instagramUrl: 'https://www.instagram.com/santhi.pipes_rjy/',
    headline: 'High-Velocity Industrial Cinematography',
    story: 'Engineered commercial filmmaking capturing industrial manufacturing precision, high-speed automated extrusion lines, and large-scale warehouse operations. Our directional lighting and dynamic tracking brought raw PVC engineering into sharp, cinematic focus.',
    challenge: 'Transform raw polymer extrusion manufacturing into a visually compelling, premium narrative that communicates engineering tolerance, scale, and high-volume reliability.',
    solution: 'Deployed high-speed cinema cameras with specialized anamorphic glass, automated robotic slider tracks through active extrusion lines, and dramatic volumetric industrial lighting.',
    deliverables: [
      'High-Speed Extrusion Lines & Heavy Machinery',
      'Large-Scale Warehouse & Logistics Cinematography',
      'High-Retention Commercial Social Cut',
    ],
    metrics: [
      { label: 'Views', value: '250K+' },
      { label: 'Followers', value: '18K+' },
      { label: 'Likes', value: '34K+' },
    ],
    reels: [
      {
        id: 'sp-01',
        title: 'Industrial Commercial Master',
        category: 'Brand Anthem',
        duration: '0:34',
        videoUrl: '/reels/santhi.pipes_rjy/santhi.pipes_rjy_2026-05-31_18-02-19_3909180466433077679_48644092133.mp4',
        posterUrl: '/reels/thumbnails/santhi.pipes_rjy_2026-05-31_18-02-19_3909180466433077679_48644092133.jpg',
      },
      {
        id: 'sp-02',
        title: 'Automated Extrusion Robotics Cut',
        category: 'Precision Motion',
        duration: '0:28',
        videoUrl: '/reels/santhi.pipes_rjy/santhi.pipes_rjy_2026-05-31_18-02-19_3909180466433077679_48644092133.mp4',
        posterUrl: '/reels/thumbnails/santhi.pipes_rjy_2026-05-31_18-02-19_3909180466433077679_48644092133.jpg',
      },
    ],
  },
  {
    id: 'viswatuff-glass',
    slug: 'viswatuff-glass',
    name: 'Viswatuff Glass',
    category: 'Architectural Film',
    year: '2026',
    videoUrl: '/reels/viswatuff.glass_rjy/viswatuff.glass_rjy_2026-05-28_18-00-28_3907005057329571857_78432309239.mp4',
    posterUrl: '/reels/thumbnails/viswatuff.glass_rjy_2026-05-28_18-00-28_3907005057329571857_78432309239.jpg',
    logoUrl: '/clients/Viswatuff Glass Logo.png',
    instagram: '@viswatuff.glass_rjy',
    instagramUrl: 'https://www.instagram.com/viswatuff.glass_rjy/',
    headline: 'Architectural Glazing & Commercial Space Showcase',
    story: 'Created high-impact commercial video content showcasing their factory operations, structural toughened glass processing, and architectural installations with clean, cinematic camera movements.',
    challenge: 'Capturing clear, reflective glass without unwanted reflections or distortion while demonstrating optical purity and structural impact resistance.',
    solution: 'Crafted polarized optical lighting rigs with anamorphic flared rim lights, shooting in ultra-high contrast dark spatial environments.',
    deliverables: [
      'Complete Factory & Warehouse Walkthrough',
      'Toughened Glass Impact, Clarity & Processing',
      'High-Retention Commercial Social Cut',
    ],
    metrics: [
      { label: 'Views', value: '380K+' },
      { label: 'Followers', value: '24K+' },
      { label: 'Likes', value: '45K+' },
    ],
    reels: [
      {
        id: 'vg-01',
        title: 'Architectural Master Film',
        category: 'Commercial Showcase',
        duration: '0:36',
        videoUrl: '/reels/viswatuff.glass_rjy/viswatuff.glass_rjy_2026-05-28_18-00-28_3907005057329571857_78432309239.mp4',
        posterUrl: '/reels/thumbnails/viswatuff.glass_rjy_2026-05-28_18-00-28_3907005057329571857_78432309239.jpg',
      },
    ],
  },
  {
    id: 'bags-world',
    slug: 'bags-world',
    name: 'Bags World',
    category: 'Retail Brand Campaign',
    year: '2026',
    videoUrl: '/reels/bags.world_rjy/bags.world_rjy_2025-09-09_09-40-28_3717579195573459823_54511918250.mp4',
    posterUrl: '/reels/thumbnails/bags.world_rjy_2025-09-09_09-40-28_3717579195573459823_54511918250.jpg',
    logoUrl: '/clients/Bags World Logo.PNG',
    instagram: '@bags.world_rjy',
    instagramUrl: 'https://www.instagram.com/bags.world_rjy/',
    headline: 'Fast-Cut Luxury Retail Visual Rhythm',
    story: 'Dynamic camera dolly movements, saturated studio lighting, and high-energy pacing designed to captivate mobile attention in the first 2 seconds.',
    challenge: 'Stand out in an ultra-saturated consumer travel accessories market where attention drop-off occurs within the first 1.5 seconds.',
    solution: 'Engineered rapid match-cuts, zero-friction transition wipes, bespoke sound design hits, and hyper-saturated editorial color styling.',
    deliverables: [
      'Runway-Style Kinetic Product Showcase',
      'Vibrant Color Grading & Studio Lighting',
      'High-Converting Social Media Hook Reels',
    ],
    metrics: [
      { label: 'Views', value: '310K+' },
      { label: 'Followers', value: '21K+' },
      { label: 'Likes', value: '52K+' },
    ],
    reels: [
      {
        id: 'bw-01',
        title: 'Runway Kinetic Anthem',
        category: 'Hero Commercial',
        duration: '0:28',
        videoUrl: '/reels/bags.world_rjy/bags.world_rjy_2025-09-09_09-40-28_3717579195573459823_54511918250.mp4',
        posterUrl: '/reels/thumbnails/bags.world_rjy_2025-09-09_09-40-28_3717579195573459823_54511918250.jpg',
      },
    ],
  },
  {
    id: 'aabharan-jewellers',
    slug: 'aabharan-jewellers',
    name: 'Aabharan Jewellers',
    category: 'Luxury Commercial Reel',
    year: '2026',
    videoUrl: '/reels/aabharan_womens_accessories/aabharan_womens_accessories_2026-05-30_10-01-21_3908213461611903133_45301478774.mp4',
    posterUrl: '/reels/thumbnails/aabharan_womens_accessories_2026-05-30_10-01-21_3908213461611903133_45301478774.jpg',
    logoUrl: '/clients/Aabharan Logo.png',
    instagram: '@aabharan_womens_accessories',
    instagramUrl: 'https://www.instagram.com/aabharan_womens_accessories/',
    headline: 'Bespoke Traditional Goldsmithing & Heritage',
    story: 'Intimate macro jewelry cinematography illuminating delicate handcrafted gold details, royal heritage silhouettes, and directional rim lighting.',
    challenge: 'Communicate the intricate micro-craftsmanship of heritage handcrafted jewelry while maintaining emotional reverence and bridal splendor.',
    solution: 'Utilized ultra-high magnification macro cinema probes with controlled motorized turntable movements and warm incandescent lighting cues.',
    deliverables: [
      'Macro Jewelry & Gold Craftsmanship',
      'Heritage Bridal Cinematic Storytelling',
      'High-Retention Commercial Reels',
    ],
    metrics: [
      { label: 'Views', value: '420K+' },
      { label: 'Followers', value: '32K+' },
      { label: 'Likes', value: '68K+' },
    ],
    reels: [
      {
        id: 'aj-01',
        title: 'Heritage Goldsmithing Masterpiece',
        category: 'Royal Heritage Reel',
        duration: '0:32',
        videoUrl: '/reels/aabharan_womens_accessories/aabharan_womens_accessories_2026-05-30_10-01-21_3908213461611903133_45301478774.mp4',
        posterUrl: '/reels/thumbnails/aabharan_womens_accessories_2026-05-30_10-01-21_3908213461611903133_45301478774.jpg',
      },
      {
        id: 'aj-02',
        title: 'Macro Gold Textures & Silhouette Rim',
        category: 'Macro Cinema',
        duration: '0:26',
        videoUrl: '/reels/aabharan_womens_accessories/aabharan_womens_accessories_2025-11-07_09-55-09_3760356251675447611_45301478774.mp4',
        posterUrl: '/reels/thumbnails/aabharan_womens_accessories_2025-11-07_09-55-09_3760356251675447611_45301478774.jpg',
      },
      {
        id: 'aj-03',
        title: 'Bridal Opulence & Traditional Craft',
        category: 'Bridal Campaign',
        duration: '0:29',
        videoUrl: '/reels/aabharan_womens_accessories/aabharan_womens_accessories_2025-10-17_10-00-00_3745139393318603226_45301478774.mp4',
        posterUrl: '/reels/thumbnails/aabharan_womens_accessories_2025-10-17_10-00-00_3745139393318603226_45301478774.jpg',
      },
    ],
  },
  {
    id: 'sahana-dryfruits',
    slug: 'sahana-dryfruits',
    name: 'Sahana Dry Fruits',
    category: 'Food & Gourmet Retail',
    year: '2026',
    videoUrl: '/reels/sahana.dryfruits_rjy/sahana.dryfruits_rjy_2026-07-05_17-57-04_3934543118156154206_38485858909.mp4',
    posterUrl: '/reels/thumbnails/sahana.dryfruits_rjy_2026-07-05_17-57-04_3934543118156154206_38485858909.jpg',
    logoUrl: '/clients/Sahana Logo.PNG',
    instagram: '@sahana.dryfruits_rjy',
    instagramUrl: 'https://www.instagram.com/sahana.dryfruits_rjy/',
    headline: 'Artisanal Packaging & High-Speed Macro Crunch',
    story: 'High-speed food choreography capturing crisp textures, premium dry fruit gift packaging, and vibrant color dynamics tailored for premium retail discovery.',
    challenge: 'Elevate everyday dry fruits into an opulent, gift-worthy luxury experience through vertical video.',
    solution: 'Engineered specialized macro turntable lighting and slow-motion product cascades with rich organic warm lighting.',
    deliverables: [
      'High-Speed Food & Texture Cinematography',
      'Artisanal Gift Packaging Showcase',
      'Social Discovery Commercial Reels',
    ],
    metrics: [
      { label: 'Views', value: '290K+' },
      { label: 'Followers', value: '16K+' },
      { label: 'Likes', value: '38K+' },
    ],
    reels: [
      {
        id: 'sd-01',
        title: 'Artisanal Luxury Box Reveal',
        category: 'Product Commercial',
        duration: '0:30',
        videoUrl: '/reels/sahana.dryfruits_rjy/sahana.dryfruits_rjy_2026-07-05_17-57-04_3934543118156154206_38485858909.mp4',
        posterUrl: '/reels/thumbnails/sahana.dryfruits_rjy_2026-07-05_17-57-04_3934543118156154206_38485858909.jpg',
      },
    ],
  },
  {
    id: 'tea3-official',
    slug: 'tea3-official',
    name: 'Tea3 Café',
    category: 'Lifestyle & Hospitality',
    year: '2026',
    videoUrl: '/reels/tea3_official/tea3_official_2025-10-29_09-54-59_3753833688871293700_76713485685.mp4',
    posterUrl: '/reels/thumbnails/tea3_official_2025-10-29_09-54-59_3753833688871293700_76713485685.jpg',
    logoUrl: '/clients/T3 Logo.png',
    instagram: '@tea3_official',
    instagramUrl: 'https://www.instagram.com/tea3_official/',
    headline: 'Modern Beverage Culture & Urban Aesthetics',
    story: 'High-energy beverage cinematography, steam acoustics, and fast-paced aesthetic cuts designed to drive youth engagement and urban café culture.',
    challenge: 'Capture the comforting warmth and kinetic rhythm of modern brewing in a dynamic, high-retention vertical format.',
    solution: 'Shot with high-speed macro lenses focusing on pouring fluids, aromatic steam backlighting, and punchy rhythmic editing.',
    deliverables: [
      'Aromatic Beverage Pouring Cinematography',
      'Modern Urban Café Culture Storytelling',
      'Fast-Paced High-Retention Social Reels',
    ],
    metrics: [
      { label: 'Views', value: '340K+' },
      { label: 'Followers', value: '28K+' },
      { label: 'Likes', value: '49K+' },
    ],
    reels: [
      {
        id: 't3-01',
        title: 'Aromatic Pouring & Café Rhythm',
        category: 'Beverage Motion',
        duration: '0:28',
        videoUrl: '/reels/tea3_official/tea3_official_2025-10-29_09-54-59_3753833688871293700_76713485685.mp4',
        posterUrl: '/reels/thumbnails/tea3_official_2025-10-29_09-54-59_3753833688871293700_76713485685.jpg',
      },
    ],
  },
  {
    id: 'dayanidhi-interiors',
    slug: 'dayanidhi-interiors',
    name: 'Dayanidhi Interiors',
    category: 'Spatial Interior Design',
    year: '2026',
    videoUrl: '/reels/dayanidhi.interiors_rjy/dayanidhi.interiors_rjy_2025-10-07_12-00-25_3737951699329041277_72884206961.mp4',
    posterUrl: '/reels/thumbnails/dayanidhi.interiors_rjy_2025-10-07_12-00-25_3737951699329041277_72884206961.jpg',
    logoUrl: '/clients/Dayanidhi Logo.png',
    instagram: '@dayanidhi.interiors_rjy',
    instagramUrl: 'https://www.instagram.com/dayanidhi.interiors_rjy/',
    headline: 'Contemporary Architecture & Luxury Furnishings',
    story: 'Smooth gimbal camera tracking through premium living spaces, capturing bespoke furniture craftsmanship, marble textures, and ambient golden hour light.',
    challenge: 'Convey the sensory physical experience of luxury interior living spaces, wood finishes, and Italian marble surfaces through vertical video.',
    solution: 'Used ultra-wide cinema lenses on continuous motorized steady-cam rigs, timing every shot to natural golden hour window lighting.',
    deliverables: [
      'Spatial Architecture & Showroom Walkthrough',
      'Bespoke Wood & Italian Marble Focus',
      'Ambient Golden-Hour Lifestyle Film',
    ],
    metrics: [
      { label: 'Views', value: '260K+' },
      { label: 'Followers', value: '19K+' },
      { label: 'Likes', value: '31K+' },
    ],
    reels: [
      {
        id: 'di-01',
        title: 'Contemporary Luxury Living Anthem',
        category: 'Interior Architectural',
        duration: '0:35',
        videoUrl: '/reels/dayanidhi.interiors_rjy/dayanidhi.interiors_rjy_2025-10-07_12-00-25_3737951699329041277_72884206961.mp4',
        posterUrl: '/reels/thumbnails/dayanidhi.interiors_rjy_2025-10-07_12-00-25_3737951699329041277_72884206961.jpg',
      },
    ],
  },
  {
    id: 'jain-beauty',
    slug: 'jain-beauty',
    name: 'Jain Beauty Studio',
    category: 'Fashion & Editorial',
    year: '2026',
    videoUrl: '/reels/jain_beauty_concepts/jain_beauty_concepts_2025-10-16_09-55-09_3744410345428741931_48808965364.mp4',
    posterUrl: '/reels/thumbnails/jain_beauty_concepts_2025-10-16_09-55-09_3744410345428741931_48808965364.jpg',
    logoUrl: '/clients/Jain Beauty Logo.png',
    instagram: '@jain_beauty_concepts',
    instagramUrl: 'https://www.instagram.com/jain_beauty_concepts/',
    headline: 'Editorial Fashion Portraiture & Chromatic Lighting',
    story: 'Studio beauty cinematography featuring neon rim lights, fluid textile physics, and razor-sharp skin-tone fidelity designed for modern beauty tastemakers.',
    challenge: 'Deliver studio lighting and high-definition beauty textures that preserve natural skin tone while delivering bold avant-garde aesthetics.',
    solution: 'Engineered specialized diffused parabolic lighting with custom chromatic backlighting and high-speed motion tracking.',
    deliverables: [
      'Editorial Fashion & Studio Portraiture',
      'Chromatic Lighting & Dynamic Color Grading',
      'High-Impact Social Beauty Reels',
    ],
    metrics: [
      { label: 'Views', value: '480K+' },
      { label: 'Followers', value: '36K+' },
      { label: 'Likes', value: '72K+' },
    ],
    reels: [
      {
        id: 'jb-01',
        title: 'Chromatic Lighting & Editorial Staging',
        category: 'Fashion Motion',
        duration: '0:25',
        videoUrl: '/reels/jain_beauty_concepts/jain_beauty_concepts_2025-10-16_09-55-09_3744410345428741931_48808965364.mp4',
        posterUrl: '/reels/thumbnails/jain_beauty_concepts_2025-10-16_09-55-09_3744410345428741931_48808965364.jpg',
      },
      {
        id: 'jb-02',
        title: 'High-Fashion Studio Anthem',
        category: 'Editorial Beauty',
        duration: '0:30',
        videoUrl: '/reels/jain_beauty_concepts/jain_beauty_concepts_2026-09-04_17-58-58_3978756534484922098_48808965364.mp4',
        posterUrl: '/reels/thumbnails/jain_beauty_concepts_2026-09-04_17-58-58_3978756534484922098_48808965364.jpg',
      },
    ],
  },
  {
    id: 'sb-ventures',
    slug: 'sb-ventures',
    name: 'SB Ventures',
    category: 'Corporate Film',
    year: '2026',
    videoUrl: '/reels/sbventures_official/sbventures_official_2026-09-15_17-10-21_3986704799434897519_5720346010.mp4',
    posterUrl: '/reels/thumbnails/sbventures_official_2026-09-15_17-10-21_3986704799434897519_5720346010.jpg',
    logoUrl: '/clients/SB Ventures Logo.png',
    instagram: '@sbventures_official',
    instagramUrl: 'https://www.instagram.com/sbventures_official/',
    headline: 'Corporate Vision & Clean Architectural Staging',
    story: 'Sophisticated executive positioning films blending modern office cinematography, dynamic infographics, and confident stakeholder messaging.',
    challenge: 'Overcome corporate video cliches to create an authoritative, magnetic investor film that positions leadership as industry innovators.',
    solution: 'Framed corporate executives with dramatic architectural shadows, corporate drone perspectives, and motion-tracked kinetic data graphics.',
    deliverables: [
      'Executive Leadership & Vision Positioning',
      'Modern Corporate Architecture Cinematography',
      'High-Impact Commercial Presentation Cut',
    ],
    metrics: [
      { label: 'Views', value: '180K+' },
      { label: 'Followers', value: '14K+' },
      { label: 'Likes', value: '26K+' },
    ],
    reels: [
      {
        id: 'sb-01',
        title: 'Visionary Capital Corporate Anthem',
        category: 'Executive Commercial',
        duration: '0:33',
        videoUrl: '/reels/sbventures_official/sbventures_official_2026-09-15_17-10-21_3986704799434897519_5720346010.mp4',
        posterUrl: '/reels/thumbnails/sbventures_official_2026-09-15_17-10-21_3986704799434897519_5720346010.jpg',
      },
    ],
  },
  {
    id: 'kc-overseas',
    slug: 'kc-overseas',
    name: 'KC Overseas',
    category: 'Global Horizons',
    year: '2026',
    videoUrl: '/reels/kc_overseas_rjy/kc_overseas_rjy_2025-10-28_11-56-25_3753167479003838060_46988266664.mp4',
    posterUrl: '/reels/thumbnails/kc_overseas_rjy_2025-10-28_11-56-25_3753167479003838060_46988266664.jpg',
    logoUrl: '/clients/KC Overseas Logo.PNG',
    instagram: '@kc_overseas_rjy',
    instagramUrl: 'https://www.instagram.com/kc_overseas_rjy/',
    headline: 'Inspiring Documentary Student Journeys',
    story: 'Aspirational documentary storytelling following student ambitions across international borders, capturing authentic emotion and institutional credibility.',
    challenge: 'Capture the vulnerability, excitement, and triumph of students embarking on overseas education without feeling staged or commercialized.',
    solution: 'Adopted an intimate documentary cinema-verite approach with natural ambient sound design, hand-held cinema lenses, and unscripted testimonials.',
    deliverables: [
      'Aspirational Student Documentary Stories',
      'Global Campus & Educational Credibility',
      'High-Converting Social Reels Engine',
    ],
    metrics: [
      { label: 'Views', value: '320K+' },
      { label: 'Followers', value: '22K+' },
      { label: 'Likes', value: '41K+' },
    ],
    reels: [
      {
        id: 'kc-01',
        title: 'Global Ambitions Documentary Anthem',
        category: 'Documentary Commercial',
        duration: '0:36',
        videoUrl: '/reels/kc_overseas_rjy/kc_overseas_rjy_2025-10-28_11-56-25_3753167479003838060_46988266664.mp4',
        posterUrl: '/reels/thumbnails/kc_overseas_rjy_2025-10-28_11-56-25_3753167479003838060_46988266664.jpg',
      },
    ],
  },
  {
    id: 'newplayzone',
    slug: 'newplayzone',
    name: 'PlayZone Entertainment',
    category: 'Commercial Campaign',
    year: '2026',
    videoUrl: '/reels/newplayzone_rjy/newplayzone_rjy_2025-09-23_09-49-41_3727739247089824309_76443365829.mp4',
    posterUrl: '/reels/thumbnails/newplayzone_rjy_2025-09-23_09-49-41_3727739247089824309_76443365829.jpg',
    instagram: '@newplayzone_rjy',
    instagramUrl: 'https://www.instagram.com/newplayzone_rjy/',
    headline: 'High-Energy Family Entertainment & Kinetic Flow',
    story: 'Fast-cut dynamic sports and arcade cinematography with saturated colored neon staging and high-speed motion tracking.',
    deliverables: [
      'Kinetic Arcade & Arena Action Cinematography',
      'Vibrant Neon Staging & Fast Motion Tracking',
      'High-Energy Family Entertainment Cuts',
    ],
    metrics: [
      { label: 'Views', value: '360K+' },
      { label: 'Followers', value: '25K+' },
      { label: 'Likes', value: '58K+' },
    ],
    reels: [
      {
        id: 'pz-01',
        title: 'Arcade Arena High-Velocity Anthem',
        category: 'Energy Commercial',
        duration: '0:26',
        videoUrl: '/reels/newplayzone_rjy/newplayzone_rjy_2025-09-23_09-49-41_3727739247089824309_76443365829.mp4',
        posterUrl: '/reels/thumbnails/newplayzone_rjy_2025-09-23_09-49-41_3727739247089824309_76443365829.jpg',
      },
    ],
  },
  {
    id: 'advocate-leela-srinivas',
    slug: 'advocate-leela-srinivas',
    name: 'Adv. Leela Srinivas',
    category: 'Professional Brand Film',
    year: '2026',
    videoUrl: '/reels/advocate.leela_srinivas/advocate.leela_srinivas_2026-01-21_14-13-22_3814844111292151959_72156082142.mp4',
    posterUrl: '/reels/thumbnails/advocate.leela_srinivas_2026-01-21_14-13-22_3814844111292151959_72156082142.jpg',
    instagram: '@advocate.leela_srinivas',
    instagramUrl: 'https://www.instagram.com/advocate.leela_srinivas/',
    headline: 'Authoritative Personal Brand Storytelling',
    story: 'Classic portrait cinematography and authoritative legal storytelling emphasizing institutional trust, human advocacy, and courtroom integrity.',
    deliverables: [
      'Authoritative Legal Leadership Portraiture',
      'Institutional Trust & Advocacy Messaging',
      'High-Clarity Personal Brand Series',
    ],
    metrics: [
      { label: 'Views', value: '210K+' },
      { label: 'Followers', value: '17K+' },
      { label: 'Likes', value: '29K+' },
    ],
    reels: [
      {
        id: 'als-01',
        title: 'The Counsel of Integrity Anthem',
        category: 'Legal Portrait',
        duration: '0:31',
        videoUrl: '/reels/advocate.leela_srinivas/advocate.leela_srinivas_2026-01-21_14-13-22_3814844111292151959_72156082142.mp4',
        posterUrl: '/reels/thumbnails/advocate.leela_srinivas_2026-01-21_14-13-22_3814844111292151959_72156082142.jpg',
      },
      {
        id: 'als-02',
        title: 'Courtroom Ethics & Legal Mastery',
        category: 'Authority Cinema',
        duration: '0:28',
        videoUrl: '/reels/advocate.leela_srinivas/advocate.leela_srinivas_2025-11-10_09-54-37_3762530824236245592_72156082142.mp4',
        posterUrl: '/reels/thumbnails/advocate.leela_srinivas_2025-11-10_09-54-37_3762530824236245592_72156082142.jpg',
      },
    ],
  },
];

export interface ClientLogoItem {
  id: string;
  name: string;
  logoUrl: string;
  slug?: string;
}

export const ALL_CLIENT_LOGOS: ClientLogoItem[] = [
  { id: 'santhi-pipes', name: 'Santhi Pipes', logoUrl: '/clients/Shanti Pipes.png', slug: 'santhi-pipes' },
  { id: 'viswatuff-glass', name: 'Viswatuff Glass', logoUrl: '/clients/Viswatuff Glass Logo.png', slug: 'viswatuff-glass' },
  { id: 'bags-world', name: 'Bags World', logoUrl: '/clients/Bags World Logo.PNG', slug: 'bags-world' },
  { id: 'aabharan', name: 'Aabharan Jewellers', logoUrl: '/clients/Aabharan Logo.png', slug: 'aabharan-jewellers' },
  { id: 'fresh-fresh', name: 'Fresh & Fresh', logoUrl: '/clients/Fresh and Fresh Logo.png', slug: 'fresh-and-fresh' },
  { id: 'dayanidhi', name: 'Dayanidhi Creations', logoUrl: '/clients/Dayanidhi Logo.png', slug: 'dayanidhi-creations' },
  { id: 'jain-beauty', name: 'Jain Beauty Studio', logoUrl: '/clients/Jain Beauty Logo.png', slug: 'jain-beauty' },
  { id: 'rk-home', name: 'RK Home Living', logoUrl: '/clients/Rk home.png', slug: 'rk-home-living' },
  { id: 'sb-ventures', name: 'SB Ventures', logoUrl: '/clients/SB Ventures Logo.png', slug: 'sb-ventures' },
  { id: 'kc-overseas', name: 'KC Overseas', logoUrl: '/clients/KC Overseas Logo.PNG', slug: 'kc-overseas' },
  { id: 'jain-ent', name: 'Jain Enterprises', logoUrl: '/clients/Jain Enterprises Logo.png' },
  { id: 'nirmala', name: 'Nirmala', logoUrl: '/clients/Nirmala logo.png' },
  { id: 'rudra', name: 'Rudra', logoUrl: '/clients/Rudra logo.png' },
  { id: 'sahana', name: 'Sahana', logoUrl: '/clients/Sahana Logo.PNG' },
  { id: 'srk-doors', name: 'SRK Doors World', logoUrl: '/clients/SRK Doors World Logo.png' },
  { id: 't3', name: 'T3', logoUrl: '/clients/T3 Logo.png' },
];
