import React, { useState } from 'react';
import { DirectoryPartner, PartnerStats } from '@/types/partner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Mail, Share2, Code2 } from 'lucide-react';
import WelcomeKitGenerator from './WelcomeKitGenerator';
import EmailTemplatesGenerator from './EmailTemplatesGenerator';
import SocialAssetsGenerator from './SocialAssetsGenerator';
import EmbeddableBannerGenerator from './EmbeddableBannerGenerator';

interface PartnerMarketingHubProps {
  partner: DirectoryPartner;
  stats: PartnerStats;
}

const PartnerMarketingHub: React.FC<PartnerMarketingHubProps> = ({ partner, stats }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Partner Marketing Hub</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Ready-to-use marketing materials personalized with your referral link. 
          Share these with your members to drive signups and earn commissions.
        </p>
      </div>

      <Tabs defaultValue="welcome-kit" className="space-y-4">
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="bg-slate-800/60 border border-slate-700/50 inline-flex min-w-max">
            <TabsTrigger 
              value="welcome-kit" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white gap-2"
            >
              <FileText className="w-4 h-4" />
              Welcome Kit
            </TabsTrigger>
            <TabsTrigger 
              value="emails" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white gap-2"
            >
              <Mail className="w-4 h-4" />
              Email Templates
            </TabsTrigger>
            <TabsTrigger 
              value="social" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white gap-2"
            >
              <Share2 className="w-4 h-4" />
              Social Assets
            </TabsTrigger>
            <TabsTrigger 
              value="banner" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white gap-2"
            >
              <Code2 className="w-4 h-4" />
              Embed Banner
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="welcome-kit">
          <WelcomeKitGenerator partner={partner} stats={stats} />
        </TabsContent>

        <TabsContent value="emails">
          <EmailTemplatesGenerator partner={partner} />
        </TabsContent>

        <TabsContent value="social">
          <SocialAssetsGenerator partner={partner} />
        </TabsContent>

        <TabsContent value="banner">
          <EmbeddableBannerGenerator partner={partner} stats={stats} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PartnerMarketingHub;
