import { Helmet } from 'react-helmet';

export const OrganizationStructuredData = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://mansamusamarketplace.com/#organization',
    name: 'Mansa Musa Marketplace',
    alternateName: 'MMM',
    url: 'https://mansamusamarketplace.com',
    logo: 'https://mansamusamarketplace.com/icons/icon-512x512.png',
    description: 'A digital marketplace connecting consumers with Black-owned businesses, empowering economic growth in the Black community through discovery, loyalty rewards, and corporate sponsorship.',
    foundingDate: '2024',
    slogan: 'Empowering Black-Owned Businesses',
    sameAs: [
      // Add social media profiles here when available
      // 'https://www.facebook.com/mansamusamarketplace',
      // 'https://www.instagram.com/mansamusamarketplace',
      // 'https://twitter.com/mansamusamktplc',
      // 'https://www.linkedin.com/company/mansamusamarketplace',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@mansamusamarketplace.com',
      availableLanguage: ['English'],
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    knowsAbout: [
      'Black-owned businesses',
      'Business directory',
      'Loyalty rewards program',
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
