import type { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';

export default async function handler(req: any, res: any) {
  // Allow CORS for local development & production Vercel
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'HpXrKNOYA9Yt7Rs0cW26zXqGUPo';
    const apiKey = process.env.VITE_CLOUDINARY_API_KEY || '281566125612949';

    // Parse body if not already parsed
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const paramsToSign = body.paramsToSign || {};

    // Sort keys alphabetically
    const sortedKeys = Object.keys(paramsToSign).sort();
    const stringToSign = sortedKeys.map((k) => `${k}=${paramsToSign[k]}`).join('&') + apiSecret;

    // Generate SHA-1 hash
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    res.status(200).json({
      signature,
      apiKey,
      timestamp: paramsToSign.timestamp,
    });
  } catch (err: any) {
    console.error('Cloudinary sign error:', err);
    res.status(500).json({ error: err?.message || 'Failed to generate signature' });
  }
}
