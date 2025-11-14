import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home } from 'lucide-react';

const IOSBlockedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Feature Not Available on iOS | Mansa Musa Marketplace</title>
        <meta name="description" content="This feature is not available on the iOS app." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="text-xl">Feature Not Available on iOS</CardTitle>
            <CardDescription>
              Business registration and subscription features are not available in the iOS app per Apple App Store guidelines (3.1.1).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="text-center">
                <strong>Businesses with active subscriptions</strong> can still use all app features including analytics, bookings, and customer management.
              </p>
              <p className="text-center">
                To register a new business or manage subscriptions, please visit our website at{' '}
                <a 
                  href="https://mansamusamarketplace.com" 
                  className="text-primary hover:underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  mansamusamarketplace.com
                </a>
              </p>
            </div>
            
            <Button 
              onClick={() => navigate('/')}
              className="w-full"
              variant="default"
            >
              <Home className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default IOSBlockedPage;
