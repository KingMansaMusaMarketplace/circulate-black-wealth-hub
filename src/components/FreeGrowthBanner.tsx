import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, Sparkles, Zap } from 'lucide-react';
import { useFoundingSlots } from '@/hooks/useFoundingSlots';
import {
  FOUNDING_MEMBER_PRICE_MONTHLY_USD,
  REGULAR_PRO_PRICE_MONTHLY_USD,
  FOUNDING_MEMBER_SLOT_CAP,
} from '@/lib/constants/founding-member';

/**
 * Replaces the old "Free until Sept 1, 2026" banner.
 * New offer: first 100 paying businesses get Pro at $149/mo locked in forever.
 */
const FreeGrowthBanner = () => {
  const { remaining, isFull } = useFoundingSlots();

  return (
    <section className="py-16 bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712] text-white relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-mansagold/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-mansablue/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <Badge className="bg-mansagold text-mansablue px-6 py-3 text-base font-bold rounded-full mb-6 inline-flex items-center shadow-lg">
            <Zap className="mr-2 h-5 w-5" />
            {isFull
              ? 'Founding 100 — Sold Out'
              : `Founding 100 — Only ${remaining} of ${FOUNDING_MEMBER_SLOT_CAP} Spots Left`}
          </Badge>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            {isFull
              ? `Pro is now $${REGULAR_PRO_PRICE_MONTHLY_USD}/mo.`
              : `Lock in Pro at $${FOUNDING_MEMBER_PRICE_MONTHLY_USD}/mo — forever.`}
          </h2>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            {isFull
              ? `All 100 Founding Member spots are claimed. Join Pro at the regular rate to access the full platform.`
              : `The first ${FOUNDING_MEMBER_SLOT_CAP} businesses to upgrade pay $${FOUNDING_MEMBER_PRICE_MONTHLY_USD}/mo and keep that rate for life — even when Pro goes to $${REGULAR_PRO_PRICE_MONTHLY_USD}/mo.`}
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-mansagold/10 backdrop-blur-xl rounded-2xl p-8 border-2 border-mansagold/40 shadow-[0_0_30px_rgba(255,179,0,0.15)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Crown className="h-12 w-12 text-mansagold" />
              <div>
                <h3 className="text-xl font-bold text-white">
                  {isFull ? 'Mansa Musa Pro' : 'Founding Member — Pro for Life'}
                </h3>
                <p className="text-blue-200 text-sm flex items-center gap-2 mt-1">
                  {isFull ? (
                    <>Full Pro access at the regular rate.</>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 text-mansagold" />
                      Rate locked in forever — no future price hikes
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-4xl font-bold text-mansagold">
                ${isFull ? REGULAR_PRO_PRICE_MONTHLY_USD : FOUNDING_MEMBER_PRICE_MONTHLY_USD}
                <span className="text-base text-blue-200 font-normal">/mo</span>
              </div>
              {!isFull && (
                <p className="text-xs text-blue-200 mt-1">
                  Save ${REGULAR_PRO_PRICE_MONTHLY_USD - FOUNDING_MEMBER_PRICE_MONTHLY_USD}/mo vs regular price
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/pricing" className="flex-1">
              <Button className="w-full bg-mansagold text-mansablue hover:bg-mansagold/90 font-bold py-6 text-base">
                <Sparkles className="mr-2 h-4 w-4" />
                {isFull ? 'View Pro Plan' : 'Claim a Founding Spot'}
              </Button>
            </Link>
            <Link to="/directory" className="flex-1">
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 py-6 text-base">
                Explore Businesses
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-center text-blue-200 text-sm mt-6">
          Customers always free. Basic Business listing always free.
        </p>
      </div>
    </section>
  );
};

export default FreeGrowthBanner;
