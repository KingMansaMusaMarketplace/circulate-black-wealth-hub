import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles, CheckCircle2, Circle, QrCode, Image as ImageIcon,
  ListChecks, Clock, Share2, ArrowRight, Rocket, TrendingUp,
  Users, Calendar, PartyPopper, Timer
} from 'lucide-react';

interface FirstHourExperienceProps {
  businessId: string;
}

interface ChecklistItem {
  key: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  done: boolean;
  cta: string;
  onClick: () => void;
  estMinutes: number;
}

/**
 * FirstHourExperience
 * Rich onboarding shown to a brand-new business in their first 60 minutes.
 * - Live "X minutes since signup" counter
 * - Real-time progress checklist (5 items, fetched from DB)
 * - Timeline of "what happens next" (Hour 1, Day 1, Week 1)
 * - Preview of dashboard once activated
 */
export const FirstHourExperience: React.FC<FirstHourExperienceProps> = ({ businessId }) => {
  const navigate = useNavigate();
  const [now, setNow] = useState(Date.now());

  // tick the "minutes since signup" clock
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['first-hour-experience', businessId],
    queryFn: async () => {
      const [biz, services, qrs, photos] = await Promise.all([
        supabase
          .from('businesses')
          .select('business_name, logo_url, banner_url, description, phone, address, created_at, onboarding_completed_at')
          .eq('id', businessId)
          .maybeSingle(),
        supabase
          .from('business_services')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', businessId),
        supabase
          .from('qr_codes')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', businessId),
        supabase
          .from('businesses')
          .select('logo_url, banner_url')
          .eq('id', businessId)
          .maybeSingle(),
      ]);
      return {
        business: biz.data,
        servicesCount: services.count ?? 0,
        qrCount: qrs.count ?? 0,
        hasMedia: !!(photos.data?.logo_url || photos.data?.banner_url),
      };
    },
    refetchInterval: 15_000,
  });

  const business = data?.business;
  const createdAt = business?.created_at ? new Date(business.created_at).getTime() : now;
  const minutesSinceSignup = Math.max(0, Math.floor((now - createdAt) / 60_000));
  const minutesLeftInHour = Math.max(0, 60 - minutesSinceSignup);
  const firstName = business?.business_name?.split(' ')[0] ?? 'there';

  const checklist: ChecklistItem[] = [
    {
      key: 'profile',
      title: 'Add a logo & description',
      description: 'Customers trust businesses that look ready. Takes 2 minutes.',
      icon: <ImageIcon className="h-5 w-5" />,
      done: !!(business?.logo_url && business?.description),
      cta: 'Edit profile',
      estMinutes: 2,
      onClick: () => navigate('/business-profile'),
    },
    {
      key: 'contact',
      title: 'Confirm phone & address',
      description: 'So customers can find you and call.',
      icon: <Users className="h-5 w-5" />,
      done: !!(business?.phone && business?.address),
      cta: 'Add details',
      estMinutes: 1,
      onClick: () => navigate('/business-profile'),
    },
    {
      key: 'services',
      title: 'List 1 service or product',
      description: 'You can add more later — start with your bestseller.',
      icon: <ListChecks className="h-5 w-5" />,
      done: (data?.servicesCount ?? 0) >= 1,
      cta: 'Add service',
      estMinutes: 3,
      onClick: () => navigate('/business-dashboard?tab=services'),
    },
    {
      key: 'qr',
      title: 'Generate your loyalty QR code',
      description: 'Print it, scan it, and your first customer earns points.',
      icon: <QrCode className="h-5 w-5" />,
      done: (data?.qrCount ?? 0) >= 1,
      cta: 'Generate QR',
      estMinutes: 1,
      onClick: () => navigate('/business-dashboard?tab=qr'),
    },
    {
      key: 'share',
      title: 'Share your business link',
      description: 'Post to social or text 5 customers — earn your first scan.',
      icon: <Share2 className="h-5 w-5" />,
      done: false, // tracked client-side later; remains a nudge in hour 1
      cta: 'Get materials',
      estMinutes: 2,
      onClick: () => navigate('/marketing-materials'),
    },
  ];

  const completed = checklist.filter(c => c.done).length;
  const progressPct = Math.round((completed / checklist.length) * 100);
  const allDone = completed === checklist.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-mansagold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero with live counter */}
      <Card className="bg-gradient-to-br from-slate-900/95 via-slate-900/95 to-mansablue/30 border-white/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-72 h-72 bg-mansagold/10 rounded-full blur-3xl" />
        <CardHeader className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-mansagold text-black font-semibold">
              <Sparkles className="h-3 w-3 mr-1" />
              First hour
            </Badge>
            <Badge variant="outline" className="border-white/20 text-white/80">
              <Timer className="h-3 w-3 mr-1" />
              {minutesSinceSignup === 0 ? 'Just joined' : `${minutesSinceSignup} min ago`}
            </Badge>
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold text-white">
            Welcome aboard, {firstName} 👋
          </CardTitle>
          <p className="text-white/80 max-w-2xl">
            You've got <span className="text-mansagold font-semibold">{minutesLeftInHour} minutes left</span> in
            your first hour. Finish these {checklist.length} steps and your business goes live —
            ready to earn points, take bookings, and show up in search.
          </p>
        </CardHeader>
        <CardContent className="relative z-10 space-y-3">
          <div className="flex items-center justify-between text-sm text-white/80">
            <span>{completed} of {checklist.length} complete</span>
            <span className="font-semibold text-mansagold">{progressPct}%</span>
          </div>
          <Progress value={progressPct} className="h-2 bg-white/10" />
          {allDone && (
            <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-mansagold/15 border border-mansagold/30 text-mansagold">
              <PartyPopper className="h-5 w-5" />
              <span className="font-semibold">You're set! Your first dashboard widgets unlock as customers arrive.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checklist.map((item, idx) => (
          <Card
            key={item.key}
            className={`group transition-all border ${
              item.done
                ? 'bg-green-500/5 border-green-500/30'
                : 'bg-slate-900/60 border-white/10 hover:border-mansagold/40'
            }`}
          >
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex-shrink-0 ${item.done ? 'text-green-400' : 'text-white/40'}`}>
                  {item.done ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className={`font-semibold ${item.done ? 'text-green-300 line-through' : 'text-white'}`}>
                      {idx + 1}. {item.title}
                    </h3>
                    <span className="text-xs text-white/50 flex items-center gap-1 whitespace-nowrap">
                      <Clock className="h-3 w-3" />
                      {item.estMinutes}m
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mb-3">{item.description}</p>
                  {!item.done && (
                    <Button
                      size="sm"
                      onClick={item.onClick}
                      className="bg-mansagold hover:bg-mansagold/90 text-black font-semibold"
                    >
                      {item.icon}
                      <span className="ml-2">{item.cta}</span>
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* What happens next timeline */}
      <Card className="bg-slate-900/60 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Rocket className="h-5 w-5 text-mansagold" />
            What happens next
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              when: 'Hour 1',
              icon: <QrCode className="h-4 w-4" />,
              text: 'Your QR code is live. First scan = your first customer in our system.',
            },
            {
              when: 'Day 1',
              icon: <Calendar className="h-4 w-4" />,
              text: 'Listing appears in the public directory. Bookings widget activates.',
            },
            {
              when: 'Week 1',
              icon: <TrendingUp className="h-4 w-4" />,
              text: 'Revenue, popular services, and weekly trend charts replace this welcome screen.',
            },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-mansagold/15 border border-mansagold/40 flex items-center justify-center text-mansagold flex-shrink-0">
                {step.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-mansagold">{step.when}</div>
                <p className="text-sm text-white/75">{step.text}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FirstHourExperience;
