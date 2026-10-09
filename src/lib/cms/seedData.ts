import { CMSProject, CMSClientLogo, CMSHero, CMSService, CMSTestimonial, CMSLeadership, CMSSiteSettings } from '../../types/cms';
import { CLIENT_PROJECTS, ALL_CLIENT_LOGOS } from '../../data/clientsData';

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
  acc[client.id] = {
    ...client,
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
  updatedAt: Date.now(),
};

export const INITIAL_SERVICES: Record<string, CMSService> = {
  'video-production': {
    id: 'video-production',
    number: '01',
    titleLines: ['VIDEO', 'PRODUCTION'],
    category: 'CINEMATIC PRODUCTION',
    description: 'Commercials, brand films, product films, corporate films, and high-stakes campaign productions crafted with high-end cinematic lenses.',
    imageUrl: '/reels/posters/santhi.pipes_rjy_1783494112_3936556116926232206_48644092133.jpg',
    aspectRatio: 'cinematic',
    tag: 'CINEMATOGRAPHY & DIRECTION',
    order: 0,
    visible: true,
    updatedAt: Date.now(),
  },
  'brand-creative': {
    id: 'brand-creative',
    number: '02',
    titleLines: ['BRAND &', 'CREATIVE'],
    category: 'CREATIVE STRATEGY',
    description: 'Concept development, campaign thinking, visual direction, world-building and narrative strategy designed to position brands at the apex.',
    imageUrl: '/reels/posters/wearebrandshoots_1786454245_3961387117295433628_77785749886.jpg',
    aspectRatio: 'portrait',
    tag: 'DIRECTION & IDENTITY',
    order: 1,
    visible: true,
    updatedAt: Date.now(),
  },
  'short-form': {
    id: 'short-form',
    number: '03',
    titleLines: ['SHORT-FORM', 'CONTENT'],
    category: 'VERTICAL STORYTELLING',
    description: 'Reels, social-first films, vertical storytelling, high-retention hooks and viral retention systems that captivate algorithmic feeds.',
    imageUrl: '/reels/posters/wearebrandshoots_1777444216_3885805244420742638_77785749886.jpg',
    aspectRatio: 'portrait',
    tag: 'HIGH-RETENTION HOOKS',
    order: 2,
    visible: true,
    updatedAt: Date.now(),
  },
  'editing-post': {
    id: 'editing-post',
    number: '04',
    titleLines: ['EDITING', '& POST'],
    category: 'FINISHING & MOTION',
    description: 'Precision editing, luxury Hollywood color grading, immersive spatial sound design, and bespoke motion graphics finishing.',
    imageUrl: '/reels/posters/wearebrandshoots_1789108387_3983651808436403394_77785749886.jpg',
    aspectRatio: 'portrait',
    tag: 'PRECISION FINISHING',
    order: 3,
    visible: true,
    updatedAt: Date.now(),
  },
  'social-content': {
    id: 'social-content',
    number: '05',
    titleLines: ['SOCIAL', 'CONTENT'],
    category: 'GROWTH SYSTEMS',
    description: 'Consistent visual storytelling architectures designed for rapid audience scaling, brand authority, and sustained engagement.',
    imageUrl: '/reels/posters/wearebrandshoots_1786854627_3964745654666992928_77785749886.jpg',
    aspectRatio: 'portrait',
    tag: 'GROWTH ARCHITECTURE',
    order: 4,
    visible: true,
    updatedAt: Date.now(),
  },
  'digital-growth': {
    id: 'digital-growth',
    number: '06',
    titleLines: ['DIGITAL', 'GROWTH'],
    category: 'BRAND SCALE',
    description: 'Full-funnel digital creative systems, visual campaigns and long-term brand momentum engineered to convert viewers into advocates.',
    imageUrl: '/reels/posters/viswatuff.glass_rjy_1791174653_4000984496274606409_78432309239.jpg',
    aspectRatio: 'cinematic',
    tag: 'CATEGORY LEADERSHIP',
    order: 5,
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
