
import React, { useState, useRef } from "react";
import { PercentCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { applyCropToImage, compressImage, dataUrlToFile } from './image-upload/utils/imageProcessor';
import { CropContainer, DropZone, ImagePreview } from './image-upload';

interface ImageUploadPreviewProps {
  previewUrl: string | null;
  onUploadClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  formError?: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
  previewUrl,
  onUploadClick,
  fileInputRef,
  formError,
  onFileChange
}) => {
  const [crop, setCrop] = useState<PercentCrop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isCropping, setIsCropping] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  
  // Handle crop completion
  const applyCrop = () => {
    if (imgRef.current && completedCrop && previewUrl) {
      // Apply crop and get data URL
      const croppedImageUrl = applyCropToImage(imgRef.current, completedCrop, scale, rotation);
      
      if (croppedImageUrl) {
        setCroppedPreviewUrl(croppedImageUrl);
        setIsCropping(false);
        setScale(1); // Reset scale after cropping
        setRotation(0); // Reset rotation after cropping
      }
    }
  };
  
  // Convert data URL to file for submission
  React.useEffect(() => {
    if (croppedPreviewUrl && fileInputRef.current && fileInputRef.current.files?.length) {
      const originalFile = fileInputRef.current.files[0];
      
      const processImageFile = async () => {
        try {
          // Convert data URL to File object
          const croppedFile = await dataUrlToFile(croppedPreviewUrl, originalFile.name);
          
          // Compress image if it's larger than 1MB
          const finalFile = croppedFile.size > 1024 * 1024 
            ? await compressImage(croppedFile, originalFile.name)
            : croppedFile;
            
          // Replace file in input
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(finalFile);
          
          // Replace the original file with the cropped one
          if (fileInputRef.current) {
            fileInputRef.current.files = dataTransfer.files;
            
            // Dispatch change event to update the form state
            const event = new Event('change', { bubbles: true });
            fileInputRef.current.dispatchEvent(event);
          }
        } catch (error) {
          console.error("Error processing cropped image:", error);
        }
      };
      
      processImageFile();
    }
  }, [croppedPreviewUrl, fileInputRef]);
  
  // Start cropping mode
  const startCropping = () => {
    setIsCropping(true);
    setCroppedPreviewUrl(null);
    setScale(1); // Reset scale when starting to crop
    setRotation(0); // Reset rotation when starting to crop
  };
  
  // Cancel cropping
  const cancelCropping = () => {
    setIsCropping(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setScale(1); // Reset scale after canceling
    setRotation(0); // Reset rotation after canceling
  };

  // Handle drag and drop
  const handleFileDrop = (file: File) => {
    // Create a DataTransfer object to set the file in the input
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.files = dataTransfer.files;
      
      // Dispatch change event to update form state
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };
  
  const displayUrl = croppedPreviewUrl || previewUrl;
  
  return (
    <div className="border rounded-lg p-4 transition-all duration-300">
      {displayUrl ? (
        isCropping ? (
          <CropContainer 
            imageUrl={previewUrl!} 
            crop={crop}
            setCrop={setCrop}
            setCompletedCrop={setCompletedCrop}
            scale={scale}
            setScale={setScale}
            rotation={rotation}
            setRotation={setRotation}
            onCancel={cancelCropping}
            onApply={applyCrop}
            imgRef={imgRef}
          />
        ) : (
          <ImagePreview 
            imageUrl={displayUrl}
            onUploadClick={onUploadClick}
            onCropClick={startCropping}
          />
        )
      ) : (
        <DropZone 
          onUploadClick={onUploadClick}
          onDrop={handleFileDrop}
        />
      )}
      
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden" 
        accept="image/*" 
        aria-label="Upload image"
      />
      
      {formError && (
        <p className="text-sm font-medium text-destructive mt-2" aria-live="assertive">
          {formError}
        </p>
      )}
    </div>
  );
};

export default ImageUploadPreview;
