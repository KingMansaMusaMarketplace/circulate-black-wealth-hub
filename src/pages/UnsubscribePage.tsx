import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MailX, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type Status = 'loading' | 'valid' | 'invalid' | 'confirming' | 'success' | 'error';

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    const validateToken = async () => {
      try {
        const supabaseUrl = (supabase as any).supabaseUrl || import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = (supabase as any).supabaseKey || import.meta.env.VITE_SUPABASE_ANON_KEY;
        const response = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: supabaseKey } }
        );
        if (response.ok) {
          setStatus('valid');
        } else {
          setStatus('invalid');
        }
      } catch {
        setStatus('invalid');
      }
    };

    validateToken();
  }, [token]);

  const handleUnsubscribe = async () => {
    setStatus('confirming');
    try {
      const { error } = await supabase.functions.invoke('handle-email-unsubscribe', {
        body: { token },
      });
      if (error) {
        setErrorMsg('Something went wrong. Please try again.');
        setStatus('error');
      } else {
        setStatus('success');
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {status === 'success' ? (
              <CheckCircle className="h-12 w-12 text-green-500" />
            ) : status === 'error' || status === 'invalid' ? (
              <AlertCircle className="h-12 w-12 text-destructive" />
            ) : (
              <MailX className="h-12 w-12 text-primary" />
            )}
          </div>
          <CardTitle className="text-xl">
            {status === 'loading' && 'Verifying...'}
            {status === 'valid' && 'Unsubscribe from Emails'}
            {status === 'invalid' && 'Invalid Link'}
            {status === 'confirming' && 'Processing...'}
            {status === 'success' && 'Unsubscribed'}
            {status === 'error' && 'Error'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
          )}
          {status === 'valid' && (
            <>
              <p className="text-muted-foreground">
                Click below to stop receiving transactional emails from us.
              </p>
              <Button onClick={handleUnsubscribe} variant="destructive">
                Confirm Unsubscribe
              </Button>
            </>
          )}
          {status === 'invalid' && (
            <p className="text-muted-foreground">
              This unsubscribe link is invalid or has already been used.
            </p>
          )}
          {status === 'confirming' && (
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
          )}
          {status === 'success' && (
            <p className="text-muted-foreground">
              You have been successfully unsubscribed and will no longer receive these emails.
            </p>
          )}
          {status === 'error' && (
            <p className="text-destructive">{errorMsg}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UnsubscribePage;
