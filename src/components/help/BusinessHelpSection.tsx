import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  QrCode, 
  BarChart3, 
  ArrowRight, 
  Play, 
  FileText,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { BusinessFAQSection } from './BusinessFAQSection';
import { BUSINESS_HELP_SECTIONS } from '@/lib/business-onboarding-constants';
import { useBusinessOnboarding } from '@/hooks/useBusinessOnboarding';

export const BusinessHelpSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('getting-started');
  const { resetOnboarding } = useBusinessOnboarding();

  const handleStartTutorial = () => {
    resetOnboarding();
    // Small delay to ensure state is reset before starting
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 100);
  };

  const getSectionIcon = (title: string) => {
    switch (title) {
      case 'Getting Started':
        return Store;
      case 'QR Codes & Loyalty':
        return QrCode;
      case 'Analytics & Growth':
        return BarChart3;
      default:
        return FileText;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Business Help Center
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Everything you need to succeed on Mansa Musa Marketplace. 
          From setup to growth, we've got you covered.
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-mansablue/5 to-mansagold/5 border-mansablue/20">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions for Business Owners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleStartTutorial}
              variant="outline"
              className="flex items-center gap-2 h-auto p-4 justify-start"
            >
              <Play className="w-5 h-5 text-mansablue" />
              <div className="text-left">
                <div className="font-medium">Business Walkthrough</div>
                <div className="text-sm text-gray-500">Interactive business tour</div>
              </div>
            </Button>
            
            <Button
              onClick={() => setActiveTab('faq')}
              variant="outline"
              className="flex items-center gap-2 h-auto p-4 justify-start"
            >
              <MessageCircle className="w-5 h-5 text-mansagold" />
              <div className="text-left">
                <div className="font-medium">Business FAQ</div>
                <div className="text-sm text-gray-500">Common business questions</div>
              </div>
            </Button>
            
            <Button
              onClick={() => window.location.href = '/contact'}
              variant="outline"
              className="flex items-center gap-2 h-auto p-4 justify-start"
            >
              <HelpCircle className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Business Support</div>
                <div className="text-sm text-gray-500">Get expert help</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="qr-codes-loyalty">QR & Loyalty</TabsTrigger>
          <TabsTrigger value="analytics-growth">Analytics & Growth</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Help sections */}
        {BUSINESS_HELP_SECTIONS.map((section, sectionIndex) => {
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
                  {section.items.map((item, itemIndex) => (
                    <Card key={itemIndex} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between">
                          <span className="text-lg">{item.title}</span>
                          <Badge variant="secondary">Business Guide</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <Button variant="outline" size="sm">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          );
        })}

        {/* FAQ Tab */}
        <TabsContent value="faq" className="mt-6">
          <BusinessFAQSection />
        </TabsContent>
      </Tabs>

      {/* Business Success Banner */}
      <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Join thousands of successful Black-owned businesses on our platform. 
            Get the support and tools you need to reach more customers and build lasting relationships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary"
              onClick={() => window.location.href = '/business-signup'}
            >
              Start Your Business Journey
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-green-600"
              onClick={() => window.location.href = 'mailto:business@mansamusamarketplace.com'}
            >
              Contact Business Team
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};