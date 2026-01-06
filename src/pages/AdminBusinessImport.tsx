import React from 'react';
import { BusinessImportDashboard } from '@/components/admin/import/BusinessImportDashboard';

const AdminBusinessImport: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 p-6">
      <BusinessImportDashboard />
    </div>
  );
};

export default AdminBusinessImport;
