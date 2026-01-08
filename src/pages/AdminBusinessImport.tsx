import React from 'react';
import { Navigate } from 'react-router-dom';
import { BusinessImportDashboard } from '@/components/admin/import/BusinessImportDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useServerAdminVerification } from '@/hooks/useServerAdminVerification';
import Loading from '@/components/ui/loading';

const AdminBusinessImport: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isVerifying } = useServerAdminVerification();

  // Wait for auth to load
  if (authLoading || isVerifying) {
    return <Loading fullScreen text="Verifying access..." />;
  }

  // Redirect non-authenticated or non-admin users
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 p-6">
      <BusinessImportDashboard />
    </div>
  );
};

export default AdminBusinessImport;
