import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface KaylaAdultGateProps {
  onConfirm: () => void;
  className?: string;
  /** Use light text on dark chat panels. */
  tone?: 'default' | 'onDark';
}

/** One-time 18+ check shown before a Kayla chat starts. */
export const KaylaAdultGate: React.FC<KaylaAdultGateProps> = ({ onConfirm, className, tone = 'default' }) => {
  const [under18, setUnder18] = useState(false);
  const muted = tone === 'onDark' ? 'text-white/80' : 'text-muted-foreground';
  const heading = tone === 'onDark' ? 'text-white' : 'text-foreground';

  return (
    <div className={cn('flex flex-col items-center text-center gap-3 px-4 py-6', className)} role="region" aria-label="Age check for Kayla chat">
      <ShieldCheck className={cn('h-8 w-8', tone === 'onDark' ? 'text-mansagold' : 'text-primary')} />
      {under18 ? (
        <>
          <p className={cn('text-sm font-semibold', heading)}>Thanks for being honest.</p>
          <p className={cn('text-xs leading-relaxed', muted)}>
            Kayla chat is only for adults. You can still browse the business directory and everything else on 1325.AI.
          </p>
          <Button variant="outline" size="sm" onClick={() => setUnder18(false)}>Go back</Button>
        </>
      ) : (
        <>
          <p className={cn('text-sm font-semibold', heading)}>Kayla chat is for adults 18 and older</p>
          <p className={cn('text-xs leading-relaxed', muted)}>
            Kayla is an AI assistant for business owners, shoppers and professionals. Please confirm your age to continue.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button size="sm" onClick={onConfirm}>I'm 18 or older</Button>
            <Button size="sm" variant="outline" onClick={() => setUnder18(true)}>I'm under 18</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default KaylaAdultGate;
