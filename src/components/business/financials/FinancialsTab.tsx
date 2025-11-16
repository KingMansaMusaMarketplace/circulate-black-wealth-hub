import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoicesManager } from './InvoicesManager';
import { ExpensesTracker } from './ExpensesTracker';
import { PLReports } from './PLReports';
import { TaxRatesManager } from './TaxRatesManager';
import { AccountsReceivableAging } from './AccountsReceivableAging';
import { RecurringInvoicesManager } from './RecurringInvoicesManager';
import { AuditLogViewer } from './AuditLogViewer';

interface FinancialsTabProps {
  businessId: string;
}

export const FinancialsTab: React.FC<FinancialsTabProps> = ({ businessId }) => {
  return (
    <Tabs defaultValue="pl-reports" className="w-full">
      <TabsList className="grid w-full grid-cols-7 lg:grid-cols-7">
        <TabsTrigger value="pl-reports">P&L</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="expenses">Expenses</TabsTrigger>
        <TabsTrigger value="receivables">A/R Aging</TabsTrigger>
        <TabsTrigger value="recurring">Recurring</TabsTrigger>
        <TabsTrigger value="taxes">Taxes</TabsTrigger>
        <TabsTrigger value="audit">Audit</TabsTrigger>
      </TabsList>
      
      <TabsContent value="pl-reports">
        <PLReports businessId={businessId} />
      </TabsContent>
      
      <TabsContent value="invoices">
        <InvoicesManager businessId={businessId} />
      </TabsContent>
      
      <TabsContent value="expenses">
        <ExpensesTracker businessId={businessId} />
      </TabsContent>

      <TabsContent value="receivables">
        <AccountsReceivableAging businessId={businessId} />
      </TabsContent>

      <TabsContent value="recurring">
        <RecurringInvoicesManager businessId={businessId} />
      </TabsContent>

      <TabsContent value="taxes">
        <TaxRatesManager businessId={businessId} />
      </TabsContent>

      <TabsContent value="audit">
        <AuditLogViewer businessId={businessId} />
      </TabsContent>
    </Tabs>
  );
};