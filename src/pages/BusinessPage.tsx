
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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

const BusinessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(true);
  
  console.log('BusinessPage - URL param id:', id);
  console.log('BusinessPage - Available businesses:', businesses.length);
  console.log('BusinessPage - First few business IDs:', businesses.slice(0, 5).map(b => ({ id: b.id, name: b.name })));
  
  const businessId = Number(id);
  console.log('BusinessPage - Converted businessId:', businessId);
  
  // Find the business from our data
  const business = businesses.find(b => b.id === businessId);
  console.log('BusinessPage - Found business:', business ? business.name : 'Not found');

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Reduced loading time

    return () => clearTimeout(timer);
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
    </>
  );
};

export default BusinessPage;
