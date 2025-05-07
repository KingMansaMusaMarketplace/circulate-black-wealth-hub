
import React, { useCallback, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ImagePlus, X, Upload, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface BatchUploaderProps {
  onSelectFiles: (files: File[]) => void;
  maxFiles?: number;
}

const BatchUploader: React.FC<BatchUploaderProps> = ({
  onSelectFiles,
  maxFiles = 10
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      const validFiles = files.slice(0, maxFiles - selectedFiles.length);
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  }, [maxFiles, selectedFiles]);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validFiles = files.slice(0, maxFiles - selectedFiles.length);
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  }, [maxFiles, selectedFiles]);
  
  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  const handleSubmit = useCallback(() => {
    if (selectedFiles.length > 0) {
      onSelectFiles(selectedFiles);
      setSelectedFiles([]);
    }
  }, [selectedFiles, onSelectFiles]);
  
  return (
    <div className="space-y-4">
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center",
          dragActive ? "border-primary bg-primary/5" : "border-gray-300",
          selectedFiles.length >= maxFiles ? "opacity-50 pointer-events-none" : ""
        )}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="bg-gray-100 p-3 rounded-full">
            <ImagePlus className="h-6 w-6 text-gray-500" />
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Drag & drop product images, or <label className="text-primary cursor-pointer">browse</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
                disabled={selectedFiles.length >= maxFiles}
              />
            </p>
            <p className="text-xs text-gray-500">
              {selectedFiles.length < maxFiles ? 
                `Upload up to ${maxFiles - selectedFiles.length} more images` :
                "Maximum number of images reached"
              }
            </p>
          </div>
        </div>
      </div>
      
      {selectedFiles.length > 0 && (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Selected Images ({selectedFiles.length})</h4>
              <Button variant="ghost" size="sm" onClick={() => setSelectedFiles([])}>
                Clear All
              </Button>
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto p-1">
              {selectedFiles.map((file, index) => (
                <div 
                  key={`${file.name}-${index}`}
                  className="flex items-center p-2 bg-gray-50 rounded-md"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden mr-3 flex-shrink-0">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload {selectedFiles.length} Images
            </Button>
          </div>
        </>
      )}
      
      <Progress value={(selectedFiles.length / maxFiles) * 100} className="h-1" />
      <p className="text-xs text-center text-gray-500">
        {selectedFiles.length} of {maxFiles} images selected
      </p>
    </div>
  );
};

export default BatchUploader;
