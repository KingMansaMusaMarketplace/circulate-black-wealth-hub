import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MarketingTopupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessId: string | null;
}

const PACKS = [
  { id: 'starter', credits: 25, price: 9, label: 'Starter' },
  { id: 'pro', credits: 100, price: 25, label: 'Pro Pack', popular: true },
  { id: 'studio', credits: 500, price: 79, label: 'Studio' },
];

export const MarketingTopupDialog: React.FC<MarketingTopupDialogProps> = ({ open, onOpenChange, businessId }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const buy = async (pack: string) => {
    if (!businessId) {
      toast.error('No business profile found.');
      return;
    }
    setLoading(pack);
    try {
      const { data, error } = await supabase.functions.invoke('create-marketing-topup-checkout', {
        body: { businessId, pack },
      });
      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL returned');
      window.open(data.url, '_blank');
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Checkout failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-mansagold" />
            Top up Marketing Credits
          </DialogTitle>
          <DialogDescription>
            Credits never expire. Use them on top of your monthly plan allocation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          {PACKS.map((p) => (
            <Card
              key={p.id}
              className={cn(
                'p-5 flex flex-col items-center text-center relative',
                p.popular && 'border-mansagold ring-1 ring-mansagold'
              )}
            >
              {p.popular && (
                <span className="absolute -top-2 right-3 text-[10px] font-semibold bg-mansagold text-black px-2 py-0.5 rounded">
                  POPULAR
                </span>
              )}
              <div className="text-3xl font-bold">{p.credits}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">credits</div>
              <div className="mt-3 text-2xl font-semibold">${p.price}</div>
              <div className="text-xs text-muted-foreground">${(p.price / p.credits).toFixed(2)} / image</div>
              <Button
                className="w-full mt-4"
                onClick={() => buy(p.id)}
                disabled={loading !== null}
                variant={p.popular ? 'default' : 'outline'}
              >
                {loading === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : `Buy ${p.label}`}
              </Button>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
