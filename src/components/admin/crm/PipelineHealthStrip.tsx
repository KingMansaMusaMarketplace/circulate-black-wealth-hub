import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Activity, Clock, Snowflake, Target, DollarSign, Gauge, MessageSquareReply } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getSponsorMeta, hasReplied } from '@/utils/sponsorOutreachEmail';
import { useSponsorCRM, PIPELINE_STAGES, SponsorProspect } from '@/hooks/use-sponsor-crm';

const DAY = 24 * 60 * 60 * 1000;

const daysSince = (value: string | null | undefined) =>
  value ? Math.floor((Date.now() - new Date(value).getTime()) / DAY) : null;

/** Touches we aim to send each week. */
export const WEEKLY_TOUCH_GOAL = 20;

const startOfWeek = () => {
  const d = new Date();
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

interface Props {
  onSelectCold?: (prospect: SponsorProspect) => void;
}

export const PipelineHealthStrip: React.FC<Props> = ({ onSelectCold }) => {
  const { prospects } = useSponsorCRM();

  const health = useMemo(() => {
    const total = prospects.length;
    const contacted = prospects.filter((p) => p.pipeline_stage !== 'research').length;
    const meetings = prospects.filter((p) =>
      ['meeting_scheduled', 'meeting_completed', 'proposal_sent', 'negotiation', 'closed_won'].includes(
        p.pipeline_stage,
      ),
    ).length;
    const won = prospects.filter((p) => p.pipeline_stage === 'closed_won').length;

    const stageDays = prospects
      .map((p) => daysSince(p.stage_changed_at))
      .filter((d): d is number => d != null);
    const avgDaysInStage = stageDays.length
      ? Math.round(stageDays.reduce((a, b) => a + b, 0) / stageDays.length)
      : 0;

    const cold = prospects.filter((p) => {
      if (['closed_won', 'closed_lost', 'on_hold', 'research'].includes(p.pipeline_stage)) return false;
      const since = daysSince(p.last_contact_at);
      return since == null || since >= 14;
    });

    const byStage = PIPELINE_STAGES.map((s) => ({
      ...s,
      count: prospects.filter((p) => p.pipeline_stage === s.value).length,
    })).filter((s) => s.count > 0);

    const weekStart = startOfWeek();
    const touchesThisWeek = prospects.filter((p) => {
      const t = getSponsorMeta(p).last_touch_at ?? p.last_contact_at;
      return t ? new Date(t).getTime() >= weekStart : false;
    }).length;

    const replies = prospects.filter(hasReplied).length;

    const openStages = ['closed_won', 'closed_lost', 'on_hold'];
    const forecast = prospects
      .filter((p) => !openStages.includes(p.pipeline_stage))
      .reduce((sum, p) => sum + (Number(p.deal_value) || 0) * ((Number(p.probability) || 0) / 100), 0);
    const openValue = prospects
      .filter((p) => !openStages.includes(p.pipeline_stage))
      .reduce((sum, p) => sum + (Number(p.deal_value) || 0), 0);

    return {
      total,
      touchesThisWeek,
      replies,
      forecast,
      openValue,
      contactRate: total ? Math.round((contacted / total) * 100) : 0,
      meetingRate: contacted ? Math.round((meetings / contacted) * 100) : 0,
      winRate: total ? Math.round((won / total) * 100) : 0,
      avgDaysInStage,
      cold,
      byStage,
    };
  }, [prospects]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="bg-white/5 border-white/10 p-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-blue-200 flex items-center gap-1">
              <Gauge className="w-3 h-3" /> Outreach this week
            </p>
            <p className="text-xs text-blue-200">
              <span className="text-white font-semibold text-base">{health.touchesThisWeek}</span> of{' '}
              {WEEKLY_TOUCH_GOAL}
            </p>
          </div>
          <Progress
            value={Math.min(100, (health.touchesThisWeek / WEEKLY_TOUCH_GOAL) * 100)}
            className="mt-2 h-2 bg-white/10"
          />
          <p className="text-[11px] text-blue-300/70 mt-1">
            Resets every Monday. {Math.max(0, WEEKLY_TOUCH_GOAL - health.touchesThisWeek)} touches left to
            hit the goal.
          </p>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20 p-4">
          <p className="text-xs text-emerald-200 flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> Forecast (weighted)
          </p>
          <p className="text-2xl font-bold text-emerald-300">
            ${Math.round(health.forecast).toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-200/70">
            of ${Math.round(health.openValue).toLocaleString()} open pipeline
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="bg-white/5 border-white/10 p-4">
          <p className="text-xs text-blue-200 flex items-center gap-1">
            <MessageSquareReply className="w-3 h-3" /> Replies
          </p>
          <p className="text-2xl font-bold text-purple-300">{health.replies}</p>
          <p className="text-[11px] text-blue-300/70">companies that wrote back</p>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <p className="text-xs text-blue-200 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Contacted
          </p>
          <p className="text-2xl font-bold text-white">{health.contactRate}%</p>
          <p className="text-[11px] text-blue-300/70">of {health.total} targets have been worked</p>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <p className="text-xs text-blue-200 flex items-center gap-1">
            <Target className="w-3 h-3" /> Meeting rate
          </p>
          <p className="text-2xl font-bold text-cyan-300">{health.meetingRate}%</p>
          <p className="text-[11px] text-blue-300/70">of contacted prospects reach a meeting</p>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <p className="text-xs text-blue-200 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Avg days in stage
          </p>
          <p className="text-2xl font-bold text-amber-300">{health.avgDaysInStage}</p>
          <p className="text-[11px] text-blue-300/70">across the whole pipeline</p>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <p className="text-xs text-blue-200 flex items-center gap-1">
            <Snowflake className="w-3 h-3" /> Gone cold
          </p>
          <p className="text-2xl font-bold text-red-300">{health.cold.length}</p>
          <p className="text-[11px] text-blue-300/70">no contact in 14+ days</p>
        </Card>
      </div>

      {health.byStage.length > 0 && (
        <Card className="bg-white/5 border-white/10 p-3">
          <div className="flex flex-wrap gap-3">
            {health.byStage.map((s) => (
              <div key={s.value} className="flex items-center gap-2 text-xs text-blue-100">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                {s.label}
                <span className="text-white font-semibold">{s.count}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {health.cold.length > 0 && (
        <Card className="bg-red-500/5 border-red-500/20 p-3">
          <p className="text-xs text-red-200 mb-2">
            Cold — these need a follow-up touch:
          </p>
          <div className="flex flex-wrap gap-2">
            {health.cold.slice(0, 12).map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectCold?.(p)}
                className="text-xs px-2 py-1 rounded bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                {p.company_name}
              </button>
            ))}
            {health.cold.length > 12 && (
              <span className="text-xs text-red-200/70 self-center">
                +{health.cold.length - 12} more
              </span>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PipelineHealthStrip;
