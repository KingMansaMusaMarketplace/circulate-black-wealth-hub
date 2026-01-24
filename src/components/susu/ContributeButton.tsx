import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { DollarSign, Shield, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ContributeButtonProps {
  circleId: string;
  circleName: string;
  contributionAmount: number;
  currentRound: number;
  disabled?: boolean;
}

const ContributeButton: React.FC<ContributeButtonProps> = ({
  circleId,
  circleName,
  contributionAmount,
  currentRound,
  disabled = false
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const contributeMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      // Call the susu-escrow edge function
      const { data, error } = await supabase.functions.invoke('susu-escrow', {
        body: {
          action: 'contribute',
          circle_id: circleId,
          user_id: user.id,
          amount: contributionAmount
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      return data;
    },
    onSuccess: (data) => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['susu-escrow'] });
      queryClient.invalidateQueries({ queryKey: ['round-contributions', circleId] });
      toast.success(`Contributed $${contributionAmount} to ${circleName}!`);
      
      // Reset after showing success
      setTimeout(() => {
        setDialogOpen(false);
        setSuccess(false);
      }, 2000);
    },
    onError: (error) => {
      toast.error('Contribution failed: ' + (error as Error).message);
    }
  });

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        disabled={disabled}
        className="bg-gradient-to-r from-mansagold to-amber-500 hover:from-mansagold/90 hover:to-amber-500/90 text-slate-900 font-semibold gap-2"
      >
        <DollarSign className="w-4 h-4" />
        Contribute ${contributionAmount}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-mansagold" />
              Confirm Contribution
            </DialogTitle>
            <DialogDescription>
              Your contribution will be held in secure escrow until payout.
            </DialogDescription>
          </DialogHeader>

          {success ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Contribution Successful!</h3>
              <p className="text-slate-400">Your funds are now held in secure escrow.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Circle</span>
                    <span className="text-white font-medium">{circleName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Round</span>
                    <span className="text-white font-medium">#{currentRound}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Amount</span>
                    <span className="text-mansagold font-bold text-lg">${contributionAmount}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-blue-400 text-sm flex items-start gap-2">
                    <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Funds are held in patent-protected digital escrow until all members contribute 
                      and the payout recipient is determined. A 1.5% platform fee applies at payout.
                    </span>
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => contributeMutation.mutate()}
                  disabled={contributeMutation.isPending}
                  className="bg-mansagold hover:bg-mansagold/90 text-slate-900"
                >
                  {contributeMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4 mr-2" />
                      Confirm Contribution
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContributeButton;
