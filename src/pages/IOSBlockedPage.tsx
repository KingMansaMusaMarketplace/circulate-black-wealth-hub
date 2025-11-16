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
      
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-[32rem] h-[32rem] bg-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-red-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <Card className="max-w-md w-full relative z-10 border-0 bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden animate-fade-in">
          <div className="h-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500"></div>
          <CardHeader className="text-center bg-gradient-to-br from-yellow-50/50 to-orange-50/50">
            <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 flex items-center justify-center shadow-xl shadow-orange-500/50 animate-pulse">
              <AlertTriangle className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">Feature Not Available on iOS</CardTitle>
            <CardDescription className="text-base text-gray-700 font-medium mt-3">
              Business registration and subscription features are not available in the iOS app per Apple App Store guidelines (3.1.1).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                <p className="text-center text-gray-800 font-medium">
                  <strong className="text-green-700 text-lg">✓ Businesses with active subscriptions</strong>
                  <br />
                  <span className="text-sm mt-2 block">can still use all app features including analytics, bookings, and customer management.</span>
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                <p className="text-center text-gray-800">
                  <strong className="text-blue-700 text-base block mb-2">🌐 Visit Our Website</strong>
                  <span className="text-sm">To register a new business or manage subscriptions, please visit:</span>
                  <br />
                  <a 
                    href="https://mansamusamarketplace.com" 
                    className="inline-block mt-2 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    mansamusamarketplace.com →
                  </a>
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              variant="default"
            >
              <Home className="h-5 w-5 mr-2" />
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default IOSBlockedPage;
