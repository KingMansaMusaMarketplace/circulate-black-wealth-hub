
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard';
import { QrCode } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { QRCodeTabs } from '@/components/business/qr-code';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import { Card, CardContent } from '@/components/ui/card';

const QRCodeManagementPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile: business, loading: businessLoading } = useBusinessProfile();
  const [activeTab, setActiveTab] = useState('generate');
  
  // Mock QR codes for demo purposes
  const [qrCodes, setQrCodes] = useState([
    {
      id: '1',
      business_id: '123',
      code_type: 'loyalty' as const,
      points_value: 10,
      is_active: true,
      current_scans: 45,
      qr_image_url: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MansaLoyalty10',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      business_id: '123',
      code_type: 'discount' as const,
      discount_percentage: 15,
      is_active: true,
      current_scans: 23,
      expiration_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      qr_image_url: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MansaDiscount15',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      business_id: '123',
      code_type: 'info' as const,
      is_active: false,
      current_scans: 12,
      qr_image_url: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MansaInfo',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);
  
  // Mock scan metrics for demo purposes
  const scanMetrics = {
    totalScans: 80,
    uniqueCustomers: 42,
    totalPointsAwarded: 650,
    averagePointsPerScan: 8.1
  };

  // Loading state
  if (authLoading || businessLoading) {
    return (
      <DashboardLayout title="QR Code Management" location="">
        <Card>
          <CardContent className="py-10">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mansablue"></div>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Redirect if not a business user
  if (!business) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <DashboardLayout title="QR Code Management" icon={<QrCode className="mr-2 h-5 w-5" />}>
      <div className="space-y-6">
        <QRCodeTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          qrCodes={qrCodes}
          scanMetrics={scanMetrics}
        />
      </div>
    </DashboardLayout>
  );
};

export default QRCodeManagementPage;
