export interface CMSProjectReel {
  id: string;
  title: string;
  category: string;
  duration: string;
  videoUrl: string;
  posterUrl: string;
}

export interface CMSProject {
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
  challenge?: string;
  solution?: string;
  deliverables: string[];
  metrics?: { label: string; value: string }[];
  reels: CMSProjectReel[];
  order: number;
  visible: boolean;
  updatedAt?: number;
}

export interface CMSClientLogo {
  id: string;
  name: string;
  logoUrl: string;
  slug?: string;
  order: number;
  visible: boolean;
  updatedAt?: number;
}

export interface CMSHeroReel {
  id: string;
  title: string;
  client: string;
  src: string;         // Full 1080p high-resolution stream (for center/focal reels)
  lightSrc?: string;    // Lightweight 540p stream (for visible peripheral reels)
  poster: string;      // Crystal-clear HD poster
  order: number;
  visible: boolean;
  updatedAt?: number;
}

export interface CMSHero {
  brandTitle: string;
  shootsTitle: string;
  taglinePrefix: string;
  taglineAccent: string;
  taglineSuffix: string;
  desktopVideoUrl?: string;
  mobileVideoUrl?: string;
  reels?: CMSHeroReel[];
  updatedAt?: number;
}

export interface CMSService {
  id: string;
  number: string;
  titleLines: string[];
  category: string;
  tag: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  aspectRatio: 'portrait' | 'cinematic';
  order: number;
  visible: boolean;
  updatedAt?: number;
}

export interface CMSTestimonial {
  id: string;
  client: string;
  quote: string;
  author: string;
  role: string;
  order: number;
  visible: boolean;
  updatedAt?: number;
}

export interface CMSLeadership {
  founderName: string;
  founderRole: string;
  founderBio: string;
  founderImage: string;
  updatedAt?: number;
}

export interface CMSSiteSettings {
  contactPhone: string;
  contactEmail: string;
  whatsappPhone: string;
  instagramUrl: string;
  youtubeUrl: string;
  cloudinaryCloudName?: string;
  updatedAt?: number;
}

export interface CMSLead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  brandName?: string;
  serviceType?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  type: 'general_inquiry' | 'site_visit';
  status: 'new' | 'contacted' | 'in_discussion' | 'closed' | 'archived';
  notes?: string;
  createdAt: number;
}

export interface CMSAnnouncement {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonUrl: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CMSContactPage {
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroCtaText: string;

  displayPhone: string;
  whatsappPhone: string;
  email: string;
  cityState: string;
  fullAddress: string;

  googleMapsEmbedUrl: string;
  googleMapsSearchUrl: string;

  siteVisitTag: string;
  siteVisitTitle: string;
  siteVisitDescription: string;
  siteVisitPrice: string;
  siteVisitPriceUnit: string;
  siteVisitCtaText: string;

  instagramHandle: string;
  instagramUrl: string;
  youtubeHandle: string;
  youtubeUrl: string;
  facebookHandle: string;
  facebookUrl: string;

  projectTypes: string[];

  updatedAt?: number;
}

export interface CMSDataState {
  projects: CMSProject[];
  clients: CMSClientLogo[];
  hero: CMSHero | null;
  heroReels: CMSHeroReel[];
  services: CMSService[];
  testimonials: CMSTestimonial[];
  leadership: CMSLeadership | null;
  settings: CMSSiteSettings | null;
  announcements: CMSAnnouncement[];
  contact: CMSContactPage | null;
  isLive: boolean;
}
