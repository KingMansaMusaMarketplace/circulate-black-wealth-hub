import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoicesManager } from './InvoicesManager';
import { ExpensesTracker } from './ExpensesTracker';
import { PLReports } from './PLReports';
import { TaxRatesManager } from './TaxRatesManager';
import { AccountsReceivableAging } from './AccountsReceivableAging';
import { RecurringInvoicesManager } from './RecurringInvoicesManager';
import { AuditLogViewer } from './AuditLogViewer';
import { BalanceSheet } from './BalanceSheet';
import { CashFlowStatement } from './CashFlowStatement';
import { BankReconciliation } from './BankReconciliation';
import { BudgetVsActual } from './BudgetVsActual';
import { FixedAssetsManager } from './FixedAssetsManager';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface FinancialsTabProps {
  businessId: string;
}

export const FinancialsTab: React.FC<FinancialsTabProps> = ({ businessId }) => {
  return (
    <Tabs defaultValue="pl-reports" className="w-full">
      <ScrollArea className="w-full whitespace-nowrap">
        <TabsList className="inline-flex w-auto">
          <TabsTrigger value="pl-reports">P&L</TabsTrigger>
          <TabsTrigger value="balance-sheet">Balance</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="reconciliation">Bank Rec</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="receivables">A/R</TabsTrigger>
          <TabsTrigger value="recurring">Recurring</TabsTrigger>
          <TabsTrigger value="taxes">Taxes</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      
      <TabsContent value="pl-reports">
        <PLReports businessId={businessId} />
      </TabsContent>

      <TabsContent value="balance-sheet">
        <BalanceSheet businessId={businessId} />
      </TabsContent>

      <TabsContent value="cashflow">
        <CashFlowStatement businessId={businessId} />
      </TabsContent>
      
      <TabsContent value="invoices">
        <InvoicesManager businessId={businessId} />
      </TabsContent>
      
      <TabsContent value="expenses">
        <ExpensesTracker businessId={businessId} />
      </TabsContent>

      <TabsContent value="reconciliation">
        <BankReconciliation businessId={businessId} />
      </TabsContent>

      <TabsContent value="budget">
        <BudgetVsActual businessId={businessId} />
      </TabsContent>

      <TabsContent value="assets">
        <FixedAssetsManager businessId={businessId} />
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