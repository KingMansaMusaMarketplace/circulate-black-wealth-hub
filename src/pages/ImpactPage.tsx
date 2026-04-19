import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ImpactDashboard } from '@/components/ImpactDashboard';
import CommunityImpactDashboard from '@/components/community-impact/CommunityImpactDashboard';
import EconomicImpactDashboard from '@/components/dashboard/EconomicImpactDashboard';
import SponsorshipVideoSection from '@/components/HowItWorks/SponsorshipVideoSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { updateMetaTags } from '@/utils/seoUtils';

type ImpactTab = 'my' | 'community' | 'economic';

const pathToTab = (pathname: string): ImpactTab => {
  if (pathname.startsWith('/community-impact')) return 'community';
  if (pathname.startsWith('/economic-impact')) return 'economic';
  return 'my';
};

const tabToPath: Record<ImpactTab, string> = {
  my: '/impact',
  community: '/community-impact',
  economic: '/economic-impact',
};

const ImpactPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = pathToTab(location.pathname);

  useEffect(() => {
    const meta: Record<ImpactTab, { title: string; description: string }> = {
      my: {
        title: 'My Impact - 1325.AI',
        description: "See how you're building community wealth and circulating money within the community through 1325.AI.",
      },
      community: {
        title: 'Community Impact - 1325.AI',
        description: 'Track collective wealth circulation, jobs created, and businesses supported across the 1325.AI community.',
      },
      economic: {
        title: 'Economic Impact - 1325.AI',
        description: 'Explore the economic impact, multiplier effect, and growth metrics powering Black community wealth on 1325.AI.',
      },
    };
    updateMetaTags({ ...meta[activeTab], path: location.pathname });
  }, [activeTab, location.pathname]);

  const handleTabChange = (value: string) => {
    const next = value as ImpactTab;
    if (tabToPath[next] !== location.pathname) {
      navigate(tabToPath[next], { replace: false });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Modern dark gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712]" />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/4 -right-32 w-[32rem] h-[32rem] bg-gradient-to-tl from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 left-1/4 w-[28rem] h-[28rem] bg-gradient-to-tr from-blue-700/25 to-mansablue/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-bl from-mansagold/20 to-amber-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 relative z-10">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full max-w-xl mx-auto grid-cols-3 bg-white/5 border border-white/10 backdrop-blur-md mb-8 h-auto p-1">
            <TabsTrigger value="my" className="text-white/70 data-[state=active]:bg-mansablue data-[state=active]:text-white py-2.5">
              My Impact
            </TabsTrigger>
            <TabsTrigger value="community" className="text-white/70 data-[state=active]:bg-mansablue data-[state=active]:text-white py-2.5">
              Community
            </TabsTrigger>
            <TabsTrigger value="economic" className="text-white/70 data-[state=active]:bg-mansablue data-[state=active]:text-white py-2.5">
              Economic
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my" className="mt-0">
            <ImpactDashboard />
          </TabsContent>

          <TabsContent value="community" className="mt-0">
            <CommunityImpactDashboard />
          </TabsContent>

          <TabsContent value="economic" className="mt-0">
            <EconomicImpactDashboard />
          </TabsContent>
        </Tabs>
      </div>

      <div className="relative z-10">
        <SponsorshipVideoSection />
      </div>
    </div>
  );
};

export default ImpactPage;
