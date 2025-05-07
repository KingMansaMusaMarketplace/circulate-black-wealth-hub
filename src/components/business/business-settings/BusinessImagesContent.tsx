
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import BusinessImageUpload from '../BusinessImageUpload';
import { BusinessProfile } from '@/lib/api/business-api';

interface BusinessImagesContentProps {
  profile: BusinessProfile | null;
  onImageUpdate: (updates: { logo_url?: string, banner_url?: string }) => void;
}

const BusinessImagesContent: React.FC<BusinessImagesContentProps> = ({ profile, onImageUpdate }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        {profile?.id ? (
          <BusinessImageUpload 
            businessId={profile.id}
            ownerId={profile.owner_id}
            logoUrl={profile.logo_url}
            bannerUrl={profile.banner_url}
            onUpdate={onImageUpdate}
          />
        ) : (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
            <p>Please save your business details first before uploading images.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessImagesContent;
