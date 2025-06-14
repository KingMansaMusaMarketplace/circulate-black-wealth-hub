
import React from 'react';
import { lazy } from 'react';

const SponsorshipVideoSection = lazy(() => import('@/components/HowItWorks/SponsorshipVideoSection'));

const LazySponsorshipVideoSection: React.FC = () => {
  return <SponsorshipVideoSection />;
};

export default LazySponsorshipVideoSection;
