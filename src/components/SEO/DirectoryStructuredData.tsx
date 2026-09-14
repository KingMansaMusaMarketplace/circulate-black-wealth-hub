import { Helmet } from 'react-helmet-async';
import { siteConfig } from '@/config/site';

export interface DirectoryListingItem {
  id: string;
  name?: string;
  business_name?: string;
  category?: string;
  city?: string;
  state?: string;
}

interface DirectoryStructuredDataProps {
  totalBusinesses?: number;
  /** The listings currently rendered on the page, emitted so AI search and
   *  assistants (Siri / Apple Intelligence, Google, ChatGPT) can cite them. */
  listings?: DirectoryListingItem[];
}

export const DirectoryStructuredData: React.FC<DirectoryStructuredDataProps> = ({ 
  totalBusinesses = 12000,
  listings = [],
}) => {
  const itemListElement = listings.slice(0, 50).map((b, index) => {
    const name = b.business_name || b.name || 'Business';
    const locality = [b.city, b.state].filter(Boolean).join(', ');
    return {
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'LocalBusiness',
        '@id': `${siteConfig.url}/business/${b.id}`,
        name,
        url: `${siteConfig.url}/business/${b.id}`,
        ...(b.category && { additionalType: b.category }),
        ...(locality && {
          address: {
            '@type': 'PostalAddress',
            ...(b.city && { addressLocality: b.city }),
            ...(b.state && { addressRegion: b.state }),
          },
        }),
      },
    };
  });

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${siteConfig.url}/directory#itemlist`,
    name: 'Black-Owned Global Business Directory',
    description: `Browse ${totalBusinesses.toLocaleString()}+ verified Black-owned businesses. The largest curated directory of Black-owned restaurants, shops, services, and professionals in the United States.`,
    url: `${siteConfig.url}/directory`,
    numberOfItems: totalBusinesses,
    itemListOrder: 'https://schema.org/ItemListUnordered',
    ...(itemListElement.length > 0 && { itemListElement }),
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
        name: 'What is the largest Black-owned global business directory?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `1325.AI is the largest verified Black-owned global business directory with over ${totalBusinesses.toLocaleString()} listings across all major U.S. cities. Every business is verified and curated for quality.`,
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
