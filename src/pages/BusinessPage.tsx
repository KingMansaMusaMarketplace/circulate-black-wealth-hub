
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

      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          {/* Business Header */}
          <BusinessDetailHeader business={business} />
          
          {/* Business Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({business.reviewCount})</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
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
