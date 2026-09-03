import React from 'react';
import { CalendarClock, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSponsorCRM, SponsorProspect } from '@/hooks/use-sponsor-crm';

interface Props {
  onSelect?: (prospect: SponsorProspect) => void;
}

export const FollowUpsPanel: React.FC<Props> = ({ onSelect }) => {
  const { followUps, prospects } = useSponsorCRM();

  const items = (followUps || []) as { id: string; company_name: string; next_follow_up: string; follow_up_notes: string | null }[];
  if (items.length === 0) return null;

  const now = Date.now();

  return (
    <Card className="bg-white/5 border-white/10 p-4">
      <div className="flex items-center gap-2 mb-3">
        <CalendarClock className="w-4 h-4 text-amber-300" />
        <h3 className="text-white font-semibold text-sm">Follow-ups due</h3>
        <Badge variant="secondary" className="bg-white/10 text-blue-200 text-xs">
          {items.length}
        </Badge>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {items.map((item) => {
          const overdue = new Date(item.next_follow_up).getTime() < now;
          const full = prospects.find((p) => p.id === item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => full && onSelect?.(full)}
              className={`text-left rounded-lg border p-3 transition-colors ${
                overdue
                  ? 'border-red-500/40 bg-red-500/10 hover:bg-red-500/20'
                  : 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-white font-medium truncate">{item.company_name}</span>
                <span className={`text-xs flex items-center gap-1 ${overdue ? 'text-red-300' : 'text-amber-300'}`}>
                  {overdue && <AlertTriangle className="w-3 h-3" />}
                  {new Date(item.next_follow_up).toLocaleDateString()}
                </span>
              </div>
              {item.follow_up_notes && (
                <p className="text-xs text-blue-100/70 mt-1 line-clamp-2">{item.follow_up_notes}</p>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default FollowUpsPanel;
