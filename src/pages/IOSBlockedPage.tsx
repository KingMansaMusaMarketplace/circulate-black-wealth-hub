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
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-mansablue/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-[32rem] h-[32rem] bg-mansagold/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
        </div>

        <Card className="max-w-md w-full relative z-10 border border-white/10 bg-slate-800/60 backdrop-blur-xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="h-2 bg-gradient-to-r from-mansablue via-blue-500 to-mansagold"></div>
          <CardHeader className="text-center bg-gradient-to-br from-slate-800/80 to-blue-900/30">
            <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-mansablue via-blue-500 to-mansagold flex items-center justify-center shadow-xl shadow-mansagold/30 animate-pulse">
              <AlertTriangle className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-mansagold via-amber-400 to-orange-400 bg-clip-text text-transparent">Feature Not Available on iOS</CardTitle>
            <CardDescription className="text-base text-slate-300 font-medium mt-3">
              Business registration and subscription features are not available in the iOS app per Apple App Store guidelines (3.1.1).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30 backdrop-blur-sm">
                <p className="text-center text-white font-medium">
                  <strong className="text-green-300 text-lg">✓ Businesses with active subscriptions</strong>
                  <br />
                  <span className="text-sm mt-2 block text-slate-300">can still use all app features including analytics, bookings, and customer management.</span>
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-mansablue/20 to-blue-500/20 rounded-xl border border-mansablue/30 backdrop-blur-sm">
                <p className="text-center text-white">
                  <strong className="text-mansagold text-base block mb-2">🌐 Visit Our Website</strong>
                  <span className="text-sm text-slate-300">To register a new business or manage subscriptions, please visit:</span>
                  <br />
                  <a 
                    href="https://mansamusamarketplace.com" 
                    className="inline-block mt-2 text-lg font-bold bg-gradient-to-r from-mansagold to-amber-400 bg-clip-text text-transparent hover:from-amber-400 hover:to-orange-400 transition-all duration-300"
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
              className="w-full bg-gradient-to-r from-mansablue via-blue-500 to-mansagold hover:from-blue-600 hover:via-blue-600 hover:to-amber-500 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
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
