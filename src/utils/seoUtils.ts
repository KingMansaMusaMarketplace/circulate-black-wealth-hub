// Utility functions for SEO management
export const BASE_URL = 'https://mansamusamarketplace.com';

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
}) => {
  const { title, description, path = '', image = '/icons/icon-512x512.png' } = data;
  const fullUrl = `${BASE_URL}${path}`;
  const fullImageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;
  
  // Update canonical URL
  setCanonicalUrl(path);
  
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
  
  updateMetaTag('og:url', fullUrl);
  updateMetaTag('og:image', fullImageUrl);
  updateNameTag('twitter:url', fullUrl);
  updateNameTag('twitter:image', fullImageUrl);
};