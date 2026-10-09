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

export interface CMSHero {
  brandTitle: string;
  shootsTitle: string;
  taglinePrefix: string;
  taglineAccent: string;
  taglineSuffix: string;
  desktopVideoUrl?: string;
  mobileVideoUrl?: string;
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

export interface CMSDataState {
  projects: CMSProject[];
  clients: CMSClientLogo[];
  hero: CMSHero | null;
  services: CMSService[];
  testimonials: CMSTestimonial[];
  leadership: CMSLeadership | null;
  settings: CMSSiteSettings | null;
  isLive: boolean;
}
