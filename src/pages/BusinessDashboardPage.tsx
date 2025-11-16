
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/dashboard';
import BusinessDashboard from '@/components/business/BusinessDashboard';
import { Loader2 } from 'lucide-react';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialsTab } from '@/components/business/financials/FinancialsTab';
import { AICoachingTab } from '@/components/business/coaching/AICoachingTab';
import { ReviewRequestsAnalytics } from '@/components/business/reviews/ReviewRequestsAnalytics';
import { BusinessSubscriptionBenefits } from '@/components/business/subscription/BusinessSubscriptionBenefits';

const BusinessDashboardPage = () => {
  const { user, userType, loading, authInitialized } = useAuth();
  const { profile, loading: profileLoading } = useBusinessProfile();

  // Show loading while auth is initializing
  if (loading || !authInitialized || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-mansablue" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to regular dashboard if not a business user
  if (userType !== 'business') {
    return <Navigate to="/dashboard" replace />;
  }

  if (!profile?.id) {
    return (
      <DashboardLayout title="Business Dashboard" icon={null}>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Please complete your business profile first</p>
          <Navigate to="/business-dashboard" replace />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Business Dashboard | Mansa Musa Marketplace</title>
        <meta name="description" content="Manage your business profile, analytics, and engagement tools" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <DashboardLayout title="Business Dashboard" icon={null}>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="coaching">AI Coach</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <BusinessDashboard businessId={profile.id} />
          </TabsContent>
          
          <TabsContent value="financials">
            <FinancialsTab businessId={profile.id} />
          </TabsContent>
          
          <TabsContent value="reviews">
            <ReviewRequestsAnalytics businessId={profile.id} />
          </TabsContent>
          
          <TabsContent value="coaching">
            <AICoachingTab businessId={profile.id} />
          </TabsContent>
          
          <TabsContent value="benefits">
            <BusinessSubscriptionBenefits />
          </TabsContent>
        </Tabs>
        </DashboardLayout>
      </div>
    </>
  );
};

export default BusinessDashboardPage;
