import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { KaylaAdultGate } from './KaylaAdultGate';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

/** 18+ check in a pop-up, for voice buttons that have no chat panel. */
export const KaylaAdultConfirmDialog: React.FC<Props> = ({ open, onOpenChange, onConfirm }) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent className="max-w-sm">
      <AlertDialogHeader className="sr-only">
        <AlertDialogTitle>Age check</AlertDialogTitle>
        <AlertDialogDescription>Kayla chat is for adults 18 and older.</AlertDialogDescription>
      </AlertDialogHeader>
      <KaylaAdultGate onConfirm={onConfirm} className="py-2" />
      <button type="button" onClick={() => onOpenChange(false)} className="text-xs text-muted-foreground underline mx-auto">
        Close
      </button>
    </AlertDialogContent>
  </AlertDialog>
);

export default KaylaAdultConfirmDialog;
