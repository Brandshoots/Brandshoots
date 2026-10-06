export interface ClientProject {
  id: string;
  slug: string;
  name: string;
  category: string;
  year: string;
  videoUrl: string;
  posterUrl: string;
  logoUrl?: string;
  headline: string;
  story: string;
  deliverables: string[];
  metrics?: { label: string; value: string }[];
}

export const CLIENT_PROJECTS: ClientProject[] = [
  {
    id: 'santhi-pipes',
    slug: 'santhi-pipes',
    name: 'Santhi Pipes',
    category: 'Commercial Production',
    year: '2026',
    videoUrl: '/reels/santhi.pipes_rjy_1783494112_3936556116926232206_48644092133.mp4',
    posterUrl: '/reels/posters/santhi.pipes_rjy_1783494112_3936556116926232206_48644092133.jpg',
    logoUrl: '/clients/Shanti Pipes.png',
    headline: 'High-Velocity Industrial Cinematography',
    story: 'Engineered commercial filmmaking capturing industrial manufacturing precision, high-speed automated extrusion lines, and monolithic warehouse architecture.',
    deliverables: ['Industrial Film', 'Brand Commercial', '4K Drone Aerials', 'Social Teaser Stream'],
    metrics: [
      { label: 'Retention Rate', value: '88.4%' },
      { label: 'Organic Views', value: '250K+' },
    ],
  },
  {
    id: 'viswatuff-glass',
    slug: 'viswatuff-glass',
    name: 'Viswatuff Glass',
    category: 'Architectural Film',
    year: '2026',
    videoUrl: '/reels/viswatuff.glass_rjy_1791174653_4000984496274606409_78432309239.mp4',
    posterUrl: '/reels/posters/viswatuff.glass_rjy_1791174653_4000984496274606409_78432309239.jpg',
    logoUrl: '/clients/IMG_4537.PNG',
    headline: 'Monolithic Architectural Scale & Light Refraction',
    story: 'Exploring spatial transparency and optical refraction through anamorphic glass, highlighting monumental commercial glass installations.',
    deliverables: ['Architectural Film', 'Brand Positioning', '9:16 Vertical Showcases', 'Lighting Staging'],
    metrics: [
      { label: 'Brand Reach', value: '380K+' },
      { label: 'Inquiries', value: '+142%' },
    ],
  },
  {
    id: 'bags-world',
    slug: 'bags-world',
    name: 'Bags World',
    category: 'Retail Brand Campaign',
    year: '2026',
    videoUrl: '/reels/wearebrandshoots_1777444216_3885805244420742638_77785749886.mp4',
    posterUrl: '/reels/posters/wearebrandshoots_1777444216_3885805244420742638_77785749886.jpg',
    logoUrl: '/clients/Bags World Logo.PNG',
    headline: 'Fast-Cut Luxury Retail Visual Rhythm',
    story: 'Dynamic camera dolly movements, saturated studio lighting, and high-energy pacing designed to captivate mobile attention in the first 2 seconds.',
    deliverables: ['Campaign Architecture', 'Viral Hook Reels', 'Color Master Finishing', 'Sound Design'],
    metrics: [
      { label: 'Engagement Rate', value: '14.2%' },
      { label: 'Catalog Lift', value: '+310%' },
    ],
  },
  {
    id: 'aabharan-jewellers',
    slug: 'aabharan-jewellers',
    name: 'Aabharan Jewellers',
    category: 'Luxury Commercial Reel',
    year: '2026',
    videoUrl: '/reels/wearebrandshoots_1786454245_3961387117295433628_77785749886.mp4',
    posterUrl: '/reels/posters/wearebrandshoots_1786454245_3961387117295433628_77785749886.jpg',
    logoUrl: '/clients/Aabharan Logo.png',
    headline: 'Bespoke Traditional Goldsmithing & Heritage',
    story: 'Intimate macro jewelry cinematography illuminating delicate handcrafted gold details, royal heritage silhouettes, and directional rim lighting.',
    deliverables: ['Luxury Macro Cinema', 'Storytelling Reels', 'High-Dynamic Range Color', 'Aesthetic Music Score'],
    metrics: [
      { label: 'Shares', value: '45K+' },
      { label: 'Direct Leads', value: '+85%' },
    ],
  },
  {
    id: 'fresh-and-fresh',
    slug: 'fresh-and-fresh',
    name: 'Fresh & Fresh',
    category: 'Food & Beverage',
    year: '2026',
    videoUrl: '/reels/wearebrandshoots_1786854627_3964745654666992928_77785749886.mp4',
    posterUrl: '/reels/posters/wearebrandshoots_1786854627_3964745654666992928_77785749886.jpg',
    logoUrl: '/clients/Fresh and Fresh Logo.png',
    headline: 'Culinary Kinetic Motion & Appetite Appeal',
    story: 'High-speed food choreography capturing crisp textures, fresh ingredient explosions, and punchy editorial cuts tailored for viral culinary discovery.',
    deliverables: ['Food Cinematography', 'High-Speed Capture', 'Kinetic Post-Production', 'Shorts Packaging'],
    metrics: [
      { label: 'Video Completion', value: '92%' },
      { label: 'Store Footfall', value: '+68%' },
    ],
  },
  {
    id: 'dayanidhi-creations',
    slug: 'dayanidhi-creations',
    name: 'Dayanidhi Creations',
    category: 'Narrative Campaign',
    year: '2026',
    videoUrl: '/reels/wearebrandshoots_1787252706_3968084628303865353_77785749886.mp4',
    posterUrl: '/reels/posters/wearebrandshoots_1787252706_3968084628303865353_77785749886.jpg',
    logoUrl: '/clients/Dayanidhi Logo.png',
    headline: 'Emotional Storytelling & Studio Lighting',
    story: 'Deep emotional resonance paired with directional key light, cinematic slow motion, and character-driven narrative direction.',
    deliverables: ['Brand Story Film', 'Cinematic Direction', 'Original Score Audio', 'Festival Cut'],
    metrics: [
      { label: 'Audience Sentiment', value: '99% Pos' },
      { label: 'Brand Recognition', value: '+175%' },
    ],
  },
  {
    id: 'jain-beauty',
    slug: 'jain-beauty',
    name: 'Jain Beauty Studio',
    category: 'Fashion & Beauty',
    year: '2026',
    videoUrl: '/reels/wearebrandshoots_1788094941_3975150238988110104_77785749886.mp4',
    posterUrl: '/reels/posters/wearebrandshoots_1788094941_3975150238988110104_77785749886.jpg',
    logoUrl: '/clients/Jain Beauty Logo.png',
    headline: 'Editorial Fashion Portraiture & Lighting',
    story: 'Studio beauty cinematography featuring neon rim lights, fluid textile physics, and razor-sharp skin-tone fidelity.',
    deliverables: ['Editorial Fashion Reels', 'Studio Staging', 'Glamour Color Grading', 'Trend Audio Tracks'],
    metrics: [
      { label: 'Follower Growth', value: '+42K' },
      { label: 'Engagement Rate', value: '18.4%' },
    ],
  },
  {
    id: 'rk-home-living',
    slug: 'rk-home-living',
    name: 'RK Home Living',
    category: 'Interior Architecture',
    year: '2026',
    videoUrl: '/reels/wearebrandshoots_1789108387_3983651808436403394_77785749886.mp4',
    posterUrl: '/reels/posters/wearebrandshoots_1789108387_3983651808436403394_77785749886.jpg',
    logoUrl: '/clients/Rk home.png',
    headline: 'Spatial Living Depth & Bespoke Furnishings',
    story: 'Smooth gimbal track sequences across contemporary architectural living spaces, capturing textures, morning ambient light, and ergonomics.',
    deliverables: ['Spatial Architecture Film', 'Showroom Experience', 'Social Walkthroughs', 'Soundscaping'],
    metrics: [
      { label: 'Client Inquiries', value: '+210%' },
      { label: 'Showroom Visits', value: '+95%' },
    ],
  },
  {
    id: 'sb-ventures',
    slug: 'sb-ventures',
    name: 'SB Ventures',
    category: 'Corporate Film',
    year: '2026',
    videoUrl: '/reels/wearebrandshoots_1789541302_3987282906831722378_77785749886.mp4',
    posterUrl: '/reels/posters/wearebrandshoots_1789541302_3987282906831722378_77785749886.jpg',
    logoUrl: '/clients/SB Ventures Logo.png',
    headline: 'Corporate Vision & Clean Architectural Staging',
    story: 'Sophisticated executive positioning films blending modern office cinematography, dynamic infographics, and confident stakeholder messaging.',
    deliverables: ['Corporate Anthem Film', 'Executive Interviews', 'Motion Graphics Package', 'Investor Cut'],
    metrics: [
      { label: 'Investor Reach', value: '100K+' },
      { label: 'Global Retention', value: '84%' },
    ],
  },
  {
    id: 'kc-overseas',
    slug: 'kc-overseas',
    name: 'KC Overseas',
    category: 'Global Horizons',
    year: '2026',
    videoUrl: '/reels/wearebrandshoots_1790170837_3992564060770112832_77785749886.mp4',
    posterUrl: '/reels/posters/wearebrandshoots_1790170837_3992564060770112832_77785749886.jpg',
    logoUrl: '/clients/KC Overseas Logo.PNG',
    headline: 'Inspiring Documentary Student Journeys',
    story: 'Aspirational documentary storytelling following student ambitions across international borders, capturing authentic emotion and institutional credibility.',
    deliverables: ['Documentary Campaign', 'Student Spotlights', 'Micro-Reel Content Engine', 'Multi-Language Edits'],
    metrics: [
      { label: 'Admissions Surge', value: '+62%' },
      { label: 'Organic Shares', value: '38K' },
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
  { id: 'viswatuff-glass', name: 'Viswatuff Glass', logoUrl: '/clients/IMG_4537.PNG', slug: 'viswatuff-glass' },
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

