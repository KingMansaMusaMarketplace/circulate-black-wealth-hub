import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Users, Award, Download } from 'lucide-react';
import { toast } from 'sonner';

const ShareImpactPage: React.FC = () => {
  const [stats, setStats] = useState({ businesses: 0, achievements: 0, points: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [interactions, achievements] = await Promise.all([
        supabase.from('business_interactions').select('business_id').eq('user_id', user.id),
        supabase.from('user_achievements').select('points_awarded').eq('user_id', user.id)
      ]);

      setStats({
        businesses: new Set(interactions.data?.map(i => i.business_id)).size,
        achievements: achievements.data?.length || 0,
        points: achievements.data?.reduce((sum, a) => sum + (a.points_awarded || 0), 0) || 0
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Share Your Impact</h1>
          <p className="text-muted-foreground">Show the community your progress</p>
        </div>

        <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Sparkles className="w-10 h-10" />
              <h2 className="text-3xl font-bold">My Impact</h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 p-6 rounded-xl">
                <Users className="w-8 h-8 mb-2" />
                <div className="text-4xl font-bold">{stats.businesses}</div>
                <div className="text-sm opacity-80">Businesses</div>
              </div>

              <div className="bg-white/10 p-6 rounded-xl">
                <Award className="w-8 h-8 mb-2" />
                <div className="text-4xl font-bold">{stats.achievements}</div>
                <div className="text-sm opacity-80">Achievements</div>
              </div>

              <div className="bg-white/10 p-6 rounded-xl">
                <Sparkles className="w-8 h-8 mb-2" />
                <div className="text-4xl font-bold">{stats.points}</div>
                <div className="text-sm opacity-80">Points</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary to-primary/80 p-4 rounded-xl text-center">
              <p className="font-semibold">Building Community Wealth Together 💪</p>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button onClick={() => toast.info('Download feature coming soon!')} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download Image
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareImpactPage;
