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
    title: '1325.AI | The Economic Operating System for Black-Owned Businesses',
    description: 'Discover and support verified Black-owned businesses. The AI-powered infrastructure for economic circulation, community wealth, and generational impact.',
    keywords: ['Black-owned businesses', 'Black business directory', 'economic operating system', 'Black wealth', 'support Black businesses', '1325 AI'],
  },
  directory: {
    title: '1325.AI Business Directory | Verified Black-Owned Businesses',
    description: 'The flagship showcase of verified Black-owned businesses. Curated for excellence, powered by community. Find restaurants, services, shops & more.',
    keywords: ['1325.AI directory', 'Black business directory', 'verified Black businesses', 'Black entrepreneurs', 'Black-owned companies'],
  },
  about: {
    title: 'About 1325.AI | Economic Operating System',
    description: 'Learn how 1325.AI empowers Black-owned businesses through AI-driven infrastructure, community circulation, and strategic partnerships.',
    keywords: ['about 1325.AI', 'Black business support', 'economic empowerment', 'Black community', 'economic operating system'],
  },
  howItWorks: {
    title: 'How It Works | 1325.AI',
    description: 'Discover how 1325.AI connects you with verified Black-owned businesses. Learn about our verification process and economic circulation model.',
    keywords: ['how it works', 'business verification', 'economic circulation', 'community wealth', 'support local business'],
  },
  sponsor: {
    title: 'Become a Sponsor | 1325.AI',
    description: 'Partner with 1325.AI to fuel Black economic infrastructure. Corporate sponsorship opportunities for meaningful community impact.',
    keywords: ['corporate sponsorship', 'sponsor Black businesses', 'DEI initiatives', 'Black business infrastructure', 'community investment'],
  },
  ambassador: {
    title: '1325 Ambassador Program | 1325.AI',
    description: 'Join the 1325 Ambassador Program and become the human layer of our Economic Operating System. Earn commissions by growing the network.',
    keywords: ['1325 ambassador', 'affiliate marketing', 'earn commissions', 'business referrals', 'economic network'],
  },
  register: {
    title: 'Register Your Business | 1325.AI',
    description: 'Join the 1325.AI Business Directory. Get verified, connect with customers, and become part of the Black economic circulation network.',
    keywords: ['register business', 'list Black business', 'business verification', 'business listing', 'economic network'],
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
      : `Discover ${businessName}, a verified Black-owned ${business.category || 'business'}${location ? ` in ${location}` : ''}. Part of the 1325.AI Economic Operating System.`,
    keywords: [
      businessName,
      'Black-owned business',
      business.category,
      business.city,
      business.state,
      'local business',
      'support Black businesses',
    ].filter(Boolean) as string[],
    path: `/business/${business.id}`,
  };
};