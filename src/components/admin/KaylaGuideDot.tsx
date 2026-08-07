import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getKaylaGuide } from '@/lib/admin/kayla-guide';

interface KaylaGuideDotProps {
  /** Hub item id — must match a key in the Kayla guide. */
  featureId: string;
  /** Human label of the feature, shown in the popover heading. */
  label: string;
  /** Fallback one-liner if Kayla has no entry yet. */
  fallback?: string;
  className?: string;
}

/**
 * A small gold "?" marker. Click it and Kayla explains, in her own voice,
 * what the feature does and the one action worth taking.
 */
const KaylaGuideDot: React.FC<KaylaGuideDotProps> = ({
  featureId,
  label,
  fallback,
  className,
}) => {
  const entry = getKaylaGuide(featureId);

  if (!entry && !fallback) return null;

  const stop = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Kayla explains ${label}`}
          onClick={stop}
          onKeyDown={stop}
          className={
            'shrink-0 rounded-full p-0.5 text-mansagold/50 hover:text-mansagold hover:bg-mansagold/15 transition-colors focus:outline-none focus:ring-2 focus:ring-mansagold/50 ' +
            (className ?? '')
          }
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        onClick={stop}
        className="w-80 bg-slate-950/95 backdrop-blur-xl border border-mansagold/30 text-white shadow-2xl shadow-black/40"
      >
        <div className="flex items-center gap-3 pb-3 mb-3 border-b border-white/10">
          <div className="w-9 h-9 rounded-full bg-mansagold/20 border border-mansagold/40 flex items-center justify-center font-bold text-mansagold">
            K
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-tight">Kayla, Ph.D.</p>
            <p className="text-xs text-white/50 truncate">on {label}</p>
          </div>
        </div>

        {entry ? (
          <div className="space-y-3 text-sm">
            <p className="text-white/85 leading-relaxed">{entry.what}</p>
            <p className="text-white/65 leading-relaxed">{entry.why}</p>
            <div className="rounded-lg bg-mansagold/10 border border-mansagold/25 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wider text-mansagold font-semibold mb-1">
                Do this
              </p>
              <p className="text-white/90 leading-relaxed">{entry.doThis}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-white/80 leading-relaxed">{fallback}</p>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default KaylaGuideDot;
