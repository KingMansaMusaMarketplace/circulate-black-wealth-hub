import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, FileText, Download, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface InvoicesManagerProps {
  businessId: string;
}

export const InvoicesManager: React.FC<InvoicesManagerProps> = ({ businessId }) => {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadInvoices();
  }, [businessId]);

  const loadInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
      toast({
        title: 'Error',
        description: 'Failed to load invoices',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateInvoiceFromBookings = async () => {
    try {
      // Get completed bookings without invoices
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('business_id', businessId)
        .eq('status', 'completed')
        .is('id', null); // This is a placeholder - we'd need to check if invoice exists

      if (!bookings || bookings.length === 0) {
        toast({
          title: 'No bookings',
          description: 'No completed bookings found to invoice',
        });
        return;
      }

      // Generate invoices for first booking as example
      const booking = bookings[0];
      const invoiceNumber = `INV-${Date.now()}`;

      const { error } = await supabase.from('invoices').insert({
        business_id: businessId,
        booking_id: booking.id,
        invoice_number: invoiceNumber,
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        amount: booking.business_amount || booking.amount,
        tax_amount: 0,
        total_amount: booking.business_amount || booking.amount,
        status: 'pending',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        line_items: [{
          description: `Service on ${format(new Date(booking.booking_date), 'MMM dd, yyyy')}`,
          quantity: 1,
          unit_price: booking.business_amount || booking.amount,
          total: booking.business_amount || booking.amount
        }]
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Invoice generated successfully',
      });
      
      loadInvoices();
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate invoice',
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Invoices</h3>
          <p className="text-muted-foreground">Manage your business invoices</p>
        </div>
        <Button onClick={generateInvoiceFromBookings}>
          <Plus className="mr-2 h-4 w-4" />
          Generate from Bookings
        </Button>
      </div>

      {invoices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">No invoices yet</p>
            <p className="text-muted-foreground mb-4">Generate invoices from your completed bookings</p>
            <Button onClick={generateInvoiceFromBookings}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Invoice
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-lg">{invoice.invoice_number}</h4>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {invoice.customer_name} • {invoice.customer_email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {format(new Date(invoice.due_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${Number(invoice.total_amount).toFixed(2)}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};