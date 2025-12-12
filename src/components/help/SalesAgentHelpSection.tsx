import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSalesAgentOnboarding } from '@/hooks/useSalesAgentOnboarding';
import { Target, Users, DollarSign, BarChart3, FileText, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

const SalesAgentHelpSection: React.FC = () => {
  const { resetOnboarding } = useSalesAgentOnboarding();

  const helpTopics = [
    {
      icon: Target,
      title: "Getting Started",
      description: "Learn how to apply and become a sales agent",
      items: [
        "Complete your application form",
        "Pass the qualification test",
        "Get your unique referral code",
        "Start referring customers"
      ]
    },
    {
      icon: Users,
      title: "Finding Referrals",
      description: "Best practices for finding and converting referrals",
      items: [
        "Target local businesses in your area",
        "Use social media to promote your code",
        "Network at business events",
        "Share success stories"
      ]
    },
    {
      icon: DollarSign,
      title: "Commission Structure",
      description: "Understanding how you earn money",
      items: [
        "25% commission on business referrals",
        "15% commission on customer referrals",
        "Monthly payout system",
        "Recurring commissions available"
      ]
    },
    {
      icon: BarChart3,
      title: "Tracking Performance",
      description: "Monitor your success with our dashboard",
      items: [
        "Real-time referral tracking",
        "Earnings and payout history",
        "Performance analytics",
        "Goal setting and progress"
      ]
    },
    {
      icon: FileText,
      title: "Marketing Materials",
      description: "Access tools to promote your referrals",
      items: [
        "Branded social media graphics",
        "Email templates",
        "QR codes for easy sharing",
        "Presentation materials"
      ]
    },
    {
      icon: HelpCircle,
      title: "Support & Training",
      description: "Get help when you need it",
      items: [
        "24/7 agent support portal",
        "Training webinars",
        "Best practices guide",
        "Community forum access"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-mansablue mb-4">Sales Agent Help Center</h2>
        <p className="text-gray-600 mb-6">
          Everything you need to know about being a successful Mansa Musa Marketplace sales agent
        </p>
        <Button onClick={resetOnboarding} variant="outline" className="mb-8">
          Restart Onboarding Tour
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {helpTopics.map((topic, index) => {
          const IconComponent = topic.icon;
          return (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IconComponent className="h-5 w-5 text-mansablue" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                    <CardDescription>{topic.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {topic.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-mansablue rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardHeader>
          <CardTitle className="text-mansablue">Need More Help?</CardTitle>
          <CardDescription>
            Can't find what you're looking for? Our support team is here to help.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="default" onClick={() => toast.info('Contact support at support@mansamusa.com')}>
              Contact Support
            </Button>
            <Button variant="outline" onClick={() => window.open('https://discord.gg/mansamusa', '_blank')}>
              Join Community Forum
            </Button>
            <Button variant="outline" onClick={() => toast.info('Training call scheduling coming soon!')}>
              Schedule Training Call
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesAgentHelpSection;