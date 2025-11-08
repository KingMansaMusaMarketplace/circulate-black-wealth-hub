import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Download, FileText, FileSpreadsheet, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  exportReferralsToCSV,
  exportCommissionsToCSV,
  exportPaymentsToCSV,
  exportToPDF
} from '@/lib/utils/export-utils';

interface ExportReportsProps {
  referrals: any[];
  commissions: any[];
  payments: any[];
  agentName: string;
  agentCode: string;
}

const ExportReports: React.FC<ExportReportsProps> = ({
  referrals,
  commissions,
  payments,
  agentName,
  agentCode
}) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const filterDataByDateRange = (data: any[], dateField: string) => {
    if (!startDate || !endDate) return data;
    
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  const handleExportReferralsCSV = () => {
    const filteredData = filterDataByDateRange(referrals, 'referral_date');
    
    if (filteredData.length === 0) {
      toast.error('No referrals found in the selected date range');
      return;
    }

    exportReferralsToCSV(filteredData, { startDate, endDate, agentName, agentCode });
    toast.success('Referrals exported to CSV successfully');
  };

  const handleExportCommissionsCSV = () => {
    const filteredData = filterDataByDateRange(commissions, 'due_date');
    
    if (filteredData.length === 0) {
      toast.error('No commissions found in the selected date range');
      return;
    }

    exportCommissionsToCSV(filteredData, { startDate, endDate, agentName, agentCode });
    toast.success('Commissions exported to CSV successfully');
  };

  const handleExportPaymentsCSV = () => {
    const filteredData = filterDataByDateRange(payments, 'created_at');
    
    if (filteredData.length === 0) {
      toast.error('No payments found in the selected date range');
      return;
    }

    exportPaymentsToCSV(filteredData, { startDate, endDate, agentName, agentCode });
    toast.success('Payments exported to CSV successfully');
  };

  const handleExportComprehensivePDF = () => {
    const filteredReferrals = filterDataByDateRange(referrals, 'referral_date');
    const filteredCommissions = filterDataByDateRange(commissions, 'due_date');
    const filteredPayments = filterDataByDateRange(payments, 'created_at');

    if (
      filteredReferrals.length === 0 &&
      filteredCommissions.length === 0 &&
      filteredPayments.length === 0
    ) {
      toast.error('No data found in the selected date range');
      return;
    }

    exportToPDF(
      {
        referrals: filteredReferrals,
        commissions: filteredCommissions,
        payments: filteredPayments
      },
      { startDate, endDate, agentName, agentCode }
    );
    toast.success('Comprehensive report exported to PDF successfully');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Reports
        </CardTitle>
        <CardDescription>
          Download your referral and commission data for accounting purposes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Range Selection */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Start Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !startDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>End Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !endDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => startDate ? date < startDate : false}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {startDate && endDate && (
          <div className="text-sm text-muted-foreground">
            Exporting data from {format(startDate, 'MMM dd, yyyy')} to{' '}
            {format(endDate, 'MMM dd, yyyy')}
          </div>
        )}

        {/* Export Buttons */}
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Button
              variant="outline"
              onClick={handleExportReferralsCSV}
              className="w-full"
              disabled={referrals.length === 0}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Referrals (CSV)
            </Button>

            <Button
              variant="outline"
              onClick={handleExportCommissionsCSV}
              className="w-full"
              disabled={commissions.length === 0}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Commissions (CSV)
            </Button>

            <Button
              variant="outline"
              onClick={handleExportPaymentsCSV}
              className="w-full"
              disabled={payments.length === 0}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Payments (CSV)
            </Button>

            <Button
              onClick={handleExportComprehensivePDF}
              className="w-full"
              disabled={
                referrals.length === 0 &&
                commissions.length === 0 &&
                payments.length === 0
              }
            >
              <FileText className="mr-2 h-4 w-4" />
              Export Full Report (PDF)
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-md">
          <p className="font-medium mb-1">Export Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Select date range to filter data (optional)</li>
            <li>CSV files can be opened in Excel or Google Sheets</li>
            <li>PDF report includes all data types in one document</li>
            <li>All exports include only your data</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportReports;
