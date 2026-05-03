import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Users, Award, Download } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

const ShareImpactPage: React.FC = () => {
  const [stats, setStats] = useState({ businesses: 0, achievements: 0, points: 0 });
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const link = document.createElement('a');
      link.download = `my-impact-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Subtle ambient accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, hsl(var(--mansagold) / 0.06), transparent 70%)',
        }}
      />

      <div className="container mx-auto px-4 max-w-2xl py-20 relative z-10">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Sparkles className="w-12 h-12 animate-spin mx-auto mb-4 text-mansagold" />
              <p className="text-slate-400">Loading your impact...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-3">
              <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-white animate-fade-in">
                Share Your <span className="text-mansagold">Impact</span>
              </h1>
              <p className="text-slate-400 text-lg">
                Show the community your progress
              </p>
            </div>

            {/* Stats Card — kept slightly accented since it's the downloadable artifact */}
            <Card ref={cardRef} className="p-8 md:p-10 space-y-8 bg-slate-950 border border-mansagold/20 shadow-2xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-center text-white">
                My <span className="text-mansagold">Impact</span>
              </h2>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-mansablue/15 ring-1 ring-mansablue/40 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-300" />
                  </div>
                  <div className="text-4xl font-bold text-white">{stats.businesses}</div>
                  <div className="text-sm text-slate-400">Businesses</div>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-mansagold/10 ring-1 ring-mansagold/40 rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-mansagold" />
                  </div>
                  <div className="text-4xl font-bold text-white">{stats.achievements}</div>
                  <div className="text-sm text-slate-400">Achievements</div>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-mansagold/10 ring-1 ring-mansagold/40 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-mansagold" />
                  </div>
                  <div className="text-4xl font-bold text-white">{stats.points}</div>
                  <div className="text-sm text-slate-400">Points</div>
                </div>
              </div>

              <div className="text-center text-slate-300 text-lg pt-4 border-t border-white/10">
                Building Community Wealth Together
              </div>
            </Card>

            {/* Download Button */}
            <div className="text-center">
              <Button 
                size="lg"
                onClick={handleDownload}
                disabled={downloading}
                className="bg-mansagold text-black hover:bg-mansagold/90 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5 mr-2" />
                {downloading ? 'Downloading...' : 'Download Image'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareImpactPage;
