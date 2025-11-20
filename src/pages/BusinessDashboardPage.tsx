
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
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <Loader2 className="relative z-10 h-8 w-8 animate-spin text-blue-400" />
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
      
      <div className="relative min-h-screen overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10">
          <DashboardLayout title="Business Dashboard" icon={null}>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-slate-800/40 backdrop-blur-sm border border-white/10">
                <TabsTrigger value="overview" className="data-[state=active]:bg-slate-900/60 data-[state=active]:text-white text-white/70">Overview</TabsTrigger>
                <TabsTrigger value="financials" className="data-[state=active]:bg-slate-900/60 data-[state=active]:text-white text-white/70">Financials</TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-slate-900/60 data-[state=active]:text-white text-white/70">Reviews</TabsTrigger>
                <TabsTrigger value="coaching" className="data-[state=active]:bg-slate-900/60 data-[state=active]:text-white text-white/70">AI Coach</TabsTrigger>
                <TabsTrigger value="benefits" className="data-[state=active]:bg-slate-900/60 data-[state=active]:text-white text-white/70">Benefits</TabsTrigger>
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
      </div>
    </>
  );
};

export default BusinessDashboardPage;
