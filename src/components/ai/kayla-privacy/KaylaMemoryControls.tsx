import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Props {
  memoryEnabled: boolean;
  signedIn: boolean;
  onToggle: (enabled: boolean) => Promise<boolean> | boolean;
  onDeleteSaved: () => Promise<boolean> | boolean;
  /** Clears what is showing in this chat window. */
  onCleared?: () => void;
  tone?: 'default' | 'onDark';
  className?: string;
}

/** "Remember my chats" switch plus "Delete saved chats", shown in every Kayla chat. */
export const KaylaMemoryControls: React.FC<Props> = ({
  memoryEnabled, signedIn, onToggle, onDeleteSaved, onCleared, tone = 'default', className,
}) => {
  const [confirming, setConfirming] = useState(false);
  const muted = tone === 'onDark' ? 'text-white/80' : 'text-muted-foreground';
  const id = React.useId();

  const toggle = async (next: boolean) => {
    const ok = await onToggle(next);
    if (!ok) toast.error("Couldn't save that setting. Please try again.");
    else toast.success(next ? 'Kayla will remember your chats.' : 'Private chat on — Kayla will not save your chats.');
  };

  const remove = async () => {
    setConfirming(false);
    const ok = await onDeleteSaved();
    onCleared?.();
    if (ok) toast.success(signedIn ? 'Your saved Kayla chats were deleted.' : 'Chats saved on this device were deleted.');
    else toast.error("Couldn't delete saved chats. Please try again.");
  };

  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px]', muted, className)}>
      <label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
        <Switch id={id} checked={memoryEnabled} onCheckedChange={toggle} aria-label="Remember my chats" className="scale-75 origin-left" />
        <span>{memoryEnabled ? 'Remember my chats' : 'Private chat — nothing is saved'}</span>
      </label>
      {confirming ? (
        <span className="flex items-center gap-2">
          <span>Delete all saved chats?</span>
          <button type="button" onClick={remove} className="font-semibold underline">Yes</button>
          <button type="button" onClick={() => setConfirming(false)} className="underline">Cancel</button>
        </span>
      ) : (
        <button type="button" onClick={() => setConfirming(true)} className="underline hover:opacity-80">
          Delete saved chats
        </button>
      )}
    </div>
  );
};

export default KaylaMemoryControls;
