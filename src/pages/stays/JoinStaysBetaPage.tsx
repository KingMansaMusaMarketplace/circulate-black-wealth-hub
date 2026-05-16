import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Home } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';

const JoinStaysBetaPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!user) { toast.error('Please sign in first'); navigate('/login?redirect=/stays/join-beta'); return; }
    if (!code.trim()) { toast.error('Enter your beta code'); return; }
    setLoading(true);

    // Look up by code
    const { data: tester, error } = await supabase
      .from('stays_beta_testers' as any)
      .select('id, email, status, user_id')
      .eq('beta_code', code.trim().toUpperCase())
      .maybeSingle();

    if (error || !tester) { setLoading(false); toast.error('Invalid beta code'); return; }
    if ((tester as any).user_id && (tester as any).user_id !== user.id) {
      setLoading(false); toast.error('This code is already in use by another account'); return;
    }

    const { data: ok } = await supabase.rpc('activate_stays_beta_tester' as any, {
      p_email: (tester as any).email,
      p_user_id: user.id,
    });

    if (ok) {
      toast.success('Welcome to the Mansa Stays beta!');
      navigate('/stays');
    } else {
      // Already active or expired — just link the user if not linked
      if (!(tester as any).user_id) {
        await supabase.from('stays_beta_testers' as any)
          .update({ user_id: user.id, status: 'active', signed_up_at: new Date().toISOString() } as any)
          .eq('id', (tester as any).id);
        toast.success('Linked! Welcome to Mansa Stays beta.');
        navigate('/stays');
      } else {
        toast.success('Your beta access is already active.');
        navigate('/stays');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-gray-900 border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-mansagold/20 flex items-center justify-center mb-3">
            <Home className="h-7 w-7 text-mansagold" />
          </div>
          <CardTitle className="text-white text-2xl">Join the Mansa Stays Beta</CardTitle>
          <CardDescription>Enter the beta code from your invite email to unlock early access.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="XXXXXXXX"
            className="bg-gray-800 border-gray-600 text-white font-mono text-center tracking-widest text-lg uppercase"
            maxLength={12}
          />
          <Button onClick={submit} disabled={loading} className="w-full bg-mansagold text-black hover:bg-mansagold/90">
            {loading ? 'Activating...' : 'Activate Access'}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Don't have a code? <Link to="/contact" className="text-mansagold underline">Request an invite</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinStaysBetaPage;
