import { Helmet } from 'react-helmet-async';
import { siteConfig } from '@/config/site';

export const OrganizationStructuredData = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    alternateName: [siteConfig.legacyName, '1325', 'Black-Owned Global Business Directory'],
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/1325-logo.png`,
    description: 'The largest verified Black-owned global business directory with 43,000+ listings. Discover and support Black-owned businesses, earn rewards, and circulate community wealth.',
    foundingDate: siteConfig.foundingDate,
    slogan: 'The Largest Black-Owned Global Business Directory',
    sameAs: [
      siteConfig.social.twitter,
      siteConfig.social.instagram,
      siteConfig.social.linkedin,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: siteConfig.supportEmail,
      availableLanguage: ['English'],
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    knowsAbout: [
      'Black-owned businesses',
      'Black business directory',
      'African American entrepreneurs',
      'Black-owned restaurants',
      'Black-owned services',
      'Buy Black movement',
      'Community wealth circulation',
      'AI-powered business discovery',
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default OrganizationStructuredData;
