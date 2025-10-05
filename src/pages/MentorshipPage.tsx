
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MentorshipMatchingPage } from '@/components/mentorship';

const MentorshipPage = () => {
  return (
    <>
      <Helmet>
        <title>Mentorship Network | Mansa Musa Marketplace</title>
        <meta 
          name="description" 
          content="Connect with experienced Black business owners and accelerate your entrepreneurial journey through our mentorship matching platform." 
        />
        <meta name="keywords" content="business mentorship, Black entrepreneurs, startup guidance, business coaching" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <MentorshipMatchingPage />
      </div>
    </>
  );
};

export default MentorshipPage;
