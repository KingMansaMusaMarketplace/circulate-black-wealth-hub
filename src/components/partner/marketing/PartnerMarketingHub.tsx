import React from 'react';
import { DirectoryPartner, PartnerStats } from '@/types/partner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Mail, Share2, Code2, Printer, MessageSquare, Video, Trophy } from 'lucide-react';
import WelcomeKitGenerator from './WelcomeKitGenerator';
import EmailTemplatesGenerator from './EmailTemplatesGenerator';
import SocialAssetsGenerator from './SocialAssetsGenerator';
import EmbeddableBannerGenerator from './EmbeddableBannerGenerator';
import PrintableFlyerGenerator from './PrintableFlyerGenerator';
import TalkingPointsCard from './TalkingPointsCard';
import VideoScriptGenerator from './VideoScriptGenerator';
import SuccessStoryTemplate from './SuccessStoryTemplate';

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
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white gap-1.5 text-xs sm:text-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Welcome</span> Kit
            </TabsTrigger>
            <TabsTrigger 
              value="flyer" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white gap-1.5 text-xs sm:text-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Flyer
            </TabsTrigger>
            <TabsTrigger 
              value="emails" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white gap-1.5 text-xs sm:text-sm"
            >
              <Mail className="w-3.5 h-3.5" />
              Emails
            </TabsTrigger>
            <TabsTrigger 
              value="social" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white gap-1.5 text-xs sm:text-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              Social
            </TabsTrigger>
            <TabsTrigger 
              value="talking" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white gap-1.5 text-xs sm:text-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Talking</span> Points
            </TabsTrigger>
            <TabsTrigger 
              value="video" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white gap-1.5 text-xs sm:text-sm"
            >
              <Video className="w-3.5 h-3.5" />
              Video
            </TabsTrigger>
            <TabsTrigger 
              value="success" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white gap-1.5 text-xs sm:text-sm"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Success</span> Story
            </TabsTrigger>
            <TabsTrigger 
              value="banner" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white gap-1.5 text-xs sm:text-sm"
            >
              <Code2 className="w-3.5 h-3.5" />
              Embed
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="welcome-kit">
          <WelcomeKitGenerator partner={partner} stats={stats} />
        </TabsContent>

        <TabsContent value="flyer">
          <PrintableFlyerGenerator partner={partner} stats={stats} />
        </TabsContent>

        <TabsContent value="emails">
          <EmailTemplatesGenerator partner={partner} />
        </TabsContent>

        <TabsContent value="social">
          <SocialAssetsGenerator partner={partner} />
        </TabsContent>

        <TabsContent value="talking">
          <TalkingPointsCard partner={partner} />
        </TabsContent>

        <TabsContent value="video">
          <VideoScriptGenerator partner={partner} />
        </TabsContent>

        <TabsContent value="success">
          <SuccessStoryTemplate partner={partner} />
        </TabsContent>

        <TabsContent value="banner">
          <EmbeddableBannerGenerator partner={partner} stats={stats} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PartnerMarketingHub;
