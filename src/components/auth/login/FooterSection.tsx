
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import PasswordResetForm from '@/components/auth/forms/PasswordResetForm';
import { Gift, Mail, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const FooterSection: React.FC = () => {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleResend = async () => {
    const email = resendEmail.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: `${window.location.origin}/email-verified` },
      });
      if (error) throw error;
      toast.success('Verification email sent! Check your inbox (and spam folder).');
      setCooldown(60);
    } catch (e: any) {
      const msg = e?.message || 'Failed to resend verification email.';
      if (msg.toLowerCase().includes('already')) {
        toast.info('This email is already verified — try signing in.');
      } else {
        toast.error(msg);
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      {/* Beta Code CTA */}
      <Link
        to="/business-signup?beta=true"
        className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-mansagold/40 bg-mansagold/5 hover:bg-mansagold/10 transition-colors duration-300 group"
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-mansagold/20 flex items-center justify-center group-hover:bg-mansagold/30 transition-colors">
          <Gift className="w-4 h-4 text-mansagold" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-mansagold">Have a beta code?</p>
          <p className="text-xs text-slate-400">Create your free business account in under 2 minutes</p>
        </div>
      </Link>

      <Separator className="my-4 bg-white/10" />
      
      <motion.div 
        className="text-center space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="space-y-2">
          <p className="text-slate-300">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-mansagold hover:text-amber-300 transition-colors duration-300 font-semibold"
            >
              Sign up
            </Link>
          </p>
          
          <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <DialogTrigger asChild>
              <button className="text-sm text-slate-400 hover:text-mansablue transition-colors duration-300 font-medium">
                Forgot your password?
              </button>
            </DialogTrigger>
            <DialogContent className="p-0 border-0 bg-transparent shadow-none">
              <PasswordResetForm onBack={() => setShowResetDialog(false)} />
            </DialogContent>
          </Dialog>

          <button
            type="button"
            onClick={() => setShowResend((v) => !v)}
            className="text-sm text-slate-400 hover:text-mansablue transition-colors duration-300 font-medium block mx-auto"
          >
            <Mail className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5" />
            Didn't get a verification email?
          </button>

          {showResend && (
            <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10 space-y-2 animate-fade-in">
              <p className="text-xs text-slate-400 text-left">
                Check spam first, or resend it below.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  disabled={resending || cooldown > 0}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 text-sm h-9"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleResend}
                  disabled={resending || cooldown > 0}
                  className="bg-mansagold hover:bg-mansagold/90 text-mansablue font-semibold whitespace-nowrap"
                >
                  {resending ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : cooldown > 0 ? (
                    `Wait ${cooldown}s`
                  ) : (
                    'Resend'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500">
          By signing in, you're joining a movement to circulate wealth in the Black community.
        </p>
      </motion.div>
    </>
  );
};
