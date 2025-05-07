
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CropContainer from './image-upload/CropContainer';
import DropZone from './image-upload/DropZone';
import ImagePreview from './image-upload/ImagePreview';

interface ImageUploadPreviewProps {
  previewUrl: string | null;
  onUploadClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formError?: string;
  quality?: number;
  setQuality?: (quality: number) => void;
  aspectRatio?: number;
  setAspectRatio?: (ratio: number) => void;
  onApplyCrop?: (originalSize: number, compressedSize: number) => void;
}

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
  previewUrl,
  onUploadClick,
  fileInputRef,
  onFileChange,
  formError,
  quality = 92,
  setQuality,
  aspectRatio = 16/9,
  setAspectRatio,
  onApplyCrop
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [crop, setCrop] = useState<any>(undefined);
  const [completedCrop, setCompletedCrop] = useState<any>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleEditImage = () => {
    setIsEditing(true);
    setScale(1);
    setRotation(0);
  };

  const handleApplyCrop = () => {
    // In a real implementation, you would process the cropped image here
    setIsEditing(false);
    if (onApplyCrop) {
      // Pass some default values if we don't have real processed data
      onApplyCrop(1000, 800);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCrop(undefined);
    setCompletedCrop(null);
    setScale(1);
    setRotation(0);
  };

  // Handle drop functionality for DropZone
  const handleDrop = (file: File) => {
    // Create a synthetic event object to pass to onFileChange
    const dummyInput = document.createElement('input');
    dummyInput.type = 'file';
    
    // Use the DataTransfer API to create a files list
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    dummyInput.files = dataTransfer.files;
    
    // Create a synthetic change event
    const event = {
      target: dummyInput,
      currentTarget: dummyInput,
      preventDefault: () => {},
      stopPropagation: () => {}
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    onFileChange(event);
  };

  return (
    <div className="space-y-4">
      {formError && (
        <Alert variant="destructive">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <div className="border rounded-lg p-4">
        {previewUrl ? (
          isEditing ? (
            <CropContainer 
              imageUrl={previewUrl}
              crop={crop}
              setCrop={setCrop}
              setCompletedCrop={setCompletedCrop}
              scale={scale}
              setScale={setScale}
              rotation={rotation}
              setRotation={setRotation}
              onCancel={handleCancelEdit}
              onApply={handleApplyCrop}
              imgRef={imgRef}
              quality={quality}
              setQuality={setQuality}
              aspectRatio={aspectRatio}
              setAspectRatio={setAspectRatio}
            />
          ) : (
            <ImagePreview 
              imageUrl={previewUrl} 
              onCropClick={handleEditImage} 
              onUploadClick={onUploadClick}
              isEdited={completedCrop !== null}
            />
          )
        ) : (
          <DropZone 
            onUploadClick={onUploadClick}
            onDrop={handleDrop}
          />
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload product image"
      />
    </div>
  );
};

export default ImageUploadPreview;
