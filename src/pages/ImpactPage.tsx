import React from 'react';
import { ImpactDashboard } from '@/components/ImpactDashboard';
import { updateMetaTags } from '@/utils/seoUtils';
import { useEffect } from 'react';

const ImpactPage = () => {
  useEffect(() => {
    updateMetaTags({
      title: 'My Impact - Mansa Musa Marketplace',
      description: 'See how you\'re building Black wealth and circulating money within the community through Mansa Musa Marketplace.',
      path: '/impact'
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ImpactDashboard />
      </div>
    </div>
  );
};

export default ImpactPage;
