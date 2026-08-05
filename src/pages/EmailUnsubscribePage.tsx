import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Loader2, MailX } from 'lucide-react';

const EmailUnsubscribePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  const [status, setStatus] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const unsubscribe = async (value: string) => {
    setStatus('working');
    const { data, error } = await supabase.rpc('claim_email_unsubscribe', { p_email: value });
    const result = data as { success: boolean; error?: string } | null;
    if (error || !result?.success) {
      setStatus('error');
      setMessage(result?.error || error?.message || 'We could not process that request.');
      return;
    }
    setStatus('done');
    setMessage('');
  };

  useEffect(() => {
    const preset = searchParams.get('email');
    if (preset) unsubscribe(preset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>Unsubscribe | 1325.AI</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
              {status === 'done'
                ? <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                : <MailX className="w-7 h-7 text-muted-foreground" />}
            </div>
            <CardTitle>{status === 'done' ? "You're unsubscribed" : 'Unsubscribe from 1325.AI emails'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === 'done' ? (
              <p className="text-sm text-muted-foreground text-center">
                We removed your address from our directory outreach list. You will not receive further emails from us.
              </p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground text-center">
                  Enter your email address and we will stop contacting you.
                </p>
                <Input
                  type="email"
                  value={email}
                  placeholder="you@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {status === 'error' && <p className="text-sm text-destructive text-center">{message}</p>}
                <Button className="w-full" disabled={status === 'working' || !email} onClick={() => unsubscribe(email)}>
                  {status === 'working' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Unsubscribe
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EmailUnsubscribePage;
