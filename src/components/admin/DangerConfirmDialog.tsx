import { useState, useEffect, ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

/**
 * DangerConfirmDialog
 * A guardrail modal for destructive or money-moving admin actions.
 * Requires the operator to type an exact confirmation phrase (usually the
 * target's name) before the destructive button becomes clickable.
 *
 * Usage:
 *   <DangerConfirmDialog
 *     open={open}
 *     onOpenChange={setOpen}
 *     title="Delete user"
 *     description="This will permanently delete Jane Doe's account, all their businesses, and all their loyalty points. This cannot be undone."
 *     confirmPhrase="Jane Doe"
 *     confirmButtonLabel="Delete user"
 *     onConfirm={async () => { await deleteUser(id); }}
 *   />
 */
export interface DangerConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  /** What the operator must type to unlock the confirm button (case-sensitive). */
  confirmPhrase: string;
  confirmButtonLabel?: string;
  onConfirm: () => void | Promise<void>;
  /** Optional short list of consequences shown as bullets. */
  consequences?: string[];
}

export function DangerConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmPhrase,
  confirmButtonLabel = "Confirm",
  onConfirm,
  consequences,
}: DangerConfirmDialogProps) {
  const [typed, setTyped] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setTyped("");
      setSubmitting(false);
    }
  }, [open]);

  const matches = typed === confirmPhrase;

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!matches || submitting) return;
    try {
      setSubmitting(true);
      await onConfirm();
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <div>{description}</div>
              {consequences && consequences.length > 0 && (
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {consequences.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <Label htmlFor="danger-confirm-input" className="text-sm">
            Type{" "}
            <span className="font-mono font-semibold text-foreground">
              {confirmPhrase}
            </span>{" "}
            to confirm
          </Label>
          <Input
            id="danger-confirm-input"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
            autoFocus
            placeholder={confirmPhrase}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!matches || submitting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            {submitting ? "Working…" : confirmButtonLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
