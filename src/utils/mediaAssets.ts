const CLIENT_PREFIXES = ['/clients/', '/clients/trimmed/'];

/**
 * Maps legacy local raster URLs to the optimized WebP variants. External CMS
 * and Cloudinary URLs pass through unchanged.
 */
export function getOptimizedImageUrl(url?: string): string {
  if (!url) return '';
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  if (url.startsWith('/clients/optimized/')) return url;
  if (url.startsWith('/reels/thumbnails-webp/')) return url;
  if (url.startsWith('/reels/posters/') && url.endsWith('.webp')) return url;
  if (url.startsWith('/what-we-do/optimized/')) return url;

  const clientPrefix = CLIENT_PREFIXES.find((prefix) => url.startsWith(prefix));
  if (clientPrefix) {
    const fileName = url.slice(clientPrefix.length).replace(/\.(png|jpe?g)$/i, '.webp');
    return `/clients/optimized/${fileName}`;
  }

  if (url.startsWith('/reels/thumbnails/')) {
    return url.replace('/reels/thumbnails/', '/reels/thumbnails-webp/').replace(/\.jpe?g$/i, '.webp');
  }

  if (url.startsWith('/reels/posters/')) {
    return url.replace(/\.jpe?g$/i, '.webp');
  }

  if (url.startsWith('/what-we-do/')) {
    const fileName = url.slice('/what-we-do/'.length).replace(/\.(png|jpe?g)$/i, '.webp');
    return `/what-we-do/optimized/${fileName}`;
  }

  if (url === '/founder.png') return '/founder.webp';
  return url;
}
