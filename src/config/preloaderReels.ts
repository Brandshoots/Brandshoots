import { PreloaderReel } from '../types';

/**
 * BrandShoots Temporary Sample Reel Moments
 * Configured for easy replacement with client raw footage without touching animation logic.
 */
export const PRELOADER_REELS: PreloaderReel[] = [
  {
    id: 'reel-01',
    title: 'Automotive Motion Cut',
    category: 'Commercial Film',
    // Highly optimized preview video (editorial motion / commercial)
    source: 'https://assets.mixkit.co/videos/preview/mixkit-car-driving-through-the-night-in-a-city-43841-small.mp4',
    poster: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    duration: 0.42,
    priority: 1,
    cropPosition: 'center',
    metadata: {
      lens: '35MM ANAMORPHIC',
      fps: '24 FPS',
      iso: '800',
      shutter: '1/48',
      timecode: '00:01:14:08'
    }
  },
  {
    id: 'reel-02',
    title: 'Editorial Haute Fashion',
    category: 'Brand Shoot',
    source: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-a-studio-setting-42866-small.mp4',
    poster: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    duration: 0.38,
    priority: 2,
    cropPosition: '50% 30%',
    metadata: {
      lens: '50MM PRIME T1.3',
      fps: '48 FPS (SLOW-MO)',
      iso: '400',
      shutter: '1/96',
      timecode: '00:02:45:16'
    }
  },
  {
    id: 'reel-03',
    title: 'Artisanal Culinary Gastronomy',
    category: 'Hospitality Production',
    source: 'https://assets.mixkit.co/videos/preview/mixkit-chef-plating-a-dish-in-a-kitchen-42898-small.mp4',
    poster: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    duration: 0.34,
    priority: 3,
    cropPosition: 'center',
    metadata: {
      lens: '85MM MACRO',
      fps: '60 FPS',
      iso: '640',
      shutter: '1/120',
      timecode: '00:04:12:02'
    }
  },
  {
    id: 'reel-04',
    title: 'Jewellery & Precious Metals',
    category: 'Luxury Brand Campaign',
    source: 'https://assets.mixkit.co/videos/preview/mixkit-woman-showing-a-diamond-ring-in-her-hand-42874-small.mp4',
    poster: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
    duration: 0.36,
    priority: 4,
    cropPosition: 'center',
    metadata: {
      lens: '100MM T2.9 MACRO',
      fps: '24 FPS',
      iso: '320',
      shutter: '1/48',
      timecode: '00:06:50:22'
    }
  },
  {
    id: 'reel-05',
    title: 'Architectural Shadow & Form',
    category: 'Spaces & Real Estate',
    source: 'https://assets.mixkit.co/videos/preview/mixkit-modern-architecture-building-facade-41300-small.mp4',
    poster: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    duration: 0.40,
    priority: 5,
    cropPosition: 'center',
    metadata: {
      lens: '24MM ULTRA-WIDE',
      fps: '24 FPS',
      iso: '200',
      shutter: '1/48',
      timecode: '00:08:19:14'
    }
  },
  {
    id: 'reel-06',
    title: 'Brand Director Focus Frame',
    category: 'Creative Production Master',
    source: 'https://assets.mixkit.co/videos/preview/mixkit-filmmaker-looking-through-a-camera-42894-small.mp4',
    poster: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    duration: 0.95, // Holds longer during the focus & shutter sequence
    priority: 6,
    cropPosition: '50% 40%',
    metadata: {
      lens: 'MASTER PRIME 35MM',
      fps: '24 FPS RAW',
      iso: '800',
      shutter: '180° SHUTTER',
      timecode: '00:10:00:00'
    }
  }
];
