
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Crop } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  onUploadClick: () => void;
  onCropClick: () => void;
  isEdited?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  onUploadClick,
  onCropClick,
  isEdited = false
}) => {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-full rounded-lg overflow-hidden mb-4">
        <img 
          src={imageUrl} 
          alt="Preview" 
          className="w-full object-contain max-h-[400px]"
        />
        {isEdited && (
          <div className="absolute top-2 right-2 bg-primary/80 text-white text-xs px-2 py-1 rounded-md">
            Edited
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onUploadClick}
          aria-label="Change image"
        >
          <Upload className="mr-2 h-4 w-4" />
          Change Image
        </Button>
        
        <Button
          type="button"
          variant="default"
          onClick={onCropClick}
          aria-label="Edit image"
        >
          <Crop className="mr-2 h-4 w-4" />
          Edit Image
        </Button>
      </div>
    </div>
  );
};

export default ImagePreview;
