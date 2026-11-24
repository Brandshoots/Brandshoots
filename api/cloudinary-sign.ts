import crypto from 'crypto';

const ALLOWED_ORIGINS = new Set([
  'https://www.brandshoots.in',
  'https://brandshoots.in',
  'https://brandshoots-2026.vercel.app',
  'http://localhost:3000',
  'http://localhost:3002',
  'http://localhost:5173',
]);

const UPLOAD_FOLDER = 'brandshoots';

export default async function handler(req: any, res: any) {
  const origin = typeof req.headers?.origin === 'string' ? req.headers.origin : '';
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    res.status(403).json({ error: 'Origin is not allowed' });
    return;
  }
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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

  const authorization =
    typeof req.headers?.authorization === 'string' ? req.headers.authorization : '';
  const idToken = authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length).trim()
    : '';
  if (!idToken) {
    res.status(401).json({ error: 'Firebase authentication is required' });
    return;
  }

  const firebaseApiKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;
  if (!firebaseApiKey) {
    res.status(503).json({ error: 'Firebase token verification is not configured' });
    return;
  }

  try {
    const verifyResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseApiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );
    const verification = await verifyResponse.json();
    const account = Array.isArray(verification?.users) ? verification.users[0] : null;
    if (!verifyResponse.ok || !account?.localId || account.disabled === true) {
      res.status(403).json({ error: 'Firebase session is invalid or expired' });
      return;
    }
  } catch {
    res.status(503).json({ error: 'Firebase session could not be verified' });
    return;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    res.status(503).json({ error: 'Upload signing is not configured' });
    return;
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(cloudName)) {
    res.status(503).json({ error: 'Upload signing configuration is invalid' });
    return;
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = { folder: UPLOAD_FOLDER, timestamp };
    const stringToSign =
      Object.keys(paramsToSign)
        .sort()
        .map((key) => `${key}=${paramsToSign[key as keyof typeof paramsToSign]}`)
        .join('&') + apiSecret;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    res.status(200).json({
      cloudName,
      apiKey,
      signature,
      timestamp,
      folder: UPLOAD_FOLDER,
    });
  } catch (error) {
    console.error('Cloudinary signing failed', error);
    res.status(500).json({ error: 'Failed to generate upload signature' });
  }
}
