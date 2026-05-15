import React from 'react';
import { BusinessImportDashboard } from '@/components/admin/import/BusinessImportDashboard';
import { GeocodeBusinessesPanel } from '@/components/admin/GeocodeBusinessesPanel';
import RequireAdmin from '@/components/auth/RequireAdmin';
import { Helmet } from 'react-helmet-async';

const AdminBusinessImport: React.FC = () => {
  return (
    <RequireAdmin>
      <Helmet>
        <title>Business Import - Admin Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#050a18] to-[#030712] p-6 space-y-6">
        <GeocodeBusinessesPanel />
        <BusinessImportDashboard />
      </div>
    </RequireAdmin>
  );
};

export default AdminBusinessImport;
