import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useServerAdminVerification } from '@/hooks/useServerAdminVerification';
import Loading from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

interface RequireAdminProps {
  children: React.ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Server-side admin verification - this is the secure check
  const { isAdmin, isVerifying, error } = useServerAdminVerification();

  // Show loading while checking authentication or admin status
  if (loading || isVerifying) {
    return <Loading fullScreen text="Verifying admin access..." />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show error state if verification failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-destructive mb-4">Verification Error</h1>
          <p className="mb-6 text-muted-foreground">
            Unable to verify your admin access. Please try again later or contact support.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="mr-2"
          >
            Retry
          </Button>
          <Button 
            onClick={() => window.history.back()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Server-side verified: user is NOT an admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-destructive mb-4">Admin Access Required</h1>
          <p className="mb-6 text-muted-foreground">
            This area is restricted to administrators only. Please contact support if you believe this is an error.
          </p>
          <Button 
            onClick={() => window.history.back()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Server-side verified: user IS an admin
  return <>{children}</>;
};

export default RequireAdmin;