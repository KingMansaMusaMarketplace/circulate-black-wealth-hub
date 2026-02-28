import React from 'react';
import { ShieldCheck, Sparkles, RefreshCcw, DollarSign } from 'lucide-react';

const highlights = [
  { icon: ShieldCheck, text: 'Verified & Safe' },
  { icon: Sparkles, text: 'Clean Certified' },
  { icon: RefreshCcw, text: 'Free Cancellation' },
  { icon: DollarSign, text: 'No Hidden Fees' },
];

const MansaPromiseBookingBanner: React.FC = () => (
  <div className="flex items-center gap-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
    <div className="flex items-center gap-1.5 shrink-0">
      <ShieldCheck className="w-4 h-4 text-emerald-400" />
      <span className="text-xs font-semibold text-emerald-300">Mansa Promise</span>
    </div>
    <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
      {highlights.map(({ icon: Icon, text }) => (
        <div key={text} className="flex items-center gap-1 text-white/60 shrink-0">
          <Icon className="w-3 h-3" />
          <span className="text-[11px] whitespace-nowrap">{text}</span>
        </div>
      ))}
    </div>
  </div>
);

export default MansaPromiseBookingBanner;
