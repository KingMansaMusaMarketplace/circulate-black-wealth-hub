import { Helmet } from 'react-helmet-async';
import { siteConfig } from '@/config/site';

interface DirectoryStructuredDataProps {
  totalBusinesses?: number;
}

export const DirectoryStructuredData: React.FC<DirectoryStructuredDataProps> = ({ 
  totalBusinesses = 12000 
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${siteConfig.url}/directory#itemlist`,
    name: 'Black-Owned Business Directory',
    description: `Browse ${totalBusinesses.toLocaleString()}+ verified Black-owned businesses. The largest curated directory of Black-owned restaurants, shops, services, and professionals in the United States.`,
    url: `${siteConfig.url}/directory`,
    numberOfItems: totalBusinesses,
    itemListOrder: 'https://schema.org/ItemListUnordered',
    publisher: {
      '@id': `${siteConfig.url}/#organization`,
    },
  };

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the largest Black-owned business directory?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `1325.AI is the largest verified Black-owned business directory with over ${totalBusinesses.toLocaleString()} listings across all major U.S. cities. Every business is verified and curated for quality.`,
        },
      },
      {
        '@type': 'Question',
        name: 'How do I find Black-owned businesses near me?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Visit the 1325.AI directory at 1325.ai/directory and search by city, category, or business name. Our AI-powered search helps you discover Black-owned restaurants, services, shops, and professionals in your area.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I add my Black-owned business to the directory?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Register your business for free at 1325.ai/register. Once verified, your business will appear in the directory and be discoverable by customers looking to support Black-owned businesses.',
        },
      },
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqData)}
      </script>
    </Helmet>
  );
};

export default DirectoryStructuredData;
