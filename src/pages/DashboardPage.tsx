
import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeGuide from '@/components/dashboard/WelcomeGuide';

const DashboardPage = () => {
  const { userType } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Dashboard | Mansa Musa Marketplace</title>
        <meta name="description" content="Access your personalized dashboard for the Mansa Musa Marketplace. Track your loyalty points, find nearby businesses, and manage your account." />
      </Helmet>

      <Navbar />
      <main className="flex-grow">
        <DashboardLayout />
        {userType && <WelcomeGuide userType={userType} />}
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
