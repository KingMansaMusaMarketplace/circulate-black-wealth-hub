import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Flame, Sparkles, Gift, MapPin, Clock, ArrowRight, Trophy,
  Zap, QrCode, History, Star
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ReturningCustomerHeroProps {
  totalPoints: number;
  availablePoints: number;
  tierLevel: string;
}

/**
 * ReturningCustomerHero
 * Personalized welcome-back panel shown above the rewards catalog
 * for users who already have lifetime points (totalPoints > 0).
 *
 * Sections:
 *  - Greeting + scan streak
 *  - Next-reward unlock progress
 *  - 3 quickly-affordable rewards
 *  - Recent activity feed (last 5 scans/redemptions)
 */
export const ReturningCustomerHero: React.FC<ReturningCustomerHeroProps> = ({
  totalPoints,
  availablePoints,
  tierLevel,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName = useMemo(() => {
    const m: any = user?.user_metadata || {};
    const c =
      m.display_name || m.full_name || m.first_name || m.name || user?.email?.split('@')[0] || '';
    return (c || '').toString().split(' ')[0] || 'friend';
  }, [user]);

  const { data } = useQuery({
    queryKey: ['returning-customer-hero', user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return null;

      const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
      const [scans, redemptions, rewards] = await Promise.all([
        supabase
          .from('qr_scans')
          .select('id, points_awarded, scanned_at, business_id, businesses ( business_name, city )')
          .eq('customer_id', user.id)
          .gte('scanned_at', since)
          .order('scanned_at', { ascending: false })
          .limit(30),
        supabase
          .from('redeemed_rewards')
          .select('id, redemption_date, rewards ( title, points_cost )')
          .eq('customer_id', user.id)
          .order('redemption_date', { ascending: false })
          .limit(10),
        supabase
          .from('rewards')
          .select('id, title, points_cost, business_id, businesses ( business_name )')
          .eq('is_active', true)
          .lte('points_cost', Math.max(availablePoints, 100))
          .order('points_cost', { ascending: false })
          .limit(3),
      ]);

      return {
        scans: scans.data ?? [],
        redemptions: redemptions.data ?? [],
        rewards: rewards.data ?? [],
      };
    },
  });

  // Compute consecutive-day scan streak
  const streak = useMemo(() => {
    const scans = data?.scans ?? [];
    if (!scans.length) return 0;
    const days = new Set(
      scans.map(s => new Date(s.scanned_at as string).toISOString().slice(0, 10))
    );
    let count = 0;
    let cursor = new Date();
    while (days.has(cursor.toISOString().slice(0, 10))) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    }
    // If today not scanned but yesterday is, still show streak based on yesterday
    if (count === 0) {
      cursor = new Date();
      cursor.setDate(cursor.getDate() - 1);
      while (days.has(cursor.toISOString().slice(0, 10))) {
        count++;
        cursor.setDate(cursor.getDate() - 1);
      }
    }
    return count;
  }, [data?.scans]);

  const lastScan = data?.scans?.[0];
  const lastVisitText = lastScan
    ? formatDistanceToNow(new Date(lastScan.scanned_at as string), { addSuffix: true })
    : null;

  // Next reward unlock = the cheapest reward the user can't quite afford
  const nextUnlock = useMemo(() => {
    return (data?.rewards ?? [])
      .filter(r => r.points_cost > availablePoints)
      .sort((a, b) => a.points_cost - b.points_cost)[0];
  }, [data?.rewards, availablePoints]);

  const nextUnlockProgress = nextUnlock
    ? Math.min(100, Math.round((availablePoints / nextUnlock.points_cost) * 100))
    : 100;

  // Combined recent activity feed
  const activity = useMemo(() => {
    const a: { type: 'earn' | 'redeem'; date: string; label: string; points: number }[] = [];
    (data?.scans ?? []).slice(0, 5).forEach(s => {
      a.push({
        type: 'earn',
        date: s.scanned_at as string,
        label: (s.businesses as any)?.business_name || 'A community business',
        points: s.points_awarded ?? 0,
      });
    });
    (data?.redemptions ?? []).slice(0, 3).forEach(r => {
      a.push({
        type: 'redeem',
        date: r.redemption_date as string,
        label: (r.rewards as any)?.title || 'Reward',
        points: (r.rewards as any)?.points_cost ?? 0,
      });
    });
    return a.sort((x, y) => +new Date(y.date) - +new Date(x.date)).slice(0, 5);
  }, [data]);

  const affordable = (data?.rewards ?? []).filter(r => r.points_cost <= availablePoints).slice(0, 3);

  return (
    <Card className="mb-8 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-mansablue/40 border-white/10">
      <CardContent className="p-6 md:p-8 space-y-6">
        {/* Greeting row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-mansagold text-black font-semibold">
                <Sparkles className="h-3 w-3 mr-1" />
                Welcome back
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white/80">
                <Trophy className="h-3 w-3 mr-1" />
                {tierLevel}
              </Badge>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Hey {firstName} — good to see you again
            </h2>
            {lastVisitText && (
              <p className="text-sm text-white/60 mt-1">Last scan {lastVisitText}</p>
            )}
          </div>
          <div className="flex gap-3">
            <div className="text-right">
              <div className="text-3xl font-bold text-mansagold">{availablePoints.toLocaleString()}</div>
              <div className="text-xs uppercase tracking-wider text-white/60">Available pts</div>
            </div>
          </div>
        </div>

        {/* Streak + Next unlock row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Streak */}
          <div className="rounded-xl p-4 bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Flame className={`h-6 w-6 ${streak > 0 ? 'text-orange-400' : 'text-white/40'}`} />
              </div>
              <div className="flex-1">
                <div className="text-sm text-white/70">Scan streak</div>
                <div className="text-xl font-bold text-white">
                  {streak > 0 ? `${streak} day${streak > 1 ? 's' : ''}` : 'Start a streak today'}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/qr-scanner')}
                className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
              >
                <QrCode className="h-3 w-3 mr-1" />
                Scan
              </Button>
            </div>
          </div>

          {/* Next unlock */}
          <div className="rounded-xl p-4 bg-gradient-to-br from-mansagold/10 to-yellow-500/5 border border-mansagold/30">
            {nextUnlock ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-white/70 flex items-center gap-1">
                    <Zap className="h-3 w-3 text-mansagold" />
                    Next unlock
                  </div>
                  <div className="text-xs text-mansagold font-semibold">
                    {nextUnlock.points_cost - availablePoints} pts to go
                  </div>
                </div>
                <div className="text-base font-semibold text-white truncate mb-2">
                  {nextUnlock.title}
                </div>
                <Progress value={nextUnlockProgress} className="h-2 bg-white/10" />
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-mansagold/20 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-mansagold" />
                </div>
                <div>
                  <div className="text-sm text-white/70">All rewards unlocked</div>
                  <div className="text-base font-semibold text-white">Pick something below</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick redeem chips */}
        {affordable.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                Ready to redeem
              </h3>
              <button
                onClick={() => {
                  const el = document.querySelector('[role="tablist"]');
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="text-xs text-mansagold hover:underline"
              >
                See all <ArrowRight className="inline h-3 w-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {affordable.map(r => (
                <button
                  key={r.id}
                  onClick={() => {
                    const el = document.querySelector('[role="tablist"]');
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="text-left rounded-lg p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-mansagold/40 transition group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Star className="h-4 w-4 text-mansagold" />
                    <Badge className="bg-mansagold/20 text-mansagold border-0 text-xs">
                      {r.points_cost} pts
                    </Badge>
                  </div>
                  <div className="text-sm font-semibold text-white line-clamp-1 group-hover:text-mansagold">
                    {r.title}
                  </div>
                  <div className="text-xs text-white/60 line-clamp-1 mt-1">
                    {(r.businesses as any)?.business_name || 'Global reward'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent activity */}
        {activity.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3 flex items-center gap-2">
              <History className="h-3 w-3" />
              Recent activity
            </h3>
            <div className="space-y-2">
              {activity.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        a.type === 'earn' ? 'bg-green-500/15 text-green-400' : 'bg-mansagold/15 text-mansagold'
                      }`}
                    >
                      {a.type === 'earn' ? <QrCode className="h-4 w-4" /> : <Gift className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-white truncate">
                        {a.type === 'earn' ? 'Earned at ' : 'Redeemed: '}
                        <span className="font-semibold">{a.label}</span>
                      </div>
                      <div className="text-xs text-white/50 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(a.date), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-sm font-bold flex-shrink-0 ${
                      a.type === 'earn' ? 'text-green-400' : 'text-mansagold'
                    }`}
                  >
                    {a.type === 'earn' ? '+' : '−'}
                    {a.points}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReturningCustomerHero;
