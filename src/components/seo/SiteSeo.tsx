import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_ORIGIN = 'https://www.brandshoots.in';
const SOCIAL_IMAGE = `${SITE_ORIGIN}/og-image.png`;

interface SeoEntry {
  title: string;
  description: string;
  canonicalPath: string;
  indexable: boolean;
}

const PUBLIC_SEO: Record<string, SeoEntry> = {
  '/': {
    title: 'BrandShoots | Reels & Social Media Management',
    description: 'BrandShoots provides brand shoots, commercial reels, professional video production and social media management for businesses across Andhra Pradesh and Telangana, based in Rajahmundry and Hyderabad.',
    canonicalPath: '/',
    indexable: true,
  },
  '/about': {
    title: 'About BrandShoots | Creative Video Production Studio',
    description: 'Meet BrandShoots, a creative video production and social media studio serving businesses across Andhra Pradesh and Telangana from Rajahmundry and Hyderabad.',
    canonicalPath: '/about',
    indexable: true,
  },
  '/portfolio': {
    title: 'Portfolio | Commercial Video & Reels by BrandShoots',
    description: 'Explore commercial video production, business reels and brand campaigns created by BrandShoots for companies across Andhra Pradesh and Telangana.',
    canonicalPath: '/portfolio',
    indexable: true,
  },
  '/results': {
    title: 'Client Results & Case Studies | BrandShoots',
    description: 'Explore published BrandShoots client case studies with verified before-and-after follower and view figures, screenshots and campaign timelines.',
    canonicalPath: '/results',
    indexable: true,
  },
  '/contact': {
    title: 'Contact BrandShoots | Rajahmundry & Hyderabad',
    description: 'Contact BrandShoots for professional brand shoots, commercial reels, video production and social media management in Rajahmundry, Hyderabad and across AP and Telangana.',
    canonicalPath: '/contact',
    indexable: true,
  },
  '/packages': {
    title: 'Packages & Pricing | BrandShoots – Monthly Reels & Social Media Plans, Rajahmundry & Hyderabad',
    description: 'Monthly content packages from ₹40,000: reels, shoot days, editing and Instagram, Facebook & YouTube management for businesses in Rajahmundry and Hyderabad.',
    canonicalPath: '/packages',
    indexable: true,
  },
};

function setMeta(selector: string, attribute: string, value: string) {
  document.querySelector<HTMLElement>(selector)?.setAttribute(attribute, value);
}

export const SiteSeo: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname.replace(/\/$/, '') || '/';
    const isPortfolioAlias = pathname.startsWith('/portfolio/') || pathname.startsWith('/projects/');
    const isPrivateRoute = pathname.startsWith('/admin') || pathname.startsWith('/reference-lab');
    const privateEntry: SeoEntry = {
      title: 'BrandShoots Studio',
      description: 'Private BrandShoots studio application.',
      canonicalPath: '/',
      indexable: false,
    };
    const entry = isPrivateRoute ? privateEntry : (PUBLIC_SEO[pathname] || (isPortfolioAlias ? PUBLIC_SEO['/portfolio'] : {
      title: 'Page Not Found | BrandShoots',
      description: 'The requested page could not be found. Return to BrandShoots to explore commercial video production, reels and social media services.',
      canonicalPath: pathname,
      indexable: false,
    }));

    const indexable = entry.indexable && !isPrivateRoute;
    const canonical = `${SITE_ORIGIN}${entry.canonicalPath === '/' ? '/' : entry.canonicalPath}`;

    document.title = entry.title;
    setMeta('meta[name="title"]', 'content', entry.title);
    setMeta('meta[name="description"]', 'content', entry.description);
    setMeta('meta[name="robots"]', 'content', indexable ? 'index, follow, max-image-preview:large' : 'noindex, nofollow');
    setMeta('link[rel="canonical"]', 'href', canonical);
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[property="og:title"]', 'content', entry.title);
    setMeta('meta[property="og:description"]', 'content', entry.description);
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[property="og:image"]', 'content', SOCIAL_IMAGE);
    setMeta('meta[property="og:image:secure_url"]', 'content', SOCIAL_IMAGE);
    setMeta('meta[name="twitter:title"]', 'content', entry.title);
    setMeta('meta[name="twitter:description"]', 'content', entry.description);
    setMeta('meta[name="twitter:url"]', 'content', canonical);
    setMeta('meta[name="twitter:image"]', 'content', SOCIAL_IMAGE);
  }, [location.pathname]);

  return null;
};

export default SiteSeo;
