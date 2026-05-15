import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Ban, RefreshCcw, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  bookingId: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved: () => void;
}

const fmt = (n: number) =>
  Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const BookingActionsDialog: React.FC<Props> = ({ bookingId, open, onOpenChange, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [booking, setBooking] = useState<any>(null);

  const [cancelReason, setCancelReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (!open || !bookingId) return;
    setLoading(true);
    supabase
      .from('vacation_bookings')
      .select('*')
      .eq('id', bookingId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          toast.error('Failed to load booking');
          onOpenChange(false);
          return;
        }
        setBooking(data);
        setRefundAmount(String(data.total_amount ?? ''));
        setAdminNotes(data.admin_notes ?? '');
        setCancelReason(data.cancellation_reason ?? '');
        setRefundReason('');
        setLoading(false);
      });
  }, [open, bookingId]);

  if (!bookingId) return null;

  const cancelBooking = async () => {
    if (!cancelReason.trim()) {
      toast.error('Provide a cancellation reason');
      return;
    }
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('vacation_bookings')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: cancelReason,
        cancelled_by: user?.id ?? null,
      })
      .eq('id', bookingId);
    setBusy(false);
    if (error) return toast.error('Cancel failed: ' + error.message);
    toast.success('Booking cancelled');
    onSaved();
    onOpenChange(false);
  };

  const issueRefund = async () => {
    const amt = parseFloat(refundAmount);
    if (!amt || amt <= 0) return toast.error('Enter a valid refund amount');
    setBusy(true);
    const { error } = await supabase
      .from('vacation_bookings')
      .update({
        refund_amount: amt,
        refund_status: 'refunded',
        admin_notes: refundReason
          ? `${booking.admin_notes ? booking.admin_notes + '\n' : ''}[Refund ${new Date().toLocaleDateString()}] ${refundReason}`
          : booking.admin_notes,
      })
      .eq('id', bookingId);
    setBusy(false);
    if (error) return toast.error('Refund failed: ' + error.message);
    toast.success(`Marked ${fmt(amt)} as refunded`);
    onSaved();
    onOpenChange(false);
  };

  const markCompleted = async () => {
    setBusy(true);
    const { error } = await supabase
      .from('vacation_bookings')
      .update({ status: 'completed' })
      .eq('id', bookingId);
    setBusy(false);
    if (error) return toast.error('Update failed: ' + error.message);
    toast.success('Marked as completed');
    onSaved();
    onOpenChange(false);
  };

  const saveNotes = async () => {
    setBusy(true);
    const { error } = await supabase
      .from('vacation_bookings')
      .update({ admin_notes: adminNotes })
      .eq('id', bookingId);
    setBusy(false);
    if (error) return toast.error('Save failed: ' + error.message);
    toast.success('Notes saved');
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-black border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Booking Actions</DialogTitle>
          <DialogDescription className="text-white/60">
            {booking ? `${booking.guest_name || booking.guest_email} · ${booking.check_in_date} → ${booking.check_out_date} · ${fmt(Number(booking.total_amount))}` : ''}
          </DialogDescription>
        </DialogHeader>

        {loading || !booking ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-mansagold" />
          </div>
        ) : (
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="notes"><FileText className="h-4 w-4 mr-1" />Notes</TabsTrigger>
              <TabsTrigger value="cancel" disabled={booking.status === 'cancelled'}>
                <Ban className="h-4 w-4 mr-1" />Cancel
              </TabsTrigger>
              <TabsTrigger value="refund"><RefreshCcw className="h-4 w-4 mr-1" />Refund</TabsTrigger>
              <TabsTrigger value="complete" disabled={booking.status === 'completed' || booking.status === 'cancelled'}>
                <CheckCircle2 className="h-4 w-4 mr-1" />Complete
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="mt-4 space-y-3">
              <Label className="text-white/70">Internal admin notes (not visible to guest or host)</Label>
              <textarea
                rows={6}
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm"
                placeholder="Add notes about this booking…"
              />
              <div className="flex justify-end">
                <Button onClick={saveNotes} disabled={busy}>
                  {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Save Notes
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="cancel" className="mt-4 space-y-3">
              <div className="rounded-md bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-200">
                Cancelling sets status to "cancelled". Issue a refund separately under the Refund tab.
              </div>
              <Label className="text-white/70">Cancellation reason</Label>
              <textarea
                rows={4}
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm"
                placeholder="Why is this being cancelled?"
              />
              <div className="flex justify-end">
                <Button variant="destructive" onClick={cancelBooking} disabled={busy}>
                  {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  <Ban className="h-4 w-4 mr-1" /> Cancel Booking
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="refund" className="mt-4 space-y-3">
              <div className="rounded-md bg-yellow-500/10 border border-yellow-500/30 p-3 text-xs text-yellow-200">
                This records the refund in our system. Process the actual money refund in Stripe separately.
              </div>
              {booking.refund_status === 'refunded' && (
                <div className="rounded-md bg-blue-500/10 border border-blue-500/30 p-3 text-xs text-blue-200">
                  Already refunded {fmt(Number(booking.refund_amount || 0))}. Submitting again will overwrite.
                </div>
              )}
              <div>
                <Label className="text-white/70">Refund Amount (USD)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={refundAmount}
                  onChange={e => setRefundAmount(e.target.value)}
                />
                <p className="text-xs text-white/40 mt-1">Booking total: {fmt(Number(booking.total_amount))}</p>
              </div>
              <div>
                <Label className="text-white/70">Reason / Notes</Label>
                <Input
                  value={refundReason}
                  onChange={e => setRefundReason(e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={issueRefund} disabled={busy}>
                  {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  <RefreshCcw className="h-4 w-4 mr-1" /> Record Refund
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="complete" className="mt-4 space-y-3">
              <div className="rounded-md bg-green-500/10 border border-green-500/30 p-3 text-xs text-green-200">
                Mark this booking as completed (guest checked out). This makes it eligible for host payout.
              </div>
              <div className="flex justify-end">
                <Button onClick={markCompleted} disabled={busy}>
                  {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Mark Completed
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingActionsDialog;
