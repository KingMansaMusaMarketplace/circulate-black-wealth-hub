import React from 'react';
import { BusinessImportDashboard } from '@/components/admin/import/BusinessImportDashboard';
import RequireAdmin from '@/components/auth/RequireAdmin';
import { Helmet } from 'react-helmet-async';

// This page uses RequireAdmin for the auth/admin check - no duplicate verification needed
const AdminBusinessImport: React.FC = () => {
  return (
    <RequireAdmin>
      <Helmet>
        <title>Business Import - Admin Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 p-6">
        <BusinessImportDashboard />
      </div>
    </RequireAdmin>
  );
};

export default AdminBusinessImport;
