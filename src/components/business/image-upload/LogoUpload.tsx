
import React, { useRef } from 'react';
import ImageUploadCard from './ImageUploadCard';

interface LogoUploadProps {
  logoUrl?: string | null;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onDelete: () => void;
}

const LogoUpload: React.FC<LogoUploadProps> = ({
  logoUrl,
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
        title="Business Logo"
        imageUrl={logoUrl}
        isUploading={isUploading}
        recommendedSize="400x400px"
        onUploadClick={() => fileInputRef.current?.click()}
        onDeleteClick={onDelete}
        uploadInputId="logo-upload"
      />
      
      <input
        ref={fileInputRef}
        id="logo-upload"
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </>
  );
};

export default LogoUpload;
