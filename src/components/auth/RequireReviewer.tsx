import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShieldAlert } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';
import { Button } from '@/components/ui/button';

/** Server-checked: lets admins OR business reviewers in. */
export function useCanReviewBusinesses() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['can-review-businesses', user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase.rpc as any)('can_review_businesses');
      if (error) throw error;
      return data === true;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

const RequireReviewer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, authInitialized } = useAuth();
  const location = useLocation();
  const { data: allowed, isLoading } = useCanReviewBusinesses();

  if (!authInitialized || loading || (user && isLoading)) {
    return <Loading fullScreen text="Checking access..." />;
  }
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-destructive mb-4">Access Required</h1>
          <p className="mb-6 text-muted-foreground">This page is only for the business review team.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export default RequireReviewer;
