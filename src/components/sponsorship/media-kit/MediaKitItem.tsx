
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface MediaKitItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  action?: string;
  onDownload: (title: string, action?: string) => void;
}

const MediaKitItem: React.FC<MediaKitItemProps> = ({
  icon,
  title,
  description,
  buttonText,
  action,
  onDownload
}) => {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-sm h-full">
      <div className="mb-4 bg-white p-3 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 flex-grow">{description}</p>
      <Button 
        className="bg-mansablue hover:bg-mansablue-dark"
        onClick={() => onDownload(title, action)}
      >
        <Download className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>
    </div>
  );
};

export default MediaKitItem;
