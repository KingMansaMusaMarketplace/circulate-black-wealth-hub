import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Table, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExportReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExportReportsDialog: React.FC<ExportReportsDialogProps> = ({ open, onOpenChange }) => {
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [exporting, setExporting] = useState(false);
  const [selectedReports, setSelectedReports] = useState<string[]>(['users']);

  const reportTypes = [
    { id: 'users', label: 'Users Report', description: 'All registered users' },
    { id: 'businesses', label: 'Businesses Report', description: 'All registered businesses' },
    { id: 'transactions', label: 'Transactions Report', description: 'Financial transactions' },
    { id: 'agents', label: 'Sales Agents Report', description: 'Agent performance data' },
    { id: 'activity', label: 'Activity Log', description: 'Platform activity history' },
  ];

  const toggleReport = (id: string) => {
    setSelectedReports(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const exportData = async () => {
    if (selectedReports.length === 0) {
      toast.error('Please select at least one report to export');
      return;
    }

    setExporting(true);

    try {
      for (const reportId of selectedReports) {
        let data: any[] = [];
        let filename = '';

        switch (reportId) {
          case 'users':
            const { data: users } = await supabase.from('profiles')
              .select('id, full_name, email, user_type, role, is_verified, created_at, updated_at, city, state, total_points');
            data = users || [];
            filename = 'users-report';
            break;
          case 'businesses':
            const { data: businesses } = await supabase.from('businesses')
              .select('id, business_name, category, city, state, is_verified, created_at, subscription_status, listing_status, average_rating, review_count');
            data = businesses || [];
            filename = 'businesses-report';
            break;
          case 'transactions':
            const { data: transactions } = await supabase.from('transactions')
              .select('id, user_id, business_id, transaction_type, amount, points_earned, created_at, status')
              .limit(1000);
            data = transactions || [];
            filename = 'transactions-report';
            break;
          case 'agents':
            const { data: agents } = await supabase.from('sales_agents')
              .select('id, user_id, referral_code, commission_rate, tier, is_active, total_earnings, lifetime_referrals, created_at');
            data = agents || [];
            filename = 'agents-report';
            break;
          case 'activity':
            const { data: activity } = await supabase.from('activity_log')
              .select('id, user_id, activity_type, business_id, created_at, points_involved')
              .limit(1000);
            data = activity || [];
            filename = 'activity-log';
            break;
        }

        if (data.length === 0) {
          toast.warning(`No data found for ${reportId}`);
          continue;
        }

        let content: string;
        let mimeType: string;
        let extension: string;

        if (format === 'csv') {
          const headers = Object.keys(data[0]).join(',');
          const rows = data.map(row => 
            Object.values(row).map(val => 
              typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
            ).join(',')
          );
          content = [headers, ...rows].join('\n');
          mimeType = 'text/csv';
          extension = 'csv';
        } else {
          content = JSON.stringify(data, null, 2);
          mimeType = 'application/json';
          extension = 'json';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}-${new Date().toISOString().split('T')[0]}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      toast.success('Reports exported successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export reports');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Download className="h-5 w-5 text-yellow-400" />
            Export Reports
          </DialogTitle>
          <DialogDescription className="text-blue-200/70">
            Select reports to export and choose your preferred format
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Label className="text-white">Select Reports</Label>
            {reportTypes.map((report) => (
              <div
                key={report.id}
                className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => toggleReport(report.id)}
              >
                <Checkbox
                  checked={selectedReports.includes(report.id)}
                  onCheckedChange={() => toggleReport(report.id)}
                  className="border-white/30 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{report.label}</p>
                  <p className="text-xs text-blue-200/60">{report.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label className="text-white">Export Format</Label>
            <Select value={format} onValueChange={(v: 'csv' | 'json') => setFormat(v)}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectItem value="csv" className="text-white hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    CSV (Excel compatible)
                  </div>
                </SelectItem>
                <SelectItem value="json" className="text-white hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    JSON
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/10 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={exportData}
            disabled={exporting || selectedReports.length === 0}
            className="bg-yellow-500 text-slate-900 hover:bg-yellow-400"
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export {selectedReports.length} Report{selectedReports.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportReportsDialog;
