import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Building2, CalendarCheck, Star, Coins, QrCode } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  userId: string;
  userLabel: string;
}

/**
 * Read-only snapshot of a user's account, rendered while an admin is in
 * "View As" mode. Data is read with the admin's own credentials (RLS still
 * applies) — this is a support/debug view, not a real session swap.
 */
const ViewAsUserPanel: React.FC<Props> = ({ userId, userLabel }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['view-as-user', userId],
    queryFn: async () => {
      const [profile, businesses, bookings, loyalty, reviews, scans] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('businesses').select('id, name, listing_status, city, state').eq('owner_id', userId).limit(20),
        supabase.from('bookings').select('id, booking_date, amount, status').eq('customer_id', userId).order('booking_date', { ascending: false }).limit(10),
        supabase.from('loyalty_points').select('points, business_id').eq('customer_id', userId).limit(50),
        supabase.from('reviews').select('id, rating, review_text, created_at').eq('customer_id', userId).order('created_at', { ascending: false }).limit(5),
        supabase.from('qr_scans').select('id, scan_date, points_awarded').eq('customer_id', userId).order('scan_date', { ascending: false }).limit(5),
      ]);

      return {
        profile: profile.data as any,
        businesses: businesses.data || [],
        bookings: bookings.data || [],
        totalPoints: (loyalty.data || []).reduce((sum: number, r: any) => sum + (r.points || 0), 0),
        reviews: reviews.data || [],
        scans: scans.data || [],
      };
    },
  });

  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-8 flex items-center justify-center text-white/60">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading {userLabel}'s account...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-500/10 border-red-500/30">
        <CardContent className="p-4 text-red-300 text-sm">
          Could not load this user's account: {(error as any).message}
        </CardContent>
      </Card>
    );
  }

  const p = data?.profile;

  return (
    <div className="space-y-4">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-base">Account Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat icon={<Building2 className="h-4 w-4" />} label="Businesses" value={String(data?.businesses.length ?? 0)} />
          <Stat icon={<CalendarCheck className="h-4 w-4" />} label="Bookings" value={String(data?.bookings.length ?? 0)} />
          <Stat icon={<Coins className="h-4 w-4" />} label="Loyalty Points" value={String(data?.totalPoints ?? 0)} />
          <Stat icon={<Star className="h-4 w-4" />} label="Reviews" value={String(data?.reviews.length ?? 0)} />
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3 text-sm">
          <Field label="Name" value={p?.full_name} />
          <Field label="Email" value={p?.email} />
          <Field label="Account type" value={p?.user_type} />
          <Field label="Subscription" value={`${p?.subscription_tier || 'none'} (${p?.subscription_status || 'inactive'})`} />
          <Field label="Phone" value={p?.phone} />
          <Field label="Location" value={[p?.city, p?.state].filter(Boolean).join(', ')} />
          <Field label="Member since" value={p?.created_at ? format(new Date(p.created_at), 'MMM d, yyyy') : undefined} />
          <Field label="Profile complete" value={p?.profile_completion_percentage != null ? `${p.profile_completion_percentage}%` : undefined} />
        </CardContent>
      </Card>

      {data && data.businesses.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-base">Their Businesses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.businesses.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10">
                <div>
                  <p className="text-white text-sm">{b.name}</p>
                  <p className="text-white/50 text-xs">{[b.city, b.state].filter(Boolean).join(', ')}</p>
                </div>
                <Badge className="bg-white/10 text-white/80">{b.listing_status || 'unknown'}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {data && data.bookings.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-base">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.bookings.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10 text-sm">
                <span className="text-white/80">{b.booking_date ? format(new Date(b.booking_date), 'MMM d, yyyy') : '—'}</span>
                <span className="text-white/60">${Number(b.amount || 0).toFixed(2)}</span>
                <Badge className="bg-white/10 text-white/80">{b.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {data && data.scans.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <QrCode className="h-4 w-4 text-mansagold" /> Recent QR Scans
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.scans.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10 text-sm">
                <span className="text-white/80">{s.scan_date ? format(new Date(s.scan_date), 'MMM d, h:mm a') : '—'}</span>
                <span className="text-mansagold">+{s.points_awarded || 0} pts</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const Stat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
    <div className="flex items-center gap-2 text-white/50 text-xs">{icon}{label}</div>
    <p className="text-white text-xl font-semibold mt-1">{value}</p>
  </div>
);

const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <div>
    <p className="text-white/50 text-xs">{label}</p>
    <p className="text-white">{value || '—'}</p>
  </div>
);

export default ViewAsUserPanel;
