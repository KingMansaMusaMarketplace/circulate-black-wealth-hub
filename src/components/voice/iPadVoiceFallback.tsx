import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Globe, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface iPadVoiceFallbackProps {
  onDismiss: () => void;
}

export const IPadVoiceFallback: React.FC<iPadVoiceFallbackProps> = ({ onDismiss }) => {
  const handleVisitWebsite = () => {
    window.open('https://mansamusamarketplace.com', '_blank');
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:Thomas@1325.AI?subject=Voice%20Assistant%20Question';
  };

  return (
    <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-card border-border shadow-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/20 rounded-full">
              <Mic className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Voice Assistant</h3>
              <p className="text-sm text-muted-foreground">Kayla - Your AI Guide</p>
            </div>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">
            Voice features are optimized for iPhone. For the best iPad experience, 
            you can access our full-featured website or contact us directly.
          </p>

          <div className="space-y-3 pt-2">
            <Button
              onClick={handleVisitWebsite}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              style={{ touchAction: 'manipulation' }}
            >
              <Globe className="mr-2 h-4 w-4" />
              Visit Full Website
            </Button>

            <Button
              onClick={handleContactSupport}
              variant="outline"
              className="w-full"
              style={{ touchAction: 'manipulation' }}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>

            <Button
              onClick={onDismiss}
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
              style={{ touchAction: 'manipulation' }}
            >
              Continue Without Voice
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            We're working to bring voice features to iPad in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IPadVoiceFallback;
