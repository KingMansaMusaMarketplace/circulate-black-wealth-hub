
import React from 'react';
import { QRCodeAnalyticsContent } from './QRCodeAnalytics';

interface QRCodeAnalyticsTabProps {
  metrics: {
    totalScans: number;
    uniqueCustomers: number;
    totalPointsAwarded: number;
    averagePointsPerScan: number;
  };
}

export const QRCodeAnalyticsTab: React.FC<QRCodeAnalyticsTabProps> = ({ metrics }) => {
  return <QRCodeAnalyticsContent metrics={metrics} />;
};
