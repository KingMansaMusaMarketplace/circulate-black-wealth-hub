import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Construction, ArrowLeft, Bell } from 'lucide-react';

const ComingSoonPage: React.FC = () => {
  const location = useLocation();
  
  // Determine feature name based on route
  const getFeatureName = () => {
    const path = location.pathname;
    if (path.includes('developer')) return 'Developer Portal';
    if (path.includes('b2b')) return 'B2B Marketplace';
    if (path.includes('leads')) return 'Leads Dashboard';
    return 'This Feature';
  };

  const featureName = getFeatureName();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      <Helmet>
        <title>{featureName} - Coming Soon | Mansa Musa Marketplace</title>
        <meta name="description" content={`${featureName} is coming soon to the Mansa Musa Marketplace platform.`} />
      </Helmet>

      <Card className="relative z-10 max-w-lg mx-4 bg-slate-900/60 backdrop-blur-xl border-yellow-400/20">
        <CardContent className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-yellow-500/20 rounded-full">
              <Construction className="h-12 w-12 text-yellow-400" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            {featureName}
          </h1>
          
          <p className="text-xl text-yellow-400 font-semibold mb-4">
            Coming Soon
          </p>
          
          <p className="text-blue-200 mb-8">
            We're focusing on proving wealth circulation first. This feature will be available once we've demonstrated the core value of keeping dollars circulating in Black communities.
          </p>

          <div className="space-y-3">
            <Link to="/" className="block">
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-bold">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            <Link to="/directory" className="block">
              <Button variant="outline" className="w-full border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10">
                Explore Business Directory
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-sm text-blue-300 flex items-center justify-center gap-2">
              <Bell className="h-4 w-4" />
              Phase 2 feature — activates after circulation proof
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoonPage;
