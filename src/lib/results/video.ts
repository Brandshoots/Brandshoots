export type ResultVideoSource =
  | {
      type: 'youtube';
      originalUrl: string;
      videoId: string;
      embedUrl: string;
    }
  | {
      type: 'instagram';
      originalUrl: string;
    };

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

function toSafeHttpUrl(value: string): URL | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const candidate = trimmed.startsWith('//')
    ? `https:${trimmed}`
    : /^[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\/|$)/.test(trimmed)
      ? `https://${trimmed}`
      : trimmed;

  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    return url;
  } catch {
    return null;
  }
}

function cleanHost(url: URL): string {
  return url.hostname.toLowerCase().replace(/^(?:www\.|m\.)/, '');
}

function getYouTubeId(url: URL): string | null {
  const host = cleanHost(url);
  let candidate: string | null = null;

  if (host === 'youtu.be') {
    candidate = url.pathname.split('/').filter(Boolean)[0] ?? null;
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (url.pathname === '/watch') candidate = url.searchParams.get('v');
    else if (['embed', 'shorts', 'live'].includes(pathParts[0] ?? '')) candidate = pathParts[1] ?? null;
  }

  return candidate && YOUTUBE_ID_PATTERN.test(candidate) ? candidate : null;
}

export function parseResultVideoUrl(value?: string | null): ResultVideoSource | null {
  if (!value) return null;
  const url = toSafeHttpUrl(value);
  if (!url) return null;

  const videoId = getYouTubeId(url);
  if (videoId) {
    return {
      type: 'youtube',
      originalUrl: url.toString(),
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
    };
  }

  const host = cleanHost(url);
  if (host === 'instagram.com') {
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts[0] === 'reel' && pathParts[1]) {
      return { type: 'instagram', originalUrl: url.toString() };
    }
  }

  return null;
}

export type ResultVideoValidation =
  | { valid: true; platform: 'youtube' | 'instagram' }
  | { valid: false; platform: null; message: string };

export function validateResultVideoUrl(value: string): ResultVideoValidation {
  const source = parseResultVideoUrl(value);
  if (source?.type === 'youtube' || source?.type === 'instagram') {
    return { valid: true, platform: source.type };
  }

  return {
    valid: false,
    platform: null,
    message: 'Enter a valid YouTube video or Instagram Reel URL.',
  };
}

export function isYouTubeResultVideo(
  source: ResultVideoSource | null
): source is Extract<ResultVideoSource, { type: 'youtube' }> {
  return source?.type === 'youtube';
}
