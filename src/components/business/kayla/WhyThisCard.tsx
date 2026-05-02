import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AgentReasoning {
  inputs: Array<{ label: string; value: string | number }>;
  rationale: string;
}

interface Props {
  reasoning: AgentReasoning | null | undefined;
  className?: string;
}

/**
 * "Why this?" expandable — surfaces the 2–4 inputs and the
 * one-sentence rationale that drove a Kayla recommendation.
 * The single biggest trust unlock for AI outputs.
 */
export const WhyThisCard: React.FC<Props> = ({ reasoning, className }) => {
  const [open, setOpen] = useState(false);
  if (!reasoning || (!reasoning.inputs?.length && !reasoning.rationale)) return null;

  return (
    <div className={cn('mt-2 border-t border-white/10 pt-2', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[11px] text-mansagold/80 hover:text-mansagold transition-colors"
      >
        <Lightbulb className="h-3 w-3" />
        Why this?
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {open && (
        <div className="mt-2 space-y-1.5 text-[11px] text-white/70 bg-mansagold/5 border border-mansagold/15 rounded-md p-2">
          {reasoning.inputs?.length > 0 && (
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              {reasoning.inputs.map((i, idx) => (
                <div key={idx} className="flex justify-between gap-2">
                  <span className="text-white/50">{i.label}:</span>
                  <span className="text-white/80 font-medium truncate">{i.value}</span>
                </div>
              ))}
            </div>
          )}
          {reasoning.rationale && (
            <p className="italic text-white/60 pt-1 border-t border-white/5">{reasoning.rationale}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WhyThisCard;
