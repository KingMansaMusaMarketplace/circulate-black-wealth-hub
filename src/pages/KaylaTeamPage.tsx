import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Bot, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { KaylaAITeam } from '@/components/business/kayla/KaylaAITeam';
import { KaylaWeeklyLearnings } from '@/components/business/kayla/KaylaWeeklyLearnings';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const KaylaTeamPage: React.FC = () => {
  const { user } = useAuth();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();
      if (active) {
        setBusinessId(data?.id ?? null);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [user]);

  return (
    <>
      <Helmet>
        <title>Your AI Team — Kayla & 33 Agents | 1325.ai</title>
        <meta
          name="description"
          content="Meet Kayla and her coordinated team of 33 specialized AI agents working 24/7 for your business — covering ~4 roles and saving $12,100+/mo."
        />
        <link rel="canonical" href="https://1325.ai/kayla/team" />
      </Helmet>

      <div className="min-h-screen bg-black text-white px-4 py-8 md:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" size="sm" className="text-white/60 hover:text-white">
              <Link to="/business-dashboard">
                <ArrowLeft className="h-4 w-4 mr-1" /> Dashboard
              </Link>
            </Button>
          </div>

          <header className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Bot className="h-8 w-8 text-mansagold" />
              Your AI Team
            </h1>
            <p className="text-white/60 max-w-2xl">
              Kayla orchestrates 33 specialized AI agents across Finance, Marketing,
              Operations, Growth, and Community. They share one memory, learn from your
              feedback, and coordinate so you don't have to.
            </p>
          </header>

          {loading ? (
            <Card className="bg-slate-900/60 border-white/10"><CardContent className="p-8 text-center text-white/60">Loading your team…</CardContent></Card>
          ) : !businessId ? (
            <Card className="bg-slate-900/60 border-white/10">
              <CardContent className="p-8 text-center">
                <p className="text-white/60 mb-4">Set up your business profile to activate your AI team.</p>
                <Button asChild className="bg-mansagold text-black hover:bg-mansagold/90">
                  <Link to="/business-signup">Get started</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <KaylaWeeklyLearnings businessId={businessId} limit={6} />
              <KaylaAITeam businessId={businessId} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default KaylaTeamPage;
