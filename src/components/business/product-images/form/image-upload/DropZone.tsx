
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onUploadClick: () => void;
  onDrop: (file: File) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onUploadClick, onDrop }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      
      if (validImageTypes.includes(file.type)) {
        onDrop(file);
      }
    }
  };

  return (
    <div 
      className={cn(
        "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
        "hover:bg-gray-50",
        isDragging ? "border-primary bg-primary/5" : "border-gray-300"
      )}
      onClick={onUploadClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-label="Drop zone for image upload"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onUploadClick();
        }
      }}
    >
      <Image className="h-12 w-12 text-gray-300 mb-3 animate-pulse" />
      <p className="text-gray-500 mb-2">
        {isDragging ? "Drop image to upload" : "Click or drag to upload a product image"}
      </p>
      <p className="text-xs text-gray-400 mb-4">PNG, JPG, WEBP up to 5MB</p>
      <Button 
        type="button" 
        variant="outline"
        className="group transition-all duration-200 hover:bg-primary hover:text-white"
        aria-label="Select image file"
      >
        <Upload className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" /> Select Image
      </Button>
    </div>
  );
};

export default DropZone;
