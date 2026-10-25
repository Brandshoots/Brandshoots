import { CMSProject, CMSClientLogo, CMSHero, CMSHeroReel, CMSService, CMSTestimonial, CMSLeadership, CMSSiteSettings, CMSAnnouncement, CMSContactPage } from '../../types/cms';
import { CLIENT_PROJECTS, ALL_CLIENT_LOGOS } from '../../data/clientsData';
import { HERO_REEL_VIDEOS } from '../../config/heroReels';

export const INITIAL_HERO_REELS: CMSHeroReel[] = HERO_REEL_VIDEOS.map((item, index) => ({
  id: item.id,
  title: item.title,
  client: item.client,
  src: item.src,
  lightSrc: item.lightSrc,
  poster: item.poster,
  order: index,
  visible: true,
  updatedAt: Date.now(),
}));

export const INITIAL_PROJECTS: Record<string, CMSProject> = CLIENT_PROJECTS.reduce((acc, project, index) => {
  acc[project.id] = {
    ...project,
    order: index,
    visible: true,
    updatedAt: Date.now(),
  };
  return acc;
}, {} as Record<string, CMSProject>);

export const INITIAL_CLIENTS: Record<string, CMSClientLogo> = ALL_CLIENT_LOGOS.reduce((acc, client, index) => {
  const proj = CLIENT_PROJECTS.find(
    (p) =>
      p.id === client.id ||
      p.slug === client.slug ||
      p.name.toLowerCase().trim() === client.name.toLowerCase().trim()
  );
  const viewsVal = proj?.metrics?.find((m) => m.label.toLowerCase() === 'views')?.value;
  const likesVal = proj?.metrics?.find((m) => m.label.toLowerCase() === 'likes')?.value;

  acc[client.id] = {
    ...client,
    views: viewsVal || undefined,
    likes: likesVal || undefined,
    order: index,
    visible: true,
    updatedAt: Date.now(),
  };
  return acc;
}, {} as Record<string, CMSClientLogo>);

export const INITIAL_HERO: CMSHero = {
  brandTitle: 'BRAND',
  shootsTitle: 'SHOOTS',
  taglinePrefix: 'CREATE. ',
  taglineAccent: 'SHOOT.',
  taglineSuffix: ' GROW.',
  desktopVideoUrl: '/reels/wearebrandshoots_1777444216_3885805244420742638_77785749886.mp4',
  mobileVideoUrl: '/reels/wearebrandshoots_1777444216_3885805244420742638_77785749886.mp4',
  mobilePosterUrl: '/reels/posters/wearebrandshoots_1777444216_3885805244420742638_77785749886.jpg',
  mobileDisplayMode: 'single-reel-carousel',
  mobileFeaturedTitle: 'BrandShoots Studio Reel',
  mobileFeaturedClient: 'BrandShoots',
  reels: INITIAL_HERO_REELS,
  updatedAt: Date.now(),
};

export const INITIAL_SERVICES: Record<string, CMSService> = {
  'creative-content': {
    id: 'creative-content',
    number: '01',
    titleLines: ['CREATIVE', 'CONTENT'],
    category: 'CREATIVE CONTENT',
    description: 'High-impact social films, vertical storytelling, viral hooks, and creative campaign direction engineered to captivate algorithmic feeds.',
    imageUrl: '/what-we-do/creative-content.jpg',
    videoUrl: '/reels/aabharan_womens_accessories/aabharan_womens_accessories_2026-05-30_10-01-21_3908213461611903133_45301478774.mp4',
    aspectRatio: 'portrait',
    tag: 'CREATIVE DIRECTION & HOOKS',
    order: 0,
    visible: true,
    updatedAt: Date.now(),
  },
  'digital-growth': {
    id: 'digital-growth',
    number: '02',
    titleLines: ['DIGITAL', 'GROWTH'],
    category: 'DIGITAL GROWTH',
    description: 'Full-funnel digital creative systems, visual campaigns, and scalable brand momentum engineered to convert viewers into lifelong advocates.',
    imageUrl: '/what-we-do/digital-growth.jpg',
    videoUrl: '/reels/viswatuff.glass_rjy/viswatuff.glass_rjy_2026-05-28_18-00-28_3907005057329571857_78432309239.mp4',
    aspectRatio: 'portrait',
    tag: 'CATEGORY LEADERSHIP & SCALE',
    order: 1,
    visible: true,
    updatedAt: Date.now(),
  },
  'editing-posting': {
    id: 'editing-posting',
    number: '03',
    titleLines: ['EDITING &', 'POSTING'],
    category: 'EDITING & POSTING',
    description: 'Precision cinematic editing, luxury Hollywood color grading, immersive spatial sound design, and scheduled high-impact posting across platforms.',
    imageUrl: '/what-we-do/editing-posting.jpg',
    videoUrl: '/reels/sbventures_official/sbventures_official_2026-09-15_17-10-21_3986704799434897519_5720346010.mp4',
    aspectRatio: 'portrait',
    tag: 'PRECISION FINISHING & DISTRIBUTION',
    order: 2,
    visible: true,
    updatedAt: Date.now(),
  },
};

export const INITIAL_TESTIMONIALS: Record<string, CMSTestimonial> = {
  'bags-world': {
    id: 'bags-world',
    client: 'Bags World',
    quote: 'The energy, pacing, and visual command they brought to our commercial films was electric. They gave our retail presence a nationwide luxury aura that drove unprecedented organic engagement.',
    author: 'Rajesh Jain',
    role: 'Founder & CEO',
    order: 0,
    visible: true,
    updatedAt: Date.now(),
  },
  'viswatuff': {
    id: 'viswatuff',
    client: 'Viswatuff Glass',
    quote: 'BrandShoots completely elevated how our industrial architectural products are perceived in the market. The film didn’t just showcase glass — it felt like an international luxury architectural showcase.',
    author: 'Visweswara Rao',
    role: 'Managing Director',
    order: 1,
    visible: true,
    updatedAt: Date.now(),
  },
  'aabharan': {
    id: 'aabharan',
    client: 'Aabharan Jewellers',
    quote: 'Their visual direction captured the heritage and intricate craftsmanship of our temple jewelry with breathtaking nuance. Every cut, macro shot, and transition reflected pure luxury.',
    author: 'Kiran Kumar',
    role: 'Creative Director',
    order: 2,
    visible: true,
    updatedAt: Date.now(),
  },
  'shanti-pipes': {
    id: 'shanti-pipes',
    client: 'Shanti Pipes',
    quote: 'A masterclass in industrial visual storytelling. They managed to make heavy infrastructure manufacturing look dynamic, futuristic, and commanding. Our corporate identity leveled up overnight.',
    author: 'Santhi Ramudu',
    role: 'Executive Director',
    order: 3,
    visible: true,
    updatedAt: Date.now(),
  },
  'jain-beauty': {
    id: 'jain-beauty',
    client: 'Jain Beauty Studio',
    quote: 'Every single frame was high-fashion editorial art. BrandShoots doesn’t just shoot footage; they architect an entire visual culture for your brand that resonates deeply with audiences.',
    author: 'Pooja Jain',
    role: 'Brand Lead',
    order: 4,
    visible: true,
    updatedAt: Date.now(),
  },
};

export const INITIAL_LEADERSHIP: CMSLeadership = {
  founderName: 'Durgarao Vallepu',
  founderRole: 'Founder & Creative Director',
  founderBio: 'Director, visual strategist, and commercial filmmaker dedicated to elevating Indian and global brands into cinematic legends.',
  founderImage: '/founder.png',
  updatedAt: Date.now(),
};

export const INITIAL_SITE_SETTINGS: CMSSiteSettings = {
  contactPhone: '+91 70759 60672',
  contactEmail: 'contact@brandshoots.com',
  whatsappPhone: '917075960672',
  instagramUrl: 'https://www.instagram.com/wearebrandshoots',
  youtubeUrl: 'https://www.youtube.com/@brandshoots',
  cloudinaryCloudName: '',
  updatedAt: Date.now(),
};

export const INITIAL_ANNOUNCEMENTS: Record<string, CMSAnnouncement> = {
  'ann_1': {
    id: 'ann_1',
    imageUrl: '/reels/thumbnails/sbventures_official_2026-09-15_17-10-21_3986704799434897519_5720346010.jpg',
    title: 'We Are Hiring: Senior Video Editor & Colorist',
    description: 'Join the BrandShoots studio core. We are scouting ambitious video editors & DaVinci colorists skilled in high-retention commercial cuts.',
    buttonUrl: '/contact',
    isActive: true,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'ann_2': {
    id: 'ann_2',
    imageUrl: '/reels/thumbnails/viswatuff.glass_rjy_2026-05-28_18-00-28_3907005057329571857_78432309239.jpg',
    title: 'Welcoming Our New USA Enterprise Client',
    description: 'BrandShoots goes international! Thrilled to partner with a leading tech & architectural firm in California to craft their global commercial film series.',
    buttonUrl: '/portfolio',
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'ann_3': {
    id: 'ann_3',
    imageUrl: '/reels/thumbnails/aabharan_womens_accessories_2026-05-30_10-01-21_3908213461611903133_45301478774.jpg',
    title: 'Now Booking Q4 Brand Campaigns & Studio Shoots',
    description: 'Direct collaboration with our creative directors for high-retention social-first video campaigns, luxury brand films, and multi-platform launches.',
    buttonUrl: '/contact',
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'ann_4': {
    id: 'ann_4',
    imageUrl: '/reels/thumbnails/santhi.pipes_rjy_2026-09-06_10-01-41_3979966688738161477_48644092133.jpg',
    title: 'BrandShoots Expands Studio & Commercial Cine Production',
    description: 'Elevating commercial filmmaking, high-velocity vertical reels, custom anamorphic cine lenses, and full-spectrum visual direction across South India.',
    buttonUrl: '/portfolio',
    isActive: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export const INITIAL_CONTACT_PAGE: CMSContactPage = {
  heroTitle: "LET'S MAKE SOMETHING",
  heroHighlight: 'WORTH WATCHING.',
  heroSubtitle: "Tell us what you're building, what you need, and where you want to take it.",
  heroCtaText: 'START A CONVERSATION',

  displayPhone: '+91 70759 60672',
  whatsappPhone: '917075960672',
  email: 'contact@brandshoots.com',
  cityState: 'Rajamahendravaram, Andhra Pradesh, India',
  fullAddress: '26-2-7/2, Jayakrishnapuram, near Kambala Cheruvu, Rajamahendravaram, Andhra Pradesh, India',

  googleMapsEmbedUrl:
    'https://maps.google.com/maps?q=26-2-7%2F2%2C%20Jayakrishnapuram%2C%20near%20kambala%20cheruvu%2C%20Rajamahendravaram%20533105%2C%20Andhra%20Pradesh%2C%20India&t=&z=16&ie=UTF8&iwloc=&output=embed',
  googleMapsSearchUrl:
    'https://www.google.com/maps/search/?api=1&query=26-2-7%2F2%2C+Jayakrishnapuram%2C+near+kambala+cheruvu%2C+Rajamahendravaram+533105%2C+Andhra+Pradesh%2C+India',

  siteVisitTag: 'ON-LOCATION RECCE',
  siteVisitTitle: 'SITE VISIT.',
  siteVisitDescription:
    'Need our team to inspect your factory, showroom, outdoor estate, or shoot location in person? We conduct comprehensive spatial recces, camera framing tests, and lighting assessments before production begins.',
  siteVisitPrice: '₹2,000',
  siteVisitPriceUnit: '/ visit',
  siteVisitCtaText: 'BOOK A SITE VISIT',

  instagramHandle: '@wearebrandshoots',
  instagramUrl: 'https://instagram.com/wearebrandshoots',
  youtubeHandle: '@wearebrandshoots',
  youtubeUrl: 'https://youtube.com/@wearebrandshoots',
  facebookHandle: '@wearebrandshoots',
  facebookUrl: 'https://facebook.com/wearebrandshoots',

  projectTypes: [
    'Commercial Production',
    'Brand Film',
    'Social Media Content',
    'Product Video',
    'Event / Corporate',
    'Other',
  ],
  updatedAt: Date.now(),
};
