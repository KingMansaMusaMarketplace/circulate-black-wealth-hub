import { useFraudPrevention } from '@/hooks/use-fraud-prevention';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Ban, Flag, AlertCircle, Loader2, Undo2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';

export const FraudPreventionActionsTable = () => {
  const { actions, isLoading, reverseAction, isReversing } = useFraudPrevention();
  const [reverseDialogOpen, setReverseDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [reverseReason, setReverseReason] = useState('');

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'qr_code_disabled': return <Ban className="h-4 w-4" />;
      case 'account_restricted': return <AlertCircle className="h-4 w-4" />;
      case 'review_flagged': return <Flag className="h-4 w-4" />;
      case 'verification_required': return <ShieldCheck className="h-4 w-4" />;
      case 'transaction_blocked': return <Ban className="h-4 w-4" />;
      default: return <ShieldCheck className="h-4 w-4" />;
    }
  };

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case 'qr_code_disabled': return 'QR Code Disabled';
      case 'account_restricted': return 'Account Restricted';
      case 'review_flagged': return 'Review Flagged';
      case 'verification_required': return 'Verification Required';
      case 'transaction_blocked': return 'Transaction Blocked';
      default: return actionType;
    }
  };

  const handleReverseClick = (actionId: string) => {
    setSelectedAction(actionId);
    setReverseDialogOpen(true);
  };

  const handleReverseConfirm = () => {
    if (selectedAction && reverseReason.trim()) {
      reverseAction({ actionId: selectedAction, reason: reverseReason });
      setReverseDialogOpen(false);
      setSelectedAction(null);
      setReverseReason('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-mansagold" />
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-mansagold" />
              Automatic Prevention Actions
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Actions automatically taken by the AI fraud detection system
            </p>
          </div>
        </div>

        {actions.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            No prevention actions taken yet
          </div>
        ) : (
          <div className="space-y-3">
            {actions.map((action) => (
              <div 
                key={action.id} 
                className={`p-4 rounded-xl border transition-all ${
                  action.reversed_at 
                    ? 'bg-white/5 border-white/10 opacity-60' 
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant={action.reversed_at ? 'outline' : 'default'} className="flex items-center gap-1">
                        {getActionIcon(action.action_type)}
                        {getActionLabel(action.action_type)}
                      </Badge>
                      {action.auto_triggered && (
                        <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-300 border-blue-400/30">
                          Auto
                        </Badge>
                      )}
                      {action.reversed_at && (
                        <Badge variant="destructive" className="text-xs">Reversed</Badge>
                      )}
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <p className="font-medium text-white">
                        {action.action_details?.reason || 'Fraud prevention action'}
                      </p>
                      {action.action_details?.alert_description && (
                        <p className="text-white/60">
                          {action.action_details.alert_description}
                        </p>
                      )}
                      {action.action_details?.confidence_score && (
                        <p className="text-xs text-white/50">
                          AI Confidence: {(action.action_details.confidence_score * 100).toFixed(0)}%
                        </p>
                      )}
                    </div>
                    
                    <div className="text-xs text-white/50 mt-2">
                      {formatDistanceToNow(new Date(action.created_at), { addSuffix: true })}
                    </div>

                    {action.reversed_at && action.reversal_reason && (
                      <div className="mt-2 p-2 bg-white/5 rounded text-xs text-white/70">
                        <span className="font-medium text-white/80">Reversal reason: </span>
                        {action.reversal_reason}
                      </div>
                    )}
                  </div>
                  
                  {!action.reversed_at && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReverseClick(action.id)}
                      disabled={isReversing}
                      className="border-mansagold/50 text-mansagold hover:bg-mansagold/20"
                    >
                      <Undo2 className="h-3 w-3 mr-1" />
                      Reverse
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={reverseDialogOpen} onOpenChange={setReverseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reverse Prevention Action</AlertDialogTitle>
            <AlertDialogDescription>
              This will undo the automatic prevention action. Please provide a reason for reversing this action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Explain why this action should be reversed..."
              value={reverseReason}
              onChange={(e) => setReverseReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReverseReason('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReverseConfirm}
              disabled={!reverseReason.trim() || isReversing}
              className="bg-mansagold hover:bg-mansagold/90 text-mansablue"
            >
              {isReversing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Reversal'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
