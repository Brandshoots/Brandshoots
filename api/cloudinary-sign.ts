import crypto from 'crypto';

const ALLOWED_ORIGINS = new Set([
  'https://www.brandshoots.in',
  'https://brandshoots.in',
  'https://brandshoots-2026.vercel.app',
  'http://localhost:3000',
  'http://localhost:3002',
  'http://localhost:5173',
]);

const ALLOWED_SIGNED_PARAMS = new Set(['timestamp', 'folder']);

export default async function handler(req: any, res: any) {
  const origin = typeof req.headers?.origin === 'string' ? req.headers.origin : '';
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY;
  if (!apiSecret || !apiKey) {
    res.status(503).json({ error: 'Upload signing is not configured' });
    return;
  }

  let body: any;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    res.status(400).json({ error: 'Invalid JSON body' });
    return;
  }

  const paramsToSign = body?.paramsToSign;
  if (!paramsToSign || typeof paramsToSign !== 'object' || Array.isArray(paramsToSign)) {
    res.status(400).json({ error: 'paramsToSign must be an object' });
    return;
  }

  const keys = Object.keys(paramsToSign);
  if (keys.some((key) => !ALLOWED_SIGNED_PARAMS.has(key))) {
    res.status(400).json({ error: 'Unsupported signing parameter' });
    return;
  }

  const timestamp = Number(paramsToSign.timestamp);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isInteger(timestamp) || Math.abs(now - timestamp) > 3600) {
    res.status(400).json({ error: 'Invalid or expired timestamp' });
    return;
  }

  const folder = paramsToSign.folder;
  if (folder !== 'brandshoots') {
    res.status(400).json({ error: 'Invalid upload folder' });
    return;
  }

  try {
    const normalizedParams = { folder, timestamp };
    const stringToSign = Object.keys(normalizedParams)
      .sort()
      .map((key) => `${key}=${normalizedParams[key as keyof typeof normalizedParams]}`)
      .join('&') + apiSecret;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    res.status(200).json({ signature, apiKey, timestamp });
  } catch (error) {
    console.error('Cloudinary signing failed', error);
    res.status(500).json({ error: 'Failed to generate upload signature' });
  }
}
