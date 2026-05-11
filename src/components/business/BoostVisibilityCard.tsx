import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, ArrowRight } from 'lucide-react';
import { shouldHideStripePayments } from '@/utils/platform-utils';

/**
 * Inline CTA card surfaced on the business dashboard so owners discover the
 * Featured Placement upsell without digging through the sidebar.
 * Hidden on iOS native per App Store payment-UI policy.
 */
export default function BoostVisibilityCard() {
  if (shouldHideStripePayments()) return null;

  return (
    <Card className="bg-gradient-to-br from-mansagold/15 via-mansagold/5 to-transparent border-mansagold/30 overflow-hidden relative">
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-mansagold/20 blur-2xl" />
      <CardContent className="p-5 relative">
        <div className="flex items-start gap-3 mb-3">
          <div className="h-9 w-9 rounded-lg bg-mansagold/20 flex items-center justify-center">
            <Crown className="h-5 w-5 text-mansagold" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">Boost Visibility</div>
            <p className="text-xs text-white/70 mt-0.5">
              Pin your listing to the top of search & spotlight from $20/mo.
            </p>
          </div>
        </div>
        <Button
          asChild
          size="sm"
          className="w-full bg-mansagold/90 hover:bg-mansagold text-black font-medium"
        >
          <Link to="/business/featured-placement">
            See plans <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
