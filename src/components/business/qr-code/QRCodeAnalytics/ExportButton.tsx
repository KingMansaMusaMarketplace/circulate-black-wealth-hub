
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

interface ExportButtonProps {
  data: any[];
  metrics: any;
  timePeriod: string;
  businessName?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  metrics,
  timePeriod,
  businessName = 'Your Business'
}) => {
  const getTimePeriodLabel = () => {
    switch (timePeriod) {
      case '7days': return 'Last 7 Days';
      case '30days': return 'Last 30 Days';
      case '90days': return 'Last 90 Days';
      case 'all': return 'All Time';
      default: return 'Last 7 Days';
    }
  };
  
  const exportToCSV = () => {
    try {
      // Format metrics summary
      const summary = [
        `QR Code Analytics - ${businessName}`,
        `Time Period: ${getTimePeriodLabel()}`,
        `Generated: ${new Date().toLocaleString()}`,
        ``,
        `Summary Metrics:`,
        `Total Scans,${metrics.totalScans}`,
        `Unique Customers,${metrics.uniqueCustomers}`,
        `Total Points Awarded,${metrics.totalPointsAwarded}`,
        `Average Points Per Scan,${metrics.averagePointsPerScan}`,
        ``,
        `Scan Data:`,
        `Date,Number of Scans`
      ];
      
      // Add scan data rows
      const rows = data.map(item => `${item.name},${item.scans}`);
      
      // Combine all rows
      const csvContent = [...summary, ...rows].join('\n');
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `qr-analytics-${timePeriod}-${new Date().toISOString().split('T')[0]}.csv`);
      
      toast.success('Analytics data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export analytics data');
    }
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={exportToCSV}
      className="flex items-center gap-1"
    >
      <Download className="h-4 w-4 mr-1" />
      Export
    </Button>
  );
};

export default ExportButton;
