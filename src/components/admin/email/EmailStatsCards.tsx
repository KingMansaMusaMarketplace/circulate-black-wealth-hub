import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, CheckCircle, Eye, MousePointer, AlertTriangle, XCircle } from 'lucide-react';
import type { EmailStats } from '@/lib/api/email-events';

interface EmailStatsCardsProps {
  stats: EmailStats;
  isLoading?: boolean;
}

const EmailStatsCards: React.FC<EmailStatsCardsProps> = ({ stats, isLoading }) => {
  const cards = [
    {
      title: 'Total Sent',
      value: stats.total_sent,
      icon: Mail,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Delivered',
      value: stats.total_delivered,
      subtitle: `${stats.delivery_rate.toFixed(1)}%`,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Opened',
      value: stats.total_opened,
      subtitle: `${stats.open_rate.toFixed(1)}%`,
      icon: Eye,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Clicked',
      value: stats.total_clicked,
      subtitle: `${stats.click_rate.toFixed(1)}%`,
      icon: MousePointer,
      color: 'text-mansagold',
      bgColor: 'bg-mansagold/10',
    },
    {
      title: 'Bounced',
      value: stats.total_bounced,
      subtitle: `${stats.bounce_rate.toFixed(1)}%`,
      icon: AlertTriangle,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Complaints',
      value: stats.total_complained,
      icon: XCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-white/10 rounded w-16 mb-2" />
                <div className="h-8 bg-white/10 rounded w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-xs text-white/60">{card.title}</p>
                <p className="text-xl font-bold text-white">{card.value}</p>
                {card.subtitle && (
                  <p className={`text-xs ${card.color}`}>{card.subtitle}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EmailStatsCards;
