import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  Play, 
  FileText,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { CorporateFAQSection } from './CorporateFAQSection';
import { CORPORATE_HELP_SECTIONS } from '@/lib/corporate-onboarding-constants';
import { useCorporateOnboarding } from '@/hooks/useCorporateOnboarding';

export const CorporateHelpSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('getting-started');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { resetOnboarding } = useCorporateOnboarding();

  const toggleExpanded = (sectionIndex: number, itemIndex: number) => {
    const key = `${sectionIndex}-${itemIndex}`;
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const isExpanded = (sectionIndex: number, itemIndex: number) => {
    return expandedItems.has(`${sectionIndex}-${itemIndex}`);
  };

  const handleStartTutorial = () => {
    resetOnboarding();
    // Small delay to ensure state is reset before starting
    setTimeout(() => {
      window.location.href = '/corporate-sponsorship';
    }, 100);
  };

  const getSectionIcon = (title: string) => {
    switch (title) {
      case 'Getting Started':
        return Building2;
      case 'Impact & Reporting':
        return TrendingUp;
      case 'Maximizing Partnership Value':
        return Users;
      default:
        return FileText;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Corporate Partnership Center
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Everything you need to maximize your corporate partnership impact. 
          From sponsorship setup to community engagement strategies.
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-mansablue/5 to-mansagold/5 border-mansablue/20">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions for Corporate Partners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleStartTutorial}
              variant="outline"
              className="flex items-center gap-2 h-auto p-4 justify-start"
            >
              <Play className="w-5 h-5 text-mansablue" />
              <div className="text-left">
                <div className="font-medium">Partnership Tour</div>
                <div className="text-sm text-gray-500">Interactive corporate walkthrough</div>
              </div>
            </Button>
            
            <Button
              onClick={() => setActiveTab('faq')}
              variant="outline"
              className="flex items-center gap-2 h-auto p-4 justify-start"
            >
              <MessageCircle className="w-5 h-5 text-mansagold" />
              <div className="text-left">
                <div className="font-medium">Partnership FAQ</div>
                <div className="text-sm text-gray-500">Corporate sponsor questions</div>
              </div>
            </Button>
            
            <Button
              onClick={() => window.location.href = '/contact'}
              variant="outline"
              className="flex items-center gap-2 h-auto p-4 justify-start"
            >
              <HelpCircle className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Partnership Team</div>
                <div className="text-sm text-gray-500">Dedicated corporate support</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="impact---reporting">Impact & Reporting</TabsTrigger>
          <TabsTrigger value="maximizing-partnership-value">Partnership Value</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Help sections */}
        {CORPORATE_HELP_SECTIONS.map((section, sectionIndex) => {
          const tabValue = section.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
          const Icon = getSectionIcon(section.title);
          
          return (
            <TabsContent key={sectionIndex} value={tabValue} className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="w-6 h-6 text-mansablue" />
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                
                <div className="grid gap-4">
                  {section.items.map((item, itemIndex) => {
                    const expanded = isExpanded(sectionIndex, itemIndex);
                    return (
                      <Card key={itemIndex} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center justify-between">
                            <span className="text-lg">{item.title}</span>
                            <Badge variant="secondary">Corporate Guide</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-gray-600 mb-4">{item.description}</p>
                          {expanded && (
                            <div className="p-4 bg-gray-50 rounded-lg mb-4 text-gray-600">
                              <p>Detailed partnership guide coming soon. Contact our corporate partnership team for personalized assistance.</p>
                            </div>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleExpanded(sectionIndex, itemIndex)}
                          >
                            {expanded ? 'Show Less' : 'Read More'}
                            <ArrowRight className={`w-4 h-4 ml-2 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          );
        })}

        {/* FAQ Tab */}
        <TabsContent value="faq" className="mt-6">
          <CorporateFAQSection />
        </TabsContent>
      </Tabs>

      {/* Partnership Impact Banner */}
      <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Drive Meaningful Impact?
          </h2>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Join forward-thinking corporations making a real difference in Black communities. 
            Get measurable ROI on your corporate social responsibility investments while building authentic relationships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary"
              onClick={() => window.location.href = '/corporate-sponsorship'}
            >
              Explore Partnership Tiers
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-purple-600"
              onClick={() => window.location.href = 'mailto:Thomas@1325.AI'}
            >
              Contact Partnership Team
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};