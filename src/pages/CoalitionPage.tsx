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

      <div className="min-h-screen bg-[hsl(222,47%,11%)] text-white relative overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[hsl(45,93%,47%)] rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-[hsl(222,84%,45%)] rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-[pulse_4s_ease-in-out_infinite]" />
          <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-[hsl(45,93%,58%)] rounded-full mix-blend-screen filter blur-[100px] opacity-25 animate-[pulse_5s_ease-in-out_infinite]" />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[hsl(222,84%,60%)] rounded-full mix-blend-screen filter blur-[80px] opacity-20 animate-[pulse_6s_ease-in-out_infinite]" />
        </div>

        {/* Header */}
        <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
          <div className="container flex h-14 items-center">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex-1 text-center">
              <h1 className="font-semibold text-white">Coalition Loyalty</h1>
            </div>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Main Content */}
        <main className="container py-6 max-w-5xl relative z-10">
          {/* Hero Banner */}
          <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[hsl(45,93%,47%)] via-[hsl(45,93%,52%)] to-[hsl(38,93%,50%)] p-6 md:p-8">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[hsl(222,84%,45%)]/30 rounded-full blur-2xl" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-[hsl(222,47%,11%)]">
                Coalition Loyalty Program
              </h2>
              <p className="text-[hsl(222,47%,11%)]/80 max-w-xl">
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
