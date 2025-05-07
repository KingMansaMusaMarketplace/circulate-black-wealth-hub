
import { useState } from 'react';
import { toast } from 'sonner';
import { uploadBusinessImage, deleteBusinessImage } from '@/lib/api/storage-api';
import { saveBusinessProfile } from '@/lib/api/business-api';
import { BusinessProfile } from '@/hooks/use-business-profile';

type ImageType = 'logo' | 'banner';
type ImageUpdates = { logo_url?: string, banner_url?: string };

interface UseBusinessImageProps {
  businessId: string;
  ownerId: string;
  onUpdate: (updates: ImageUpdates) => void;
}

export const useBusinessImage = ({ businessId, ownerId, onUpdate }: UseBusinessImageProps) => {
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const getLoadingState = (type: ImageType) => {
    return type === 'logo' ? uploadingLogo : uploadingBanner;
  };

  const setLoadingState = (type: ImageType, state: boolean) => {
    type === 'logo' ? setUploadingLogo(state) : setUploadingBanner(state);
  };

  const handleFileUpload = async (
    file: File | undefined,
    type: ImageType
  ) => {
    if (!file) return;

    setLoadingState(type, true);

    try {
      const result = await uploadBusinessImage(file, businessId, type);
      
      if ('url' in result) {
        // Save the URL to the business profile
        const updates = type === 'logo' 
          ? { logo_url: result.url } 
          : { banner_url: result.url };
        
        // Update business profile with new image URL
        await saveBusinessProfile({
          id: businessId,
          owner_id: ownerId,
          business_name: 'Temporary Name', // Required fields that will be overwritten
          description: 'Temporary Description', // on the backend since we're only updating specific fields
          category: 'Temporary Category',
          address: 'Temporary Address',
          city: 'Temporary City',
          state: 'Temporary State',
          zip_code: 'Temporary Zip',
          phone: 'Temporary Phone',
          email: 'temporary@email.com',
          ...updates
        } as BusinessProfile);
        
        // Notify parent component of the update
        onUpdate(updates);
        
        toast.success(`Business ${type} uploaded successfully!`);
      } else {
        toast.error(result.error);
      }
    } catch (error: any) {
      toast.error(`Failed to upload ${type}: ${error.message}`);
    } finally {
      setLoadingState(type, false);
    }
  };

  const handleDelete = async (type: ImageType, url?: string | null) => {
    if (!url) return;

    setLoadingState(type, true);

    try {
      await deleteBusinessImage(url);
      
      // Update business profile to remove the image URL
      const updates = type === 'logo' 
        ? { logo_url: null } 
        : { banner_url: null };
      
      await saveBusinessProfile({
        id: businessId,
        owner_id: ownerId,
        business_name: 'Temporary Name', // Required fields that will be overwritten
        description: 'Temporary Description', // on the backend since we're only updating specific fields
        category: 'Temporary Category',
        address: 'Temporary Address',
        city: 'Temporary City',
        state: 'Temporary State',
        zip_code: 'Temporary Zip',
        phone: 'Temporary Phone',
        email: 'temporary@email.com',
        ...updates
      } as BusinessProfile);
      
      // Notify parent component of the update
      onUpdate(updates);
      
      toast.success(`Business ${type} removed successfully!`);
    } catch (error: any) {
      toast.error(`Failed to delete ${type}: ${error.message}`);
    } finally {
      setLoadingState(type, false);
    }
  };

  return {
    uploadingLogo,
    uploadingBanner,
    handleFileUpload,
    handleDelete,
    getLoadingState
  };
};
