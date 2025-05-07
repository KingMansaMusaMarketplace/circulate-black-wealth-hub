
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import { QrCode } from 'lucide-react';
import { QRCodeTabs } from '@/components/business/qr-code';

const QRCodeManagementPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile: business, loading: profileLoading } = useBusinessProfile();
  const [activeTab, setActiveTab] = useState('generate');
  
  // Mock QR code data for demonstration
  const [qrCodes, setQrCodes] = useState([
    {
      id: '1',
      type: 'loyalty',
      pointsValue: 10,
      scanLimit: 100,
      currentScans: 37,
      createdAt: '2023-04-10',
      expirationDate: '2023-05-10',
      isActive: true
    },
    {
      id: '2',
      type: 'discount',
      discountPercentage: 15,
      scanLimit: 50,
      currentScans: 23,
      createdAt: '2023-04-08',
      expirationDate: '2023-05-08',
      isActive: true
    },
    {
      id: '3',
      type: 'info',
      scanLimit: null,
      currentScans: 15,
      createdAt: '2023-04-05',
      expirationDate: null,
      isActive: true
    },
    {
      id: '4',
      type: 'loyalty',
      pointsValue: 5,
      scanLimit: 200,
      currentScans: 200,
      createdAt: '2023-03-15',
      expirationDate: '2023-04-15',
      isActive: false
    }
  ]);
  
  const [scanMetrics, setScanMetrics] = useState({
    totalScans: 275,
    uniqueCustomers: 152,
    totalPointsAwarded: 2380,
    averagePointsPerScan: 8.7
  });
  
  // Show loading state
  if (authLoading || profileLoading) {
    return (
      <DashboardLayout title="QR Code Management" location="">
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <DashboardLayout 
      title="QR Code Management" 
      icon={<QrCode className="mr-2 h-5 w-5" />}
    >
      <QRCodeTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        qrCodes={qrCodes}
        scanMetrics={scanMetrics}
      />
    </DashboardLayout>
  );
};

export default QRCodeManagementPage;
