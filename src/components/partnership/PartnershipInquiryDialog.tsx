import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Send, CheckCircle } from 'lucide-react';

const PARTNER_EMAIL = 'Partner@1325.AI';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic?: string;
}

const PartnershipInquiryDialog: React.FC<Props> = ({ open, onOpenChange, topic = 'Enterprise Partnership Inquiry' }) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    memberCount: '',
    message: '',
  });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-partnership-inquiry', {
        body: { ...form, topic },
      });

      if (error) {
        let details = error.message;
        try {
          const ctx = (error as unknown as { context?: Response }).context;
          if (ctx) details = await ctx.text();
        } catch {
          /* ignore */
        }
        console.error('send-partnership-inquiry failed:', details);
        throw new Error(details);
      }

      if (data && (data as { error?: string }).error) {
        throw new Error((data as { error: string }).error);
      }

      setSent(true);
      toast.success('Your inquiry was sent to our partnership team.');
    } catch (err) {
      console.error(err);
      toast.error(`We could not send that. Please email ${PARTNER_EMAIL} directly.`);
    } finally {
      setSending(false);
    }
  };

  const close = (value: boolean) => {
    onOpenChange(value);
    if (!value) setTimeout(() => setSent(false), 300);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {sent ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-mansagold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Inquiry sent</h3>
            <p className="text-muted-foreground text-sm">
              Our partnership team will reply within two business days. We also sent you a confirmation email.
            </p>
            <Button className="mt-6" onClick={() => close(false)}>Close</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Request a Partnership Briefing</DialogTitle>
              <DialogDescription>
                Tell us about your organization. This goes straight to {PARTNER_EMAIL}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pi-name">Your name *</Label>
                  <Input id="pi-name" required value={form.name} onChange={update('name')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pi-org">Organization *</Label>
                  <Input id="pi-org" required value={form.organization} onChange={update('organization')} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pi-email">Email *</Label>
                  <Input id="pi-email" type="email" required value={form.email} onChange={update('email')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pi-phone">Phone</Label>
                  <Input id="pi-phone" value={form.phone} onChange={update('phone')} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pi-members">Members / network size</Label>
                <Input id="pi-members" placeholder="e.g. 2,500 members across 40 sites" value={form.memberCount} onChange={update('memberCount')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pi-message">What work keeps falling through the cracks? *</Label>
                <Textarea id="pi-message" required rows={4} value={form.message} onChange={update('message')} />
              </div>
              <Button type="submit" disabled={sending} className="w-full">
                {sending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…</>
                ) : (
                  <><Send className="w-4 h-4 mr-2" /> Send inquiry</>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Prefer email? Write to {PARTNER_EMAIL}.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PartnershipInquiryDialog;
