
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LucideIcon, Eye, Download, Share2, FileText } from 'lucide-react';
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
  secondaryAction?: () => void;
  secondaryButtonText?: string;
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
  shareText,
  secondaryAction,
  secondaryButtonText
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

  const handleSecondaryAction = () => {
    if (secondaryAction) {
      haptics.light();
      secondaryAction();
    }
  };

  return (
    <Card className="h-full flex flex-col bg-slate-800/50 backdrop-blur-sm border-white/10">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto bg-yellow-400/20 p-3 rounded-full w-fit mb-3">
          <Icon className="h-8 w-8 text-yellow-400" />
        </div>
        <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
        <CardDescription className="text-sm text-blue-200">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end space-y-2">
        {onPreview && (
          <Button
            onClick={handlePreview}
            variant="outline"
            className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-900"
          >
            <Eye className="mr-2 h-4 w-4" />
            Read
          </Button>
        )}
        {secondaryAction && secondaryButtonText && (
          <Button
            onClick={handleSecondaryAction}
            disabled={isLoading}
            variant="outline"
            className="w-full border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                {secondaryButtonText}
              </>
            )}
          </Button>
        )}
        <div className="flex gap-2">
          <Button
            onClick={handleAction}
            disabled={isLoading}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-slate-900"
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
            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-900"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaKitCard;
