import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, ExternalLink, Receipt } from 'lucide-react';
import { format } from 'date-fns';

interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  pdf_url: string | null;
}

interface PartnerInvoicesListProps {
  invoices: Invoice[];
  onDownload: (invoiceId: string) => void;
}

const PartnerInvoicesList: React.FC<PartnerInvoicesListProps> = ({ invoices, onDownload }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-emerald-500/20 text-emerald-400">Paid</Badge>;
      case 'issued':
        return <Badge className="bg-blue-500/20 text-blue-400">Issued</Badge>;
      case 'void':
        return <Badge variant="outline" className="text-slate-400">Void</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (invoices.length === 0) {
    return (
      <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Receipt className="h-5 w-5 text-amber-400" />
            Payout Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No invoices yet</p>
            <p className="text-sm mt-1">Invoices are generated when payouts are processed</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Receipt className="h-5 w-5 text-amber-400" />
          Payout Invoices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div 
              key={invoice.id}
              className="flex items-center justify-between p-4 rounded-lg bg-slate-900/40 border border-slate-700/30"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-slate-800">
                  <FileText className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-white">{invoice.invoice_number}</span>
                    {getStatusBadge(invoice.status)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {format(new Date(invoice.invoice_date), 'MMM dd, yyyy')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-white">
                    ${invoice.total_amount.toFixed(2)}
                  </div>
                  {invoice.tax_amount > 0 && (
                    <div className="text-xs text-slate-500">
                      (incl. ${invoice.tax_amount.toFixed(2)} tax)
                    </div>
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDownload(invoice.id)}
                  className="text-slate-400 hover:text-white"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerInvoicesList;
