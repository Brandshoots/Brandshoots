export interface ClientSocialStats {
  id: string;
  name: string;
  instagram: string;
  instagramUrl: string;
  followers?: string;
  posts?: string;
}

/**
 * ONE centralized client social-data configuration.
 *
 * NOTE: Per strict requirement, follower/post counts are populated
 * ONLY when verified/provided. If not yet available, they are left empty
 * and omitted from the UI to avoid fabricated numbers.
 */
export const CLIENT_SOCIAL_DATA: Record<string, ClientSocialStats> = {
  'santhi-pipes': {
    id: 'santhi-pipes',
    name: 'Santhi Pipes',
    instagram: '@santhi.pipes_rjy',
    instagramUrl: 'https://www.instagram.com/santhi.pipes_rjy/',
    followers: '',
    posts: '',
  },
  'viswatuff-glass': {
    id: 'viswatuff-glass',
    name: 'Viswatuff Glass',
    instagram: '@viswatuff.glass_rjy',
    instagramUrl: 'https://www.instagram.com/viswatuff.glass_rjy/',
    followers: '',
    posts: '',
  },
  'bags-world': {
    id: 'bags-world',
    name: 'Bags World',
    instagram: '@bags.world_rjy',
    instagramUrl: 'https://www.instagram.com/bags.world_rjy/',
    followers: '18.4K',
    posts: '326',
  },
  'aabharan-jewellers': {
    id: 'aabharan-jewellers',
    name: 'Aabharan Jewellers',
    instagram: '@aabharan_womens_accessories',
    instagramUrl: 'https://www.instagram.com/aabharan_womens_accessories/',
    followers: '',
    posts: '',
  },
  'fresh-fresh': {
    id: 'fresh-fresh',
    name: 'Fresh & Fresh',
    instagram: '@freshandfresh_rjy',
    instagramUrl: 'https://www.instagram.com/freshandfresh_rjy/',
    followers: '',
    posts: '',
  },
  'dayanidhi': {
    id: 'dayanidhi',
    name: 'Dayanidhi Creations',
    instagram: '@dayanidhi.interiors_rjy',
    instagramUrl: 'https://www.instagram.com/dayanidhi.interiors_rjy/',
    followers: '',
    posts: '',
  },
  'jain-beauty': {
    id: 'jain-beauty',
    name: 'Jain Beauty Studio',
    instagram: '@jain_beauty_concepts',
    instagramUrl: 'https://www.instagram.com/jain_beauty_concepts/',
    followers: '',
    posts: '',
  },
  'rk-home': {
    id: 'rk-home',
    name: 'RK Home Living',
    instagram: '@rkhomeliving',
    instagramUrl: 'https://www.instagram.com/rkhomeliving/',
    followers: '',
    posts: '',
  },
  'sb-ventures': {
    id: 'sb-ventures',
    name: 'SB Ventures',
    instagram: '@sbventures_official',
    instagramUrl: 'https://www.instagram.com/sbventures_official/',
    followers: '',
    posts: '',
  },
  'kc-overseas': {
    id: 'kc-overseas',
    name: 'KC Overseas',
    instagram: '@kc_overseas_rjy',
    instagramUrl: 'https://www.instagram.com/kc_overseas_rjy/',
    followers: '',
    posts: '',
  },
  'srk-doors': {
    id: 'srk-doors',
    name: 'SRK Doors World',
    instagram: '@srkdoorsworld',
    instagramUrl: 'https://www.instagram.com/srkdoorsworld/',
    followers: '',
    posts: '',
  },
  'jain-enterprises': {
    id: 'jain-enterprises',
    name: 'Jain Enterprises',
    instagram: '@jainenterprises_rjy',
    instagramUrl: 'https://www.instagram.com/jainenterprises_rjy/',
    followers: '',
    posts: '',
  },
  'nirmala': {
    id: 'nirmala',
    name: 'Nirmala',
    instagram: '@nirmala_official',
    instagramUrl: 'https://www.instagram.com/nirmala_official/',
    followers: '',
    posts: '',
  },
  'rudra': {
    id: 'rudra',
    name: 'Rudra',
    instagram: '@rudra_hospitality',
    instagramUrl: 'https://www.instagram.com/rudra_hospitality/',
    followers: '',
    posts: '',
  },
  'sahana': {
    id: 'sahana',
    name: 'Sahana',
    instagram: '@sahana.dryfruits_rjy',
    instagramUrl: 'https://www.instagram.com/sahana.dryfruits_rjy/',
    followers: '',
    posts: '',
  },
  't3': {
    id: 't3',
    name: 'T3 Studio',
    instagram: '@tea3_official',
    instagramUrl: 'https://www.instagram.com/tea3_official/',
    followers: '',
    posts: '',
  },
};

/**
 * Future-proof abstraction to retrieve client social stats.
 * Currently reads from the centralized local data source.
 * Can later be swapped to query the official Meta / Instagram Graph API.
 */
export function getClientSocialStats(clientId: string): ClientSocialStats | undefined {
  if (!clientId) return undefined;
  const key = clientId.toLowerCase().trim();
  return CLIENT_SOCIAL_DATA[key];
}
