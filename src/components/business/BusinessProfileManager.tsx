
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Image, ImageIcon, Settings } from 'lucide-react';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import { 
  BusinessDetailsContent,
  BusinessImagesContent,
  BusinessProductsContent,
  BusinessSettingsContent
} from './business-settings';
import BusinessProfileLoading from './business-settings/BusinessProfileLoading';

const BusinessProfileManager = () => {
  const [activeTab, setActiveTab] = useState('details');
  const { profile, loading, handleProfileUpdate, handleImageUpdate } = useBusinessProfile();

  if (loading) {
    return <BusinessProfileLoading />;
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <FileText size={16} />
            Business Details
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image size={16} />
            Logo & Banner
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <ImageIcon size={16} />
            Products & Services
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings size={16} />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <BusinessDetailsContent profileId={profile?.id} />
        </TabsContent>

        <TabsContent value="images" className="mt-6">
          <BusinessImagesContent profile={profile} onImageUpdate={handleImageUpdate} />
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <BusinessProductsContent profile={profile} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <BusinessSettingsContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessProfileManager;
