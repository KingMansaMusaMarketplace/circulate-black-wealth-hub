import { B2BMarketplace } from '@/components/b2b/B2BMarketplace';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
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

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="font-semibold">B2B Marketplace</h1>
            </div>
            {user && profile && (
              <Link to="/business/b2b-dashboard">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Manage Listings
                </Button>
              </Link>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="container py-6 max-w-6xl">
          {/* Hero Banner */}
          <div className="mb-8 relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 p-6 md:p-8 text-white">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                B2B Supplier Marketplace
              </h2>
              <p className="text-white/90 max-w-xl">
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
