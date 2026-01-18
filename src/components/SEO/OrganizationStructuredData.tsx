import { Helmet } from 'react-helmet';
import { siteConfig } from '@/config/site';

export const OrganizationStructuredData = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.legacyName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/1325-logo.png`,
    description: siteConfig.description,
    foundingDate: siteConfig.foundingDate,
    slogan: siteConfig.tagline,
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
      'Business directory',
      'AI-powered discovery',
      'Loyalty rewards protocol',
      'Community economic empowerment',
      'Corporate sponsorship',
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
