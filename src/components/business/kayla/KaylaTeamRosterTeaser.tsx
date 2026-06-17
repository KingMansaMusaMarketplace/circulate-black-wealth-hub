import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, ArrowRight, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ALL_PERSONAS, KAYLA, personasByDepartment, PERSONA_COUNT } from '@/data/kayla-personas';

/**
 * Compact roster teaser for the Kayla dashboard. Shows the named team
 * (Kayla + 41 specialists) and links to the full /kayla/team page.
 */
export const KaylaTeamRosterTeaser: React.FC = () => {
  const grouped = personasByDepartment();
  const departments = Object.entries(grouped).filter(([dept]) => dept !== 'Leadership');

  return (
    <Card className="bg-slate-900/60 border-white/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-mansagold" />
            <h3 className="text-sm font-semibold text-white">Your AI Team</h3>
            <span className="text-xs text-white/40">— {PERSONA_COUNT} agents working 24/7</span>
          </div>
          <Button asChild size="sm" variant="ghost" className="text-mansagold hover:text-mansagold hover:bg-mansagold/10">
            <Link to="/kayla/team">
              See all <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Kayla — featured */}
        <Link
          to="/kayla/team"
          className="flex items-center gap-2 p-2 mb-3 rounded-md border border-mansagold/40 bg-mansagold/10 hover:bg-mansagold/15 transition-colors"
        >
          <Crown className="h-3.5 w-3.5 text-mansagold flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-mansagold leading-tight">{KAYLA.name}</p>
            <p className="text-[10px] text-white/60 truncate">{KAYLA.role}</p>
          </div>
        </Link>

        {/* Specialists by department, names visible */}
        <div className="space-y-2">
          {departments.map(([dept, members]) => (
            <div key={dept}>
              <div className="text-[9px] uppercase tracking-widest text-mansagold/70 font-semibold mb-1">
                {dept} · {members.length}
              </div>
              <div className="flex flex-wrap gap-1">
                {members.map((p) => (
                  <Link
                    key={p.id}
                    to="/kayla/team"
                    title={`${p.name} — ${p.role}`}
                    className="px-2 py-0.5 rounded-md border border-white/10 bg-white/[0.03] text-[11px] text-white/80 hover:bg-white/[0.06] hover:text-white transition-colors"
                  >
                    {p.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-white/40 mt-3">
          Kayla coordinates {ALL_PERSONAS.length - 1} named specialists — ~4 roles covered, $18,000+/mo in human labor saved.
        </p>
      </CardContent>
    </Card>
  );
};

export default KaylaTeamRosterTeaser;
