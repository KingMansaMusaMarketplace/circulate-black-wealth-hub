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
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-primary to-purple-600 text-white rounded-2xl p-12">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <div className="relative text-center">
          <div className="inline-block mb-6">
            <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm animate-bounce-subtle">
              <HelpCircle className="h-16 w-16 text-yellow-300" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
            Help & Support Center 🆘
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
            Get the help you need to make the most of Mansa Musa Marketplace ✨
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="border-2 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 border-purple-200 hover:shadow-xl transition-all">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 bg-clip-text text-transparent mb-6">
            Quick Actions 🚀
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleStartTutorial}
              variant="outline"
              className="flex items-center gap-3 h-auto p-5 justify-start hover:shadow-lg hover:scale-105 transition-all border-2 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-blue-200"
            >
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-lg">
                <Play className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-blue-700">Take the Tour</div>
                <div className="text-sm text-blue-600/80">Interactive walkthrough</div>
              </div>
            </Button>
            
            <Button
              onClick={() => setActiveTab('faq')}
              variant="outline"
              className="flex items-center gap-3 h-auto p-5 justify-start hover:shadow-lg hover:scale-105 transition-all border-2 bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border-orange-200"
            >
              <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg shadow-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-orange-700">Browse FAQ</div>
                <div className="text-sm text-orange-600/80">Common questions</div>
              </div>
            </Button>
            
            <Button
              onClick={() => window.location.href = '/contact'}
              variant="outline"
              className="flex items-center gap-3 h-auto p-5 justify-start hover:shadow-lg hover:scale-105 transition-all border-2 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200"
            >
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-green-700">Contact Support</div>
                <div className="text-sm text-green-600/80">Get personalized help</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-1">
          <TabsTrigger value="getting-started" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white font-semibold">Getting Started</TabsTrigger>
          <TabsTrigger value="earning--rewards" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white font-semibold">Earning & Rewards</TabsTrigger>
          <TabsTrigger value="account--privacy" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white font-semibold">Account & Privacy</TabsTrigger>
          <TabsTrigger value="faq" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white font-semibold">FAQ</TabsTrigger>
        </TabsList>

        {/* Help sections */}
        {HELP_SECTIONS.map((section, sectionIndex) => {
          const tabValue = section.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
          const Icon = getSectionIcon(section.title);
          
          const sectionColors = [
            { card: 'from-blue-50 via-cyan-50 to-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'from-blue-500 to-cyan-600' },
            { card: 'from-orange-50 via-amber-50 to-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'from-orange-500 to-amber-600' },
            { card: 'from-green-50 via-emerald-50 to-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'from-green-500 to-emerald-600' }
          ];
          const sectionColor = sectionColors[sectionIndex % sectionColors.length];
          
          return (
            <TabsContent key={sectionIndex} value={tabValue} className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border-2 border-gray-200">
                  <div className={`p-3 bg-gradient-to-br ${sectionColor.icon} rounded-xl shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className={`text-3xl font-bold ${sectionColor.text}`}>{section.title}</h2>
                </div>
                
                <div className="grid gap-4">
                  {section.items.map((item, itemIndex) => {
                    const expanded = isExpanded(sectionIndex, itemIndex);
                    const itemColor = sectionColors[itemIndex % sectionColors.length];
                    return (
                      <Card key={itemIndex} className={`hover:shadow-xl transition-all hover:scale-[1.02] border-2 bg-gradient-to-br ${itemColor.card} ${itemColor.border}`}>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center justify-between">
                            <span className={`text-lg font-bold ${itemColor.text}`}>{item.title}</span>
                            <Badge className={`bg-gradient-to-r ${itemColor.icon} text-white shadow-lg`}>Guide</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-foreground/80 mb-4 leading-relaxed">{item.description}</p>
                          
                          {expanded && item.details && (
                            <div className="prose prose-sm max-w-none mb-4 p-4 bg-white/70 rounded-lg border border-gray-200">
                              {item.details.split('\n\n').map((paragraph, idx) => {
                                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                  return <h3 key={idx} className={`text-base font-bold ${itemColor.text} mt-4 mb-2`}>{paragraph.replace(/\*\*/g, '')}</h3>;
                                } else if (paragraph.startsWith('- ')) {
                                  return (
                                    <ul key={idx} className="list-disc list-inside space-y-1 mb-3">
                                      {paragraph.split('\n').map((line, i) => (
                                        <li key={i} className="text-foreground/80">{line.replace(/^- /, '')}</li>
                                      ))}
                                    </ul>
                                  );
                                } else if (/^\d+\./.test(paragraph)) {
                                  return (
                                    <ol key={idx} className="list-decimal list-inside space-y-1 mb-3">
                                      {paragraph.split('\n').map((line, i) => (
                                        <li key={i} className="text-foreground/80">{line.replace(/^\d+\.\s*/, '')}</li>
                                      ))}
                                    </ol>
                                  );
                                }
                                return <p key={idx} className="text-foreground/80 mb-3">{paragraph}</p>;
                              })}
                            </div>
                          )}
                          
                          <Button 
                            className={`bg-gradient-to-r ${itemColor.icon} hover:opacity-90 text-white font-semibold shadow-lg`}
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
      <Card className="relative overflow-hidden border-2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white border-indigo-200 hover:shadow-xl transition-all">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm pointer-events-none" aria-hidden="true" />
        <CardContent className="relative p-8 text-center">
          <div className="inline-block mb-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <HelpCircle className="h-12 w-12 text-yellow-300" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
            Need More Help? 🤔
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto text-lg drop-shadow font-medium">
            Our support team is available to help with any questions or issues you might have. 
            We typically respond within 24 hours ⚡
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-indigo-600 hover:bg-white/90 font-bold shadow-lg"
              onClick={() => window.location.href = '/contact'}
            >
              Send us a Message
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-bold"
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