
import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';

const BusinessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <ResponsiveLayout
      title="Business Profile"
      description="View business details and information"
    >
      <Helmet>
        <title>Business Profile | Mansa Musa Marketplace</title>
        <meta name="description" content="Business profile and details" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-mansablue mb-6">
          Business Profile
        </h1>
        <p className="text-gray-600">
          Business ID: {id}
        </p>
        <p className="text-gray-600 mt-4">
          Business profile page coming soon...
        </p>
      </div>
    </ResponsiveLayout>
  );
};

export default BusinessPage;
