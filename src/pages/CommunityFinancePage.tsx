import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SavingsCircles } from '@/components/finance/SavingsCircles';
import { CommunityInvestments } from '@/components/finance/CommunityInvestments';
import { Landmark, TrendingUp } from 'lucide-react';

const CommunityFinancePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Finance</h1>
        <p className="text-muted-foreground">
          Build wealth together through collective savings and investments
        </p>
      </div>

      <Tabs defaultValue="circles" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="circles" className="gap-2">
            <Landmark className="w-4 h-4" />
            Savings Circles
          </TabsTrigger>
          <TabsTrigger value="investments" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Investments
          </TabsTrigger>
        </TabsList>
        <TabsContent value="circles" className="mt-6">
          <SavingsCircles />
        </TabsContent>
        <TabsContent value="investments" className="mt-6">
          <CommunityInvestments />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityFinancePage;
