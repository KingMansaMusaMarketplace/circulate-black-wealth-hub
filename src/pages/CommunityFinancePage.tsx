import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SavingsCircles } from '@/components/finance/SavingsCircles';
import { CommunityInvestments } from '@/components/finance/CommunityInvestments';
import { Landmark, TrendingUp } from 'lucide-react';

const CommunityFinancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Enhanced Header */}
        <div className="mb-10 animate-fade-in">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 via-teal-400/30 to-cyan-400/30 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-0 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent pt-2">
                Community <span className="text-yellow-500">Finance</span> 💰
              </h1>
              <p className="text-gray-700 text-xl font-medium">
                Build wealth together through collective savings and investments 🌱
              </p>
            </div>
          </div>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
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
      </div>
    </div>
  );
};

export default CommunityFinancePage;
