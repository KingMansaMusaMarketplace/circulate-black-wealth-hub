import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Gift, 
  Settings, 
  ArrowRight, 
  Play, 
  FileText,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { FAQSection } from './FAQSection';
import { HELP_SECTIONS } from '@/lib/onboarding-constants';
import { useOnboarding } from '@/hooks/useOnboarding';

export const HelpSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('getting-started');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { resetOnboarding } = useOnboarding();

  const handleStartTutorial = () => {
    resetOnboarding();
    // Small delay to ensure state is reset before starting
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  };

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

  const getSectionIcon = (title: string) => {
    switch (title) {
      case 'Getting Started':
        return BookOpen;
      case 'Earning & Rewards':
        return Gift;
      case 'Account & Privacy':
        return Settings;
      default:
        return FileText;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Help & Support Center
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get the help you need to make the most of Mansa Musa Marketplace. 
          Find guides, tutorials, and answers to common questions.
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-mansablue/5 to-mansagold/5 border-mansablue/20">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleStartTutorial}
              variant="outline"
              className="flex items-center gap-2 h-auto p-4 justify-start"
            >
              <Play className="w-5 h-5 text-mansablue" />
              <div className="text-left">
                <div className="font-medium">Take the Tour</div>
                <div className="text-sm text-gray-500">Interactive walkthrough</div>
              </div>
            </Button>
            
            <Button
              onClick={() => setActiveTab('faq')}
              variant="outline"
              className="flex items-center gap-2 h-auto p-4 justify-start"
            >
              <MessageCircle className="w-5 h-5 text-mansagold" />
              <div className="text-left">
                <div className="font-medium">Browse FAQ</div>
                <div className="text-sm text-gray-500">Common questions</div>
              </div>
            </Button>
            
            <Button
              onClick={() => window.location.href = '/contact'}
              variant="outline"
              className="flex items-center gap-2 h-auto p-4 justify-start"
            >
              <HelpCircle className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Contact Support</div>
                <div className="text-sm text-gray-500">Get personalized help</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="earning-rewards">Earning & Rewards</TabsTrigger>
          <TabsTrigger value="account-privacy">Account & Privacy</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Help sections */}
        {HELP_SECTIONS.map((section, sectionIndex) => {
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
                            <Badge variant="secondary">Guide</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-gray-600 mb-4">{item.description}</p>
                          
                          {expanded && item.details && (
                            <div className="prose prose-sm max-w-none mb-4 p-4 bg-gray-50 rounded-lg">
                              {item.details.split('\n\n').map((paragraph, idx) => {
                                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                  return <h3 key={idx} className="text-base font-semibold text-gray-900 mt-4 mb-2">{paragraph.replace(/\*\*/g, '')}</h3>;
                                } else if (paragraph.startsWith('- ')) {
                                  return (
                                    <ul key={idx} className="list-disc list-inside space-y-1 mb-3">
                                      {paragraph.split('\n').map((line, i) => (
                                        <li key={i} className="text-gray-700">{line.replace(/^- /, '')}</li>
                                      ))}
                                    </ul>
                                  );
                                } else if (/^\d+\./.test(paragraph)) {
                                  return (
                                    <ol key={idx} className="list-decimal list-inside space-y-1 mb-3">
                                      {paragraph.split('\n').map((line, i) => (
                                        <li key={i} className="text-gray-700">{line.replace(/^\d+\.\s*/, '')}</li>
                                      ))}
                                    </ol>
                                  );
                                }
                                return <p key={idx} className="text-gray-700 mb-3">{paragraph}</p>;
                              })}
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
          <FAQSection />
        </TabsContent>
      </Tabs>

      {/* Contact Banner */}
      <Card className="bg-gradient-to-r from-mansablue to-mansagold text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Need More Help?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our support team is available to help with any questions or issues you might have. 
            We typically respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary"
              onClick={() => window.location.href = '/contact'}
            >
              Send us a Message
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-mansablue"
              onClick={() => window.location.href = 'mailto:support@mansamusamarketplace.com'}
            >
              Email Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};