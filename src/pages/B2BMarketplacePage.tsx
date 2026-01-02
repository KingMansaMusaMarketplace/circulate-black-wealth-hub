import { B2BMarketplace } from '@/components/b2b/B2BMarketplace';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { useBusinessProfile } from '@/hooks/use-business-profile';

export default function B2BMarketplacePage() {
  const { user } = useAuth();
  const { profile } = useBusinessProfile();

  return (
    <>
      <Helmet>
        <title>B2B Marketplace | MansaMusa</title>
        <meta 
          name="description" 
          content="Connect Black-owned businesses with each other. Find suppliers, post needs, and keep money circulating in our community." 
        />
      </Helmet>

      <div className="dark min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-40 right-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Header */}
        <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-900/40 sticky top-0 z-50">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-slate-200 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="font-semibold text-white">B2B Marketplace</h1>
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <Link to="/leads-dashboard">
                  <Button variant="outline" size="sm" className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 hover:text-blue-200">
                    <Users className="h-4 w-4 mr-2" />
                    My Leads
                  </Button>
                </Link>
              )}
              {user && profile && (
                <Link to="/business/b2b-dashboard">
                  <Button size="sm" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold border-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Manage Listings
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container py-6 max-w-6xl relative z-10">
          {/* Hero Banner */}
          <div className="mb-8 relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-blue-500/20 border border-white/10 backdrop-blur-sm p-6 md:p-8">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-blue-500/5" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                B2B Supplier Marketplace
              </h2>
              <p className="text-slate-300 max-w-xl">
                Connect with fellow Black-owned businesses. When we buy from each other, 
                money circulates 6x longer in our community. Find suppliers, post needs, 
                and build lasting business relationships.
              </p>
            </div>
          </div>

          <B2BMarketplace />
        </main>
      </div>
    </>
  );
}
