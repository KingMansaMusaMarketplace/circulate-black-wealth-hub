
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { businesses } from '@/data/businessesData';
import { fetchBusinessById } from '@/lib/api/directory/fetch-business-by-id';
import { Business } from '@/types/business';
import { 
  BusinessDetailHeader, 
  AboutTab, 
  ReviewsTab, 
  PhotosTab, 
  LoadingState, 
  NotFoundState 
} from '@/components/business-detail';

const BusinessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  
  useEffect(() => {
    const loadBusiness = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      // First try to fetch from database (for UUID format IDs)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      
      if (isUUID) {
        const dbBusiness = await fetchBusinessById(id);
        if (dbBusiness) {
          setBusiness(dbBusiness);
          setLoading(false);
          return;
        }
      }
      
      // Fall back to mock data for simple string IDs
      const mockBusiness = businesses.find(b => b.id === id);
      setBusiness(mockBusiness || null);
      setLoading(false);
    };
    
    loadBusiness();
  }, [id]);

  if (loading) {
    return <LoadingState />;
  }

  if (!business) {
    console.log('BusinessPage - Business not found, showing NotFoundState');
    return <NotFoundState />;
  }
  
  return (
    <>
      <Helmet>
        <title>{business.name} | Mansa Musa Marketplace</title>
        <meta name="description" content={business.description} />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <main className="container mx-auto px-4 py-8 relative z-10">
          {/* Business Header */}
          <BusinessDetailHeader business={business} />
          
          {/* Business Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8 bg-slate-800/40 backdrop-blur-sm border border-white/10">
              <TabsTrigger 
                value="about"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-white/70"
              >
                About
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-white/70"
              >
                Reviews ({business.reviewCount})
              </TabsTrigger>
              <TabsTrigger 
                value="photos"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-white/70"
              >
                Photos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="about">
              <AboutTab business={business} />
            </TabsContent>
            
            <TabsContent value="reviews">
              <ReviewsTab business={business} />
            </TabsContent>
            
            <TabsContent value="photos">
              <PhotosTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default BusinessPage;
