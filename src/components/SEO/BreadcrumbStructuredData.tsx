import { Helmet } from 'react-helmet';
import { siteConfig } from '@/config/site';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbStructuredData = ({ items }: BreadcrumbStructuredDataProps) => {
  if (!items || items.length === 0) return null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') 
        ? item.url 
        : `${siteConfig.url}${item.url}`,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

// Helper to generate common breadcrumb paths
export const generateBreadcrumbs = {
  home: (): BreadcrumbItem[] => [
    { name: 'Home', url: '/' },
  ],
  
  directory: (): BreadcrumbItem[] => [
    { name: 'Home', url: '/' },
    { name: 'Business Directory', url: '/directory' },
  ],
  
  category: (categoryName: string): BreadcrumbItem[] => [
    { name: 'Home', url: '/' },
    { name: 'Business Directory', url: '/directory' },
    { name: categoryName, url: `/directory?category=${encodeURIComponent(categoryName)}` },
  ],
  
  business: (businessName: string, businessId: string, category?: string): BreadcrumbItem[] => {
    const crumbs: BreadcrumbItem[] = [
      { name: 'Home', url: '/' },
      { name: 'Business Directory', url: '/directory' },
    ];
    
    if (category) {
      crumbs.push({
        name: category,
        url: `/directory?category=${encodeURIComponent(category)}`,
      });
    }
    
    crumbs.push({
      name: businessName,
      url: `/business/${businessId}`,
    });
    
    return crumbs;
  },
  
  about: (): BreadcrumbItem[] => [
    { name: 'Home', url: '/' },
    { name: 'About Us', url: '/about' },
  ],
  
  howItWorks: (): BreadcrumbItem[] => [
    { name: 'Home', url: '/' },
    { name: 'How It Works', url: '/how-it-works' },
  ],
  
  sponsor: (): BreadcrumbItem[] => [
    { name: 'Home', url: '/' },
    { name: 'Become a Sponsor', url: '/sponsor' },
  ],
  
  ambassador: (): BreadcrumbItem[] => [
    { name: 'Home', url: '/' },
    { name: 'Ambassador Program', url: '/ambassador' },
  ],
};

export default BreadcrumbStructuredData;
