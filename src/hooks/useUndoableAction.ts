import { useCallback, useRef } from "react";
import { toast } from "sonner";

/**
 * useUndoableAction
 * Runs an admin action immediately, then shows an "Undo" toast for a grace
 * period. If the operator clicks Undo before the window expires, the undo
 * function runs and the original effect is reversed.
 *
 * The undo window is a UI-level safety net for accidental clicks. Actions
 * that must be truly irreversible (hard deletes, cash-out wires) should
 * still be gated by <DangerConfirmDialog /> instead of / in addition to
 * this hook.
 *
 * Usage:
 *   const run = useUndoableAction();
 *   run({
 *     label: "Verification approved for Acme Co.",
 *     durationMs: 8000,
 *     do: async () => { await approveVerification(id); },
 *     undo: async () => { await revertVerification(id); },
 *   });
 */
export interface UndoableAction<T = unknown> {
  /** Text shown in the toast, e.g. "Verification approved for Acme Co." */
  label: string;
  /** How long the Undo button is available. Default 6000ms. */
  durationMs?: number;
  /** The action to perform now. Its return value is passed to `undo`. */
  do: () => Promise<T> | T;
  /** How to reverse the action if the operator clicks Undo. */
  undo: (result: T) => Promise<void> | void;
  /** Optional callback if the undo window expires without a click. */
  onCommit?: (result: T) => void;
}

export function useUndoableAction() {
  const inFlight = useRef(false);

  return useCallback(async <T,>(action: UndoableAction<T>) => {
    if (inFlight.current) return;
    inFlight.current = true;

    try {
      const result = await action.do();
      const duration = action.durationMs ?? 6000;
      let undone = false;

      const toastId = toast(action.label, {
        duration,
        action: {
          label: "Undo",
          onClick: async () => {
            if (undone) return;
            undone = true;
            try {
              await action.undo(result);
              toast.success("Undone");
            } catch (err) {
              console.error("Undo failed", err);
              toast.error("Couldn't undo — please refresh and try manually");
            }
          },
        },
        onAutoClose: () => {
          if (!undone) action.onCommit?.(result);
        },
        onDismiss: () => {
          if (!undone) action.onCommit?.(result);
        },
      });

      return toastId;
    } catch (err) {
      console.error("Action failed", err);
      toast.error("Action failed — nothing was changed");
    } finally {
      inFlight.current = false;
    }
  }, []);
}
