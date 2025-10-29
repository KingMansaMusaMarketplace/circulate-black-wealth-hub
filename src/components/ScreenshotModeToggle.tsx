import React from 'react';
import { useScreenshotMode } from '@/contexts/ScreenshotModeContext';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ScreenshotModeToggle: React.FC = () => {
  const { isScreenshotMode, enableScreenshotMode, disableScreenshotMode } = useScreenshotMode();

  if (!isScreenshotMode) {
    return (
      <Button
        onClick={enableScreenshotMode}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-white shadow-lg"
      >
        <Camera className="h-4 w-4 mr-2" />
        Screenshot Mode
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 shadow-xl border-2 border-blue-500 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Camera className="h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <p className="font-semibold text-blue-900">Screenshot Mode Active</p>
            <p className="text-xs text-blue-700">All pricing text hidden</p>
          </div>
          <Button
            onClick={disableScreenshotMode}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScreenshotModeToggle;
