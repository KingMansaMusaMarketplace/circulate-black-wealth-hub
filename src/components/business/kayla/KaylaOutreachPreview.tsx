import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Sparkles } from 'lucide-react';

interface Props {
  businessName: string;
}

export const KaylaOutreachPreview: React.FC<Props> = ({ businessName }) => {
  return (
    <Card className="bg-slate-800/40 border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-white/70">
          <Mail className="h-4 w-4 text-yellow-400" />
          Kayla Outreach Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="p-4 rounded-lg bg-slate-900/60 border border-white/5 space-y-3">
          <p className="text-xs text-white/40 font-medium">SUBJECT</p>
          <p className="text-sm text-white font-medium">
            {businessName}, your free AI Employee is ready
          </p>

          <div className="border-t border-white/10 pt-3 space-y-2">
            <p className="text-sm text-white/70">
              Hi {businessName} team,
            </p>
            <p className="text-sm text-white/70">
              I'm <span className="text-yellow-400 font-semibold">Kayla</span>, your AI concierge on 1325.AI. 
              I've been analyzing your listing and I'm ready to work for you:
            </p>
            <ul className="space-y-1 ml-4">
              <li className="text-sm text-white/60 flex items-start gap-2">
                <Sparkles className="h-3 w-3 text-yellow-400 mt-1 shrink-0" />
                <span><strong className="text-white/80">Auto-respond to reviews</strong> — professional, on-brand responses drafted in seconds</span>
              </li>
              <li className="text-sm text-white/60 flex items-start gap-2">
                <Sparkles className="h-3 w-3 text-yellow-400 mt-1 shrink-0" />
                <span><strong className="text-white/80">Find B2B partners</strong> — matched with complementary businesses in your area</span>
              </li>
              <li className="text-sm text-white/60 flex items-start gap-2">
                <Sparkles className="h-3 w-3 text-yellow-400 mt-1 shrink-0" />
                <span><strong className="text-white/80">Predict churn</strong> — catch at-risk customers before they leave</span>
              </li>
            </ul>
            <p className="text-sm text-white/70 pt-1">
              Businesses like yours see a <span className="text-emerald-400 font-semibold">7x ROI</span> from the 1325.AI platform. 
              Activate me for just <strong className="text-white">$100/mo</strong> — cancel anytime.
            </p>
          </div>
        </div>
        <p className="text-xs text-white/30 text-center">
          This is a preview of the personalized outreach Kayla sends to listed businesses
        </p>
      </CardContent>
    </Card>
  );
};
