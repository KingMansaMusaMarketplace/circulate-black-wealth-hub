import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  Star, 
  Users, 
  Calendar, 
  MessageSquare, 
  Target,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface KarmaTip {
  icon: React.ElementType;
  title: string;
  description: string;
  points: string;
  action: string;
  link: string;
  color: string;
}

const tips: KarmaTip[] = [
  {
    icon: ShoppingBag,
    title: 'Shop at Partner Businesses',
    description: 'Make purchases at Black-owned businesses in our directory',
    points: '+5-10 karma',
    action: 'Browse Directory',
    link: '/directory',
    color: 'text-emerald-400'
  },
  {
    icon: Star,
    title: 'Leave Reviews',
    description: 'Share your experience after visiting a business',
    points: '+3 karma',
    action: 'My Purchases',
    link: '/my-bookings',
    color: 'text-yellow-400'
  },
  {
    icon: Users,
    title: 'Refer Friends',
    description: 'Invite friends to join the platform',
    points: '+10 karma',
    action: 'Get Referral Link',
    link: '/referrals',
    color: 'text-blue-400'
  },
  {
    icon: Calendar,
    title: 'Book Services',
    description: 'Schedule appointments with partner businesses',
    points: '+5 karma',
    action: 'Find Services',
    link: '/directory?type=service',
    color: 'text-purple-400'
  },
  {
    icon: MessageSquare,
    title: 'Engage with Community',
    description: 'Participate in community discussions and events',
    points: '+2 karma',
    action: 'Join Community',
    link: '/community',
    color: 'text-pink-400'
  },
  {
    icon: Target,
    title: 'Complete Your Profile',
    description: 'Add your photo, bio, and preferences',
    points: '+5 karma (one-time)',
    action: 'Edit Profile',
    link: '/profile',
    color: 'text-cyan-400'
  }
];

const EarnKarmaTips: React.FC = () => {
  return (
    <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-mansagold" />
          Ways to Earn Karma
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-700/40 hover:bg-slate-700/60 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-slate-800/80 ${tip.color}`}>
                <tip.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-medium">{tip.title}</p>
                <p className="text-slate-500 text-xs">{tip.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-semibold text-sm whitespace-nowrap">
                {tip.points}
              </span>
              <Link to={tip.link}>
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-mansagold hover:text-mansagold hover:bg-mansagold/10"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        ))}

        {/* Pro tip */}
        <div className="mt-4 p-4 rounded-lg bg-mansagold/10 border border-mansagold/20">
          <p className="text-sm text-slate-300">
            <strong className="text-mansagold">Pro Tip:</strong> Stay active at least once a month 
            to prevent the 5% karma decay. Even a small purchase or review counts!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EarnKarmaTips;
