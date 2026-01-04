// Utility functions for SEO management
export const BASE_URL = 'https://mansamusamarketplace.com';

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
    image = '/icons/icon-512x512.png',
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
  updateMetaTag('og:site_name', 'Mansa Musa Marketplace');
  updateNameTag('twitter:url', fullUrl);
  updateNameTag('twitter:image', fullImageUrl);
  updateNameTag('twitter:card', 'summary_large_image');
  updateNameTag('twitter:site', '@mansamusamktplc');
};

// Pre-defined SEO configurations for common pages
export const pageSEO = {
  home: {
    title: 'Mansa Musa Marketplace | Discover Black-Owned Businesses',
    description: 'Support Black-owned businesses in your community. Find restaurants, services, shops & more. Earn rewards for shopping local.',
    keywords: ['Black-owned businesses', 'Black business directory', 'support Black businesses', 'local Black entrepreneurs', 'Black-owned restaurants', 'Black-owned shops'],
  },
  directory: {
    title: 'Black-Owned Business Directory | Mansa Musa Marketplace',
    description: 'Browse our comprehensive directory of verified Black-owned businesses. Filter by category, location, and ratings to find exactly what you need.',
    keywords: ['Black business directory', 'Black-owned business list', 'find Black businesses', 'Black entrepreneurs', 'Black-owned companies'],
  },
  about: {
    title: 'About Us | Mansa Musa Marketplace',
    description: 'Learn how Mansa Musa Marketplace empowers Black-owned businesses through community support, corporate sponsorship, and innovative technology.',
    keywords: ['about Mansa Musa', 'Black business support', 'economic empowerment', 'Black community', 'Black business mission'],
  },
  howItWorks: {
    title: 'How It Works | Mansa Musa Marketplace',
    description: 'Discover how to find, support, and earn rewards from Black-owned businesses. Learn about our loyalty program and verification process.',
    keywords: ['how it works', 'loyalty rewards', 'Black business rewards', 'earn points', 'support local business'],
  },
  sponsor: {
    title: 'Become a Sponsor | Mansa Musa Marketplace',
    description: 'Partner with Mansa Musa Marketplace to support Black-owned businesses. Corporate sponsorship opportunities for meaningful community impact.',
    keywords: ['corporate sponsorship', 'sponsor Black businesses', 'DEI initiatives', 'Black business support', 'community investment'],
  },
  ambassador: {
    title: 'Ambassador Program | Mansa Musa Marketplace',
    description: 'Join our Ambassador Program and earn commissions by helping Black-owned businesses grow. Get training, support, and exclusive rewards.',
    keywords: ['ambassador program', 'affiliate marketing', 'earn commissions', 'business referrals', 'community ambassador'],
  },
  register: {
    title: 'Register Your Business | Mansa Musa Marketplace',
    description: 'List your Black-owned business on Mansa Musa Marketplace. Get discovered by new customers, manage reviews, and grow your presence.',
    keywords: ['register business', 'list Black business', 'Black business registration', 'business listing', 'grow Black business'],
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
    title: `${businessName}${location ? ` - ${location}` : ''} | Mansa Musa Marketplace`,
    description: business.description 
      ? business.description.substring(0, 155) + (business.description.length > 155 ? '...' : '')
      : `Discover ${businessName}, a Black-owned ${business.category || 'business'}${location ? ` in ${location}` : ''}. Read reviews, get directions, and support local Black entrepreneurs.`,
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