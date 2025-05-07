
import { useState } from 'react';
import { uploadBusinessImage, deleteBusinessImage } from '@/lib/api/storage-api';
import { toast } from 'sonner';

interface BusinessImageHookProps {
  businessId: string;
  ownerId: string;
  onUpdate: (updates: { logo_url?: string, banner_url?: string }) => void;
}

export const useBusinessImage = ({ businessId, ownerId, onUpdate }: BusinessImageHookProps) => {
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Handle file upload (logo or banner)
  const handleFileUpload = async (file: File, type: 'logo' | 'banner') => {
    if (!businessId) {
      toast.error("Please save business details first");
      return;
    }

    // Set the appropriate loading state
    if (type === 'logo') {
      setUploadingLogo(true);
    } else {
      setUploadingBanner(true);
    }

    try {
      const result = await uploadBusinessImage(file, businessId, type);

      if ('error' in result) {
        throw new Error(result.error);
      }

      // Update the business record with the new image URL
      const updates = type === 'logo'
        ? { logo_url: result.url }
        : { banner_url: result.url };

      onUpdate(updates);
      toast.success(`${type === 'logo' ? 'Logo' : 'Banner'} uploaded successfully`);
    } catch (error: any) {
      console.error(`Error uploading ${type}:`, error);
      toast.error(`Failed to upload ${type}: ${error.message}`);
    } finally {
      // Clear the loading state
      if (type === 'logo') {
        setUploadingLogo(false);
      } else {
        setUploadingBanner(false);
      }
    }
  };

  // Handle image deletion
  const handleDelete = async (type: 'logo' | 'banner', url?: string | null) => {
    if (!url) return;

    try {
      const result = await deleteBusinessImage(url);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      // Update the business record to clear the image URL
      const updates = type === 'logo'
        ? { logo_url: null }
        : { banner_url: null };

      onUpdate(updates);
      toast.success(`${type === 'logo' ? 'Logo' : 'Banner'} removed successfully`);
    } catch (error: any) {
      console.error(`Error removing ${type}:`, error);
      toast.error(`Failed to remove ${type}: ${error.message}`);
    }
  };

  return {
    uploadingLogo,
    uploadingBanner,
    handleFileUpload,
    handleDelete
  };
};
