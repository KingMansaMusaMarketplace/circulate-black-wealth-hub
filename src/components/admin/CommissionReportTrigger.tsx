import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Calendar, Send } from 'lucide-react';
import { useCommissionNotifications } from '@/hooks/use-commission-notifications';

const CommissionReportTrigger: React.FC = () => {
  const { sending, sendMonthlyReports, sendBusinessReport } = useCommissionNotifications();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [businessId, setBusinessId] = useState('');

  const handleSendToAll = async () => {
    await sendMonthlyReports(selectedMonth || undefined);
  };

  const handleSendToOne = async () => {
    if (!businessId.trim()) {
      return;
    }
    await sendBusinessReport(businessId, selectedMonth || undefined);
  };

  // Get current month in YYYY-MM format
  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Commission Report Emails
        </CardTitle>
        <CardDescription>
          Send monthly commission reports to business owners
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="month" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Report Month
          </Label>
          <Input
            id="month"
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            max={currentMonth}
            placeholder="Leave empty for previous month"
          />
          <p className="text-xs text-muted-foreground">
            Leave empty to send reports for the previous month
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t">
          <Button
            onClick={handleSendToAll}
            disabled={sending}
            className="w-full"
            size="lg"
          >
            <Send className="h-4 w-4 mr-2" />
            {sending ? 'Sending...' : 'Send to All Businesses'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessId">Send to Specific Business</Label>
            <div className="flex gap-2">
              <Input
                id="businessId"
                value={businessId}
                onChange={(e) => setBusinessId(e.target.value)}
                placeholder="Business ID"
              />
              <Button
                onClick={handleSendToOne}
                disabled={sending || !businessId.trim()}
                variant="outline"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
          <p className="font-medium">📧 What's included:</p>
          <ul className="space-y-1 text-muted-foreground list-disc list-inside">
            <li>Total commission fees for the month</li>
            <li>Transaction volume and count</li>
            <li>Trends vs. previous month</li>
            <li>Key insights and performance highlights</li>
            <li>Link to detailed commission dashboard</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionReportTrigger;
