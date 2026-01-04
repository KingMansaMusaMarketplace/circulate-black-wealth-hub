import { Helmet } from 'react-helmet';

interface BusinessStructuredDataProps {
  business: {
    id: string;
    business_name?: string;
    name?: string;
    description?: string;
    category?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo_url?: string;
    banner_url?: string;
    average_rating?: number;
    review_count?: number;
  };
}

// Map business categories to schema.org types
const getCategoryType = (category?: string): string => {
  if (!category) return 'LocalBusiness';
  
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('restaurant') || categoryLower.includes('food') || categoryLower.includes('dining')) {
    return 'Restaurant';
  }
  if (categoryLower.includes('salon') || categoryLower.includes('beauty') || categoryLower.includes('spa')) {
    return 'BeautySalon';
  }
  if (categoryLower.includes('health') || categoryLower.includes('medical') || categoryLower.includes('clinic')) {
    return 'MedicalBusiness';
  }
  if (categoryLower.includes('legal') || categoryLower.includes('law') || categoryLower.includes('attorney')) {
    return 'LegalService';
  }
  if (categoryLower.includes('retail') || categoryLower.includes('shop') || categoryLower.includes('store')) {
    return 'Store';
  }
  if (categoryLower.includes('auto') || categoryLower.includes('car') || categoryLower.includes('mechanic')) {
    return 'AutoRepair';
  }
  if (categoryLower.includes('fitness') || categoryLower.includes('gym')) {
    return 'SportsActivityLocation';
  }
  if (categoryLower.includes('education') || categoryLower.includes('school') || categoryLower.includes('tutoring')) {
    return 'EducationalOrganization';
  }
  if (categoryLower.includes('financial') || categoryLower.includes('accounting') || categoryLower.includes('tax')) {
    return 'FinancialService';
  }
  if (categoryLower.includes('real estate') || categoryLower.includes('property')) {
    return 'RealEstateAgent';
  }
  if (categoryLower.includes('cleaning') || categoryLower.includes('home service')) {
    return 'HomeAndConstructionBusiness';
  }
  if (categoryLower.includes('professional') || categoryLower.includes('consulting')) {
    return 'ProfessionalService';
  }
  
  return 'LocalBusiness';
};

export const BusinessStructuredData = ({ business }: BusinessStructuredDataProps) => {
  const businessName = business.business_name || business.name || 'Business';
  const schemaType = getCategoryType(business.category);
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': `https://mansamusamarketplace.com/business/${business.id}`,
    name: businessName,
    description: business.description || `${businessName} - Black-owned business on Mansa Musa Marketplace`,
    url: `https://mansamusamarketplace.com/business/${business.id}`,
    ...(business.logo_url && { logo: business.logo_url }),
    ...(business.banner_url && { image: business.banner_url }),
    ...(business.phone && { telephone: business.phone }),
    ...(business.email && { email: business.email }),
    ...(business.website && { sameAs: [business.website] }),
    ...(business.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address,
        ...(business.city && { addressLocality: business.city }),
        ...(business.state && { addressRegion: business.state }),
        ...(business.zip_code && { postalCode: business.zip_code }),
        addressCountry: 'US',
      },
    }),
    ...(business.average_rating && business.review_count && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: business.average_rating.toFixed(1),
        reviewCount: business.review_count,
        bestRating: '5',
        worstRating: '1',
      },
    }),
    isPartOf: {
      '@type': 'WebSite',
      name: 'Mansa Musa Marketplace',
      url: 'https://mansamusamarketplace.com',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default BusinessStructuredData;
