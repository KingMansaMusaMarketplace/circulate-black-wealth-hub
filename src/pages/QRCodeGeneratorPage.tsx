
import React from 'react';
import { Helmet } from 'react-helmet';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/dashboard';
import QRCodeManagementPage from './QRCodeManagementPage';
import { Loader2, QrCode } from 'lucide-react';

const QRCodeGeneratorPage = () => {
  const { user, userType, loading, authInitialized } = useAuth();

  // Show loading while auth is initializing
  if (loading || !authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-mansablue" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to regular dashboard if not a business user
  if (userType !== 'business') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Helmet>
        <title>QR Code Generator | Mansa Musa Marketplace</title>
        <meta name="description" content="Generate and manage QR codes for your business" />
      </Helmet>
      
      <DashboardLayout title="QR Code Management" icon={<QrCode className="h-6 w-6" />}>
        <QRCodeManagementPage />
      </DashboardLayout>
    </>
  );
};

export default QRCodeGeneratorPage;
