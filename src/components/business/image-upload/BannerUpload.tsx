
import React, { useRef } from 'react';
import ImageUploadCard from './ImageUploadCard';

interface BannerUploadProps {
  bannerUrl?: string | null;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onDelete: () => void;
}

const BannerUpload: React.FC<BannerUploadProps> = ({
  bannerUrl,
  isUploading,
  onUpload,
  onDelete
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    // Clear the input value to allow uploading the same file again
    e.target.value = '';
  };

  return (
    <>
      <ImageUploadCard
        title="Business Banner"
        imageUrl={bannerUrl}
        isUploading={isUploading}
        recommendedSize="1200x400px"
        onUploadClick={() => fileInputRef.current?.click()}
        onDeleteClick={onDelete}
        uploadInputId="banner-upload"
      />
      
      <input
        ref={fileInputRef}
        id="banner-upload"
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </>
  );
};

export default BannerUpload;
