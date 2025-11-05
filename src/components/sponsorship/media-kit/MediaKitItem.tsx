
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useNativeShare } from '@/hooks/use-native-share';

export interface MediaKitItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  action?: string;
  onDownload: (title: string, action?: string) => void;
  shareText?: string;
}

const MediaKitItem: React.FC<MediaKitItemProps> = ({
  icon,
  title,
  description,
  buttonText,
  action,
  onDownload,
  shareText
}) => {
  const haptics = useHapticFeedback();
  const { shareUrl, isSharing } = useNativeShare();

  const handleDownload = () => {
    haptics.light();
    onDownload(title, action);
  };

  const handleShare = async () => {
    haptics.light();
    const url = window.location.origin + '/sponsor-pricing';
    const text = shareText || `Check out this sponsorship material: ${title}`;
    
    await shareUrl(url, text, title);
  };

  return (
    <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-sm h-full">
      <div className="mb-4 bg-white p-3 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 flex-grow">{description}</p>
      <div className="flex gap-2 w-full">
        <Button 
          className="flex-1 bg-mansablue hover:bg-mansablue-dark"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
        <Button
          onClick={handleShare}
          disabled={isSharing}
          variant="outline"
          className="border-mansablue text-mansablue hover:bg-mansablue hover:text-white"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MediaKitItem;
