// Utility functions for SEO management
export const BASE_URL = 'https://1325.ai';

// Detect Lovable preview/staging host to avoid indexing
const isStagingHost = () => {
  if (typeof window === 'undefined') return false;
  const h = window.location.hostname || '';
  return h.includes('lovableproject.com') || h.includes('lovable.app') || h.includes('lovable.dev');
};

const setRobotsMeta = (value: string) => {
  let meta = document.querySelector('meta[name="robots"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'robots');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', value);
};

export const setCanonicalUrl = (path: string = '') => {
  const canonicalUrl = `${BASE_URL}${path}`;
  // Remove existing canonical link
  const existingCanonical = document.querySelector('link[rel="canonical"]');
  if (existingCanonical) {
    existingCanonical.remove();
  }
  // Add new canonical link
  const canonical = document.createElement('link');
  canonical.rel = 'canonical';
  canonical.href = canonicalUrl;
  document.head.appendChild(canonical);
};

export const updateMetaTags = (data: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'business.business';
  keywords?: string[];
}) => {
  const { 
    title, 
    description, 
    path = '', 
    image = '/favicon.png',
    type = 'website',
    keywords = []
  } = data;
  const fullUrl = `${BASE_URL}${path}`;
  const fullImageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;
  
  // Update canonical URL
  setCanonicalUrl(path);

  // Set robots to avoid indexing on staging/preview hosts
  if (typeof window !== 'undefined') {
    setRobotsMeta(isStagingHost() ? 'noindex, nofollow' : 'index, follow');
  }
  
  // Update Open Graph tags
  const updateMetaTag = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };
  
  const updateNameTag = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };
  
  if (title) {
    document.title = title;
    updateMetaTag('og:title', title);
    updateNameTag('twitter:title', title);
  }
  
  if (description) {
    updateNameTag('description', description);
    updateMetaTag('og:description', description);
    updateNameTag('twitter:description', description);
  }

  if (keywords.length > 0) {
    updateNameTag('keywords', keywords.join(', '));
  }
  
  updateMetaTag('og:url', fullUrl);
  updateMetaTag('og:image', fullImageUrl);
  updateMetaTag('og:type', type);
  updateMetaTag('og:site_name', '1325.AI');
  updateNameTag('twitter:url', fullUrl);
  updateNameTag('twitter:image', fullImageUrl);
  updateNameTag('twitter:card', 'summary_large_image');
  updateNameTag('twitter:site', '@1325ai');
};

// Pre-defined SEO configurations for common pages
export const pageSEO = {
  home: {
    title: 'Black-Owned Global Business Directory | 43,000+ | 1325.AI',
    description: 'The largest verified Black-owned global business directory. Find 43,000+ Black-owned restaurants, shops & services near you. Powered by 1325.AI.',
    keywords: ['Black-owned global business directory', 'Black-owned businesses near me', 'Black business directory', 'support Black-owned businesses', 'African American business directory', 'buy Black', 'Black-owned restaurants', 'Black-owned shops', '1325 AI', 'Mansa Musa Marketplace'],
  },
  directory: {
    title: 'Black-Owned Global Business Directory Near You | 1325.AI',
    description: 'Find verified Black-owned businesses near you — restaurants, shops, services & pros. Search 43,000+ listings free on 1325.AI.',
    keywords: ['Black-owned global business directory', 'Black businesses near me', 'find Black-owned businesses', 'verified Black businesses', 'Black-owned restaurants near me', 'Black-owned services'],
  },
  about: {
    title: 'About 1325.AI | Circulate Black Dollars Intentionally',
    description: 'Meet 1325.AI — the AI-powered platform helping you find, support and circulate dollars to 43,000+ Black-owned businesses nationwide.',
    keywords: ['about 1325.AI', 'Black-owned business platform', 'Black economic empowerment', 'Black dollar circulation', 'support Black businesses'],
  },
  impact: {
    title: 'Black Economic Impact Tracker | 1325.AI',
    description: 'See the real-time impact of every dollar circulated through Black-owned businesses. Track community wealth growth live on 1325.AI.',
    keywords: ['Black economic impact', 'Black dollar circulation tracker', 'community wealth', 'Black economic empowerment'],
  },
  scanner: {
    title: 'Scan to Earn Rewards at Black-Owned Businesses | 1325.AI',
    description: 'Scan QR codes at Black-owned businesses to earn loyalty rewards and prove your impact. Free on 1325.AI.',
    keywords: ['QR scanner', 'loyalty rewards', 'Black-owned business rewards', 'scan to earn'],
  },
  mediaKit: {
    title: '1325.AI Media Kit | Press, Stats & Brand Assets',
    description: 'Download the 1325.AI media kit — platform stats, founder bios, logos and press resources for journalists, partners and sponsors.',
    keywords: ['1325.AI media kit', 'press resources', 'brand assets', 'Black-owned business press'],
  },
  businessSignup: {
    title: 'List Your Black-Owned Business Free | 1325.AI',
    description: 'Add your Black-owned business to 1325.AI in 2 minutes. Get found by 43,000+ supporters and unlock free AI-powered customer tools.',
    keywords: ['list Black-owned business', 'register Black business', 'free business listing', 'Black-owned business signup'],
  },
  howItWorks: {
    title: 'How It Works | 1325.AI Economic Infrastructure',
    description: 'Discover how 1325.AI infrastructure connects you with verified community businesses. Learn about our economic rails and circulation protocol.',
    keywords: ['how it works', 'economic infrastructure', 'circulation protocol', 'economic rails', 'support local business'],
  },
  sponsor: {
    title: 'Infrastructure Investment | 1325.AI Sponsorship',
    description: 'Invest in the economic infrastructure of community business. Corporate sponsorship opportunities for patent-protected, AI-powered economic rails.',
    keywords: ['infrastructure investment', 'sponsor economic rails', 'DEI infrastructure', 'community business infrastructure', 'economic sponsorship'],
  },
  ambassador: {
    title: '1325 Ambassador Program | Human Layer of Infrastructure',
    description: 'Join the 1325 Ambassador Program and become the human layer of our Economic Operating System. Earn commissions by growing the infrastructure network.',
    keywords: ['1325 ambassador', 'infrastructure network', 'earn commissions', 'economic network', 'human infrastructure layer'],
  },
  register: {
    title: 'Register Your Business | 1325.AI Infrastructure',
    description: 'Join the 1325.AI Economic Infrastructure. Get verified, connect with customers, and become part of the patent-protected economic circulation network.',
    keywords: ['register business', 'join infrastructure', 'business verification', 'economic network', 'infrastructure listing'],
  },
};

// Generate dynamic business page SEO
export const generateBusinessSEO = (business: {
  business_name?: string;
  name?: string;
  description?: string;
  category?: string;
  city?: string;
  state?: string;
  id: string;
}) => {
  const businessName = business.business_name || business.name || 'Business';
  const location = [business.city, business.state].filter(Boolean).join(', ');
  
  return {
    title: `${businessName}${location ? ` - ${location}` : ''} | 1325.AI`,
    description: business.description 
      ? business.description.substring(0, 155) + (business.description.length > 155 ? '...' : '')
      : `Discover ${businessName}, a verified ${business.category || 'business'}${location ? ` in ${location}` : ''}. Part of the 1325.AI Economic Operating System.`,
    keywords: [
      businessName,
      'verified business',
      business.category,
      business.city,
      business.state,
      'local business',
      'support community businesses',
    ].filter(Boolean) as string[],
    path: `/business/${business.id}`,
  };
};