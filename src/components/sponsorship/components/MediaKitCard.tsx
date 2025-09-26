
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LucideIcon, Eye, Download } from 'lucide-react';

interface MediaKitCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onAction: () => void;
  onPreview?: () => void;
  buttonText: string;
  isLoading: boolean;
}

const MediaKitCard: React.FC<MediaKitCardProps> = ({
  title,
  description,
  icon: Icon,
  onAction,
  onPreview,
  buttonText,
  isLoading
}) => {
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
            onClick={onPreview}
            variant="outline"
            className="w-full border-mansablue text-mansablue hover:bg-mansablue hover:text-white"
          >
            <Eye className="mr-2 h-4 w-4" />
            Read
          </Button>
        )}
        <Button
          onClick={onAction}
          disabled={isLoading}
          className="w-full bg-mansablue hover:bg-mansablue-dark text-white"
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
      </CardContent>
    </Card>
  );
};

export default MediaKitCard;
