import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const KeyboardShortcutsHelp: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const shortcuts = [
    { keys: ['⌘', 'K'], description: 'Open command palette' },
    { keys: ['?'], description: 'Show keyboard shortcuts' },
    { keys: ['G', 'O'], description: 'Go to Overview' },
    { keys: ['G', 'U'], description: 'Go to Users' },
    { keys: ['G', 'B'], description: 'Go to Businesses' },
    { keys: ['G', 'F'], description: 'Go to Financials' },
    { keys: ['G', 'S'], description: 'Go to Security' },
    { keys: ['Esc'], description: 'Close dialogs' },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="text-blue-200 hover:text-white hover:bg-white/10"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Keyboard className="h-5 w-5 text-yellow-400" />
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription className="text-blue-200/70">
              Quick navigation and actions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg bg-white/5"
              >
                <span className="text-sm text-white/80">{shortcut.description}</span>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((key, i) => (
                    <React.Fragment key={i}>
                      <kbd className="px-2 py-1 text-xs font-semibold text-blue-200 bg-white/10 border border-white/20 rounded">
                        {key}
                      </kbd>
                      {i < shortcut.keys.length - 1 && (
                        <span className="text-white/40 text-xs">+</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KeyboardShortcutsHelp;
