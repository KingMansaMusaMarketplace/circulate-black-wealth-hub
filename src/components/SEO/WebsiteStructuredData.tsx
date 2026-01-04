import { Helmet } from 'react-helmet';

export const WebsiteStructuredData = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://mansamusamarketplace.com/#website',
    name: 'Mansa Musa Marketplace',
    url: 'https://mansamusamarketplace.com',
    description: 'Discover and support Black-owned businesses in your community',
    publisher: {
      '@id': 'https://mansamusamarketplace.com/#organization',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://mansamusamarketplace.com/directory?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-US',
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default WebsiteStructuredData;
