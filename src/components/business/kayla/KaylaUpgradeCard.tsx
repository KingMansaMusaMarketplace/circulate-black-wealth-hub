import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Bot, MessageSquare, TrendingUp, Handshake, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { KAYLA_AI_STRIPE } from '@/lib/services/subscription-tiers';

export const KaylaUpgradeCard: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: KAYLA_AI_STRIPE.price_id,
          mode: 'subscription',
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: MessageSquare, text: 'AI Review Responses — drafted & sent automatically' },
    { icon: TrendingUp, text: 'Churn Prediction — catch at-risk customers early' },
    { icon: Handshake, text: 'B2B Matchmaking — find supply chain partners' },
    { icon: Bot, text: 'Content Generation — social posts & promotions on autopilot' },
  ];

  return (
    <Card className="relative overflow-hidden border-yellow-400/30 bg-gradient-to-br from-slate-800/60 via-yellow-900/10 to-slate-800/60">
      {/* Gold shimmer accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400" />

      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-yellow-400/10 border border-yellow-400/20">
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Activate Kayla AI Employee</h3>
                <p className="text-sm text-white/60">Your autonomous AI business operator</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                  <f.icon className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="text-center mb-1">
              <span className="text-3xl font-bold text-white">$100</span>
              <span className="text-white/50 text-sm">/mo</span>
            </div>
            <Button
              onClick={handleUpgrade}
              disabled={loading}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold hover:from-yellow-300 hover:to-amber-400 px-8 py-3 text-base shadow-lg shadow-yellow-400/20"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Activate Kayla
                </>
              )}
            </Button>
            <p className="text-xs text-white/40">Cancel anytime</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
