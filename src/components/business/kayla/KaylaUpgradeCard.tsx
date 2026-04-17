import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Bot, MessageSquare, TrendingUp, Handshake, Loader2, FileText, Shield, Building2, Star, QrCode, Mail, BarChart3, Palette, Users, Headphones, Zap, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { KAYLA_STRIPE_TIERS } from '@/lib/services/subscription-tiers';

interface KaylaTier {
  name: string;
  price: string;
  priceSubline?: string;
  priceId: string;
  description: string;
  features: { icon: React.ElementType; text: string }[];
  highlight?: boolean;
  trialText: string;
  buttonText: string;
  footnote?: string;
}

const tiers: KaylaTier[] = [
  {
    name: 'Essentials',
    price: '$19/mo',
    priceSubline: '$190/year — save $38',
    priceId: KAYLA_STRIPE_TIERS.kayla_essentials.price_id,
    description: 'Perfect for businesses just getting started with AI',
    trialText: '30-day free trial',
    buttonText: 'Start Free Trial',
    features: [
      { icon: Star, text: 'Enhanced directory listing' },
      { icon: MessageSquare, text: 'Kayla AI chat assistant' },
      { icon: Handshake, text: 'Community marketplace access' },
      { icon: QrCode, text: 'Up to 5 QR codes' },
      { icon: Mail, text: 'Email support' },
    ],
  },
  {
    name: 'Starter',
    price: '$79/mo',
    priceSubline: '$790/year — save $158',
    priceId: KAYLA_STRIPE_TIERS.kayla_starter.price_id,
    description: 'AI-powered records management & business tools',
    trialText: '30-day free trial',
    buttonText: 'Get Started',
    features: [
      { icon: Sparkles, text: 'Everything in Essentials' },
      { icon: Bot, text: 'AI-powered records management' },
      { icon: FileText, text: 'Document vault & OCR extraction' },
      { icon: Shield, text: 'Expiration alerts & reminders' },
      { icon: QrCode, text: 'Up to 25 QR codes' },
      { icon: BarChart3, text: 'Monthly impact reports' },
    ],
  },
  {
    name: 'Pro',
    price: '$299/mo',
    priceSubline: '$2,990/year — save $598',
    priceId: KAYLA_STRIPE_TIERS.kayla_pro.price_id,
    description: 'Full suite of 28 AI-powered services — replaces ~$560/mo of single-purpose tools',
    highlight: true,
    trialText: '14-day free trial',
    buttonText: 'Start Pro Trial',
    footnote: "Founders' Lock: first 100 businesses keep $149/mo for life.",
    features: [
      { icon: Sparkles, text: 'Everything in Starter' },
      { icon: Bot, text: 'Full Kayla AI concierge suite' },
      { icon: Handshake, text: 'B2B matchmaking & connections' },
      { icon: TrendingUp, text: 'Advanced analytics dashboard' },
      { icon: Headphones, text: 'Priority support' },
      { icon: Zap, text: 'Marketing automation tools' },
      { icon: Palette, text: 'Custom branding options' },
    ],
  },
  {
    name: 'Enterprise',
    price: 'From $899/mo',
    priceSubline: '+ $50 per user/month · Custom annual pricing available',
    priceId: KAYLA_STRIPE_TIERS.kayla_enterprise.price_id,
    description: 'Multi-location support, white-labeling, and advanced integrations',
    trialText: '14-day free trial',
    buttonText: 'Contact Sales',
    footnote: 'Example: 30 users ≈ $2,399/month (about $28,788/year).',
    features: [
      { icon: Sparkles, text: 'Everything in Pro' },
      { icon: Building2, text: 'Multi-location management' },
      { icon: Palette, text: 'White-label solutions' },
      { icon: Users, text: 'Dedicated account manager' },
      { icon: Zap, text: 'Custom API integrations' },
      { icon: Award, text: 'Enterprise SLA guarantee' },
      { icon: Handshake, text: 'Team collaboration tools' },
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
          Replaces $1,650–$5,750/month in human labor starting at $19/month
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400" />
                <div className="absolute top-2 right-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-400/30">
                    Most Popular
                  </span>
                </div>
              </>
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

                {tier.footnote && (
                  <p className="text-[11px] text-white/40 italic">{tier.footnote}</p>
                )}

                <div className="text-center pt-2">
                  <span className="text-2xl font-bold text-white">{tier.price}</span>
                  {tier.priceSubline && (
                    <p className="text-[11px] text-white/50 mt-0.5">{tier.priceSubline}</p>
                  )}
                  <p className="text-xs text-emerald-400 mt-1">{tier.trialText}</p>
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
                      {tier.buttonText}
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
