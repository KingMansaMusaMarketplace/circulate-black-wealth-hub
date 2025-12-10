import { useAuth } from '@/contexts/AuthContext';
import { CoalitionDashboard } from '@/components/coalition/CoalitionDashboard';
import { CoalitionJoinCTA } from '@/components/coalition/CoalitionJoinCTA';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function CoalitionPage() {
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>Coalition Loyalty Program | MansaMusa</title>
        <meta 
          name="description" 
          content="Earn and redeem points at any participating Black-owned business. Join the coalition and support our community together." 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container flex h-14 items-center">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex-1 text-center">
              <h1 className="font-semibold">Coalition Loyalty</h1>
            </div>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Main Content */}
        <main className="container py-6 max-w-5xl">
          {/* Hero Banner */}
          <div className="mb-8 relative overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-6 md:p-8 text-primary-foreground">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Coalition Loyalty Program
              </h2>
              <p className="text-primary-foreground/90 max-w-xl">
                Earn points at any Black-owned business in our coalition. 
                Redeem rewards anywhere. Together, we keep money circulating in our community.
              </p>
            </div>
          </div>

          {user ? (
            <CoalitionDashboard />
          ) : (
            <CoalitionJoinCTA />
          )}
        </main>
      </div>
    </>
  );
}
