import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Sparkles, UserCheck, CheckCircle, Key, MessageCircle, ShieldCheck, RefreshCcw, DollarSign } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

const iconMap: Record<string, React.ElementType> = {
  Shield, Sparkles, UserCheck, CheckCircle, Key, MessageCircle, ShieldCheck, RefreshCcw, DollarSign,
};

interface MansaPromiseBadgeProps {
  propertyId: string;
  compact?: boolean;
}

interface Guarantee {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  category: string;
}

const MansaPromiseBadge: React.FC<MansaPromiseBadgeProps> = ({ propertyId, compact = false }) => {
  const [guarantees, setGuarantees] = useState<Guarantee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompliance = async () => {
      try {
        const { data, error } = await supabase
          .from('property_guarantee_compliance')
          .select(`
            guarantee_id,
            mansa_promise_guarantees (id, name, description, icon_name, category)
          `)
          .eq('property_id', propertyId)
          .eq('is_compliant', true);

        if (error) throw error;

        const met = (data || [])
          .map((d: any) => d.mansa_promise_guarantees)
          .filter(Boolean);
        setGuarantees(met);
      } catch (err) {
        console.error('Error fetching guarantees:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompliance();
  }, [propertyId]);

  if (loading || guarantees.length === 0) return null;

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30 gap-1 cursor-default">
              <ShieldCheck className="w-3 h-3" />
              Mansa Promise ({guarantees.length})
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs bg-slate-900 border-white/10 text-white p-3">
            <p className="font-semibold mb-1">This property meets {guarantees.length} guarantees:</p>
            <ul className="space-y-1 text-xs text-white/70">
              {guarantees.map(g => (
                <li key={g.id} className="flex items-center gap-1.5">
                  {React.createElement(iconMap[g.icon_name] || Shield, { className: 'w-3 h-3 text-emerald-400 shrink-0' })}
                  {g.name}
                </li>
              ))}
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white text-sm">Mansa Promise</h3>
          <p className="text-xs text-white/50">Rest easy with our guest guarantees</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {guarantees.map((g) => {
          const Icon = iconMap[g.icon_name] || Shield;
          return (
            <div key={g.id} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/5">
              <div className="w-7 h-7 rounded-md bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{g.name}</p>
                <p className="text-xs text-white/50 leading-relaxed">{g.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MansaPromiseBadge;
