import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Send, CheckCircle, Building2, User, Mail, Phone, Users, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const inputTransition = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.25 },
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto p-0 gap-0 bg-gradient-to-b from-background to-muted/30 border border-border/60 shadow-2xl">
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center text-center px-8 py-14"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-mansagold/20 rounded-full blur-xl" />
                <CheckCircle className="relative w-16 h-16 text-mansagold" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-3">Inquiry received</h3>
              <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Our partnership team will review your briefing request and reply within two business days. A confirmation email has been sent to you.
              </p>
              <Button
                className="mt-8 bg-gradient-to-r from-mansagold to-mansagold-dark text-mansablue-dark hover:brightness-110 font-semibold px-8"
                onClick={() => close(false)}
              >
                Close
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="px-8 pt-8 pb-6">
                <DialogHeader className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-mansablue to-mansablue-dark text-white shadow-lg">
                      <HandshakeIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <Badge variant="outline" className="text-xs font-medium border-mansagold/40 text-mansagold-dark bg-mansagold/10">
                        Partnership Briefing
                      </Badge>
                    </div>
                  </div>
                  <DialogTitle className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                    Request a Partnership Briefing
                  </DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground leading-relaxed">
                    Tell us about your organization and the work you want the 42 Agentic AI Employees to handle. This goes directly to{' '}
                    <a href={`mailto:${PARTNER_EMAIL}`} className="font-medium text-mansagold-dark hover:underline underline-offset-4">
                      {PARTNER_EMAIL}
                    </a>.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <Separator className="opacity-50" />

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <motion.div className="space-y-2" {...inputTransition}>
                    <Label htmlFor="pi-name" className="flex items-center gap-2 text-sm font-semibold">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      Full name
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="pi-name"
                      required
                      placeholder="e.g. Bishop Thomas D. Bowling"
                      value={form.name}
                      onChange={update('name')}
                      className="h-11 bg-background"
                    />
                  </motion.div>
                  <motion.div className="space-y-2" {...inputTransition} transition={{ duration: 0.25, delay: 0.05 }}>
                    <Label htmlFor="pi-org" className="flex items-center gap-2 text-sm font-semibold">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                      Organization
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="pi-org"
                      required
                      placeholder="e.g. AAMES Church Network"
                      value={form.organization}
                      onChange={update('organization')}
                      className="h-11 bg-background"
                    />
                  </motion.div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <motion.div className="space-y-2" {...inputTransition} transition={{ duration: 0.25, delay: 0.1 }}>
                    <Label htmlFor="pi-email" className="flex items-center gap-2 text-sm font-semibold">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      Work email
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="pi-email"
                      type="email"
                      required
                      placeholder="you@organization.org"
                      value={form.email}
                      onChange={update('email')}
                      className="h-11 bg-background"
                    />
                  </motion.div>
                  <motion.div className="space-y-2" {...inputTransition} transition={{ duration: 0.25, delay: 0.15 }}>
                    <Label htmlFor="pi-phone" className="flex items-center gap-2 text-sm font-semibold">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      Phone number
                    </Label>
                    <Input
                      id="pi-phone"
                      type="tel"
                      placeholder="(404) 555-0192"
                      value={form.phone}
                      onChange={update('phone')}
                      className="h-11 bg-background"
                    />
                  </motion.div>
                </div>

                <motion.div className="space-y-2" {...inputTransition} transition={{ duration: 0.25, delay: 0.2 }}>
                  <Label htmlFor="pi-members" className="flex items-center gap-2 text-sm font-semibold">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    Members / network size
                  </Label>
                  <Input
                    id="pi-members"
                    placeholder="e.g. 2,500 members across 40 sites"
                    value={form.memberCount}
                    onChange={update('memberCount')}
                    className="h-11 bg-background"
                  />
                  <p className="text-xs text-muted-foreground">Helps us size the right agentic workforce for your network.</p>
                </motion.div>

                <motion.div className="space-y-2" {...inputTransition} transition={{ duration: 0.25, delay: 0.25 }}>
                  <Label htmlFor="pi-message" className="flex items-center gap-2 text-sm font-semibold">
                    <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                    What work keeps falling through the cracks?
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="pi-message"
                    required
                    rows={4}
                    placeholder="Describe the biggest operational gaps — grant writing, member follow-up, communications, events, compliance, etc."
                    value={form.message}
                    onChange={update('message')}
                    className="bg-background resize-none"
                  />
                </motion.div>

                <motion.div className="pt-2" {...inputTransition} transition={{ duration: 0.25, delay: 0.3 }}>
                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-mansagold to-mansagold-dark text-mansablue-dark hover:brightness-110 shadow-lg shadow-mansagold/20 transition-all"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending your inquiry…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send partnership inquiry
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>

                <motion.div
                  className="flex items-start gap-3 rounded-lg bg-muted/50 p-4"
                  {...inputTransition}
                  transition={{ duration: 0.25, delay: 0.35 }}
                >
                  <ShieldCheck className="w-5 h-5 text-mansagold-dark mt-0.5 shrink-0" />
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Private & confidential.</span> Your information is encrypted in transit, stored securely, and only shared with our partnership team. We never sell your data.
                  </div>
                </motion.div>

                <p className="text-xs text-muted-foreground text-center">
                  Prefer to write directly? Email us at{' '}
                  <a href={`mailto:${PARTNER_EMAIL}`} className="font-medium text-mansagold-dark hover:underline underline-offset-4">
                    {PARTNER_EMAIL}
                  </a>
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

// Inline helper icon for the dialog header so we do not depend on a Lucide name that may be missing.
const HandshakeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m11 17 2 2a1 1 0 1 0 3-3" />
    <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.5-3.5" />
    <path d="M2 11l2.5-2.5a1 1 0 1 1 3 3L5 11" />
    <path d="m4 10 3-3 3 3" />
    <path d="m7 7 9 9" />
    <path d="M3 21h18" />
  </svg>
);

export default PartnershipInquiryDialog;
