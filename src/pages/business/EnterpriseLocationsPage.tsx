import { useBusinessProfile } from '@/hooks/use-business-profile';
import { LocationsManager } from '@/components/business/multi-location/LocationsManager';
import { Card, CardContent } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin } from 'lucide-react';

export default function EnterpriseLocationsPage() {
  const { profile, loading } = useBusinessProfile();

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712] text-white">
      <Helmet>
        <title>Multi-Location Management — Kayla AI Enterprise</title>
        <meta name="description" content="Manage all your business locations from one dashboard with Kayla AI Enterprise." />
      </Helmet>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <Link to="/business/dashboard">
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#003366] to-[#FFB300] flex items-center justify-center">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Multi-Location Management</h1>
            <p className="text-sm text-slate-400">Enterprise feature — manage all locations in one place</p>
          </div>
        </div>

        {loading ? (
          <Card className="bg-white/5 border-white/10"><CardContent className="p-6 text-slate-300">Loading…</CardContent></Card>
        ) : !profile ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-slate-300">
              You need a business profile before adding locations.
              <Link to="/business/register" className="ml-2 text-amber-300 underline">Create one</Link>
            </CardContent>
          </Card>
        ) : (
          <LocationsManager businessId={profile.id} />
        )}
      </div>
    </div>
  );
}
