import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, ArrowRight, Megaphone, DollarSign, Briefcase, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const SUMMARY = [
  { dept: 'Marketing', icon: Megaphone, count: 7, color: 'text-pink-400 bg-pink-500/10 border-pink-500/30' },
  { dept: 'Finance', icon: DollarSign, count: 6, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { dept: 'Operations', icon: Briefcase, count: 8, color: 'text-slate-300 bg-slate-500/10 border-slate-500/30' },
  { dept: 'Community', icon: Heart, count: 4, color: 'text-red-400 bg-red-500/10 border-red-500/30' },
];

/**
 * Compact roster teaser for the Kayla dashboard. Shows the team at a
 * glance and links to the full /kayla/team page.
 */
export const KaylaTeamRosterTeaser: React.FC = () => {
  return (
    <Card className="bg-slate-900/60 border-white/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-mansagold" />
            <h3 className="text-sm font-semibold text-white">Your AI Team</h3>
            <span className="text-xs text-white/40">— 33 agents working 24/7</span>
          </div>
          <Button asChild size="sm" variant="ghost" className="text-mansagold hover:text-mansagold hover:bg-mansagold/10">
            <Link to="/kayla/team">
              See all <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {SUMMARY.map(({ dept, icon: Icon, count, color }) => (
            <Link
              key={dept}
              to="/kayla/team"
              className={`flex items-center gap-2 p-2 rounded-md border ${color} hover:opacity-80 transition-opacity`}
            >
              <Icon className="h-4 w-4" />
              <div>
                <p className="text-xs font-semibold leading-tight">{dept}</p>
                <p className="text-[10px] opacity-70">{count} agents</p>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-[11px] text-white/40 mt-3">
          Kayla coordinates the team — ~4 roles covered, $12,100+/mo in human labor saved.
        </p>
      </CardContent>
    </Card>
  );
};

export default KaylaTeamRosterTeaser;
