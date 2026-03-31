import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Bot, MessageSquare, TrendingUp, Handshake, Loader2, FileText, Shield, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { KAYLA_STRIPE_TIERS } from '@/lib/services/subscription-tiers';

interface KaylaTier {
  name: string;
  price: string;
  priceId: string;
  description: string;
  features: { icon: React.ElementType; text: string }[];
  highlight?: boolean;
  onboardingFee?: string;
}

const tiers: KaylaTier[] = [
  {
    name: 'Starter',
    price: '$49/mo',
    priceId: KAYLA_STRIPE_TIERS.kayla_starter.price_id,
    description: 'Records Management only',
    features: [
      { icon: FileText, text: 'Document vault & OCR extraction' },
      { icon: MessageSquare, text: 'Ask Kayla chat assistant' },
      { icon: Bot, text: 'Expiration alerts & reminders' },
    ],
  },
  {
    name: 'Pro',
    price: '$149/mo',
    priceId: KAYLA_STRIPE_TIERS.kayla_pro.price_id,
    description: 'All 23+ Kayla services',
    highlight: true,
    onboardingFee: '$149 one-time setup',
    features: [
      { icon: MessageSquare, text: 'AI Review Responses — drafted & sent automatically' },
      { icon: TrendingUp, text: 'Churn Prediction — catch at-risk customers early' },
      { icon: Handshake, text: 'B2B Matchmaking — find supply chain partners' },
      { icon: Bot, text: 'Content Generation — social posts & promotions on autopilot' },
    ],
  },
  {
    name: 'Enterprise',
    price: '$399/mo',
    priceId: KAYLA_STRIPE_TIERS.kayla_enterprise.price_id,
    description: 'Multi-location & white-label',
    onboardingFee: '$149 one-time setup',
    features: [
      { icon: Building2, text: 'Multi-location support & white-label branding' },
      { icon: Shield, text: 'HIPAA BAA documentation & priority support' },
      { icon: Bot, text: 'API access & all Pro features included' },
    ],
  },
];

export const KaylaUpgradeCard: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (priceId: string) => {
    setLoading(priceId);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId,
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
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <p className="text-sm text-white/60">
          Replaces $1,650–$5,750/month in human labor starting at $149/month — a 10–38x value multiplier
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`relative overflow-hidden ${
              tier.highlight
                ? 'border-yellow-400/30 bg-gradient-to-br from-slate-800/60 via-yellow-900/10 to-slate-800/60 ring-2 ring-yellow-400/40'
                : 'border-white/10 bg-slate-800/40'
            }`}
          >
            {tier.highlight && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400" />
            )}
            <CardContent className="p-5">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-yellow-400/10 border border-yellow-400/20">
                    <Sparkles className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Kayla {tier.name}</h3>
                    <p className="text-xs text-white/50">{tier.description}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {tier.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <f.icon className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
                      <span>{f.text}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-2">
                  <span className="text-2xl font-bold text-white">{tier.price}</span>
                  {tier.onboardingFee && (
                    <p className="text-xs text-white/40 mt-1">+ {tier.onboardingFee}</p>
                  )}
                </div>

                <Button
                  onClick={() => handleUpgrade(tier.priceId)}
                  disabled={loading !== null}
                  className={`w-full ${
                    tier.highlight
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold hover:from-yellow-300 hover:to-amber-400 shadow-lg shadow-yellow-400/20'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {loading === tier.priceId ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get {tier.name}
                    </>
                  )}
                </Button>
                <p className="text-xs text-white/40 text-center">Cancel anytime</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
