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

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Modern dark gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/4 -right-32 w-[32rem] h-[32rem] bg-gradient-to-tl from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 left-1/4 w-[28rem] h-[28rem] bg-gradient-to-tr from-blue-700/25 to-mansablue/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-bl from-mansagold/20 to-amber-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      <div className="container mx-auto px-4 max-w-2xl py-20 relative z-10">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Sparkles className="w-12 h-12 animate-spin mx-auto mb-4 text-mansagold" />
              <p className="text-white/80">Loading your impact...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-3">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-mansagold via-amber-400 to-mansagold bg-clip-text text-transparent animate-fade-in">
                Share Your Impact
              </h1>
              <p className="text-white/70 text-lg">
                Show the community your progress
              </p>
            </div>

            {/* Stats Card with Glass-morphism */}
            <Card className="p-8 md:p-10 space-y-8 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-300">
              <h2 className="text-3xl font-semibold text-center bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                My Impact
              </h2>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-mansablue/30 to-blue-600/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
                    <Users className="w-8 h-8 text-blue-300" />
                  </div>
                  <div className="text-4xl font-bold text-white">{stats.businesses}</div>
                  <div className="text-sm text-white/60">Businesses</div>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500/30 to-purple-600/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
                    <Award className="w-8 h-8 text-purple-300" />
                  </div>
                  <div className="text-4xl font-bold text-white">{stats.achievements}</div>
                  <div className="text-sm text-white/60">Achievements</div>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-mansagold/30 to-amber-500/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
                    <Sparkles className="w-8 h-8 text-amber-300" />
                  </div>
                  <div className="text-4xl font-bold text-white">{stats.points}</div>
                  <div className="text-sm text-white/60">Points</div>
                </div>
              </div>

              <div className="text-center text-white/70 text-lg pt-4 border-t border-white/10">
                Building Community Wealth Together 💪
              </div>
            </Card>

            {/* Download Button */}
            <div className="text-center">
              <Button 
                size="lg"
                onClick={() => toast.info('Download feature coming soon!')}
                className="bg-gradient-to-r from-mansagold via-amber-500 to-mansagold hover:from-mansagold/90 hover:via-amber-500/90 hover:to-mansagold/90 text-slate-900 font-semibold shadow-lg shadow-mansagold/30 hover:shadow-xl hover:shadow-mansagold/40 transition-all duration-300 hover:scale-105"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Image
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareImpactPage;
