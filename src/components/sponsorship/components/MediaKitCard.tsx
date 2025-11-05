
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LucideIcon, Eye, Download, Share2 } from 'lucide-react';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useNativeShare } from '@/hooks/use-native-share';

interface MediaKitCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onAction: () => void;
  onPreview?: () => void;
  buttonText: string;
  isLoading: boolean;
  shareTitle?: string;
  shareText?: string;
}

const MediaKitCard: React.FC<MediaKitCardProps> = ({
  title,
  description,
  icon: Icon,
  onAction,
  onPreview,
  buttonText,
  isLoading,
  shareTitle,
  shareText
}) => {
  const haptics = useHapticFeedback();
  const { shareUrl, isSharing } = useNativeShare();

  const handleAction = () => {
    haptics.light();
    onAction();
  };

  const handlePreview = () => {
    if (onPreview) {
      haptics.light();
      onPreview();
    }
  };

  const handleShare = async () => {
    haptics.light();
    const url = window.location.origin + '/sponsor-pricing';
    const text = shareText || `Check out this sponsorship material: ${title}`;
    const dialogTitle = shareTitle || title;
    
    await shareUrl(url, text, dialogTitle);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto bg-mansablue/10 p-3 rounded-full w-fit mb-3">
          <Icon className="h-8 w-8 text-mansablue" />
        </div>
        <CardTitle className="text-lg font-semibold text-mansablue">{title}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end space-y-2">
        {onPreview && (
          <Button
            onClick={handlePreview}
            variant="outline"
            className="w-full border-mansablue text-mansablue hover:bg-mansablue hover:text-white"
          >
            <Eye className="mr-2 h-4 w-4" />
            Read
          </Button>
        )}
        <div className="flex gap-2">
          <Button
            onClick={handleAction}
            disabled={isLoading}
            className="flex-1 bg-mansablue hover:bg-mansablue-dark text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                {buttonText}
              </>
            )}
          </Button>
          <Button
            onClick={handleShare}
            disabled={isSharing || isLoading}
            variant="outline"
            className="border-mansablue text-mansablue hover:bg-mansablue hover:text-white"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaKitCard;
