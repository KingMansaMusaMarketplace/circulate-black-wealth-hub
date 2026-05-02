import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OrchestratorAgentChip {
  id: string;
  name: string;
  status?: 'thinking' | 'ready' | 'idle';
}

interface Props {
  agents: OrchestratorAgentChip[];
  /** Optional headline e.g. "Pulling in your team…" */
  label?: string;
  className?: string;
}

/**
 * Visible orchestration: when Kayla coordinates multiple agents, show
 * little chips so the user understands a *team* — not a single bot —
 * is working on their request.
 */
export const KaylaOrchestratorChips: React.FC<Props> = ({
  agents,
  label = 'Coordinating your AI team',
  className,
}) => {
  if (!agents.length) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <div className="flex items-center gap-1.5 text-xs text-mansagold/90">
        <Sparkles className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      <AnimatePresence mode="popLayout">
        {agents.map((a, i) => (
          <motion.span
            key={a.id}
            layout
            initial={{ opacity: 0, scale: 0.8, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: i * 0.06 }}
            className={cn(
              'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full',
              'border border-mansagold/30 bg-mansagold/10 text-[11px] text-mansagold',
              a.status === 'thinking' && 'animate-pulse',
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                a.status === 'thinking' && 'bg-mansagold animate-pulse',
                a.status === 'ready' && 'bg-emerald-400',
                (!a.status || a.status === 'idle') && 'bg-white/40',
              )}
            />
            {a.name}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default KaylaOrchestratorChips;
