export interface MonthlyPackage {
  id: 'starter' | 'growth' | 'premium';
  name: 'STARTER' | 'GROWTH' | 'PREMIUM';
  price: string;
  description: string;
  label?: 'MOST POPULAR' | 'SIGNATURE';
  features: string[];
  whatsappUrl: string;
}

export interface PackageComparisonRow {
  feature: string;
  starter: string;
  growth: string;
  premium: string;
}

export interface PackageWorkflowStep {
  number: string;
  title: string;
  description: string;
}

export const MONTHLY_PACKAGES: MonthlyPackage[] = [
  {
    id: 'starter',
    name: 'STARTER',
    price: '₹40,000',
    description: 'For businesses building a consistent social media presence.',
    features: [
      '8 reels per month',
      '1 shoot day (mobile shoot)',
      '1 professional-camera introduction reel',
      'Scripting & content planning',
      'Instagram, Facebook & YouTube management',
      'Festival posters',
      'Monthly performance report',
    ],
    whatsappUrl: 'https://wa.me/917075960672?text=Hi%20BrandShoots%2C%20I%27m%20interested%20in%20the%20Starter%20plan',
  },
  {
    id: 'growth',
    name: 'GROWTH',
    price: '₹60,000',
    description: 'For brands ready to scale their reach.',
    label: 'MOST POPULAR',
    features: [
      '12 reels per month',
      '2 shoot days',
      'Professional camera + drone',
      'Professional editing',
      'Basic Meta ads setup',
      'Scripting & content planning',
      'Instagram, Facebook & YouTube management',
      'Festival posters',
      'Monthly performance report',
    ],
    whatsappUrl: 'https://wa.me/917075960672?text=Hi%20BrandShoots%2C%20I%27m%20interested%20in%20the%20Growth%20plan',
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    price: '₹75,000',
    description: 'Cinematic, high-end production handled directly by the founder.',
    label: 'SIGNATURE',
    features: [
      '15 reels per month',
      '4 shoot days',
      'High-end camera + drone',
      'Cinematic editing',
      'Handled directly by the founder',
      'Monthly strategy meeting',
      'Meta ads management*',
      'Priority support',
      'Festival posters',
      'Monthly performance report',
    ],
    whatsappUrl: 'https://wa.me/917075960672?text=Hi%20BrandShoots%2C%20I%27m%20interested%20in%20the%20Premium%20plan',
  },
];

export const PACKAGE_COMPARISON_ROWS: PackageComparisonRow[] = [
  { feature: 'Reels per month', starter: '8', growth: '12', premium: '15' },
  { feature: 'Shoot days per month', starter: '1', growth: '2', premium: '4' },
  { feature: 'Production setup', starter: 'Mobile shoot', growth: 'Professional camera + drone', premium: 'High-end camera + drone' },
  { feature: 'Camera introduction reel', starter: '1 reel', growth: '✓', premium: '✓' },
  { feature: 'Editing', starter: 'Standard', growth: 'Professional', premium: 'Cinematic' },
  { feature: 'Scripting & content planning', starter: '✓', growth: '✓', premium: '✓' },
  { feature: 'Festival posters', starter: '✓', growth: '✓', premium: '✓' },
  { feature: 'Instagram, Facebook, YouTube management', starter: '✓', growth: '✓', premium: '✓' },
  { feature: 'Posting & scheduling', starter: '✓', growth: '✓', premium: '✓' },
  { feature: 'Monthly performance report', starter: '✓', growth: '✓', premium: '✓' },
  { feature: 'Meta ads', starter: '—', growth: 'Basic setup', premium: 'Full management*' },
  { feature: 'Monthly strategy meeting', starter: '—', growth: '—', premium: '✓' },
  { feature: 'Handled directly by the founder', starter: '—', growth: '—', premium: '✓' },
  { feature: 'Priority support', starter: '—', growth: '—', premium: '✓' },
];

export const PACKAGE_WORKFLOW: PackageWorkflowStep[] = [
  { number: '01', title: 'CONTENT PLANNING', description: 'Monthly ideas, content direction and brand positioning.' },
  { number: '02', title: 'SCRIPTS', description: 'Hooks, scripts and structure for every reel.' },
  { number: '03', title: 'PRODUCTION', description: 'Shoot planning and execution as per your plan.' },
  { number: '04', title: 'POST-PRODUCTION', description: 'Editing, captions, pacing and final delivery.' },
  { number: '05', title: 'SOCIAL MEDIA MANAGEMENT', description: 'Instagram, Facebook and YouTube publishing and scheduling.' },
  { number: '06', title: 'PERFORMANCE', description: 'A monthly report with insights for the next month.' },
];

export const PACKAGE_ADD_ONS = [
  'Additional reels',
  'Extra shoot days',
  'Additional camera or drone production',
  'Models & talent',
  'Props',
  'Special production requirements',
  'Travel outside the service area',
  'Third-party costs',
];

export const PACKAGE_FINE_PRINT = [
  'Monthly packages only; billed and delivered monthly. All prices are per month.',
  'Shoot duration, locations, approvals and final deliverables are confirmed in the monthly content plan.',
  'Drone production depends on location, permissions, weather and feasibility.',
  'Meta ad budgets are paid directly by the client and are not included in package pricing.',
  '*Ad budget is paid directly by the client.',
];
