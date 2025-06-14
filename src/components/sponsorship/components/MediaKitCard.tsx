
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, LucideIcon } from 'lucide-react';

interface MediaKitCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onAction: () => void;
  buttonText: string;
  isLoading?: boolean;
}

const MediaKitCard: React.FC<MediaKitCardProps> = ({
  title,
  description,
  icon: Icon,
  onAction,
  buttonText,
  isLoading = false
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="text-center">
        <Icon className="h-12 w-12 text-mansagold mx-auto mb-4" />
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          className="w-full" 
          onClick={onAction}
          disabled={isLoading}
        >
          <Download className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MediaKitCard;
