
import React from 'react';
import { LogoUpload, BannerUpload } from './image-upload';
import { useBusinessImage } from '@/hooks/use-business-image';

interface BusinessImageUploadProps {
  businessId: string;
  ownerId: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  onUpdate: (updates: { logo_url?: string, banner_url?: string }) => void;
}

const BusinessImageUpload: React.FC<BusinessImageUploadProps> = ({
  businessId,
  ownerId,
  logoUrl,
  bannerUrl,
  onUpdate
}) => {
  const {
    uploadingLogo,
    uploadingBanner,
    handleFileUpload,
    handleDelete
  } = useBusinessImage({ businessId, ownerId, onUpdate });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Business Images</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LogoUpload 
          logoUrl={logoUrl}
          isUploading={uploadingLogo}
          onUpload={(file) => handleFileUpload(file, 'logo')}
          onDelete={() => handleDelete('logo', logoUrl)}
        />
        
        <BannerUpload 
          bannerUrl={bannerUrl}
          isUploading={uploadingBanner}
          onUpload={(file) => handleFileUpload(file, 'banner')}
          onDelete={() => handleDelete('banner', bannerUrl)}
        />
      </div>
    </div>
  );
};

export default BusinessImageUpload;
