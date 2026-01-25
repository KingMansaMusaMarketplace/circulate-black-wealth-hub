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
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white rounded-2xl p-12 border border-white/10">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        {/* Animated glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-mansagold/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="relative text-center">
          <div className="inline-block mb-6">
            <div className="p-4 bg-mansagold/20 rounded-full backdrop-blur-xl animate-bounce-subtle border border-mansagold/30">
              <HelpCircle className="h-16 w-16 text-mansagold" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">
            Help & Support Center 🆘
          </h1>
          <p className="text-xl text-blue-100/90 max-w-2xl mx-auto font-medium">
            Get the help you need to make the most of Mansa Musa Marketplace ✨
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10 hover:border-mansagold/30 hover:shadow-xl hover:shadow-mansagold/10 transition-all">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent mb-6">
            Quick Actions 🚀
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleStartTutorial}
              variant="outline"
              className="flex items-center gap-3 h-auto p-5 justify-start bg-slate-900/60 border-white/10 hover:border-mansablue hover:shadow-lg hover:shadow-mansablue/20 hover:scale-105 transition-all text-white"
            >
              <div className="p-2 bg-gradient-to-br from-mansablue to-blue-600 rounded-lg shadow-lg">
                <Play className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-white">Take the Tour</div>
                <div className="text-sm text-blue-300/70">Interactive walkthrough</div>
              </div>
            </Button>
            
            <Button
              onClick={() => setActiveTab('faq')}
              variant="outline"
              className="flex items-center gap-3 h-auto p-5 justify-start bg-slate-900/60 border-white/10 hover:border-mansagold hover:shadow-lg hover:shadow-mansagold/20 hover:scale-105 transition-all text-white"
            >
              <div className="p-2 bg-gradient-to-br from-mansagold to-amber-500 rounded-lg shadow-lg">
                <MessageCircle className="w-5 h-5 text-slate-900" />
              </div>
              <div className="text-left">
                <div className="font-bold text-white">Browse FAQ</div>
                <div className="text-sm text-blue-300/70">Common questions</div>
              </div>
            </Button>
            
            <Button
              onClick={() => window.location.href = '/contact'}
              variant="outline"
              className="flex items-center gap-3 h-auto p-5 justify-start bg-slate-900/60 border-white/10 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all text-white"
            >
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-white">Contact Support</div>
                <div className="text-sm text-blue-300/70">Get personalized help</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/60 backdrop-blur-xl border border-white/10 p-1">
          <TabsTrigger value="getting-started" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansablue data-[state=active]:to-blue-600 data-[state=active]:text-white font-semibold text-blue-200">Getting Started</TabsTrigger>
          <TabsTrigger value="earning--rewards" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansagold data-[state=active]:to-amber-500 data-[state=active]:text-slate-900 font-semibold text-blue-200">Earning & Rewards</TabsTrigger>
          <TabsTrigger value="account--privacy" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white font-semibold text-blue-200">Account & Privacy</TabsTrigger>
          <TabsTrigger value="faq" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansagold data-[state=active]:to-amber-600 data-[state=active]:text-slate-900 font-semibold text-blue-200">FAQ</TabsTrigger>
        </TabsList>

        {/* Help sections */}
        {HELP_SECTIONS.map((section, sectionIndex) => {
          const tabValue = section.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
          const Icon = getSectionIcon(section.title);
          
          const sectionColors = [
            { card: 'from-slate-900/60 via-blue-900/60 to-slate-900/60', border: 'border-mansablue/30', text: 'text-white', icon: 'from-mansablue to-blue-600', badge: 'from-mansablue to-blue-600' },
            { card: 'from-slate-900/60 via-amber-900/20 to-slate-900/60', border: 'border-mansagold/30', text: 'text-white', icon: 'from-mansagold to-amber-500', badge: 'from-mansagold to-amber-500' },
            { card: 'from-slate-900/60 via-blue-900/40 to-slate-900/60', border: 'border-blue-500/30', text: 'text-white', icon: 'from-blue-600 to-blue-700', badge: 'from-blue-600 to-blue-700' }
          ];
          const sectionColor = sectionColors[sectionIndex % sectionColors.length];
          
          return (
            <TabsContent key={sectionIndex} value={tabValue} className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6 p-4 bg-slate-800/60 backdrop-blur-xl rounded-xl border border-white/10">
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
                      <Card key={itemIndex} className={`bg-slate-800/60 backdrop-blur-xl hover:shadow-xl hover:shadow-${itemColor.icon.split(' ')[0].replace('from-', '')}/20 transition-all hover:scale-[1.02] border ${itemColor.border}`}>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center justify-between">
                            <span className={`text-lg font-bold ${itemColor.text}`}>{item.title}</span>
                            <Badge className={`bg-gradient-to-r ${itemColor.badge} text-white shadow-lg`}>Guide</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-blue-200/70 mb-4 leading-relaxed">{item.description}</p>
                          
                          {expanded && item.details && (
                            <div className="prose prose-sm max-w-none mb-4 p-4 bg-slate-900/80 rounded-lg border border-white/10">
                              {item.details.split('\n\n').map((paragraph, idx) => {
                                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                  return <h3 key={idx} className={`text-base font-bold ${itemColor.text} mt-4 mb-2`}>{paragraph.replace(/\*\*/g, '')}</h3>;
                                } else if (paragraph.startsWith('- ')) {
                                  return (
                                    <ul key={idx} className="list-disc list-inside space-y-1 mb-3">
                                      {paragraph.split('\n').map((line, i) => (
                                        <li key={i} className="text-blue-200/70">{line.replace(/^- /, '')}</li>
                                      ))}
                                    </ul>
                                  );
                                } else if (/^\d+\./.test(paragraph)) {
                                  return (
                                    <ol key={idx} className="list-decimal list-inside space-y-1 mb-3">
                                      {paragraph.split('\n').map((line, i) => (
                                        <li key={i} className="text-blue-200/70">{line.replace(/^\d+\.\s*/, '')}</li>
                                      ))}
                                    </ol>
                                  );
                                }
                                return <p key={idx} className="text-blue-200/70 mb-3">{paragraph}</p>;
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
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white border border-white/10 hover:shadow-xl hover:shadow-mansagold/20 transition-all">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm pointer-events-none" aria-hidden="true" />
        {/* Animated glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-mansagold/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <CardContent className="relative p-8 text-center">
          <div className="inline-block mb-4">
            <div className="p-3 bg-mansagold/20 rounded-full backdrop-blur-xl border border-mansagold/30">
              <HelpCircle className="h-12 w-12 text-mansagold" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">
            Need More Help? 🤔
          </h2>
          <p className="text-blue-100/90 mb-6 max-w-2xl mx-auto text-lg font-medium">
            Our support team is available to help with any questions or issues you might have. 
            We typically respond within 24 hours ⚡
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-gradient-to-r from-mansagold to-amber-500 hover:from-amber-500 hover:to-mansagold text-slate-900 font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              onClick={() => window.location.href = '/contact'}
            >
              Send us a Message
            </Button>
            <Button 
              className="bg-gradient-to-r from-mansablue to-blue-600 hover:from-blue-600 hover:to-mansablue text-white font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              onClick={() => window.location.href = 'mailto:Thomas@1325.AI'}
            >
              Email Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};