import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, ExternalLink } from 'lucide-react';

interface UTMData {
  source: string;
  medium: string;
  campaign: string;
  clicks: number;
  signups: number;
  conversions: number;
  earnings: number;
}

interface PartnerUTMBreakdownProps {
  data: UTMData[];
}

const PartnerUTMBreakdown: React.FC<PartnerUTMBreakdownProps> = ({ data }) => {
  // Sort by earnings descending
  const sortedData = [...data].sort((a, b) => b.earnings - a.earnings);
  
  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      facebook: 'bg-blue-500',
      instagram: 'bg-pink-500',
      twitter: 'bg-sky-500',
      linkedin: 'bg-blue-700',
      email: 'bg-amber-500',
      google: 'bg-red-500',
      direct: 'bg-slate-500',
    };
    return colors[source.toLowerCase()] || 'bg-purple-500';
  };

  if (data.length === 0) {
    return (
      <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-amber-400" />
            Campaign Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No UTM data yet</p>
            <p className="text-sm mt-1">Add ?utm_source=xxx to your referral links to track campaigns</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="h-5 w-5 text-amber-400" />
          Campaign Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedData.slice(0, 5).map((item, idx) => (
            <div 
              key={`${item.source}-${item.campaign}-${idx}`}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-700/30"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-8 rounded-full ${getSourceColor(item.source)}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white capitalize">{item.source}</span>
                    {item.medium && (
                      <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                        {item.medium}
                      </Badge>
                    )}
                  </div>
                  {item.campaign && (
                    <span className="text-xs text-slate-500">{item.campaign}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-emerald-400">
                  ${item.earnings.toFixed(2)}
                </div>
                <div className="text-xs text-slate-500">
                  {item.clicks} clicks → {item.conversions} conv
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {sortedData.length > 5 && (
          <p className="text-center text-xs text-slate-500 mt-4">
            +{sortedData.length - 5} more campaigns
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PartnerUTMBreakdown;
