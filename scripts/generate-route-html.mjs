import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const origin = 'https://www.brandshoots.in';
const socialImage = `${origin}/og-image.png`;
const routes = {
  about: {
    title: 'About BrandShoots | Creative Video Production Studio',
    description: 'Meet BrandShoots, a creative video production and social media studio serving businesses across Andhra Pradesh and Telangana from Rajahmundry and Hyderabad.',
    path: '/about',
  },
  portfolio: {
    title: 'Portfolio | Commercial Video & Reels by BrandShoots',
    description: 'Explore commercial video production, business reels and brand campaigns created by BrandShoots for companies across Andhra Pradesh and Telangana.',
    path: '/portfolio',
  },
  results: {
    title: 'Client Results & Case Studies | BrandShoots',
    description: 'Explore published BrandShoots client case studies with verified before-and-after follower and view figures, screenshots and campaign timelines.',
    path: '/results',
  },
  contact: {
    title: 'Contact BrandShoots | Rajahmundry & Hyderabad',
    description: 'Contact BrandShoots for professional brand shoots, commercial reels, video production and social media management in Rajahmundry, Hyderabad and across AP and Telangana.',
    path: '/contact',
  },
  packages: {
    title: 'Packages & Pricing | BrandShoots – Monthly Reels & Social Media Plans, Rajahmundry & Hyderabad',
    description: 'Monthly content packages from ₹40,000: reels, shoot days, editing and Instagram, Facebook & YouTube management for businesses in Rajahmundry and Hyderabad.',
    path: '/packages',
  },
  private: {
    title: 'BrandShoots Studio',
    description: 'Private BrandShoots studio application.',
    path: '/',
    indexable: false,
  },
};

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const replaceMeta = (html, selectorType, selectorValue, content) => {
  const escapedSelector = selectorValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<meta\\s+${selectorType}="${escapedSelector}"\\s+content="[^"]*"\\s*\\/?>(?:\\r?\\n)?`, 'i');
  return html.replace(pattern, `<meta ${selectorType}="${selectorValue}" content="${escapeHtml(content)}" />\n`);
};

const indexPath = resolve('dist/index.html');
const baseHtml = await readFile(indexPath, 'utf8');

for (const [fileName, metadata] of Object.entries(routes)) {
  const canonical = `${origin}${metadata.path}`;
  let html = baseHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(metadata.title)}</title>`);
  html = replaceMeta(html, 'name', 'title', metadata.title);
  html = replaceMeta(html, 'name', 'description', metadata.description);
  html = replaceMeta(html, 'name', 'robots', metadata.indexable === false ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
  html = replaceMeta(html, 'property', 'og:title', metadata.title);
  html = replaceMeta(html, 'property', 'og:description', metadata.description);
  html = replaceMeta(html, 'property', 'og:url', canonical);
  html = replaceMeta(html, 'property', 'og:image', socialImage);
  html = replaceMeta(html, 'property', 'og:image:secure_url', socialImage);
  html = replaceMeta(html, 'name', 'twitter:title', metadata.title);
  html = replaceMeta(html, 'name', 'twitter:description', metadata.description);
  html = replaceMeta(html, 'name', 'twitter:url', canonical);
  html = replaceMeta(html, 'name', 'twitter:image', socialImage);
  html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonical}" />`);
  await writeFile(resolve(`dist/${fileName}.html`), html, 'utf8');
}

console.log(`Generated ${Object.keys(routes).length} route-specific HTML entry files.`);
