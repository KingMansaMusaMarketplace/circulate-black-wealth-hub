import React from 'react';
import { Helmet } from 'react-helmet-async';
import { siteConfig } from '@/config/site';

interface PageSEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'business.business' | 'product';
  keywords?: string[];
  noindex?: boolean;
}

/**
 * Reusable SEO component for consistent meta tags across all pages.
 * Includes title, description, Open Graph, Twitter Card, and canonical URL.
 */
const PageSEO: React.FC<PageSEOProps> = ({
  title,
  description,
  path = '',
  image = '/favicon.png',
  type = 'website',
  keywords = [],
  noindex = false,
}) => {
  const fullUrl = `${siteConfig.url}${path}`;
  const fullImageUrl = image.startsWith('http') ? image : `${siteConfig.url}${image}`;
  const fullTitle = `${title} | ${siteConfig.name}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteConfig.name} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
};

export default PageSEO;
