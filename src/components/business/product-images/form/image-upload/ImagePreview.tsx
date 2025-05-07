
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, CropIcon } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  onUploadClick: () => void;
  onCropClick: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  onUploadClick,
  onCropClick
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt="Product image preview" 
          className="max-h-[400px] object-contain transition-all duration-300 hover:scale-[1.02]"
        />
      </div>
      
      <div className="flex space-x-2 animate-fade-in">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onUploadClick}
          className="flex-1 transition-all duration-200 hover:border-primary"
          aria-label="Change image"
        >
          <Upload className="mr-2 h-4 w-4" /> Change Image
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCropClick}
          className="transition-all duration-200 hover:border-primary"
          aria-label="Crop image"
        >
          <CropIcon className="mr-2 h-4 w-4" /> Crop
        </Button>
      </div>
    </div>
  );
};

export default ImagePreview;
