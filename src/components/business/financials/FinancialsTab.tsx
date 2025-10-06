import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoicesManager } from './InvoicesManager';
import { ExpensesTracker } from './ExpensesTracker';
import { PLReports } from './PLReports';

interface FinancialsTabProps {
  businessId: string;
}

export const FinancialsTab: React.FC<FinancialsTabProps> = ({ businessId }) => {
  return (
    <Tabs defaultValue="pl-reports" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="pl-reports">P&L Reports</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="expenses">Expenses</TabsTrigger>
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
    </Tabs>
  );
};