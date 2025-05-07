
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, Trash2, Image } from 'lucide-react';

interface ImageUploadCardProps {
  title: string;
  imageUrl?: string | null;
  isUploading: boolean;
  recommendedSize: string;
  onUploadClick: () => void;
  onDeleteClick: () => void;
  uploadInputId: string;
}

const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
  title,
  imageUrl,
  isUploading,
  recommendedSize,
  onUploadClick,
  onDeleteClick,
  uploadInputId,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Image className="mr-2 h-5 w-5" /> 
          {title}
        </h3>
        
        {imageUrl ? (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 flex justify-center">
              <img 
                src={imageUrl} 
                alt={title} 
                className="max-h-40 object-contain"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={onUploadClick}
                disabled={isUploading}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Update {title.split(' ').pop()}
                  </>
                )}
              </Button>
              
              <Button
                variant="destructive"
                onClick={onDeleteClick}
                disabled={isUploading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
              <Image className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 mb-2">Upload your {title.toLowerCase()}</p>
              <p className="text-xs text-gray-400 mb-4">Recommended size: {recommendedSize}</p>
              
              <Button
                variant="outline"
                onClick={onUploadClick}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload {title.split(' ').pop()}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploadCard;
