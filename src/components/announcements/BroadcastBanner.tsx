import React, { useState, useEffect } from 'react';
import { useTargetedBroadcasts } from '@/hooks/useTargetedBroadcasts';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'dismissed_broadcasts_v1';

const typeStyles: Record<string, { icon: React.ElementType; cls: string }> = {
  info: { icon: Info, cls: 'bg-primary/10 text-primary border-primary/30' },
  warning: { icon: AlertTriangle, cls: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30' },
  alert: { icon: AlertCircle, cls: 'bg-destructive/10 text-destructive border-destructive/30' },
  success: { icon: CheckCircle, cls: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' },
};

const BroadcastBanner: React.FC = () => {
  const { broadcasts } = useTargetedBroadcasts();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDismissed(new Set(JSON.parse(raw)));
    } catch {}
  }, []);

  const dismiss = (id: string) => {
    const next = new Set(dismissed);
    next.add(id);
    setDismissed(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next))); } catch {}
  };

  const visible = broadcasts.filter((b) => !dismissed.has(b.id)).slice(0, 3);
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2 px-4 pt-2">
      {visible.map((b) => {
        const cfg = typeStyles[b.announcement_type] || typeStyles.info;
        const Icon = cfg.icon;
        return (
          <div
            key={b.id}
            className={cn('flex items-start gap-3 rounded-md border px-4 py-3 text-sm', cfg.cls)}
            role="status"
          >
            <Icon className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
            <div className="flex-1 min-w-0">
              <div className="font-semibold">{b.title}</div>
              <div className="text-foreground/80">{b.message}</div>
            </div>
            <button
              onClick={() => dismiss(b.id)}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Dismiss announcement"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default BroadcastBanner;
