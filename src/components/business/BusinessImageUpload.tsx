import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Image, Upload, Trash2, Loader2 } from 'lucide-react';
import { uploadBusinessImage, deleteBusinessImage } from '@/lib/api/storage-api';
import { saveBusinessProfile, BusinessProfile } from '@/lib/api/business-api';

interface BusinessImageUploadProps {
  businessId: string;  // Made this required since it's needed for upload
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
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'banner'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const setLoading = type === 'logo' ? setUploadingLogo : setUploadingBanner;
    setLoading(true);

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
      setLoading(false);
      // Clear the input value to allow uploading the same file again
      event.target.value = '';
    }
  };

  const handleDelete = async (type: 'logo' | 'banner', url?: string | null) => {
    if (!url) return;

    const setLoading = type === 'logo' ? setUploadingLogo : setUploadingBanner;
    setLoading(true);

    try {
      await deleteBusinessImage(url);
      
      // Update business profile to remove the image URL
      const updates = type === 'logo' 
        ? { logo_url: null } 
        : { banner_url: null };
      
      await saveBusinessProfile({
        id: businessId,
        owner_id: ownerId,
        ...updates
      } as BusinessProfile);
      
      // Notify parent component of the update
      onUpdate(updates);
      
      toast.success(`Business ${type} removed successfully!`);
    } catch (error: any) {
      toast.error(`Failed to delete ${type}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Business Images</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logo Upload */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Image className="mr-2 h-5 w-5" /> 
              Business Logo
            </h3>
            
            {logoUrl ? (
              <div className="space-y-4">
                <div className="border rounded-lg p-4 flex justify-center">
                  <img 
                    src={logoUrl} 
                    alt="Business Logo" 
                    className="max-h-40 object-contain"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    disabled={uploadingLogo}
                    className="flex-1"
                  >
                    {uploadingLogo ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Update Logo
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete('logo', logoUrl)}
                    disabled={uploadingLogo}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
                  <Image className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 mb-2">Upload your business logo</p>
                  <p className="text-xs text-gray-400 mb-4">Recommended size: 400x400px</p>
                  
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    disabled={uploadingLogo}
                  >
                    {uploadingLogo ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Logo
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'logo')}
              className="hidden"
            />
          </CardContent>
        </Card>
        
        {/* Banner Upload */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Image className="mr-2 h-5 w-5" /> 
              Business Banner
            </h3>
            
            {bannerUrl ? (
              <div className="space-y-4">
                <div className="border rounded-lg p-4 flex justify-center">
                  <img 
                    src={bannerUrl} 
                    alt="Business Banner" 
                    className="max-h-40 object-contain"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('banner-upload')?.click()}
                    disabled={uploadingBanner}
                    className="flex-1"
                  >
                    {uploadingBanner ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Update Banner
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete('banner', bannerUrl)}
                    disabled={uploadingBanner}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
                  <Image className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 mb-2">Upload your business banner</p>
                  <p className="text-xs text-gray-400 mb-4">Recommended size: 1200x400px</p>
                  
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('banner-upload')?.click()}
                    disabled={uploadingBanner}
                  >
                    {uploadingBanner ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Banner
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            <input
              id="banner-upload"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'banner')}
              className="hidden"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessImageUpload;
