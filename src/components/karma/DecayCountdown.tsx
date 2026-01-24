import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, AlertTriangle } from 'lucide-react';
import { differenceInDays, differenceInHours, addMonths } from 'date-fns';

interface DecayCountdownProps {
  lastDecayAt: string | null;
  currentKarma: number;
}

const DecayCountdown: React.FC<DecayCountdownProps> = ({ lastDecayAt, currentKarma }) => {
  const { daysRemaining, hoursRemaining, nextDecayDate, decayAmount } = useMemo(() => {
    const lastDecay = lastDecayAt ? new Date(lastDecayAt) : new Date();
    const nextDecay = addMonths(lastDecay, 1);
    const now = new Date();
    
    const days = Math.max(0, differenceInDays(nextDecay, now));
    const hours = Math.max(0, differenceInHours(nextDecay, now) % 24);
    const decay = currentKarma * 0.05; // 5% decay
    
    return {
      daysRemaining: days,
      hoursRemaining: hours,
      nextDecayDate: nextDecay,
      decayAmount: decay
    };
  }, [lastDecayAt, currentKarma]);

  const isUrgent = daysRemaining <= 3;
  const progressPercent = ((30 - daysRemaining) / 30) * 100;

  return (
    <Card className={`border backdrop-blur-xl ${
      isUrgent 
        ? 'border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-slate-800/60' 
        : 'border-white/10 bg-slate-800/60'
    }`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Clock className={`w-5 h-5 ${isUrgent ? 'text-rose-400' : 'text-mansagold'}`} />
          Next Decay Countdown
          {isUrgent && (
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Countdown Display */}
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <p className={`text-4xl font-bold ${isUrgent ? 'text-rose-400' : 'text-white'}`}>
              {daysRemaining}
            </p>
            <p className="text-slate-500 text-sm">Days</p>
          </div>
          <div className="text-2xl text-slate-600">:</div>
          <div className="text-center">
            <p className={`text-4xl font-bold ${isUrgent ? 'text-rose-400' : 'text-white'}`}>
              {hoursRemaining}
            </p>
            <p className="text-slate-500 text-sm">Hours</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                isUrgent ? 'bg-rose-500' : 'bg-mansagold'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Decay Warning */}
        <div className={`p-3 rounded-lg ${
          isUrgent ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-amber-500/10 border border-amber-500/20'
        }`}>
          <p className={`text-sm ${isUrgent ? 'text-rose-400' : 'text-amber-400'}`}>
            {isUrgent ? '⚠️ ' : '💡 '}
            {isUrgent 
              ? `Urgent! You'll lose ${decayAmount.toFixed(1)} karma points if you don't take action!`
              : `Make a purchase or activity to prevent losing ${decayAmount.toFixed(1)} karma points.`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DecayCountdown;
