
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { businesses } from '@/data/businessesData';
import { 
  BusinessDetailHeader, 
  AboutTab, 
  ReviewsTab, 
  PhotosTab, 
  LoadingState, 
  NotFoundState 
} from '@/components/business-detail';

const BusinessDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(true);
  
  const businessId = Number(id);
  
  // Find the business from our data
  const [business, setBusiness] = useState(() => {
    const foundBusiness = businesses.find(b => b.id === businessId);
    return foundBusiness || null;
  });

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return <LoadingState />;
  }

  if (!business) {
    return <NotFoundState />;
  }
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
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
      
      <Footer />
    </div>
  );
};

export default BusinessDetailPage;
