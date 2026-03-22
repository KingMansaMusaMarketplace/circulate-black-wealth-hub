import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Sparkles, TrendingUp } from 'lucide-react';

interface Props {
  businessName: string;
}

export const KaylaOutreachPreview: React.FC<Props> = ({ businessName }) => {
  return (
    <Card className="bg-slate-800/40 border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-white/70">
          <Mail className="h-4 w-4 text-yellow-400" />
          Kayla "AI Employee" Outreach Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="p-4 rounded-lg bg-slate-900/60 border border-white/5 space-y-3">
          <p className="text-xs text-white/40 font-medium">SUBJECT</p>
          <p className="text-sm text-white font-medium">
            Meet Kayla: Your New AI Employee is Ready to Work
          </p>

          <div className="border-t border-white/10 pt-3 space-y-2">
            <p className="text-sm text-white/70">
              Hi {businessName} Team,
            </p>
            <p className="text-sm text-white/70">
              For 40 years, I've been building tools to empower our community. Today, I am proud to introduce the most advanced worker we've ever hired at 1325.ai: <span className="text-yellow-400 font-semibold">Kayla</span>.
            </p>
            <p className="text-sm text-white/70">
              Kayla isn't just a search tool. She is an <strong className="text-white">Autonomous AI Employee</strong> built specifically to run the backend of your business so you can focus on your craft.
            </p>

            <p className="text-xs text-white/50 font-medium mt-3">STARTING TODAY, KAYLA CAN HANDLE:</p>
            <ul className="space-y-1.5 ml-4">
              <li className="text-sm text-white/60 flex items-start gap-2">
                <Sparkles className="h-3 w-3 text-yellow-400 mt-1 shrink-0" />
                <span><strong className="text-white/80">24/7 Review Management</strong> — drafts professional, on-brand responses to every customer review in seconds</span>
              </li>
              <li className="text-sm text-white/60 flex items-start gap-2">
                <Sparkles className="h-3 w-3 text-yellow-400 mt-1 shrink-0" />
                <span><strong className="text-white/80">B2B Matchmaking</strong> — scans our network of 33,000+ businesses to find your next supplier or partner</span>
              </li>
              <li className="text-sm text-white/60 flex items-start gap-2">
                <Sparkles className="h-3 w-3 text-yellow-400 mt-1 shrink-0" />
                <span><strong className="text-white/80">Churn Prediction</strong> — identifies at-risk customers before they leave, protecting your revenue</span>
              </li>
              <li className="text-sm text-white/60 flex items-start gap-2">
                <Sparkles className="h-3 w-3 text-yellow-400 mt-1 shrink-0" />
                <span><strong className="text-white/80">Content Generation</strong> — creates social posts and promotions to keep your brand active on autopilot</span>
              </li>
            </ul>

            <div className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-sm text-white/70 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-yellow-400 shrink-0" />
                <span><strong className="text-yellow-400">The "Mansa Musa" Multiplier:</strong> Every dollar processed through Kayla is tracked by our Verified Wealth Ticker, proving the <span className="text-emerald-400 font-semibold">6.0x economic impact</span> we are making together.</span>
              </p>
            </div>

            <p className="text-sm text-white/70 pt-2">
              Activate your AI Employee for just <strong className="text-white">$100/mo</strong>. No interviews, no payroll tax, and no days off.
            </p>

            <p className="text-sm text-white/50 pt-2 italic">
              To our collective success,<br />
              Thomas D. Bowling<br />
              Founder & Chief Architect, 1325.ai
            </p>
          </div>
        </div>
        <p className="text-xs text-white/30 text-center">
          This is a preview of the personalized "AI Employee" outreach Kayla sends to listed businesses
        </p>
      </CardContent>
    </Card>
  );
};
