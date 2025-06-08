
import React from 'react';
import BusinessAnalyticsDashboard from './analytics/BusinessAnalyticsDashboard';

interface BusinessAnalyticsTabProps {
  businessId: string;
}

const BusinessAnalyticsTab: React.FC<BusinessAnalyticsTabProps> = ({ businessId }) => {
  return <BusinessAnalyticsDashboard businessId={businessId} />;
};

export default BusinessAnalyticsTab;
