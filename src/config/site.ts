/**
 * Centralized site configuration
 * Update these values when rebranding or changing domain
 */
export const siteConfig = {
  // Domain and URLs
  url: 'https://1325.ai',
  domain: '1325.ai',
  
  // Brand identity
  name: '1325.ai',
  tagline: 'The Future of Digital Commerce | AI',
  description: 'AI-powered protocol connecting consumers with Black-owned businesses, enabling wealth circulation and economic empowerment through intelligent discovery and rewards.',
  
  // Legacy brand (for transition period)
  legacyName: 'Mansa Musa Marketplace',
  legacyDomain: 'mansamusamarketplace.com',
  
  // Contact
  supportEmail: 'support@1325.ai',
  contactEmail: 'contact@1325.ai',
  businessEmail: 'business@1325.ai',
  partnershipEmail: 'partners@1325.ai',
  phone: '312.709.6006',
  
  // Social (to be updated)
  social: {
    twitter: 'https://twitter.com/1325ai',
    instagram: 'https://instagram.com/1325ai',
    linkedin: 'https://linkedin.com/company/1325ai',
  },
  
  // SEO
  seo: {
    title: '1325.ai | The Intelligence Layer for Black Economic Power',
    defaultTitle: '1325.ai',
    titleTemplate: '%s | 1325.ai',
  },
  
  // Founding info
  foundingDate: '2024',
  
  // App info
  app: {
    iosUrl: 'https://apps.apple.com/app/mansa-musa-marketplace',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.mansamusa',
  }
} as const;

export type SiteConfig = typeof siteConfig;
